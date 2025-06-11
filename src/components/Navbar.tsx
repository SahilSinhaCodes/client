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
    <nav className="bg-gray-800 text-white p-4 shadow-md flex justify-between items-center">
      <div className="flex items-center gap-6">
        <Link to="/" className="text-lg font-bold hover:text-gray-300">
          Bug Tracker
        </Link>
        {user && (
          <>
            <Link to="/" className="hover:text-gray-300 text-sm">
              Home
            </Link>
            <Link to="/projects" className="hover:text-gray-300 text-sm">
              Projects
            </Link>
          </>
        )}
      </div>

      {user && (
        <div className="flex items-center gap-4">
          {/*<span className="hidden sm:block text-sm text-gray-300">{user.name}</span>*/}
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
