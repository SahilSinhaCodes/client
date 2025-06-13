import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Project {
  _id: string;
  title: string;
  description: string;
  teamMembers: { _id: string; name: string; email: string }[];
}

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`/api/projects/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProject(res.data);
      } catch (err) {
        console.error("Failed to fetch project", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) return <p className="text-center">Loading project...</p>;
  if (!project) return <p className="text-center text-red-500">Project not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 bg-zinc-900 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-300 mb-4">{project.description}</p>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Team Members:</h2>
        <ul className="list-disc list-inside text-gray-300">
          {project.teamMembers.map((member) => (
            <li key={member._id}>
              {member.name} ({member.email})
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-4">
        <Link
          to={`/projects/${project._id}/tickets`}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          View Tickets
        </Link>
        <button
          onClick={() => navigate("/projects")}
          className="bg-gray-600 px-4 py-2 rounded hover:bg-gray-700"
        >
          Back to Projects
        </button>
      </div>
    </div>
  );
};

export default ProjectDetails;