import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

interface Ticket {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  assignee?: {
    name: string;
    email: string;
  };
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  image?: string; // <-- Add this line
}


interface Comment {
  _id: string;
  userId: {
    name: string;
    email: string;
    _id: string;
  };
  text: string;
  createdAt: string;
}

const TicketDetail = () => {
  const { ticketId } = useParams();
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [editOpen, setEditOpen] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteTicket = async () => {
    if (!ticket) return;
    try {
      console.log("Deleting ticket:", ticket._id);
      await axios.delete(`/api/tickets/${ticket._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Ticket deleted. Redirecting...");
      navigate(`/projects/${ticket.projectId}/tickets`);
    } catch (err) {
      console.error("Failed to delete ticket", err);
    }
  };


  useEffect(() => {
    const fetchDetails = async () => {
      console.log("Fetching ticket and comments for ticketId:", ticketId);
      try {
        const [ticketRes, commentsRes] = await Promise.all([
          axios.get(`/api/tickets/${ticketId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/comments/ticket/${ticketId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        console.log("Ticket fetched:", ticketRes.data);
        console.log("Comments fetched:", commentsRes.data);
        setTicket(ticketRes.data);
        setComments(commentsRes.data);
      } catch (err) {
        console.error("Failed to load ticket or comments", err);
      } finally {
        setLoading(false);
      }
    };

    if (ticketId) fetchDetails();
  }, [ticketId, token]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await axios.post(
        "/api/comments",
        { ticketId, text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Comment added:", res.data);
      setComments((prev) => [...prev, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await axios.delete(`/api/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Comment deleted:", commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  const handleUpdateTicket = async () => {
    if (!ticket) return;
    try {
      const res = await axios.put(`/api/tickets/${ticket._id}`, ticket, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Ticket updated:", res.data);
      // Preserve createdBy to avoid losing isOwner check
      setTicket({
        ...res.data,
        createdBy: ticket.createdBy,
      });
      setEditOpen(false);
    } catch (err) {
      console.error("Failed to update ticket", err);
    }
  };
  

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!ticket) return <div className="p-6 text-white">Ticket not found</div>;

  const isOwner = user?.id === ticket.createdBy._id;
  console.log("Current user:", user);
  console.log("Is Owner:", isOwner);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <h1 className="text-3xl font-bold">{ticket.title}</h1>
        {isOwner && (
          <div className="flex gap-2">
            <button onClick={() => setEditOpen(true)} className="bg-yellow-600 px-3 py-1 rounded">
              Edit
            </button>
            <button onClick={() => setShowDeleteConfirm(true)} className="bg-red-600 px-3 py-1 rounded">
              Delete
            </button>
          </div>
        )}

      </div>

      <p className="mb-2">{ticket.description}</p>
      <p className="text-sm text-gray-400 mb-4">
        Priority: {ticket.priority} | Status: {ticket.status} | Created:{" "}
        {new Date(ticket.createdAt).toLocaleString()}
        <br />
        Assigned to: {ticket.assignee?.name || "Unassigned"}
      </p>
      {isOwner && (
  <div className="mt-6">
    <p className="text-sm text-gray-400 mb-1">Upload Image:</p>
    <div className="flex items-center gap-3">
      <label
        htmlFor="image-upload"
        className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Choose File
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file || !ticket) return;

          const formData = new FormData();
          formData.append("image", file);

          try {
            const res = await axios.post(
              `/api/tickets/${ticket._id}/upload-image`,
              formData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            console.log("Image uploaded:", res.data);
            setTicket({ ...ticket, image: res.data.image });
          } catch (err) {
            console.error("Failed to upload image", err);
          }
        }}
        className="hidden"
      />
      {ticket.image && (
        <span className="text-gray-300 text-sm">File selected</span>
      )}
    </div>
  </div>
)}

      {ticket.image && (
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-1">Attached Image:</p>
          <div className="flex justify-center">
            <img
              src={`http://localhost:5000${ticket.image}`}
              alt="Ticket Attachment"
              className="max-w-sm w-full border border-gray-700 rounded"
            />
          </div>
        </div>
      )}



      <hr className="border-gray-700 mb-6" />

      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <div className="space-y-4 mb-4">
        {comments.map((comment) => (
          <div
            key={comment._id}
            className="bg-gray-800 p-3 rounded shadow border border-gray-700"
          >
            <p className="text-sm text-gray-300 mb-1">
              {comment.userId.name} • {new Date(comment.createdAt).toLocaleString()}
            </p>
            <p>{comment.text}</p>
            {comment.userId._id === user?.id && (
              <button
                onClick={() => handleDeleteComment(comment._id)}
                className="text-red-400 text-xs mt-1"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
        />
        <button
          onClick={handleAddComment}
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
        >
          Post
        </button>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded shadow max-w-md w-full border border-gray-700">
            <h2 className="text-xl mb-4">Edit Ticket</h2>
            <input
              className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded"
              value={ticket.title}
              onChange={(e) => setTicket({ ...ticket, title: e.target.value })}
            />
            <textarea
              className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded"
              value={ticket.description}
              onChange={(e) => setTicket({ ...ticket, description: e.target.value })}
            />
            <select
              className="w-full p-2 mb-2 bg-gray-800 border border-gray-700 rounded"
              value={ticket.priority}
              onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
            <select
              className="w-full p-2 mb-4 bg-gray-800 border border-gray-700 rounded"
              value={ticket.status}
              onChange={(e) => setTicket({ ...ticket, status: e.target.value })}
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditOpen(false)} className="text-gray-400">
                Cancel
              </button>
              <button onClick={handleUpdateTicket} className="bg-blue-600 px-4 py-2 rounded">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded shadow max-w-md w-full border border-gray-700">
            <h2 className="text-xl mb-4">Confirm Deletion</h2>
            <p className="mb-4 text-gray-300">Are you sure you want to delete this ticket?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(false)} className="text-gray-400">
                Cancel
              </button>
              <button onClick={handleDeleteTicket} className="bg-red-600 px-4 py-2 rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default TicketDetail;
