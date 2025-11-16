import React from "react";

// A simple, accessible "Login with Google" page component.
// It uses a friendly card layout and an inline SVG Google icon so there's
// no external asset dependency. The button links to the server route
// that starts the OAuth flow (assumes your backend exposes `/auth/google`).

export default function Login() {
  const container = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #f6f9fc 0%, #e8eef8 100%)",
    fontFamily:
      "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    padding: "24px",
  };

  const card = {
    width: "100%",
    maxWidth: "440px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 6px 24px rgba(20,24,40,0.08)",
    padding: "36px",
    textAlign: "center",
  };

  const title = {
    margin: 0,
    marginBottom: "8px",
    fontSize: "20px",
    color: "#101828",
  };

  const subtitle = {
    marginTop: 0,
    marginBottom: "24px",
    fontSize: "14px",
    color: "#475569",
  };

  const googleBtn = {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    padding: "10px 16px",
    borderRadius: "8px",
    border: "1px solid rgba(16,24,40,0.08)",
    background: "#fff",
    color: "#111827",
    textDecoration: "none",
    fontWeight: 600,
    boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
    transition: "transform .08s ease, box-shadow .08s ease",
  };

  const googleIcon = {
    width: "20px",
    height: "20px",
    display: "inline-block",
  };
  

  
  return (
    <div style={container}>
      <div style={card}>
        <h1 style={title}>Welcome back</h1>
        <p style={subtitle}>Sign in to continue to your dashboard</p>

        <a
          href="http://localhost:3001/auth/google"
          aria-label="Sign in with Google"
          style={googleBtn}
          onMouseDown={(e) =>
            (e.currentTarget.style.transform = "translateY(1px)")
          }
          onMouseUp={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <span style={googleIcon} aria-hidden="true">
            {/* Google G icon - inline SVG */}
            <svg
              viewBox="0 0 533.5 544.3"
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
            >
              <path
                fill="#4285F4"
                d="M533.5 278.4c0-17.4-1.6-34.1-4.6-50.3H272v95.1h146.9c-6.3 34.1-25.5 62.9-54.6 82.2v68.2h88.2c51.6-47.5 81-117.5 81-195.2z"
              />
              <path
                fill="#34A853"
                d="M272 544.3c73.7 0 135.6-24.3 180.8-66.1l-88.2-68.2c-24.6 16.5-56.2 26.2-92.6 26.2-71 0-131.2-47.9-152.7-112.2H28.8v70.6C74 489.6 166.9 544.3 272 544.3z"
              />
              <path
                fill="#FBBC05"
                d="M119.3 327.9c-6.6-19.6-10.4-40.5-10.4-62s3.8-42.4 10.4-62V133.1H28.8C10.2 176.9 0 226.7 0 276.9s10.2 100 28.8 143.8l90.5-92.8z"
              />
              <path
                fill="#EA4335"
                d="M272 108.9c39.7 0 75.3 13.6 103.4 40.4l77.6-77.6C405.8 24.8 344 0 272 0 166.9 0 74 54.7 28.8 133.1l90.5 70.8C140.8 156.8 201 108.9 272 108.9z"
              />
            </svg>
          </span>

          <span>Sign in with Google</span>
        </a>

        <p style={{ marginTop: "18px", color: "#667085", fontSize: 13 }}>
          By continuing, you agree to our{" "}
          <a href="#" style={{ color: "#2563eb" }}>
            Terms
          </a>{" "}
          and{" "}
          <a href="#" style={{ color: "#2563eb" }}>
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}
