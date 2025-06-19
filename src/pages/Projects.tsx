// src/pages/Projects.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

interface Project {
  _id: string;
  title: string;
  description: string;
  teamMembers: {
    _id: string;
    name: string;
    email: string;
  }[];
}

const Projects = () => {
  const { token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/projects`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(res.data)) {
          setProjects(res.data);
        } else {
          setProjects([]);
        }
      } catch (err) {
        console.error("Failed to fetch projects:", err);
        setError("Failed to load projects");
        setProjects([]);
      } finally {
        setLoading(false); // ✅ Fix: ensure this runs no matter what
      }
    };

    fetchProjects();
  }, [token]);


  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault(); // ✅ Prevent form reload

    if (!title || !description) return;

    try {
      const res = await axios.post(
        "/api/projects",
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Created:", res.data); // ✅ Move inside try

      setProjects((prev) => [...prev, res.data]);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error("Create project failed:", err);
      alert("Failed to create project");
    }
  };





  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      {/* Create new project */}
      <form
        onSubmit={handleCreate}
        className="mb-8 flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0"
      >
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 w-full sm:w-auto"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-700 w-full sm:w-auto"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full sm:w-auto"
        >
          Create Project
        </button>
      </form>

      {/* Project list */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project: any) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}`}
              className="block border border-gray-700 p-4 rounded bg-gray-800 hover:bg-gray-700 transition"
            >
              <h2 className="text-xl font-semibold mb-1">{project.title}</h2>
              <p className="text-gray-400 mb-2">{project.description}</p>
              <p className="text-sm text-gray-500">
                Members:{" "}
                {project.teamMembers?.map((m: any) => m.name).join(", ") || "No members"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

};

export default Projects;