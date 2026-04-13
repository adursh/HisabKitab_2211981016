import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import Transact from "../components/Transact";
import AddCustomer from "../components/AddCustomer";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, records, fetchData, setTransData, accountType } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("customers");
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showTransact, setShowTransact] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const isShop = accountType === "shopkeeper";
  const fmt = (n) => `₹${Math.abs(n).toLocaleString("en-IN")}`;

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
    else fetchData();
  }, []);

  // Build enriched list
  const allContacts = () => {
    if (!user?.customers) return [];
    return user.customers.map((c, i) => {
      const record = records[i];
      const isSupplier = record?.userId != user?.userId;
      const total = record?.totalAmount || 0;
      // positive total = Got money (I owe them), negative = Paid (they owe me)
      // For display: iOwe = total > 0 (I received = I owe), theyOwe = total < 0
      // For supplier: flip — supplier usually means I owe them by default
      const netFromMyPerspective = isSupplier ? -total : total;
      const iOwe = netFromMyPerspective > 0;   // I owe them (red)
      const theyOwe = netFromMyPerspective < 0; // They owe me (green)
      return { customer: c, record, isSupplier, total, iOwe, theyOwe };
    });
  };

  const getFilteredList = () => {
    return allContacts().filter(({ customer, isSupplier }) => {
      const matchSearch = customer.name.toLowerCase().includes(search.toLowerCase());
      if (activeTab === "customers") return matchSearch && !isSupplier;
      if (activeTab === "suppliers") return matchSearch && isSupplier;
      return matchSearch;
    });
  };

  // Section-level net summary
  const getSectionSummary = (tab) => {
    const list = allContacts().filter(({ isSupplier }) =>
      tab === "customers" ? !isSupplier : isSupplier
    );
    let youGet = 0, youPay = 0;
    list.forEach(({ total, isSupplier }) => {
      const net = isSupplier ? -total : total;
      if (net < 0) youGet += Math.abs(net); // they owe me
      else if (net > 0) youPay += net;       // I owe them
    });
    const netBalance = youGet - youPay;
    return { youGet, youPay, netBalance, count: list.length };
  };

  const handleTrans = (transType, customerName, customerId, isSupplier) => {
    setTransData({ transType, customerName, customerId, isSupplier });
    setShowTransact(true);
  };

  const custSummary = getSectionSummary("customers");
  const suppSummary = getSectionSummary("suppliers");
  const currentSummary = activeTab === "customers" ? custSummary : activeTab === "suppliers" ? suppSummary : null;

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <header style={{ background: isShop ? "#003D2B" : "#1E1B4B", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: "rgba(255,255,255,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontFamily: "Sora,sans-serif", fontSize: 16 }}>
              {user?.name?.[0]?.toUpperCase() || "H"}
            </div>
            <div>
              <div style={{ color: "#fff", fontWeight: 700, fontSize: 14, fontFamily: "Sora,sans-serif" }}>{user?.shopName || user?.name || "Dashboard"}</div>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>{isShop ? "Business Account" : "Personal Account"}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => navigate("/reports")} style={{ background: "rgba(255,255,255,0.12)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              Reports
            </button>
            <div style={{ position: "relative" }}>
              <button onClick={() => setShowMenu(!showMenu)} style={{ width: 34, height: 34, background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 16 }}>⋮</button>
              {showMenu && (
                <div className="scale-in" style={{ position: "absolute", right: 0, top: 40, background: "#fff", border: "1px solid #E4E7EC", borderRadius: 10, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", minWidth: 160, zIndex: 99, overflow: "hidden" }}>
                  {[
                    { label: "Settings", action: () => { navigate("/settings"); setShowMenu(false); } },
                    { label: "Sign Out", action: () => { localStorage.clear(); navigate("/login"); }, danger: true },
                  ].map(item => (
                    <button key={item.label} onClick={item.action} style={{ width: "100%", padding: "11px 16px", background: "none", border: "none", textAlign: "left", fontSize: 14, color: item.danger ? "#D92D20" : "#344054", cursor: "pointer", fontFamily: "DM Sans,sans-serif", fontWeight: 500 }}
                      onMouseEnter={e => e.currentTarget.style.background = "#F9FAFB"}
                      onMouseLeave={e => e.currentTarget.style.background = "none"}>
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 720, margin: "0 auto", width: "100%", padding: "16px 16px 100px" }}>

        {/* Tabs */}
        <div className="fade-up tab-bar" style={{ marginBottom: 0 }}>
          <button className={`tab-item ${activeTab === "customers" ? "active" : ""}`} onClick={() => setActiveTab("customers")}>
            Customers
            {user && <span style={{ marginLeft: 4, fontSize: 11, color: activeTab === "customers" ? "#101828" : "#98A2B3" }}>({custSummary.count})</span>}
          </button>
          <button className={`tab-item ${activeTab === "suppliers" ? "active" : ""}`} onClick={() => setActiveTab("suppliers")}>
            Suppliers
            {user && <span style={{ marginLeft: 4, fontSize: 11 }}>({suppSummary.count})</span>}
          </button>
          <button className={`tab-item ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>All</button>
        </div>

        {/* Section Net Summary — OkCredit style */}
        {currentSummary && user && (
          <div className="fade-up" style={{ background: "#fff", border: "1px solid #E4E7EC", borderTop: "none", borderRadius: "0 0 12px 12px", padding: "12px 16px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontSize: 11, color: "#667085", fontWeight: 600 }}>
                {currentSummary.count} Account{currentSummary.count !== 1 ? "s" : ""}
              </div>
              <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 2 }}>Net Balance</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 18, color: currentSummary.netBalance >= 0 ? "#00875A" : "#D92D20" }}>
                {fmt(currentSummary.netBalance)}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: currentSummary.netBalance >= 0 ? "#00875A" : "#D92D20" }}>
                {currentSummary.netBalance === 0 ? "All Settled" : currentSummary.netBalance > 0 ? "You Get" : "You Pay"}
              </div>
            </div>
          </div>
        )}

        {/* Search + Add */}
        <div className="fade-up stagger-1" style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <input className="input" style={{ flex: 1 }} placeholder={`Search ${activeTab}...`} value={search} onChange={e => setSearch(e.target.value)} />
          <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)} style={{ padding: "10px 16px", flexShrink: 0 }}>
            {showAdd ? "✕ Cancel" : `+ Add ${activeTab === "suppliers" ? "Supplier" : "Customer"}`}
          </button>
        </div>

        {/* Add Form */}
        {showAdd && (
          <div className="scale-in" style={{ marginBottom: 12 }}>
            <AddCustomer onClose={() => { setShowAdd(false); fetchData(); }} defaultType={activeTab === "suppliers" ? "supplier" : "customer"} isShop={isShop} />
          </div>
        )}

        {/* Empty state */}
        {getFilteredList().length === 0 && (
          <div className="card fade-up" style={{ padding: "40px 20px", textAlign: "center" }}>
            <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 16, color: "#344054", marginBottom: 6 }}>
              No {activeTab} yet
            </div>
            <div style={{ fontSize: 13, color: "#98A2B3" }}>Add your first {activeTab === "suppliers" ? "supplier" : "customer"} to get started.</div>
          </div>
        )}

        {/* Contact list */}
        {getFilteredList().map(({ customer, record, isSupplier, total, iOwe, theyOwe }, idx) => {
          const lastTrans = record?.lastTransact;
          return (
            <div key={customer._id} className="card fade-up" style={{ marginBottom: 8, animationDelay: `${idx * 0.04}s`, overflow: "hidden" }}>
              <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                {/* Avatar */}
                <div onClick={() => navigate(isSupplier ? `/supplier/${customer._id}?name=${customer.name}` : `/customer/${customer._id}?name=${customer.name}`)}
                  style={{ cursor: "pointer", width: 42, height: 42, borderRadius: 12, background: isSupplier ? "#EFF6FF" : "#E3FBF4", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 17, color: isSupplier ? "#1D4ED8" : "#00875A", flexShrink: 0 }}>
                  {customer.name[0].toUpperCase()}
                </div>

                {/* Name + last entry */}
                <div onClick={() => navigate(isSupplier ? `/supplier/${customer._id}?name=${customer.name}` : `/customer/${customer._id}?name=${customer.name}`)}
                  style={{ flex: 1, cursor: "pointer", minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#101828" }}>{customer.name}</span>
                    <span className={`badge ${isSupplier ? "badge-blue" : "badge-green"}`}>{isSupplier ? "Supplier" : "Customer"}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#98A2B3", marginTop: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {lastTrans ? `Last entry: ₹${Math.abs(lastTrans.amount).toLocaleString("en-IN")} · ${dayjs(lastTrans.date).format("D MMM")}` : "No transactions yet"}
                  </div>
                </div>

                {/* Balance + actions */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                  <div style={{ textAlign: "right", minWidth: 70 }}>
                    <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 15, color: theyOwe ? "#00875A" : iOwe ? "#D92D20" : "#98A2B3" }}>
                      {fmt(total)}
                    </div>
                    <div style={{ fontSize: 11, color: theyOwe ? "#00875A" : iOwe ? "#D92D20" : "#98A2B3", fontWeight: 600 }}>
                      {Math.abs(total) === 0 ? "Settled" : theyOwe ? "You Get" : "You Pay"}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <button onClick={() => handleTrans(1, customer.name, customer._id, isSupplier)}
                      style={{ background: "#E3FBF4", color: "#00875A", border: "none", borderRadius: 7, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                      + Got
                    </button>
                    <button onClick={() => handleTrans(0, customer.name, customer._id, isSupplier)}
                      style={{ background: "#FEF3F2", color: "#D92D20", border: "none", borderRadius: 7, padding: "5px 10px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                      − Paid
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showTransact && <Transact setShowTransact={setShowTransact} />}
    </div>
  );
};

export default Dashboard;
