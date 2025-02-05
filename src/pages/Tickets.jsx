import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  useDisclosure,
  Chip,
} from '@nextui-org/react';
import { PlusIcon, EyeIcon } from '@heroicons/react/24/outline';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  limit,
  orderBy,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import CreateTicketModal from '../components/CreateTicketModal';
import ViewTicketModal from '../components/ViewTicketModal';

export default function Tickets() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
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

  const fetchTickets = async () => {
    try {
      const ticketsRef = collection(db, 'tickets');
      let q;
      if (user.role === 'customer') {
        document.title = 'Customer Dashboard - Support Ticketing System';
        // Limit and order queries for customers
        q = query(
          ticketsRef,
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc'),
          limit(100)
        );
      } else {
        document.title = 'Agent Dashboard - Support Ticketing System';
        // Limit and order queries for agents
        q = query(ticketsRef, orderBy('createdAt', 'desc'), limit(100));
      }
      const querySnapshot = await getDocs(q);
      const ticketList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTickets(ticketList);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  useEffect(() => {
    fetchTickets();
    // Set up a refresh interval (every 5 minutes)
    const interval = setInterval(fetchTickets, 300000);
    return () => clearInterval(interval);
  }, [user]);

  const handleDelete = async ticketId => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      try {
        await deleteDoc(doc(db, 'tickets', ticketId));
        fetchTickets();
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
    }
  };

  const handleView = ticket => {
    setSelectedTicket(ticket);
    onViewOpen();
  };

  const getPriorityColor = priority => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        {user.role === 'customer' && (
          <Button
            color="primary"
            endContent={<PlusIcon className="h-5 w-5" />}
            onPress={onCreateOpen}
          >
            New Ticket
          </Button>
        )}
      </div>

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
                <Chip color={getPriorityColor(ticket.priority)} size="sm">
                  {ticket.priority}
                </Chip>
              </TableCell>
              <TableCell>
                <Chip variant="flat" size="sm">
                  {ticket.status}
                </Chip>
              </TableCell>
              <TableCell>
                {new Date(ticket.createdAt).toLocaleDateString()}
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
                  {user.role === 'customer' && ticket.status === 'New' && (
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      onPress={() => handleDelete(ticket.id)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateTicketModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onTicketCreated={fetchTickets}
      />

      <ViewTicketModal
        isOpen={isViewOpen}
        onClose={onViewClose}
        ticket={selectedTicket}
        onTicketUpdated={fetchTickets}
      />
    </div>
  );
}
