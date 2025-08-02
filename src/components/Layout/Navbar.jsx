import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          🌿 ArvyaX
        </Link>

        <div className="nav-menu">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`nav-link ${
                  location.pathname === "/dashboard" ? "active" : ""
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/my-sessions"
                className={`nav-link ${
                  location.pathname === "/my-sessions" ? "active" : ""
                }`}
              >
                My Sessions
              </Link>
              <Link
                to="/session-editor"
                className={`nav-link ${
                  location.pathname.includes("/session-editor") ? "active" : ""
                }`}
              >
                Create Session
              </Link>
              <div className="nav-user">
                <span>Welcome, {user.email}</span>
                <button onClick={logout} className="logout-btn">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className={`nav-link ${
                  location.pathname === "/login" ? "active" : ""
                }`}
              >
                Login
              </Link>
              <Link
                to="/register"
                className={`nav-link ${
                  location.pathname === "/register" ? "active" : ""
                }`}
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
