import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: "📒", title: "Digital Ledger", desc: "Replace paper records with a fast, cloud-synced digital ledger accessible from any device." },
  { icon: "👥", title: "Customers & Suppliers", desc: "Separate views for customers who owe you and suppliers you owe. Always know where you stand." },
  { icon: "📊", title: "Transaction History", desc: "Every entry is logged with date, amount, and notes. Full audit trail, always." },
  { icon: "🔔", title: "Running Balance", desc: "See the live running balance after every transaction. No mental math required." },
  { icon: "🔒", title: "Secure & Private", desc: "Your data is protected with JWT authentication and stored securely in the cloud." },
  { icon: "⚡", title: "Fast & Simple", desc: "Add an entry in under 5 seconds. Built for speed, not complexity." },
];

const Home = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/dashboard");
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>

      {/* Navbar */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: scrolled ? "rgba(255,255,255,0.96)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid #E4E7EC" : "1px solid transparent",
        transition: "all 0.2s ease", padding: "0 24px",
      }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, background: "#00875A", borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 17 }}>H</div>
            <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 19, color: "#101828" }}>HisabKitab</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button onClick={() => navigate("/login")} className="btn btn-ghost" style={{ fontSize: 14 }}>Sign In</button>
            <button onClick={() => navigate("/register")} className="btn btn-primary" style={{ fontSize: 14 }}>Get Started Free</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "linear-gradient(150deg, #003D2B 0%, #006644 50%, #00875A 100%)", padding: "88px 24px 96px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", width: 500, height: 500, borderRadius: "50%", background: "rgba(255,255,255,0.03)", top: -150, right: -100, pointerEvents: "none" }} />
        <div style={{ position: "absolute", width: 350, height: 350, borderRadius: "50%", background: "rgba(255,255,255,0.03)", bottom: -100, left: -80, pointerEvents: "none" }} />
        <div style={{ maxWidth: 640, margin: "0 auto", position: "relative" }}>
          <div className="fade-up" style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.12)", borderRadius: 99, padding: "5px 14px", marginBottom: 28, fontSize: 13, color: "#A7F3D0", fontWeight: 500, border: "1px solid rgba(255,255,255,0.15)" }}>
            Simple. Paperless. Secure.
          </div>
          <h1 className="fade-up stagger-1" style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: "clamp(30px, 5.5vw, 52px)", color: "#fff", lineHeight: 1.15, marginBottom: 20 }}>
            Your Digital<br />Credit Ledger
          </h1>
          <p className="fade-up stagger-2" style={{ fontSize: 17, color: "rgba(255,255,255,0.72)", lineHeight: 1.75, marginBottom: 36, maxWidth: 480, margin: "0 auto 36px" }}>
            Track what you're owed and what you owe. Manage customers and suppliers. Replace your paper records with a clean, digital ledger.
          </p>
          <div className="fade-up stagger-3" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/register")}
              style={{ background: "#fff", color: "#003D2B", border: "none", borderRadius: 10, padding: "13px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", fontFamily: "DM Sans, sans-serif", transition: "transform 0.15s, box-shadow 0.15s", boxShadow: "0 4px 14px rgba(0,0,0,0.15)" }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.2)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.15)"; }}>
              Create Free Account
            </button>
            <button onClick={() => navigate("/login")}
              style={{ background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "13px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "DM Sans, sans-serif", transition: "all 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Two Personas */}
      <section style={{ padding: "72px 24px", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <h2 className="fade-up" style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 32, color: "#101828" }}>Built for Two Types of Users</h2>
          <p className="fade-up stagger-1" style={{ color: "#667085", fontSize: 15, marginTop: 10, maxWidth: 440, margin: "10px auto 0" }}>Whether you run a business or track personal credit, HisabKitab works for you.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div className="fade-up card stagger-1" style={{ padding: 28, borderTop: "3px solid #00875A" }}>
            <div style={{ width: 44, height: 44, background: "#E3FBF4", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>🏪</div>
            <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 18, color: "#101828", marginBottom: 8 }}>Shop Owners & Businesses</h3>
            <p style={{ color: "#667085", fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>Track credit given to customers and payments owed to suppliers. Know your net position at all times.</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, marginBottom: 22 }}>
              {["Customer credit management", "Supplier payment tracking", "Transaction history with notes", "Receivables vs payables summary"].map(f => (
                <li key={f} style={{ fontSize: 13, color: "#344054", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#00875A", fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate("/register")} className="btn btn-primary" style={{ width: "100%" }}>Register as Shop Owner</button>
          </div>

          <div className="fade-up card stagger-2" style={{ padding: 28, borderTop: "3px solid #1D4ED8" }}>
            <div style={{ width: 44, height: 44, background: "#EFF6FF", borderRadius: 11, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>👤</div>
            <h3 style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 18, color: "#101828", marginBottom: 8 }}>Individuals</h3>
            <p style={{ color: "#667085", fontSize: 13, lineHeight: 1.7, marginBottom: 18 }}>Track personal loans and informal credit between friends, family, or colleagues. Clear records, no disputes.</p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 7, marginBottom: 22 }}>
              {["Track money lent and borrowed", "Running balance per contact", "Add notes to every entry", "View full transaction history"].map(f => (
                <li key={f} style={{ fontSize: 13, color: "#344054", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#1D4ED8", fontWeight: 700, flexShrink: 0 }}>✓</span> {f}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate("/register")} className="btn" style={{ width: "100%", background: "#1D4ED8", color: "#fff", padding: "10px 18px" }}>Register as Individual</button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ background: "#F8FAFC", padding: "64px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <h2 className="fade-up" style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 32, color: "#101828" }}>Everything You Need</h2>
            <p className="fade-up stagger-1" style={{ color: "#667085", fontSize: 15, marginTop: 10 }}>Powerful where it matters. Simple everywhere else.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {features.map((f, i) => (
              <div key={i} className={`fade-up card stagger-${(i % 4) + 1}`} style={{ padding: 22 }}>
                <div style={{ fontSize: 26, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 14, color: "#101828", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#667085", lineHeight: 1.65 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 520, margin: "0 auto" }}>
          <h2 className="fade-up" style={{ fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 32, color: "#101828", marginBottom: 12 }}>Start Tracking Today</h2>
          <p className="fade-up stagger-1" style={{ color: "#667085", fontSize: 15, marginBottom: 28 }}>Free to use. No credit card required. Takes 2 minutes to set up.</p>
          <button className="fade-up stagger-2 btn btn-primary" onClick={() => navigate("/register")} style={{ padding: "13px 32px", fontSize: 15 }}>
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #E4E7EC", padding: "20px 24px", textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 6 }}>
          <div style={{ width: 26, height: 26, background: "#00875A", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "Sora, sans-serif", fontWeight: 800, fontSize: 13 }}>H</div>
          <span style={{ fontFamily: "Sora, sans-serif", fontWeight: 700, fontSize: 14, color: "#101828" }}>HisabKitab</span>
        </div>
        <p style={{ fontSize: 12, color: "#98A2B3" }}>Simple. Paperless. Secure.</p>
      </footer>
    </div>
  );
};

export default Home;
