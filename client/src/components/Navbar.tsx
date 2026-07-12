import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Menu, X, LogOut, MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Logo from "./Logo";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-purple-700" : "text-slate-600 hover:text-purple-700"
  }`;

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-30 glass border-b border-purple-100/60">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Logo size="sm" />

        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.to} to={link.to} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          {isAuthenticated && (
            <NavLink to="/chat" className={linkClass}>
              Chat
            </NavLink>
          )}

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">
                Hi, <span className="font-medium text-slate-700">{user?.name}</span>
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" aria-hidden="true" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-600 hover:text-purple-700 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-purple-700 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all"
              >
                Signup
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-purple-800 p-2 rounded-lg hover:bg-purple-50"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 pb-4 pt-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsMenuOpen(false)}
              className="px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
            >
              {link.label}
            </Link>
          ))}
          {isAuthenticated && (
            <Link
              to="/chat"
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-purple-700"
            >
              <MessageCircle className="w-4 h-4" /> Chat
            </Link>
          )}

          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 text-left"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-center border border-purple-200 text-purple-700 hover:bg-purple-50"
              >
                Login
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="px-3 py-2.5 rounded-xl text-sm font-medium text-center bg-gradient-to-r from-purple-700 to-purple-500 text-white"
              >
                Signup
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
