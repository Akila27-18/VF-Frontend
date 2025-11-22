import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";  // ✅ FIXED

export default function Header() {
  const navigate = useNavigate();
  const { token, logout } = useContext(AuthContext);
  const isLoggedIn = !!token;

  return (
    <header className="w-full py-4 border-b bg-orange-300 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
        {/* Logo + Title */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          
          {/* Replace the "V" with an image logo */}
          <img
            src="/logos/vlogo.png"   // ✅ Place vetri-logo.png inside public/
            alt="Vetri Logo"
            className="w-20 h-20 rounded-lg object-cover"
          />
          <div>
            <div className="font-bold">Finance</div>
            <div className="text-xs text-gray-500">
              Personal & Shared finance
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          <Link to="/" className="text-sm text-gray-700 hover:text-orange-500">
            Home
          </Link>
          {isLoggedIn && (
            <Link
              to="/dashboard"
              className="text-sm text-gray-700 hover:text-orange-500"
            >
              Dashboard
            </Link>
          )}
          {!isLoggedIn && (
            <Link
              to="/login"
              className="text-sm text-gray-700 hover:text-orange-500"
            >
              Login
            </Link>
          )}

          {!isLoggedIn ? (
            <button
              onClick={() => navigate("/get-started")}
              className="ml-4 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-orange-600"
            >
              Get Started
            </button>
          ) : (
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="ml-4 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm hover:bg-red-600"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}