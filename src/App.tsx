import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, Layout } from './components/Layout';
import { Hub } from './components/Hub';
import { DistributionVisualizer } from './components/DistributionVisualizer';
import { LegacyModuleLoader } from './components/LegacyModuleLoader';
import { MontyHallGame } from './pages/MontyHallGame';
import { ProbabilityConceptPage } from './pages/ProbabilityConceptPage';
import { Ch2ConceptPage } from './pages/Ch2ConceptPage';
import { Ch3ConceptPage } from './pages/Ch3ConceptPage';
import { Ch4ConceptPage } from './pages/Ch4ConceptPage';
import { Ch5ConceptPage } from './pages/Ch5ConceptPage';
import { Ch6ConceptPage } from './pages/Ch6ConceptPage';
import { ProgressProvider } from './contexts/ProgressContext';
import { ProtectedRoute } from './components/ProtectedRoute';

export const App: React.FC = () => {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <ThemeProvider>
      <ProgressProvider>
        <Router basename={basename}>
          <Layout>
            <Routes>
              {/* Hub Dashboard */}
              <Route path="/" element={<Hub />} />
              
              {/* Native Ported Distribution Visualizer */}
              <Route path="/distribution/:id" element={<ProtectedRoute><DistributionVisualizer /></ProtectedRoute>} />
              
              {/* Native Ported Monty Hall Game */}
              <Route path="/game/monty-hall" element={<ProtectedRoute><MontyHallGame /></ProtectedRoute>} />

              {/* Probability Concepts (Chapter 1) */}
              <Route path="/concepts/:id" element={<ProtectedRoute><ProbabilityConceptPage /></ProtectedRoute>} />

              {/* Random Variables & Distributions (Chapter 2) */}
              <Route path="/ch2/:id" element={<ProtectedRoute><Ch2ConceptPage /></ProtectedRoute>} />

              {/* Expectation (Chapter 3) */}
              <Route path="/ch3/:id" element={<ProtectedRoute><Ch3ConceptPage /></ProtectedRoute>} />

              {/* Sampling Distributions & Limits (Chapter 4) */}
              <Route path="/ch4/:id" element={<ProtectedRoute><Ch4ConceptPage /></ProtectedRoute>} />

              {/* Statistical Inference (Chapter 5) */}
              <Route path="/ch5/:id" element={<ProtectedRoute><Ch5ConceptPage /></ProtectedRoute>} />

              {/* Likelihood Inference (Chapter 6) */}
              <Route path="/ch6/:id" element={<ProtectedRoute><Ch6ConceptPage /></ProtectedRoute>} />

              {/* Legacy Dashboard Embedder (handles fallback html and subfolders) */}
              <Route path="/legacy/*" element={<ProtectedRoute><LegacyModuleLoader /></ProtectedRoute>} />
              
              {/* Catch-all redirection to hub */}
              <Route path="*" element={<Hub />} />
            </Routes>
          </Layout>
        </Router>
      </ProgressProvider>
    </ThemeProvider>
  );
};

export default App;
