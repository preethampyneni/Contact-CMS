import React from 'react';
import { UserX, Plus } from 'lucide-react';

const EmptyState = ({ message, onAddClick, isSearch }) => {
  return (
    <div className="glass-panel animate-fade-in" style={{
      padding: '4rem 2rem',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '2rem 0'
    }}>
      <div style={{
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.12)',
        color: '#818cf8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '1.25rem',
        border: '1px solid rgba(99, 102, 241, 0.3)'
      }}>
        <UserX size={36} />
      </div>

      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
        {isSearch ? 'No contacts found' : 'No Contacts Available'}
      </h3>

      <p style={{ fontSize: '0.9rem', color: '#94a3b8', maxWidth: '400px', marginBottom: '1.5rem', lineHeight: '1.5' }}>
        {message || (isSearch ? 'Try searching for another name or phone number.' : 'Get started by creating your first contact.')}
      </p>

      {!isSearch && onAddClick && (
        <button onClick={onAddClick} className="btn btn-primary">
          <Plus size={18} />
          Add First Contact
        </button>
      )}
    </div>
  );
};

export default EmptyState;
