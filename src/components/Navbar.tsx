import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 bg-slate-950/95 backdrop-blur text-white px-4 py-3 shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 z-50">
      <div className="flex items-center justify-between">
        <Link
          to="/"
          className="text-xl font-extrabold tracking-tight text-blue-200 hover:text-white mr-8"
        >
          Bug Tracker
        </Link>
      </div>

      {/* Main nav links */}
      <div className="flex flex-1 flex-wrap items-center gap-x-4 gap-y-2 text-sm font-medium min-w-0">
        {user && (
          <>
            <Link to="/" className="hover:text-blue-400 transition-colors">
              Home
            </Link>
            <Link to="/projects" className="hover:text-blue-400 transition-colors">
              Projects
            </Link>
          </>
        )}
      </div>

      {/* Right-side user section */}
      {user && (
        <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
          <div className="rounded bg-blue-950/30 px-3 py-1 text-xs md:text-sm font-semibold text-blue-300 max-w-[140px] truncate">
            {user.name || user.email || "User"}
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-xs md:text-sm font-semibold transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
