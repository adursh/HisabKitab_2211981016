import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Settings = () => {
  const { user, fetchData, accountType } = useContext(UserContext);
  const navigate = useNavigate();
  const isShop = accountType === "shopkeeper";
  const [name, setName] = useState("");
  const [shopName, setShopName] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
    else fetchData();
  }, []);

  useEffect(() => {
    if (user) { setName(user.name || ""); setShopName(user.shopName || ""); }
  }, [user]);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/customer/updateprofile`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, shopName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Profile updated!");
      fetchData();
    } catch (err) { toast.error(err.message || "Update failed"); }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      <header style={{ background: isShop ? "#003D2B" : "#1E1B4B", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px", height: 56, display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 18 }}>←</button>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "Sora,sans-serif" }}>Settings</span>
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px" }}>

        {/* Profile */}
        <div className="card fade-up" style={{ padding: 20, marginBottom: 12 }}>
          <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 16 }}>Profile</div>
          <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: 14, background: isShop ? "#003D2B" : "#1E1B4B", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 22 }}>
              {user?.name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: "#101828" }}>{user?.name}</div>
              <div style={{ fontSize: 13, color: "#667085" }}>{user?.email}</div>
              <span className={`badge ${isShop ? "badge-green" : "badge-blue"}`} style={{ marginTop: 4 }}>{isShop ? "Shop Owner" : "Individual"}</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#344054", display: "block", marginBottom: 6 }}>Full Name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            {isShop && (
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#344054", display: "block", marginBottom: 6 }}>Shop / Business Name</label>
                <input className="input" value={shopName} onChange={e => setShopName(e.target.value)} />
              </div>
            )}
            <button className="btn btn-primary" onClick={handleSave} style={{ alignSelf: "flex-start", padding: "10px 20px" }}>Save Changes</button>
          </div>
        </div>

        {/* Account Info */}
        <div className="card fade-up stagger-1" style={{ padding: 20, marginBottom: 12 }}>
          <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Account Info</div>
          {[["Email", user?.email], ["Phone", user?.phone], ["Account Type", isShop ? "Shop Owner" : "Individual"], ["Member since", user?.date ? new Date(user.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—"]].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F9FAFB", fontSize: 14 }}>
              <span style={{ color: "#667085" }}>{label}</span>
              <span style={{ fontWeight: 600, color: "#101828" }}>{val || "—"}</span>
            </div>
          ))}
        </div>

        {/* Danger Zone */}
        <div className="card fade-up stagger-2" style={{ padding: 20 }}>
          <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 14, color: "#D92D20" }}>Sign Out</div>
          <button className="btn" onClick={() => { localStorage.clear(); navigate("/login"); }} style={{ background: "#FEF3F2", color: "#D92D20", border: "1px solid #FECACA", padding: "10px 20px" }}>
            Sign Out of HisabKitab
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
