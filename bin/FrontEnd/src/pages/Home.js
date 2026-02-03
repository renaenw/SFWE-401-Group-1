import React, { useState } from "react";
import "../pages/styles/Home.css";
function Home() {
  const [page, setPage] = useState("menu"); // menu | login | create

  // --- Forms ---
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  return (
    <div className="home-page-wrap">
      {page === "menu" && (
        <>
          <h2 className = "homepage">Home Page</h2>
          <p>Welcome to the demo of Scholar Cats</p> 
          <p>Welcome! Please pick a role or a page to get started:</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "2rem" }}>
            <button onClick={() => setPage("login")} className="home-button">
              Login
            </button>

            <button onClick={() => setPage("create")} className="home-button">
              Create Profile
            </button>
          </div>
        </>
      )}

      {/* LOGIN PAGE */}
      {page === "login" && (
        <div className="auth-view">
          <h2>Login</h2>

          <form className="home-form">
            <label>Email</label>
            <input
              type="email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
            />

            <button type="submit" className="home-button">Login</button>
          </form>

          <button onClick={() => setPage("menu")} className="back-button">
            Back
          </button>
        </div>
      )}

      {/* CREATE PROFILE PAGE */}
      {page === "create" && (
        <div className="auth-view">
          <h2>Create Profile</h2>

          <form className="home-form">
            <label>Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />

            <label>Email</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />

            <label>Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button type="submit" className="home-button">
              Create Profile
            </button>
          </form>

          <button onClick={() => setPage("menu")} className="back-button">
            Back
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
