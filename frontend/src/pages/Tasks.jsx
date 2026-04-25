import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { TaskCard } from '../components/TaskCard';
import { TaskModal } from '../components/TaskModal';
import { taskService } from '../api/tasks';
import { Plus, CheckSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); 
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getAllTasks();
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setTasks(data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      // Simulate smoother loading
      setTimeout(() => setLoading(false), 300);
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

  const filteredTasks = tasks.filter(t => {
    const matchesFilter = filter === 'ALL' || t.status === filter;
    const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                          t.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Layout>
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>All Tasks</h1>
            <p style={{ color: 'var(--color-text-muted)' }}>Manage and filter all your tasks in one place.</p>
          </div>
          <button className="btn btn-primary" onClick={openNewTaskModal} style={{ borderRadius: 'var(--radius-pill)' }}>
            <Plus size={18} /> New Task
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: 'var(--radius-card)',
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)',
          flex: 1
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)', flexWrap: 'wrap', gap: '1rem' }}>
            
            <input 
              type="text" 
              placeholder="Search tasks by title or description..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '300px', backgroundColor: '#F9FAFB' }}
            />

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
            <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', opacity: 0.5 }}>
              <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%' }}></div>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="animate-fade-in" style={{ textAlign: 'center', padding: '5rem 0' }}>
              <div style={{ width: '64px', height: '64px', backgroundColor: 'var(--color-bg-light)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <CheckSquare size={32} color="var(--color-text-muted)" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem' }}>No tasks found</h3>
              <p style={{ color: 'var(--color-text-muted)' }}>
                {search ? 'Try adjusting your search query.' : (filter === 'ALL' ? 'Create your first task to get started.' : `You have no tasks in ${filter.replace('_', ' ')} status.`)}
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

      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateOrUpdateTask}
        initialData={editingTask}
      />
    </Layout>
  );
};

export default Tasks;
