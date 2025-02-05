import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Chip,
} from '@nextui-org/react';
import {
  Tag,
  Mail,
  Phone,
  Calendar,
  Clock,
  FileText,
  Layers,
  AlertCircle,
} from 'lucide-react';

export default function TicketDetailsModal({ isOpen, onClose, ticket }) {
  if (!ticket) return null;

  const renderDetailRow = (icon, label, value, className = '') => (
    <div className={`flex items-center space-x-3 py-2 ${className}`}>
      {icon}
      <div>
        <h3 className="text-xs font-medium text-gray-500">{label}</h3>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );

  const renderPriorityChip = priority => {
    const colorMap = {
      Low: 'success',
      Medium: 'warning',
      High: 'danger',
      Critical: 'danger',
    };

    return (
      <Chip color={colorMap[priority] || 'default'} variant="flat" size="sm">
        {priority}
      </Chip>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      placement="center"
      scrollBehavior="inside"
      className="max-h-[90vh]"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Ticket Details</h2>
            {renderPriorityChip(ticket.priority)}
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Title and Description */}
            <div className="bg-gray-50 p-4 rounded-lg">
              {renderDetailRow(
                <Tag className="text-primary w-5 h-5" />,
                'Title',
                ticket.title
              )}

              <div className="mt-2 flex items-start space-x-3 py-2">
                <FileText className="text-primary w-5 h-5 mt-1" />
                <div>
                  <h3 className="text-xs font-medium text-gray-500">
                    Description
                  </h3>
                  <p className="text-sm">{ticket.description}</p>
                </div>
              </div>
            </div>

            {/* Detailed Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderDetailRow(
                <Layers className="text-primary w-5 h-5" />,
                'Category',
                ticket.category
              )}

              {renderDetailRow(
                <AlertCircle className="text-primary w-5 h-5" />,
                'Status',
                ticket.status
              )}

              {renderDetailRow(
                <Mail className="text-primary w-5 h-5" />,
                'Contact Email',
                ticket.contactEmail
              )}

              {renderDetailRow(
                <Phone className="text-primary w-5 h-5" />,
                'Phone',
                ticket.phone
              )}

              {renderDetailRow(
                <Calendar className="text-primary w-5 h-5" />,
                'Due Date',
                new Date(ticket.dueDate).toLocaleDateString()
              )}

              {renderDetailRow(
                <Clock className="text-primary w-5 h-5" />,
                'Created At',
                new Date(ticket.createdAtTemp).toLocaleString()
              )}
            </div>

            {/* Additional Notes */}
            {ticket.additionalNotes && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-start space-x-3 py-2">
                  <FileText className="text-primary w-5 h-5 mt-1" />
                  <div>
                    <h3 className="text-xs font-medium text-gray-500">
                      Additional Notes
                    </h3>
                    <p className="text-sm">{ticket.additionalNotes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" variant="light" onPress={onClose} fullWidth>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
