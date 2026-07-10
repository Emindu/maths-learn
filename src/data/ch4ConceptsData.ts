import type { ContentBlock, ConceptSection, ProbabilityConcept } from './probabilityConceptsData';

export type { ContentBlock, ConceptSection, ProbabilityConcept };

export const ch4Concepts: ProbabilityConcept[] = [
  // ─────────────────────────────────────────────
  // 4.1  Sampling Distributions
  // ─────────────────────────────────────────────
  {
    id: 'sampling-distributions',
    title: 'Sampling Distributions',
    chapterRef: 'Chapter 4 · Section 4.1',
    description:
      'When X₁, X₂, …, Xₙ are i.i.d., the distribution of any function Y = h(X₁, …, Xₙ) is called a sampling distribution. Computing it exactly is often hard — approximation and simulation come to the rescue.',
    hook: 'Every estimator you\'ll build — sample mean, sample variance, regression coefficient — is a random variable with its own distribution. Understanding *how the estimator behaves*, not just what value it takes on your data, is what separates data reporting from statistical inference.',
    sections: [
      {
        heading: 'What Is a Sampling Distribution?',
        blocks: [
          {
            type: 'text',
            content:
              'Suppose X₁, X₂, …, Xₙ is an i.i.d. sequence drawn from some distribution. We form a new random variable Y = h(X₁, …, Xₙ) — for example the sample mean, geometric mean, or maximum. The distribution of Y is called its sampling distribution, because Y is based on a sample from an underlying distribution.',
          },
          {
            type: 'text',
            content:
              'Sampling distributions matter in statistics because quantities like the sample mean X̄ are used to estimate the population mean μ. Knowing the sampling distribution of X̄ tells us how reliable such estimates are.',
          },
          {
            type: 'definition',
            number: '4.1.1',
            title: 'Sampling Distribution',
            text: 'Let X₁, …, Xₙ be i.i.d. with common distribution F. The sampling distribution of a statistic Y = h(X₁, …, Xₙ) is the probability distribution of Y induced by F.',
          },
          { type: 'viz', vizId: 'viz-ch4-sampling-concept' },
        ],
      },
      {
        heading: 'Example: Geometric Mean of Two Draws',
        blocks: [
          {
            type: 'text',
            content:
              'Suppose we draw a sample X₁, X₂ of size n = 2 from the discrete distribution with p_X(1) = 1/2, p_X(2) = 1/4, p_X(3) = 1/4. Consider the geometric mean Y₂ = (X₁ X₂)^{1/2}.',
          },
          {
            type: 'example',
            number: '4.1.1',
            title: 'Geometric Mean Sampling Distribution',
            body: 'Listing all 9 possible pairs (X₁, X₂) and their probabilities gives: P(Y₂=1) = 1/4, P(Y₂=√2) = 1/4, P(Y₂=√3) = 1/4, P(Y₂=2) = 1/16, P(Y₂=√6) = 1/8, P(Y₂=3) = 1/16. This is the exact sampling distribution of Y₂.',
            formula: 'p_{Y_2}(y) = \\sum_{(x_1,x_2):\\,(x_1 x_2)^{1/2}=y} P(X_1=x_1)\\,P(X_2=x_2)',
          },
          { type: 'viz', vizId: 'viz-ch4-geometric-mean' },
          {
            type: 'text',
            content:
              'For a larger sample of size n = 20, there are 3^{20} ≈ 3.5 billion possible samples — direct enumeration becomes infeasible even for a computer. We need either the Central Limit Theorem (Section 4.4) or Monte Carlo simulation (Section 4.5).',
          },
        ],
      },
      {
        heading: 'The Sample Mean and Approximation Strategies',
        blocks: [
          {
            type: 'text',
            content:
              'The most important sampling distribution is that of the sample mean X̄ = (X₁ + ··· + Xₙ)/n. As n grows, its distribution concentrates around μ = E(X₁) and its shape approaches a normal distribution.',
          },
          {
            type: 'formula',
            latex: '\\bar{X} = h(X_1, \\ldots, X_n) = \\frac{1}{n}\\sum_{i=1}^n X_i',
            label: 'The sample mean as a function of the sample',
          },
          {
            type: 'text',
            content:
              'Two powerful approximation strategies exist: (1) The Central Limit Theorem tells us that √n(X̄ − μ)/σ converges in distribution to N(0,1), enabling normal-based probability calculations. (2) Monte Carlo methods generate many synthetic samples on a computer and use the empirical distribution to approximate the sampling distribution.',
          },
          { type: 'viz', vizId: 'viz-ch4-sample-mean-dist' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 4.2  Convergence in Probability
  // ─────────────────────────────────────────────
  {
    id: 'convergence-probability',
    title: 'Convergence in Probability',
    chapterRef: 'Chapter 4 · Section 4.2',
    description:
      'A sequence of random variables {Xₙ} converges in probability to Y if the probability that Xₙ and Y differ by more than ε tends to zero for every ε > 0. This underpins the Weak Law of Large Numbers.',
    hook: 'The Weak Law of Large Numbers is the promise every casino, insurer, and A/B-test rests on: with enough independent trials, sample averages get arbitrarily close to the true mean. Convergence in probability is the precise language for "arbitrarily close, almost always."',
    sections: [
      {
        heading: 'Definition and First Examples',
        blocks: [
          {
            type: 'definition',
            number: '4.2.1',
            title: 'Convergence in Probability',
            text: 'Let X₁, X₂, … be an infinite sequence of random variables, and let Y be another random variable. The sequence {Xₙ} converges in probability to Y, written Xₙ →^P Y, if for all ε > 0,',
            formula: '\\lim_{n\\to\\infty} P(|X_n - Y| \\ge \\epsilon) = 0.',
          },
          {
            type: 'example',
            number: '4.2.1',
            title: 'Identical Variables',
            body: 'Let X₁ = X₂ = ··· = Y. Then |Xₙ − Y| = 0 always, so P(|Xₙ − Y| ≥ ε) = 0 for all ε > 0. Trivially Xₙ →^P Y.',
          },
          {
            type: 'example',
            number: '4.2.4',
            title: 'Exponential Sequence',
            body: 'Suppose Zₙ ~ Exponential(n) and Y = 0. Then P(|Zₙ − 0| ≥ ε) = P(Zₙ ≥ ε) = e^{−nε} → 0 as n → ∞ for all ε > 0. So Zₙ →^P 0.',
            formula: 'P(Z_n \\ge \\epsilon) = \\int_\\epsilon^\\infty n e^{-nx}\\,dx = e^{-n\\epsilon} \\to 0.',
          },
          { type: 'viz', vizId: 'viz-ch4-conv-prob-scatter' },
        ],
      },
      {
        heading: 'The Weak Law of Large Numbers',
        blocks: [
          {
            type: 'text',
            content:
              'The most important application of convergence in probability is the Weak Law of Large Numbers (WLLN). It formalises the intuition that the sample average of many i.i.d. observations concentrates near the population mean.',
          },
          {
            type: 'theorem',
            number: '4.2.1',
            title: 'Weak Law of Large Numbers',
            text: 'Let X₁, X₂, … be i.i.d. with mean μ and variance v < ∞. Let Mₙ = (X₁ + ··· + Xₙ)/n. Then for every ε > 0,',
            formula: '\\lim_{n\\to\\infty} P(|M_n - \\mu| \\ge \\epsilon) = 0, \\quad\\text{i.e.,}\\quad M_n \\xrightarrow{P} \\mu.',
          },
          {
            type: 'text',
            content:
              'Proof sketch: By linearity of expectation, E(Mₙ) = μ. By independence, Var(Mₙ) = v/n. Chebyshev\'s inequality then gives P(|Mₙ − μ| ≥ ε) ≤ Var(Mₙ)/ε² = v/(nε²) → 0.',
            formula: 'P(|M_n - \\mu| \\ge \\epsilon) \\le \\frac{\\operatorname{Var}(M_n)}{\\epsilon^2} = \\frac{v}{n\\epsilon^2} \\to 0.',
          } as ContentBlock,
          { type: 'viz', vizId: 'viz-ch4-wlln-coins' },
        ],
      },
      {
        heading: 'WLLN in Action',
        blocks: [
          {
            type: 'example',
            number: '4.2.5',
            title: 'Fair Coin Fractions',
            body: 'Flip a fair coin repeatedly. Let Mₙ = (fraction of heads in n flips). By the WLLN, P(|Mₙ − 0.5| < ε) → 1 for any ε > 0. For large n, the fraction is very likely within ε of 0.5.',
          },
          {
            type: 'example',
            number: '4.2.7',
            title: 'Normal Sample Mean',
            body: 'Let X₁, X₂, … be i.i.d. N(3, 5). Then E(Mₙ) = 3, and by WLLN, P(3 − ε < Mₙ < 3 + ε) → 1 as n → ∞. The sample average concentrates at 3 regardless of how large σ² = 5 is.',
          },
          {
            type: 'text',
            content:
              'The WLLN applies to any distribution with finite mean and finite variance. There is an even stronger version — the Strong Law of Large Numbers — that requires only finite mean (Section 4.3).',
          },
          { type: 'viz', vizId: 'viz-ch4-wlln-general' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 4.3  Convergence with Probability 1
  // ─────────────────────────────────────────────
  {
    id: 'convergence-probability-1',
    title: 'Convergence with Probability 1',
    chapterRef: 'Chapter 4 · Section 4.3',
    description:
      'Almost sure (a.s.) convergence is a stronger notion: every realisation of the sequence (except a set of probability zero) eventually converges. The Strong Law of Large Numbers guarantees a.s. convergence of sample means.',
    hook: 'Almost sure convergence is the "for every simulation you\'ll ever actually run" version of the law of large numbers. It\'s the reason a single long Monte Carlo run — not just an average over many runs — is guaranteed to converge to the true value.',
    sections: [
      {
        heading: 'Almost Sure Convergence',
        blocks: [
          {
            type: 'definition',
            number: '4.3.1',
            title: 'Convergence with Probability 1 (Almost Sure)',
            text: 'The sequence {Xₙ} converges almost surely (a.s.) to Y, written Xₙ →^{a.s.} Y, if',
            formula: 'P\\!\\left(\\lim_{n\\to\\infty} X_n = Y\\right) = 1.',
          },
          {
            type: 'text',
            content:
              'Intuitively: pick a single infinite sequence of outcomes ω. For almost sure convergence, the numeric sequence Xₙ(ω) must converge to Y(ω) for every ω outside a probability-zero exceptional set. This is stronger than convergence in probability, which only requires the distribution of Xₙ to concentrate near Y.',
          },
          {
            type: 'theorem',
            number: '4.3.1',
            title: 'A.S. Implies In Probability',
            text: 'If Xₙ →^{a.s.} Y, then Xₙ →^P Y. The converse is false.',
          },
          { type: 'viz', vizId: 'viz-ch4-as-conv-path' },
        ],
      },
      {
        heading: 'The Converse Can Fail: Typewriter Sequence',
        blocks: [
          {
            type: 'example',
            number: '4.3.2',
            title: 'Typewriter Sequence',
            body: 'Let U ~ Uniform[0,1]. Define X₁ = I_{[0,1/2)}(U), X₂ = I_{[1/2,1]}(U), X₃ = I_{[0,1/4)}(U), X₄ = I_{[1/4,1/2)}(U), X₅ = I_{[1/2,3/4)}(U), … In general the intervals get smaller, so P(Xₙ = 1) → 0, meaning Xₙ →^P 0. But for any fixed U = u, the value u will fall in infinitely many sub-intervals, so Xₙ(u) = 1 infinitely often — Xₙ does NOT converge to 0 a.s.',
          },
          {
            type: 'text',
            content:
              'This shows that convergence in probability does not imply almost sure convergence. The typewriter sequence "crawls" across [0,1] in shorter and shorter sweeps: the probability of being far from 0 vanishes, but every realisation gets hit repeatedly.',
          },
          { type: 'viz', vizId: 'viz-ch4-as-vs-prob' },
        ],
      },
      {
        heading: 'The Strong Law of Large Numbers',
        blocks: [
          {
            type: 'theorem',
            number: '4.3.2',
            title: 'Strong Law of Large Numbers',
            text: 'Let X₁, X₂, … be i.i.d. with finite mean μ. Then the sample average Mₙ = (X₁ + ··· + Xₙ)/n satisfies',
            formula: 'P\\!\\left(\\lim_{n\\to\\infty} M_n = \\mu\\right) = 1, \\quad\\text{i.e.,}\\quad M_n \\xrightarrow{\\text{a.s.}} \\mu.',
          },
          {
            type: 'text',
            content:
              'The SLLN says something stronger than the WLLN: not just that the distribution of Mₙ concentrates near μ, but that with probability 1 the actual running average of your sample eventually stays close to μ and never permanently wanders away. It requires only a finite mean — no finite variance assumption needed.',
          },
          { type: 'viz', vizId: 'viz-ch4-strong-lln' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 4.4  Convergence in Distribution & CLT
  // ─────────────────────────────────────────────
  {
    id: 'convergence-distribution',
    title: 'Convergence in Distribution & the CLT',
    chapterRef: 'Chapter 4 · Section 4.4',
    description:
      'Convergence in distribution (weak convergence) requires only that CDFs converge at continuity points. The Central Limit Theorem is the crowning result: standardised sample means always approach N(0,1), regardless of the underlying distribution.',
    hook: 'The Central Limit Theorem is the single most consequential result in probability: the average of many independent things looks Gaussian, no matter what those things are. It\'s why bell curves show up everywhere — from measurement error to opinion polls to particle physics.',
    sections: [
      {
        heading: 'Convergence in Distribution',
        blocks: [
          {
            type: 'predict',
            title: 'A CLT preview',
            question: 'You roll a fair six-sided die 100 times and compute the average. Roughly what\'s the probability the average falls outside 3.5 ± 0.2?',
            reveal: 'About 24%. One die has mean 3.5 and variance 35/12 ≈ 2.917, so the sample mean of 100 rolls has SD √(2.917/100) ≈ 0.171. The CLT says X̄ ≈ Normal(3.5, 0.171²), so P(|X̄ − 3.5| > 0.2) ≈ P(|Z| > 1.17) ≈ 0.24. A discrete uniform die becomes indistinguishable from a normal after just 100 rolls — that\'s the CLT in one line.',
          },
          {
            type: 'definition',
            number: '4.4.1',
            title: 'Convergence in Distribution',
            text: 'The sequence {Xₙ} converges in distribution to X, written Xₙ →^D X, if for all x ∈ ℝ where P(X = x) = 0,',
            formula: '\\lim_{n\\to\\infty} P(X_n \\le x) = P(X \\le x).',
          },
          {
            type: 'example',
            number: '4.4.5',
            title: 'Poisson Approximation to Binomial',
            body: 'Let Xₙ ~ Binomial(n, λ/n) and X ~ Poisson(λ). Then P(Xₙ = j) → e^{−λ}λʲ/j! as n → ∞, so Xₙ →^D X. This is the classical Poisson approximation: for large n and small p with np = λ fixed.',
            formula: '\\binom{n}{j}\\left(\\frac{\\lambda}{n}\\right)^j\\!\\left(1-\\frac{\\lambda}{n}\\right)^{n-j} \\to e^{-\\lambda}\\frac{\\lambda^j}{j!}',
          },
          {
            type: 'theorem',
            number: '4.4.1',
            title: 'In Probability Implies In Distribution',
            text: 'If Xₙ →^P X, then Xₙ →^D X. (The hierarchy is: a.s. ⟹ in prob ⟹ in distribution.)',
          },
        ],
      },
      {
        heading: 'The Central Limit Theorem',
        blocks: [
          {
            type: 'text',
            content:
              'The CLT is one of the most remarkable results in all of mathematics. It says that no matter what distribution the Xᵢ come from (provided they have finite variance), the standardised sample mean always approaches a standard normal distribution.',
          },
          {
            type: 'theorem',
            number: '4.4.3',
            title: 'Central Limit Theorem',
            text: 'Let X₁, X₂, … be i.i.d. with mean μ and variance σ² < ∞. Let Zₙ = (Mₙ − μ)/(σ/√n) be the standardised sample mean. Then as n → ∞,',
            formula: 'Z_n = \\frac{M_n - \\mu}{\\sigma/\\sqrt{n}} = \\sqrt{n}\\left(\\frac{M_n-\\mu}{\\sigma}\\right) \\xrightarrow{D} Z \\sim N(0,1).',
          },
          {
            type: 'corollary',
            number: '4.4.2',
            title: 'Probability Approximation',
            text: 'For large n, P(Zₙ ≤ x) ≈ Φ(x), where Φ is the standard normal CDF. Equivalently, Sₙ = X₁ + ··· + Xₙ is approximately N(nμ, nσ²) and Mₙ is approximately N(μ, σ²/n).',
          },
          { type: 'viz', vizId: 'viz-ch4-clt-histogram' },
        ],
      },
      {
        heading: 'CLT in Practice',
        blocks: [
          {
            type: 'example',
            number: '4.4.7',
            title: 'Uniform[0,1] Sums',
            body: 'If X ~ Uniform[0,1] then μ = 1/2 and σ² = 1/12. The CLT says Zₙ = (Mₙ − 1/2) / (1/√(12n)) → N(0,1). Density histograms show the approximation becomes excellent by n = 10 even though Uniform is far from normal.',
            formula: 'Z_n = \\sqrt{12n}\\left(M_n - \\tfrac{1}{2}\\right) \\xrightarrow{D} N(0,1)',
          },
          { type: 'viz', vizId: 'viz-ch4-clt-uniform' },
          {
            type: 'text',
            content:
              'The CLT also motivates the normal approximation to the Binomial. If X ~ Binomial(n, p) then X = X₁ + ··· + Xₙ with Xᵢ ~ Bernoulli(p), so (X − np)/√(np(1−p)) → N(0,1). This approximation is accurate when both np ≥ 5 and n(1−p) ≥ 5.',
          },
          { type: 'viz', vizId: 'viz-ch4-binomial-normal' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 4.5  Monte Carlo Approximations
  // ─────────────────────────────────────────────
  {
    id: 'monte-carlo-approx',
    title: 'Monte Carlo Approximations',
    chapterRef: 'Chapter 4 · Section 4.5',
    description:
      'When analytic results are intractable, Monte Carlo simulation estimates probabilities and expectations by averaging over many simulated samples. The Law of Large Numbers guarantees convergence; the CLT quantifies the error.',
    hook: 'When an integral is too messy to compute or a distribution too tangled to work with analytically, Monte Carlo turns the problem into "just sample from it and average." It is how modern finance prices exotic options, how RL agents estimate returns, and how physicists compute path integrals.',
    sections: [
      {
        heading: 'The Monte Carlo Principle',
        blocks: [
          {
            type: 'text',
            content:
              'The Monte Carlo method uses computers to generate N independent copies X₁, …, X_N from a distribution F, and approximates E[h(X)] by the sample average. By the LLN, this estimate converges to the true value as N → ∞.',
          },
          {
            type: 'formula',
            latex: 'E[h(X)] \\approx \\frac{1}{N}\\sum_{i=1}^N h(X_i)',
            label: 'Monte Carlo estimator (consistent by the LLN)',
          },
          {
            type: 'example',
            number: '4.5.1',
            title: 'Estimating π',
            body: 'Generate (X, Y) ~ Uniform on [0,1]². The point lands inside the unit circle if X² + Y² ≤ 1, which happens with probability π/4. So π ≈ 4 × (number of points inside circle) / N.',
          },
          { type: 'viz', vizId: 'viz-ch4-mc-pi' },
        ],
      },
      {
        heading: 'Monte Carlo Integration',
        blocks: [
          {
            type: 'text',
            content:
              'For a definite integral, write ∫_a^b f(x) dx = (b − a) · E[f(U)] where U ~ Uniform[a, b]. Sample N values from U[a, b] and average f over them.',
          },
          {
            type: 'formula',
            latex: '\\int_a^b f(x)\\,dx = (b-a)\\,E[f(U)] \\approx \\frac{b-a}{N}\\sum_{i=1}^N f(U_i)',
            label: 'Monte Carlo integration',
          },
          {
            type: 'example',
            number: '4.5.2',
            title: 'Estimating ∫₀¹ x² dx',
            body: 'The true value is 1/3. Draw U₁, …, U_N ~ Uniform[0,1] and compute (1/N)Σ Uᵢ². The average converges to E[U²] = 1/3 by the LLN.',
          },
          { type: 'viz', vizId: 'viz-ch4-mc-integration' },
        ],
      },
      {
        heading: 'Error and Sample Size',
        blocks: [
          {
            type: 'text',
            content:
              'The MC estimator has standard error σ_h/√N where σ_h = √Var(h(X)). By the CLT, the estimator is approximately normal, giving confidence intervals.',
          },
          {
            type: 'formula',
            latex: '\\hat{\\mu}_N \\approx N\\!\\left(\\mu,\\,\\frac{\\sigma_h^2}{N}\\right) \\quad\\Rightarrow\\quad \\text{error} = O\\!\\left(\\frac{1}{\\sqrt{N}}\\right)',
            label: 'MC error shrinks at rate 1/√N regardless of dimension',
          },
          {
            type: 'text',
            content:
              'To halve the error, you need four times as many samples. The 1/√N rate is dimension-free — Monte Carlo is especially powerful in high dimensions where numerical quadrature would require exponentially many grid points.',
          },
          { type: 'viz', vizId: 'viz-ch4-mc-error' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 4.6  Normal Distribution Theory
  // ─────────────────────────────────────────────
  {
    id: 'normal-distribution-theory',
    title: 'Normal Distribution Theory',
    chapterRef: 'Chapter 4 · Section 4.6',
    description:
      'When data are normal, exact sampling distributions are available. Linear combinations of normals are normal; squares of standard normals yield chi-squared distributions; ratios produce t and F distributions.',
    hook: 'Under normal data, everything closes: sums, differences, ratios and quadratic forms all land in named distributions with known tables. This tidy algebra is why t-tests, ANOVA, and linear regression have exact — not just asymptotic — inference.',
    sections: [
      {
        heading: 'Linear Combinations of Normal Variables',
        blocks: [
          {
            type: 'text',
            content:
              'The normal family is closed under linear operations. This makes normal-based calculations exact rather than approximate, which is why the normal distribution occupies such a central place in statistics.',
          },
          {
            type: 'theorem',
            number: '4.6.1',
            title: 'Linear Combinations of Independent Normals',
            text: 'If X ~ N(μ₁, σ₁²) and Y ~ N(μ₂, σ₂²) are independent, and a, b, c are constants, then aX + bY + c is also normal:',
            formula: 'aX + bY + c \\sim N\\!\\left(a\\mu_1 + b\\mu_2 + c,\\; a^2\\sigma_1^2 + b^2\\sigma_2^2\\right).',
          },
          {
            type: 'corollary',
            number: '4.6.1',
            title: 'Sample Mean of i.i.d. Normals',
            text: 'If X₁, …, Xₙ ~ i.i.d. N(μ, σ²), the sample mean X̄ ~ N(μ, σ²/n) exactly (not approximately).',
            formula: '\\bar{X} \\sim N\\!\\left(\\mu,\\, \\frac{\\sigma^2}{n}\\right)',
          },
          { type: 'viz', vizId: 'viz-ch4-normal-linear-comb' },
        ],
      },
      {
        heading: 'The Chi-Squared Distribution',
        blocks: [
          {
            type: 'definition',
            number: '4.6.2',
            title: 'Chi-Squared Distribution',
            text: 'If Z₁, …, Zₙ ~ i.i.d. N(0, 1), the sum of their squares follows a chi-squared distribution with n degrees of freedom:',
            formula: 'W = Z_1^2 + Z_2^2 + \\cdots + Z_n^2 \\sim \\chi^2(n).',
          },
          {
            type: 'text',
            content:
              'The χ²(n) distribution has mean n and variance 2n. It appears in the sampling distribution of the sample variance S² when the data are normal: (n−1)S²/σ² ~ χ²(n−1). Its PDF is a special case of the Gamma distribution: χ²(n) = Gamma(n/2, 2).',
          },
          { type: 'viz', vizId: 'viz-ch4-chi-squared' },
        ],
      },
      {
        heading: 'The t-Distribution',
        blocks: [
          {
            type: 'definition',
            number: '4.6.3',
            title: 't-Distribution',
            text: 'If Z ~ N(0,1) and W ~ χ²(n) are independent, the ratio T = Z / √(W/n) follows a t-distribution with n degrees of freedom, written T ~ t(n).',
            formula: 'T = \\frac{Z}{\\sqrt{W/n}} \\sim t(n)',
          },
          {
            type: 'text',
            content:
              'The t-distribution is symmetric and bell-shaped but has heavier tails than N(0,1). As n → ∞, t(n) → N(0,1). The t arises naturally when estimating a normal mean with unknown variance: the statistic (X̄ − μ)/(S/√n) ~ t(n−1), where S is the sample standard deviation.',
          },
          {
            type: 'text',
            content:
              'The t-distribution is the basis of the one-sample t-test and t-confidence intervals, making it one of the most used distributions in applied statistics.',
          },
          { type: 'viz', vizId: 'viz-ch4-t-distribution' },
        ],
      },
    ],
  },
];

export function getCh4ConceptById(id: string): ProbabilityConcept | undefined {
  return ch4Concepts.find((c) => c.id === id);
}
