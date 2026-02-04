// src/components/Navbar.jsx
import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Zap, User, LogOut, UserCircle2 } from "lucide-react";
import { useAuth } from "./AuthProvider";
import Dashboard from "./Dashboard";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showProfileSection, setShowProfileSection] = useState(false);

  const authCtx = useAuth();
  const user = authCtx?.user ?? null;
  const logout = authCtx?.logout ?? (() => {});
  const location = useLocation();
  const navigate = useNavigate();
  const profileRef = useRef(null);

  const toggleMenu = () => setIsOpen((v) => !v);

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setProfileOpen(false);
    setShowProfileSection(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const baseLink =
    "px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200";
  const inactive = "text-gray-700 hover:text-blue-600";
  const active = "text-blue-600 bg-blue-50";
  const navItemClass = ({ isActive }) =>
    `${baseLink} ${isActive ? active : inactive}`;

  return (
    <>
      {/* ─────────────── NAVBAR ─────────────── */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Logo + Navigation */}
            <div className="flex items-center">
              <NavLink
                to="/"
                className="flex-shrink-0 flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NeoResume
                </span>
              </NavLink>

              {/* Desktop Menu */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-2">
                  <NavLink to="/" className={navItemClass} end>
                    About
                  </NavLink>
                  <NavLink to="/analyze" className={navItemClass}>
                    Resume Analyze
                  </NavLink>
                  <NavLink to="/dashboard" className={navItemClass}>
                    Dashboard
                  </NavLink>
                </div>
              </div>
            </div>

            {/* Right side: Profile/Login (Desktop) */}
            <div className="hidden md:flex items-center">
              {!user ? (
                <NavLink
                  to="/login"
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  Login
                </NavLink>
              ) : (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen((v) => !v)}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200/70 hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-5 h-5 text-gray-700" />
                    <span className="text-sm text-gray-800 truncate max-w-[140px]">
                      {user.displayName || user.email}
                    </span>
                  </button>

                  {/* Dropdown */}
                  <div
                    className={`absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-md border border-gray-200/60 rounded-xl shadow-xl overflow-hidden transition-all duration-200 ${
                      profileOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    <div className="py-2">
                      <button
                        onClick={() => {
                          setShowProfileSection(true);
                          setProfileOpen(false);
                        }}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <UserCircle2 className="w-4 h-4" />
                        Profile
                      </button>
                    </div>
                    <div className="border-t border-gray-200/70" />
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Buttons */}
            <div className="md:hidden flex items-center">
              {user && (
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="mr-2 inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
                >
                  <User className="h-6 w-6" />
                </button>
              )}
              <button
                onClick={toggleMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* ─────────────── Mobile Dropdown Menu ─────────────── */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 shadow-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/"
                className={navItemClass}
                onClick={() => setIsOpen(false)}
              >
                About
              </NavLink>
              <NavLink
                to="/analyze"
                className={navItemClass}
                onClick={() => setIsOpen(false)}
              >
                Resume Analyze
              </NavLink>
              <NavLink
                to="/dashboard"
                className={navItemClass}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </NavLink>

              {!user ? (
                <NavLink
                  to="/login"
                  className="block w-full text-center mt-2 px-3 py-2 rounded-md text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </NavLink>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setShowProfileSection(true);
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <UserCircle2 className="w-4 h-4" />
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ─────────────── PROFILE SECTION ─────────────── */}
      {showProfileSection && user && (
        <div className="max-w-4xl mx-auto mt-10 bg-white border border-gray-200 rounded-xl shadow-lg p-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="w-20 h-20 rounded-full border"
              />
            ) : (
              <UserCircle2 className="w-20 h-20 text-gray-400" />
            )}
            <div>
              <h2 className="text-xl font-semibold text-gray-800">
                {user.displayName || "No Name"}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>
          </div>


          {/* Close Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowProfileSection(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
