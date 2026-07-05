import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from './Layout';
import { useProgress } from '../contexts/ProgressContext';

interface LegacyModuleLoaderProps {
  modulePath?: string; // Optional hardcoded path, otherwise fallback to URL params
}

export const LegacyModuleLoader: React.FC<LegacyModuleLoaderProps> = ({ modulePath }) => {
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { markComplete, getNextTopic, isCompleted } = useProgress();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  // If hardcoded modulePath is provided, use it. Otherwise construct from URL parameters.
  // E.g. /legacy/MontyHallGame.html or /legacy/gibbs-sampling-tutor/index.html
  const path = modulePath || (params['*'] ? `${import.meta.env.BASE_URL}legacy/${params['*']}` : '');

  // Synchronizes the theme state from parent to same-origin iframe documentElement
  const syncIframeTheme = () => {
    try {
      const iframe = iframeRef.current;
      if (iframe && iframe.contentDocument) {
        const docEl = iframe.contentDocument.documentElement;
        docEl.setAttribute('data-color-scheme', theme);
        
        // Dispatch custom storage event or click local theme toggle to prompt internal chart redraws if necessary
        const event = new Event('storage');
        iframe.contentWindow?.dispatchEvent(event);
      }
    } catch (e) {
      console.warn("Could not sync theme state to iframe content document:", e);
    }
  };

  // Sync theme when parent theme state changes
  useEffect(() => {
    syncIframeTheme();
  }, [theme, loading]);

  useEffect(() => {
    setLoading(true);
  }, [path]);

  if (!path) {
    return (
      <div style={{ padding: 'var(--space-40)', textAlign: 'center' }}>
        <h2>Module Not Found</h2>
        <p>No valid dashboard path was specified.</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 'calc(100vh - var(--header-height, 64px))', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'var(--color-background)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
          gap: 'var(--space-16)'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid var(--color-border)',
            borderTopColor: 'var(--color-primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', fontFamily: 'var(--font-family-mono)' }}>
            Loading Interactive Module...
          </span>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}
      <iframe
        ref={iframeRef}
        src={path}
        title="Interactive Module Visualizer"
        style={{
          width: '100%',
          flex: 1,
          border: 'none',
          background: 'var(--color-background)'
        }}
        onLoad={() => {
          setLoading(false);
          // Sync theme immediately after load clears
          setTimeout(syncIframeTheme, 50);
        }}
      />
      
      {/* Bottom Nav Bar for Progress Tracking */}
      <div style={{
        padding: 'var(--space-16) var(--space-24)',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
      }}>
        <button
          className="btn btn-primary hover-lift"
          onClick={() => {
            markComplete(currentPath);
            const nextTopic = getNextTopic(currentPath);
            if (nextTopic) {
              navigate(nextTopic);
            } else {
              navigate('/');
            }
          }}
        >
          {isCompleted(currentPath) ? 'Continue to Next' : 'Mark as Complete & Continue'}
        </button>
      </div>

    </div>
  );
};
