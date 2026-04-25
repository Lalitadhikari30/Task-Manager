import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, CheckSquare, Settings, LogOut, Search } from 'lucide-react';

const Sidebar = () => {
  return (
    <div style={{
      width: '260px',
      height: '100vh',
      backgroundColor: 'var(--color-sidebar)',
      position: 'fixed',
      left: 0,
      top: 0,
      display: 'flex',
      flexDirection: 'column',
      padding: '1.5rem',
      color: 'white',
      borderRight: '1px solid rgba(255,255,255,0.05)'
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', padding: '0 0.5rem' }}>
        <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckSquare fill="none" color="white" size={18} strokeWidth={2.5} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>Planify</h1>
      </div>

      {/* Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        <NavLink to="/dashboard" style={({isActive}) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.875rem 1rem',
          borderRadius: '12px',
          color: isActive ? 'white' : 'var(--color-text-muted)',
          backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
          fontWeight: isActive ? '600' : '500',
          transition: 'all 0.2s'
        })}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>
        
        <NavLink to="/tasks" style={({isActive}) => ({
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.875rem 1rem',
          borderRadius: '12px',
          color: isActive ? 'white' : 'var(--color-text-muted)',
          backgroundColor: isActive ? 'var(--color-primary)' : 'transparent',
          fontWeight: isActive ? '600' : '500',
          transition: 'all 0.2s'
        })}>
          <CheckSquare size={20} />
          All Tasks
        </NavLink>
      </nav>
    </div>
  );
};

const Header = () => {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = React.useState(false);
  
  return (
    <header style={{
      height: '80px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      backgroundColor: 'var(--color-bg-light)',
      position: 'sticky',
      top: 0,
      zIndex: 10
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '0.5rem 1rem',
        borderRadius: '99px',
        width: '300px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <Search size={18} color="var(--color-text-muted)" />
        <input 
          type="text" 
          placeholder="Search tasks..." 
          style={{ border: 'none', background: 'none', padding: '0.25rem 0.5rem', boxShadow: 'none' }}
        />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'relative' }}>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontWeight: '600', fontSize: '0.9rem', margin: 0 }}>{user?.fullName}</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem', margin: 0 }}>{user?.role}</p>
        </div>
        <div 
          onClick={() => setIsProfileOpen(!isProfileOpen)}
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            cursor: 'pointer',
            userSelect: 'none'
          }}>
          {user?.fullName?.charAt(0).toUpperCase()}
        </div>

        {/* Profile Dropdown */}
        {isProfileOpen && (
          <div className="animate-fade-in" style={{
            position: 'absolute',
            top: '50px',
            right: 0,
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)',
            padding: '0.5rem',
            width: '150px',
            zIndex: 20
          }}>
            <button 
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                width: '100%',
                borderRadius: '8px',
                color: 'var(--color-error)',
                fontWeight: '500',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <LogOut size={16} />
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export const Layout = ({ children }) => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-bg-light)' }}>
      <Sidebar />
      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ padding: '2rem', flex: 1, maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {children}
        </main>
      </div>
    </div>
  );
};
