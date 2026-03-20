import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import dayjs from "dayjs";
import EditTransact from "../components/EditTransact";

const CustomerView = () => {
  const { id: customerId } = useParams();
  const location = useLocation();
  const customerName = new URLSearchParams(location.search).get("name") || "Customer";
  const { setTransData, accountType } = useContext(UserContext);
  const navigate = useNavigate();
  const [transacts, setTransacts] = useState([]);
  const [record, setRecord] = useState(null);
  const [isSupplier, setIsSupplier] = useState(false);
  const [editTrans, setEditTrans] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [transType, setTransType] = useState(1);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const isShop = accountType === "shopkeeper";

  const total = record?.totalAmount || 0;
  const displayNet = isSupplier ? -total : total;
  const theyOwe = displayNet < 0;
  const iOwe = displayNet > 0;

  const fmt = (n) => `₹${Math.abs(n).toLocaleString("en-IN")}`;

  const fetchTransacts = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transact/fetchalltransact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ customerId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setTransacts(data.trans);
      setRecord(data.record);
      setIsSupplier(data.record?.userId == customerId);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (err) { toast.error(err.message); }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
    else fetchTransacts();
  }, []);

  const handleAddTrans = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return toast.error("Enter a valid amount");
    setLoading(true);
    let amt = Number(amount);
    if (!isSupplier) { if (transType) amt = -Math.abs(amt); }
    else { if (!transType) amt = -Math.abs(amt); }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transact/addtransact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ amount: amt, note, customerId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Entry added!");
      setAmount(""); setNote(""); setShowAdd(false);
      fetchTransacts();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", background: "#F8FAFC" }}>

      {/* Header */}
      <header style={{ background: isShop ? "#003D2B" : "#1E1B4B", position: "sticky", top: 0, zIndex: 30 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "0 16px", height: 56, display: "flex", alignItems: "center", gap: 10 }}>
          <button onClick={() => navigate(-1)} style={{ width: 34, height: 34, background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
          <button onClick={() => navigate(1)} style={{ width: 34, height: 34, background: "rgba(255,255,255,0.12)", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>→</button>

          <div style={{ width: 34, height: 34, background: "rgba(255,255,255,0.15)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 15, fontFamily: "Sora,sans-serif" }}>
            {customerName[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{customerName}</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>Supplier · {transacts.length} transactions</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 16, color: theyOwe ? "#6EE7B7" : iOwe ? "#FCA5A5" : "rgba(255,255,255,0.5)" }}>{fmt(total)}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.55)" }}>{Math.abs(total) === 0 ? "Settled" : theyOwe ? "to receive" : "to pay"}</div>
          </div>
        </div>
      </header>

      {/* Balance Banner */}
      {Math.abs(total) > 0 && (
        <div style={{ background: theyOwe ? "#E3FBF4" : "#FEF3F2", borderBottom: `1px solid ${theyOwe ? "#A7F3D0" : "#FECACA"}`, padding: "10px 16px", textAlign: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: theyOwe ? "#00875A" : "#D92D20" }}>
            {theyOwe ? `${customerName} owes you ${fmt(total)}` : `You owe ${customerName} ${fmt(total)}`}
          </span>
        </div>
      )}

      {/* Transaction List */}
      <div style={{ flex: 1, overflow: "auto", maxWidth: 720, margin: "0 auto", width: "100%", padding: "12px 16px" }}>
        {transacts.length === 0 && (
          <div style={{ textAlign: "center", padding: "48px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 16, color: "#344054" }}>No transactions yet</div>
            <div style={{ fontSize: 13, color: "#98A2B3", marginTop: 6 }}>Add the first entry below.</div>
          </div>
        )}

        {transacts.map((t, i) => {
          const isMine = customerId !== t.userId?.toString();
          let tColor, tBg;
          if (isSupplier) { tColor = t.amount < 0 ? "#D92D20" : "#00875A"; tBg = t.amount < 0 ? "#FEF3F2" : "#E3FBF4"; }
          else { tColor = t.amount > 0 ? "#D92D20" : "#00875A"; tBg = t.amount > 0 ? "#FEF3F2" : "#E3FBF4"; }

          const addedBy = isMine ? "You" : customerName;
          const currDate = dayjs(t.date).format("D MMM YYYY");
          const prevDate = i === 0 ? null : dayjs(transacts[i - 1].date).format("D MMM YYYY");
          const runNet = isSupplier ? -t.totalAmount : t.totalAmount;

          return (
            <React.Fragment key={t._id}>
              {currDate !== prevDate && <div className="date-divider">{currDate}</div>}
              <div style={{ display: "flex", justifyContent: isMine ? "flex-start" : "flex-end", marginBottom: 8 }}>
                <div onClick={() => setEditTrans({ ...t, isSupplier, addedBy })} style={{ cursor: "pointer", background: tBg, borderRadius: 12, padding: "12px 14px", maxWidth: "72%", boxShadow: "0 1px 3px rgba(0,0,0,0.06)", borderLeft: `3px solid ${tColor}`, transition: "transform 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "none"}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: "#667085" }}>Added by {addedBy}</span>
                    <span style={{ fontSize: 11, color: "#98A2B3" }}>{dayjs(t.date).format("h:mm A")}</span>
                  </div>
                  <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 22, color: tColor, textDecoration: t.isDeleted ? "line-through" : "none", opacity: t.isDeleted ? 0.5 : 1 }}>
                    {fmt(t.amount)}
                  </div>
                  {t.note && <div style={{ fontSize: 12, color: "#475467", marginTop: 3 }}>{t.note}</div>}
                  <div style={{ fontSize: 11, color: "#98A2B3", marginTop: 6, paddingTop: 6, borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between" }}>
                    <span>Balance: <strong style={{ color: runNet < 0 ? "#00875A" : "#D92D20" }}>{fmt(t.totalAmount)}</strong></span>
                    {t.isDeleted && <span style={{ color: "#D92D20" }}>Deleted</span>}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Bottom Bar */}
      <div style={{ background: "#fff", borderTop: "1px solid #E4E7EC", position: "sticky", bottom: 0, maxWidth: 720, margin: "0 auto", width: "100%" }}>
        {showAdd ? (
          <form onSubmit={handleAddTrans} style={{ padding: "14px 16px" }}>
            {/* Type Toggle */}
            <div className="tab-bar" style={{ marginBottom: 10 }}>
              <button type="button" className={`tab-item ${transType === 1 ? "active" : ""}`} onClick={() => setTransType(1)} style={{ color: transType === 1 ? "#00875A" : "" }}>+ Got (Received)</button>
              <button type="button" className={`tab-item ${transType === 0 ? "active" : ""}`} onClick={() => setTransType(0)} style={{ color: transType === 0 ? "#D92D20" : "" }}>− Paid (Given)</button>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
              <div style={{ flex: 1, position: "relative" }}>
                <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontWeight: 800, color: transType === 1 ? "#00875A" : "#D92D20" }}>₹</span>
                <input autoFocus className="input" type="number" placeholder="0" value={amount} onChange={e => setAmount(e.target.value)} style={{ paddingLeft: 28, fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 20 }} />
              </div>
              <input className="input" type="text" placeholder="Note (optional)" value={note} onChange={e => setNote(e.target.value)} style={{ flex: 1 }} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit" disabled={loading} className="btn" style={{ flex: 2, padding: "11px", background: transType === 1 ? "#00875A" : "#D92D20", color: "#fff", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Saving..." : transType === 1 ? "✓ Confirm Received" : "✓ Confirm Paid"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => setShowAdd(false)} style={{ flex: 1, padding: "11px" }}>Cancel</button>
            </div>
          </form>
        ) : (
          <div style={{ padding: "12px 16px", display: "flex", gap: 10 }}>
            <button onClick={() => { setTransType(1); setShowAdd(true); }} className="btn" style={{ flex: 1, padding: "12px", background: "#00875A", color: "#fff", fontSize: 14 }}>
              + Got Money
            </button>
            <button onClick={() => { setTransType(0); setShowAdd(true); }} className="btn" style={{ flex: 1, padding: "12px", background: "#D92D20", color: "#fff", fontSize: 14 }}>
              − Paid Money
            </button>
          </div>
        )}
      </div>

      {/* Edit Sheet */}
      {editTrans && (
        <div className="overlay" onClick={() => setEditTrans(null)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <EditTransact trans={editTrans} onClose={() => setEditTrans(null)} onDone={() => { setEditTrans(null); fetchTransacts(); }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerView;
