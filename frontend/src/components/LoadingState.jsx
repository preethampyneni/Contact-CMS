import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState = ({ text = 'Loading contact data...' }) => {
  return (
    <div style={{
      padding: '4rem 2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      color: '#94a3b8'
    }}>
      <Loader2 size={36} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>{text}</span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingState;
