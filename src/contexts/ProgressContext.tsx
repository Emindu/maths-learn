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

  '/ch4/sampling-distributions',
  '/ch4/convergence-probability',
  '/ch4/convergence-probability-1',
  '/ch4/convergence-distribution',
  '/ch4/monte-carlo-approx',
  '/ch4/normal-distribution-theory',

  '/ch5/why-statistics',
  '/ch5/inference-probability-model',
  '/ch5/statistical-models',
  '/ch5/data-collection',
  '/ch5/basic-inferences',

  '/ch6/likelihood-function',
  '/ch6/maximum-likelihood-estimation',
  '/ch6/inferences-based-on-mle',
  '/ch6/distribution-free-methods',
  '/ch6/mle-asymptotics',

  '/ch7/prior-posterior-distributions',
  '/ch7/inferences-based-on-posterior',
  '/ch7/bayesian-computations',
  '/ch7/choosing-priors',
  '/ch7/bayesian-asymptotics',

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
  devMode: boolean;
  toggleDevMode: () => void;
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

  const [devMode, setDevMode] = useState<boolean>(() => {
    return localStorage.getItem('maths-learn-dev-mode') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('maths-learn-progress', JSON.stringify(completedTopics));
  }, [completedTopics]);

  useEffect(() => {
    localStorage.setItem('maths-learn-dev-mode', String(devMode));
  }, [devMode]);

  const toggleDevMode = () => setDevMode((prev) => !prev);

  const markComplete = (path: string) => {
    setCompletedTopics((prev) => {
      if (!prev.includes(path)) {
        return [...prev, path];
      }
      return prev;
    });
  };

  const isCompleted = (path: string) => completedTopics.includes(path);

  const isUnlocked = (path: string) => {
    if (devMode) return true;
    const idx = TOPIC_SEQUENCE.indexOf(path);
    if (idx <= 0) return true;
    return isCompleted(TOPIC_SEQUENCE[idx - 1]);
  };

  const getNextTopic = (path: string) => {
    const idx = TOPIC_SEQUENCE.indexOf(path);
    if (idx >= 0 && idx < TOPIC_SEQUENCE.length - 1) {
      return TOPIC_SEQUENCE[idx + 1];
    }
    return null;
  };

  return (
    <ProgressContext.Provider value={{ completedTopics, markComplete, isUnlocked, isCompleted, getNextTopic, devMode, toggleDevMode }}>
      {children}
    </ProgressContext.Provider>
  );
};
