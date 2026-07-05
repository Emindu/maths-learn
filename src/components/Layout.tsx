import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon, Trophy } from 'lucide-react';
import { useProgress, TOPIC_SEQUENCE } from '../contexts/ProgressContext';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.setAttribute('data-color-scheme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      html.setAttribute('data-color-scheme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="app-container">
      {/* Site Header */}
      <header className="site-header glass">
        <div className="site-header__inner">
          <Link to="/" className="site-header__brand">
            <div className="site-header__logo">∑</div>
            <span className="site-header__site-name">Maths Learn</span>
          </Link>
          
          <div className="site-header__actions">
            {(() => {
              try {
                // Safely try to get progress - will fail if outside ProgressProvider which shouldn't happen here
                const { completedTopics } = useProgress();
                const total = TOPIC_SEQUENCE.length;
                // Only count completed topics that are actually in the sequence
                const completedCount = completedTopics.filter(t => TOPIC_SEQUENCE.includes(t)).length;
                const percent = Math.round((completedCount / total) * 100);
                
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-8)', marginRight: 'var(--space-16)', background: 'var(--color-surface-raised)', padding: '4px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--color-border)' }}>
                    <Trophy size={14} style={{ color: percent === 100 ? '#f59e0b' : 'var(--color-text-secondary)' }} />
                    <div style={{ width: '60px', height: '6px', background: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{ width: `${percent}%`, height: '100%', background: 'var(--color-primary)', transition: 'width 0.5s ease-out' }} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-text)' }}>{percent}%</span>
                  </div>
                );
              } catch (e) {
                return null;
              }
            })()}

            {location.pathname !== '/' && (
              <Link to="/" className="site-header__back hover-lift">
                ← Back to Home
              </Link>
            )}
            <button 
              className="theme-toggle hover-lift" 
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} 
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun size={20} style={{ color: '#ff9f0a' }} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="main-content-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>

      {/* Footer */}
      <footer className="hub-footer glass" style={{ marginTop: 'auto', borderRadius: 0, borderRight: 0, borderLeft: 0, borderBottom: 0, padding: 'var(--space-24)', textAlign: 'center' }}>
        <Link to="/" className="hub-footer__brand" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)', textDecoration: 'none', justifyContent: 'center' }}>
          <div className="hub-footer__logo" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>∑</div>
          <span className="hub-footer__name">Maths Learn</span>
        </Link>
        <p className="hub-footer__copy" style={{ margin: 'var(--space-8) 0 0 0', color: 'var(--color-text-secondary)' }}>Interactive statistics & probability education</p>
      </footer>
    </div>
  );
};
