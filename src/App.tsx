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
import { Ch7ConceptPage } from './pages/Ch7ConceptPage';
import { Ch8ConceptPage } from './pages/Ch8ConceptPage';
import { Ch9ConceptPage } from './pages/Ch9ConceptPage';
import { Ch10ConceptPage } from './pages/Ch10ConceptPage';
import { Ch11ConceptPage } from './pages/Ch11ConceptPage';
import { Ch12ConceptPage } from './pages/Ch12ConceptPage';
import { InterviewPatternPage } from './pages/InterviewPatternPage';
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

              {/* Bayesian Inference (Chapter 7) */}
              <Route path="/ch7/:id" element={<ProtectedRoute><Ch7ConceptPage /></ProtectedRoute>} />

              {/* Optimal Inferences (Chapter 8) */}
              <Route path="/ch8/:id" element={<ProtectedRoute><Ch8ConceptPage /></ProtectedRoute>} />

              {/* Model Checking (Chapter 9) */}
              <Route path="/ch9/:id" element={<ProtectedRoute><Ch9ConceptPage /></ProtectedRoute>} />

              {/* Relationships Among Variables (Chapter 10) */}
              <Route path="/ch10/:id" element={<ProtectedRoute><Ch10ConceptPage /></ProtectedRoute>} />

              {/* Advanced Topic — Stochastic Processes (Chapter 11) */}
              <Route path="/ch11/:id" element={<ProtectedRoute><Ch11ConceptPage /></ProtectedRoute>} />

              {/* Advanced Topic — Hidden Markov Models (Chapter 12) */}
              <Route path="/ch12/:id" element={<ProtectedRoute><Ch12ConceptPage /></ProtectedRoute>} />

              {/* Programming Interview Patterns (independent track, no unlock gate) */}
              <Route path="/interview/:id" element={<InterviewPatternPage />} />

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
