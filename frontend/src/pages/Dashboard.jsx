import React from 'react';
import { Users, UserCheck, Heart, Briefcase, GraduationCap, Sparkles } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import SearchFilters from '../components/SearchFilters';
import ContactTable from '../components/ContactTable';
import ContactCard from '../components/ContactCard';
import EmptyState from '../components/EmptyState';
import LoadingState from '../components/LoadingState';
import ErrorMessage from '../components/ErrorMessage';

const Dashboard = ({
  contacts,
  isLoading,
  error,
  searchQuery,
  setSearchQuery,
  searchMode,
  setSearchMode,
  categoryFilter,
  setCategoryFilter,
  onSearchSubmit,
  onSortClick,
  onResetSearch,
  isSorted,
  onEdit,
  onDelete,
  onViewDetails,
  onOpenAddModal,
  onRetry
}) => {

  // Calculate statistics from contacts array
  const stats = {
    total: contacts.length,
    personal: contacts.filter(c => c.category?.toLowerCase() === 'personal').length,
    friends: contacts.filter(c => c.category?.toLowerCase() === 'friends').length,
    family: contacts.filter(c => c.category?.toLowerCase() === 'family').length,
    work: contacts.filter(c => c.category?.toLowerCase() === 'work').length,
    college: contacts.filter(c => c.category?.toLowerCase() === 'college').length,
  };

  // Filter contacts by category dropdown if not "All"
  const displayedContacts = categoryFilter === 'All'
    ? contacts
    : contacts.filter(c => c.category?.toLowerCase() === categoryFilter.toLowerCase());

  return (
    <div className="animate-fade-in">
      
      {/* Welcome Banner / Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Contact CMS
            <Sparkles size={20} color="#6366f1" />
          </h1>
        </div>

        <button onClick={onOpenAddModal} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}>
          + Add New Contact
        </button>
      </div>

      {/* Category Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        {/* Total Contacts */}
        <div className="glass-panel" style={{ padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Total Contacts</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc', lineHeight: 1.2 }}>{stats.total}</h2>
          </div>
        </div>

        {/* Personal */}
        <div className="glass-panel" style={{ padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(129, 140, 248, 0.15)', color: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <UserCheck size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Personal</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#818cf8', lineHeight: 1.2 }}>{stats.personal}</h2>
          </div>
        </div>

        {/* Friends */}
        <div className="glass-panel" style={{ padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(52, 211, 153, 0.15)', color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Friends</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', lineHeight: 1.2 }}>{stats.friends}</h2>
          </div>
        </div>

        {/* Family */}
        <div className="glass-panel" style={{ padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(251, 191, 36, 0.15)', color: '#fbbf24', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Family</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', lineHeight: 1.2 }}>{stats.family}</h2>
          </div>
        </div>

        {/* Work */}
        <div className="glass-panel" style={{ padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(244, 114, 182, 0.15)', color: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Briefcase size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Work</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f472b6', lineHeight: 1.2 }}>{stats.work}</h2>
          </div>
        </div>

        {/* College */}
        <div className="glass-panel" style={{ padding: '1.15rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(34, 211, 238, 0.15)', color: '#22d3ee', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={22} />
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>College</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#22d3ee', lineHeight: 1.2 }}>{stats.college}</h2>
          </div>
        </div>
      </div>

      {/* Search Bar Component */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchMode={searchMode}
        setSearchMode={setSearchMode}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        onSearchSubmit={onSearchSubmit}
        onSortClick={onSortClick}
        onResetSearch={onResetSearch}
        isSorted={isSorted}
      />

      {/* Category Pills */}
      <SearchFilters
        activeCategory={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        counts={stats}
      />

      {/* Error View */}
      {error && <ErrorMessage message={error} onRetry={onRetry} />}

      {/* Loading View */}
      {isLoading ? (
        <LoadingState text="Fetching contacts from C++ REST API..." />
      ) : displayedContacts.length === 0 ? (
        <EmptyState
          message={searchQuery ? `No contacts matching "${searchQuery}" in ${searchMode} search.` : 'No contacts found.'}
          isSearch={Boolean(searchQuery)}
          onAddClick={onOpenAddModal}
        />
      ) : (
        <>
          {/* Desktop Table View */}
          <div style={{ display: 'block' }}>
            <ContactTable
              contacts={displayedContacts}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewDetails={onViewDetails}
            />
          </div>
        </>
      )}

    </div>
  );
};

export default Dashboard;
