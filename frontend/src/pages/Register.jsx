import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const steps = ["Account Type", "Your Details", "Set Password"];

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState("shopkeeper");
  const [data, setData] = useState({ name: "", phone: "", email: "", password: "", shopName: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const validateStep1 = () => {
    if (!data.name.trim()) return "Full name is required.";
    if (!data.phone.trim() || !/^\d{10}$/.test(data.phone.trim())) return "Enter a valid 10-digit phone number.";
    if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) return "Enter a valid email address.";
    return null;
  };

  const handleSubmit = async () => {
    if (!data.password || data.password.length < 8) return toast.error("Password must be at least 8 characters.");
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, accountType }),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Registration failed.");
      toast.success("Account created. Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F8FAFC" }}>

      {/* Left panel */}
      <div style={{ flex: 1, background: "linear-gradient(160deg, #003D2B 0%, #005C3F 50%, #00875A 100%)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "56px 48px" }}>
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 52 }}>
          <div style={{ width: 38, height: 38, background: "rgba(255,255,255,0.18)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 19, color: "#fff" }}>H</div>
          <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 19, color: "#fff" }}>HisabKitab</span>
        </div>
        <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 32, color: "#fff", lineHeight: 1.2, marginBottom: 12 }}>Create your account</h2>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 14, lineHeight: 1.75, marginBottom: 44 }}>Free to use. No credit card required.</p>

        {/* Step tracker */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {steps.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                background: i < step ? "#A7F3D0" : i === step ? "#fff" : "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 700,
                color: i < step ? "#003D2B" : i === step ? "#003D2B" : "rgba(255,255,255,0.45)",
                transition: "all 0.2s",
              }}>
                {i < step ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 13, fontWeight: i === step ? 600 : 400, color: i <= step ? "#fff" : "rgba(255,255,255,0.45)", transition: "all 0.2s" }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ width: "100%", maxWidth: 460, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px" }}>
        <h1 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 23, color: "#101828", marginBottom: 4 }}>{steps[step]}</h1>
        <p style={{ color: "#667085", fontSize: 13, marginBottom: 28 }}>
          Step {step + 1} of {steps.length}
          {step === 0 && <> · Already registered?{" "}
            <button onClick={() => navigate("/login")} style={{ color: "#00875A", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>Sign in</button>
          </>}
        </p>

        {/* Step 0: Account Type */}
        {step === 0 && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { type: "shopkeeper", title: "Shop Owner / Business", desc: "For retail stores, pharmacies, wholesale dealers, or any business with customers and suppliers." },
              { type: "user", title: "Individual", desc: "For tracking personal loans, informal credit, or any money exchanged between people." },
            ].map(({ type, title, desc }) => (
              <div
                key={type}
                onClick={() => setAccountType(type)}
                style={{ padding: "16px 18px", border: `2px solid ${accountType === type ? "#00875A" : "#E4E7EC"}`, borderRadius: 12, cursor: "pointer", background: accountType === type ? "#E3FBF4" : "#fff", transition: "all 0.15s" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "#101828", marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 13, color: "#667085", lineHeight: 1.55 }}>{desc}</div>
                  </div>
                  <div style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${accountType === type ? "#00875A" : "#D0D5DD"}`, background: accountType === type ? "#00875A" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                    {accountType === type && <span style={{ color: "#fff", fontSize: 11 }}>✓</span>}
                  </div>
                </div>
              </div>
            ))}
            <button className="btn btn-primary" onClick={() => setStep(1)} style={{ width: "100%", padding: "12px", marginTop: 4 }}>Continue</button>
          </div>
        )}

        {/* Step 1: Details */}
        {step === 1 && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Full Name *</label>
              <input className="input" placeholder="e.g. Ramesh Kumar" autoComplete="name" value={data.name} onChange={e => setData({ ...data, name: e.target.value })} />
            </div>
            {accountType === "shopkeeper" && (
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Business / Shop Name <span style={{ fontWeight: 400, color: "#98A2B3" }}>(optional)</span></label>
                <input className="input" placeholder="e.g. Sharma General Store" value={data.shopName} onChange={e => setData({ ...data, shopName: e.target.value })} />
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Phone Number *</label>
              <input className="input" type="tel" placeholder="10-digit mobile number" autoComplete="tel" value={data.phone} onChange={e => setData({ ...data, phone: e.target.value })} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Email Address *</label>
              <input className="input" type="email" placeholder="you@example.com" autoComplete="email" value={data.email} onChange={e => setData({ ...data, email: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button className="btn btn-ghost" onClick={() => setStep(0)} style={{ flex: 1, padding: "11px" }}>Back</button>
              <button className="btn btn-primary" onClick={() => { const err = validateStep1(); if (err) return toast.error(err); setStep(2); }} style={{ flex: 2, padding: "11px" }}>Continue</button>
            </div>
          </div>
        )}

        {/* Step 2: Password */}
        {step === 2 && (
          <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Create Password *</label>
              <div style={{ position: "relative" }}>
                <input
                  className="input"
                  type={showPass ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  value={data.password}
                  onChange={e => setData({ ...data, password: e.target.value })}
                  style={{ paddingRight: 52 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#667085", fontSize: 13, fontWeight: 600 }} tabIndex={-1}>
                  {showPass ? "Hide" : "Show"}
                </button>
              </div>
              {data.password && data.password.length < 8 && (
                <p style={{ fontSize: 12, color: "#D92D20", marginTop: 5 }}>Password must be at least 8 characters.</p>
              )}
            </div>

            {/* Summary */}
            <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "14px 16px", border: "1px solid #E4E7EC" }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#344054", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.04em" }}>Review your details</div>
              {[
                ["Account type", accountType === "shopkeeper" ? "Shop Owner" : "Individual"],
                ["Name", data.name],
                ...(data.shopName ? [["Business name", data.shopName]] : []),
                ["Phone", data.phone],
                ["Email", data.email],
              ].map(([label, val]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 5 }}>
                  <span style={{ color: "#667085" }}>{label}</span>
                  <span style={{ color: "#101828", fontWeight: 500 }}>{val}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1, padding: "11px" }}>Back</button>
              <button
                className="btn btn-primary"
                disabled={loading || !data.password || data.password.length < 8}
                onClick={handleSubmit}
                style={{ flex: 2, padding: "11px", opacity: loading || !data.password || data.password.length < 8 ? 0.55 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "Creating account..." : "Create Account"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
