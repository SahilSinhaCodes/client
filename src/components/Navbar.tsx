import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Navbar = () => {
  const { logout, user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data.slice(0, 3));
      } catch (err) {
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (user && token) fetchProjects();
  }, [token, user]);

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  // Responsive styles for nav items
  // Stacks on mobile, row on desktop, no hamburger
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
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>

            {/* Projects dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                className={`flex items-center gap-1 focus:outline-none px-2 hover:text-blue-400 transition-colors ${
                  dropdownOpen ? "text-blue-400" : ""
                }`}
                onClick={() => setDropdownOpen((v) => !v)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 200)} // fallback
                aria-haspopup="true"
                aria-expanded={dropdownOpen}
              >
                Projects
                {/* Down chevron */}
                <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor" className="inline ml-0.5">
                  <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.061l3.71-3.83a.75.75 0 0 1 1.08 1.04l-4.24 4.38a.75.75 0 0 1-1.08 0l-4.24-4.38a.75.75 0 0 1 .02-1.06z" />
                </svg>
              </button>

              {/* Dropdown panel */}
              {dropdownOpen && (
                <div
                  className="absolute left-0 mt-1 min-w-[180px] bg-slate-900 border border-gray-700 rounded shadow-lg z-50 animate-fade-in"
                  tabIndex={-1}
                  role="menu"
                  onFocus={() => setDropdownOpen(true)}
                  onBlur={() => setDropdownOpen(false)}
                >
                  <div className="py-1 divide-y divide-gray-700">
                    {isLoading ? (
                      <div className="px-4 py-2 text-gray-400 animate-pulse">Loading...</div>
                    ) : projects.length > 0 ? (
                      <>
                        {projects.map((project) => (
                          <Link
                            key={project._id}
                            to={`/projects/${project._id}`}
                            className="block px-4 py-2 text-sm hover:bg-slate-800 transition-colors truncate"
                            onClick={() => setDropdownOpen(false)}
                            role="menuitem"
                          >
                            {project.title}
                          </Link>
                        ))}
                      </>
                    ) : (
                      <div className="px-4 py-2 text-gray-400">No recent projects.</div>
                    )}
                    <Link
                      to="/projects"
                      className="block px-4 py-2 text-blue-400 hover:bg-slate-800 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                      role="menuitem"
                    >
                      More...
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right-side user section */}
      {user && (
        <div className="flex items-center gap-3 shrink-0 mt-2 sm:mt-0">
          <div className="rounded bg-blue-950/30 px-3 py-1 text-xs md:text-sm font-semibold text-blue-300 max-w-[140px] truncate">
            {user.username || user.email || "User"}
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
