import React from 'react';
import { Tag } from 'lucide-react';

const SearchFilters = ({ activeCategory, setCategoryFilter, counts }) => {
  const categories = ['All', 'Personal', 'Friends', 'Family', 'Work', 'College', 'Other'];

  return (
    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
      {categories.map((cat) => {
        const isActive = activeCategory === cat;
        const count = counts ? (cat === 'All' ? counts.total : counts[cat.toLowerCase()] || 0) : 0;
        return (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.4rem 0.85rem',
              borderRadius: '20px',
              border: `1px solid ${isActive ? '#6366f1' : 'rgba(255, 255, 255, 0.08)'}`,
              background: isActive ? 'rgba(99, 102, 241, 0.2)' : 'rgba(30, 41, 59, 0.6)',
              color: isActive ? '#818cf8' : '#94a3b8',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            <Tag size={12} />
            {cat} ({count})
          </button>
        );
      })}
    </div>
  );
};

export default SearchFilters;
