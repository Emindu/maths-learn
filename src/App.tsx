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

export const App: React.FC = () => {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');

  return (
    <ThemeProvider>
      <Router basename={basename}>
        <Layout>
          <Routes>
            {/* Hub Dashboard */}
            <Route path="/" element={<Hub />} />
            
            {/* Native Ported Distribution Visualizer */}
            <Route path="/distribution/:id" element={<DistributionVisualizer />} />
            
            {/* Native Ported Monty Hall Game */}
            <Route path="/game/monty-hall" element={<MontyHallGame />} />

            {/* Probability Concepts (Chapter 1) */}
            <Route path="/concepts/:id" element={<ProbabilityConceptPage />} />

            {/* Random Variables & Distributions (Chapter 2) */}
            <Route path="/ch2/:id" element={<Ch2ConceptPage />} />

            {/* Expectation (Chapter 3) */}
            <Route path="/ch3/:id" element={<Ch3ConceptPage />} />
            
            {/* Legacy Dashboard Embedder (handles fallback html and subfolders) */}
            <Route path="/legacy/*" element={<LegacyModuleLoader />} />
            
            {/* Catch-all redirection to hub */}
            <Route path="*" element={<Hub />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
};

export default App;
