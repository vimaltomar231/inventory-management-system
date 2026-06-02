import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

type OrderItem = {
  product_id: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
  };
};

type Order = {
  id: number;
  customer_id: number;
  total_amount: number;
  items: OrderItem[];
};

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] =
    useState<Order | null>(null);

  const [loading, setLoading] =
    useState(true);

  const fetchOrder = async () => {
    try {
      const response = await api.get(
        `/orders/${id}`
      );

      setOrder(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  if (loading) {
    return (
      <h2 className="text-xl">
        Loading...
      </h2>
    );
  }

  if (!order) {
    return (
      <h2 className="text-red-500">
        Order not found
      </h2>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Order Details
        </h1>

        <Link
          to="/orders"
          className="bg-gray-600 text-white px-4 py-2 rounded"
        >
          Back
        </Link>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          Order Summary
        </h2>

        <div className="space-y-2">
          <p>
            <strong>Order ID:</strong>
            {" "}
            #{order.id}
          </p>

          <p>
            <strong>
              Customer ID:
            </strong>
            {" "}
            {order.customer_id}
          </p>

          <p>
            <strong>
              Total Amount:
            </strong>
            {" "}
            ₹{order.total_amount}
          </p>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white shadow rounded overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left">
                Product
              </th>

              <th>Quantity</th>

              <th>Price</th>

              <th>Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map(
              (item, index) => (
                <tr
                  key={index}
                  className="border-t"
                >
                  <td className="p-4">
                    {
                      item.product.name
                    }
                  </td>

                  <td>
                    {item.quantity}
                  </td>

                  <td>
                    ₹{item.price}
                  </td>

                  <td>
                    ₹
                    {item.price *
                      item.quantity}
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderDetails;