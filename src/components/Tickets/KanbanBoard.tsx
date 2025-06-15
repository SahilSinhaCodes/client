import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import type { DropResult } from "@hello-pangea/dnd";
  import axios from "axios";
  import { useAuth } from "../../context/AuthContext";

  interface Ticket {
    _id: string;
    title: string;
    description: string;
    status: "todo" | "in-progress" | "done";
    priority: string;
    assignee: {
      _id: string;
      name: string;
      email: string;
    };
    createdAt: string;
  }

  interface Props {
    tickets: Ticket[];
    setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
    projectId: string;
  }

  const statusColumns = ["todo", "in-progress", "done"] as const;

  const statusLabels: Record<(typeof statusColumns)[number], string> = {
    "todo": "To Do",
    "in-progress": "In Progress",
    "done": "Done",
  };

  const KanbanBoard = ({ tickets, setTickets, projectId }: Props) => {
    const { token } = useAuth();

    const onDragEnd = async (result: DropResult) => {
      const { source, destination, draggableId } = result;

      if (!destination || source.droppableId === destination.droppableId) return;

      const updatedStatus = destination.droppableId as Ticket["status"];

      try {
        const res = await axios.put(
          `/api/tickets/${draggableId}`,
          { status: updatedStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTickets((prev) =>
          prev.map((ticket) =>
            ticket._id === draggableId ? { ...ticket, status: updatedStatus } : ticket
          )
        );
      } catch (err) {
        console.error("Failed to update ticket status:", err);
      }
    };

    const grouped = statusColumns.reduce((acc, status) => {
      acc[status] = tickets.filter((t) => t.status === status);
      return acc;
    }, {} as Record<Ticket["status"], Ticket[]>);

    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {statusColumns.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-800 rounded-lg p-3 min-h-[300px] border border-gray-700"
                >
                  <h3 className="text-lg font-bold mb-2">{statusLabels[status]}</h3>

                  {grouped[status].map((ticket, index) => (
                    <Draggable
                      key={ticket._id}
                      draggableId={ticket._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-gray-700 rounded p-3 mb-3 shadow"
                        >
                          <p className="font-semibold">{ticket.title}</p>
                          <p className="text-sm text-gray-300">
                            {ticket.assignee?.name || "Unassigned"} |{" "}
                            {ticket.priority}
                          </p>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    );
  };

  export default KanbanBoard;
