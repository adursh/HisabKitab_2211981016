import React, { useState } from "react";
import { toast } from "sonner";
import dayjs from "dayjs";

const EditTransact = ({ trans, onClose, onDone }) => {
  const [note, setNote] = useState(trans.note || "");
  const [loading, setLoading] = useState(false);

  let isGreen, label;
  if (trans.isSupplier) { isGreen = trans.amount > 0; label = trans.amount > 0 ? "Received" : "Paid"; }
  else { isGreen = trans.amount < 0; label = trans.amount < 0 ? "Received" : "Paid"; }

  const fmt = n => `₹${Math.abs(n).toLocaleString("en-IN")}`;

  const handleAction = async (isDeleted) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/transact/edittransact`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: JSON.stringify({ isDeleted, note, transactId: trans._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success(data.message);
      onDone();
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 16 }}>Transaction Details</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#98A2B3", cursor: "pointer", fontSize: 18 }}>✕</button>
      </div>

      <div style={{ background: isGreen ? "#E3FBF4" : "#FEF3F2", borderRadius: 12, padding: 16, marginBottom: 16, textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "#667085", marginBottom: 6 }}>Added by {trans.addedBy}</div>
        <div style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 32, color: isGreen ? "#00875A" : "#D92D20", textDecoration: trans.isDeleted ? "line-through" : "none", opacity: trans.isDeleted ? 0.5 : 1 }}>
          {fmt(trans.amount)}
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, color: isGreen ? "#00875A" : "#D92D20", marginBottom: 8 }}>{label}</div>
        <div style={{ fontSize: 12, color: "#667085" }}>
          Balance after: {fmt(trans.totalAmount)} · {dayjs(trans.date).format("D MMM YYYY, h:mm A")}
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#344054", display: "block", marginBottom: 6 }}>Note</label>
        <input className="input" value={note} onChange={e => setNote(e.target.value)} placeholder="Add or edit note" />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <button className="btn btn-primary" onClick={() => handleAction(false)} disabled={loading} style={{ flex: 2, padding: "11px" }}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
        {!trans.isDeleted && (
          <button className="btn" onClick={() => handleAction(true)} disabled={loading} style={{ flex: 1, padding: "11px", background: "#FEF3F2", color: "#D92D20", border: "1px solid #FECACA" }}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default EditTransact;
