import React from 'react';
import { Phone, Mail, MapPin, Edit2, Trash2, Eye, Tag } from 'lucide-react';

const ContactCard = ({ contact, onEdit, onDelete, onViewDetails }) => {
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
    <div className="glass-panel animate-fade-in" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1rem'
          }}>
            {contact.name ? contact.name.charAt(0).toUpperCase() : '?'}
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>{contact.name}</h3>
            <span className={`badge ${getBadgeClass(contact.category)}`}>
              {contact.category || 'Personal'}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#94a3b8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'monospace' }}>
          <Phone size={14} color="#6366f1" />
          {contact.phone}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Mail size={14} color="#06b6d4" />
          {contact.email || 'N/A'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <MapPin size={14} color="#94a3b8" />
          {contact.address || 'Not specified'}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', justifyContent: 'flex-end' }}>
        <button onClick={() => onViewDetails(contact)} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem' }}>
          <Eye size={14} color="#38bdf8" /> Details
        </button>
        <button onClick={() => onEdit(contact)} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem' }}>
          <Edit2 size={14} color="#fbbf24" /> Edit
        </button>
        <button onClick={() => onDelete(contact)} className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', border: '1px solid rgba(239, 68, 68, 0.3)' }}>
          <Trash2 size={14} color="#ef4444" /> Delete
        </button>
      </div>
    </div>
  );
};

export default ContactCard;
