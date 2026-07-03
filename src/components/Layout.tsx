import React, { createContext, useContext, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

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
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--color-background)', color: 'var(--color-text)' }}>
      {/* Site Header */}
      <header className="site-header" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="site-header__inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 var(--space-24)', height: 'var(--header-height, 64px)', maxWidth: 'var(--container-2xl)', margin: '0 auto' }}>
          <Link to="/" className="site-header__brand" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)', textDecoration: 'none' }}>
            <div className="site-header__logo" style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, var(--color-primary), #60A5FA)', borderRadius: 'var(--radius-md, 8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold', fontSize: 'var(--font-size-lg)', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}>∑</div>
            <span className="site-header__site-name" style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text)', letterSpacing: '-0.02em' }}>Maths Learn</span>
          </Link>
          
          <div className="site-header__actions" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-16)' }}>
            {location.pathname !== '/' && (
              <Link to="/" className="site-header__back" style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', textDecoration: 'none', transition: 'color var(--duration-fast)' }}>
                ← Back to Home
              </Link>
            )}
            <button 
              className="theme-toggle" 
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} 
              aria-label="Toggle dark mode"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '20px',
                padding: 'var(--space-8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-text)',
                borderRadius: 'var(--radius-full)',
                transition: 'background-color var(--duration-fast)'
              }}
            >
              {theme === 'dark' ? <Sun size={20} style={{ color: '#fbbf24' }} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="main-content-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>

      {/* Footer */}
      <footer className="hub-footer">
        <Link to="/" className="hub-footer__brand" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-10)', textDecoration: 'none' }}>
          <div className="hub-footer__logo">∑</div>
          <span className="hub-footer__name">Maths Learn</span>
        </Link>
        <p className="hub-footer__copy" style={{ margin: 0 }}>Interactive statistics &amp; probability education</p>
      </footer>
    </div>
  );
};
