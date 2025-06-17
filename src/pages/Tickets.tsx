import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import KanbanBoard from "../components/Tickets/KanbanBoard";

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
  const { token } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assigneeEmail, setAssigneeEmail] = useState("");

  // Filters & search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  const fetchTickets = async (
      searchTerm: string,
      status: string,
      priority: string
    ) => {
      try {
        setLoading(true);
        const query = new URLSearchParams();
        if (searchTerm) query.append("search", searchTerm);
        if (status) query.append("status", status);
        if (priority) query.append("priority", priority);

        const res = await axios.get(
          `/api/tickets/project/${projectId}?${query.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTickets(res.data);
      } catch (err) {
        console.error("Failed to load tickets:", err);
      } finally {
        setLoading(false);
      }
    };

    useEffect(() => {
      if (projectId) {
        fetchTickets(search, statusFilter, priorityFilter);
      }
    }, [projectId, search, statusFilter, priorityFilter]);


  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !projectId) return;

    try {
      const res = await axios.post(
        "/api/tickets",
        { title, description, priority, assigneeEmail, projectId },
        { headers: { Authorization: `Bearer ${token}` } }
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
      <h1 className="text-2xl font-bold mb-6">Project Tickets</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Ticket Form */}
        <div className="md:col-span-1">
          <h2 className="text-xl font-semibold mb-2">Create Ticket</h2>
          <form onSubmit={handleCreateTicket} className="space-y-4">
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
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded w-full"
            >
              Create Ticket
            </button>
          </form>
        </div>

        {/* Right Column: Ticket List + Kanban */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Ticket List</h2>

            {/* 🔍 Filter UI */}
            <div className="mb-4 flex flex-wrap gap-2 items-center">
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="">All Status</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="p-2 rounded bg-gray-800 border border-gray-700 text-white"
              >
                <option value="">All Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
              <div className="flex gap-2">
  <button
    onClick={() => {
      // This is optional now – useEffect auto-fires
      fetchTickets(search, statusFilter, priorityFilter);
    }}
    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
  >
    Apply Filters
  </button>
  <button
    onClick={() => {
      setSearch("");
      setStatusFilter("");
      setPriorityFilter("");
      // No need to manually call fetchTickets – useEffect handles it
    }}
    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
  >
    Reset
  </button>
              </div>
              
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : tickets.length === 0 ? (
              <p>No tickets yet.</p>
            ) : (
              <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                {tickets.map((ticket) => (
                  <div
                    key={ticket._id}
                    className="bg-gray-800 p-4 rounded shadow border border-gray-700 cursor-pointer hover:bg-gray-700"
                    onClick={() => navigate(`/tickets/${ticket._id}`)}
                  >
                    <h3 className="text-lg font-semibold">{ticket.title}</h3>
                    <p className="text-gray-400">{ticket.description}</p>
                    <p className="text-sm mt-2">
                      <strong>Status:</strong> {ticket.status} |{" "}
                      <strong>Priority:</strong> {ticket.priority} |{" "}
                      <strong>Assignee:</strong>{" "}
                      {ticket.assignee?.name || "Unassigned"} |{" "}
                      <strong>Created:</strong>{" "}
                      {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Kanban View */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Kanban View</h2>
            <KanbanBoard
              tickets={tickets}
              setTickets={setTickets}
              projectId={projectId!}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tickets;
