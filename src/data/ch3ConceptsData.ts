import type { ContentBlock, ConceptSection, ProbabilityConcept } from './probabilityConceptsData';

export type { ContentBlock, ConceptSection, ProbabilityConcept };

export const ch3Concepts: ProbabilityConcept[] = [
  // ─────────────────────────────────────────────
  // 3.1  Expectation: The Discrete Case
  // ─────────────────────────────────────────────
  {
    id: 'expectation-discrete',
    title: 'Expectation: The Discrete Case',
    chapterRef: 'Chapter 3 · Section 3.1',
    description:
      'The expected value of a discrete random variable is its probability-weighted average — the long-run mean you observe in repeated experiments.',
    sections: [
      {
        heading: 'Defining Expected Value',
        blocks: [
          {
            type: 'text',
            content:
              'The expected value (or expectation, or mean) of a random variable X is the probability-weighted average of all values X can take. It is the "centre of gravity" of the distribution — the long-run average you would observe if you repeated the experiment indefinitely.',
          },
          {
            type: 'definition',
            number: '3.1.1',
            title: 'Expected Value (Discrete Case)',
            text: 'If X is a discrete random variable with PMF p(x) = P(X = x), the expected value of X is',
            formula: 'E(X) = \\sum_{x} x \\cdot P(X = x)',
          },
          {
            type: 'example',
            number: '3.1.1',
            title: 'Fair Six-Sided Die',
            body: 'For a fair die, each face has probability 1/6, so E(X) = 1·(1/6) + 2·(1/6) + ··· + 6·(1/6) = 21/6 = 3.5. Even though 3.5 is not itself a possible outcome, it is the long-run average.',
          },
          { type: 'viz', vizId: 'viz-discrete-expectation' },
        ],
      },
      {
        heading: 'Expectations of Standard Discrete Distributions',
        blocks: [
          {
            type: 'text',
            content:
              'Applying the definition to each distribution from Chapter 2 yields a compact formula for its mean.',
          },
          {
            type: 'example',
            number: '3.1.2',
            title: 'Bernoulli(θ)',
            body: 'E(X) = 0·(1−θ) + 1·θ = θ. The expected value equals the success probability.',
          },
          {
            type: 'example',
            number: '3.1.3',
            title: 'Binomial(n, θ)',
            body: 'E(X) = nθ. A binomial random variable is the sum of n independent Bernoulli(θ) variables, each with mean θ, so linearity gives nθ immediately.',
          },
          {
            type: 'example',
            number: '3.1.4',
            title: 'Geometric(θ) — number of failures before first success',
            body: 'E(X) = (1−θ)/θ. For a fair coin (θ = 1/2), you expect 1 failure before the first heads on average.',
          },
          {
            type: 'example',
            number: '3.1.5',
            title: 'Poisson(λ)',
            body: 'E(Y) = λ. The mean of a Poisson random variable equals its rate parameter — a clean result that makes λ easy to interpret.',
          },
        ],
      },
      {
        heading: 'Expectation of a Function — Theorem 3.1.1',
        blocks: [
          {
            type: 'text',
            content:
              'To find E[g(X)] for some function g, we do not need to first determine the distribution of g(X). We can work directly with the distribution of X.',
          },
          {
            type: 'theorem',
            number: '3.1.1',
            title: 'Law of the Unconscious Statistician',
            text: 'If X is discrete with PMF p(x) and g : ℝ → ℝ is any function, then',
            formula: 'E[g(X)] = \\sum_{x} g(x) \\cdot P(X = x)',
          },
          {
            type: 'example',
            number: '3.1.6',
            title: 'E[X²] for a Fair Die',
            body: 'E[X²] = 1²(1/6) + 2²(1/6) + ··· + 6²(1/6) = (1+4+9+16+25+36)/6 = 91/6 ≈ 15.17. Notice E[X²] = 15.17 ≠ (E[X])² = 12.25 — a key distinction that motivates variance.',
          },
        ],
      },
      {
        heading: 'Linearity of Expectation',
        blocks: [
          {
            type: 'text',
            content:
              'Linearity is the most powerful property of expectation. It holds for any random variables — independent or not — and removes the need to compute joint distributions for sums.',
          },
          {
            type: 'theorem',
            number: '3.1.2',
            title: 'Linearity of Expectation',
            text: 'For any random variables X and Y and constants a, b ∈ ℝ:',
            formula: 'E[aX + bY] = a\\,E[X] + b\\,E[Y]',
          },
          {
            type: 'example',
            number: '3.1.7',
            title: 'St. Petersburg Paradox',
            body: 'Flip a fair coin repeatedly until the first head. If head first appears on flip k, win $2ᵏ. The expected payoff is Σₖ₌₁^∞ (1/2ᵏ)·2ᵏ = Σ 1 = ∞. Yet most people would pay at most a few dollars to play. Infinite expected value does not capture risk aversion — expected utility theory is needed for realistic decision-making.',
          },
          { type: 'viz', vizId: 'viz-st-petersburg' },
        ],
      },
      {
        heading: 'Independence and Products',
        blocks: [
          {
            type: 'theorem',
            number: '3.1.3',
            title: 'Independence → Multiplicativity',
            text: 'If X and Y are independent random variables, then',
            formula: 'E[XY] = E[X] \\cdot E[Y]',
          },
          {
            type: 'text',
            content:
              'Warning: the converse fails. E[XY] = E[X]E[Y] only implies zero covariance (uncorrelatedness), which is weaker than independence.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 3.2  Expectation: The Continuous Case
  // ─────────────────────────────────────────────
  {
    id: 'expectation-continuous',
    title: 'Expectation: The Continuous Case',
    chapterRef: 'Chapter 3 · Section 3.2',
    description:
      'For absolutely continuous random variables, expectation replaces the weighted sum with a weighted integral — the density plays the role of the PMF.',
    sections: [
      {
        heading: 'The Continuous Expectation Formula',
        blocks: [
          {
            type: 'text',
            content:
              'When X has a probability density function f_X, we replace the discrete sum with an integral. Each value x is weighted by the density f_X(x) at that point.',
          },
          {
            type: 'definition',
            number: '3.2.1',
            title: 'Expected Value (Continuous Case)',
            text: 'If X has density f_X, its expected value is',
            formula: 'E(X) = \\int_{-\\infty}^{\\infty} x \\cdot f_X(x)\\,dx',
          },
          {
            type: 'text',
            content:
              'Geometrically, E(X) is the centre of mass of the density curve — the balance point of the probability "weight" spread along the x-axis.',
          },
          { type: 'viz', vizId: 'viz-continuous-expectation' },
        ],
      },
      {
        heading: 'Means of Common Continuous Distributions',
        blocks: [
          {
            type: 'example',
            number: '3.2.1',
            title: 'Uniform[L, R]',
            body: 'E(X) = (L + R)/2. By symmetry, the mean is the midpoint of the interval.',
          },
          {
            type: 'example',
            number: '3.2.2',
            title: 'Exponential(λ)',
            body: 'E(X) = 1/λ. The mean waiting time is the reciprocal of the rate. For λ = 2 calls per minute, the average wait is 0.5 minutes.',
          },
          {
            type: 'example',
            number: '3.2.3',
            title: 'Normal N(μ, σ²)',
            body: 'E(X) = μ. The normal distribution is symmetric about μ, so the mean, median, and mode all coincide at μ.',
          },
          {
            type: 'formula',
            label: 'Summary of continuous means',
            latex:
              '\\text{Uniform}[L,R]: \\tfrac{L+R}{2} \\qquad \\text{Exp}(\\lambda): \\tfrac{1}{\\lambda} \\qquad N(\\mu,\\sigma^2): \\mu',
          },
        ],
      },
      {
        heading: 'Linearity and the LOTUS — Continuous Version',
        blocks: [
          {
            type: 'text',
            content:
              'All three theorems from Section 3.1 carry over to the continuous case: linearity (Theorem 3.2.1), the Law of the Unconscious Statistician (Theorem 3.2.2), and independence → multiplicativity (Theorem 3.2.3). Proofs are identical in structure, with sums replaced by integrals.',
          },
          {
            type: 'theorem',
            number: '3.2.2',
            title: 'LOTUS (Continuous)',
            text: 'If X has density f_X and g : ℝ → ℝ, then',
            formula: 'E[g(X)] = \\int_{-\\infty}^{\\infty} g(x)\\,f_X(x)\\,dx',
          },
          {
            type: 'example',
            number: '3.2.4',
            title: 'E[X²] for Exponential(λ)',
            body: 'E[X²] = ∫₀^∞ x² λe^{−λx} dx = 2/λ². Since E[X] = 1/λ, we get Var(X) = E[X²] − (E[X])² = 2/λ² − 1/λ² = 1/λ² — a result we formalise in Section 3.3.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 3.3  Variance, Covariance, and Correlation
  // ─────────────────────────────────────────────
  {
    id: 'variance-covariance',
    title: 'Variance, Covariance & Correlation',
    chapterRef: 'Chapter 3 · Section 3.3',
    description:
      'Variance measures how spread out a distribution is; covariance and correlation measure the linear relationship between two random variables.',
    sections: [
      {
        heading: 'Variance: Measuring Spread',
        blocks: [
          {
            type: 'text',
            content:
              'Expected value tells us the centre of a distribution, but not its spread. Two distributions can share the same mean but be very different in shape. Variance quantifies the average squared deviation from the mean.',
          },
          {
            type: 'definition',
            number: '3.3.1',
            title: 'Variance',
            text: 'The variance of a random variable X with mean μ = E(X) is',
            formula: '\\operatorname{Var}(X) = E\\bigl[(X - \\mu)^2\\bigr] = E[X^2] - (E[X])^2',
          },
          {
            type: 'text',
            content:
              'The standard deviation is SD(X) = √Var(X), which has the same units as X and is more interpretable.',
          },
          { type: 'viz', vizId: 'viz-variance-spread' },
        ],
      },
      {
        heading: 'Scaling and Shifting',
        blocks: [
          {
            type: 'theorem',
            number: '3.3.1',
            title: 'Variance of a Linear Transform',
            text: 'For constants a, b ∈ ℝ:',
            formula: '\\operatorname{Var}(aX + b) = a^2 \\operatorname{Var}(X)',
          },
          {
            type: 'text',
            content:
              'Adding a constant b shifts the distribution but does not change its spread. Multiplying by a scales the spread by |a| (and hence variance by a²).',
          },
        ],
      },
      {
        heading: 'Variances of Standard Distributions',
        blocks: [
          {
            type: 'example',
            number: '3.3.1',
            title: 'Bernoulli(θ)',
            body: 'Var(X) = θ(1−θ). Spread is maximised at θ = 1/2 (most uncertain) and vanishes at θ = 0 or θ = 1 (certain outcome).',
          },
          {
            type: 'example',
            number: '3.3.2',
            title: 'Exponential(λ)',
            body: 'Var(X) = 1/λ². The standard deviation equals the mean 1/λ — a distinctive feature of the exponential distribution.',
          },
          {
            type: 'example',
            number: '3.3.3',
            title: 'Normal N(μ, σ²)',
            body: 'Var(X) = σ². The parameter σ² directly encodes the variance, which is why the notation N(μ, σ²) is standard.',
          },
        ],
      },
      {
        heading: 'Covariance and Correlation',
        blocks: [
          {
            type: 'text',
            content:
              'Covariance measures the direction of linear association between two random variables X and Y. Positive covariance means they tend to move together; negative means they move oppositely.',
          },
          {
            type: 'definition',
            number: '3.3.2',
            title: 'Covariance',
            text: 'The covariance of X and Y is',
            formula: '\\operatorname{Cov}(X,Y) = E[XY] - E[X]\\,E[Y]',
          },
          {
            type: 'definition',
            number: '3.3.3',
            title: 'Correlation',
            text: 'The (Pearson) correlation coefficient is the scale-free version of covariance:',
            formula: '\\operatorname{Corr}(X,Y) = \\frac{\\operatorname{Cov}(X,Y)}{\\operatorname{SD}(X)\\,\\operatorname{SD}(Y)}',
          },
          {
            type: 'text',
            content:
              'Correlation lies in [−1, 1]. Values near ±1 indicate strong linear association; 0 means no linear relationship (though nonlinear dependence may still exist).',
          },
          { type: 'viz', vizId: 'viz-covariance-sign' },
        ],
      },
      {
        heading: 'Variance of a Sum',
        blocks: [
          {
            type: 'theorem',
            number: '3.3.2',
            title: 'Variance of a Sum',
            text: 'For any random variables X and Y:',
            formula: '\\operatorname{Var}(X + Y) = \\operatorname{Var}(X) + \\operatorname{Var}(Y) + 2\\operatorname{Cov}(X,Y)',
          },
          {
            type: 'text',
            content:
              'If X and Y are independent, then Cov(X,Y) = 0, so Var(X+Y) = Var(X) + Var(Y). This additive rule extends to any number of independent variables and underpins the Central Limit Theorem.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 3.4  Generating Functions
  // ─────────────────────────────────────────────
  {
    id: 'generating-functions',
    title: 'Generating Functions',
    chapterRef: 'Chapter 3 · Section 3.4',
    description:
      'Probability generating functions and moment generating functions encode an entire distribution in a single function, and their derivatives yield moments directly.',
    sections: [
      {
        heading: 'Probability Generating Functions',
        blocks: [
          {
            type: 'text',
            content:
              'For a non-negative integer-valued random variable X, the probability generating function (PGF) packs all probabilities into the coefficients of a power series.',
          },
          {
            type: 'definition',
            number: '3.4.1',
            title: 'Probability Generating Function',
            text: 'The PGF of a non-negative integer-valued random variable X is',
            formula: 'r_X(t) = E[t^X] = \\sum_{k=0}^{\\infty} P(X=k)\\,t^k',
          },
          {
            type: 'text',
            content:
              'The k-th derivative of r_X at t = 0, divided by k!, recovers P(X = k). Evaluating r_X(1) = 1 verifies normalisation. The first derivative at 1 gives E(X).',
          },
        ],
      },
      {
        heading: 'Moment Generating Functions',
        blocks: [
          {
            type: 'text',
            content:
              'The moment generating function (MGF) works for any random variable (not just integer-valued) and provides an elegant way to compute all moments via repeated differentiation.',
          },
          {
            type: 'definition',
            number: '3.4.2',
            title: 'Moment Generating Function',
            text: 'The MGF of X is',
            formula: 'm_X(s) = E[e^{sX}]',
          },
          {
            type: 'theorem',
            number: '3.4.1',
            title: 'MGF and Moments',
            text: 'If m_X(s) exists in an open interval around s = 0, then all moments of X exist, and',
            formula: "E[X^k] = m_X^{(k)}(0) = \\frac{d^k}{ds^k} m_X(s)\\Big|_{s=0}",
          },
        ],
      },
      {
        heading: 'MGFs of Standard Distributions',
        blocks: [
          {
            type: 'example',
            number: '3.4.1',
            title: 'Binomial(n, θ)',
            body: 'm_X(s) = (θeˢ + 1−θ)ⁿ. Differentiating twice and evaluating at s=0: E(X) = nθ, Var(X) = nθ(1−θ).',
          },
          {
            type: 'example',
            number: '3.4.2',
            title: 'Poisson(λ)',
            body: 'm_Y(s) = exp(λ(eˢ−1)). Differentiating gives E(Y) = λ and Var(Y) = λ.',
          },
          {
            type: 'example',
            number: '3.4.3',
            title: 'Standard Normal N(0, 1)',
            body: 'm_Z(s) = e^{s²/2}. This compact closed form makes the normal distribution particularly tractable.',
          },
          {
            type: 'formula',
            label: 'MGF of N(μ, σ²)',
            latex: 'm_X(s) = \\exp\\!\\left(\\mu s + \\tfrac{1}{2}\\sigma^2 s^2\\right)',
          },
          { type: 'viz', vizId: 'viz-mgf-table' },
        ],
      },
      {
        heading: 'Independence and Uniqueness',
        blocks: [
          {
            type: 'theorem',
            number: '3.4.2',
            title: 'MGF of a Sum of Independent Variables',
            text: 'If X and Y are independent, then',
            formula: 'm_{X+Y}(s) = m_X(s) \\cdot m_Y(s)',
          },
          {
            type: 'theorem',
            number: '3.4.3',
            title: 'Uniqueness Theorem',
            text: 'If two random variables have the same MGF (in a neighbourhood of 0), they have the same distribution.',
          },
          {
            type: 'text',
            content:
              'The characteristic function c_X(s) = E[e^{isX}] always exists (unlike the MGF) and also uniquely determines the distribution. It is the tool of choice for proving the Central Limit Theorem.',
          },
        ],
      },
      {
        heading: 'Compound Distributions',
        blocks: [
          {
            type: 'text',
            content:
              'A compound distribution arises when the number of summands N is itself random. If S = X₁ + ··· + X_N where the Xᵢ are i.i.d. and independent of N, then by the law of total expectation E(S) = E(X₁)·E(N), and the MGF satisfies m_S(s) = r_N(m_{X₁}(s)).',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 3.5  Conditional Expectation
  // ─────────────────────────────────────────────
  {
    id: 'conditional-expectation',
    title: 'Conditional Expectation',
    chapterRef: 'Chapter 3 · Section 3.5',
    description:
      'Conditioning on an event or on another random variable updates our expected value, just as conditioning updates probability. The law of total expectation and variance decomposition follow.',
    sections: [
      {
        heading: 'Conditional Expectation Given an Event',
        blocks: [
          {
            type: 'text',
            content:
              'Given that event A has occurred, we update our probabilities using P(X=x|A) and then compute the expectation under the updated distribution.',
          },
          {
            type: 'definition',
            number: '3.5.1',
            title: 'Conditional Expectation Given an Event',
            text: 'For a discrete random variable X and event A with P(A) > 0:',
            formula: 'E(X \\mid A) = \\sum_x x \\cdot P(X = x \\mid A)',
          },
          {
            type: 'example',
            number: '3.5.1',
            title: 'Die Roll Given Even',
            body: 'Roll a fair die. Given the result is even (A = {2,4,6}), E(X|A) = (2+4+6)/3 = 4. The conditional expectation is higher than the unconditional mean of 3.5.',
          },
        ],
      },
      {
        heading: 'Conditional Expectation Given Y = y',
        blocks: [
          {
            type: 'text',
            content:
              'When we condition on the value of another random variable Y, we get a function of y — the conditional mean of X given Y = y.',
          },
          {
            type: 'definition',
            number: '3.5.2',
            title: 'Conditional Expectation (Discrete Joint)',
            text: 'For jointly discrete X and Y:',
            formula: 'E(X \\mid Y=y) = \\sum_x x \\cdot \\frac{p_{X,Y}(x,y)}{p_Y(y)}',
          },
          {
            type: 'definition',
            number: '3.5.3',
            title: 'Conditional Expectation (Continuous Joint)',
            text: 'For jointly continuous X and Y:',
            formula: 'E(X \\mid Y=y) = \\int_{-\\infty}^{\\infty} x \\cdot f_{X|Y}(x \\mid y)\\,dx',
          },
          { type: 'viz', vizId: 'viz-conditional-mean' },
        ],
      },
      {
        heading: 'E(X|Y) as a Random Variable',
        blocks: [
          {
            type: 'text',
            content:
              'As y varies, E(X|Y=y) defines a function of y. Plugging in the random variable Y itself gives E(X|Y) — a function of the random variable Y, and hence a random variable itself.',
          },
          {
            type: 'theorem',
            number: '3.5.1',
            title: 'Law of Total Expectation',
            text: 'For any random variables X and Y:',
            formula: 'E\\bigl[E(X \\mid Y)\\bigr] = E(X)',
          },
          {
            type: 'text',
            content:
              'Intuitively: average the conditional means over all possible values of Y, weighted by the probability of each Y-value, and you recover the unconditional mean.',
          },
          { type: 'viz', vizId: 'viz-total-expectation' },
        ],
      },
      {
        heading: 'Variance Decomposition',
        blocks: [
          {
            type: 'theorem',
            number: '3.5.6',
            title: 'Law of Total Variance',
            text: 'For any random variables X and Y:',
            formula: '\\operatorname{Var}(X) = \\operatorname{Var}\\bigl(E(X\\mid Y)\\bigr) + E\\bigl[\\operatorname{Var}(X\\mid Y)\\bigr]',
          },
          {
            type: 'text',
            content:
              'The total variance of X splits into: (1) the variance of the conditional means — how much the mean of X varies across different Y-values, and (2) the average conditional variance — how spread out X is within each Y-slice. This decomposition is fundamental to ANOVA and hierarchical models.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 3.6  Inequalities
  // ─────────────────────────────────────────────
  {
    id: 'expectation-inequalities',
    title: 'Probability Inequalities',
    chapterRef: 'Chapter 3 · Section 3.6',
    description:
      'Markov, Chebyshev, Cauchy–Schwarz, and Jensen\'s inequalities bound tail probabilities and establish fundamental limits using only moments.',
    sections: [
      {
        heading: "Markov's Inequality",
        blocks: [
          {
            type: 'text',
            content:
              "Markov's inequality gives an upper bound on the probability of large values for any non-negative random variable, using only its mean.",
          },
          {
            type: 'theorem',
            number: '3.6.1',
            title: "Markov's Inequality",
            text: 'If X ≥ 0 almost surely and a > 0, then',
            formula: 'P(X \\geq a) \\leq \\frac{E(X)}{a}',
          },
          {
            type: 'example',
            number: '3.6.1',
            title: 'Markov Applied to Exponential(2)',
            body: 'Let X ~ Exp(2), so E(X) = 0.5. Markov gives P(X ≥ 3) ≤ 0.5/3 ≈ 0.167. The exact value is e^{−6} ≈ 0.0025 — Markov is quite loose, but it requires no information beyond the mean.',
          },
          { type: 'viz', vizId: 'viz-markov-bound' },
        ],
      },
      {
        heading: "Chebyshev's Inequality",
        blocks: [
          {
            type: 'text',
            content:
              "Chebyshev's inequality sharpens Markov by using variance to bound the probability of deviations from the mean.",
          },
          {
            type: 'theorem',
            number: '3.6.2',
            title: "Chebyshev's Inequality",
            text: 'For any random variable Y with mean μ and finite variance σ², and any a > 0:',
            formula: 'P(|Y - \\mu| \\geq a) \\leq \\frac{\\operatorname{Var}(Y)}{a^2}',
          },
          {
            type: 'example',
            number: '3.6.2',
            title: 'Chebyshev for the Normal',
            body: 'For N(5, 9), Chebyshev gives P(|Z−5| ≥ 30) ≤ 9/900 = 1/100. The bound is conservative — the exact probability from the normal tables is astronomically smaller.',
          },
          { type: 'viz', vizId: 'viz-chebyshev-bound' },
        ],
      },
      {
        heading: 'Cauchy–Schwarz Inequality',
        blocks: [
          {
            type: 'theorem',
            number: '3.6.3',
            title: 'Cauchy–Schwarz Inequality',
            text: 'For any random variables X and Y with finite variances:',
            formula: '|\\operatorname{Cov}(X,Y)| \\leq \\sqrt{\\operatorname{Var}(X) \\operatorname{Var}(Y)}',
          },
          {
            type: 'text',
            content:
              'Dividing both sides by SD(X)·SD(Y) immediately gives |Corr(X,Y)| ≤ 1 — the fundamental bound on the correlation coefficient. Equality holds if and only if Y = aX + b for some constants a and b (exact linear relationship).',
          },
        ],
      },
      {
        heading: "Jensen's Inequality",
        blocks: [
          {
            type: 'text',
            content:
              "Jensen's inequality relates the expected value of a convex function to the function of the expected value. It is the engine behind many deep results in information theory and statistics.",
          },
          {
            type: 'definition',
            number: '3.6.1',
            title: 'Convex Function',
            text: 'A function f : ℝ → ℝ is convex if for all x, y and λ ∈ [0,1]:',
            formula: 'f(\\lambda x + (1-\\lambda)y) \\leq \\lambda f(x) + (1-\\lambda)f(y)',
          },
          {
            type: 'theorem',
            number: '3.6.4',
            title: "Jensen's Inequality",
            text: 'If f is convex and X is a random variable with finite expectation:',
            formula: 'f(E[X]) \\leq E[f(X)]',
          },
          {
            type: 'example',
            number: '3.6.3',
            title: 'f(x) = x²',
            body: 'Since x² is convex, Jensen gives (E[X])² ≤ E[X²]. Rearranging: Var(X) = E[X²] − (E[X])² ≥ 0 — variance is always non-negative.',
          },
          {
            type: 'example',
            number: '3.6.4',
            title: 'Log is Concave → Reverse Jensen',
            body: 'Since log is concave (−log is convex), Jensen gives E[log X] ≤ log E[X]. The arithmetic mean is always at least the geometric mean — the AM-GM inequality as a consequence of Jensen.',
          },
          { type: 'viz', vizId: 'viz-jensen-inequality' },
        ],
      },
    ],
  },
];

export function getCh3ConceptById(id: string): ProbabilityConcept | undefined {
  return ch3Concepts.find((c) => c.id === id);
}
