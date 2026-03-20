import React, { useState } from "react";
import { toast } from "sonner";

const AddCustomer = ({ onClose, defaultType = "customer", isShop = true }) => {
  const [data, setData] = useState({ name: "", phone: "" });
  const [contactType, setContactType] = useState(defaultType);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/customer/addcustomer`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...data, contactType }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message);
      toast.success(resData.message);
      onClose();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="card" style={{ padding: 16 }}>
      <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 14, marginBottom: 12 }}>
        Add New {contactType === "supplier" ? "Supplier" : "Customer"}
      </div>

      {isShop && (
        <div className="tab-bar" style={{ marginBottom: 12 }}>
          <button type="button" className={`tab-item ${contactType === "customer" ? "active" : ""}`} onClick={() => setContactType("customer")}>Customer</button>
          <button type="button" className={`tab-item ${contactType === "supplier" ? "active" : ""}`} onClick={() => setContactType("supplier")}>Supplier</button>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <input className="input" required placeholder="Full name *" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
        <input className="input" type="number" placeholder="Phone number (optional)" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 2, padding: "10px" }}>Add {contactType === "supplier" ? "Supplier" : "Customer"}</button>
          <button type="button" className="btn btn-ghost" onClick={onClose} style={{ flex: 1, padding: "10px" }}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddCustomer;
