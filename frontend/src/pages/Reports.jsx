import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const Reports = () => {
  const { user, records, fetchData, accountType } = useContext(UserContext);
  const navigate = useNavigate();
  const isShop = accountType === "shopkeeper";

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
    else fetchData();
  }, []);

  const fmt = n => `₹${Math.abs(n).toLocaleString("en-IN")}`;

  const toReceive = records.reduce((s, r) => {
    if (!r || !user) return s;
    const net = r.userId != user.userId ? -r.totalAmount : r.totalAmount;
    return net < 0 ? s + Math.abs(net) : s;
  }, 0);

  const toPay = records.reduce((s, r) => {
    if (!r || !user) return s;
    const net = r.userId != user.userId ? -r.totalAmount : r.totalAmount;
    return net > 0 ? s + net : s;
  }, 0);

  const topDebtors = user?.customers?.map((c, i) => {
    const r = records[i];
    if (!r) return null;
    const isSupplier = r.userId != user.userId;
    const net = isSupplier ? -r.totalAmount : r.totalAmount;
    return { name: c.name, amount: net, isSupplier };
  }).filter(Boolean).filter(x => x.amount < 0).sort((a, b) => a.amount - b.amount).slice(0, 5);

  const topCreditors = user?.customers?.map((c, i) => {
    const r = records[i];
    if (!r) return null;
    const isSupplier = r.userId != user.userId;
    const net = isSupplier ? -r.totalAmount : r.totalAmount;
    return { name: c.name, amount: net, isSupplier };
  }).filter(Boolean).filter(x => x.amount > 0).sort((a, b) => b.amount - a.amount).slice(0, 5);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC" }}>
      <header style={{ background: isShop ? "#003D2B" : "#1E1B4B", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px", height: 56, display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 18 }}>←</button>
          <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, fontFamily: "Sora,sans-serif" }}>Reports & Summary</div>
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "16px" }}>

        {/* Net Summary */}
        <div className="card fade-up" style={{ padding: 20, marginBottom: 14, background: "linear-gradient(135deg,#003D2B,#00875A)", border: "none" }}>
          <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600, marginBottom: 4 }}>NET BUSINESS BALANCE</div>
          <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 36, color: "#fff" }}>
            {toReceive >= toPay ? "+" : "−"}{fmt(toReceive - toPay)}
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>
            {toReceive >= toPay ? "Net positive — you'll receive more than you owe" : "Net negative — you owe more than you'll receive"}
          </div>
        </div>

        {/* 2 Tiles */}
        <div className="fade-up stagger-1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#00875A", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Total Receivable</div>
            <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 24, color: "#00875A" }}>{fmt(toReceive)}</div>
            <div style={{ fontSize: 12, color: "#98A2B3", marginTop: 4 }}>from {(topDebtors || []).length} contacts</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#D92D20", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.04em" }}>Total Payable</div>
            <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 24, color: "#D92D20" }}>{fmt(toPay)}</div>
            <div style={{ fontSize: 12, color: "#98A2B3", marginTop: 4 }}>to {(topCreditors || []).length} contacts</div>
          </div>
        </div>

        {/* Who Owes You */}
        {(topDebtors?.length > 0) && (
          <div className="card fade-up stagger-2" style={{ marginBottom: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #F2F4F7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 14, color: "#101828" }}>Who Owes You (Top 5)</span>
              <span className="badge badge-green">Receivable</span>
            </div>
            {topDebtors.map((d, i) => (
              <div key={i} style={{ padding: "12px 16px", borderBottom: i < topDebtors.length - 1 ? "1px solid #F9FAFB" : "none", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, background: "#E3FBF4", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora,sans-serif", fontWeight: 800, color: "#00875A", fontSize: 14 }}>{d.name[0].toUpperCase()}</div>
                <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{d.name}</span>
                <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, color: "#00875A" }}>{fmt(d.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Who You Owe */}
        {(topCreditors?.length > 0) && (
          <div className="card fade-up stagger-3" style={{ marginBottom: 14, overflow: "hidden" }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #F2F4F7", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 14, color: "#101828" }}>You Owe (Top 5)</span>
              <span className="badge badge-red">Payable</span>
            </div>
            {topCreditors.map((d, i) => (
              <div key={i} style={{ padding: "12px 16px", borderBottom: i < topCreditors.length - 1 ? "1px solid #F9FAFB" : "none", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, background: "#FEF3F2", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora,sans-serif", fontWeight: 800, color: "#D92D20", fontSize: 14 }}>{d.name[0].toUpperCase()}</div>
                <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{d.name}</span>
                <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, color: "#D92D20" }}>{fmt(d.amount)}</span>
              </div>
            ))}
          </div>
        )}

        {/* All Accounts Table */}
        <div className="card fade-up stagger-4" style={{ overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: "1px solid #F2F4F7" }}>
            <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 14, color: "#101828" }}>All Accounts</span>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F9FAFB" }}>
                  {["Name", "Type", "Balance", "Status"].map(h => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 12, fontWeight: 600, color: "#667085", borderBottom: "1px solid #F2F4F7" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {user?.customers?.map((c, i) => {
                  const r = records[i];
                  if (!r) return null;
                  const isSupplier = r.userId != user.userId;
                  const net = isSupplier ? -r.totalAmount : r.totalAmount;
                  const settled = Math.abs(r.totalAmount) === 0;
                  return (
                    <tr key={c._id} style={{ borderBottom: "1px solid #F9FAFB" }} onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                      <td style={{ padding: "11px 16px", fontWeight: 600, fontSize: 14 }}>{c.name}</td>
                      <td style={{ padding: "11px 16px" }}><span className={`badge ${isSupplier ? "badge-blue" : "badge-gray"}`}>{isSupplier ? "Supplier" : "Customer"}</span></td>
                      <td style={{ padding: "11px 16px", fontFamily: "Sora,sans-serif", fontWeight: 700, color: net < 0 ? "#00875A" : net > 0 ? "#D92D20" : "#98A2B3" }}>{fmt(r.totalAmount)}</td>
                      <td style={{ padding: "11px 16px" }}><span className={`badge ${settled ? "badge-gray" : net < 0 ? "badge-green" : "badge-red"}`}>{settled ? "Settled" : net < 0 ? "To Receive" : "To Pay"}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
