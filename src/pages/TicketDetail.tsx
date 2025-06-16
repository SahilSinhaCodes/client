import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  createdAt: string;
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
  const { token } = useAuth();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [ticketRes, commentsRes] = await Promise.all([
          axios.get(`/api/tickets/${ticketId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/api/comments/ticket/${ticketId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
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
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment", err);
    }
  };

  if (loading) return <div className="p-6 text-white">Loading...</div>;
  if (!ticket) return <div className="p-6 text-white">Ticket not found</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{ticket.title}</h1>
      <p className="mb-2">{ticket.description}</p>
      <p className="text-sm text-gray-400 mb-4">
        Priority: {ticket.priority} | Status: {ticket.status} | Created:{" "}
        {new Date(ticket.createdAt).toLocaleString()}
        <br />
        Assigned to: {ticket.assignee?.name || "Unassigned"}
      </p>

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
            {comment.userId._id === useAuth().user?.id && (
              <button onClick={() => handleDeleteComment(comment._id)} className="text-red-400 text-xs mt-1">
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
    </div>
  );
};

export default TicketDetail;
