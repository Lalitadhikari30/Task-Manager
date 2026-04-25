import React from 'react';
import { Calendar, MoreVertical, Edit2, Trash2, ChevronRight } from 'lucide-react';

const StatusBadge = ({ status }) => {
  const getStyles = () => {
    switch (status) {
      case 'DONE': return { bg: 'var(--color-success-bg)', text: 'var(--color-success)', label: 'Completed' };
      case 'IN_PROGRESS': return { bg: '#EFF6FF', text: '#3B82F6', label: 'In Progress' };
      default: return { bg: 'var(--color-warning-bg)', text: 'var(--color-warning)', label: 'To Do' };
    }
  };
  const { bg, text, label } = getStyles();
  
  return (
    <span style={{ 
      padding: '0.25rem 0.75rem', 
      borderRadius: 'var(--radius-pill)', 
      fontSize: '0.75rem', 
      fontWeight: '600',
      backgroundColor: bg,
      color: text
    }}>
      {label}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const getStyles = () => {
    switch (priority) {
      case 'HIGH': return { bg: 'var(--color-error-bg)', text: 'var(--color-error)' };
      case 'MEDIUM': return { bg: 'var(--color-warning-bg)', text: 'var(--color-warning)' };
      default: return { bg: '#F3F4F6', text: '#4B5563' };
    }
  };
  const { bg, text } = getStyles();
  
  return (
    <span style={{ 
      padding: '0.25rem 0.75rem', 
      borderRadius: 'var(--radius-pill)', 
      fontSize: '0.75rem', 
      fontWeight: '600',
      backgroundColor: bg,
      color: text
    }}>
      {priority}
    </span>
  );
};

export const TaskCard = ({ task, onEdit, onDelete, onStatusChange }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '1.25rem',
      border: '1px solid var(--color-border)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      transition: 'all 0.2s',
      position: 'relative'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = 'var(--shadow-md)';
      e.currentTarget.style.borderColor = 'var(--color-primary)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'none';
      e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)';
      e.currentTarget.style.borderColor = 'var(--color-border)';
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <h4 style={{ fontWeight: '600', fontSize: '1rem', margin: 0, paddingRight: '2rem' }}>{task.title}</h4>
        
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            style={{ color: 'var(--color-text-muted)', padding: '0.25rem' }}
          >
            <MoreVertical size={16} />
          </button>
          
          {showMenu && (
            <div style={{
              position: 'absolute',
              right: 0,
              top: '100%',
              backgroundColor: 'white',
              boxShadow: 'var(--shadow-lg)',
              borderRadius: '8px',
              padding: '0.5rem',
              zIndex: 10,
              minWidth: '140px',
              border: '1px solid var(--color-border)'
            }}>
              <button 
                onClick={() => { onEdit(task); setShowMenu(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', fontSize: '0.875rem', borderRadius: '4px' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-light)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Edit2 size={14} /> Edit Task
              </button>
              
              {task.status !== 'DONE' && (
                <button 
                  onClick={() => { onStatusChange(task.id, 'DONE'); setShowMenu(false); }}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', fontSize: '0.875rem', borderRadius: '4px', color: 'var(--color-success)' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-bg-light)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <ChevronRight size={14} /> Mark Done
                </button>
              )}
              
              <button 
                onClick={() => { onDelete(task.id); setShowMenu(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', fontSize: '0.875rem', borderRadius: '4px', color: 'var(--color-error)' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--color-error-bg)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.25rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {task.description}
      </p>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>
        
        {task.dueDate && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: '500' }}>
            <Calendar size={14} />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};
