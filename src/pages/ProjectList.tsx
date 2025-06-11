// src/pages/ProjectList.tsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

interface Project {
  _id: string;
  title: string;
  description: string;
  teamMembers: { _id: string; name: string; email: string }[];
}

const ProjectList = () => {
  const { token } = useContext(AuthContext);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/projects", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setProjects(res.data);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [token]);

  if (loading) return <p className="text-white">Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Your Projects</h1>
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project._id} className="bg-gray-800 p-4 rounded shadow">
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="text-gray-400">{project.description}</p>
              <div className="mt-2">
                <p className="text-sm text-gray-300 font-semibold">Team Members:</p>
                <ul className="ml-4 list-disc text-sm">
                  {project.teamMembers.map((member) => (
                    <li key={member._id}>{member.name} ({member.email})</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
