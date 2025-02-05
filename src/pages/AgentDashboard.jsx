import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Select,
  SelectItem,
  useDisclosure,
} from '@nextui-org/react';
import { EyeIcon } from '@heroicons/react/24/outline';
import TicketDetailsModal from '../components/TicketDetailsModal';

export default function AgentDashboard() {
  document.title = 'Agent Dashboard - Support Ticketing System';
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

  useEffect(() => {
    if (currentUser?.uid) {
      fetchTickets();
    }
  }, [currentUser?.uid]);

  async function fetchTickets() {
    try {
      const q = query(collection(db, 'tickets'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const ticketData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt:
          doc.data().createdAt?.toDate().toISOString() ||
          new Date().toISOString(),
      }));
      setTickets(ticketData);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(ticketId, newStatus) {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        status: newStatus,
        lastUpdated: Timestamp.now(),
        updatedBy: currentUser.uid,
      });
      await fetchTickets();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  }

  async function handleAssignTicket(ticketId, assignedTo) {
    try {
      const ticketRef = doc(db, 'tickets', ticketId);
      await updateDoc(ticketRef, {
        assignedTo,
        lastUpdated: Timestamp.now(),
        updatedBy: currentUser.uid,
      });
      await fetchTickets();
    } catch (error) {
      console.error('Error assigning ticket:', error);
    }
  }

  function handleView(ticket) {
    setSelectedTicket(ticket);
    onViewOpen();
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  return (
    <div className="p-2 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Support Tickets Dashboard</h1>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No tickets available.</p>
        </div>
      ) : (
        <Table aria-label="Support tickets table">
          <TableHeader>
            <TableColumn>TICKET ID</TableColumn>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>PRIORITY</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>CREATED BY</TableColumn>
            <TableColumn>ASSIGNED TO</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {tickets.map(ticket => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id.slice(0, 8)}</TableCell>
                <TableCell className="min-w-36 lg:min-w-20">
                  {ticket.title}
                </TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      ticket.priority === 'High'
                        ? 'bg-red-100 text-red-800'
                        : ticket.priority === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {ticket.priority}
                  </span>
                </TableCell>
                <TableCell>
                  <Select
                    size="sm"
                    value={ticket.status}
                    onChange={e =>
                      handleStatusChange(ticket.id, e.target.value)
                    }
                    aria-label="Ticket Status"
                    className="min-w-28 lg:min-w-20"
                  >
                    <SelectItem key="Open" value="Open">
                      Open
                    </SelectItem>
                    <SelectItem key="In Progress" value="In Progress">
                      In Progress
                    </SelectItem>
                    <SelectItem key="Resolved" value="Resolved">
                      Resolved
                    </SelectItem>
                    <SelectItem key="Closed" value="Closed">
                      Closed
                    </SelectItem>
                  </Select>
                </TableCell>
                <TableCell>{ticket.userEmail}</TableCell>
                <TableCell>
                  <Select
                    size="sm"
                    value={ticket.assignedTo || ''}
                    onChange={e =>
                      handleAssignTicket(ticket.id, e.target.value)
                    }
                    aria-label="Assign Ticket"
                    className="min-w-28 lg:min-w-20"
                  >
                    <SelectItem key="unassigned" value="">
                      Unassigned
                    </SelectItem>
                    <SelectItem key="agent1" value="agent1@support.com">
                      Agent 1
                    </SelectItem>
                    <SelectItem key="agent2" value="agent2@support.com">
                      Agent 2
                    </SelectItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    isIconOnly
                    size="sm"
                    variant="light"
                    onPress={() => handleView(ticket)}
                  >
                    <EyeIcon className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* View Ticket Modal */}
      <TicketDetailsModal
        isOpen={isViewOpen}
        onClose={onViewClose}
        ticket={selectedTicket}
      />
    </div>
  );
}
