import { useEffect, useState } from "react";
import api from "../services/api";

type Customer = {
  id: number;
  full_name: string;
  email: string;
  phone_number: string;
};

function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });

  const [message, setMessage] = useState("");

  const fetchCustomers = async () => {
    try {
      const response = await api.get("/customers");
      setCustomers(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await api.post("/customers", formData);

      setMessage("Customer added successfully");

      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
      });

      fetchCustomers();
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail ||
          "Something went wrong"
      );
    }
  };

  const handleDelete = async (
    id: number
  ) => {
    const confirmDelete = window.confirm(
      "Delete this customer?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/customers/${id}`);

      setMessage(
        "Customer deleted successfully"
      );

      fetchCustomers();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Customer Management
      </h1>

      {message && (
        <div className="bg-green-100 p-3 rounded mb-4">
          {message}
        </div>
      )}

      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Add Customer
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={formData.full_name}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={formData.phone_number}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded"
          >
            Add Customer
          </button>
        </form>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left">
                Name
              </th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-t"
              >
                <td className="p-4">
                  {customer.full_name}
                </td>

                <td>{customer.email}</td>

                <td>
                  {customer.phone_number}
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleDelete(customer.id)
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Customers;