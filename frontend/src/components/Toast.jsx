import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const isSuccess = type === 'success';
  const isError = type === 'error';

  return (
    <div className="animate-fade-in" style={{
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      zIndex: 120,
      background: 'rgba(30, 41, 59, 0.95)',
      backdropFilter: 'blur(12px)',
      border: `1px solid ${isSuccess ? 'rgba(16, 185, 129, 0.4)' : isError ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.4)'}`,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
      borderRadius: '12px',
      padding: '0.85rem 1.25rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      maxWidth: '420px'
    }}>
      {isSuccess && <CheckCircle size={20} color="#10b981" />}
      {isError && <AlertCircle size={20} color="#ef4444" />}
      {!isSuccess && !isError && <Info size={20} color="#6366f1" />}

      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc', flex: 1 }}>
        {message}
      </span>

      <button
        onClick={onClose}
        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem' }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
