import React from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CustomerView from "./pages/CustomerView";
import SupplierView from "./pages/SupplierView";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const App = () => (
  <div className="min-h-screen">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/customer/:id" element={<CustomerView />} />
      <Route path="/supplier/:id" element={<SupplierView />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
    <Toaster richColors position="top-center" />
  </div>
);

export default App;
