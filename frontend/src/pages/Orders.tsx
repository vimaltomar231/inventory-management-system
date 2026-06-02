import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

type Customer = {
  id: number;
  full_name: string;
};

type Product = {
  id: number;
  name: string;
  stock: number;
  price: number;
};

type Order = {
  id: number;
  customer_id: number;
  total_amount: number;
};

type OrderItem = {
  product_id: number;
  quantity: number;
};

function Orders() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState<OrderItem[]>([
    {
      product_id: 0,
      quantity: 1,
    },
  ]);

  const [message, setMessage] = useState("");

  // Load data
  const fetchData = async () => {
    try {
      const [
        customersRes,
        productsRes,
        ordersRes,
      ] = await Promise.all([
        api.get("/customers"),
        api.get("/products"),
        api.get("/orders"),
      ]);

      setCustomers(customersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Add row
  const addProductRow = () => {
    setItems([
      ...items,
      {
        product_id: 0,
        quantity: 1,
      },
    ]);
  };

  // Change product
  const handleItemChange = (
    index: number,
    field: string,
    value: number
  ) => {
    const updatedItems = [...items];

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    };

    setItems(updatedItems);
  };

  // Calculate total
  const calculateTotal = () => {
    let total = 0;

    items.forEach((item) => {
      const product = products.find(
        (p) => p.id === item.product_id
      );

      if (product) {
        total +=
          product.price *
          item.quantity;
      }
    });

    return total;
  };

  // Create order
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      await api.post("/orders", {
        customer_id: Number(customerId),
        items,
      });

      setMessage(
        "Order created successfully"
      );

      setCustomerId("");

      setItems([
        {
          product_id: 0,
          quantity: 1,
        },
      ]);

      fetchData();
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail ||
          "Failed to create order"
      );
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Order Management
      </h1>

      {message && (
        <div className="bg-green-100 p-3 rounded mb-4">
          {message}
        </div>
      )}

      {/* Create Order */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          Create Order
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Customer */}
          <select
            value={customerId}
            onChange={(e) =>
              setCustomerId(e.target.value)
            }
            required
            className="border p-3 rounded w-full mb-4"
          >
            <option value="">
              Select Customer
            </option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.full_name}
              </option>
            ))}
          </select>

          {/* Product rows */}
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4"
            >
              <select
                value={item.product_id}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "product_id",
                    Number(e.target.value)
                  )
                }
                className="border p-3 rounded"
                required
              >
                <option value={0}>
                  Select Product
                </option>

                {products.map((product) => (
                  <option
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                    {" | Stock: "}
                    {product.stock}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(
                    index,
                    "quantity",
                    Number(e.target.value)
                  )
                }
                className="border p-3 rounded"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addProductRow}
            className="bg-gray-500 text-white px-4 py-2 rounded mb-4"
          >
            Add Product
          </button>

          <div className="font-bold mb-4">
            Total Amount: ₹
            {calculateTotal()}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded"
          >
            Create Order
          </button>
        </form>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left">
                Order ID
              </th>

              <th>Customer ID</th>

              <th>Total Amount</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-t"
              >
                <td className="p-4">
                  #{order.id}
                </td>

                <td>
                  {order.customer_id}
                </td>

                <td>
                  ₹{order.total_amount}
                </td>

                <td>
                  <Link
                    to={`/orders/${order.id}`}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Orders;