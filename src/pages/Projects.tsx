// src/pages/Projects.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const { user, token } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("/api/projects", {
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
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Projects</h1>

      {/* Create new project */}
      <form onSubmit={handleCreate} className="mb-6">
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="p-2 mr-2 rounded bg-gray-800 border border-gray-700"
        />
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="p-2 mr-2 rounded bg-gray-800 border border-gray-700"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
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
            <div
              key={project._id}
              className="border border-gray-700 p-4 rounded bg-gray-800"
            >
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="text-gray-400">{project.description}</p>
              <p className="text-sm mt-2">
                Members:{" "}
                {project.teamMembers?.map((m: any) => m.name).join(", ") || "No members"}

              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
