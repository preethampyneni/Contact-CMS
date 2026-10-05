import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="glass-panel animate-fade-in" style={{
      padding: '2rem',
      margin: '1.5rem 0',
      borderLeft: '4px solid #ef4444',
      background: 'rgba(239, 68, 68, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      borderRadius: '12px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <AlertCircle size={24} color="#ef4444" />
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>An error occurred</h4>
          <p style={{ fontSize: '0.85rem', color: '#fca5a5' }}>{message}</p>
        </div>
      </div>
      {onRetry && (
        <button onClick={onRetry} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem' }}>
          <RefreshCw size={14} /> Retry
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
