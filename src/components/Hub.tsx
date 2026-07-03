import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Compass, Link2, Dice5, Target, Layers, ArrowRight, BookOpen } from 'lucide-react';

interface HubCardProps {
  title: string;
  desc: string;
  to: string;
  isLegacy?: boolean;
  is3D?: boolean;
}

const HubCard: React.FC<HubCardProps> = ({ title, desc, to, isLegacy = false, is3D = false }) => {
  return (
    <Link to={to} className="topic-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {is3D && (
        <span className="module-card__badge module-card__badge--3d" style={{ marginBottom: 'var(--space-8)' }}>
          ◈ 3D Visualisation
        </span>
      )}
      {isLegacy && !is3D && (
        <span className="module-card__badge" style={{ marginBottom: 'var(--space-8)' }}>
          ⚡ Interactive
        </span>
      )}
      <h3 className="topic-card__title" style={{ marginBottom: 'var(--space-6)' }}>{title}</h3>
      <p className="topic-card__desc" style={{ flex: 1, margin: 0 }}>{desc}</p>
      <div className="topic-card__footer" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-12)' }}>
        Explore <ArrowRight size={12} />
      </div>
    </Link>
  );
};

export const Hub: React.FC = () => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('distributions');

  const categories = [
    { id: 'concepts', label: 'Probability Concepts', icon: BookOpen, count: 6 },
    { id: 'ch2concepts', label: 'Random Variables', icon: Layers, count: 10 },
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
              <span className="hub-stat__number">36+</span>
              <span className="hub-stat__label">Topics</span>
            </div>
            <div className="hub-stat">
              <span className="hub-stat__number">7</span>
              <span className="hub-stat__label">Categories</span>
            </div>
            <div className="hub-stat">
              <span className="hub-stat__number">15+</span>
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
                to="/concepts/probability-intro"
              />
              <HubCard
                title="Probability Models"
                desc="Formal definition: sample spaces, events as subsets, and the four axioms of the probability measure P."
                to="/concepts/probability-models"
              />
              <HubCard
                title="Properties of Probability Models"
                desc="Complement rule, law of total probability, monotonicity, inclusion-exclusion, and subadditivity."
                to="/concepts/probability-properties"
              />
              <HubCard
                title="Uniform Probability on Finite Spaces"
                desc="When all outcomes are equally likely: P(A) = |A|/|S|, counting via multiplication principle, permutations, and binomial coefficients."
                to="/concepts/uniform-probability"
              />
              <HubCard
                title="Conditional Probability & Independence"
                desc="How new information updates probabilities. P(A|B), the multiplication formula, Bayes' theorem, and independence."
                to="/concepts/conditional-probability"
              />
              <HubCard
                title="Continuity of Probability"
                desc="Increasing and decreasing sequences of events, and the fundamental continuity theorem for probability measures."
                to="/concepts/continuity-of-p"
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
                to="/ch2/rv-intro"
              />
              <HubCard
                title="Distributions of Random Variables"
                desc="The distribution of X: PMF for discrete RVs, PDF for continuous RVs, and how they encode all probabilistic information."
                to="/ch2/rv-distributions"
              />
              <HubCard
                title="Discrete Distributions"
                desc="Bernoulli, Binomial, Geometric, Negative Binomial, Poisson, and Hypergeometric — their PMFs, moments, and relationships."
                to="/ch2/discrete-distributions"
              />
              <HubCard
                title="Continuous Distributions"
                desc="Uniform, Exponential, Normal/Gaussian, Gamma, Beta — PDFs, CDFs, moments, and the role of each in modelling."
                to="/ch2/continuous-distributions"
              />
              <HubCard
                title="Cumulative Distribution Functions"
                desc="The CDF F(x) = P(X ≤ x): properties, the fundamental link between PMF/PDF and CDF, and survival functions."
                to="/ch2/cumulative-distribution"
              />
              <HubCard
                title="Change of Variable"
                desc="Transforming random variables: the change-of-variable formula for PDFs and the probability integral transform."
                to="/ch2/change-of-variable"
              />
              <HubCard
                title="Joint Distributions"
                desc="Joint PMFs and PDFs for pairs of random variables; marginal distributions; computing joint probabilities over regions."
                to="/ch2/joint-distributions"
              />
              <HubCard
                title="Conditioning &amp; Independence"
                desc="Conditional distributions, conditional expectation, and independence of random variables with formal criteria."
                to="/ch2/conditioning-independence"
              />
              <HubCard
                title="Multivariate Moments &amp; Covariance"
                desc="Expected value of functions of RVs, covariance, correlation, variance of sums, and the Cauchy-Schwarz inequality."
                to="/ch2/multidim-cov"
              />
              <HubCard
                title="Simulating Distributions"
                desc="Generating samples from arbitrary distributions: the inverse CDF method, Box-Muller transform, and rejection sampling."
                to="/ch2/simulating-distributions"
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
              <HubCard title="Bernoulli Distribution" desc="Single-trial binary outcomes with interactive probability slider." to="/distribution/bernoulli" />
              <HubCard title="Beta Distribution" desc="Continuous distribution over [0,1], useful for Bayesian priors." to="/distribution/beta" />
              <HubCard title="Binomial Distribution" desc="Number of successes in a fixed number of independent trials." to="/distribution/binomial" />
              <HubCard title="Exponential Distribution" desc="Time between Poisson events; memoryless continuous distribution." to="/distribution/exponential" />
              <HubCard title="Laplace Distribution" desc="Double-exponential distribution with heavier tails than Gaussian." to="/distribution/laplace" />
              <HubCard title="Gamma Distribution" desc="Generalisation of the exponential distribution for waiting times." to="/distribution/gemma" />
              <HubCard title="Log-Normal Distribution" desc="Distribution of a variable whose logarithm is normally distributed." to="/distribution/lognormal" />
              <HubCard title="Normal / Gaussian" desc="The ubiquitous bell curve defined by mean and standard deviation." to="/distribution/normal" />
              <HubCard title="Pareto Distribution" desc="Power-law distribution modelling the 80/20 rule." to="/distribution/pareto" />
              <HubCard title="Poisson Distribution" desc="Count of events occurring in a fixed interval of time or space." to="/distribution/poisson" />
              <HubCard title="Power Law Distribution" desc="Scale-free distribution found in networks, wealth, and language." to="/distribution/powerlaw" />
              <HubCard title="Uniform Distribution" desc="Every outcome equally likely across a bounded interval." to="/distribution/uniform" />
              <HubCard title="Z-Score &amp; Standard Normal" desc="Standardising data and working with the standard normal table." to="/distribution/zscore" />
              <HubCard title="Dirichlet Distribution" desc="Multivariate generalisation of the Beta; prior for categorical data." to="/distribution/Dirichlet" />
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
                to="/legacy/skewness-kurtosis-edu/index.html" 
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
              <HubCard title="Markov Chain Basics" desc="Discrete-time Markov chains with transition matrix visualisation." to="/legacy/markovChain.html" isLegacy />
              <HubCard title="Continuous Markov Chain" desc="Continuous-time Markov chain dynamics and rate matrices." to="/legacy/markovChainC.html" isLegacy />
              <HubCard title="Discrete Markov Chain (Interactive)" desc="In-depth educational module with exercises and visualisations." to="/legacy/markov-chains-edu/index.html" isLegacy />
              <HubCard title="Continuous Probability Learning" desc="Interactive continuous probability distributions learning module." to="/legacy/continuous-probability-learning/index.html" isLegacy />
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
              <HubCard title="Metropolis-Hastings Algorithm" desc="Step-by-step guide to one of the most important MCMC algorithms in Bayesian computation." to="/legacy/metropolis-hastings-learn/index.html" isLegacy />
              <HubCard title="Gibbs Sampling Tutor" desc="Learn Gibbs sampling through interactive demos, step-by-step calculations, and practice exercises." to="/legacy/gibbs-sampling-tutor/index.html" isLegacy />
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
              <HubCard title="Monte Carlo Pi Estimation" desc="Estimate π using random sampling with live visualisation." to="/legacy/MonteCarloPiEstimationVisualization.html" isLegacy />
              <HubCard title="Monty Hall Problem" desc="Simulate the classic probability puzzle and see why switching wins (Native React component!)." to="/game/monty-hall" />
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
              <HubCard title="Mixture Model Explorer" desc="Visualise and understand Gaussian mixture models and the EM algorithm." to="/legacy/mixture-model-explorer/index.html" isLegacy />
              <HubCard title="Likelihood &amp; MLE Dashboard" desc="Explore likelihood functions and maximum likelihood estimation interactively." to="/legacy/likelihood-mle-dashboard/index.html" isLegacy />
              <HubCard title="Trinity of Uncertainty" desc="Understand aleatory, epistemic, and ontological uncertainty through interactive games." to="/legacy/trinity-uncertainty-dashboard/index.html" isLegacy />
              <HubCard title="Bivariate Normal — 3D" desc="Explore the bivariate normal distribution in interactive three-dimensional space." to="/legacy/bivariate_normal_3_d_visualizer.html" is3D />
              <HubCard title="Softmax Function" desc="Neural network activation function for multi-class classification." to="/legacy/softmax.html" isLegacy />
              <HubCard title="ANOVA" desc="Analysis of variance to compare means across multiple groups." to="/legacy/anova.html" isLegacy />
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};
