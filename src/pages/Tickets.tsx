// src/pages/Tickets.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
interface Ticket {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignee: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

const Tickets = () => {
  const { id: projectId } = useParams();
  const { token, user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assigneeEmail, setAssigneeEmail] = useState("");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get(`/api/tickets/project/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTickets(res.data);
      } catch (err) {
        console.error("Failed to load tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) fetchTickets();
  }, [projectId, token]);

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectId) return;

    try {
      const res = await axios.post(
        "/api/tickets",
        {
          title,
          description,
          priority,
          assigneeEmail,
          projectId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setTickets((prev) => [...prev, res.data]);
      setTitle("");
      setDescription("");
      setPriority("Low");
      setAssigneeEmail("");
    } catch (err) {
      alert("Failed to create ticket");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4">Tickets for Project</h1>
      <h2 className="text-xl font-semibold mb-2">Create Ticket</h2>
      <form onSubmit={handleCreateTicket} className="mb-6 space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="email"
          placeholder="Assignee Email (optional)"
          value={assigneeEmail}
          onChange={(e) => setAssigneeEmail(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Create Ticket
        </button>
      </form>
      
      {loading ? (
        <p>Loading...</p>
      ) : tickets.length === 0 ? (
        <p>No tickets yet.</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket._id}
              className="bg-gray-800 p-4 rounded shadow border border-gray-700"
            >
              <h2 className="text-xl font-semibold">{ticket.title}</h2>
              <p className="text-gray-400">{ticket.description}</p>
              <p className="text-sm mt-2">
                <strong>Status:</strong> {ticket.status} |{" "}
                <strong>Priority:</strong> {ticket.priority} |{" "}
                <strong>Assignee:</strong> {ticket.assignee?.name || "Unassigned"} |{" "}
                <strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Tickets;