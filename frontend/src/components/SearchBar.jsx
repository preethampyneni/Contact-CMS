import React from 'react';
import { Search, ArrowUpDown, Filter, X } from 'lucide-react';

const SearchBar = ({
  searchQuery,
  setSearchQuery,
  searchMode,
  setSearchMode,
  categoryFilter,
  setCategoryFilter,
  onSearchSubmit,
  onSortClick,
  onResetSearch,
  isSorted
}) => {
  return (
    <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
        
        {/* Search Input Box + Type Dropdown */}
        <div style={{ flex: '1 1 350px', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Mode Selector */}
          <select
            className="form-select"
            value={searchMode}
            onChange={(e) => setSearchMode(e.target.value)}
            style={{ width: '150px', flexShrink: 0 }}
          >
            <option value="name">Search Name ▼</option>
            <option value="phone">Search Phone ▼</option>
          </select>

          {/* Input field */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={18}
              color="#64748b"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              placeholder={searchMode === 'name' ? 'Search by name (e.g. Rahul, Preetham)...' : 'Search by phone number (e.g. 9876)...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
              style={{ paddingLeft: '2.4rem', paddingRight: searchQuery ? '2.4rem' : '1rem' }}
            />
            {searchQuery && (
              <button
                onClick={onResetSearch}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <button onClick={onSearchSubmit} className="btn btn-primary">
            Search
          </button>
        </div>

        {/* Action Controls: Category Filter + Sort A-Z */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Category Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={16} color="#94a3b8" />
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ width: '130px' }}
            >
              <option value="All">All Categories</option>
              <option value="Personal">Personal</option>
              <option value="Friends">Friends</option>
              <option value="Family">Family</option>
              <option value="Work">Work</option>
              <option value="College">College</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Sort Alphabetically Button */}
          <button
            onClick={onSortClick}
            className={`btn ${isSorted ? 'btn-accent' : 'btn-secondary'}`}
            title="Calls C++ std::sort() algorithm on std::vector<Contact>"
          >
            <ArrowUpDown size={16} />
            Sort A-Z {isSorted && '✓'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default SearchBar;
