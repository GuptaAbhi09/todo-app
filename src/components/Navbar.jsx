import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout, continueAsGuest, isGuest } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="w-full flex justify-between items-center shadow-xl px-12 py-3 bg-white relative">
      {/* Logo */}
      <div
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <div className="w-8 h-8 rounded-full overflow-hidden shadow-md">
          <img
            src="https://deabethqbhuwfoyvgubr.supabase.co/storage/v1/object/sign/images/21846830_6537937.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV82MzViYzM4Ni1mYjJlLTQ5NjEtOWU0NC0yMGIyY2JlM2JlZTIiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJpbWFnZXMvMjE4NDY4MzBfNjUzNzkzNy5qcGciLCJpYXQiOjE3NTQzNjM3OTcsImV4cCI6MTgxNzQzNTc5N30.TdNbSnd5z6CfUlqo66rcFX7GvUiuWofNNRD79BIg-r0"
            alt="Logo"
          />
        </div>
        <p className="text-xl font-bold text-zinc-800">MyTask</p>
      </div>

      {/* Avatar / Auth */}
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full overflow-hidden cursor-pointer ring-2 ring-zinc-300 hover:ring-blue-400 transition-all duration-300"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img
            className="w-full h-full object-cover"
            src={
              user
                ? "https://ui-avatars.com/api/?name=" + user.email
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="Profile"
          />
        </div>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-60 bg-white shadow-lg rounded-lg border p-2 z-50">
            {!user && !isGuest ? (
              <>
                <Link
                  to="/login"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                  onClick={() => setMenuOpen(false)}
                >
                  Signup
                </Link>
                <button
                  onClick={() => {
                    continueAsGuest();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100 rounded"
                >
                  Continue as Guest
                </button>
              </>
            ) : (
              <>
                <p className="px-4 py-2 text-gray-600 text-sm border-b">
                  {isGuest ? "Guest User" : user?.email}
                </p>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100 rounded"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
