import React from 'react';
import ContactForm from '../components/ContactForm';

const AddContact = ({ onAddContact, onClose, isLoading }) => {
  return (
    <ContactForm
      onSubmit={onAddContact}
      onClose={onClose}
      isLoading={isLoading}
      isEditMode={false}
    />
  );
};

export default AddContact;
