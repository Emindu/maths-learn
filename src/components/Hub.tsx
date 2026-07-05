import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Compass, Link2, Dice5, Target, Layers, ArrowRight, BookOpen, Lock, CheckCircle, FlaskConical, Search, TrendingUp } from 'lucide-react';
import { useProgress } from '../contexts/ProgressContext';

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

export const Hub: React.FC = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('concepts');
  const { isUnlocked, isCompleted, devMode, toggleDevMode } = useProgress();

  const categories = [
    { id: 'concepts', label: 'Probability Concepts', icon: BookOpen, count: 6 },
    { id: 'ch2concepts', label: 'Random Variables', icon: Layers, count: 10 },
    { id: 'ch3concepts', label: 'Expectation', icon: BarChart2, count: 6 },
    { id: 'ch4concepts', label: 'Sampling & Limits', icon: FlaskConical, count: 6 },
    { id: 'ch5concepts', label: 'Statistical Inference', icon: Search, count: 5 },
    { id: 'ch6concepts', label: 'Likelihood Inference', icon: TrendingUp, count: 5 },
    { id: 'distributions', label: 'Probability Distributions', icon: BarChart2, count: 14 },
    { id: 'properties', label: 'Distribution Properties', icon: Compass, count: 1 },
    { id: 'markov', label: 'Markov Chains', icon: Link2, count: 4 },
    { id: 'mcmc', label: 'MCMC & Sampling', icon: Dice5, count: 2 },
    { id: 'montecarlo', label: 'Monte Carlo', icon: Target, count: 2 },
    { id: 'advanced', label: 'Advanced Topics', icon: Layers, count: 6 },
  ];

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

    // IntersectionObserver to highlight sidebar item based on scroll position
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
  }, [location.hash]);

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
        </div>
      </div>

      {/* Main Grid: Sidebar + Sections (Centered layout matching original site) */}
      <div className="hub-layout" style={{ maxWidth: 'var(--container-2xl)', margin: '0 auto' }}>
        
        {/* Sidebar */}
        <aside className="hub-sidebar">
          <div className="hub-sidebar__label">Categories</div>
          <nav className="hub-nav" style={{ display: 'flex', flexDirection: 'column' }}>
            {categories.map((cat) => {
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
                  <span className="hub-nav__item-count">{cat.count}</span>
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
          
          {/* Category: Probability Concepts (Chapter 1) */}
          <section id="concepts" className="hub-section">
            <div className="hub-section__header">
              <div className="hub-section__title-group">
                <div className="hub-section__icon"><BookOpen size={20} /></div>
                <h2 className="hub-section__title">Probability Concepts</h2>
              </div>
              <span className="hub-section__badge">6 topics</span>
            </div>
            <div className="topic-grid">
              <HubCard
                title="Probability: A Measure of Uncertainty"
                desc="What probability is, why we need it, and a brief history — from Pascal and Fermat to Kolmogorov."
                to="/concepts/probability-intro" isLocked={!isUnlocked('/concepts/probability-intro')} isCompleted={isCompleted('/concepts/probability-intro')}
              />
              <HubCard
                title="Probability Models"
                desc="Formal definition: sample spaces, events as subsets, and the four axioms of the probability measure P."
                to="/concepts/probability-models" isLocked={!isUnlocked('/concepts/probability-models')} isCompleted={isCompleted('/concepts/probability-models')}
              />
              <HubCard
                title="Properties of Probability Models"
                desc="Complement rule, law of total probability, monotonicity, inclusion-exclusion, and subadditivity."
                to="/concepts/probability-properties" isLocked={!isUnlocked('/concepts/probability-properties')} isCompleted={isCompleted('/concepts/probability-properties')}
              />
              <HubCard
                title="Uniform Probability on Finite Spaces"
                desc="When all outcomes are equally likely: P(A) = |A|/|S|, counting via multiplication principle, permutations, and binomial coefficients."
                to="/concepts/uniform-probability" isLocked={!isUnlocked('/concepts/uniform-probability')} isCompleted={isCompleted('/concepts/uniform-probability')}
              />
              <HubCard
                title="Conditional Probability & Independence"
                desc="How new information updates probabilities. P(A|B), the multiplication formula, Bayes' theorem, and independence."
                to="/concepts/conditional-probability" isLocked={!isUnlocked('/concepts/conditional-probability')} isCompleted={isCompleted('/concepts/conditional-probability')}
              />
              <HubCard
                title="Continuity of Probability"
                desc="Increasing and decreasing sequences of events, and the fundamental continuity theorem for probability measures."
                to="/concepts/continuity-of-p" isLocked={!isUnlocked('/concepts/continuity-of-p')} isCompleted={isCompleted('/concepts/continuity-of-p')}
              />
            </div>
          </section>

          <hr className="hub-divider" />

          {/* Category: Random Variables (Chapter 2) */}
          <section id="ch2concepts" className="hub-section">
            <div className="hub-section__header">
              <div className="hub-section__title-group">
                <div className="hub-section__icon"><Layers size={20} /></div>
                <h2 className="hub-section__title">Random Variables &amp; Distributions</h2>
              </div>
              <span className="hub-section__badge">10 topics</span>
            </div>

            <div className="topic-grid">
              <HubCard
                title="Random Variables"
                desc="Definition of a random variable as a function from sample space to ℝ; discrete vs continuous; indicator random variables."
                to="/ch2/rv-intro" isLocked={!isUnlocked('/ch2/rv-intro')} isCompleted={isCompleted('/ch2/rv-intro')}
              />
              <HubCard
                title="Distributions of Random Variables"
                desc="The distribution of X: PMF for discrete RVs, PDF for continuous RVs, and how they encode all probabilistic information."
                to="/ch2/rv-distributions" isLocked={!isUnlocked('/ch2/rv-distributions')} isCompleted={isCompleted('/ch2/rv-distributions')}
              />
              <HubCard
                title="Discrete Distributions"
                desc="Bernoulli, Binomial, Geometric, Negative Binomial, Poisson, and Hypergeometric — their PMFs, moments, and relationships."
                to="/ch2/discrete-distributions" isLocked={!isUnlocked('/ch2/discrete-distributions')} isCompleted={isCompleted('/ch2/discrete-distributions')}
              />
              <HubCard
                title="Continuous Distributions"
                desc="Uniform, Exponential, Normal/Gaussian, Gamma, Beta — PDFs, CDFs, moments, and the role of each in modelling."
                to="/ch2/continuous-distributions" isLocked={!isUnlocked('/ch2/continuous-distributions')} isCompleted={isCompleted('/ch2/continuous-distributions')}
              />
              <HubCard
                title="Cumulative Distribution Functions"
                desc="The CDF F(x) = P(X ≤ x): properties, the fundamental link between PMF/PDF and CDF, and survival functions."
                to="/ch2/cumulative-distribution" isLocked={!isUnlocked('/ch2/cumulative-distribution')} isCompleted={isCompleted('/ch2/cumulative-distribution')}
              />
              <HubCard
                title="Change of Variable"
                desc="Transforming random variables: the change-of-variable formula for PDFs and the probability integral transform."
                to="/ch2/change-of-variable" isLocked={!isUnlocked('/ch2/change-of-variable')} isCompleted={isCompleted('/ch2/change-of-variable')}
              />
              <HubCard
                title="Joint Distributions"
                desc="Joint PMFs and PDFs for pairs of random variables; marginal distributions; computing joint probabilities over regions."
                to="/ch2/joint-distributions" isLocked={!isUnlocked('/ch2/joint-distributions')} isCompleted={isCompleted('/ch2/joint-distributions')}
              />
              <HubCard
                title="Conditioning &amp; Independence"
                desc="Conditional distributions, conditional expectation, and independence of random variables with formal criteria."
                to="/ch2/conditioning-independence" isLocked={!isUnlocked('/ch2/conditioning-independence')} isCompleted={isCompleted('/ch2/conditioning-independence')}
              />
              <HubCard
                title="Multivariate Moments &amp; Covariance"
                desc="Expected value of functions of RVs, covariance, correlation, variance of sums, and the Cauchy-Schwarz inequality."
                to="/ch2/multidim-cov" isLocked={!isUnlocked('/ch2/multidim-cov')} isCompleted={isCompleted('/ch2/multidim-cov')}
              />
              <HubCard
                title="Simulating Distributions"
                desc="Generating samples from arbitrary distributions: the inverse CDF method, Box-Muller transform, and rejection sampling."
                to="/ch2/simulating-distributions" isLocked={!isUnlocked('/ch2/simulating-distributions')} isCompleted={isCompleted('/ch2/simulating-distributions')}
              />
            </div>
          </section>

          <hr className="hub-divider" />

          {/* Category: Expectation (Chapter 3) */}
          <section id="ch3concepts" className="hub-section">
            <div className="hub-section__header">
              <div className="hub-section__title-group">
                <div className="hub-section__icon"><BarChart2 size={20} /></div>
                <h2 className="hub-section__title">Expectation</h2>
              </div>
              <span className="hub-section__badge">6 topics</span>
            </div>
            <div className="topic-grid">
              <HubCard
                title="Expectation: The Discrete Case"
                desc="E(X) = Σ x·P(X=x). Expected values of Bernoulli, Binomial, Geometric and Poisson; linearity; the St. Petersburg paradox."
                to="/ch3/expectation-discrete" isLocked={!isUnlocked('/ch3/expectation-discrete')} isCompleted={isCompleted('/ch3/expectation-discrete')}
              />
              <HubCard
                title="Expectation: The Continuous Case"
                desc="E(X) = ∫x·f(x)dx. Means of Uniform, Exponential, and Normal distributions; LOTUS for continuous variables."
                to="/ch3/expectation-continuous" isLocked={!isUnlocked('/ch3/expectation-continuous')} isCompleted={isCompleted('/ch3/expectation-continuous')}
              />
              <HubCard
                title="Variance, Covariance & Correlation"
                desc="Var(X) = E[X²]−(E[X])². Covariance as joint spread; correlation bounded in [−1, 1]; variance of a sum with 2·Cov term."
                to="/ch3/variance-covariance" isLocked={!isUnlocked('/ch3/variance-covariance')} isCompleted={isCompleted('/ch3/variance-covariance')}
              />
              <HubCard
                title="Generating Functions"
                desc="PGF, MGF m(s) = E[eˢˣ], and characteristic functions. Derivatives yield moments; product rule for independent sums."
                to="/ch3/generating-functions" isLocked={!isUnlocked('/ch3/generating-functions')} isCompleted={isCompleted('/ch3/generating-functions')}
              />
              <HubCard
                title="Conditional Expectation"
                desc="E(X|Y=y), E(X|Y) as a random variable, the law of total expectation, and the variance decomposition formula."
                to="/ch3/conditional-expectation" isLocked={!isUnlocked('/ch3/conditional-expectation')} isCompleted={isCompleted('/ch3/conditional-expectation')}
              />
              <HubCard
                title="Probability Inequalities"
                desc="Markov's, Chebyshev's, Cauchy–Schwarz, and Jensen's inequalities — bounding tail probabilities with moments alone."
                to="/ch3/expectation-inequalities" isLocked={!isUnlocked('/ch3/expectation-inequalities')} isCompleted={isCompleted('/ch3/expectation-inequalities')}
              />
            </div>
          </section>

          <hr className="hub-divider" />

          {/* Category: Sampling Distributions & Limits (Chapter 4) */}
          <section id="ch4concepts" className="hub-section">
            <div className="hub-section__header">
              <div className="hub-section__title-group">
                <div className="hub-section__icon"><FlaskConical size={20} /></div>
                <h2 className="hub-section__title">Sampling Distributions &amp; Limits</h2>
              </div>
              <span className="hub-section__badge">6 topics</span>
            </div>
            <div className="topic-grid">
              <HubCard
                title="Sampling Distributions"
                desc="Distribution of Y = h(X₁,…,Xₙ) for i.i.d. sequences. Exact computation vs CLT approximation vs Monte Carlo."
                to="/ch4/sampling-distributions" isLocked={!isUnlocked('/ch4/sampling-distributions')} isCompleted={isCompleted('/ch4/sampling-distributions')}
              />
              <HubCard
                title="Convergence in Probability"
                desc="X_n →^P Y if P(|X_n−Y|≥ε)→0. The Weak Law of Large Numbers: sample means converge to μ."
                to="/ch4/convergence-probability" isLocked={!isUnlocked('/ch4/convergence-probability')} isCompleted={isCompleted('/ch4/convergence-probability')}
              />
              <HubCard
                title="Convergence with Probability 1"
                desc="Almost sure (a.s.) convergence and the Strong Law of Large Numbers — a strictly stronger result than WLLN."
                to="/ch4/convergence-probability-1" isLocked={!isUnlocked('/ch4/convergence-probability-1')} isCompleted={isCompleted('/ch4/convergence-probability-1')}
              />
              <HubCard
                title="Convergence in Distribution &amp; CLT"
                desc="CDF convergence, the Central Limit Theorem: (M_n−μ)/(σ/√n) →^D N(0,1), and the Poisson approximation."
                to="/ch4/convergence-distribution" isLocked={!isUnlocked('/ch4/convergence-distribution')} isCompleted={isCompleted('/ch4/convergence-distribution')}
              />
              <HubCard
                title="Monte Carlo Approximations"
                desc="E[h(X)] ≈ (1/N)Σh(Xᵢ) justified by the LLN. Error O(1/√N). π estimation and numerical integration."
                to="/ch4/monte-carlo-approx" isLocked={!isUnlocked('/ch4/monte-carlo-approx')} isCompleted={isCompleted('/ch4/monte-carlo-approx')}
              />
              <HubCard
                title="Normal Distribution Theory"
                desc="Linear combinations of normals, chi-squared, t-distribution, and exact sampling distributions for normal data."
                to="/ch4/normal-distribution-theory" isLocked={!isUnlocked('/ch4/normal-distribution-theory')} isCompleted={isCompleted('/ch4/normal-distribution-theory')}
              />
            </div>
          </section>

          <hr className="hub-divider" />

          {/* Category: Statistical Inference (Chapter 5) */}
          <section id="ch5concepts" className="hub-section">
            <div className="hub-section__header">
              <div className="hub-section__title-group">
                <div className="hub-section__icon"><Search size={20} /></div>
                <h2 className="hub-section__title">Statistical Inference</h2>
              </div>
              <span className="hub-section__badge">5 topics</span>
            </div>
            <div className="topic-grid">
              <HubCard
                title="Why Do We Need Statistics?"
                desc="Statistics addresses uncertainty about the true probability model. Data plus a statistical model yield inferences — the bridge from probability to real-world questions."
                to="/ch5/why-statistics" isLocked={!isUnlocked('/ch5/why-statistics')} isCompleted={isCompleted('/ch5/why-statistics')}
              />
              <HubCard
                title="Inference Using a Probability Model"
                desc="When P is known but the response is not: predict an unknown value, construct a credible interval, or assess the plausibility of a specific value."
                to="/ch5/inference-probability-model" isLocked={!isUnlocked('/ch5/inference-probability-model')} isCompleted={isCompleted('/ch5/inference-probability-model')}
              />
              <HubCard
                title="Statistical Models"
                desc="The family {P_θ : θ ∈ Ω} parameterises our uncertainty about P. Key examples: the Bernoulli model and the location-scale Normal model."
                to="/ch5/statistical-models" isLocked={!isUnlocked('/ch5/statistical-models')} isCompleted={isCompleted('/ch5/statistical-models')}
              />
              <HubCard
                title="Data Collection"
                desc="Finite populations, population CDFs, simple random sampling, empirical CDFs, density histograms, and survey sampling."
                to="/ch5/data-collection" isLocked={!isUnlocked('/ch5/data-collection')} isCompleted={isCompleted('/ch5/data-collection')}
              />
              <HubCard
                title="Some Basic Inferences"
                desc="Descriptive statistics (mean, median, quantiles, IQR), plotting data, and the three formal types of inference: estimation, confidence regions, and hypothesis assessment."
                to="/ch5/basic-inferences" isLocked={!isUnlocked('/ch5/basic-inferences')} isCompleted={isCompleted('/ch5/basic-inferences')}
              />
            </div>
          </section>

          <hr className="hub-divider" />

          {/* Category: Likelihood Inference (Chapter 6) */}
          <section id="ch6concepts" className="hub-section">
            <div className="hub-section__header">
              <div className="hub-section__title-group">
                <div className="hub-section__icon"><TrendingUp size={20} /></div>
                <h2 className="hub-section__title">Likelihood Inference</h2>
              </div>
              <span className="hub-section__badge">5 topics</span>
            </div>
            <div className="topic-grid">
              <HubCard
                title="The Likelihood Function"
                desc="The likelihood L(θ|s) = f_θ(s) encodes all information about θ in the data. Sufficient statistics, the factorization theorem, and p-likelihood intervals."
                to="/ch6/likelihood-function" isLocked={!isUnlocked('/ch6/likelihood-function')} isCompleted={isCompleted('/ch6/likelihood-function')}
              />
              <HubCard
                title="Maximum Likelihood Estimation"
                desc="The MLE maximises the likelihood over all θ. Log-likelihood, the score equation, equivariance, and examples for Bernoulli, Normal, and Uniform families."
                to="/ch6/maximum-likelihood-estimation" isLocked={!isUnlocked('/ch6/maximum-likelihood-estimation')} isCompleted={isCompleted('/ch6/maximum-likelihood-estimation')}
              />
              <HubCard
                title="Inferences Based on the MLE"
                desc="Bias, MSE, confidence intervals (z- and t-based), hypothesis tests, P-values, power functions, and sample size determination."
                to="/ch6/inferences-based-on-mle" isLocked={!isUnlocked('/ch6/inferences-based-on-mle')} isCompleted={isCompleted('/ch6/inferences-based-on-mle')}
              />
              <HubCard
                title="Distribution-Free Methods"
                desc="Method of moments, the bootstrap (resample-based SE and CIs), and the sign test for the median — no distributional assumptions required."
                to="/ch6/distribution-free-methods" isLocked={!isUnlocked('/ch6/distribution-free-methods')} isCompleted={isCompleted('/ch6/distribution-free-methods')}
              />
              <HubCard
                title="Asymptotics for the MLE"
                desc="Fisher information, the Cramér–Rao lower bound, consistency, asymptotic normality of the MLE, and the delta method for derived parameters."
                to="/ch6/mle-asymptotics" isLocked={!isUnlocked('/ch6/mle-asymptotics')} isCompleted={isCompleted('/ch6/mle-asymptotics')}
              />
            </div>
          </section>

          <hr className="hub-divider" />

          {/* Category: Probability Distributions */}
          <section id="distributions" className="hub-section">
            <div className="hub-section__header">
              <div className="hub-section__title-group">
                <div className="hub-section__icon"><BarChart2 size={20} /></div>
                <h2 className="hub-section__title">Probability Distributions</h2>
              </div>
              <span className="hub-section__badge">14 topics</span>
            </div>
            
            <div className="topic-grid">
              <HubCard title="Bernoulli Distribution" desc="Single-trial binary outcomes with interactive probability slider." to="/distribution/bernoulli" isLocked={!isUnlocked('/distribution/bernoulli')} isCompleted={isCompleted('/distribution/bernoulli')} />
              <HubCard title="Beta Distribution" desc="Continuous distribution over [0,1], useful for Bayesian priors." to="/distribution/beta" isLocked={!isUnlocked('/distribution/beta')} isCompleted={isCompleted('/distribution/beta')} />
              <HubCard title="Binomial Distribution" desc="Number of successes in a fixed number of independent trials." to="/distribution/binomial" isLocked={!isUnlocked('/distribution/binomial')} isCompleted={isCompleted('/distribution/binomial')} />
              <HubCard title="Exponential Distribution" desc="Time between Poisson events; memoryless continuous distribution." to="/distribution/exponential" isLocked={!isUnlocked('/distribution/exponential')} isCompleted={isCompleted('/distribution/exponential')} />
              <HubCard title="Laplace Distribution" desc="Double-exponential distribution with heavier tails than Gaussian." to="/distribution/laplace" isLocked={!isUnlocked('/distribution/laplace')} isCompleted={isCompleted('/distribution/laplace')} />
              <HubCard title="Gamma Distribution" desc="Generalisation of the exponential distribution for waiting times." to="/distribution/gemma" isLocked={!isUnlocked('/distribution/gemma')} isCompleted={isCompleted('/distribution/gemma')} />
              <HubCard title="Log-Normal Distribution" desc="Distribution of a variable whose logarithm is normally distributed." to="/distribution/lognormal" isLocked={!isUnlocked('/distribution/lognormal')} isCompleted={isCompleted('/distribution/lognormal')} />
              <HubCard title="Normal / Gaussian" desc="The ubiquitous bell curve defined by mean and standard deviation." to="/distribution/normal" isLocked={!isUnlocked('/distribution/normal')} isCompleted={isCompleted('/distribution/normal')} />
              <HubCard title="Pareto Distribution" desc="Power-law distribution modelling the 80/20 rule." to="/distribution/pareto" isLocked={!isUnlocked('/distribution/pareto')} isCompleted={isCompleted('/distribution/pareto')} />
              <HubCard title="Poisson Distribution" desc="Count of events occurring in a fixed interval of time or space." to="/distribution/poisson" isLocked={!isUnlocked('/distribution/poisson')} isCompleted={isCompleted('/distribution/poisson')} />
              <HubCard title="Power Law Distribution" desc="Scale-free distribution found in networks, wealth, and language." to="/distribution/powerlaw" isLocked={!isUnlocked('/distribution/powerlaw')} isCompleted={isCompleted('/distribution/powerlaw')} />
              <HubCard title="Uniform Distribution" desc="Every outcome equally likely across a bounded interval." to="/distribution/uniform" isLocked={!isUnlocked('/distribution/uniform')} isCompleted={isCompleted('/distribution/uniform')} />
              <HubCard title="Z-Score &amp; Standard Normal" desc="Standardising data and working with the standard normal table." to="/distribution/zscore" isLocked={!isUnlocked('/distribution/zscore')} isCompleted={isCompleted('/distribution/zscore')} />
              <HubCard title="Dirichlet Distribution" desc="Multivariate generalisation of the Beta; prior for categorical data." to="/distribution/Dirichlet" isLocked={!isUnlocked('/distribution/Dirichlet')} isCompleted={isCompleted('/distribution/Dirichlet')} />
            </div>
          </section>

          <hr className="hub-divider" />

          {/* Category: Distribution Properties */}
          <section id="properties" className="hub-section">
            <div className="hub-section__header">
              <div className="hub-section__title-group">
                <div className="hub-section__icon"><Compass size={20} /></div>
                <h2 className="hub-section__title">Distribution Properties</h2>
              </div>
              <span className="hub-section__badge">1 topic</span>
            </div>
            <div className="topic-grid">
              <HubCard 
                title="Skewness &amp; Kurtosis" 
                desc="Understand the shape of distributions: symmetry and tail weight." 
                to="/legacy/skewness-kurtosis-edu/index.html" isLocked={!isUnlocked('/legacy/skewness-kurtosis-edu/index.html')} isCompleted={isCompleted('/legacy/skewness-kurtosis-edu/index.html')} 
                isLegacy 
              />
            </div>
          </section>

          <hr className="hub-divider" />

          {/* Category: Markov Chains */}
          <section id="markov" className="hub-section">
            <div className="hub-section__header">
              <div className="hub-section__title-group">
                <div className="hub-section__icon"><Link2 size={20} /></div>
                <h2 className="hub-section__title">Markov Chains</h2>
              </div>
              <span className="hub-section__badge">4 topics</span>
            </div>
            <div className="topic-grid">
              <HubCard title="Markov Chain Basics" desc="Discrete-time Markov chains with transition matrix visualisation." to="/legacy/markovChain.html" isLocked={!isUnlocked('/legacy/markovChain.html')} isCompleted={isCompleted('/legacy/markovChain.html')} isLegacy />
              <HubCard title="Continuous Markov Chain" desc="Continuous-time Markov chain dynamics and rate matrices." to="/legacy/markovChainC.html" isLocked={!isUnlocked('/legacy/markovChainC.html')} isCompleted={isCompleted('/legacy/markovChainC.html')} isLegacy />
              <HubCard title="Discrete Markov Chain (Interactive)" desc="In-depth educational module with exercises and visualisations." to="/legacy/markov-chains-edu/index.html" isLocked={!isUnlocked('/legacy/markov-chains-edu/index.html')} isCompleted={isCompleted('/legacy/markov-chains-edu/index.html')} isLegacy />
              <HubCard title="Continuous Probability Learning" desc="Interactive continuous probability distributions learning module." to="/legacy/continuous-probability-learning/index.html" isLocked={!isUnlocked('/legacy/continuous-probability-learning/index.html')} isCompleted={isCompleted('/legacy/continuous-probability-learning/index.html')} isLegacy />
            </div>
          </section>

          <hr className="hub-divider" />

          {/* Category: MCMC & Sampling */}
          <section id="mcmc" className="hub-section">
            <div className="hub-section__header">
              <div className="hub-section__title-group">
                <div className="hub-section__icon"><Dice5 size={20} /></div>
                <h2 className="hub-section__title">MCMC &amp; Sampling</h2>
              </div>
              <span className="hub-section__badge">2 topics</span>
            </div>
            <div className="module-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-16)' }}>
              <HubCard title="Metropolis-Hastings Algorithm" desc="Step-by-step guide to one of the most important MCMC algorithms in Bayesian computation." to="/legacy/metropolis-hastings-learn/index.html" isLocked={!isUnlocked('/legacy/metropolis-hastings-learn/index.html')} isCompleted={isCompleted('/legacy/metropolis-hastings-learn/index.html')} isLegacy />
              <HubCard title="Gibbs Sampling Tutor" desc="Learn Gibbs sampling through interactive demos, step-by-step calculations, and practice exercises." to="/legacy/gibbs-sampling-tutor/index.html" isLocked={!isUnlocked('/legacy/gibbs-sampling-tutor/index.html')} isCompleted={isCompleted('/legacy/gibbs-sampling-tutor/index.html')} isLegacy />
            </div>
          </section>

          <hr className="hub-divider" />

          {/* Category: Monte Carlo */}
          <section id="montecarlo" className="hub-section">
            <div className="hub-section__header">
              <div className="hub-section__title-group">
                <div className="hub-section__icon"><Target size={20} /></div>
                <h2 className="hub-section__title">Monte Carlo Methods</h2>
              </div>
              <span className="hub-section__badge">2 topics</span>
            </div>
            <div className="topic-grid">
              <HubCard title="Monte Carlo Pi Estimation" desc="Estimate π using random sampling with live visualisation." to="/legacy/MonteCarloPiEstimationVisualization.html" isLocked={!isUnlocked('/legacy/MonteCarloPiEstimationVisualization.html')} isCompleted={isCompleted('/legacy/MonteCarloPiEstimationVisualization.html')} isLegacy />
              <HubCard title="Monty Hall Problem" desc="Simulate the classic probability puzzle and see why switching wins (Native React component!)." to="/game/monty-hall" isLocked={!isUnlocked('/game/monty-hall')} isCompleted={isCompleted('/game/monty-hall')} />
            </div>
          </section>

          <hr className="hub-divider" />

          {/* Category: Advanced Topics */}
          <section id="advanced" className="hub-section">
            <div className="hub-section__header">
              <div className="hub-section__title-group">
                <div className="hub-section__icon"><Layers size={20} /></div>
                <h2 className="hub-section__title">Advanced Topics</h2>
              </div>
              <span className="hub-section__badge">6 topics</span>
            </div>
            <div className="module-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-16)' }}>
              <HubCard title="Mixture Model Explorer" desc="Visualise and understand Gaussian mixture models and the EM algorithm." to="/legacy/mixture-model-explorer/index.html" isLocked={!isUnlocked('/legacy/mixture-model-explorer/index.html')} isCompleted={isCompleted('/legacy/mixture-model-explorer/index.html')} isLegacy />
              <HubCard title="Likelihood &amp; MLE Dashboard" desc="Explore likelihood functions and maximum likelihood estimation interactively." to="/legacy/likelihood-mle-dashboard/index.html" isLocked={!isUnlocked('/legacy/likelihood-mle-dashboard/index.html')} isCompleted={isCompleted('/legacy/likelihood-mle-dashboard/index.html')} isLegacy />
              <HubCard title="Trinity of Uncertainty" desc="Understand aleatory, epistemic, and ontological uncertainty through interactive games." to="/legacy/trinity-uncertainty-dashboard/index.html" isLocked={!isUnlocked('/legacy/trinity-uncertainty-dashboard/index.html')} isCompleted={isCompleted('/legacy/trinity-uncertainty-dashboard/index.html')} isLegacy />
              <HubCard title="Bivariate Normal — 3D" desc="Explore the bivariate normal distribution in interactive three-dimensional space." to="/legacy/bivariate_normal_3_d_visualizer.html" isLocked={!isUnlocked('/legacy/bivariate_normal_3_d_visualizer.html')} isCompleted={isCompleted('/legacy/bivariate_normal_3_d_visualizer.html')} is3D />
              <HubCard title="Softmax Function" desc="Neural network activation function for multi-class classification." to="/legacy/softmax.html" isLocked={!isUnlocked('/legacy/softmax.html')} isCompleted={isCompleted('/legacy/softmax.html')} isLegacy />
              <HubCard title="ANOVA" desc="Analysis of variance to compare means across multiple groups." to="/legacy/anova.html" isLocked={!isUnlocked('/legacy/anova.html')} isCompleted={isCompleted('/legacy/anova.html')} isLegacy />
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};
