import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const statuses = ['New', 'In Progress', 'Resolved'];

export default function ViewTicketModal({
  isOpen,
  onClose,
  ticket,
  onTicketUpdated,
}) {
  const { user } = useAuth();
  const isAgent = user.role === 'agent';

  const handleStatusChange = async newStatus => {
    if (!ticket || !isAgent) return;

    try {
      const ticketRef = doc(db, 'tickets', ticket.id);
      await updateDoc(ticketRef, {
        status: newStatus,
        lastUpdated: new Date().toISOString(),
      });
      onTicketUpdated();
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  if (!ticket) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>Ticket Details</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              <p className="mt-1">{ticket.title}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="mt-1">{ticket.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                <p className="mt-1">{ticket.priority}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">Category</h3>
                <p className="mt-1">{ticket.category}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Contact Email
                </p>
                <p className="mt-1">{ticket.contactEmail}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  Contact Phone
                </h3>
                <p className="mt-1">{ticket.contactPhone || 'N/A'}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Expected Resolution
              </h3>
              <p className="mt-1">{ticket.expectedResolution || 'N/A'}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Created By</h3>
              <p className="mt-1">{ticket.createdBy}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Created At</h3>
              <p className="mt-1">
                {new Date(ticket.createdAt).toLocaleString()}
              </p>
            </div>

            {isAgent && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <Select
                  className="mt-1"
                  defaultSelectedKeys={[ticket.status]}
                  onChange={e => handleStatusChange(e.target.value)}
                >
                  {statuses.map(status => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </Select>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
