import React from 'react';
import ReactDOM from 'react-dom/client';
import { Chart, defaults, registerables } from 'chart.js';
import App from './App';
import './theme.css';
import './hub.css';

// Register Chart.js components
Chart.register(...registerables);

// Apply premium, glassmorphic styling to Chart.js globally
defaults.font.family = '"Outfit", "Inter", -apple-system, sans-serif';
defaults.color = '#86868b'; // generic fallback, though it varies by theme

// Tooltip styling for a glassmorphism feel
if (defaults.plugins && defaults.plugins.tooltip) {
  defaults.plugins.tooltip.backgroundColor = 'rgba(20, 20, 22, 0.8)'; // dark glass by default for contrast
  defaults.plugins.tooltip.titleColor = '#fff';
  defaults.plugins.tooltip.bodyColor = '#eaeaea';
  defaults.plugins.tooltip.borderColor = 'rgba(255,255,255,0.1)';
  defaults.plugins.tooltip.borderWidth = 1;
  defaults.plugins.tooltip.padding = 12;
  defaults.plugins.tooltip.cornerRadius = 12;
  defaults.plugins.tooltip.displayColors = true;
  defaults.plugins.tooltip.boxPadding = 6;
}

// Global elements styling
if (defaults.elements) {
  if (defaults.elements.bar) {
    defaults.elements.bar.borderRadius = 6; // rounded corners for bars
    defaults.elements.bar.borderSkipped = false;
  }
  if (defaults.elements.line) {
    defaults.elements.line.tension = 0.4; // smooth curves by default
    defaults.elements.line.borderWidth = 3;
  }
  if (defaults.elements.point) {
    defaults.elements.point.radius = 4;
    defaults.elements.point.hoverRadius = 6;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
