import React from "react";

const NotFound = () => (
  <div
    style={{
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "#292a2bff",
      color: "#efe6e6ff",
    }}
  >
    <h1 style={{ fontSize: 80, margin: 0 }}>404</h1>
    <h2 style={{ margin: "16px 0" }}>Page Not Found</h2>
    <p style={{ marginBottom: 24 }}>
      Sorry, the page you are looking for does not exist.
    </p>
    <a
      href="/"
      style={{
        background: "#1976d2",
        color: "#fff",
        padding: "10px 24px",
        borderRadius: 6,
        textDecoration: "none",
        fontWeight: 600,
      }}
    >
      Go Home
    </a>
  </div>
);

export default NotFound;
