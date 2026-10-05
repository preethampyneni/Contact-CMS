import React from 'react';
import { User, Phone, Mail, MapPin, Tag, Calendar, Hash, ArrowLeft, Edit2, Trash2 } from 'lucide-react';

const ContactDetails = ({ contact, onClose, onEdit, onDelete }) => {
  if (!contact) return null;

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
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1rem'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '560px',
        padding: '2.5rem',
        borderRadius: '20px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.7)'
      }}>

        {/* Top Header Controls */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
            <ArrowLeft size={16} /> Back to List
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => { onClose(); onEdit(contact); }} className="btn btn-secondary">
              <Edit2 size={16} color="#fbbf24" /> Edit
            </button>
            <button onClick={() => { onClose(); onDelete(contact); }} className="btn btn-danger">
              <Trash2 size={16} /> Delete
            </button>
          </div>
        </div>

        {/* Profile Card Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', marginBottom: '1.5rem' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.75rem',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.4)'
          }}>
            {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>
              {contact.name}
            </h2>
            <span className={`badge ${getBadgeClass(contact.category)}`}>
              {contact.category || 'Personal'}
            </span>
          </div>
        </div>

        {/* Detailed Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          {/* Document ID */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '10px' }}>
            <Hash size={18} color="#64748b" />
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Firestore Document ID</span>
              <p style={{ fontSize: '0.9rem', color: '#cbd5e1', fontFamily: 'monospace' }}>{contact.id}</p>
            </div>
          </div>

          {/* Phone */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '10px' }}>
            <Phone size={18} color="#6366f1" />
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Phone Number</span>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', fontFamily: 'monospace' }}>{contact.phone}</p>
            </div>
          </div>

          {/* Email */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '10px' }}>
            <Mail size={18} color="#06b6d4" />
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Email Address</span>
              <p style={{ fontSize: '0.95rem', color: '#f8fafc' }}>{contact.email || 'Not provided'}</p>
            </div>
          </div>

          {/* Address */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '10px' }}>
            <MapPin size={18} color="#fbbf24" />
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Physical Location</span>
              <p style={{ fontSize: '0.95rem', color: '#f8fafc' }}>{contact.address || 'Not specified'}</p>
            </div>
          </div>

          {/* Timestamps */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'rgba(15, 23, 42, 0.5)', borderRadius: '10px' }}>
            <Calendar size={18} color="#94a3b8" />
            <div>
              <span style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Record Timestamps</span>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Created: {contact.createdAt ? new Date(contact.createdAt).toLocaleString() : 'N/A'}<br />
                Updated: {contact.updatedAt ? new Date(contact.updatedAt).toLocaleString() : 'N/A'}
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ContactDetails;
