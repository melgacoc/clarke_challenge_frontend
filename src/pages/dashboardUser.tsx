import { useState, useEffect } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import {
  GET_SUPPLIERS,
  GET_CONTRACTS_BY_USER_ID,
  CREATE_CONTRACT,
  DEACTIVATE_CONTRACT,
  CREATE_REVIEW,
} from "../services/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaStar } from "react-icons/fa";

type Supplier = {
  id: string;
  name: string;
  min_kWh_limit: number;
  avg_rating?: number;
  userReview?: { rating: number };
};

type Contract = {
  id: string;
  supplier_name: string;
  user_kWh_month: number;
  cost_per_kWh: number;
  created_at: string;
};

type AuthToken = {
  user_id: string;
  id: string;
  email: string;
  name: string;
  role: string;
  token: string;
};

export default function UserDashboard() {
  const [kwh, setKwh] = useState("");
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [contract, setContract] = useState<Contract | null>(null);
  const [page, setPage] = useState(1);
  const [ratings, setRatings] = useState<{ [key: string]: number }>({});

  const authToken = localStorage.getItem("authToken");
  const userId = authToken ? (JSON.parse(authToken) as AuthToken).id : "";

  const [createReview] = useMutation(CREATE_REVIEW);

  const { data: suppliersData, refetch: refetchSuppliers } = useQuery(
    GET_SUPPLIERS,
    {
      variables: { minKwh: 0, page, limit: 12, user_id: userId },
    }
  );

  const { data: contractData, refetch: refetchContracts } = useQuery(
    GET_CONTRACTS_BY_USER_ID,
    {
      variables: { user_id: userId },
      skip: !userId,
    }
  );

  const [createContract] = useMutation(CREATE_CONTRACT, {
    onCompleted: () => refetchContracts(),
  });

  const [deactivateContract] = useMutation(DEACTIVATE_CONTRACT, {
    onCompleted: () => refetchContracts(),
  });

  useEffect(() => {
    if (contractData?.getAllContractsByUserId.length > 0) {
      setContract(contractData.getAllContractsByUserId[0]);
    }
  }, [contractData]);

  useEffect(() => {
    if (suppliersData?.suppliers) {
      const updatedSuppliers = suppliersData.suppliers.map((supplier: Supplier) => {
        const userRating = supplier.userReview?.rating || 0;

        setRatings((prevRatings) => ({
          ...prevRatings,
          [supplier.id]: userRating,
        }));

        return {
          ...supplier,
          avg_rating: supplier.avg_rating || 0,
        };
      });

      setFilteredSuppliers(updatedSuppliers);
    }
  }, [suppliersData]);

  const handleStarClick = async (supplierId: string, rating: number) => {
    try {
      await createReview({
        variables: {
          createReviewInput: {
            user_id: userId,
            supplier_id: supplierId,
            rating,
          },
        },
      });

      setRatings((prevRatings) => ({
        ...prevRatings,
        [supplierId]: rating,
      }));
    } catch (error) {
      console.error("Erro ao criar avaliação:", error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
        <Button
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="bg-red-600 text-white"
        >
          Logout
        </Button>
      </header>

      <div className="mb-6 flex gap-2">
        <Input
          type="number"
          placeholder="Consumo em kWh"
          value={kwh}
          onChange={(e) => setKwh(e.target.value)}
        />
        <Button
          onClick={() =>
            refetchSuppliers({ minKwh: parseFloat(kwh) || 0, page })
          }
          className="bg-blue-600 text-white"
        >
          Buscar Fornecedores
        </Button>
      </div>

      <div className="mb-6">
        {contract ? (
          <div className="border p-4 rounded bg-green-100">
            <h2 className="text-lg font-bold">Contrato Ativo</h2>
            <p>Fornecedor: {contract.supplier_name}</p>
            <p>Consumo: {contract.user_kWh_month} kWh</p>
            <p>Custo por kWh: {contract.cost_per_kWh}</p>
            <p>Custo total: R$ {(contract.user_kWh_month * contract.cost_per_kWh).toFixed(2)}</p>
            <p>Data de Assinatura:{new Date(contract.created_at).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })}</p>
            <Button
              onClick={() =>
                deactivateContract({ variables: { id: contract.id } }).then(
                  () => setContract(null)
                )
              }
              className="bg-red-600 text-white mt-2"
            >
              Desativar Contrato
            </Button>
          </div>
        ) : (
          <p className="text-red-600">Nenhum contrato ativo</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier) => (
          <div key={supplier.id} className="border p-4 rounded">
            <h2 className="text-lg font-bold">{supplier.name}</h2>
            <p>Min kWh: {supplier.min_kWh_limit}</p>
            <div className="flex gap-1 my-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer transition-colors ${
                    star <= (ratings[supplier.id] || 0)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleStarClick(supplier.id, star)}
                  size={20}
                />
              ))}
            </div>

            <Button
              onClick={() =>
                createContract({
                  variables: {
                    input: {
                      user_id: userId,
                      supplier_id: supplier.id,
                      user_kWh_month: parseFloat(kwh),
                    },
                  },
                })
              }
              className="bg-green-600 text-white mt-2"
              disabled={!!contract}
            >
              Assinar Contrato
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-4">
        <Button
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
          className="bg-gray-600 text-white"
          disabled={page === 1}
        >
          Página Anterior
        </Button>
        <Button
          onClick={() => setPage((prev) => prev + 1)}
          className="bg-gray-600 text-white"
          disabled={suppliersData?.suppliers?.length < 12}
        >
          Próxima Página
        </Button>
      </div>
    </div>
  );
}
