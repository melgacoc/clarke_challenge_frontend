import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SUPPLIER_DETAILS, UPDATE_SUPPLIER, GET_CONTRACTS_BY_SUPPLIER_ID } from "../services/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Supplier = {
  logo: string;
  name: string;
  email: string;
  state_origin: string;
  cost_per_kWh: number;
  min_kWh_limit: number;
  total_clients: number;
  avg_rating: number;
};

type Contract = {
  user_id: string;
  user_name: string;
  created_at: string | number | Date;
  cost_per_kWh: number;
  isActive: any;
  id: string;
  supplier_name: string;
  user_kWh_month: number;
};

export default function SupplierDashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [costPerKwh, setCostPerKwh] = useState("");
  const [minKwhLimit, setMinKwhLimit] = useState("");
  const [totalClients, setTotalClients] = useState("");
  const [stateOrigin, setStateOrigin] = useState("");
  const [logo, setLogo] = useState("");
  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const authToken = localStorage.getItem("authToken");
  const supplierId = authToken ? JSON.parse(authToken).user_id : null;

  const { data: supplierData, refetch: refetchSupplier } = useQuery(GET_SUPPLIER_DETAILS, {
    variables: { id: supplierId },
    skip: !supplierId,
  });

  const { data: contractsData, refetch: refetchContracts } = useQuery(GET_CONTRACTS_BY_SUPPLIER_ID, {
    variables: { supplier_id: supplierId, page, limit },
    skip: !supplierId,
  });

  const [updateSupplier] = useMutation(UPDATE_SUPPLIER, {
    onCompleted: () => {
      refetchSupplier();
      refetchContracts();
      setIsEditing(false);
    },
  });

  useEffect(() => {
    if (supplierData && supplierData.getSupplierById) {
      const supplier = supplierData.getSupplierById;
      setSupplier(supplier);
      setCostPerKwh(supplier.cost_per_kWh ? supplier.cost_per_kWh.toString() : '');
      setMinKwhLimit(supplier.min_kWh_limit ? supplier.min_kWh_limit.toString() : '');
      setTotalClients(supplier.total_clients ? supplier.total_clients.toString() : '');
      setStateOrigin(supplier.state_origin ? supplier.state_origin : '');
      setLogo(supplier.logo ? supplier.logo : '');
    }
  }, [supplierData]);

  const handleUpdateSupplier = () => {
    const variables = {
      id: supplierId,
      input: {
        cost_per_kWh: parseFloat(costPerKwh),
        min_kWh_limit: parseFloat(minKwhLimit),
        total_clients: parseInt(totalClients, 10),
        state_origin: stateOrigin,
        logo,
      },
    };
    updateSupplier({ variables });
  };

  const handleNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleLogout = () => {
    if (confirm("Você tem certeza que deseja sair?")) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  if (!supplier) return <div>Loading...</div>;

  const hasContracts = contractsData?.getAllContractsBySupplierId?.length > 0;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard do Fornecedor</h1>
        <Button onClick={handleLogout} className="bg-red-600 text-white">
          Logout
        </Button>
      </header>
      {!isEditing ? (
        <div className="space-y-4">
          <div className="border p-6 rounded-lg shadow-md bg-white">
            <img src={supplier.logo} alt={`${supplier.name} logo`} className="mb-4" />
            <p><strong>Nome:</strong> {supplier.name}</p>
            <p><strong>Email:</strong> {supplier.email}</p>
            <p><strong>Estado:</strong> {supplier.state_origin}</p>
            <p><strong>Valor do kWh:</strong> {supplier.cost_per_kWh}</p>
            <p><strong>Min kWh Limit:</strong> {supplier.min_kWh_limit}</p>
            <p><strong>Total Clientes:</strong> {supplier.total_clients}</p>
            <p><strong>Avaliação:</strong> {supplier.avg_rating}</p>
            <Button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white mt-2">
              Editar
            </Button>
          </div>

          <div className="border p-6 rounded-lg shadow-md bg-white">
            <h2 className="text-xl font-bold mb-4">Contratos</h2>
            {hasContracts ? (
              <ul>
                {contractsData?.getAllContractsBySupplierId?.map((contract: Contract) => (
                  <li key={contract.id} className="mb-4">
                    <div className="border p-4 rounded-md shadow-sm bg-gray-50">
                      <p><strong>Cliente:</strong> {contract.user_name}</p>
                      <p><strong>Data ínicio:</strong> {new Date(contract.created_at).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}</p>
                      <p><strong>Valor do kWh:</strong> {contract.cost_per_kWh}</p>
                      <p><strong>kWh por mês:</strong> {contract.user_kWh_month}</p>
                      <p><strong>Plano ativo?:</strong> {contract.isActive ? "Sim" : "Não"}</p>
                    </div>
                  </li>
                ))} 
              </ul>
            ) : (
              <p className="text-gray-500">Não há contratos para exibir.</p>
            )}
            {hasContracts && (
              <div className="flex justify-between mt-4">
                <Button onClick={handlePreviousPage} disabled={page === 1} className="bg-gray-600 text-white">
                  Página Anterior
                </Button>
                <Button onClick={handleNextPage} disabled={contractsData?.getAllContractsBySupplierId?.length < 12} className="bg-gray-600 text-white">
                  Próxima Página
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <label className="block mb-2">
            Cost per kWh
            <Input
              type="number"
              placeholder="Cost per kWh"
              value={costPerKwh}
              onChange={(e) => setCostPerKwh(e.target.value)}
            />
          </label>
          <label className="block mb-2">
            Min kWh Limit
            <Input
              type="number"
              placeholder="Min kWh Limit"
              value={minKwhLimit}
              onChange={(e) => setMinKwhLimit(e.target.value)}
            />
          </label>
          <label className="block mb-2">
            Total Clients
            <Input
              type="number"
              placeholder="Total Clients"
              value={totalClients}
              onChange={(e) => setTotalClients(e.target.value)}
            />
          </label>
          <label className="block mb-2">
            Estado
            <Input
              type="text"
              placeholder="Estado de Origem"
              value={stateOrigin}
              onChange={(e) => setStateOrigin(e.target.value)}
            />
          </label>
          <label className="block mb-2">
            Logo
            <Input
              type="text"
              placeholder="Logo"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
            />
          </label>
          <Button onClick={handleUpdateSupplier} className="bg-green-600 text-white mt-2">
            Salvar
          </Button>
          <Button onClick={() => setIsEditing(false)} className="bg-red-600 text-white mt-2">
            Cancelar
          </Button>
        </div>
      )}
    </div>
  );
}