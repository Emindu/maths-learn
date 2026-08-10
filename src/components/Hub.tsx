import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Compass, Link2, Dice5, Target, Layers, ArrowRight, BookOpen, Lock, CheckCircle, FlaskConical, Search, TrendingUp, GitMerge, Award, X, ClipboardCheck } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';

interface Topic {
  title: string;
  desc: string;
  to: string;
  isLegacy?: boolean;
  is3D?: boolean;
}

interface Category {
  id: string;
  label: string;
  sectionTitle?: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  gridVariant?: 'topic' | 'module';
  topics: Topic[];
}

interface HubCardProps {
  title: string;
  desc: string;
  to: string;
  isLegacy?: boolean;
  is3D?: boolean;
  isLocked?: boolean;
  isCompleted?: boolean;
}

const HubCard: React.FC<HubCardProps> = ({ title, desc, to, isLegacy = false, is3D = false, isLocked = false, isCompleted = false }) => {
  const innerContent = (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-8)' }}>
        <div>
          {is3D && (
            <span className="module-card__badge module-card__badge--3d" style={{ marginBottom: 'var(--space-8)', display: 'inline-block' }}>
              ◈ 3D Visualisation
            </span>
          )}
          {isLegacy && !is3D && (
            <span className="module-card__badge" style={{ marginBottom: 'var(--space-8)', display: 'inline-block' }}>
              ⚡ Interactive
            </span>
          )}
        </div>
        {isLocked && <Lock size={16} style={{ color: 'var(--color-text-muted)' }} />}
        {isCompleted && <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />}
      </div>
      <h3 className="topic-card__title" style={{ marginBottom: 'var(--space-6)' }}>{title}</h3>
      <p className="topic-card__desc" style={{ flex: 1, margin: 0 }}>{desc}</p>
      {!isLocked && (
        <div className="topic-card__footer" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-12)' }}>
          {isCompleted ? 'Review' : 'Explore'} <ArrowRight size={12} />
        </div>
      )}
    </>
  );

  if (isLocked) {
    return (
      <div className="topic-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', opacity: 0.5, cursor: 'not-allowed', background: 'var(--color-surface-raised)' }}>
        {innerContent}
      </div>
    );
  }

  return (
    <Link to={to} className="topic-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {innerContent}
    </Link>
  );
};

const CATEGORIES: Category[] = [
  {
    id: 'concepts', label: 'Probability Concepts', icon: BookOpen,
    topics: [
      { title: 'Probability: A Measure of Uncertainty', desc: 'What probability is, why we need it, and a brief history — from Pascal and Fermat to Kolmogorov.', to: '/concepts/probability-intro' },
      { title: 'Probability Models', desc: 'Formal definition: sample spaces, events as subsets, and the four axioms of the probability measure P.', to: '/concepts/probability-models' },
      { title: 'Properties of Probability Models', desc: 'Complement rule, law of total probability, monotonicity, inclusion-exclusion, and subadditivity.', to: '/concepts/probability-properties' },
      { title: 'Uniform Probability on Finite Spaces', desc: 'When all outcomes are equally likely: P(A) = |A|/|S|, counting via multiplication principle, permutations, and binomial coefficients.', to: '/concepts/uniform-probability' },
      { title: 'Conditional Probability & Independence', desc: "How new information updates probabilities. P(A|B), the multiplication formula, Bayes' theorem, and independence.", to: '/concepts/conditional-probability' },
      { title: 'Continuity of Probability', desc: 'Increasing and decreasing sequences of events, and the fundamental continuity theorem for probability measures.', to: '/concepts/continuity-of-p' },
    ],
  },
  {
    id: 'ch2concepts', label: 'Random Variables', sectionTitle: 'Random Variables & Distributions', icon: Layers,
    topics: [
      { title: 'Random Variables', desc: 'Definition of a random variable as a function from sample space to ℝ; discrete vs continuous; indicator random variables.', to: '/ch2/rv-intro' },
      { title: 'Distributions of Random Variables', desc: 'The distribution of X: PMF for discrete RVs, PDF for continuous RVs, and how they encode all probabilistic information.', to: '/ch2/rv-distributions' },
      { title: 'Discrete Distributions', desc: 'Bernoulli, Binomial, Geometric, Negative Binomial, Poisson, and Hypergeometric — their PMFs, moments, and relationships.', to: '/ch2/discrete-distributions' },
      { title: 'Continuous Distributions', desc: 'Uniform, Exponential, Normal/Gaussian, Gamma, Beta — PDFs, CDFs, moments, and the role of each in modelling.', to: '/ch2/continuous-distributions' },
      { title: 'Cumulative Distribution Functions', desc: 'The CDF F(x) = P(X ≤ x): properties, the fundamental link between PMF/PDF and CDF, and survival functions.', to: '/ch2/cumulative-distribution' },
      { title: 'Change of Variable', desc: 'Transforming random variables: the change-of-variable formula for PDFs and the probability integral transform.', to: '/ch2/change-of-variable' },
      { title: 'Joint Distributions', desc: 'Joint PMFs and PDFs for pairs of random variables; marginal distributions; computing joint probabilities over regions.', to: '/ch2/joint-distributions' },
      { title: 'Conditioning & Independence', desc: 'Conditional distributions, conditional expectation, and independence of random variables with formal criteria.', to: '/ch2/conditioning-independence' },
      { title: 'Multivariate Moments & Covariance', desc: 'Expected value of functions of RVs, covariance, correlation, variance of sums, and the Cauchy-Schwarz inequality.', to: '/ch2/multidim-cov' },
      { title: 'Simulating Distributions', desc: 'Generating samples from arbitrary distributions: the inverse CDF method, Box-Muller transform, and rejection sampling.', to: '/ch2/simulating-distributions' },
    ],
  },
  {
    id: 'ch3concepts', label: 'Expectation', icon: BarChart2,
    topics: [
      { title: 'Expectation: The Discrete Case', desc: 'E(X) = Σ x·P(X=x). Expected values of Bernoulli, Binomial, Geometric and Poisson; linearity; the St. Petersburg paradox.', to: '/ch3/expectation-discrete' },
      { title: 'Expectation: The Continuous Case', desc: 'E(X) = ∫x·f(x)dx. Means of Uniform, Exponential, and Normal distributions; LOTUS for continuous variables.', to: '/ch3/expectation-continuous' },
      { title: 'Variance, Covariance & Correlation', desc: 'Var(X) = E[X²]−(E[X])². Covariance as joint spread; correlation bounded in [−1, 1]; variance of a sum with 2·Cov term.', to: '/ch3/variance-covariance' },
      { title: 'Generating Functions', desc: 'PGF, MGF m(s) = E[eˢˣ], and characteristic functions. Derivatives yield moments; product rule for independent sums.', to: '/ch3/generating-functions' },
      { title: 'Conditional Expectation', desc: 'E(X|Y=y), E(X|Y) as a random variable, the law of total expectation, and the variance decomposition formula.', to: '/ch3/conditional-expectation' },
      { title: 'Probability Inequalities', desc: "Markov's, Chebyshev's, Cauchy–Schwarz, and Jensen's inequalities — bounding tail probabilities with moments alone.", to: '/ch3/expectation-inequalities' },
    ],
  },
  {
    id: 'ch4concepts', label: 'Sampling & Limits', sectionTitle: 'Sampling Distributions & Limits', icon: FlaskConical,
    topics: [
      { title: 'Sampling Distributions', desc: 'Distribution of Y = h(X₁,…,Xₙ) for i.i.d. sequences. Exact computation vs CLT approximation vs Monte Carlo.', to: '/ch4/sampling-distributions' },
      { title: 'Convergence in Probability', desc: 'X_n →^P Y if P(|X_n−Y|≥ε)→0. The Weak Law of Large Numbers: sample means converge to μ.', to: '/ch4/convergence-probability' },
      { title: 'Convergence with Probability 1', desc: 'Almost sure (a.s.) convergence and the Strong Law of Large Numbers — a strictly stronger result than WLLN.', to: '/ch4/convergence-probability-1' },
      { title: 'Convergence in Distribution & CLT', desc: 'CDF convergence, the Central Limit Theorem: (M_n−μ)/(σ/√n) →^D N(0,1), and the Poisson approximation.', to: '/ch4/convergence-distribution' },
      { title: 'Monte Carlo Approximations', desc: 'E[h(X)] ≈ (1/N)Σh(Xᵢ) justified by the LLN. Error O(1/√N). π estimation and numerical integration.', to: '/ch4/monte-carlo-approx' },
      { title: 'Normal Distribution Theory', desc: 'Linear combinations of normals, chi-squared, t-distribution, and exact sampling distributions for normal data.', to: '/ch4/normal-distribution-theory' },
    ],
  },
  {
    id: 'ch5concepts', label: 'Statistical Inference', icon: Search,
    topics: [
      { title: 'Why Do We Need Statistics?', desc: 'Statistics addresses uncertainty about the true probability model. Data plus a statistical model yield inferences — the bridge from probability to real-world questions.', to: '/ch5/why-statistics' },
      { title: 'Inference Using a Probability Model', desc: 'When P is known but the response is not: predict an unknown value, construct a credible interval, or assess the plausibility of a specific value.', to: '/ch5/inference-probability-model' },
      { title: 'Statistical Models', desc: 'The family {P_θ : θ ∈ Ω} parameterises our uncertainty about P. Key examples: the Bernoulli model and the location-scale Normal model.', to: '/ch5/statistical-models' },
      { title: 'Data Collection', desc: 'Finite populations, population CDFs, simple random sampling, empirical CDFs, density histograms, and survey sampling.', to: '/ch5/data-collection' },
      { title: 'Some Basic Inferences', desc: 'Descriptive statistics (mean, median, quantiles, IQR), plotting data, and the three formal types of inference: estimation, confidence regions, and hypothesis assessment.', to: '/ch5/basic-inferences' },
    ],
  },
  {
    id: 'ch6concepts', label: 'Likelihood Inference', icon: TrendingUp,
    topics: [
      { title: 'The Likelihood Function', desc: 'The likelihood L(θ|s) = f_θ(s) encodes all information about θ in the data. Sufficient statistics, the factorization theorem, and p-likelihood intervals.', to: '/ch6/likelihood-function' },
      { title: 'Maximum Likelihood Estimation', desc: 'The MLE maximises the likelihood over all θ. Log-likelihood, the score equation, equivariance, and examples for Bernoulli, Normal, and Uniform families.', to: '/ch6/maximum-likelihood-estimation' },
      { title: 'Inferences Based on the MLE', desc: 'Bias, MSE, confidence intervals (z- and t-based), hypothesis tests, P-values, power functions, and sample size determination.', to: '/ch6/inferences-based-on-mle' },
      { title: 'Distribution-Free Methods', desc: 'Method of moments, the bootstrap (resample-based SE and CIs), and the sign test for the median — no distributional assumptions required.', to: '/ch6/distribution-free-methods' },
      { title: 'Asymptotics for the MLE', desc: 'Fisher information, the Cramér–Rao lower bound, consistency, asymptotic normality of the MLE, and the delta method for derived parameters.', to: '/ch6/mle-asymptotics' },
    ],
  },
  {
    id: 'ch7concepts', label: 'Bayesian Inference', icon: GitMerge,
    topics: [
      { title: 'Prior & Posterior Distributions', desc: "Bayesian framework: π(θ) prior, π(θ|s) posterior via Bayes' theorem, conjugate families — Beta-Bernoulli, Normal-Normal, and Dirichlet-Multinomial.", to: '/ch7/prior-posterior-distributions' },
      { title: 'Inferences Based on the Posterior', desc: 'Posterior mode (MAP) and mean, HPD credible intervals, Bayes factors for hypothesis testing, and posterior predictive distributions.', to: '/ch7/inferences-based-on-posterior' },
      { title: 'Bayesian Computations', desc: 'Asymptotic normality of the posterior (Laplace approximation), Monte Carlo sampling, importance sampling, and Gibbs sampling for intractable posteriors.', to: '/ch7/bayesian-computations' },
      { title: 'Choosing Priors', desc: "Prior elicitation, conjugate priors, empirical Bayes (maximise m_λ(s)), hierarchical Bayes, improper priors, and Jeffreys' invariant prior π_J(θ) ∝ I(θ)^(1/2).", to: '/ch7/choosing-priors' },
      { title: 'Bayesian Asymptotics', desc: 'Normal-Gamma conjugate update, the Bernstein–von Mises theorem (posterior ≈ N(θ̂, 1/nI(θ₀))), and asymptotic equivalence of Bayesian and frequentist inference.', to: '/ch7/bayesian-asymptotics' },
    ],
  },
  {
    id: 'ch8concepts', label: 'Optimal Inferences', icon: Award,
    topics: [
      { title: 'Optimal Unbiased Estimation', desc: 'MSE decomposition, Rao-Blackwell theorem (T_U = E[T|U(s)]), UMVU estimators, completeness, Lehmann-Scheffé theorem, and the Cramér-Rao lower bound Var(T) ≥ (ψ′(θ))²/I(θ).', to: '/ch8/optimal-unbiased-estimation' },
      { title: 'Optimal Hypothesis Testing', desc: 'Power functions, Type I/II errors, UMP tests, the Neyman-Pearson theorem (likelihood ratio test), and one-sided vs two-sided UMP size-α tests.', to: '/ch8/optimal-hypothesis-testing' },
      { title: 'Optimal Bayesian Inferences', desc: 'Bayes rules minimise prior-averaged loss. Posterior mean is the Bayes estimator for squared error; posterior probability comparison is the Bayes test for 0-1 loss.', to: '/ch8/optimal-bayesian-inferences' },
      { title: 'Decision Theory', desc: 'Action space A, loss function L(θ,a), risk function R_δ(θ), admissibility, Bayes risk and Bayes rules, minimax decision functions.', to: '/ch8/decision-theory' },
      { title: 'Further Proofs', desc: 'Sufficiency via conditional independence (Theorem 8.1.2), completeness of x̄ via MGF argument, and the Neyman-Pearson theorem proof in the discrete case.', to: '/ch8/optimal-inferences-proofs' },
    ],
  },
  {
    id: 'ch9concepts', label: 'Model Checking', icon: ClipboardCheck,
    topics: [
      { title: 'Checking the Sampling Model', desc: 'Discrepancy statistics, ancillary statistics, P-values, and the chi-squared goodness of fit test for assessing whether data plausibly came from the assumed model — plus residual and normal probability plots.', to: '/ch9/checking-sampling-model' },
      { title: 'Checking for Prior–Data Conflict', desc: 'A correct sampling model is not enough — the prior can still conflict with the data. Prior predictive checks based on a minimal sufficient statistic detect this second failure mode.', to: '/ch9/checking-prior-data-conflict' },
      { title: 'The Problem with Multiple Checks', desc: 'Running too many model-checking procedures makes it near-certain you will "find" something wrong, even in a correct model — the multiple comparisons problem applied to model checking.', to: '/ch9/multiple-checks' },
    ],
  },
  {
    id: 'ch10concepts', label: 'Relationships Among Variables', icon: GitMerge,
    topics: [
      { title: 'Related Variables', desc: 'What it means for two variables to be related: response vs predictor, the regression function E(Y|X=x), and why correlation is not causation.', to: '/ch10/related-variables' },
      { title: 'Categorical Response and Predictors', desc: "Contingency tables, independence of categorical variables, and the chi-squared test of independence — Fisher's exact test generalised to r×c tables.", to: '/ch10/categorical-relationships' },
      { title: 'Simple Linear Regression', desc: 'Fitting Y = β₀+β₁X+ε by least squares, the sampling distribution of the slope, R², and residual diagnostics for the fitted line.', to: '/ch10/simple-linear-regression' },
      { title: 'Correlation and Multiple Regression', desc: 'The sample correlation coefficient r, its link to R² and the slope test, and extending least squares to several predictors at once.', to: '/ch10/correlation-multiple-regression' },
      { title: 'Analysis of Variance & Multiple Comparisons', desc: 'Testing equality of several group means with the ANOVA F-test, then controlling the false-positive rate across all pairwise comparisons.', to: '/ch10/anova' },
    ],
  },
  {
    id: 'distributions', label: 'Probability Distributions', icon: BarChart2,
    topics: [
      { title: 'Bernoulli Distribution', desc: 'Single-trial binary outcomes with interactive probability slider.', to: '/distribution/bernoulli' },
      { title: 'Beta Distribution', desc: 'Continuous distribution over [0,1], useful for Bayesian priors.', to: '/distribution/beta' },
      { title: 'Binomial Distribution', desc: 'Number of successes in a fixed number of independent trials.', to: '/distribution/binomial' },
      { title: 'Exponential Distribution', desc: 'Time between Poisson events; memoryless continuous distribution.', to: '/distribution/exponential' },
      { title: 'Laplace Distribution', desc: 'Double-exponential distribution with heavier tails than Gaussian.', to: '/distribution/laplace' },
      { title: 'Gamma Distribution', desc: 'Generalisation of the exponential distribution for waiting times.', to: '/distribution/gemma' },
      { title: 'Log-Normal Distribution', desc: 'Distribution of a variable whose logarithm is normally distributed.', to: '/distribution/lognormal' },
      { title: 'Normal / Gaussian', desc: 'The ubiquitous bell curve defined by mean and standard deviation.', to: '/distribution/normal' },
      { title: 'Pareto Distribution', desc: 'Power-law distribution modelling the 80/20 rule.', to: '/distribution/pareto' },
      { title: 'Poisson Distribution', desc: 'Count of events occurring in a fixed interval of time or space.', to: '/distribution/poisson' },
      { title: 'Power Law Distribution', desc: 'Scale-free distribution found in networks, wealth, and language.', to: '/distribution/powerlaw' },
      { title: 'Uniform Distribution', desc: 'Every outcome equally likely across a bounded interval.', to: '/distribution/uniform' },
      { title: 'Z-Score & Standard Normal', desc: 'Standardising data and working with the standard normal table.', to: '/distribution/zscore' },
      { title: 'Dirichlet Distribution', desc: 'Multivariate generalisation of the Beta; prior for categorical data.', to: '/distribution/Dirichlet' },
    ],
  },
  {
    id: 'properties', label: 'Distribution Properties', icon: Compass,
    topics: [
      { title: 'Skewness & Kurtosis', desc: 'Understand the shape of distributions: symmetry and tail weight.', to: '/legacy/skewness-kurtosis-edu/index.html', isLegacy: true },
    ],
  },
  {
    id: 'markov', label: 'Markov Chains', icon: Link2,
    topics: [
      { title: 'Markov Chain Basics', desc: 'Discrete-time Markov chains with transition matrix visualisation.', to: '/legacy/markovChain.html', isLegacy: true },
      { title: 'Continuous Markov Chain', desc: 'Continuous-time Markov chain dynamics and rate matrices.', to: '/legacy/markovChainC.html', isLegacy: true },
      { title: 'Discrete Markov Chain (Interactive)', desc: 'In-depth educational module with exercises and visualisations.', to: '/legacy/markov-chains-edu/index.html', isLegacy: true },
      { title: 'Continuous Probability Learning', desc: 'Interactive continuous probability distributions learning module.', to: '/legacy/continuous-probability-learning/index.html', isLegacy: true },
    ],
  },
  {
    id: 'mcmc', label: 'MCMC & Sampling', icon: Dice5, gridVariant: 'module',
    topics: [
      { title: 'Metropolis-Hastings Algorithm', desc: 'Step-by-step guide to one of the most important MCMC algorithms in Bayesian computation.', to: '/legacy/metropolis-hastings-learn/index.html', isLegacy: true },
      { title: 'Gibbs Sampling Tutor', desc: 'Learn Gibbs sampling through interactive demos, step-by-step calculations, and practice exercises.', to: '/legacy/gibbs-sampling-tutor/index.html', isLegacy: true },
    ],
  },
  {
    id: 'montecarlo', label: 'Monte Carlo', sectionTitle: 'Monte Carlo Methods', icon: Target,
    topics: [
      { title: 'Monte Carlo Pi Estimation', desc: 'Estimate π using random sampling with live visualisation.', to: '/legacy/MonteCarloPiEstimationVisualization.html', isLegacy: true },
      { title: 'Monty Hall Problem', desc: 'Simulate the classic probability puzzle and see why switching wins (Native React component!).', to: '/game/monty-hall' },
    ],
  },
  {
    id: 'advanced', label: 'Advanced Topics', icon: Layers, gridVariant: 'module',
    topics: [
      { title: 'Mixture Model Explorer', desc: 'Visualise and understand Gaussian mixture models and the EM algorithm.', to: '/legacy/mixture-model-explorer/index.html', isLegacy: true },
      { title: 'Likelihood & MLE Dashboard', desc: 'Explore likelihood functions and maximum likelihood estimation interactively.', to: '/legacy/likelihood-mle-dashboard/index.html', isLegacy: true },
      { title: 'Trinity of Uncertainty', desc: 'Understand aleatory, epistemic, and ontological uncertainty through interactive games.', to: '/legacy/trinity-uncertainty-dashboard/index.html', isLegacy: true },
      { title: 'Bivariate Normal — 3D', desc: 'Explore the bivariate normal distribution in interactive three-dimensional space.', to: '/legacy/bivariate_normal_3_d_visualizer.html', is3D: true },
      { title: 'Softmax Function', desc: 'Neural network activation function for multi-class classification.', to: '/legacy/softmax.html', isLegacy: true },
      { title: 'ANOVA', desc: 'Analysis of variance to compare means across multiple groups.', to: '/legacy/anova.html', isLegacy: true },
    ],
  },
];

export const Hub: React.FC = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('concepts');
  const [searchQuery, setSearchQuery] = useState('');
  const { isUnlocked, isCompleted, devMode, toggleDevMode } = useProgress();

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;

  const visibleCategories = useMemo(() => {
    if (!isSearching) return CATEGORIES;
    return CATEGORIES
      .map((cat) => ({
        ...cat,
        topics: cat.topics.filter(
          (t) => t.title.toLowerCase().includes(normalizedQuery) || t.desc.toLowerCase().includes(normalizedQuery)
        ),
      }))
      .filter((cat) => cat.topics.length > 0);
  }, [normalizedQuery, isSearching]);

  const totalResults = useMemo(() => visibleCategories.reduce((sum, c) => sum + c.topics.length, 0), [visibleCategories]);

  const handleCategoryClick = (id: string) => {
    setActiveCategory(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    // Scroll to initial hash if present on load
    if (location.hash) {
      const id = location.hash.substring(1);
      const el = document.getElementById(id);
      if (el) {
        setActiveCategory(id);
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.hash]);

  useEffect(() => {
    // IntersectionObserver to highlight sidebar item based on scroll position.
    // Skipped while searching, since filtered-out sections aren't in the DOM.
    if (isSearching) return;

    const sections = document.querySelectorAll('.hub-section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [isSearching, visibleCategories.length]);

  return (
    <div style={{ width: '100%' }}>
      {/* Hero (Spans full width) */}
      <div className="hub-hero">
        <div className="hub-hero__inner">
          <div className="hub-hero__eyebrow">✦ Interactive Learning Platform</div>
          <h1 className="hub-hero__title">
            Mathematics &amp;<br /><span>Statistics</span> Visualised
          </h1>
          <p className="hub-hero__subtitle">
            Explore probability distributions, statistical algorithms, and machine learning concepts through hands-on interactive visualisations.
          </p>

          <div className="hub-search">
            <Search size={18} className="hub-search__icon" />
            <input
              type="search"
              className="hub-search__input"
              placeholder="Search topics — e.g. &quot;Bayes&quot;, &quot;Poisson&quot;, &quot;MLE&quot;..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search topics"
            />
            {isSearching && (
              <button
                type="button"
                className="hub-search__clear"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {!isSearching && (
            <div className="hub-hero__stats">
              <div className="hub-stat">
                <span className="hub-stat__number">48+</span>
                <span className="hub-stat__label">Topics</span>
              </div>
              <div className="hub-stat">
                <span className="hub-stat__number">9</span>
                <span className="hub-stat__label">Categories</span>
              </div>
              <div className="hub-stat">
                <span className="hub-stat__number">44+</span>
                <span className="hub-stat__label">React Modules</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Sidebar + Sections (Centered layout matching original site) */}
      <div className="hub-layout" style={{ maxWidth: 'var(--container-2xl)', margin: '0 auto' }}>

        {/* Mobile category picker (replaces sidebar below 900px) */}
        {!isSearching && (
          <select
            className="form-control hub-mobile-nav"
            value={activeCategory}
            onChange={(e) => handleCategoryClick(e.target.value)}
            aria-label="Jump to category"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label} ({cat.topics.length})</option>
            ))}
          </select>
        )}

        {/* Sidebar */}
        <aside className="hub-sidebar">
          <div className="hub-sidebar__label">Categories</div>
          <nav className="hub-nav" style={{ display: 'flex', flexDirection: 'column' }}>
            {(isSearching ? visibleCategories : CATEGORIES).map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.id)}
                  className={`hub-nav__item ${isActive ? 'active' : ''}`}
                  style={{
                    border: 'none',
                    background: 'none',
                    width: '100%',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-10)'
                  }}
                >
                  <Icon size={16} className="hub-nav__item-icon" />
                  <span>{cat.label}</span>
                  <span className="hub-nav__item-count">{cat.topics.length}</span>
                </button>
              );
            })}
          </nav>
          <div style={{ marginTop: 'var(--space-24)', paddingTop: 'var(--space-16)', borderTop: '1px solid var(--color-border)' }}>
            <button
              onClick={toggleDevMode}
              title="Dev mode bypasses topic unlock requirements"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-8)',
                padding: 'var(--space-8) var(--space-10)',
                borderRadius: '6px',
                border: `1px solid ${devMode ? 'var(--color-success)' : 'var(--color-border)'}`,
                background: devMode ? 'color-mix(in srgb, var(--color-success) 12%, transparent)' : 'transparent',
                color: devMode ? 'var(--color-success)' : 'var(--color-text-muted)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <FlaskConical size={13} />
              <span>Dev Mode {devMode ? 'ON' : 'OFF'}</span>
            </button>
            {devMode && (
              <p style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-6)', lineHeight: 1.4, padding: '0 var(--space-4)' }}>
                All topics unlocked. Progress not required.
              </p>
            )}
          </div>
        </aside>

        {/* Content Area */}
        <main className="hub-main" style={{ minWidth: 0 }}>

          {isSearching && totalResults === 0 && (
            <div className="hub-empty">
              <Search size={28} style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-12)' }} />
              <p style={{ margin: 0, fontSize: 'var(--font-size-lg)', color: 'var(--color-text)' }}>
                No topics found for &quot;{searchQuery}&quot;
              </p>
              <p style={{ margin: 'var(--space-8) 0 0', color: 'var(--color-text-secondary)' }}>
                Try a different keyword, or{' '}
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--color-primary)', cursor: 'pointer', font: 'inherit', textDecoration: 'underline' }}
                >
                  clear the search
                </button>.
              </p>
            </div>
          )}

          {visibleCategories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <React.Fragment key={cat.id}>
                <section id={cat.id} className="hub-section">
                  <div className="hub-section__header">
                    <div className="hub-section__title-group">
                      <div className="hub-section__icon"><Icon size={20} /></div>
                      <h2 className="hub-section__title">{cat.sectionTitle ?? cat.label}</h2>
                    </div>
                    <span className="hub-section__badge">{cat.topics.length} topic{cat.topics.length !== 1 ? 's' : ''}</span>
                  </div>
                  <div className={cat.gridVariant === 'module' ? 'module-grid' : 'topic-grid'}>
                    {cat.topics.map((topic) => (
                      <HubCard
                        key={topic.to}
                        title={topic.title}
                        desc={topic.desc}
                        to={topic.to}
                        isLegacy={topic.isLegacy}
                        is3D={topic.is3D}
                        isLocked={!isUnlocked(topic.to)}
                        isCompleted={isCompleted(topic.to)}
                      />
                    ))}
                  </div>
                </section>
                {idx < visibleCategories.length - 1 && <hr className="hub-divider" />}
              </React.Fragment>
            );
          })}

        </main>
      </div>
    </div>
  );
};
