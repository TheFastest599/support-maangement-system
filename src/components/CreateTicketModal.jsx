import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Select, SelectItem, Textarea } from "@nextui-org/react";
import { useForm, Controller } from "react-hook-form";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';

const priorities = ['Low', 'Medium', 'High'];
const categories = ['Technical', 'Billing', 'General', 'Feature Request'];

export default function CreateTicketModal({ isOpen, onClose, onTicketCreated }) {
  const { user } = useAuth();
  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      priority: 'Low',
      category: 'Technical',
      contactEmail: '',
      contactPhone: '',
      expectedResolution: ''
    }
  });

  const onSubmit = async (data) => {
    try {
      const ticketData = {
        ...data,
        status: 'New',
        userId: user.uid,
        createdBy: user.email,
        createdAt: new Date().toISOString(),
        assignedTo: null
      };

      await addDoc(collection(db, 'tickets'), ticketData);
      reset();
      onClose();
      onTicketCreated();
    } catch (error) {
      console.error('Error creating ticket:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalHeader>Create New Support Ticket</ModalHeader>
          <ModalBody className="gap-4">
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Title is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  label="Title"
                  placeholder="Enter ticket title"
                  errorMessage={errors.title?.message}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Description"
                  placeholder="Describe your issue"
                  errorMessage={errors.description?.message}
                />
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Priority"
                    placeholder="Select priority"
                  >
                    {priorities.map((priority) => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />

              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Category"
                    placeholder="Select category"
                  >
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </Select>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Controller
                name="contactEmail"
                control={control}
                rules={{ 
                  required: 'Contact email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    label="Contact Email"
                    placeholder="Enter contact email"
                    errorMessage={errors.contactEmail?.message}
                  />
                )}
              />

              <Controller
                name="contactPhone"
                control={control}
                rules={{
                  pattern: {
                    value: /^[0-9-+()]*$/,
                    message: 'Invalid phone number'
                  }
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="tel"
                    label="Contact Phone"
                    placeholder="Enter contact phone"
                    errorMessage={errors.contactPhone?.message}
                  />
                )}
              />
            </div>

            <Controller
              name="expectedResolution"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Expected Resolution"
                  placeholder="What resolution are you expecting?"
                />
              )}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Create Ticket
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}