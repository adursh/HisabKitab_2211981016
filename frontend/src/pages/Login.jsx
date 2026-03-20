import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.email.trim() || !data.password.trim()) {
      return toast.error("Please fill in all fields.");
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.message || "Login failed. Please try again.");
      localStorage.setItem("token", resData.token);
      localStorage.setItem("accountType", resData.accountType);
      toast.success("Signed in successfully.");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#F8FAFC" }}>

      {/* Left branding panel */}
      <div style={{ flex: 1, background: "linear-gradient(160deg, #003D2B 0%, #005C3F 50%, #00875A 100%)", display: "flex", flexDirection: "column", justifyContent: "center", padding: "56px 48px" }}>
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", marginBottom: 52 }}>
          <div style={{ width: 38, height: 38, background: "rgba(255,255,255,0.18)", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 19, color: "#fff" }}>H</div>
          <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 19, color: "#fff" }}>HisabKitab</span>
        </div>
        <h2 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 34, color: "#fff", lineHeight: 1.2, marginBottom: 14 }}>
          Your complete credit ledger, digitized.
        </h2>
        <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.75, marginBottom: 40 }}>
          Track receivables, manage payables, and maintain clear records for every transaction — all in one place.
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {["Customer & supplier management", "Transaction history with running balance", "Separate views for receivables & payables", "Secure, cloud-backed storage"].map(f => (
            <div key={f} style={{ display: "flex", alignItems: "center", gap: 10, color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
              <div style={{ width: 18, height: 18, background: "rgba(255,255,255,0.18)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, flexShrink: 0 }}>✓</div>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ width: "100%", maxWidth: 460, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 40px" }}>
        <div onClick={() => navigate("/")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 40 }}>
          <div style={{ width: 30, height: 30, background: "#00875A", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 15 }}>H</div>
          <span style={{ fontFamily: "Sora,sans-serif", fontWeight: 700, fontSize: 16, color: "#101828" }}>HisabKitab</span>
        </div>

        <h1 style={{ fontFamily: "Sora,sans-serif", fontWeight: 800, fontSize: 25, color: "#101828", marginBottom: 6 }}>Sign in to your account</h1>
        <p style={{ color: "#667085", fontSize: 14, marginBottom: 28 }}>
          Don't have an account?{" "}
          <button onClick={() => navigate("/register")} style={{ color: "#00875A", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            Register for free
          </button>
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Email address</label>
            <input
              className="input"
              type="email"
              placeholder="you@example.com"
              required
              autoComplete="email"
              value={data.email}
              onChange={e => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#344054", marginBottom: 6 }}>Password</label>
            <div style={{ position: "relative" }}>
              <input
                className="input"
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                value={data.password}
                onChange={e => setData({ ...data, password: e.target.value })}
                style={{ paddingRight: 44 }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#98A2B3", fontSize: 15, lineHeight: 1 }}
                tabIndex={-1}
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: "100%", padding: "12px", fontSize: 15, marginTop: 4, opacity: loading ? 0.65 : 1, cursor: loading ? "not-allowed" : "pointer" }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ fontSize: 12, color: "#98A2B3", textAlign: "center", marginTop: 28, lineHeight: 1.6 }}>
          By signing in you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
