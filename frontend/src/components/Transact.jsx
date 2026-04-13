import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { toast } from "sonner";

const Transact = ({ setShowTransact }) => {
  const { transData, fetchData } = useContext(UserContext);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const isReceiving = transData.transType === 1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return toast.error("Enter a valid amount");
    setLoading(true);
    let amt = Number(amount);
    if (!transData.isSupplier) { if (!transData.transType) amt = -Math.abs(amt); }
    else { if (!transData.transType) amt = -Math.abs(amt); }

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transact/addtransact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ amount: amt, note, customerId: transData.customerId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Entry recorded!");
      setShowTransact(false);
      fetchData();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="overlay" onClick={() => setShowTransact(false)}>
      <div className="sheet" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 4 }}>
          {isReceiving ? "Record Payment Received" : "Record Payment Made"}
        </div>
        <div style={{ fontSize: 13, color: "#667085", marginBottom: 20 }}>
          {isReceiving ? `Got money from` : `Paid money to`} <strong>{transData.customerName}</strong>
        </div>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 22, color: isReceiving ? "#00875A" : "#D92D20" }}>₹</span>
            <input autoFocus className="input" type="number" placeholder="0.00" value={amount} onChange={e => setAmount(e.target.value)} style={{ paddingLeft: 36, fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 22, height: 56 }} />
          </div>
          <input className="input" type="text" placeholder="Add a note (optional)" value={note} onChange={e => setNote(e.target.value)} />
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={loading} className="btn" style={{ flex: 2, padding: "13px", background: isReceiving ? "#00875A" : "#D92D20", color: "#fff", fontSize: 15, opacity: loading ? 0.7 : 1 }}>
              {loading ? "Saving..." : isReceiving ? "✓ Confirm Received" : "✓ Confirm Paid"}
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => setShowTransact(false)} style={{ flex: 1, padding: "13px" }}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Transact;
