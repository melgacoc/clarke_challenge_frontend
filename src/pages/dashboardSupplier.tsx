import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_SUPPLIER_DETAILS, UPDATE_SUPPLIER, GET_CONTRACTS_BY_SUPPLIER_ID } from "../services/queries";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SupplierDashboard() {
  const [isEditing, setIsEditing] = useState(false);
  const [costPerKwh, setCostPerKwh] = useState("");
  const [minKwhLimit, setMinKwhLimit] = useState("");
  const [totalClients, setTotalClients] = useState("");
  const [supplier, setSupplier] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  const supplierId = JSON.parse(localStorage.getItem("authToken") || "{}").id;

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
      setSupplier(supplierData.getSupplierById);
      setCostPerKwh(supplierData.getSupplierById.cost_per_kWh);
      setMinKwhLimit(supplierData.getSupplierById.min_kWh_limit);
      setTotalClients(supplierData.getSupplierById.total_clients);
    }
  }, [supplierData]);

  const handleUpdateSupplier = () => {
    const variables = {
      supplier_id: supplierId,
      input: {
        cost_per_kWh: parseFloat(costPerKwh),
        min_kWh_limit: parseFloat(minKwhLimit),
        total_clients: parseInt(totalClients, 10),
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
      window.location.href = "/auth";
    }
  };

  if (!supplier) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
        <Button onClick={handleLogout} className="bg-red-600 text-white">
          Logout
        </Button>
      </header>
      {!isEditing ? (
        <div>
          <img src={supplier.logo} alt={`${supplier.name} logo`} className="mb-4" />
          <p><strong>Name:</strong> {supplier.name}</p>
          <p><strong>Email:</strong> {supplier.email}</p>
          <p><strong>State Origin:</strong> {supplier.state_origin}</p>
          <p><strong>Cost per kWh:</strong> {supplier.cost_per_kWh}</p>
          <p><strong>Min kWh Limit:</strong> {supplier.min_kWh_limit}</p>
          <p><strong>Total Clients:</strong> {supplier.total_clients}</p>
          <p><strong>Average Rating:</strong> {supplier.avg_rating}</p>
          <Button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white mt-2">
            Editar
          </Button>
          <h2 className="text-xl font-bold mt-4">Contracts</h2>
          <ul>
            {contractsData?.getAllContractsBySupplierId.map((contract) => (
              <li key={contract.id} className="mb-2">
                <p><strong>Client ID:</strong> {contract.user_id}</p>
                <p><strong>Start Date:</strong> {new Date(contract.created_at).toLocaleDateString()}</p>
                <p><strong>Cost per kWh:</strong> {contract.cost_per_kWh}</p>
                <p><strong>kWh per Month:</strong> {contract.user_kWh_month}</p>
                <p><strong>Active:</strong> {contract.isActive ? "Yes" : "No"}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between mt-4">
            <Button onClick={handlePreviousPage} disabled={page === 1} className="bg-gray-600 text-white">
              Página Anterior
            </Button>
            <Button onClick={handleNextPage} disabled={contractsData?.getAllContractsBySupplierId.length < 12} className="bg-gray-600 text-white">
              Próxima Página
            </Button>
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