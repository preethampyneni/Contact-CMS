import React from 'react';
import { LayoutDashboard, UserPlus, Code } from 'lucide-react';

const Sidebar = ({ activeTab, setActiveTab, openAddModal, stats }) => {
  return (
    <aside style={{
      width: '260px',
      background: 'rgba(15, 23, 42, 0.95)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      zIndex: 50
    }}>
      <div>
        {/* Brand / Logo */}
        <div style={{ padding: '0 0.5rem 1.5rem 0.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: '#6366f1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.9rem',
              color: '#fff'
            }}>
              CMS
            </div>
            <div>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>Contact CMS</h2>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>C++ DSA & Firestore</span>
            </div>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </button>

          <button
            onClick={openAddModal}
            className="btn btn-accent"
            style={{ width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem', marginTop: '0.25rem' }}
          >
            <UserPlus size={18} />
            + Add Contact
          </button>
        </nav>

        {/* DSA Viva Quick Links / Details */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(30, 41, 59, 0.5)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <h3 style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Code size={14} color="#6366f1" /> DSA Concepts
          </h3>
          <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Structure:</span>
              <code style={{ background: 'rgba(99,102,241,0.15)', padding: '2px 6px', borderRadius: '4px', color: '#818cf8', fontSize: '0.75rem' }}>struct Contact</code>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Container:</span>
              <code style={{ background: 'rgba(6,182,212,0.15)', padding: '2px 6px', borderRadius: '4px', color: '#22d3ee', fontSize: '0.75rem' }}>std::vector</code>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Search:</span>
              <span style={{ color: '#34d399', fontWeight: 600 }}>O(n) Linear</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#94a3b8' }}>Sort:</span>
              <span style={{ color: '#fbbf24', fontWeight: 600 }}>O(n log n) std::sort</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: '0.75rem', color: '#64748b' }}>
        <p style={{ fontWeight: 600, color: '#94a3b8' }}>Contact CMS</p>
        <p>Data Structures & Algorithms</p>
      </div>
    </aside>
  );
};

export default Sidebar;
