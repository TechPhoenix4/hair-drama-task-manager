'use client';
import { useState } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  
  const [users, setUsers] = useState([
    { email: 'ayushshreejena@gmail.com', password: 'secret123' }
  ]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Catalog Redesign', description: 'Design new product catalog layout for the homepage', assignee: 'team.member1@gmail.com', completed: true },
    { id: 2, title: 'API Integration', description: 'Review API integration endpoints with Flask', assignee: 'ayushshreejena@gmail.com', completed: false }
  ]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDesc, setTaskDesc] = useState('');
  const [assigneeInput, setAssigneeInput] = useState('ayushshreejena@gmail.com');
  const [emailStatus, setEmailStatus] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isSignUp) {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        setError('An account with this email already exists.');
        return;
      }
      setUsers([...users, { email, password }]);
      setSuccess('Account created successfully! Please sign in.');
      setIsSignUp(false);
      setPassword('');
    } else {
      const validUser = users.find(u => u.email === email && u.password === password);
      if (validUser) {
        setIsLoggedIn(true);
        setError('');
      } else {
        setError('Invalid email or password.');
      }
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim() || !assigneeInput.trim()) return;

    const newTask = { 
      id: Date.now(), 
      title: taskTitle.trim(), 
      description: taskDesc.trim(), 
      assignee: assigneeInput.trim(), 
      completed: false 
    };

    setTasks([...tasks, newTask]);
    setTaskTitle('');
    setTaskDesc('');
    setEmailStatus('Sending email notification...');

    try {
      // Optional: Connects to your Python Flask backend to send the email
      const response = await fetch('http://localhost:5000/api/send-task-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          assignee: newTask.assignee,
          title: newTask.title,
          description: newTask.description,
          assignedBy: email
        })
      });
      
      if (response.ok) {
        setEmailStatus('Task assigned & email sent successfully! ✉️');
      } else {
        setEmailStatus('Task added locally (Backend email service offline).');
      }
    } catch (err) {
      setEmailStatus('Task added! (Make sure Flask backend is running on port 5000 for emails).');
    }

    setTimeout(() => setEmailStatus(''), 5000);
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  if (!isLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        padding: 20
      }}>
        <main style={{
          width: '100%',
          maxWidth: 440,
          padding: 40,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: 20,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 50,
              height: 50,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: 14,
              margin: '0 auto 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: 24,
              boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
            }}>⚡</div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1e293b', marginBottom: 6 }}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p style={{ fontSize: 14, color: '#64748b' }}>Hair Drama Task Manager</p>
          </div>

          {error && <div style={{ padding: '12px 16px', marginBottom: 20, background: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: 10, fontSize: 13, fontWeight: 500 }}>{error}</div>}
          {success && <div style={{ padding: '12px 16px', marginBottom: 20, background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534', borderRadius: 10, fontSize: 13, fontWeight: 500 }}>{success}</div>}
          
          <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', fontSize: 15, borderRadius: 10, border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc' }}
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', fontSize: 15, borderRadius: 10, border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc' }}
                required
              />
            </div>
            <button type="submit" style={{
              width: '100%',
              marginTop: 6,
              padding: '14px',
              fontSize: 15,
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)'
            }}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: 14, color: '#64748b' }}>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button 
              type="button" 
              onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
              style={{ background: 'none', border: 'none', color: '#667eea', fontWeight: 700, cursor: 'pointer', fontSize: 14 }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f1f5f9',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      padding: '40px 20px'
    }}>
      <main style={{ maxWidth: 760, margin: '0 auto', background: '#ffffff', borderRadius: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.05)', padding: 36, border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, borderBottom: '1px solid #e2e8f0', paddingBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px' }}>Hair Drama Task Manager</h1>
            <p style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Logged in as: <span style={{ fontWeight: 600, color: '#334155' }}>{email}</span></p>
          </div>
          <button onClick={() => setIsLoggedIn(false)} style={{ padding: '9px 18px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: 10, fontWeight: 600, color: '#475569', cursor: 'pointer', fontSize: 14 }}>Logout</button>
        </div>

        {/* Task Stats Bar */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          <div style={{ flex: 1, padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Tasks</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', marginTop: 4 }}>{tasks.length}</p>
          </div>
          <div style={{ flex: 1, padding: 16, background: '#f0fdf4', borderRadius: 12, border: '1px solid #bbf7d0' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Completed</p>
            <p style={{ fontSize: 24, fontWeight: 800, color: '#15803d', marginTop: 4 }}>{completedCount}</p>
          </div>
        </div>
        
        {/* Task Creation Form */}
        <form onSubmit={addTask} style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28, background: '#f8fafc', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>Create & Email Task</h3>
          
          {emailStatus && <div style={{ padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', color: '#1e40af', borderRadius: 8, fontSize: 13, fontWeight: 500 }}>{emailStatus}</div>}

          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Task Heading / Title"
            style={{ width: '100%', padding: '12px 16px', fontSize: 15, borderRadius: 10, border: '1px solid #cbd5e1', outline: 'none', background: '#fff', fontWeight: 600 }}
            required
          />
          
          <textarea
            value={taskDesc}
            onChange={(e) => setTaskDesc(e.target.value)}
            placeholder="Task Description (optional details...)"
            rows={2}
            style={{ width: '100%', padding: '12px 16px', fontSize: 14, borderRadius: 10, border: '1px solid #cbd5e1', outline: 'none', background: '#fff', resize: 'vertical', fontFamily: 'inherit' }}
          />

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="email"
              value={assigneeInput}
              onChange={(e) => setAssigneeInput(e.target.value)}
              placeholder="Assignee Gmail ID (e.g. user@gmail.com)"
              style={{ flex: 1, padding: '10px 14px', fontSize: 14, borderRadius: 10, border: '1px solid #cbd5e1', outline: 'none', background: '#fff' }}
              required
            />
            <button type="submit" style={{ padding: '11px 24px', fontSize: 15, fontWeight: 600, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)' }}>Assign & Email</button>
          </div>
        </form>

        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 15 }}>No tasks assigned yet.</div>
          ) : (
            tasks.map(task => (
              <li key={task.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '16px 20px', background: task.completed ? '#f8fafc' : '#fff', border: '1px solid #e2e8f0', borderRadius: 14, boxShadow: '0 2px 4px rgba(0,0,0,0.01)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, cursor: 'pointer' }} onClick={() => toggleTask(task.id)}>
                  <div style={{ width: 22, height: 22, marginTop: 2, borderRadius: 6, border: task.completed ? 'none' : '2px solid #cbd5e1', background: task.completed ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 'bold', flexShrink: 0 }}>
                    {task.completed ? '✓' : ''}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: task.completed ? '#94a3b8' : '#1e293b', textDecoration: task.completed ? 'line-through' : 'none', marginBottom: 4 }}>
                      {task.title}
                    </h4>
                    {task.description && (
                      <p style={{ fontSize: 14, color: task.completed ? '#94a3b8' : '#475569', marginBottom: 8, lineHeight: 1.4 }}>
                        {task.description}
                      </p>
                    )}
                    <span style={{ fontSize: 12, color: '#64748b', display: 'inline-block', background: '#e2e8f0', padding: '2px 8px', borderRadius: 6, fontWeight: 500 }}>
                      Assigned to: {task.assignee}
                    </span>
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)} style={{ color: '#ef4444', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer', fontSize: 14, padding: '6px 10px', borderRadius: 6 }}>Delete</button>
              </li>
            ))
          )}
        </ul>
      </main>
    </div>
  );
}