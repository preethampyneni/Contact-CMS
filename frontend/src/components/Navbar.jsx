import React from 'react';
import { Users, Server, Database } from 'lucide-react';

const Navbar = ({ backendConnected, contactCount }) => {
  return (
    <header style={{
      height: '70px',
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)'
        }}>
          <Users size={22} color="#ffffff" />
        </div>
        <div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#f8fafc' }}>
            Contact CMS
          </h1>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Backend Server Status Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '20px',
          background: backendConnected ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
          border: `1px solid ${backendConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
          fontSize: '0.8rem',
          fontWeight: 600,
          color: backendConnected ? '#34d399' : '#f87171'
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: backendConnected ? '#10b981' : '#ef4444',
            boxShadow: backendConnected ? '0 0 8px #10b981' : '0 0 8px #ef4444'
          }} />
          <Server size={14} />
          {backendConnected ? 'C++ API Online (Port 8080)' : 'C++ API Disconnected'}
        </div>

        {/* Database Tech Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '20px',
          background: 'rgba(6, 182, 212, 0.12)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#22d3ee'
        }}>
          <Database size={14} />
          Firestore NoSQL
        </div>
      </div>
    </header>
  );
};

export default Navbar;
