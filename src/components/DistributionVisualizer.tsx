import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { distributionsData, DistributionConfig } from '../data/distributionsData';
import { linspace } from '../data/mathHelpers';
import { PythonPlayground } from './PythonPlayground';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

// A tiny helper component to briefly flash green/primary when its value changes
const HighlightedValue: React.FC<{ value: string | number }> = ({ value }) => {
  const [highlight, setHighlight] = useState(false);
  const [prevValue, setPrevValue] = useState(value);
  
  useEffect(() => {
    if (value !== prevValue) {
      setHighlight(true);
      setPrevValue(value);
      const timer = setTimeout(() => setHighlight(false), 400); // 400ms flash
      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <span 
      className="term-output__val"
      style={{ 
        fontSize: 'var(--font-size-sm)',
        transition: 'background-color 0.2s ease, color 0.2s ease',
        backgroundColor: highlight ? 'var(--color-primary)' : 'transparent',
        color: highlight ? 'var(--color-bg)' : 'var(--color-primary)',
        padding: '2px 4px',
        borderRadius: '4px',
        fontWeight: 'var(--font-weight-medium)',
        display: 'inline-block'
      }}
    >
      = {value}
    </span>
  );
};

// Tell TypeScript that Plotly exists on window
declare global {
  interface Window {
    Plotly: any;
  }
}

export const DistributionVisualizer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const config: DistributionConfig | null = id ? distributionsData[id] : null;

  if (!config) {
    return (
      <div style={{ padding: 'var(--space-40)', textAlign: 'center' }}>
        <h2>Distribution Not Found</h2>
        <p>No valid distribution identifier was specified.</p>
        <Link to="/" style={{ color: 'var(--color-primary)' }}>Back to Home</Link>
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState<'visualizer' | 'python' | 'split'>('visualizer');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 1024 && activeTab === 'split') {
        setActiveTab('visualizer');
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTab]);

  // Set up parameter states
  const [params, setParams] = useState<{ [name: string]: number }>(() => {
    const initial: { [name: string]: number } = {};
    config.parameters.forEach(p => {
      initial[p.name] = p.defaultValue;
    });
    return initial;
  });

  // Reset parameters when config changes (e.g. switching between distributions)
  useEffect(() => {
    const initial: { [name: string]: number } = {};
    config.parameters.forEach(p => {
      initial[p.name] = p.defaultValue;
    });
    setParams(initial);
  }, [config.id]);

  // Handle slider changes
  const handleSliderChange = (name: string, val: number) => {
    setParams(prev => ({
      ...prev,
      [name]: val
    }));
  };

  // Handle preset clicks
  const handlePresetClick = (values: { [name: string]: number }) => {
    setParams(values);
  };

  // References for chart containers
  const pdfPlotRef = useRef<HTMLDivElement>(null);
  const cdfPlotRef = useRef<HTMLDivElement>(null);

  // Retrieve theme colors dynamically
  const getThemeColors = () => {
    const isDark = document.documentElement.getAttribute('data-color-scheme') === 'dark';
    return {
      bg: 'rgba(0,0,0,0)',
      grid: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
      font: isDark ? '#e2e8f0' : '#1e1e24',
      primary: isDark ? '#32b8c6' : '#21808d',
      secondary: isDark ? '#8c867e' : '#5c5852',
      accent: isDark ? '#f59e0b' : '#d97706'
    };
  };

  // Render charts when parameters or configuration changes
  useEffect(() => {
    if (!window.Plotly || !pdfPlotRef.current || !cdfPlotRef.current) return;

    const colors = getThemeColors();
    const range = config.xRange(params);
    const isDiscrete = config.type === 'discrete';

    const axisBase = {
      color: colors.secondary,
      gridcolor: colors.grid,
      zerolinecolor: colors.grid,
      tickfont: { color: colors.secondary, family: 'monospace', size: 10 }
    };

    const layoutBase = {
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      font: { family: 'monospace', color: colors.font, size: 11 },
      margin: { t: 15, b: 40, l: 50, r: 15 },
      showlegend: false,
      hovermode: 'closest'
    };

    // Calculate chart points
    if (isDiscrete) {
      // Discrete distributions (e.g. Binomial, Poisson, Bernoulli)
      const start = Math.floor(range[0]);
      const end = Math.ceil(range[1]);
      const xs: number[] = [];
      const ys_pdf: number[] = [];
      const ys_cdf: number[] = [];

      for (let x = start; x <= end; x++) {
        xs.push(x);
        ys_pdf.push(config.pdf(x, params));
        ys_cdf.push(config.cdf(x, params));
      }

      // PDF: Bar chart for discrete values
      window.Plotly.react(pdfPlotRef.current, [
        {
          x: xs,
          y: ys_pdf,
          type: 'bar',
          marker: {
            color: colors.primary,
            opacity: 0.85,
            line: {
              color: colors.primary,
              width: 1
            }
          },
          hovertemplate: 'k = %{x}<br>P(X=k) = %{y:.4f}<extra></extra>'
        }
      ], {
        ...layoutBase,
        xaxis: { ...axisBase, title: { text: 'k', font: { color: colors.secondary } }, dtick: xs.length > 25 ? undefined : 1 },
        yaxis: { ...axisBase, title: { text: 'P(X = k)', font: { color: colors.secondary } }, rangemode: 'tozero' }
      }, { displayModeBar: false, responsive: true });

      // CDF: Step plot for discrete values
      window.Plotly.react(cdfPlotRef.current, [
        {
          x: xs,
          y: ys_cdf,
          type: 'scatter',
          mode: 'lines+markers',
          line: {
            color: colors.primary,
            width: 2.5,
            shape: 'hv' // Step function shape (horizontal-vertical)
          },
          marker: {
            color: colors.primary,
            size: 5
          },
          hovertemplate: 'x = %{x}<br>F(x) = %{y:.4f}<extra></extra>'
        }
      ], {
        ...layoutBase,
        xaxis: { ...axisBase, title: { text: 'x', font: { color: colors.secondary } } },
        yaxis: { ...axisBase, title: { text: 'F(x)', font: { color: colors.secondary } }, range: [-0.05, 1.05] }
      }, { displayModeBar: false, responsive: true });

    } else {
      // Continuous distributions (e.g. Normal, Beta, Exponential)
      const xs = linspace(range[0], range[1], 300);
      const ys_pdf = xs.map(x => config.pdf(x, params));
      const ys_cdf = xs.map(x => config.cdf(x, params));

      // PDF: Smooth line chart with translucent fill area
      window.Plotly.react(pdfPlotRef.current, [
        {
          x: xs,
          y: ys_pdf,
          fill: 'tozeroy',
          type: 'scatter',
          mode: 'none',
          fillcolor: colors.primary.replace(')', ', 0.12)').replace('rgb', 'rgba').replace('#21808d', 'rgba(33, 128, 141, 0.12)').replace('#32b8c6', 'rgba(50, 184, 198, 0.12)'),
          hoverinfo: 'skip'
        },
        {
          x: xs,
          y: ys_pdf,
          type: 'scatter',
          mode: 'lines',
          line: { color: colors.primary, width: 2 },
          hovertemplate: 'x = %{x:.3f}<br>f(x) = %{y:.4f}<extra></extra>'
        }
      ], {
        ...layoutBase,
        xaxis: { ...axisBase, title: { text: 'x', font: { color: colors.secondary } } },
        yaxis: { ...axisBase, title: { text: 'f(x)', font: { color: colors.secondary } }, rangemode: 'tozero' }
      }, { displayModeBar: false, responsive: true });

      // CDF: Smooth line chart
      window.Plotly.react(cdfPlotRef.current, [
        {
          x: xs,
          y: ys_cdf,
          type: 'scatter',
          mode: 'lines',
          line: { color: colors.primary, width: 2 },
          hovertemplate: 'x = %{x:.3f}<br>F(x) = %{y:.4f}<extra></extra>'
        }
      ], {
        ...layoutBase,
        xaxis: { ...axisBase, title: { text: 'x', font: { color: colors.secondary } } },
        yaxis: { ...axisBase, title: { text: 'F(x)', font: { color: colors.secondary } }, range: [-0.05, 1.05] }
      }, { displayModeBar: false, responsive: true });
    }
  }, [params, config.id, activeTab]);

  // Listen to global theme transitions and redraw charts
  useEffect(() => {
    const observer = new MutationObserver(() => {
      // Trigger a re-render of Plotly plots by slightly forcing state reload
      setParams(prev => ({ ...prev }));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-color-scheme'] });
    return () => observer.disconnect();
  }, []);

  const stats = config.getStats(params);

  // Helper to dynamically color active slider fills
  const getSliderBackground = (p: typeof config.parameters[0], val: number) => {
    const pct = ((val - p.min) / (p.max - p.min) * 100).toFixed(1) + '%';
    return `linear-gradient(to right, var(--color-primary) ${pct}, var(--color-border) ${pct})`;
  };

  return (
    <div className="page-content" style={{ fontFamily: 'var(--font-family-mono)', width: '100%', maxWidth: 'var(--container-2xl)', transition: 'max-width 0.3s ease', margin: '0 auto', padding: 'var(--space-32) var(--space-24) var(--space-48)' }}>
      
      {/* Title */}
      <h1 className="term-title" style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 'var(--font-weight-bold)', margin: 0, textTransform: 'lowercase' }}>
        {config.id}_distribution
      </h1>
      <hr className="term-rule" style={{ border: 'none', borderTop: '2px solid var(--color-border)', margin: '6px 0 12px 0' }} />
      <p className="term-tagline" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: '0 0 var(--space-32) 0', lineHeight: 1.6 }}>
        {config.tagline}
      </p>

      {/* About Prose */}
      <div className="term-divider" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 'var(--space-24) 0 var(--space-16) 0' }}>
        <span className="term-divider__label" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
          ── ABOUT
        </span>
        <div className="term-divider__line" style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
      </div>
      <div className="term-prose" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', lineHeight: 1.8, margin: 0 }}>
          {config.description}
        </p>
        
        {/* Real-World Applications Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginTop: '8px' 
        }}>
          {config.applications.map((app, idx) => (
            <div key={idx} style={{ 
              background: 'var(--color-bg)', 
              border: '1px solid var(--color-border)', 
              borderRadius: '8px', 
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = 'var(--color-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'none';
              e.currentTarget.style.borderColor = 'var(--color-border)';
            }}
            >
              <div style={{ fontSize: '24px', marginBottom: '4px' }}>{app.icon}</div>
              <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)' }}>{app.title}</strong>
              <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }}>{app.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Formula Display */}
      <div className="term-divider" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 'var(--space-24) 0 var(--space-16) 0' }}>
        <span className="term-divider__label" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
          ── FORMULA
        </span>
        <div className="term-divider__line" style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
      </div>
      <div className="term-formula" style={{ borderLeft: '2px solid var(--color-primary)', padding: 'var(--space-16) 0 var(--space-16) var(--space-16)', margin: 'var(--space-8) 0', overflowX: 'auto' }}>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: '0 0 6px 0' }}>
          {config.type === 'discrete' ? 'PMF' : 'PDF'}
        </p>
        <span className="term-formula__line" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', margin: '0 0 14px 0', display: 'block' }}>
          <BlockMath math={config.formulaPdf} />
        </span>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', margin: '0 0 6px 0' }}>CDF</p>
        <span className="term-formula__line" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', margin: 0, display: 'block' }}>
          <BlockMath math={config.formulaCdf} />
        </span>
      </div>

      {/* Properties Table */}
      <div className="term-divider" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 'var(--space-24) 0 var(--space-16) 0' }}>
        <span className="term-divider__label" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
          ── PROPERTIES
        </span>
        <div className="term-divider__line" style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
      </div>
      <table className="term-props" style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--font-size-sm)' }}>
        <tbody>
          {config.properties.map((prop, idx) => (
            <tr key={idx}>
              <td style={{ padding: '7px 0', borderBottom: '1px solid var(--color-border)', verticalAlign: 'top', color: 'var(--color-text-secondary)', width: '140px', paddingRight: '24px' }}>
                {prop.label}
              </td>
              <td style={{ padding: '7px 0', borderBottom: '1px solid var(--color-border)', verticalAlign: 'top', color: 'var(--color-text)' }}>
                {prop.value}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '15px', marginTop: 'var(--space-48)', marginBottom: 'var(--space-32)' }}>
        <button
          onClick={() => setActiveTab('visualizer')}
          style={{
            background: activeTab === 'visualizer' ? 'var(--color-primary)' : 'transparent',
            color: activeTab === 'visualizer' ? 'var(--color-bg)' : 'var(--color-text)',
            border: `1px solid ${activeTab === 'visualizer' ? 'var(--color-primary)' : 'var(--color-border)'}`,
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontFamily: 'var(--font-family-mono)',
          }}
        >
          Visualizer
        </button>
          <button
            onClick={() => setActiveTab('python')}
            style={{
              background: activeTab === 'python' ? 'var(--color-primary)' : 'transparent',
              color: activeTab === 'python' ? 'var(--color-bg)' : 'var(--color-text)',
              border: `1px solid ${activeTab === 'python' ? 'var(--color-primary)' : 'var(--color-border)'}`,
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontFamily: 'var(--font-family-mono)',
            }}
          >
            Python Lab
          </button>
          {windowWidth >= 1024 && (
            <button
              onClick={() => setActiveTab('split')}
              style={{
                background: activeTab === 'split' ? 'var(--color-primary)' : 'transparent',
                color: activeTab === 'split' ? 'var(--color-bg)' : 'var(--color-text)',
                border: `1px solid ${activeTab === 'split' ? 'var(--color-primary)' : 'var(--color-border)'}`,
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontFamily: 'var(--font-family-mono)',
              }}
            >
              Split View (Desktop)
            </button>
          )}
        </div>

      <div style={{ display: 'flex', gap: '30px', flexDirection: activeTab === 'split' ? 'row' : 'column' }}>
        
        {(activeTab === 'visualizer' || activeTab === 'split') && (
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {/* Parameter Sliders */}
          {config.parameters.length > 0 && (
        <>
          <div className="term-divider" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 'var(--space-24) 0 var(--space-16) 0' }}>
            <span className="term-divider__label" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
              ── PARAMETERS
            </span>
            <div className="term-divider__line" style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            {config.parameters.map(p => {
              const val = params[p.name] !== undefined ? params[p.name] : p.defaultValue;
              return (
                <div key={p.name} className="term-param" style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '6px 0' }}>
                  <span className="term-param__prompt" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', minWidth: '44px', flexShrink: 0 }}>
                    &gt; {p.name}
                  </span>
                  <input
                    className="term-param__slider"
                    type="range"
                    min={p.min}
                    max={p.max}
                    step={p.step}
                    value={val}
                    onChange={(e) => handleSliderChange(p.name, parseFloat(e.target.value))}
                    style={{
                      flex: 1,
                      WebkitAppearance: 'none',
                      appearance: 'none',
                      height: '3px',
                      borderRadius: 0,
                      outline: 'none',
                      cursor: 'pointer',
                      background: getSliderBackground(p, val)
                    }}
                  />
                  <span className="term-param__value" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', minWidth: '56px', textAlign: 'right' }}>
                    {val.toFixed(2)}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Presets */}
      {config.presets.length > 0 && (
        <>
          <div className="term-divider" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 'var(--space-24) 0 var(--space-16) 0' }}>
            <span className="term-divider__label" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
              ── PRESETS
            </span>
            <div className="term-divider__line" style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
          </div>
          <div className="term-presets" style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 20px', padding: '4px 0' }}>
            {config.presets.map(pr => {
              // Check if currently selected params match the preset
              const isActive = config.parameters.every(p => params[p.name] === pr.values[p.name]);
              return (
                <button
                  key={pr.name}
                  className={`term-preset ${isActive ? 'active' : ''}`}
                  onClick={() => handlePresetClick(pr.values)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'var(--font-family-mono)',
                    fontSize: 'var(--font-size-sm)',
                    color: isActive ? 'var(--color-text)' : 'var(--color-primary)',
                    fontWeight: isActive ? 'var(--font-weight-medium)' : 'normal',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  [{pr.name}]
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* Statistical Outputs */}
      <div className="term-divider" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 'var(--space-24) 0 var(--space-16) 0' }}>
        <span className="term-divider__label" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
          ── OUTPUTS
        </span>
        <div className="term-divider__line" style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
      </div>
      <div className="term-output" style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '5px 0', padding: '4px 0' }}>
        {Object.entries(stats).map(([k, v]) => (
          <React.Fragment key={k}>
            <span className="term-output__key" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center' }}>{k}</span>
            <HighlightedValue value={v} />
          </React.Fragment>
        ))}
      </div>

      {/* PDF Plot */}
      <div className="term-divider" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 'var(--space-24) 0 var(--space-16) 0' }}>
        <span className="term-divider__label" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
          ── {config.type === 'discrete' ? 'PMF (PROBABILITY MASS)' : 'PDF (PROBABILITY DENSITY)'}
        </span>
        <div className="term-divider__line" style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
      </div>
      <div className="term-chart-wrap" style={{ width: '100%', overflow: 'hidden' }}>
        <div ref={pdfPlotRef} style={{ minHeight: '280px', width: '100%' }}></div>
      </div>

      {/* CDF Plot */}
      <div className="term-divider" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 'var(--space-24) 0 var(--space-16) 0' }}>
        <span className="term-divider__label" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
          ── CDF (CUMULATIVE DISTRIBUTION)
        </span>
        <div className="term-divider__line" style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
      </div>
      <div className="term-chart-wrap" style={{ width: '100%', overflow: 'hidden' }}>
        <div ref={cdfPlotRef} style={{ minHeight: '200px', width: '100%' }}></div>
      </div>

      {/* Related Distributions */}
      {config.related.length > 0 && (
        <>
          <div className="term-divider" style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: 'var(--space-24) 0 var(--space-16) 0' }}>
            <span className="term-divider__label" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap', letterSpacing: '0.04em' }}>
              ── RELATED
            </span>
            <div className="term-divider__line" style={{ flex: 1, height: '1px', background: 'var(--color-border)' }}></div>
          </div>
          <ul className="term-related" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '7px' }}>
            {config.related.map((rel, idx) => (
              <li key={idx} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text)', display: 'flex', gap: '10px' }}>
                <span className="term-related__arrow" style={{ color: 'var(--color-primary)', flexShrink: 0 }}>→</span>
                <span>
                  <strong>{rel.label}</strong>
                  <span className="term-related__note" style={{ color: 'var(--color-text-secondary)' }}> — {rel.note}</span>
                </span>
              </li>
            ))}
          </ul>
        </>
      )}

          </div>
        )}

        {(activeTab === 'python' || activeTab === 'split') && (
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
            <PythonPlayground initialCode={config.pythonTemplate || `# Write your python code for ${config.name} here.\\nprint('Hello World')`} forceVerticalLayout={activeTab === 'split'} exercises={config.exercises} />
          </div>
        )}

      </div>
    </div>
  );
};
