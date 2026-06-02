import { useEffect, useState } from "react";
import api from "../services/api";

type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
};

function Products() {
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    price: "",
    stock: "",
  });

  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle Input Change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Add or Update Product
  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        sku: formData.sku,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (editingId) {
        await api.put(
          `/products/${editingId}`,
          payload
        );

        setMessage(
          "Product updated successfully"
        );
      } else {
        await api.post(
          "/products",
          payload
        );

        setMessage(
          "Product added successfully"
        );
      }

      setFormData({
        name: "",
        sku: "",
        price: "",
        stock: "",
      });

      setEditingId(null);

      fetchProducts();
    } catch (error: any) {
      setMessage(
        error.response?.data?.detail ||
          "Something went wrong"
      );
    }
  };

  // Edit Product
  const handleEdit = (
    product: Product
  ) => {
    setEditingId(product.id);

    setFormData({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      stock: String(product.stock),
    });
  };

  // Delete Product
  const handleDelete = async (
    id: number
  ) => {
    const confirmDelete = window.confirm(
      "Delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);

      setMessage(
        "Product deleted successfully"
      );

      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        Product Management
      </h1>

      {message && (
        <div className="bg-green-100 p-3 rounded mb-4">
          {message}
        </div>
      )}

      {/* Form */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingId
            ? "Update Product"
            : "Add Product"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

          <input
            type="text"
            name="sku"
            placeholder="SKU"
            value={formData.sku}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock Quantity"
            value={formData.stock}
            onChange={handleChange}
            required
            className="border p-3 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded"
          >
            {editingId
              ? "Update Product"
              : "Add Product"}
          </button>
        </form>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4 text-left">
                Name
              </th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t"
              >
                <td className="p-4">
                  {product.name}
                </td>

                <td>{product.sku}</td>

                <td>₹{product.price}</td>

                <td>{product.stock}</td>

                <td className="space-x-2">
                  <button
                    onClick={() =>
                      handleEdit(product)
                    }
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(product.id)
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

export default Products;