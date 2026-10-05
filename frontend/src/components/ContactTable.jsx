import React from 'react';
import { Edit2, Trash2, Eye, Phone, Mail, MapPin, Calendar } from 'lucide-react';

const ContactTable = ({ contacts, onEdit, onDelete, onViewDetails }) => {
  const getBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'personal': return 'badge-personal';
      case 'friends': return 'badge-friends';
      case 'family': return 'badge-family';
      case 'work': return 'badge-work';
      case 'college': return 'badge-college';
      default: return 'badge-other';
    }
  };

  return (
    <div className="table-responsive glass-panel">
      <table className="contact-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Email</th>
            <th>Category</th>
            <th>Location</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="animate-fade-in">
              <td style={{ fontWeight: 600, color: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    flexShrink: 0
                  }}>
                    {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <div style={{ cursor: 'pointer', color: '#f8fafc' }} onClick={() => onViewDetails(contact)}>
                      {contact.name}
                    </div>
                    <span style={{ fontSize: '0.7rem', color: '#64748b' }}>ID: {contact.id}</span>
                  </div>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontFamily: 'monospace', fontSize: '0.9rem' }}>
                  <Phone size={14} color="#6366f1" />
                  {contact.phone}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="#06b6d4" />
                  {contact.email || <span style={{ color: '#64748b', italic: true }}>N/A</span>}
                </div>
              </td>
              <td>
                <span className={`badge ${getBadgeClass(contact.category)}`}>
                  {contact.category || 'Personal'}
                </span>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <MapPin size={14} color="#94a3b8" />
                  {contact.address || <span style={{ color: '#64748b' }}>Not set</span>}
                </div>
              </td>
              <td style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => onViewDetails(contact)}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.6rem' }}
                    title="View Details"
                  >
                    <Eye size={15} color="#38bdf8" />
                  </button>
                  <button
                    onClick={() => onEdit(contact)}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.6rem' }}
                    title="Edit Contact"
                  >
                    <Edit2 size={15} color="#fbbf24" />
                  </button>
                  <button
                    onClick={() => onDelete(contact)}
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 0.6rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}
                    title="Delete Contact"
                  >
                    <Trash2 size={15} color="#ef4444" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactTable;
