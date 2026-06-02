import { useEffect, useState } from "react";
import api from "../services/api";

type DashboardData = {
  total_products: number;
  total_customers: number;
  total_orders: number;
  low_stock_products: {
    id: number;
    name: string;
    stock: number;
  }[];
};

function Dashboard() {
  const [data, setData] =
    useState<DashboardData | null>(
      null
    );

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard =
    async () => {
      try {
        const response =
          await api.get(
            "/dashboard/summary"
          );

        console.log(
          "Dashboard Response:",
          response.data
        );

        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

  if (!data) {
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">
            Total Products
          </h2>

          <p className="text-4xl font-bold mt-4">
            {data.total_products}
          </p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">
            Total Customers
          </h2>

          <p className="text-4xl font-bold mt-4">
            {data.total_customers}
          </p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-lg font-semibold">
            Total Orders
          </h2>

          <p className="text-4xl font-bold mt-4">
            {data.total_orders}
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">
          Low Stock Products
        </h2>

        {data.low_stock_products
          .length === 0 ? (
          <p>
            No low stock products
          </p>
        ) : (
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left p-3">
                  Product
                </th>

                <th>
                  Remaining Stock
                </th>
              </tr>
            </thead>

            <tbody>
              {data.low_stock_products.map(
                (product) => (
                  <tr
                    key={product.id}
                    className="border-t"
                  >
                    <td className="p-3">
                      {product.name}
                    </td>

                    <td>
                      {product.stock}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default Dashboard;