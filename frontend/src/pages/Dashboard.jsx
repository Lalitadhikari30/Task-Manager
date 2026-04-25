import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { taskService } from '../api/tasks';
import { Plus, Clock, CheckCircle2, AlertCircle, LayoutDashboard, Filter, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const StatsCard = ({ title, value, icon, color }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: 'var(--radius-card)',
    padding: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    boxShadow: 'var(--shadow-sm)',
    borderLeft: `4px solid ${color}`
  }}>
    <div style={{
      width: '48px',
      height: '48px',
      borderRadius: '12px',
      backgroundColor: `${color}15`,
      color: color,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {icon}
    </div>
    <div>
      <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem' }}>{title}</p>
      <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{value}</h3>
    </div>
  </div>
);

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // ALL, TODO, IN_PROGRESS, DONE
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      // Sort tasks: newest first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setTimeout(() => setLoading(false), 300); // Smoother loading visual
    }
  };

  const handleCreateOrUpdateTask = async (taskData) => {
    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, taskData);
        toast.success('Task updated successfully');
      } else {
        await taskService.createTask(taskData);
        toast.success('Task created successfully');
      }
      fetchTasks();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await taskService.deleteTask(id);
        toast.success('Task deleted');
        fetchTasks();
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await taskService.updateTaskStatus(id, status);
      toast.success('Status updated');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'TODO').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    done: tasks.filter(t => t.status === 'DONE').length
  };

  const filteredTasks = tasks.filter(t => filter === 'ALL' || t.status === filter);

  return (
    <Layout>
      <div className="animate-slide-up">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>Dashboard</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Welcome back, here's your task summary.</p>
          </div>
          <button className="btn btn-primary" onClick={openNewTaskModal} style={{ borderRadius: 'var(--radius-pill)' }}>
            <Plus size={18} /> New Task
          </button>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2.5rem' 
        }}>
          <StatsCard 
            title="Total Tasks" 
            value={stats.total} 
            icon={<LayoutDashboard size={24} />} 
            color="var(--color-primary)" 
          />
          <StatsCard 
            title="To Do" 
            value={stats.todo} 
            icon={<AlertCircle size={24} />} 
            color="var(--color-warning)" 
          />
          <StatsCard 
            title="In Progress" 
            value={stats.inProgress} 
            icon={<Clock size={24} />} 
            color="#3B82F6" 
          />
          <StatsCard 
            title="Completed" 
            value={stats.done} 
            icon={<CheckCircle2 size={24} />} 
            color="var(--color-success)" 
          />
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-card)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>Recent Tasks</h2>
            
            {/* Filters */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map(f => (
                <button 
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-pill)',
                    fontSize: '0.8rem',
                    fontWeight: '600',
                    backgroundColor: filter === f ? 'var(--color-primary)' : '#F3F4F6',
                    color: filter === f ? 'white' : '#4B5563',
                    transition: 'all 0.2s'
                  }}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem', opacity: 0.5 }}>
              <div className="animate-spin" style={{ width: '32px', height: '32px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }}></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-bg-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckSquare size={32} color="var(--color-text-muted)" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>No tasks found</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>
                {filter === 'ALL' ? 'Create your first task to get started.' : `You have no tasks in ${filter.replace('_', ' ')} status.`}
              </p>
            </div>
          ) : (
            <div className="animate-fade-in" style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
              gap: '1rem' 
            }}>
              {filteredTasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  onEdit={openEditModal}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Task Creation/Editing Modal */}
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTask}
      />
    </Layout>
  );
};

export default Dashboard;
