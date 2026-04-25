import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Play, CheckSquare, Clock, AlertCircle, CheckCircle2, LayoutDashboard } from 'lucide-react';

const Typewriter = ({ lines, speed = 40 }) => {
  const [currentLine, setCurrentLine] = useState(0);
  const [currentText, setCurrentText] = useState('');

  useEffect(() => {
    if (currentLine >= lines.length) return;
    
    const line = lines[currentLine];
    let i = 0;
    const timer = setInterval(() => {
      setCurrentText(line.substring(0, i + 1));
      i++;
      if (i >= line.length) {
        clearInterval(timer);
        setTimeout(() => {
          setCurrentLine(curr => curr + 1);
          setCurrentText('');
        }, 150); // short pause before typing next line
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [currentLine, lines, speed]);

  return (
    <>
      {lines.slice(0, currentLine).map((line, idx) => (
        <React.Fragment key={idx}>
          {line}
          {idx < lines.length - 1 ? <br/> : null}
        </React.Fragment>
      ))}
      {currentLine < lines.length && (
        <span>
          {currentText}
          <span style={{ borderRight: '4px solid var(--color-primary)', animation: 'blink 1s infinite' }}>&nbsp;</span>
        </span>
      )}
    </>
  );
};

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0B0F19', // Dark navy background
      color: '#FFFFFF',
      fontFamily: 'var(--font-family)',
      position: 'relative',
      overflowX: 'hidden',
      backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
      `,
      backgroundSize: '100px 100px', // Grid effect
      backgroundPosition: 'center center',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(45, 104, 255, 0.15) 0%, rgba(11, 15, 25, 0) 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Navigation */}
      <nav style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.5rem 4rem',
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckSquare fill="none" color="white" size={18} strokeWidth={2.5} />
          </div>
          <span style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>Planify</span>
        </div>

        {/* Links removed as per user request */}

        {/* Auth Buttons */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {isAuthenticated ? (
            <Link to="/dashboard" style={{ color: '#FFFFFF', fontWeight: '600', textDecoration: 'none' }}>Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" style={{ color: '#FFFFFF', fontWeight: '600', fontSize: '0.95rem', textDecoration: 'none' }}>Log In</Link>
              <Link to="/register" style={{
                backgroundColor: '#FFFFFF',
                color: '#0B0F19',
                padding: '0.6rem 1.5rem',
                borderRadius: '99px',
                fontWeight: '600',
                fontSize: '0.95rem',
                textDecoration: 'none',
                transition: 'transform 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                Start for Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: '1440px',
        width: '100%',
        margin: '0 auto',
        padding: '6rem 4rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flex: 1
      }}>
        
        {/* Left Text Content */}
        <div style={{ maxWidth: '600px' }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '0.25rem 1rem 0.25rem 0.25rem',
            borderRadius: '99px',
            marginBottom: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              padding: '0.2rem 0.75rem',
              borderRadius: '99px',
              fontSize: '0.75rem',
              fontWeight: '600',
              marginRight: '0.75rem'
            }}>Launch</span>
            <span style={{ fontSize: '0.875rem', color: '#E5E7EB' }}>Planify V1.0 is now live!</span>
          </div>

          <h1 style={{
            fontSize: '4.5rem',
            fontWeight: '700',
            lineHeight: '1.1',
            marginBottom: '1.5rem',
            color: '#FFFFFF',
            minHeight: '240px' // Keep space reserved to avoid layout shift while typing
          }}>
            <Typewriter lines={["Master your workflow,", "conquer your", "day."]} />
          </h1>

          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: '#9CA3AF',
            marginBottom: '3rem',
            maxWidth: '500px'
          }}>
            Organize tasks, track your team's progress, and collaborate seamlessly in a single, beautifully designed workspace built for ultimate productivity.
          </p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '4rem' }}>
            <Link to="/register" style={{
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '1rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(45, 104, 255, 0.3)',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              Get Started for Free
            </Link>

            <button style={{
              backgroundColor: 'white',
              color: '#0B0F19',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'transform 0.2s',
              border: 'none',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ width: '24px', height: '24px', backgroundColor: 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Play fill="white" color="white" size={12} style={{ marginLeft: '2px' }} />
              </div>
              See how it works
            </button>
          </div>

          <div>
            <p style={{ color: '#9CA3AF', fontSize: '0.875rem', marginBottom: '1rem' }}>Trusted by productive teams everywhere</p>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', opacity: 0.6 }}>
               <div className="crazy-hover" style={{ fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '3px solid white', borderTopColor: 'transparent', transform: 'rotate(45deg)'}}></div>
                 Acme Corp
               </div>
               <div className="crazy-hover" style={{ fontWeight: 'bold', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                 <span style={{ fontSize: '1.5rem' }}>//</span> GlobalTech
               </div>
               <div className="crazy-hover" style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                 Nexus
               </div>
            </div>
          </div>
        </div>

        {/* Right Dashboard Mockup (Task Manager variant) */}
        <div style={{
          position: 'absolute',
          right: '-10%',
          top: '10%',
          width: '900px',
          height: '700px',
          perspective: '1000px',
          zIndex: 1
        }}>
          {/* Abstract representation of the dashboard leaning */}
          <div className="smooth-image-enter crazy-hover-image" style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#F0F2F5',
            borderRadius: '24px',
            boxShadow: '-30px 40px 60px rgba(0, 0, 0, 0.4)',
            overflow: 'hidden',
            display: 'flex',
            border: '8px solid #1E293B'
          }}>
            {/* Sidebar Mock */}
            <div style={{ width: '220px', backgroundColor: '#FFFFFF', height: '100%', borderRight: '1px solid #E5E7EB', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
                  <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--color-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <CheckSquare color="white" size={14} />
                  </div>
                  <div style={{ fontWeight: 'bold', color: '#1A1D1F', fontSize: '1.2rem' }}>Planify</div>
               </div>
               <div style={{ backgroundColor: '#EFF6FF', color: 'var(--color-primary)', padding: '0.75rem', borderRadius: '8px', marginBottom: '0.5rem', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <LayoutDashboard size={16} /> Dashboard
               </div>
               <div style={{ padding: '0.75rem', color: '#6B7280', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <CheckCircle2 size={16} /> All Tasks
               </div>
               <div style={{ padding: '0.75rem', color: '#6B7280', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                 <Clock size={16} /> Timeline
               </div>
               
               <div style={{ marginTop: 'auto', padding: '1rem 0', borderTop: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--color-primary)', borderRadius: '50%' }}></div>
                  <div style={{ color: '#1A1D1F', fontSize: '0.9rem', fontWeight: '600' }}>Jane Doe</div>
               </div>
            </div>
            
            {/* Main Content Mock */}
            <div style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#F8FAFC' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#1A1D1F' }}>Overview</div>
                  <div style={{ width: '120px', height: '36px', backgroundColor: 'var(--color-primary)', borderRadius: '18px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.875rem', fontWeight: '600' }}>+ New Task</div>
               </div>

               {/* Stats Cards Row */}
               <div style={{ display: 'flex', gap: '1rem' }}>
                  {/* Total Tasks */}
                  <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '4px solid var(--color-primary)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div className="crazy-hover" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(45, 104, 255, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <LayoutDashboard color="var(--color-primary)" size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: '500' }}>Total Tasks</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A1D1F' }}>24</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* To Do */}
                  <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '4px solid var(--color-warning)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div className="crazy-hover" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <AlertCircle color="var(--color-warning)" size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: '500' }}>To Do</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A1D1F' }}>8</div>
                      </div>
                    </div>
                  </div>

                  {/* Completed */}
                  <div style={{ flex: 1, backgroundColor: 'white', borderRadius: '16px', padding: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)', borderLeft: '4px solid var(--color-success)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                      <div className="crazy-hover" style={{ width: '40px', height: '40px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CheckCircle2 color="var(--color-success)" size={20} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: '500' }}>Completed</div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1A1D1F' }}>12</div>
                      </div>
                    </div>
                  </div>
               </div>

               {/* Recent Tasks List Mock */}
               <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', flex: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '1.25rem', color: '#1A1D1F' }}>Recent Tasks</div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Task Item 1 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1A1D1F', marginBottom: '0.25rem' }}>Design Landing Page UI</div>
                        <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Create responsive layouts matching Figma</div>
                      </div>
                      <div style={{ padding: '0.25rem 0.75rem', backgroundColor: '#EFF6FF', color: '#3B82F6', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600' }}>In Progress</div>
                    </div>
                    
                    {/* Task Item 2 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1A1D1F', marginBottom: '0.25rem' }}>Setup Spring Boot API</div>
                        <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Initialize project and configure MySQL</div>
                      </div>
                      <div style={{ padding: '0.25rem 0.75rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10B981', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600' }}>Completed</div>
                    </div>

                    {/* Task Item 3 */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1A1D1F', marginBottom: '0.25rem' }}>Write Unit Tests</div>
                        <div style={{ fontSize: '0.8rem', color: '#6B7280' }}>Aim for 80% code coverage on services</div>
                      </div>
                      <div style={{ padding: '0.25rem 0.75rem', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', borderRadius: '99px', fontSize: '0.75rem', fontWeight: '600' }}>To Do</div>
                    </div>
                  </div>
               </div>

            </div>
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer style={{
        position: 'relative',
        zIndex: 10,
        backgroundColor: '#070B14', // Slightly darker than main bg
        borderTop: '1px solid rgba(255,255,255,0.05)',
        padding: '4rem 0 2rem 0',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '0 4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '3rem', marginBottom: '3rem' }}>
            
            {/* Footer Logo & Bio */}
            <div style={{ flex: '1 1 300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '28px', height: '28px', backgroundColor: 'var(--color-primary)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckSquare fill="none" color="white" size={16} strokeWidth={2.5} />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '-0.5px' }}>Planify</span>
              </div>
              <p style={{ color: '#9CA3AF', fontSize: '0.9rem', lineHeight: '1.6', maxWidth: '300px' }}>
                Planify is the ultimate task management solution designed to help teams organize, track, and execute their goals seamlessly.
              </p>
            </div>

            {/* Footer Links Grid */}
            <div style={{ display: 'flex', gap: '5rem', flexWrap: 'wrap' }}>
              <div>
                <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '1.25rem' }}>Product</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>Features</a></li>
                  <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>Integrations</a></li>
                  <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>Pricing</a></li>
                  <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>Changelog</a></li>
                </ul>
              </div>
              
              <div>
                <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '1.25rem' }}>Resources</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>Documentation</a></li>
                  <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>Blog</a></li>
                  <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>Community</a></li>
                  <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>Help Center</a></li>
                </ul>
              </div>

              <div>
                <h4 style={{ color: 'white', fontWeight: '600', marginBottom: '1.25rem' }}>Company</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>About Us</a></li>
                  <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>Careers</a></li>
                  <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</a></li>
                  <li><a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem' }}>
            <p style={{ color: '#6B7280', fontSize: '0.85rem', margin: 0 }}>
              &copy; {new Date().getFullYear()} Planify Inc. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" style={{ color: '#6B7280' }}>Twitter</a>
              <a href="#" style={{ color: '#6B7280' }}>LinkedIn</a>
              <a href="#" style={{ color: '#6B7280' }}>GitHub</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
