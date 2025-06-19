import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: string; // <- add this
  teamMembers: { _id: string; name: string; email: string }[];
}

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token} = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // NEW STATE + INPUT
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [addError, setAddError] = useState("");
  const [addSuccess, setAddSuccess] = useState("");
  const [removeError, setRemoveError] = useState("");
  const [removeSuccess, setRemoveSuccess] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/projects/${id}`, {
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

  const handleAddMember = async () => {
    if (!newMemberEmail) return;
    setAddError("");
    setAddSuccess("");

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE}/api/projects/${project?._id}/add-member`,
        { email: newMemberEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject(res.data.project); // update team
      setNewMemberEmail("");
      setAddSuccess("Member added successfully!");
    } catch (err: any) {
      setAddError(err.response?.data?.message || "Failed to add member");
    }
  };

  const handleRemoveMember = async (userId: string) => {
    setRemoveError("");
    setRemoveSuccess("");

    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE}/api/projects/${project?._id}/remove-member`,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProject(res.data.project); // update state
      setRemoveSuccess("Member removed");
    } catch (err: any) {
      setRemoveError(err.response?.data?.message || "Failed to remove member");
    }
  };


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
            <li key={member._id} className="flex justify-between items-center">
              <span>
                {member.name} ({member.email})
              </span>
              <button
                onClick={() => handleRemoveMember(member._id)}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                Remove
              </button>
            </li>
          ))}

        </ul>

        {/* ADD MEMBER SECTION */}
        <div className="mt-4">
          <h3 className="font-semibold mb-1">Add Member by Email:</h3>
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              placeholder="Enter email"
              className="px-3 py-1 rounded bg-slate-800 text-white border border-slate-600 w-full max-w-xs"
            />
            <button
              onClick={handleAddMember}
              className="bg-green-600 px-3 py-1.5 rounded hover:bg-green-700"
            >
              Add
            </button>
          </div>
          {addSuccess && <p className="text-green-400 text-sm mt-1">{addSuccess}</p>}
          {addError && <p className="text-red-500 text-sm mt-1">{addError}</p>}
        </div>
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