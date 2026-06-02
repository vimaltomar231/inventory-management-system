import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md p-4">
          <div className="flex gap-6">
            <Link to="/">Dashboard</Link>
            <Link to="/products">Products</Link>
            <Link to="/customers">Customers</Link>
            <Link to="/orders">Orders</Link>
          </div>
        </nav>

        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;