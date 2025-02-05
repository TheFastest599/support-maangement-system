import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Checkbox,
} from '@nextui-org/react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const ticketSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  priority: Yup.string().required('Priority is required'),
  category: Yup.string().required('Category is required'),
  contactEmail: Yup.string()
    .email('Invalid email')
    .required('Contact email is required'),
  phone: Yup.string().required('Phone is required'),
  dueDate: Yup.date().required('Due date is required'),
  department: Yup.string().required('Department is required'),
  impact: Yup.string().required('Impact is required'),
  urgency: Yup.string().required('Urgency is required'),
  requiresOnsite: Yup.boolean(),
  additionalNotes: Yup.string(),
});

const priorities = ['Low', 'Medium', 'High', 'Critical'];
const categories = ['Technical', 'Billing', 'Account', 'General'];
const departments = ['IT', 'Finance', 'HR', 'Operations'];
const impacts = ['Individual', 'Department', 'Organization'];
const urgencies = ['Low', 'Medium', 'High'];

export default function TicketModal({
  isOpen,
  onClose,
  onSubmit,
  initialValues = false,
  isEditing = false,
}) {
  const temp = {
    title: '',
    description: '',
    priority: '',
    category: '',
    contactEmail: '',
    phone: '',
    dueDate: '',
    department: '',
    impact: '',
    urgency: '',
    requiresOnsite: false,
    additionalNotes: '',
  };

  if (!initialValues) {
    initialValues = temp;
  }
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      placement="center"
      scrollBehavior="inside"
      className="max-h-[80vh] lg:max-h-[100vh] overflow-y-auto"
    >
      <ModalContent>
        <Formik
          initialValues={initialValues}
          validationSchema={ticketSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await onSubmit(values);
            setSubmitting(false);
            onClose();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            isSubmitting,
            setFieldValue,
          }) => (
            <Form>
              <ModalHeader className="text-2xl font-bold">
                {isEditing
                  ? 'Edit Support Ticket'
                  : 'Create New Support Ticket'}
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    name="title"
                    label="Title"
                    value={values.title}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.title && !!errors.title}
                    errorMessage={touched.title && errors.title}
                    classNames={{
                      inputWrapper: 'md:min-w-[250px]',
                    }}
                  />

                  <Select
                    name="priority"
                    label="Priority"
                    selectedKeys={values.priority ? [values.priority] : []}
                    onSelectionChange={keys => {
                      const selectedValue = Array.from(keys)[0];
                      setFieldValue('priority', selectedValue);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.priority && !!errors.priority}
                    errorMessage={touched.priority && errors.priority}
                  >
                    {priorities.map(priority => (
                      <SelectItem key={priority} value={priority}>
                        {priority}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    name="category"
                    label="Category"
                    selectedKeys={values.category ? [values.category] : []}
                    onSelectionChange={keys => {
                      const selectedValue = Array.from(keys)[0];
                      setFieldValue('category', selectedValue);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.category && !!errors.category}
                    errorMessage={touched.category && errors.category}
                  >
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </Select>

                  <Input
                    name="contactEmail"
                    label="Contact Email"
                    type="email"
                    value={values.contactEmail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.contactEmail && !!errors.contactEmail}
                    errorMessage={touched.contactEmail && errors.contactEmail}
                  />

                  <Input
                    name="phone"
                    label="Phone"
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.phone && !!errors.phone}
                    errorMessage={touched.phone && errors.phone}
                  />

                  <Input
                    name="dueDate"
                    label="Due Date"
                    type="date"
                    value={values.dueDate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.dueDate && !!errors.dueDate}
                    errorMessage={touched.dueDate && errors.dueDate}
                  />

                  <Select
                    name="department"
                    label="Department"
                    selectedKeys={values.department ? [values.department] : []}
                    onSelectionChange={keys => {
                      const selectedValue = Array.from(keys)[0];
                      setFieldValue('department', selectedValue);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.department && !!errors.department}
                    errorMessage={touched.department && errors.department}
                  >
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    name="impact"
                    label="Impact"
                    selectedKeys={values.impact ? [values.impact] : []}
                    onSelectionChange={keys => {
                      const selectedValue = Array.from(keys)[0];
                      setFieldValue('impact', selectedValue);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.impact && !!errors.impact}
                    errorMessage={touched.impact && errors.impact}
                  >
                    {impacts.map(impact => (
                      <SelectItem key={impact} value={impact}>
                        {impact}
                      </SelectItem>
                    ))}
                  </Select>

                  <Select
                    name="urgency"
                    label="Urgency"
                    selectedKeys={values.urgency ? [values.urgency] : []}
                    onSelectionChange={keys => {
                      const selectedValue = Array.from(keys)[0];
                      setFieldValue('urgency', selectedValue);
                    }}
                    onBlur={handleBlur}
                    isInvalid={touched.urgency && !!errors.urgency}
                    errorMessage={touched.urgency && errors.urgency}
                  >
                    {urgencies.map(urgency => (
                      <SelectItem key={urgency} value={urgency}>
                        {urgency}
                      </SelectItem>
                    ))}
                  </Select>

                  <div className="col-span-1 md:col-span-2">
                    <Textarea
                      name="description"
                      label="Description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.description && !!errors.description}
                      errorMessage={touched.description && errors.description}
                      minRows={3}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Textarea
                      name="additionalNotes"
                      label="Additional Notes"
                      value={values.additionalNotes}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      minRows={2}
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <Checkbox
                      name="requiresOnsite"
                      isSelected={values.requiresOnsite}
                      onValueChange={isSelected =>
                        setFieldValue('requiresOnsite', isSelected)
                      }
                    >
                      Requires Onsite Support
                    </Checkbox>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <div className="flex flex-col sm:flex-row justify-end gap-2 w-full">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    className="w-full sm:w-auto"
                  >
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full sm:w-auto"
                  >
                    {isEditing ? 'Update' : 'Create'}
                  </Button>
                </div>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
}
