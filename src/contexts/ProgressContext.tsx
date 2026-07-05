import React, { createContext, useContext, useEffect, useState } from 'react';

export const TOPIC_SEQUENCE = [
  '/concepts/probability-intro',
  '/concepts/probability-models',
  '/concepts/probability-properties',
  '/concepts/uniform-probability',
  '/concepts/conditional-probability',
  '/concepts/continuity-of-p',
  
  '/ch2/rv-intro',
  '/ch2/rv-distributions',
  '/ch2/discrete-distributions',
  '/ch2/continuous-distributions',
  '/ch2/cumulative-distribution',
  '/ch2/change-of-variable',
  '/ch2/joint-distributions',
  '/ch2/conditioning-independence',
  '/ch2/multidim-cov',
  '/ch2/simulating-distributions',
  
  '/ch3/expectation-discrete',
  '/ch3/expectation-continuous',
  '/ch3/variance-covariance',
  '/ch3/generating-functions',
  '/ch3/conditional-expectation',
  '/ch3/expectation-inequalities',
  
  '/distribution/bernoulli',
  '/distribution/beta',
  '/distribution/binomial',
  '/distribution/exponential',
  '/distribution/laplace',
  '/distribution/gemma',
  '/distribution/lognormal',
  '/distribution/normal',
  '/distribution/pareto',
  '/distribution/poisson',
  '/distribution/powerlaw',
  '/distribution/uniform',
  '/distribution/zscore',
  '/distribution/Dirichlet',
  
  '/legacy/skewness-kurtosis-edu/index.html',
  
  '/legacy/markovChain.html',
  '/legacy/markovChainC.html',
  '/legacy/markov-chains-edu/index.html',
  '/legacy/continuous-probability-learning/index.html',
  
  '/legacy/metropolis-hastings-learn/index.html',
  '/legacy/gibbs-sampling-tutor/index.html',
  
  '/legacy/MonteCarloPiEstimationVisualization.html',
  '/game/monty-hall',
  
  '/legacy/mixture-model-explorer/index.html',
  '/legacy/likelihood-mle-dashboard/index.html',
  '/legacy/trinity-uncertainty-dashboard/index.html',
  '/legacy/bivariate_normal_3_d_visualizer.html',
  '/legacy/softmax.html',
  '/legacy/anova.html',
];

interface ProgressContextType {
  completedTopics: string[];
  markComplete: (path: string) => void;
  isUnlocked: (path: string) => boolean;
  isCompleted: (path: string) => boolean;
  getNextTopic: (path: string) => string | null;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [completedTopics, setCompletedTopics] = useState<string[]>(() => {
    const saved = localStorage.getItem('maths-learn-progress');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('maths-learn-progress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  const markComplete = (path: string) => {
    setCompletedTopics((prev) => {
      if (!prev.includes(path)) {
        return [...prev, path];
      }
      return prev;
    });
  };

  const isCompleted = (path: string) => {
    return completedTopics.includes(path);
  };

  const isUnlocked = (path: string) => {
    const idx = TOPIC_SEQUENCE.indexOf(path);
    if (idx <= 0) return true; // First topic (or unknown path) is always unlocked
    const previousPath = TOPIC_SEQUENCE[idx - 1];
    return isCompleted(previousPath);
  };

  const getNextTopic = (path: string) => {
    const idx = TOPIC_SEQUENCE.indexOf(path);
    if (idx >= 0 && idx < TOPIC_SEQUENCE.length - 1) {
      return TOPIC_SEQUENCE[idx + 1];
    }
    return null;
  };

  return (
    <ProgressContext.Provider value={{ completedTopics, markComplete, isUnlocked, isCompleted, getNextTopic }}>
      {children}
    </ProgressContext.Provider>
  );
};
