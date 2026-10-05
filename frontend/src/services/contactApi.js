import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Health Check API
 */
export const checkHealth = async () => {
  const response = await api.get('/health');
  return response.data;
};

/**
 * Get All Contacts
 */
export const getContacts = async () => {
  const response = await api.get('/contacts');
  return response.data;
};

/**
 * Get Single Contact by ID
 */
export const getContactById = async (id) => {
  const response = await api.get(`/contacts/${id}`);
  return response.data;
};

/**
 * Add New Contact
 */
export const addContact = async (contactData) => {
  const response = await api.post('/contacts', contactData);
  return response.data;
};

/**
 * Update Existing Contact
 */
export const updateContact = async (id, contactData) => {
  const response = await api.put(`/contacts/${id}`, contactData);
  return response.data;
};

/**
 * Delete Contact
 */
export const deleteContact = async (id) => {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
};

/**
 * Search Contacts by Name (Case-insensitive linear search in C++)
 */
export const searchByName = async (name) => {
  const response = await api.get(`/contacts/search/name?name=${encodeURIComponent(name)}`);
  return response.data;
};

/**
 * Search Contacts by Phone (Substring match in C++)
 */
export const searchByPhone = async (phone) => {
  const response = await api.get(`/contacts/search/phone?phone=${encodeURIComponent(phone)}`);
  return response.data;
};

/**
 * Sort Contacts Alphabetically A-Z (std::sort in C++)
 */
export const sortByName = async () => {
  const response = await api.get('/contacts/sort/name');
  return response.data;
};

export default {
  checkHealth,
  getContacts,
  getContactById,
  addContact,
  updateContact,
  deleteContact,
  searchByName,
  searchByPhone,
  sortByName,
};
