import { erf, gamma, logGamma, logFactorial } from './mathHelpers';

export interface ParameterConfig {
  name: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

export interface PresetConfig {
  name: string;
  values: { [paramName: string]: number };
}

export interface DistributionConfig {
  id: string;
  name: string;
  tagline: string;
  support: string;
  type: 'continuous' | 'discrete';
  parameters: ParameterConfig[];
  presets: PresetConfig[];
  getStats: (params: { [key: string]: number }) => { [key: string]: number | string };
  pdf: (x: number, params: { [key: string]: number }) => number; // pmf for discrete
  cdf: (x: number, params: { [key: string]: number }) => number;
  xRange: (params: { [key: string]: number }) => [number, number];
  formulaPdf: string;
  formulaCdf: string;
  formulaOther?: { label: string; text: string };
  description: string;
  applications: { title: string; desc: string; icon: string }[];
  properties: { label: string; value: string }[];
  related: { label: string; note: string }[];
  pythonTemplate?: string;
  exercises?: { title: string; prompt: string; solution: string }[];
}

export const distributionsData: { [id: string]: DistributionConfig } = {
  normal: {
    id: 'normal',
    name: 'Normal / Gaussian',
    tagline: 'continuous · support: (-∞, ∞) · parameters: μ (mean), σ > 0 (std dev)',
    support: '(-∞, ∞)',
    type: 'continuous',
    parameters: [
      { name: 'mu', label: 'μ (mean)', min: -5, max: 5, step: 0.1, defaultValue: 0 },
      { name: 'sigma', label: 'σ (std dev)', min: 0.1, max: 4, step: 0.05, defaultValue: 1 }
    ],
    presets: [
      { name: 'standard normal', values: { mu: 0, sigma: 1 } },
      { name: 'wide / flat', values: { mu: 0, sigma: 2.5 } },
      { name: 'sharp / narrow', values: { mu: 1, sigma: 0.4 } },
      { name: 'shifted right', values: { mu: 3, sigma: 0.8 } }
    ],
    getStats: (p) => {
      const mu = p.mu;
      const sigma = p.sigma;
      return {
        mean: mu.toFixed(4),
        median: mu.toFixed(4),
        mode: mu.toFixed(4),
        variance: (sigma * sigma).toFixed(4),
        std_dev: sigma.toFixed(4),
        skewness: '0',
        kurtosis: '3'
      };
    },
    pdf: (x, p) => {
      const mu = p.mu;
      const sigma = p.sigma;
      return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2));
    },
    cdf: (x, p) => {
      const mu = p.mu;
      const sigma = p.sigma;
      return 0.5 * (1 + erf((x - mu) / (sigma * Math.sqrt(2))));
    },
    xRange: (p) => [p.mu - 4 * p.sigma, p.mu + 4 * p.sigma],
    formulaPdf: 'f(x; \\mu, \\sigma) = \\frac{1}{\\sigma \\sqrt{2\\pi}} \\exp\\left(-\\frac{1}{2}\\left(\\frac{x - \\mu}{\\sigma}\\right)^2\\right)',
    formulaCdf: 'F(x; \\mu, \\sigma) = \\frac{1}{2} \\left[ 1 + \\text{erf}\\left( \\frac{x - \\mu}{\\sigma \\sqrt{2}} \\right) \\right]',
    description: 'The Normal (Gaussian) distribution is the most important continuous distribution in statistics, forming a symmetric, bell-shaped curve where observations cluster around the central mean.',
    applications: [
      { icon: '📏', title: 'Human Heights', desc: 'Modeling the distribution of heights or weights within a biological population.' },
      { icon: '🎯', title: 'Measurement Errors', desc: 'Predicting random noise or measurement errors in scientific experiments.' },
      { icon: '📊', title: 'Standardized Testing', desc: 'Scaling SAT or IQ scores so the majority fall in the middle with tapering extremes.' }
    ],
    exercises: [{"title":"Plot the Standard Normal","prompt":"# 1. Import numpy and matplotlib.pyplot\n# 2. Generate 1000 evenly spaced x values between -4 and 4 using np.linspace\n# 3. Calculate the PDF of the standard normal distribution (mu=0, sigma=1)\n#    Hint: PDF = (1 / np.sqrt(2 * np.pi)) * np.exp(-0.5 * x**2)\n# 4. Plot x vs PDF and show it!\n\n","solution":"import numpy as np\nimport matplotlib.pyplot as plt\n\n# Generate x values\nx = np.linspace(-4, 4, 1000)\n\n# Calculate standard normal PDF\npdf = (1 / np.sqrt(2 * np.pi)) * np.exp(-0.5 * x**2)\n\n# Plot\nplt.figure(figsize=(8, 4))\nplt.plot(x, pdf, color='#21808d', linewidth=2)\nplt.fill_between(x, pdf, alpha=0.2, color='#21808d')\nplt.title('Standard Normal Distribution')\nplt.grid(alpha=0.3)\nplt.show()"}],
    properties: [
      { label: 'support', value: '(-∞, ∞)' },
      { label: 'parameters', value: 'μ (location/mean), σ > 0 (scale/std dev)' },
      { label: 'mean', value: 'μ' },
      { label: 'median', value: 'μ' },
      { label: 'mode', value: 'μ' },
      { label: 'variance', value: 'σ²' },
      { label: 'skewness', value: '0 (perfectly symmetric)' },
      { label: 'kurtosis', value: '3 (excess kurtosis = 0)' }
    ],
    related: [
      { label: 'Lognormal', note: 'if X is normal, exp(X) is Lognormal' },
      { label: 'Z-Score', note: 'standardized normal with μ = 0, σ = 1' },
      { label: 'Chi-Squared', note: 'sum of squares of independent standard normal variables' }
    ]
  },
  bernoulli: {
    id: 'bernoulli',
    name: 'Bernoulli Distribution',
    tagline: 'discrete · support: {0, 1} · parameter: p ∈ [0, 1]',
    support: '{0, 1}',
    type: 'discrete',
    parameters: [
      { name: 'p', label: 'p (probability)', min: 0, max: 1, step: 0.05, defaultValue: 0.5 }
    ],
    presets: [
      { name: 'fair coin', values: { p: 0.5 } },
      { name: 'likely success', values: { p: 0.8 } },
      { name: 'unlikely success', values: { p: 0.15 } }
    ],
    getStats: (params) => {
      const p = params.p;
      const variance = p * (1 - p);
      const skewness = (1 - 2 * p) / (Math.sqrt(variance) || 1);
      const kurtosis = (1 - 6 * p * (1 - p)) / (variance || 1) + 3;
      return {
        mean: p.toFixed(4),
        median: p < 0.5 ? '0' : (p > 0.5 ? '1' : '0.5'),
        mode: p < 0.5 ? '0' : (p > 0.5 ? '1' : '0, 1'),
        variance: variance.toFixed(4),
        std_dev: Math.sqrt(variance).toFixed(4),
        skewness: isNaN(skewness) ? '—' : skewness.toFixed(4),
        kurtosis: isNaN(kurtosis) ? '—' : kurtosis.toFixed(4)
      };
    },
    pdf: (x, params) => {
      const p = params.p;
      const k = Math.round(x);
      if (k === 0) return 1 - p;
      if (k === 1) return p;
      return 0;
    },
    cdf: (x, params) => {
      const p = params.p;
      if (x < 0) return 0;
      if (x < 1) return 1 - p;
      return 1;
    },
    xRange: () => [-0.5, 1.5],
    formulaPdf: 'P(X = k) = p^k (1 - p)^{1 - k} \\quad \\text{for } k \\in \\{0, 1\\}',
    formulaCdf: 'F(k) = \\begin{cases} 1 - p & k = 0 \\\\ 1 & k = 1 \\end{cases}',
    description: 'The Bernoulli distribution is the simplest discrete distribution, modeling a single trial with only two possible outcomes: success or failure.',
    applications: [
      { icon: '🪙', title: 'Coin Tosses', desc: 'Flipping a single coin to see if it lands on Heads (1) or Tails (0).' },
      { icon: '📧', title: 'Spam Detection', desc: 'Classifying a single incoming email as Spam (1) or Not Spam (0).' },
      { icon: '🖱️', title: 'Ad Click-Throughs', desc: 'Modeling whether a specific user clicks an ad (1) or ignores it (0).' }
    ],
    exercises: [{"title":"Simulate a Biased Coin","prompt":"# 1. Import random\n# 2. Set p = 0.7 (Biased towards Heads)\n# 3. Simulate 1000 coin flips using a loop and random.random()\n# 4. Print the total number of Heads (successes) and the empirical probability.\n\n","solution":"import random\n\np = 0.7\ntrials = 1000\nheads = 0\n\nfor _ in range(trials):\n    if random.random() < p:\n        heads += 1\n\nempirical_p = heads / trials\nprint(f'Total Heads: {heads} out of {trials}')\nprint(f'Empirical Probability: {empirical_p:.4f}')\nprint(f'Theoretical Probability: {p:.4f}')"}],
    properties: [
      { label: 'support', value: 'k ∈ {0, 1}' },
      { label: 'parameter', value: 'p ∈ [0, 1] (probability of success)' },
      { label: 'mean', value: 'p' },
      { label: 'median', value: '0 (p < 0.5); 1 (p > 0.5); 0.5 (p = 0.5)' },
      { label: 'mode', value: '0 (p < 0.5); 1 (p > 0.5)' },
      { label: 'variance', value: 'p · (1 - p)' },
      { label: 'skewness', value: '(1 - 2p) / √(p(1-p))' },
      { label: 'kurtosis', value: '(1 - 6p(1-p)) / (p(1-p)) + 3' }
    ],
    related: [
      { label: 'Binomial', note: 'sum of n independent Bernoulli trials' },
      { label: 'Geometric', note: 'number of Bernoulli trials before the first success' }
    ],
    pythonTemplate: `# Bernoulli Distribution Simulation with Visualization
import random
import matplotlib.pyplot as plt

def simulate_bernoulli(p, trials=20):
    print(f"Simulating {trials} Bernoulli trials with p={p}\n")
    successes = 0
    results = []
    
    for i in range(trials):
        outcome = 1 if random.random() < p else 0
        successes += outcome
        results.append(outcome)
        
    print(f"Total Successes: {successes} out of {trials}")
    print(f"Empirical Probability: {successes/trials:.2f} (Expected: {p})")
    
    # Visualize the results
    plt.figure(figsize=(6, 4))
    plt.bar(['Failure (0)', 'Success (1)'], [trials - successes, successes], color=['#e74c3c', '#2ecc71'])
    plt.title(f'Bernoulli Trials (n={trials}, p={p})')
    plt.ylabel('Count')
    
    # Render the plot in the browser
    plt.show()

# Run the simulation with p = 0.6
simulate_bernoulli(0.6, 20)`
  },
  beta: {
    id: 'beta',
    name: 'Beta Distribution',
    tagline: 'continuous · support: [0, 1] · parameters: α > 0, β > 0',
    support: '[0, 1]',
    type: 'continuous',
    parameters: [
      { name: 'alpha', label: 'α (shape)', min: 0.1, max: 10, step: 0.1, defaultValue: 2 },
      { name: 'beta', label: 'β (shape)', min: 0.1, max: 10, step: 0.1, defaultValue: 2 }
    ],
    presets: [
      { name: 'symmetric / bell', values: { alpha: 2, beta: 2 } },
      { name: 'uniform (flat)', values: { alpha: 1, beta: 1 } },
      { name: 'u-shaped', values: { alpha: 0.5, beta: 0.5 } },
      { name: 'right-skewed', values: { alpha: 2, beta: 5 } },
      { name: 'left-skewed', values: { alpha: 5, beta: 2 } }
    ],
    getStats: (p) => {
      const a = p.alpha;
      const b = p.beta;
      const mean = a / (a + b);
      const variance = (a * b) / (Math.pow(a + b, 2) * (a + b + 1));
      const skewness = (2 * (b - a) * Math.sqrt(a + b + 1)) / ((a + b + 2) * Math.sqrt(a * b));
      let mode = '—';
      if (a > 1 && b > 1) mode = ((a - 1) / (a + b - 2)).toFixed(4);
      else if (a < 1 && b < 1) mode = '0 and 1';
      else if (a < 1) mode = '0';
      else if (b < 1) mode = '1';

      return {
        mean: mean.toFixed(4),
        median: 'approx. ' + mean.toFixed(3),
        mode,
        variance: variance.toFixed(4),
        std_dev: Math.sqrt(variance).toFixed(4),
        skewness: skewness.toFixed(4),
        kurtosis: ((6 * (Math.pow(a - b, 2) * (a + b + 1) - a * b * (a + b + 2))) / (a * b * (a + b + 2) * (a + b + 3)) + 3).toFixed(4)
      };
    },
    pdf: (x, p) => {
      const a = p.alpha;
      const b = p.beta;
      if (x <= 0 || x >= 1) return 0;
      const logB = logGamma(a) + logGamma(b) - logGamma(a + b);
      return Math.exp((a - 1) * Math.log(x) + (b - 1) * Math.log(1 - x) - logB);
    },
    cdf: (x, p) => {
      // Simpson's rule numerical integration for simplicity
      const a = p.alpha;
      const b = p.beta;
      if (x <= 0) return 0;
      if (x >= 1) return 1;
      const n = 200;
      const h = x / n;
      // Get function values avoiding exact 0/1 limits where density might blow up
      const pdfEval = (val: number) => {
        const eps = 1e-6;
        const clamped = Math.max(eps, Math.min(1 - eps, val));
        const logB = logGamma(a) + logGamma(b) - logGamma(a + b);
        return Math.exp((a - 1) * Math.log(clamped) + (b - 1) * Math.log(1 - clamped) - logB);
      };
      let sum = pdfEval(0.0001) + pdfEval(x - 0.0001);
      for (let i = 1; i < n; i++) {
        sum += (i % 2 === 0 ? 2 : 4) * pdfEval(i * h);
      }
      return Math.min(1, Math.max(0, (h / 3) * sum));
    },
    xRange: () => [0, 1],
    formulaPdf: 'f(x; \\alpha, \\beta) = \\frac{x^{\\alpha-1}(1-x)^{\\beta-1}}{B(\\alpha, \\beta)} \\quad \\text{for } x \\in [0, 1]',
    formulaCdf: 'F(x; \\alpha, \\beta) = \\frac{B(x; \\alpha, \\beta)}{B(\\alpha, \\beta)} = I_x(\\alpha, \\beta)',
    description: 'The Beta distribution is incredibly flexible, bounded between 0 and 1, and widely used to model unknown probabilities or proportions.',
    applications: [
      { icon: '⚾', title: 'Batting Averages', desc: 'Updating a baseball player\'s expected batting average as they play more games.' },
      { icon: '🛒', title: 'Conversion Rates', desc: 'Modeling the uncertain probability that a user will purchase a product after clicking an ad.' },
      { icon: '🩺', title: 'Disease Prevalence', desc: 'Estimating the true percentage of a population infected with a disease based on sample tests.' }
    ],
    exercises: [],
    properties: [
      { label: 'support', value: '[0, 1]' },
      { label: 'parameters', value: 'α > 0 (shape), β > 0 (shape)' },
      { label: 'mean', value: 'α / (α + β)' },
      { label: 'mode', value: '(α - 1) / (α + β - 2)  (for α, β > 1)' },
      { label: 'variance', value: '(α · β) / ((α + β)² · (α + β + 1))' }
    ],
    related: [
      { label: 'Uniform', note: 'Beta(1, 1) is equivalent to a continuous Uniform(0, 1) distribution' },
      { label: 'Dirichlet', note: 'multivariate generalisation of the Beta distribution' }
    ]
  },
  binomial: {
    id: 'binomial',
    name: 'Binomial Distribution',
    tagline: 'discrete · support: {0, ..., n} · parameters: n (trials), p ∈ [0, 1]',
    support: '{0, ..., n}',
    type: 'discrete',
    parameters: [
      { name: 'n', label: 'n (trials)', min: 1, max: 60, step: 1, defaultValue: 20 },
      { name: 'p', label: 'p (probability)', min: 0, max: 1, step: 0.05, defaultValue: 0.5 }
    ],
    presets: [
      { name: 'fair coin flip', values: { n: 20, p: 0.5 } },
      { name: 'skewed success', values: { n: 30, p: 0.2 } },
      { name: 'high sample success', values: { n: 50, p: 0.75 } }
    ],
    getStats: (params) => {
      const n = params.n;
      const p = params.p;
      const variance = n * p * (1 - p);
      return {
        mean: (n * p).toFixed(4),
        median: Math.round(n * p).toString(),
        mode: Math.floor((n + 1) * p).toString(),
        variance: variance.toFixed(4),
        std_dev: Math.sqrt(variance).toFixed(4),
        skewness: ((1 - 2 * p) / Math.sqrt(variance)).toFixed(4),
        kurtosis: ((1 - 6 * p * (1 - p)) / variance + 3).toFixed(4)
      };
    },
    pdf: (x, params) => {
      const n = Math.round(params.n);
      const p = params.p;
      const k = Math.round(x);
      if (k < 0 || k > n) return 0;
      if (p === 0) return k === 0 ? 1 : 0;
      if (p === 1) return k === n ? 1 : 0;
      const lnPmf = logFactorial(n) - logFactorial(k) - logFactorial(n - k) + k * Math.log(p) + (n - k) * Math.log(1 - p);
      return Math.exp(lnPmf);
    },
    cdf: (x, params) => {
      const n = Math.round(params.n);
      const k = Math.floor(x);
      if (k < 0) return 0;
      if (k >= n) return 1;
      let sum = 0;
      for (let i = 0; i <= k; i++) {
        sum += distributionsData.binomial.pdf(i, params);
      }
      return sum;
    },
    xRange: (p) => [-0.5, p.n + 0.5],
    formulaPdf: 'P(X = k) = \\binom{n}{k} p^k (1 - p)^{n - k} \\quad \\text{for } k \\in \\{0, \\dots, n\\}',
    formulaCdf: 'F(k) = \\sum_{i=0}^k \\binom{n}{i} p^i (1 - p)^{n - i}',
    description: 'The Binomial distribution models the number of successes in a fixed number of independent trials, each with the same probability of success.',
    applications: [
      { icon: '🏭', title: 'Quality Control', desc: 'Counting the number of defective parts in a random batch of 100 manufactured items.' },
      { icon: '⚕️', title: 'Clinical Trials', desc: 'Modeling how many patients recover out of a group of 50 given a new drug.' },
      { icon: '🎲', title: 'Multiple Bets', desc: 'Calculating the odds of winning exactly 3 out of 10 roulette bets.' }
    ],
    exercises: [{"title":"Coin Flips Distribution","prompt":"# 1. Import numpy and matplotlib.pyplot\n# 2. Simulate flipping 10 fair coins (n=10, p=0.5) 10,000 times using np.random.binomial\n# 3. Plot a histogram of the results.\n\n","solution":"import numpy as np\nimport matplotlib.pyplot as plt\n\n# Simulate 10000 trials of flipping 10 fair coins\nn = 10\np = 0.5\nresults = np.random.binomial(n, p, size=10000)\n\n# Plot histogram\nplt.figure(figsize=(8, 4))\nplt.hist(results, bins=np.arange(-0.5, 11.5, 1), rwidth=0.8, color='#21808d', alpha=0.8)\nplt.title('Binomial Distribution (n=10, p=0.5)')\nplt.xlabel('Number of Heads')\nplt.ylabel('Frequency')\nplt.xticks(range(11))\nplt.grid(axis='y', alpha=0.3)\nplt.show()"}],
    properties: [
      { label: 'support', value: 'k ∈ {0, ..., n}' },
      { label: 'mean', value: 'n · p' },
      { label: 'mode', value: '⌊(n + 1)p⌋' },
      { label: 'variance', value: 'n · p · (1 - p)' }
    ],
    related: [
      { label: 'Bernoulli', note: 'Binomial distribution with n = 1' },
      { label: 'Poisson', note: 'approximation when n is large and p is small (np = λ)' },
      { label: 'Normal', note: 'limit of Binomial as n becomes very large (De Moivre-Laplace theorem)' }
    ]
  },
  exponential: {
    id: 'exponential',
    name: 'Exponential Distribution',
    tagline: 'continuous · support: [0, ∞) · parameter: λ > 0 (rate)',
    support: '[0, ∞)',
    type: 'continuous',
    parameters: [
      { name: 'lambda', label: 'λ (rate)', min: 0.1, max: 3, step: 0.05, defaultValue: 1 }
    ],
    presets: [
      { name: 'unit', values: { lambda: 1 } },
      { name: 'slow', values: { lambda: 0.5 } },
      { name: 'fast', values: { lambda: 2 } },
      { name: 'very slow', values: { lambda: 0.25 } }
    ],
    getStats: (p) => {
      const lam = p.lambda;
      return {
        mean: (1 / lam).toFixed(4),
        median: (Math.LN2 / lam).toFixed(4),
        mode: '0',
        variance: (1 / (lam * lam)).toFixed(4),
        std_dev: (1 / lam).toFixed(4),
        skewness: '2',
        kurtosis: '9'
      };
    },
    pdf: (x, p) => {
      const lam = p.lambda;
      return x < 0 ? 0 : lam * Math.exp(-lam * x);
    },
    cdf: (x, p) => {
      const lam = p.lambda;
      return x < 0 ? 0 : 1 - Math.exp(-lam * x);
    },
    xRange: (p) => [0, Math.min(12, 6 / p.lambda)],
    formulaPdf: 'f(x; \\lambda) = \\lambda e^{-\\lambda x} \\quad (x \\ge 0)',
    formulaCdf: 'F(x; \\lambda) = 1 - e^{-\\lambda x} \\quad (x \\ge 0)',
    description: 'The Exponential distribution models the continuous time between independent events occurring at a constant average rate.',
    applications: [
      { icon: '⏲️', title: 'Component Failure', desc: 'Modeling the lifespan of electronic components before they burn out.' },
      { icon: '🚌', title: 'Wait Times', desc: 'Predicting the waiting time until the next bus arrives at a station.' },
      { icon: '⚛️', title: 'Radioactive Decay', desc: 'Measuring the time until the next particle is emitted by a radioactive isotope.' }
    ],
    exercises: [{"title":"Memoryless Property","prompt":"# The exponential distribution is memoryless.\n# 1. Generate 10,000 samples from an exponential distribution with lambda=1 (scale=1) using np.random.exponential.\n# 2. Calculate the probability that a sample is > 2.\n# 3. Calculate the probability that a sample is > 3 GIVEN it is already > 1.\n# 4. Compare the two probabilities (they should be roughly equal!).\n\n","solution":"import numpy as np\n\nsamples = np.random.exponential(scale=1.0, size=100000)\n\n# P(X > 2)\nprob_gt_2 = np.sum(samples > 2) / len(samples)\n\n# P(X > 3 | X > 1) = P(X > 3) / P(X > 1)\nprob_gt_3 = np.sum(samples > 3) / len(samples)\nprob_gt_1 = np.sum(samples > 1) / len(samples)\nconditional_prob = prob_gt_3 / prob_gt_1\n\nprint(f'P(X > 2) = {prob_gt_2:.4f}')\nprint(f'P(X > 3 | X > 1) = {conditional_prob:.4f}')\nprint('The probabilities match, demonstrating the memoryless property!')"}],
    properties: [
      { label: 'support', value: '[0, ∞)' },
      { label: 'mean', value: '1/λ' },
      { label: 'median', value: 'ln(2)/λ' },
      { label: 'variance', value: '1/λ²' },
      { label: 'skewness', value: '2' },
      { label: 'kurtosis', value: '9' }
    ],
    related: [
      { label: 'Gamma', note: 'Exponential is a special case with shape alpha = 1' },
      { label: 'Poisson', note: 'counts events per unit time; inter-arrival times are Exponential' },
      { label: 'Geometric', note: 'discrete analogue (also memoryless)' }
    ]
  },
  laplace: {
    id: 'laplace',
    name: 'Laplace Distribution',
    tagline: 'continuous · support: (-∞, ∞) · parameters: μ (location), b > 0 (scale)',
    support: '(-∞, ∞)',
    type: 'continuous',
    parameters: [
      { name: 'mu', label: 'μ (location)', min: -5, max: 5, step: 0.1, defaultValue: 0 },
      { name: 'b', label: 'b (scale)', min: 0.1, max: 4, step: 0.05, defaultValue: 1 }
    ],
    presets: [
      { name: 'standard Laplace', values: { mu: 0, b: 1 } },
      { name: 'wide / fat', values: { mu: 0, b: 2 } },
      { name: 'sharp / narrow', values: { mu: 1, b: 0.4 } }
    ],
    getStats: (p) => {
      const mu = p.mu;
      const b = p.b;
      return {
        mean: mu.toFixed(4),
        median: mu.toFixed(4),
        mode: mu.toFixed(4),
        variance: (2 * b * b).toFixed(4),
        std_dev: (b * Math.sqrt(2)).toFixed(4),
        skewness: '0',
        kurtosis: '6'
      };
    },
    pdf: (x, p) => {
      const mu = p.mu;
      const b = p.b;
      return (1 / (2 * b)) * Math.exp(-Math.abs(x - mu) / b);
    },
    cdf: (x, p) => {
      const mu = p.mu;
      const b = p.b;
      return x < mu ? 0.5 * Math.exp((x - mu) / b) : 1 - 0.5 * Math.exp(-(x - mu) / b);
    },
    xRange: (p) => [p.mu - 6 * p.b, p.mu + 6 * p.b],
    formulaPdf: 'f(x; \\mu, b) = \\frac{1}{2b} \\exp\\left(-\\frac{|x - \\mu|}{b}\\right)',
    formulaCdf: 'F(x; \\mu, b) = \\begin{cases} \\frac{1}{2} \\exp\\left(\\frac{x-\\mu}{b}\\right) & \\text{if } x < \\mu \\\\ 1 - \\frac{1}{2} \\exp\\left(-\\frac{x-\\mu}{b}\\right) & \\text{if } x \\ge \\mu \\end{cases}',
    description: 'The Laplace (double exponential) distribution is symmetric like the normal distribution but has a sharper peak and heavier tails.',
    applications: [
      { icon: '📈', title: 'Financial Returns', desc: 'Modeling daily stock price returns, which often feature sudden, extreme spikes.' },
      { icon: '🗣️', title: 'Speech Recognition', desc: 'Modeling the distribution of speech signals for audio compression algorithms.' },
      { icon: '🧠', title: 'Machine Learning', desc: 'Used in L1 regularization (Lasso) to encourage sparsity in neural network weights.' }
    ],
    exercises: [],
    properties: [
      { label: 'support', value: '(-∞, ∞)' },
      { label: 'mean', value: 'μ' },
      { label: 'median', value: 'μ' },
      { label: 'variance', value: '2b²' },
      { label: 'skewness', value: '0' },
      { label: 'kurtosis', value: '6 (excess kurtosis = 3)' }
    ],
    related: [
      { label: 'Normal', note: 'Laplace has much sharper peak and heavier tails' },
      { label: 'Exponential', note: 'absolute value of X - μ is Exponential' }
    ]
  },
  gemma: {
    id: 'gemma',
    name: 'Gamma Distribution',
    tagline: 'continuous · support: (0, ∞) · parameters: k > 0 (shape), θ > 0 (scale)',
    support: '(0, ∞)',
    type: 'continuous',
    parameters: [
      { name: 'k', label: 'k (shape)', min: 0.5, max: 10, step: 0.1, defaultValue: 2 },
      { name: 'theta', label: 'θ (scale)', min: 0.1, max: 4, step: 0.05, defaultValue: 1 }
    ],
    presets: [
      { name: 'exponential-like', values: { k: 1, theta: 1 } },
      { name: 'bell-shaped', values: { k: 5, theta: 0.5 } },
      { name: 'skewed', values: { k: 2, theta: 1.5 } }
    ],
    getStats: (p) => {
      const k = p.k;
      const th = p.theta;
      return {
        mean: (k * th).toFixed(4),
        median: 'approx. ' + (k * th * (1 - 1 / (9 * k))).toFixed(3),
        mode: k >= 1 ? ((k - 1) * th).toFixed(4) : '0',
        variance: (k * th * th).toFixed(4),
        std_dev: Math.sqrt(k * th * th).toFixed(4),
        skewness: (2 / Math.sqrt(k)).toFixed(4),
        kurtosis: (6 / k + 3).toFixed(4)
      };
    },
    pdf: (x, p) => {
      const k = p.k;
      const th = p.theta;
      if (x <= 0) return 0;
      return (1 / (Math.pow(th, k) * gamma(k))) * Math.pow(x, k - 1) * Math.exp(-x / th);
    },
    cdf: (x, p) => {
      // Simpson's rule integration
      const k = p.k;
      const th = p.theta;
      if (x <= 0) return 0;
      const n = 200;
      const h = x / n;
      const pdfEval = (val: number) => {
        if (val <= 0) return 0;
        return (1 / (Math.pow(th, k) * gamma(k))) * Math.pow(val, k - 1) * Math.exp(-val / th);
      };
      let sum = pdfEval(0.0001) + pdfEval(x - 0.0001);
      for (let i = 1; i < n; i++) {
        sum += (i % 2 === 0 ? 2 : 4) * pdfEval(i * h);
      }
      return Math.min(1, Math.max(0, (h / 3) * sum));
    },
    xRange: (p) => [0, Math.min(30, 2.5 * p.k * p.theta + 4 * Math.sqrt(p.k) * p.theta)],
    formulaPdf: 'f(x; k, \\theta) = \\frac{x^{k-1} e^{-x/\\theta}}{\\theta^k \\Gamma(k)} \\quad (x > 0)',
    formulaCdf: 'F(x; k, \\theta) = \\frac{\\gamma(k, x/\\theta)}{\\Gamma(k)}',
    description: 'The Gamma distribution is a versatile, right-skewed distribution often used to model wait times until the k-th event occurs.',
    applications: [
      { icon: '🌧️', title: 'Rainfall Amounts', desc: 'Modeling the volume of rainfall accumulated in a specific region over a month.' },
      { icon: '🏥', title: 'Hospital Stays', desc: 'Predicting the total length of time a patient remains hospitalized.' },
      { icon: '🏭', title: 'Inventory Restocking', desc: 'Estimating the total time until a warehouse needs to reorder 5 specific components.' }
    ],
    exercises: [],
    properties: [
      { label: 'support', value: '(0, ∞)' },
      { label: 'mean', value: 'k · θ' },
      { label: 'variance', value: 'k · θ²' },
      { label: 'skewness', value: '2 / √k' }
    ],
    related: [
      { label: 'Exponential', note: 'equivalent to Gamma with k = 1' },
      { label: 'Chi-Squared', note: 'Chi-Squared(ν) is equivalent to Gamma(ν/2, 2)' }
    ]
  },
  lognormal: {
    id: 'lognormal',
    name: 'Log-Normal Distribution',
    tagline: 'continuous · support: (0, ∞) · parameters: μ (log-mean), σ > 0 (log-scale)',
    support: '(0, ∞)',
    type: 'continuous',
    parameters: [
      { name: 'mu', label: 'μ (log-mean)', min: -2, max: 2, step: 0.1, defaultValue: 0 },
      { name: 'sigma', label: 'σ (log-scale)', min: 0.1, max: 2, step: 0.05, defaultValue: 0.5 }
    ],
    presets: [
      { name: 'standard log-normal', values: { mu: 0, sigma: 0.5 } },
      { name: 'highly skewed', values: { mu: 0, sigma: 1 } },
      { name: 'flat / heavy', values: { mu: 0.5, sigma: 0.8 } }
    ],
    getStats: (p) => {
      const mu = p.mu;
      const sig = p.sigma;
      const es2 = Math.exp(sig * sig);
      const mean = Math.exp(mu + (sig * sig) / 2);
      const variance = (es2 - 1) * Math.exp(2 * mu + sig * sig);
      return {
        mean: mean.toFixed(4),
        median: Math.exp(mu).toFixed(4),
        mode: Math.exp(mu - sig * sig).toFixed(4),
        variance: variance.toFixed(4),
        std_dev: Math.sqrt(variance).toFixed(4),
        skewness: ((es2 + 2) * Math.sqrt(es2 - 1)).toFixed(4),
        kurtosis: (Math.pow(es2, 4) + 2 * Math.pow(es2, 3) + 3 * Math.pow(es2, 2) - 3).toFixed(4)
      };
    },
    pdf: (x, p) => {
      const mu = p.mu;
      const sig = p.sigma;
      if (x <= 0) return 0;
      return (1 / (x * sig * Math.sqrt(2 * Math.PI))) * Math.exp(-Math.pow(Math.log(x) - mu, 2) / (2 * sig * sig));
    },
    cdf: (x, p) => {
      const mu = p.mu;
      const sig = p.sigma;
      if (x <= 0) return 0;
      return 0.5 * (1 + erf((Math.log(x) - mu) / (sig * Math.sqrt(2))));
    },
    xRange: (p) => [0, Math.min(25, Math.exp(p.mu + 3 * p.sigma))],
    formulaPdf: 'f(x; \\mu, \\sigma) = \\frac{1}{x\\sigma\\sqrt{2\\pi}} \\exp\\left(-\\frac{(\\ln x - \\mu)^2}{2\\sigma^2}\\right) \\quad (x > 0)',
    formulaCdf: 'F(x; \\mu, \\sigma) = \\frac{1}{2} \\left[ 1 + \\text{erf}\\left( \\frac{\\ln x - \\mu}{\\sigma\\sqrt{2}} \\right) \\right]',
    description: 'The Lognormal distribution models right-skewed data where the natural logarithm of the values follows a normal distribution.',
    applications: [
      { icon: '📈', title: 'Stock Prices', desc: 'Modeling future asset prices, which cannot drop below zero but can grow exponentially.' },
      { icon: '🦠', title: 'Disease Incubation', desc: 'Predicting the time it takes for an infectious disease to show symptoms after exposure.' },
      { icon: '💬', title: 'Comment Lengths', desc: 'Modeling the length of posts on internet forums or social media.' }
    ],
    exercises: [],
    properties: [
      { label: 'support', value: '(0, ∞)' },
      { label: 'mean', value: 'exp(μ + σ²/2)' },
      { label: 'median', value: 'exp(μ)' },
      { label: 'variance', value: '(exp(σ²) - 1) · exp(2μ + σ²)' }
    ],
    related: [
      { label: 'Normal', note: 'ln(X) yields a Normal distribution' }
    ]
  },
  pareto: {
    id: 'pareto',
    name: 'Pareto Distribution',
    tagline: 'continuous · support: [x_m, ∞) · parameters: x_m > 0 (scale), α > 0 (shape)',
    support: '[x_m, ∞)',
    type: 'continuous',
    parameters: [
      { name: 'xm', label: 'x_m (scale)', min: 0.5, max: 3, step: 0.1, defaultValue: 1 },
      { name: 'alpha', label: 'α (shape)', min: 1.1, max: 5, step: 0.1, defaultValue: 2 }
    ],
    presets: [
      { name: '80/20 rule (α = 1.16)', values: { xm: 1, alpha: 1.16 } },
      { name: 'moderate skew', values: { xm: 1, alpha: 2 } },
      { name: 'standard Pareto', values: { xm: 1, alpha: 3 } }
    ],
    getStats: (p) => {
      const xm = p.xm;
      const a = p.alpha;
      const mean = a > 1 ? (a * xm) / (a - 1) : Infinity;
      const variance = a > 2 ? (a * xm * xm) / (Math.pow(a - 1, 2) * (a - 2)) : (a > 1 ? Infinity : 'undefined');
      return {
        mean: typeof mean === 'number' ? mean.toFixed(4) : mean,
        median: (xm * Math.pow(2, 1 / a)).toFixed(4),
        mode: xm.toFixed(4),
        variance: typeof variance === 'number' ? variance.toFixed(4) : variance,
        std_dev: typeof variance === 'number' ? (variance === Infinity ? '∞' : Math.sqrt(variance).toFixed(4)) : 'undefined',
        skewness: a > 3 ? ((2 * (1 + a)) / (a - 3) * Math.sqrt((a - 2) / a)).toFixed(4) : 'undefined',
        kurtosis: a > 4 ? ((6 * (a * a * a + a * a - 6 * a - 2)) / (a * (a - 3) * (a - 4)) + 3).toFixed(4) : 'undefined'
      };
    },
    pdf: (x, p) => {
      const xm = p.xm;
      const a = p.alpha;
      if (x < xm) return 0;
      return (a * Math.pow(xm, a)) / Math.pow(x, a + 1);
    },
    cdf: (x, p) => {
      const xm = p.xm;
      const a = p.alpha;
      if (x < xm) return 0;
      return 1 - Math.pow(xm / x, a);
    },
    xRange: (p) => [p.xm, Math.min(30, p.xm * 8)],
    formulaPdf: 'f(x; x_m, \\alpha) = \\frac{\\alpha x_m^\\alpha}{x^{\\alpha+1}} \\quad \\text{for } x \\ge x_m',
    formulaCdf: 'F(x; x_m, \\alpha) = 1 - \\left(\\frac{x_m}{x}\\right)^\\alpha \\quad \\text{for } x \\ge x_m',
    description: 'The Pareto distribution is a specific power-law distribution that famously represents the \'80/20 rule\' of wealth inequality.',
    applications: [
      { icon: '💰', title: 'Wealth Distribution', desc: 'Modeling economies where 80% of the wealth is owned by 20% of the population.' },
      { icon: '🏢', title: 'City Sizes', desc: 'Predicting the population sizes of cities, where a few megacities dwarf all others.' },
      { icon: '🐞', title: 'Software Bugs', desc: 'Observing that 80% of system crashes are caused by 20% of the identified bugs.' }
    ],
    exercises: [],
    properties: [
      { label: 'support', value: '[x_m, ∞)' },
      { label: 'mean', value: 'α · x_m / (α - 1)  (for α > 1)' },
      { label: 'mode', value: 'x_m' },
      { label: 'variance', value: 'α · x_m² / ((α - 1)²(α - 2))  (for α > 2)' }
    ],
    related: [
      { label: 'Power Law', note: 'closely related scale-free distribution family' }
    ]
  },
  poisson: {
    id: 'poisson',
    name: 'Poisson Distribution',
    tagline: 'discrete · support: {0, 1, 2, ...} · parameter: λ > 0 (average rate)',
    support: '{0, 1, 2, ...}',
    type: 'discrete',
    parameters: [
      { name: 'lambda', label: 'λ (rate)', min: 0.5, max: 20, step: 0.5, defaultValue: 4 }
    ],
    presets: [
      { name: 'rare events', values: { lambda: 1 } },
      { name: 'moderate arrivals', values: { lambda: 4 } },
      { name: 'high frequency', values: { lambda: 12 } }
    ],
    getStats: (p) => {
      const lam = p.lambda;
      return {
        mean: lam.toFixed(4),
        median: Math.round(lam + 1 / 3 - 0.02 / lam).toString(),
        mode: Math.floor(lam).toString(),
        variance: lam.toFixed(4),
        std_dev: Math.sqrt(lam).toFixed(4),
        skewness: (1 / Math.sqrt(lam)).toFixed(4),
        kurtosis: (1 / lam + 3).toFixed(4)
      };
    },
    pdf: (x, p) => {
      const lam = p.lambda;
      const k = Math.round(x);
      if (k < 0) return 0;
      return Math.exp(k * Math.log(lam) - lam - logFactorial(k));
    },
    cdf: (x, p) => {
      const k = Math.floor(x);
      if (k < 0) return 0;
      let sum = 0;
      for (let i = 0; i <= k; i++) {
        sum += distributionsData.poisson.pdf(i, p);
      }
      return sum;
    },
    xRange: (p) => [-0.5, Math.max(10, p.lambda + 4 * Math.sqrt(p.lambda))],
    formulaPdf: 'P(X = k) = \\frac{\\lambda^k e^{-\\lambda}}{k!} \\quad \\text{for } k \\in \\{0, 1, 2, \\dots\\}',
    formulaCdf: 'F(k; \\lambda) = e^{-\\lambda} \\sum_{i=0}^{\\lfloor k \\rfloor} \\frac{\\lambda^i}{i!} = \\frac{\\Gamma(\\lfloor k+1 \\rfloor, \\lambda)}{\\lfloor k \\rfloor !}',
    description: 'The Poisson distribution models the number of independent events occurring in a fixed interval of time or space.',
    applications: [
      { icon: '📞', title: 'Call Centers', desc: 'Predicting the number of support calls received per hour to optimize staffing.' },
      { icon: '🌐', title: 'Website Traffic', desc: 'Modeling the number of HTTP requests hitting a server per minute.' },
      { icon: '🌠', title: 'Meteor Showers', desc: 'Estimating the number of shooting stars visible in the night sky per hour.' }
    ],
    exercises: [{"title":"Simulate Call Center","prompt":"# A call center receives an average of 5 calls per minute (lambda = 5).\n# 1. Simulate 1000 minutes using np.random.poisson(5, 1000).\n# 2. Find the maximum number of calls received in a single minute.\n# 3. Plot a histogram of the calls per minute.\n\n","solution":"import numpy as np\nimport matplotlib.pyplot as plt\n\nlam = 5\nminutes = 1000\ncalls = np.random.poisson(lam, minutes)\n\nmax_calls = np.max(calls)\nprint(f'Maximum calls in a single minute: {max_calls}')\n\nplt.figure(figsize=(8, 4))\nplt.hist(calls, bins=np.arange(-0.5, max_calls+1.5, 1), rwidth=0.8, color='#d97706', alpha=0.8)\nplt.title('Poisson Distribution (lambda = 5)')\nplt.xlabel('Calls per minute')\nplt.ylabel('Frequency')\nplt.grid(axis='y', alpha=0.3)\nplt.show()"}],
    properties: [
      { label: 'support', value: 'k ∈ {0, 1, 2, ...}' },
      { label: 'mean', value: 'λ' },
      { label: 'mode', value: '⌊λ⌋' },
      { label: 'variance', value: 'λ (always equals the mean)' },
      { label: 'skewness', value: '1 / √λ' }
    ],
    related: [
      { label: 'Exponential', note: 'waiting times between independent Poisson events' },
      { label: 'Binomial', note: 'Poisson is the limit of Binomial as n → ∞, p → 0, np = λ' }
    ]
  },
  powerlaw: {
    id: 'powerlaw',
    name: 'Power Law Distribution',
    tagline: 'continuous · support: [x_min, ∞) · parameters: x_min > 0, α > 1 (exponent)',
    support: '[x_min, ∞)',
    type: 'continuous',
    parameters: [
      { name: 'xmin', label: 'x_min', min: 0.5, max: 3, step: 0.1, defaultValue: 1 },
      { name: 'alpha', label: 'α (exponent)', min: 1.5, max: 5, step: 0.1, defaultValue: 2.5 }
    ],
    presets: [
      { name: 'scale-free network (α=2.2)', values: { xmin: 1, alpha: 2.2 } },
      { name: 'standard scale-free', values: { xmin: 1, alpha: 2.5 } },
      { name: 'steep exponent', values: { xmin: 1, alpha: 3.5 } }
    ],
    getStats: (p) => {
      const xmin = p.xmin;
      const a = p.alpha;
      const mean = a > 2 ? ((a - 1) * xmin) / (a - 2) : Infinity;
      const variance = a > 3 ? ((a - 1) * xmin * xmin) / (Math.pow(a - 2, 2) * (a - 3)) : (a > 2 ? Infinity : 'undefined');
      return {
        mean: typeof mean === 'number' ? mean.toFixed(4) : mean,
        median: (xmin * Math.pow(2, 1 / (a - 1))).toFixed(4),
        mode: xmin.toFixed(4),
        variance: typeof variance === 'number' ? variance.toFixed(4) : variance,
        std_dev: typeof variance === 'number' ? (variance === Infinity ? '∞' : Math.sqrt(variance).toFixed(4)) : 'undefined',
        skewness: a > 4 ? 'defined' : 'undefined',
        kurtosis: a > 5 ? 'defined' : 'undefined'
      };
    },
    pdf: (x, p) => {
      const xmin = p.xmin;
      const a = p.alpha;
      if (x < xmin) return 0;
      return ((a - 1) / xmin) * Math.pow(x / xmin, -a);
    },
    cdf: (x, p) => {
      const xmin = p.xmin;
      const a = p.alpha;
      if (x < xmin) return 0;
      return 1 - Math.pow(xmin / x, a - 1);
    },
    xRange: (p) => [p.xmin, Math.min(30, p.xmin * 8)],
    formulaPdf: 'f(x; x_{\\text{min}}, \\alpha) = \\frac{\\alpha - 1}{x_{\\text{min}}} \\left(\\frac{x}{x_{\\text{min}}}\\right)^{-\\alpha} \\quad \\text{for } x \\ge x_{\\text{min}}',
    formulaCdf: 'F(x; x_{\\text{min}}, \\alpha) = 1 - \\left(\\frac{x}{x_{\\text{min}}}\\right)^{-\\alpha+1} \\quad \\text{for } x \\ge x_{\\text{min}}',
    description: 'A Power Law distribution describes a scale-free relationship where extreme events (the tail) happen much more frequently than normal models predict.',
    applications: [
      { icon: '🌍', title: 'Earthquakes', desc: 'Following the Gutenberg-Richter law, where large earthquakes are rare but highly destructive.' },
      { icon: '📖', title: 'Word Frequencies', desc: 'Zipf\'s law: The most frequent word occurs twice as often as the second most frequent.' },
      { icon: '🕸️', title: 'Network Nodes', desc: 'Modeling the number of links pointing to websites on the internet.' }
    ],
    exercises: [],
    properties: [
      { label: 'support', value: '[x_min, ∞)' },
      { label: 'mean', value: '(α-1) · x_min / (α-2)  (for α > 2)' },
      { label: 'mode', value: 'x_min' }
    ],
    related: [
      { label: 'Pareto', note: 'Power law distribution is mathematically isomorphic to the Pareto distribution' }
    ]
  },
  uniform: {
    id: 'uniform',
    name: 'Uniform Distribution',
    tagline: 'continuous · support: [a, b] · parameters: a (lower), b > a (upper)',
    support: '[a, b]',
    type: 'continuous',
    parameters: [
      { name: 'a', label: 'a (lower)', min: -5, max: 4, step: 0.5, defaultValue: 0 },
      { name: 'b', label: 'b (upper)', min: -4, max: 10, step: 0.5, defaultValue: 2 }
    ],
    presets: [
      { name: 'standard Uniform', values: { a: 0, b: 1 } },
      { name: 'symmetric / wide', values: { a: -3, b: 3 } },
      { name: 'shifted', values: { a: 2, b: 6 } }
    ],
    getStats: (p) => {
      const a = p.a;
      let b = p.b;
      if (b <= a) b = a + 0.1; // sanitise
      const range = b - a;
      return {
        mean: ((a + b) / 2).toFixed(4),
        median: ((a + b) / 2).toFixed(4),
        mode: 'any value in [a, b]',
        variance: (Math.pow(range, 2) / 12).toFixed(4),
        std_dev: (range / Math.sqrt(12)).toFixed(4),
        skewness: '0',
        kurtosis: '1.8'
      };
    },
    pdf: (x, p) => {
      const a = p.a;
      let b = p.b;
      if (b <= a) b = a + 0.1;
      return x >= a && x <= b ? 1 / (b - a) : 0;
    },
    cdf: (x, p) => {
      const a = p.a;
      let b = p.b;
      if (b <= a) b = a + 0.1;
      if (x < a) return 0;
      if (x > b) return 1;
      return (x - a) / (b - a);
    },
    xRange: (p) => {
      const a = p.a;
      let b = p.b;
      if (b <= a) b = a + 0.1;
      const span = b - a;
      return [a - 0.25 * span, b + 0.25 * span];
    },
    formulaPdf: 'f(x) = \\begin{cases} \\frac{1}{b - a} & \\text{for } a \\le x \\le b \\\\ 0 & \\text{otherwise} \\end{cases}',
    formulaCdf: 'F(x) = \\begin{cases} 0 & x < a \\\\ \\frac{x - a}{b - a} & a \\le x \\le b \\\\ 1 & x > b \\end{cases}',
    description: 'The Uniform distribution represents complete ignorance: every outcome inside a bounded interval is equally likely to occur.',
    applications: [
      { icon: '🎲', title: 'Random Generation', desc: 'Serving as the foundational algorithm for generating random numbers in computing.' },
      { icon: '🕹️', title: 'Loot Drops', desc: 'Selecting a random item from a balanced loot pool in video game mechanics.' },
      { icon: '💿', title: 'Quantization Noise', desc: 'Modeling the rounding error introduced when converting analog signals to digital audio.' }
    ],
    exercises: [{"title":"Approximating Pi","prompt":"# You can estimate Pi by generating uniform random points in a 1x1 square.\n# 1. Generate 10,000 random (x, y) points where x and y are Uniform(0, 1).\n# 2. Count how many fall inside the quarter-circle (x**2 + y**2 <= 1).\n# 3. Multiply the ratio by 4 to estimate Pi.\n\n","solution":"import numpy as np\n\nN = 10000\nx = np.random.uniform(0, 1, N)\ny = np.random.uniform(0, 1, N)\n\n# Distance from origin squared\ndistance_sq = x**2 + y**2\n\n# Count points inside quarter circle\ninside = np.sum(distance_sq <= 1)\n\n# Estimate Pi\npi_estimate = 4 * inside / N\nprint(f'Estimated Pi: {pi_estimate:.4f}')\nprint(f'Actual Pi: {np.pi:.4f}')"}],
    properties: [
      { label: 'support', value: '[a, b]' },
      { label: 'mean', value: '(a + b) / 2' },
      { label: 'median', value: '(a + b) / 2' },
      { label: 'variance', value: '(b - a)² / 12' },
      { label: 'kurtosis', value: '1.8 (excess kurtosis = -1.2)' }
    ],
    related: [
      { label: 'Beta', note: 'Beta(1, 1) is equivalent to Uniform(0, 1)' }
    ]
  },
  zscore: {
    id: 'zscore',
    name: 'Z-Score & Standard Normal',
    tagline: 'continuous · support: (-∞, ∞) · parameters: none (fixed standard normal)',
    support: '(-∞, ∞)',
    type: 'continuous',
    parameters: [],
    presets: [],
    getStats: () => {
      return {
        mean: '0.0000',
        median: '0.0000',
        mode: '0.0000',
        variance: '1.0000',
        std_dev: '1.0000',
        skewness: '0',
        kurtosis: '3'
      };
    },
    pdf: (x) => {
      return (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);
    },
    cdf: (x) => {
      return 0.5 * (1 + erf(x / Math.sqrt(2)));
    },
    xRange: () => [-4, 4],
    formulaPdf: '\\phi(z) = \\frac{1}{\\sqrt{2\\pi}} \\exp\\left(-\\frac{1}{2}z^2\\right)',
    formulaCdf: '\\Phi(z) = \\frac{1}{2}\\left[1 + \\text{erf}\\left(\\frac{z}{\\sqrt{2}}\\right)\\right]',
    description: 'The Standard Normal (Z-Score) distribution maps any normal distribution onto a common scale with mean 0 and standard deviation 1.',
    applications: [
      { icon: '📊', title: 'Percentile Ranking', desc: 'Determining what percentile a specific student falls into on a national exam.' },
      { icon: '📉', title: 'Anomaly Detection', desc: "Flagging credit card transactions that deviate wildly from a user's normal spending." },
      { icon: '🧪', title: 'Hypothesis Testing', desc: 'Calculating p-values in Z-tests to determine if experimental results are statistically significant.' }
    ],
    exercises: [{"title":"Plot the Standard Normal","prompt":"# 1. Import numpy and matplotlib.pyplot\n# 2. Generate 1000 evenly spaced x values between -4 and 4 using np.linspace\n# 3. Calculate the PDF of the standard normal distribution (mu=0, sigma=1)\n#    Hint: PDF = (1 / np.sqrt(2 * np.pi)) * np.exp(-0.5 * x**2)\n# 4. Plot x vs PDF and show it!\n\n","solution":"import numpy as np\nimport matplotlib.pyplot as plt\n\n# Generate x values\nx = np.linspace(-4, 4, 1000)\n\n# Calculate standard normal PDF\npdf = (1 / np.sqrt(2 * np.pi)) * np.exp(-0.5 * x**2)\n\n# Plot\nplt.figure(figsize=(8, 4))\nplt.plot(x, pdf, color='#21808d', linewidth=2)\nplt.fill_between(x, pdf, alpha=0.2, color='#21808d')\nplt.title('Standard Normal Distribution')\nplt.grid(alpha=0.3)\nplt.show()"}],
    properties: [
      { label: 'support', value: '(-∞, ∞)' },
      { label: 'mean', value: '0' },
      { label: 'variance', value: '1' },
      { label: 'skewness', value: '0' },
      { label: 'kurtosis', value: '3' }
    ],
    related: [
      { label: 'Normal', note: 'the generalized version of this distribution with arbitrary μ and σ' }
    ]
  }
};
