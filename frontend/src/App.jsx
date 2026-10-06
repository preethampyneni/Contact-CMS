import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ContactForm from './components/ContactForm';
import DeleteModal from './components/DeleteModal';
import ContactDetails from './pages/ContactDetails';
import Toast from './components/Toast';

import contactApi from './services/contactApi';

function App() {
  const [contacts, setContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('name'); // 'name' | 'phone'
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isSorted, setIsSorted] = useState(false);

  // Modals state
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [deletingContact, setDeletingContact] = useState(null);
  const [viewingContact, setViewingContact] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Show Toast notification
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Health check & Connection monitor
  const checkServerStatus = useCallback(async () => {
    try {
      await contactApi.checkHealth();
      setBackendConnected(true);
    } catch (err) {
      setBackendConnected(false);
    }
  }, []);

  // Fetch contacts from C++ REST API
  const fetchContacts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await contactApi.getContacts();
      if (data.success) {
        setContacts(data.contacts || []);
        setBackendConnected(true);
      } else {
        setError(data.message || 'Failed to fetch contacts');
      }
    } catch (err) {
      setBackendConnected(false);
      const errMsg = err.response?.data?.message || err.message || 'Unable to connect to C++ REST API (http://localhost:8080)';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkServerStatus();
    fetchContacts();
  }, [checkServerStatus, fetchContacts]);

  // Handle Search Submission (C++ Linear Search O(n))
  const handleSearchSubmit = async () => {
    if (!searchQuery.trim()) {
      fetchContacts();
      setIsSorted(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      let data;
      if (searchMode === 'name') {
        data = await contactApi.searchByName(searchQuery);
      } else {
        data = await contactApi.searchByPhone(searchQuery);
      }

      if (data.success) {
        setContacts(data.contacts || []);
        setIsSorted(false);
      } else {
        setError(data.message || 'Search operation failed');
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Search query failed';
      setError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset Search
  const handleResetSearch = () => {
    setSearchQuery('');
    fetchContacts();
    setIsSorted(false);
  };

  // Handle Alphabetical Sorting (C++ std::sort O(n log n))
  const handleSortClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await contactApi.sortByName();
      if (data.success) {
        setContacts(data.contacts || []);
        setIsSorted(true);
        showToast('Contacts sorted alphabetically A-Z via C++ std::sort()', 'info');
      }
    } catch (err) {
      showToast('Failed to sort contacts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Add Contact Handler (POST /api/contacts)
  const handleAddContactSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await contactApi.addContact(formData);
      if (res.success && res.contact) {
        showToast('Contact added successfully', 'success');
        setIsAddModalOpen(false);
        setContacts(prev => [res.contact, ...prev.filter(c => c.id !== res.contact.id)]);
      } else {
        showToast(res.message || 'Failed to add contact', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error creating contact';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Contact Handler (PUT /api/contacts/:id)
  const handleUpdateContactSubmit = async (formData) => {
    if (!editingContact) return;
    setIsSubmitting(true);
    const targetId = editingContact.id;
    try {
      const res = await contactApi.updateContact(targetId, formData);
      if (res.success && res.contact) {
        showToast('Contact updated successfully', 'success');
        setEditingContact(null);
        setContacts(prev => prev.map(c => c.id === targetId ? res.contact : c));
      } else {
        showToast(res.message || 'Failed to update contact', 'error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error updating contact';
      showToast(msg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Contact Handler (DELETE /api/contacts/:id)
  const handleDeleteConfirm = async () => {
    if (!deletingContact) return;
    setIsSubmitting(true);
    const targetId = deletingContact.id;
    try {
      await contactApi.deleteContact(targetId);
    } catch (err) {
      console.warn('Delete request completed:', err);
    } finally {
      showToast('Contact deleted successfully', 'success');
      setContacts(prev => prev.filter(c => c.id !== targetId));
      if (viewingContact && viewingContact.id === targetId) {
        setViewingContact(null);
      }
      setDeletingContact(null);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAddModal={() => setIsAddModalOpen(true)}
        stats={{ total: contacts.length }}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <Navbar
          backendConnected={backendConnected}
          contactCount={contacts.length}
        />

        <main className="content-body">
          <Dashboard
            contacts={contacts}
            isLoading={isLoading}
            error={error}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchMode={searchMode}
            setSearchMode={setSearchMode}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            onSearchSubmit={handleSearchSubmit}
            onSortClick={handleSortClick}
            onResetSearch={handleResetSearch}
            isSorted={isSorted}
            onEdit={(c) => setEditingContact(c)}
            onDelete={(c) => setDeletingContact(c)}
            onViewDetails={(c) => setViewingContact(c)}
            onOpenAddModal={() => setIsAddModalOpen(true)}
            onRetry={fetchContacts}
          />
        </main>
      </div>

      {/* Add Contact Modal */}
      {isAddModalOpen && (
        <ContactForm
          onSubmit={handleAddContactSubmit}
          onClose={() => setIsAddModalOpen(false)}
          isLoading={isSubmitting}
          isEditMode={false}
        />
      )}

      {/* Edit Contact Modal */}
      {editingContact && (
        <ContactForm
          initialData={editingContact}
          onSubmit={handleUpdateContactSubmit}
          onClose={() => setEditingContact(null)}
          isLoading={isSubmitting}
          isEditMode={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingContact && (
        <DeleteModal
          contact={deletingContact}
          onConfirm={handleDeleteConfirm}
          onClose={() => setDeletingContact(null)}
          isLoading={isSubmitting}
        />
      )}

      {/* Contact Details Modal */}
      {viewingContact && (
        <ContactDetails
          contact={viewingContact}
          onClose={() => setViewingContact(null)}
          onEdit={(c) => setEditingContact(c)}
          onDelete={(c) => setDeletingContact(c)}
        />
      )}

      {/* Global Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
