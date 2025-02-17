import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SUPPLIERS, GET_CONTRACTS_BY_USER_ID, CREATE_CONTRACT, DEACTIVATE_CONTRACT } from "../services/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Supplier = {
  id: string;
  name: string;
  min_kWh_limit: number;
};

type Contract = {
  id: string;
  supplier_name: string;
  user_kWh_month: number;
};

type AuthToken = {
  user_id: string;
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

  const authToken = localStorage.getItem("authToken");
  const userId = authToken ? (JSON.parse(authToken) as AuthToken).user_id : "";

  const { data: suppliersData, refetch: refetchSuppliers } = useQuery(GET_SUPPLIERS, {
    variables: { 
        minKwh: 0,
        page: page,
        limit: 12,
        user_id: userId,
     },
  });

  const { data: contractData, refetch: refetchContracts } = useQuery(GET_CONTRACTS_BY_USER_ID, {
    variables: { user_id: userId },
    skip: !userId,
  });

  const [createContract] = useMutation(CREATE_CONTRACT, {
    onCompleted: () => refetchContracts(),
  });

  const [deactivateContract] = useMutation(DEACTIVATE_CONTRACT, {
    onCompleted: () => refetchContracts(),
  });

  useEffect(() => {
    if (contractData && contractData.getAllContractsByUserId.length > 0) {
      setContract(contractData.getAllContractsByUserId[0]);
    }
  }, [contractData]);
  console.log(contractData);

  useEffect(() => {
    if (suppliersData && suppliersData.suppliers) {
      setFilteredSuppliers(suppliersData.suppliers);
    }
  }, [suppliersData]);

  const handleFilterSuppliers = () => {
    const kwhValue = kwh ? parseFloat(kwh) : 0;
    refetchSuppliers({ minKwh: kwhValue, page: page }).then(({ data }) => {
      if (data && data.suppliers) {
        setFilteredSuppliers(data.suppliers);
      } else {
        return;
      }
    });
  };

  const handleSignContract = (supplierId: string) => {
    if (kwh === null && !kwh && parseFloat(kwh) <= 0) {
        alert("Informe um valor válido para o consumo em kWh");
        return;
    }
    const variables = { input: {
        user_id: userId,
        supplier_id: supplierId,
        user_kWh_month: parseFloat(kwh),
    }}
    createContract({ variables });
  };

  const handleDeactivateContract = () => {
    if (contract) {
      deactivateContract({ variables: { id: contract.id } });
    }
  };

  const handleLogout = () => {
    if (confirm("Você tem certeza que deseja sair?")) {
      localStorage.clear();
      window.location.href = "/auth";
    }
  };

  const handleNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
        <Button onClick={handleLogout} className="bg-red-600 text-white">
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
            <Button onClick={handleFilterSuppliers} className="bg-blue-600 text-white">
                Buscar Fornecedores
            </Button>
        </div>
        <div className="mb-6">
            {contract ? (
                <div className="border p-4 rounded bg-green-100">
                    <h2 className="text-lg font-bold">Contrato Ativo</h2>
                    <p>Fornecedor: {contract.supplier_name}</p>
                    <p>Consumo: {contract.user_kWh_month} kWh</p>
                    <Button onClick={handleDeactivateContract} className="bg-red-600 text-white mt-2">
                        Desativar Contrato
                    </Button>
                </div>
            ) : (
                <p className="text-red-600">Nenhum contrato ativo</p>
            )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.map(supplier => (
                <div key={supplier.id} className="border p-4 rounded">
                    <h2 className="text-lg font-bold">{supplier.name}</h2>
                    <p>Min kWh: {supplier.min_kWh_limit}</p>
                    <Button 
                        onClick={() => handleSignContract(supplier.id)} 
                        className="bg-green-600 text-white mt-2"
                        disabled={!!contract}
                    >
                        Assinar Contrato
                    </Button>
                </div>
            ))}
        </div>
        <div className="flex justify-between mt-4">
            <Button onClick={handlePreviousPage} className="bg-gray-600 text-white" disabled={page === 1}>
                Página Anterior
            </Button>
            <Button onClick={handleNextPage} className="bg-gray-600 text-white">
                Próxima Página
            </Button>
        </div>
    </div>
  );
}