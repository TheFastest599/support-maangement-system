import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase/config';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
} from '@nextui-org/react';
import { EyeIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import TicketModal from '../components/TicketModal';
import TicketDetailsModal from '../components/TicketDetailsModal';

export default function CustomerDashboard() {
  document.title = 'Customer Dashboard - Support Ticketing System';
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  useEffect(() => {
    if (currentUser?.uid) {
      fetchTickets();
    }
  }, [currentUser?.uid]);

  async function fetchTickets() {
    try {
      const q = query(
        collection(db, 'tickets'),
        where('userId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const ticketData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAtTemp:
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

  async function handleCreateTicket(values) {
    try {
      const ticketData = {
        ...values,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        createdAt: Timestamp.now(),
        status: 'Open',
        assignedTo: null,
        lastUpdated: Timestamp.now(),
      };

      await addDoc(collection(db, 'tickets'), ticketData);
      await fetchTickets();
      onCreateClose();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  }

  async function handleEditTicket(values) {
    try {
      const ticketRef = doc(db, 'tickets', selectedTicket.id);
      await updateDoc(ticketRef, {
        ...values,
        lastUpdated: Timestamp.now(),
      });
      await fetchTickets();
      onEditClose();
      setSelectedTicket(null);
    } catch (error) {
      console.error('Error updating ticket:', error);
    }
  }

  async function handleDeleteTicket(ticketId) {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteDoc(doc(db, 'tickets', ticketId));
        await fetchTickets();
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
    }
  }

  function handleView(ticket) {
    setSelectedTicket(ticket);
    onViewOpen();
  }

  function handleEdit(ticket) {
    setSelectedTicket(ticket);
    onEditOpen();
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  return (
    <div className="p-2 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Support Tickets</h1>
        <Button color="primary" onPress={onCreateOpen}>
          Create New Ticket
        </Button>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">
            No tickets found. Create a new ticket to get started.
          </p>
        </div>
      ) : (
        <Table aria-label="Support tickets table">
          <TableHeader>
            <TableColumn>TICKET ID</TableColumn>
            <TableColumn>TITLE</TableColumn>
            <TableColumn>PRIORITY</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>CREATED AT</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody>
            {tickets.map(ticket => (
              <TableRow key={ticket.id}>
                <TableCell>{ticket.id.slice(0, 8)}</TableCell>
                <TableCell>{ticket.title}</TableCell>
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
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      ticket.status === 'Open'
                        ? 'bg-blue-100 text-blue-800'
                        : ticket.status === 'In Progress'
                        ? 'bg-purple-100 text-purple-800'
                        : ticket.status === 'Resolved'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </TableCell>
                <TableCell>
                  {new Date(ticket.createdAtTemp).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleView(ticket)}
                    >
                      <EyeIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      onPress={() => handleEdit(ticket)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDeleteTicket(ticket.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create Ticket Modal */}
      <TicketModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSubmit={handleCreateTicket}
      />

      {/* View Ticket Modal */}
      <TicketDetailsModal
        isOpen={isViewOpen}
        onClose={onViewClose}
        ticket={selectedTicket}
      />

      {/* Edit Ticket Modal */}
      <TicketModal
        isOpen={isEditOpen}
        onClose={() => {
          onEditClose();
          setSelectedTicket(null);
        }}
        onSubmit={handleEditTicket}
        initialValues={selectedTicket}
        isEditing={true}
      />
    </div>
  );
}
