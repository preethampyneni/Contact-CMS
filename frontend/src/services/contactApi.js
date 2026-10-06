import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 4000,
});

// Seed contacts for offline / Vercel deployment fallback
const SEED_CONTACTS = [
  {
    id: 'contact_001',
    name: 'Rahul Sharma',
    phone: '9876543210',
    email: 'rahul@example.com',
    address: 'Hyderabad',
    category: 'Friends',
    createdAt: '2026-10-01T10:00:00Z',
    updatedAt: '2026-10-01T10:00:00Z'
  },
  {
    id: 'contact_002',
    name: 'Preetham Reddy',
    phone: '9876543211',
    email: 'preetham@example.com',
    address: 'Bangalore',
    category: 'Personal',
    createdAt: '2026-10-02T11:30:00Z',
    updatedAt: '2026-10-02T11:30:00Z'
  },
  {
    id: 'contact_003',
    name: 'Ananya Verma',
    phone: '9876543212',
    email: 'ananya@example.com',
    address: 'Delhi',
    category: 'College',
    createdAt: '2026-10-03T14:15:00Z',
    updatedAt: '2026-10-03T14:15:00Z'
  },
  {
    id: 'contact_004',
    name: 'Ravi Teja',
    phone: '9876543213',
    email: 'ravi@example.com',
    address: 'Chennai',
    category: 'Work',
    createdAt: '2026-10-04T09:00:00Z',
    updatedAt: '2026-10-04T09:00:00Z'
  },
  {
    id: 'contact_005',
    name: 'Zoya Khan',
    phone: '9876543214',
    email: 'zoya@example.com',
    address: 'Mumbai',
    category: 'Family',
    createdAt: '2026-10-05T16:45:00Z',
    updatedAt: '2026-10-05T16:45:00Z'
  }
];

const LOCAL_STORAGE_KEY = 'contact_cms_data';

const getLocalStore = () => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(SEED_CONTACTS));
      return SEED_CONTACTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    return SEED_CONTACTS;
  }
};

const setLocalStore = (contacts) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(contacts));
  } catch (e) {}
};

/**
 * Health Check API
 */
export const checkHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (err) {
    return { success: true, message: "Local fallback mode active", timestamp: new Date().toISOString() };
  }
};

/**
 * Get All Contacts
 */
export const getContacts = async () => {
  try {
    const response = await api.get('/contacts');
    if (response.data && response.data.success) {
      setLocalStore(response.data.contacts || []);
      return response.data;
    }
  } catch (err) {}
  const localList = getLocalStore();
  return { success: true, count: localList.length, contacts: localList };
};

/**
 * Get Single Contact by ID
 */
export const getContactById = async (id) => {
  try {
    const response = await api.get(`/contacts/${id}`);
    if (response.data && response.data.success) return response.data;
  } catch (err) {}
  const localList = getLocalStore();
  const found = localList.find(c => c.id === id);
  if (found) return { success: true, contact: found };
  return { success: false, message: 'Contact not found' };
};

/**
 * Add New Contact
 */
export const addContact = async (contactData) => {
  try {
    const response = await api.post('/contacts', contactData);
    if (response.data && response.data.success) return response.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      return { success: false, message: err.response.data.message };
    }
  }

  // Fallback storage execution
  const localList = getLocalStore();
  const phoneTrimmed = (contactData.phone || '').trim();
  const duplicate = localList.find(c => (c.phone || '').trim() === phoneTrimmed);
  if (duplicate) {
    return { success: false, message: 'A contact with this phone number already exists' };
  }

  const now = new Date().toISOString();
  const newContact = {
    id: `contact_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    name: contactData.name || '',
    phone: contactData.phone || '',
    email: contactData.email || '',
    address: contactData.address || '',
    category: contactData.category || 'Personal',
    createdAt: now,
    updatedAt: now
  };

  const updatedList = [newContact, ...localList];
  setLocalStore(updatedList);
  return { success: true, message: 'Contact added successfully', contact: newContact };
};

/**
 * Update Existing Contact
 */
export const updateContact = async (id, contactData) => {
  try {
    const response = await api.put(`/contacts/${id}`, contactData);
    if (response.data && response.data.success) return response.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      return { success: false, message: err.response.data.message };
    }
  }

  const localList = getLocalStore();
  const idx = localList.findIndex(c => c.id === id);
  if (idx === -1) return { success: false, message: 'Contact not found' };

  const phoneTrimmed = (contactData.phone || '').trim();
  const duplicate = localList.find(c => c.id !== id && (c.phone || '').trim() === phoneTrimmed);
  if (duplicate) {
    return { success: false, message: 'A contact with this phone number already exists' };
  }

  const updatedContact = {
    ...localList[idx],
    name: contactData.name || localList[idx].name,
    phone: contactData.phone || localList[idx].phone,
    email: contactData.email || localList[idx].email,
    address: contactData.address || localList[idx].address,
    category: contactData.category || localList[idx].category,
    updatedAt: new Date().toISOString()
  };

  localList[idx] = updatedContact;
  setLocalStore(localList);
  return { success: true, message: 'Contact updated successfully', contact: updatedContact };
};

/**
 * Delete Contact
 */
export const deleteContact = async (id) => {
  try {
    const response = await api.delete(`/contacts/${id}`);
    if (response.data && response.data.success) return response.data;
  } catch (err) {}

  const localList = getLocalStore();
  const updatedList = localList.filter(c => c.id !== id);
  setLocalStore(updatedList);
  return { success: true, message: 'Contact deleted successfully' };
};

/**
 * Search Contacts by Name (Linear search O(n))
 */
export const searchByName = async (name) => {
  try {
    const response = await api.get(`/contacts/search/name?name=${encodeURIComponent(name)}`);
    if (response.data && response.data.success) return response.data;
  } catch (err) {}

  const localList = getLocalStore();
  const query = (name || '').trim().toLowerCase();
  if (!query) return { success: true, count: localList.length, contacts: localList };

  const matching = localList.filter(c => (c.name || '').toLowerCase().includes(query));
  return { success: true, count: matching.length, contacts: matching };
};

/**
 * Search Contacts by Phone (Linear search O(n))
 */
export const searchByPhone = async (phone) => {
  try {
    const response = await api.get(`/contacts/search/phone?phone=${encodeURIComponent(phone)}`);
    if (response.data && response.data.success) return response.data;
  } catch (err) {}

  const localList = getLocalStore();
  const query = (phone || '').trim();
  if (!query) return { success: true, count: localList.length, contacts: localList };

  const matching = localList.filter(c => (c.phone || '').includes(query));
  return { success: true, count: matching.length, contacts: matching };
};

/**
 * Sort Contacts Alphabetically A-Z (std::sort O(n log n))
 */
export const sortByName = async () => {
  try {
    const response = await api.get('/contacts/sort/name');
    if (response.data && response.data.success) return response.data;
  } catch (err) {}

  const localList = [...getLocalStore()];
  localList.sort((a, b) => (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase()));
  return { success: true, count: localList.length, contacts: localList };
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
