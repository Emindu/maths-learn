import type { ContentBlock, ConceptSection, ProbabilityConcept } from './probabilityConceptsData';

export type { ContentBlock, ConceptSection, ProbabilityConcept };

export const ch2Concepts: ProbabilityConcept[] = [
  // ─────────────────────────────────────────────
  // 2.1  Random Variables
  // ─────────────────────────────────────────────
  {
    id: 'rv-intro',
    title: 'Random Variables',
    chapterRef: 'Chapter 2 · Section 2.1',
    description:
      'A random variable is a function that maps each outcome of an experiment to a real number, enabling numerical calculation with probabilities.',
    sections: [
      {
        heading: 'What Is a Random Variable?',
        blocks: [
          {
            type: 'text',
            content:
              'Random variables allow us to translate probabilistic events into numerical values, enabling calculation with probabilities. Rather than asking "what is the probability of event A?", we ask "what is the probability that X takes a given value?". This shift from events to numbers makes many computations far more tractable.',
          },
          {
            type: 'definition',
            number: '2.1.1',
            title: 'Random Variable',
            text: 'A random variable is a function X : S → ℝ that assigns a real number to each outcome in the sample space S.',
          },
          {
            type: 'example',
            number: '2.1.1',
            title: 'Number Shown on a Die',
            body: 'Roll a fair die with S = {1, 2, 3, 4, 5, 6}. The function X(s) = s is a random variable taking values in {1, …, 6} with P(X = k) = 1/6 for each k.',
          },
        ],
      },
      {
        heading: 'Indicator Functions',
        blocks: [
          {
            type: 'text',
            content:
              'One of the most useful random variables is the indicator (or characteristic) function of an event A. It encodes whether or not the event occurred as a 0/1 number.',
          },
          {
            type: 'definition',
            number: '2.1.2',
            title: 'Indicator Function',
            text: 'For an event A ⊆ S, the indicator random variable of A is:',
            formula: 'I_A(s) = \\begin{cases} 1 & s \\in A \\\\ 0 & s \\notin A \\end{cases}',
          },
          {
            type: 'example',
            number: '2.1.2',
            title: 'Even Die Roll',
            body: 'Roll a fair die. Let A = {2, 4, 6}. Then I_A equals 1 if the result is even and 0 otherwise. P(I_A = 1) = 3/6 = 1/2.',
          },
        ],
      },
      {
        heading: 'Arithmetic Operations',
        blocks: [
          {
            type: 'text',
            content:
              'Random variables can be combined with standard arithmetic. If X and Y are random variables on the same sample space S, and c ∈ ℝ, then each of the following is also a random variable: X + Y, cX, XY, X/Y (when Y ≠ 0), |X|, X^n, and max(X, Y). This closure under arithmetic is what makes the theory so flexible.',
          },
          {
            type: 'example',
            number: '2.1.3',
            title: 'Sum of Two Dice',
            body: 'Roll two fair dice with results X and Y. The sum Z = X + Y is a random variable taking values 2 through 12. For instance P(Z = 7) = 6/36 = 1/6, the most probable value.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2.2  Distributions of Random Variables
  // ─────────────────────────────────────────────
  {
    id: 'rv-distributions',
    title: 'Distributions of Random Variables',
    chapterRef: 'Chapter 2 · Section 2.2',
    description:
      'The distribution of a random variable encodes all probabilities P(X ∈ B) for every subset B of the real line.',
    sections: [
      {
        heading: 'What Is a Distribution?',
        blocks: [
          {
            type: 'text',
            content:
              'The distribution encodes all probabilistic information about a random variable. Two very different random experiments can produce random variables with the same distribution. Knowing the distribution is equivalent to knowing everything there is to know about the probabilistic behaviour of X.',
          },
          {
            type: 'definition',
            number: '2.2.1',
            title: 'Distribution of a Random Variable',
            text: 'The distribution of a random variable X is the collection of all probabilities P(X ∈ B) for subsets B ⊆ ℝ.',
          },
          {
            type: 'example',
            number: '2.2.1',
            title: 'Fair Coin as a Random Variable',
            body: 'Encode H as 1 and T as 0. Then P(X = 1) = 1/2 and P(X = 0) = 1/2. The distribution is fully described by these two probabilities. Another experiment — say, choosing uniformly from {0, 1} — gives the same distribution.',
          },
        ],
      },
      {
        heading: 'Equal Distributions',
        blocks: [
          {
            type: 'text',
            content:
              'Two random variables can be defined on entirely different sample spaces and yet share the same distribution. We write X ~ Y (or X =^d Y) to indicate distributional equality.',
          },
          {
            type: 'definition',
            number: '2.2.2',
            title: 'Equal in Distribution',
            text: 'Two random variables X and Y (possibly on different probability spaces) have the same distribution if P(X ∈ B) = P(Y ∈ B) for every subset B ⊆ ℝ. We write X =^d Y.',
          },
          {
            type: 'formula',
            latex: 'X =^{d} Y \\iff P(X \\in B) = P(Y \\in B) \\text{ for all } B \\subseteq \\mathbb{R}',
          },
          {
            type: 'example',
            number: '2.2.2',
            title: 'Two Coins vs. One Urn',
            body: 'Flipping a fair coin twice and recording the number of heads, versus drawing one ball from an urn containing {0, 1, 2} with probabilities {1/4, 1/2, 1/4} — both experiments yield the same distribution on {0, 1, 2}.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2.3  Discrete Distributions
  // ─────────────────────────────────────────────
  {
    id: 'discrete-distributions',
    title: 'Discrete Distributions',
    chapterRef: 'Chapter 2 · Section 2.3',
    description:
      'Named discrete distributions — Bernoulli, Binomial, Geometric, Poisson, and Hypergeometric — each arising from a natural counting or waiting-time experiment.',
    sections: [
      {
        heading: 'Bernoulli Distribution',
        blocks: [
          {
            type: 'text',
            content:
              'The Bernoulli distribution models a single trial that results in success (1) or failure (0). The parameter θ ∈ (0, 1) is the probability of success.',
          },
          {
            type: 'definition',
            number: '2.3.1',
            title: 'Bernoulli Distribution',
            text: 'X ~ Bernoulli(θ) if X ∈ {0, 1} with:',
            formula: 'p_X(x) = \\theta^x (1-\\theta)^{1-x}, \\quad x \\in \\{0,1\\}',
          },
          {
            type: 'example',
            number: '2.3.1',
            title: 'Biased Coin',
            body: 'A biased coin lands heads with probability 0.7. X = 1 for heads, X = 0 for tails. Then X ~ Bernoulli(0.7), P(X = 1) = 0.7, P(X = 0) = 0.3.',
          },
        ],
      },
      {
        heading: 'Binomial Distribution',
        blocks: [
          {
            type: 'text',
            content:
              'The Binomial distribution counts the total number of successes in n independent Bernoulli(θ) trials. It is the most fundamental discrete distribution in statistics.',
          },
          {
            type: 'definition',
            number: '2.3.2',
            title: 'Binomial Distribution',
            text: 'X ~ Binomial(n, θ) if X counts successes in n independent Bernoulli(θ) trials:',
            formula: 'P(X = x) = \\binom{n}{x}\\theta^x(1-\\theta)^{n-x}, \\quad x = 0, 1, \\ldots, n',
          },
          {
            type: 'example',
            number: '2.3.2',
            title: 'Quality Control',
            body: 'A factory produces items with a 5% defect rate. In a batch of 20, the probability of exactly 2 defects is C(20,2)(0.05)²(0.95)^18 ≈ 0.189.',
          },
        ],
      },
      {
        heading: 'Geometric Distribution',
        blocks: [
          {
            type: 'text',
            content:
              'The Geometric distribution models the number of failures before the first success in a sequence of independent Bernoulli(θ) trials.',
          },
          {
            type: 'definition',
            number: '2.3.3',
            title: 'Geometric Distribution',
            text: 'X ~ Geometric(θ) if X counts failures before the first success:',
            formula: 'p_X(k) = (1-\\theta)^k \\theta, \\quad k = 0, 1, 2, \\ldots',
          },
          {
            type: 'theorem',
            number: '2.3.1',
            title: 'Negative Binomial Distribution',
            text: 'The number of failures before the r-th success (a generalisation of Geometric) follows the Negative Binomial(r, θ) distribution:',
            formula: 'P(Y = k) = \\binom{k+r-1}{k}(1-\\theta)^k \\theta^r, \\quad k = 0,1,2,\\ldots',
          },
          {
            type: 'example',
            number: '2.3.3',
            title: 'Waiting for a Six',
            body: 'Roll a fair die repeatedly until a 6 appears. X = number of non-six rolls before the first six is Geometric(1/6). P(X = 0) = 1/6, P(X = 3) = (5/6)³(1/6) ≈ 0.096.',
          },
        ],
      },
      {
        heading: 'Poisson Distribution',
        blocks: [
          {
            type: 'text',
            content:
              'The Poisson distribution arises as the limit of Binomial(n, θ) as n → ∞ and θ → 0 with nθ → λ. It models the number of rare events in a large number of trials, such as arrivals in a time window.',
          },
          {
            type: 'definition',
            number: '2.3.4',
            title: 'Poisson Distribution',
            text: 'Y ~ Poisson(λ) if Y takes values in {0, 1, 2, …} with:',
            formula: 'p_Y(y) = \\frac{\\lambda^y e^{-\\lambda}}{y!}, \\quad y = 0, 1, 2, \\ldots',
          },
          {
            type: 'example',
            number: '2.3.4',
            title: 'Phone Calls',
            body: 'A call centre receives on average λ = 3 calls per minute. The probability of exactly 5 calls in one minute is (3⁵ e^{-3})/5! = 243 e^{-3}/120 ≈ 0.101.',
          },
        ],
      },
      {
        heading: 'Hypergeometric Distribution',
        blocks: [
          {
            type: 'text',
            content:
              'The Hypergeometric distribution models drawing n items without replacement from a population of N items, M of which are successes. It differs from the Binomial in that draws are not independent.',
          },
          {
            type: 'definition',
            number: '2.3.5',
            title: 'Hypergeometric Distribution',
            text: 'Drawing n items without replacement from a population of N containing M successes, the probability of exactly k successes is:',
            formula: 'P(X = k) = \\frac{\\dbinom{M}{k}\\dbinom{N-M}{n-k}}{\\dbinom{N}{n}}',
          },
          {
            type: 'example',
            number: '2.3.5',
            title: 'Card Drawing',
            body: 'From a standard 52-card deck (13 hearts), draw 5 cards without replacement. The probability of exactly 2 hearts is C(13,2)·C(39,3)/C(52,5) ≈ 0.274.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2.4  Continuous Distributions
  // ─────────────────────────────────────────────
  {
    id: 'continuous-distributions',
    title: 'Continuous Distributions',
    chapterRef: 'Chapter 2 · Section 2.4',
    description:
      'Continuous distributions assign zero probability to any single point; probabilities are computed by integrating a probability density function over an interval.',
    sections: [
      {
        heading: 'What Makes a Distribution Continuous?',
        blocks: [
          {
            type: 'text',
            content:
              'A continuous distribution is one where P(X = x) = 0 for every individual value x. Instead of probabilities at points, we use a probability density function (pdf) f_X such that P(a ≤ X ≤ b) = ∫_a^b f_X(x) dx. The density f_X must be non-negative and integrate to 1 over all of ℝ.',
          },
          {
            type: 'formula',
            latex: 'P(a \\le X \\le b) = \\int_a^b f_X(x)\\,dx, \\qquad \\int_{-\\infty}^{\\infty} f_X(x)\\,dx = 1',
          },
        ],
      },
      {
        heading: 'Uniform Distribution',
        blocks: [
          {
            type: 'definition',
            number: '2.4.1',
            title: 'Uniform Distribution',
            text: 'X ~ Uniform[L, R] if X is equally likely to fall anywhere in [L, R]:',
            formula: 'f_X(x) = \\frac{1}{R - L}, \\quad L \\le x \\le R',
          },
          {
            type: 'example',
            number: '2.4.1',
            title: 'Bus Arrival',
            body: 'A bus arrives uniformly at random in [0, 60] minutes. The probability of waiting more than 40 minutes is (60 − 40)/60 = 1/3.',
          },
        ],
      },
      {
        heading: 'Exponential Distribution',
        blocks: [
          {
            type: 'text',
            content:
              'The Exponential distribution models the waiting time until the first event in a Poisson process with rate λ. It has the memoryless property: P(X > s + t | X > s) = P(X > t).',
          },
          {
            type: 'definition',
            number: '2.4.2',
            title: 'Exponential Distribution',
            text: 'X ~ Exponential(λ) if:',
            formula: 'f_X(x) = \\lambda e^{-\\lambda x}, \\quad x \\ge 0',
          },
          {
            type: 'example',
            number: '2.4.2',
            title: 'Light Bulb Lifetime',
            body: 'A light bulb has an exponential lifetime with rate λ = 0.01 failures per hour. The probability it lasts more than 200 hours is e^{-0.01·200} = e^{-2} ≈ 0.135.',
          },
        ],
      },
      {
        heading: 'Gamma Distribution',
        blocks: [
          {
            type: 'text',
            content:
              'The Gamma distribution generalises the Exponential: while Exponential(λ) is the waiting time to the first Poisson event, Gamma(α, λ) is the waiting time to the α-th event. The shape parameter α > 0 and rate parameter λ > 0.',
          },
          {
            type: 'definition',
            number: '2.4.3',
            title: 'Gamma Distribution',
            text: 'X ~ Gamma(α, λ) has density:',
            formula: 'f_X(x) = \\frac{\\lambda^\\alpha x^{\\alpha-1} e^{-\\lambda x}}{\\Gamma(\\alpha)}, \\quad x > 0',
          },
          {
            type: 'formula',
            label: 'Gamma function',
            latex: '\\Gamma(\\alpha) = \\int_0^{\\infty} t^{\\alpha-1} e^{-t}\\,dt',
          },
          {
            type: 'example',
            number: '2.4.3',
            title: 'Waiting for Three Events',
            body: 'If events arrive at rate λ = 2 per minute, the waiting time until the 3rd event is Gamma(3, 2). The mean waiting time is α/λ = 3/2 = 1.5 minutes.',
          },
        ],
      },
      {
        heading: 'Normal Distribution',
        blocks: [
          {
            type: 'text',
            content:
              'The Normal (Gaussian) distribution N(μ, σ²) is the most important distribution in statistics. Its bell-shaped density is symmetric about the mean μ, and σ controls the spread. The Central Limit Theorem ensures that sums of many independent random variables converge to it.',
          },
          {
            type: 'definition',
            number: '2.4.4',
            title: 'Normal Distribution',
            text: 'X ~ N(μ, σ²) has density:',
            formula: 'f_X(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} \\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right), \\quad x \\in \\mathbb{R}',
          },
          {
            type: 'example',
            number: '2.4.4',
            title: 'Heights',
            body: 'Adult male heights are approximately N(μ = 178 cm, σ² = 49 cm²). The probability of a height between 171 and 185 cm corresponds to the interval μ ± σ, which contains about 68% of the distribution.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2.5  Cumulative Distribution Functions
  // ─────────────────────────────────────────────
  {
    id: 'cumulative-distribution',
    title: 'Cumulative Distribution Functions',
    chapterRef: 'Chapter 2 · Section 2.5',
    description:
      'The CDF F_X(x) = P(X ≤ x) provides a unified description of any distribution, discrete or continuous, through five fundamental properties.',
    sections: [
      {
        heading: 'Definition of the CDF',
        blocks: [
          {
            type: 'text',
            content:
              'The cumulative distribution function (CDF) accumulates probability from −∞ up to the point x. It is defined for every real number x and for every type of random variable, making it a universal tool.',
          },
          {
            type: 'definition',
            number: '2.5.1',
            title: 'Cumulative Distribution Function',
            text: 'The CDF of a random variable X is the function F_X : ℝ → [0, 1] defined by:',
            formula: 'F_X(x) = P(X \\le x), \\quad x \\in \\mathbb{R}',
          },
        ],
      },
      {
        heading: 'Properties of CDFs',
        blocks: [
          {
            type: 'theorem',
            number: '2.5.2',
            title: 'Properties of Any CDF',
            text: 'Every CDF F satisfies: (i) 0 ≤ F(x) ≤ 1 for all x; (ii) F is non-decreasing; (iii) lim_{x→+∞} F(x) = 1; (iv) lim_{x→−∞} F(x) = 0; (v) F is right-continuous, i.e. lim_{t↓x} F(t) = F(x).',
          },
          {
            type: 'formula',
            latex: '\\lim_{x \\to -\\infty} F_X(x) = 0, \\qquad \\lim_{x \\to +\\infty} F_X(x) = 1',
          },
          {
            type: 'example',
            number: '2.5.1',
            title: 'Using the CDF to Find Interval Probabilities',
            body: 'For any random variable, P(a < X ≤ b) = F_X(b) − F_X(a). For example, if X ~ N(0,1) then P(−1 < X ≤ 1) = Φ(1) − Φ(−1) ≈ 0.8413 − 0.1587 = 0.6827.',
          },
        ],
      },
      {
        heading: 'CDF for Discrete and Continuous Distributions',
        blocks: [
          {
            type: 'text',
            content:
              'For a discrete random variable, the CDF is a right-continuous step function that jumps at each point of positive probability. For a continuous random variable with density f_X, the CDF is absolutely continuous and differentiable almost everywhere.',
          },
          {
            type: 'formula',
            label: 'Continuous CDF',
            latex: 'F_X(x) = \\int_{-\\infty}^{x} f_X(t)\\,dt, \\qquad f_X(x) = F_X\'(x)',
          },
          {
            type: 'example',
            number: '2.5.2',
            title: 'Exponential CDF',
            body: 'For X ~ Exponential(λ), integrating the density gives F_X(x) = 1 − e^{−λx} for x ≥ 0. So P(X > t) = e^{−λt}, confirming the memoryless property.',
            formula: 'F_X(x) = 1 - e^{-\\lambda x}, \\quad x \\ge 0',
          },
        ],
      },
      {
        heading: 'The Standard Normal CDF',
        blocks: [
          {
            type: 'text',
            content:
              'The standard normal CDF Φ(z) = P(Z ≤ z) where Z ~ N(0, 1) has no closed-form expression. Its values are computed numerically using tables or software (e.g. scipy.stats.norm.cdf). Any normal probability can be reduced to Φ by standardising.',
          },
          {
            type: 'formula',
            latex: '\\Phi(z) = \\int_{-\\infty}^{z} \\frac{1}{\\sqrt{2\\pi}} e^{-t^2/2}\\,dt',
          },
          {
            type: 'example',
            number: '2.5.3',
            title: 'Standardising a Normal',
            body: 'If X ~ N(μ, σ²), then P(X ≤ x) = Φ((x − μ)/σ). For X ~ N(5, 4) and x = 7: P(X ≤ 7) = Φ((7−5)/2) = Φ(1) ≈ 0.841.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2.6  One-Dimensional Change of Variable
  // ─────────────────────────────────────────────
  {
    id: 'change-of-variable',
    title: 'One-Dimensional Change of Variable',
    chapterRef: 'Chapter 2 · Section 2.6',
    description:
      'When Y = h(X) for a monotone differentiable function h, the density of Y can be expressed directly in terms of the density of X and the derivative of h.',
    sections: [
      {
        heading: 'The Change of Variable Problem',
        blocks: [
          {
            type: 'text',
            content:
              'If X has a known density f_X and Y = h(X) where h is a known function, what is the distribution of Y? This arises constantly in probability: rescaling, transforming, or composing random variables all require a change of variable. The key tool is the inverse function theorem combined with the substitution rule for integrals.',
          },
          {
            type: 'example',
            number: '2.6.1',
            title: 'Squaring a Uniform',
            body: 'Let X ~ Uniform[0, 1] and Y = X². To find f_Y, we use the CDF method: F_Y(y) = P(Y ≤ y) = P(X² ≤ y) = P(X ≤ √y) = √y for y ∈ [0, 1]. Differentiating gives f_Y(y) = 1/(2√y).',
          },
        ],
      },
      {
        heading: 'Strictly Increasing Transformations',
        blocks: [
          {
            type: 'theorem',
            number: '2.6.2',
            title: 'Change of Variable — Increasing Case',
            text: 'Let X have density f_X and let h be differentiable and strictly increasing. Then Y = h(X) has density:',
            formula: 'f_Y(y) = f_X\\!\\left(h^{-1}(y)\\right) \\cdot \\frac{1}{h\'\\!\\left(h^{-1}(y)\\right)}',
          },
          {
            type: 'example',
            number: '2.6.2',
            title: 'Exponential Rescaling',
            body: 'Let X ~ Exponential(1) and Y = X/λ. Then h(x) = x/λ, h⁻¹(y) = λy, h\'(x) = 1/λ. So f_Y(y) = f_X(λy) · λ = e^{−λy} · λ = λe^{−λy}, confirming Y ~ Exponential(λ).',
          },
        ],
      },
      {
        heading: 'Strictly Decreasing Transformations',
        blocks: [
          {
            type: 'theorem',
            number: '2.6.3',
            title: 'Change of Variable — Decreasing Case',
            text: 'When h is differentiable and strictly decreasing, the same formula holds with the absolute value ensuring a positive density:',
            formula: 'f_Y(y) = f_X\\!\\left(h^{-1}(y)\\right) \\cdot \\frac{1}{|h\'\\!\\left(h^{-1}(y)\\right)|}',
          },
          {
            type: 'corollary',
            number: '2.6.1',
            title: 'General Monotone Formula',
            text: 'For any strictly monotone differentiable h, the change-of-variable density is f_Y(y) = f_X(h⁻¹(y)) / |h\'(h⁻¹(y))|. The absolute value handles both increasing and decreasing cases uniformly.',
          },
          {
            type: 'example',
            number: '2.6.3',
            title: 'Log-Normal from Normal',
            body: 'Let Z ~ N(0, 1) and Y = e^Z. Then h(z) = e^z, h⁻¹(y) = log(y), h\'(z) = e^z. So f_Y(y) = φ(log y)/y for y > 0, which is the Log-Normal(0,1) density.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2.7  Joint Distributions
  // ─────────────────────────────────────────────
  {
    id: 'joint-distributions',
    title: 'Joint Distributions',
    chapterRef: 'Chapter 2 · Section 2.7',
    description:
      'Joint distributions describe the simultaneous probabilistic behaviour of two or more random variables via joint PMFs, joint densities, and marginal distributions.',
    sections: [
      {
        heading: 'Joint PMFs',
        blocks: [
          {
            type: 'text',
            content:
              'For two discrete random variables X and Y, the joint probability mass function specifies the probability of each pair of values simultaneously.',
          },
          {
            type: 'definition',
            number: '2.7.1',
            title: 'Joint PMF',
            text: 'The joint PMF of discrete random variables X and Y is:',
            formula: 'p_{X,Y}(x,y) = P(X = x,\\; Y = y)',
          },
          {
            type: 'example',
            number: '2.7.1',
            title: 'Two Dice',
            body: 'Roll two fair dice. The joint PMF is p(x, y) = 1/36 for each (x, y) ∈ {1,…,6}². The event X + Y = 7 corresponds to the 6 pairs (1,6),(2,5),(3,4),(4,3),(5,2),(6,1), so P(X + Y = 7) = 6/36 = 1/6.',
          },
        ],
      },
      {
        heading: 'Marginal Distributions',
        blocks: [
          {
            type: 'text',
            content:
              'The marginal distribution of X is obtained from the joint distribution by summing (discrete) or integrating (continuous) over all values of Y. This "collapses" the joint information into the individual behaviour of X.',
          },
          {
            type: 'formula',
            label: 'Discrete marginal',
            latex: 'p_X(x) = \\sum_{y} p_{X,Y}(x,y)',
          },
          {
            type: 'formula',
            label: 'Continuous marginal',
            latex: 'f_X(x) = \\int_{-\\infty}^{\\infty} f_{X,Y}(x,y)\\,dy',
          },
        ],
      },
      {
        heading: 'Joint Densities',
        blocks: [
          {
            type: 'definition',
            number: '2.7.2',
            title: 'Joint Density',
            text: 'Random variables X and Y have a joint density f_{X,Y} if for every region A ⊆ ℝ²:',
            formula: 'P((X,Y) \\in A) = \\iint_A f_{X,Y}(x,y)\\,dx\\,dy',
          },
          {
            type: 'example',
            number: '2.7.2',
            title: 'Uniform on a Triangle',
            body: 'Let (X, Y) be uniform over the triangle {(x, y) : x ≥ 0, y ≥ 0, x + y ≤ 1}. The area is 1/2, so f(x, y) = 2 on that region and 0 elsewhere. The marginal density of X is f_X(x) = ∫_0^{1−x} 2 dy = 2(1 − x) for x ∈ [0, 1].',
          },
        ],
      },
      {
        heading: 'The Bivariate Normal',
        blocks: [
          {
            type: 'text',
            content:
              'The Bivariate Normal distribution extends the univariate Normal to two dimensions. It is parameterised by means μ₁, μ₂, standard deviations σ₁, σ₂, and correlation ρ ∈ (−1, 1). When ρ = 0, X and Y are independent.',
          },
          {
            type: 'definition',
            number: '2.7.3',
            title: 'Bivariate Normal Density',
            text: '(X, Y) ~ BivariateNormal(μ₁, μ₂, σ₁, σ₂, ρ) has joint density:',
            formula:
              'f_{X,Y}(x,y) = \\frac{1}{2\\pi\\sigma_1\\sigma_2\\sqrt{1-\\rho^2}} \\exp\\!\\left(-\\frac{1}{2(1-\\rho^2)}\\left[\\frac{(x-\\mu_1)^2}{\\sigma_1^2} - \\frac{2\\rho(x-\\mu_1)(y-\\mu_2)}{\\sigma_1\\sigma_2} + \\frac{(y-\\mu_2)^2}{\\sigma_2^2}\\right]\\right)',
          },
          {
            type: 'example',
            number: '2.7.3',
            title: 'Height and Weight',
            body: 'Human height and weight are approximately Bivariate Normal with positive correlation ρ ≈ 0.6. The marginal distribution of height is Normal, and the marginal distribution of weight is also Normal, but knowing someone\'s height shifts the conditional distribution of their weight.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2.8  Conditioning and Independence
  // ─────────────────────────────────────────────
  {
    id: 'conditioning-independence',
    title: 'Conditioning and Independence',
    chapterRef: 'Chapter 2 · Section 2.8',
    description:
      'Conditional distributions describe how one random variable behaves given the value of another; independence means that conditioning has no effect.',
    sections: [
      {
        heading: 'Conditional Distributions (Discrete)',
        blocks: [
          {
            type: 'text',
            content:
              'Given that X = x, the conditional PMF of Y tells us the probability distribution of Y among all outcomes where X takes that specific value.',
          },
          {
            type: 'definition',
            number: '2.8.2',
            title: 'Conditional PMF',
            text: 'For discrete X and Y with p_X(x) > 0, the conditional PMF of Y given X = x is:',
            formula: 'p_{Y|X}(y \\mid x) = \\frac{p_{X,Y}(x,y)}{p_X(x)}',
          },
          {
            type: 'example',
            number: '2.8.1',
            title: 'Conditional Distribution from a Table',
            body: 'Suppose P(X=0, Y=0)=0.1, P(X=0, Y=1)=0.3, P(X=1, Y=0)=0.2, P(X=1, Y=1)=0.4. Then p_X(0)=0.4, and the conditional PMF of Y given X=0 is P(Y=0|X=0)=0.1/0.4=0.25 and P(Y=1|X=0)=0.3/0.4=0.75.',
          },
        ],
      },
      {
        heading: 'Conditional Density (Continuous)',
        blocks: [
          {
            type: 'definition',
            number: '2.8.3',
            title: 'Conditional Density',
            text: 'For jointly continuous X and Y with f_X(x) > 0, the conditional density of Y given X = x is:',
            formula: 'f_{Y|X}(y \\mid x) = \\frac{f_{X,Y}(x,y)}{f_X(x)}',
          },
          {
            type: 'example',
            number: '2.8.2',
            title: 'Conditional Normal',
            body: 'In the Bivariate Normal with parameters μ₁, μ₂, σ₁, σ₂, ρ, the conditional distribution of Y given X = x is Normal with mean μ₂ + ρ(σ₂/σ₁)(x − μ₁) and variance σ₂²(1 − ρ²). The conditioning "pulls" the mean toward the observed x.',
          },
        ],
      },
      {
        heading: 'Independence of Random Variables',
        blocks: [
          {
            type: 'theorem',
            number: '2.8.3',
            title: 'Independence Criterion',
            text: 'Random variables X and Y are independent if and only if their joint distribution factors into the product of marginals:',
            formula:
              'f_{X,Y}(x,y) = f_X(x)\\,f_Y(y) \\quad\\text{(continuous)}, \\quad p_{X,Y}(x,y) = p_X(x)\\,p_Y(y) \\quad\\text{(discrete)}',
          },
          {
            type: 'text',
            content:
              'Independence implies that knowledge of X provides no information about Y, and vice versa. It is a much stronger condition than uncorrelatedness: uncorrelated random variables need not be independent unless they are jointly Normal.',
          },
          {
            type: 'example',
            number: '2.8.3',
            title: 'Checking Independence',
            body: 'For the uniform distribution on the unit square [0,1]², f(x,y)=1. Since f_X(x)=1 and f_Y(y)=1, we have f(x,y)=f_X(x)f_Y(y), confirming X and Y are independent.',
          },
        ],
      },
      {
        heading: 'i.i.d. Sequences',
        blocks: [
          {
            type: 'definition',
            number: '2.8.6',
            title: 'Independent and Identically Distributed (i.i.d.)',
            text: 'Random variables X₁, X₂, …, Xₙ are independent and identically distributed (i.i.d.) if they are mutually independent and each has the same marginal distribution.',
          },
          {
            type: 'text',
            content:
              'The i.i.d. assumption is the backbone of classical statistics: it models n independent repetitions of the same experiment. The Law of Large Numbers and the Central Limit Theorem both rely on it. When we observe a random sample, we typically assume the observations are i.i.d.',
          },
          {
            type: 'example',
            number: '2.8.4',
            title: 'i.i.d. Bernoulli Trials',
            body: 'Flipping a fair coin 100 times: X₁, …, X₁₀₀ i.i.d. Bernoulli(0.5). The joint PMF is the product p(x₁)·…·p(x₁₀₀) = (1/2)^100 for any sequence (x₁,…,x₁₀₀) ∈ {0,1}^100.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2.9  Multidimensional Change of Variable
  // ─────────────────────────────────────────────
  {
    id: 'multidim-cov',
    title: 'Multidimensional Change of Variable',
    chapterRef: 'Chapter 2 · Section 2.9',
    description:
      'The Jacobian determinant extends the one-dimensional change-of-variable formula to transformations of random vectors, and yields the convolution formula for sums.',
    sections: [
      {
        heading: 'The Setup',
        blocks: [
          {
            type: 'text',
            content:
              'Given (X, Y) with known joint density f_{X,Y}, and a bijective differentiable transformation (Z, W) = h(X, Y) = (h₁(X, Y), h₂(X, Y)), we wish to find the joint density f_{Z,W}. The key quantity is the Jacobian determinant, which measures the local area distortion of the transformation.',
          },
          {
            type: 'example',
            number: '2.9.1',
            title: 'Sum and Difference',
            body: 'Let Z = X + Y and W = X − Y. We wish to find the joint density of (Z, W) given the joint density of (X, Y). The inverse map is X = (Z + W)/2, Y = (Z − W)/2.',
          },
        ],
      },
      {
        heading: 'Jacobian Determinant',
        blocks: [
          {
            type: 'definition',
            number: '2.9.1',
            title: 'Jacobian',
            text: 'For the transformation (z, w) = (h₁(x,y), h₂(x,y)), the Jacobian with respect to the original variables is the determinant:',
            formula:
              'J(x,y) = \\frac{\\partial h_1}{\\partial x}\\frac{\\partial h_2}{\\partial y} - \\frac{\\partial h_2}{\\partial x}\\frac{\\partial h_1}{\\partial y}',
          },
          {
            type: 'theorem',
            number: '2.9.2',
            title: 'Multivariate Change of Variable',
            text: 'If h is a bijection with non-zero Jacobian, and (x₀, y₀) = h⁻¹(z, w), then:',
            formula: 'f_{Z,W}(z,w) = \\frac{f_{X,Y}\\!\\left(h^{-1}(z,w)\\right)}{|J(h^{-1}(z,w))|}',
          },
          {
            type: 'example',
            number: '2.9.2',
            title: 'Jacobian of Sum and Difference',
            body: 'For Z = X + Y, W = X − Y: ∂h₁/∂x = 1, ∂h₁/∂y = 1, ∂h₂/∂x = 1, ∂h₂/∂y = −1. So J = (1)(−1) − (1)(1) = −2, and |J| = 2. Thus f_{Z,W}(z,w) = f_{X,Y}((z+w)/2, (z−w)/2) / 2.',
          },
        ],
      },
      {
        heading: 'The Convolution Formula',
        blocks: [
          {
            type: 'text',
            content:
              'A particularly important special case is the distribution of the sum Z = X + Y when X and Y are independent. The result is the convolution of the individual densities.',
          },
          {
            type: 'theorem',
            number: '2.9.3',
            title: 'Convolution Theorem',
            text: 'If X and Y are independent continuous random variables and Z = X + Y, then:',
            formula: 'f_Z(z) = \\int_{-\\infty}^{\\infty} f_X(z - w)\\,f_Y(w)\\,dw',
          },
          {
            type: 'example',
            number: '2.9.3',
            title: 'Sum of Two Exponentials',
            body: 'If X, Y ~ Exponential(λ) independently, then Z = X + Y has density f_Z(z) = ∫_0^z λe^{−λ(z−w)} λe^{−λw} dw = λ²z e^{−λz} for z ≥ 0. This is the Gamma(2, λ) density.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 2.10  Simulating Probability Distributions
  // ─────────────────────────────────────────────
  {
    id: 'simulating-distributions',
    title: 'Simulating Probability Distributions',
    chapterRef: 'Chapter 2 · Section 2.10',
    description:
      'Any distribution can be simulated using Uniform[0,1] pseudo-random numbers via the inverse CDF method; special algorithms like Box-Muller handle the Normal.',
    sections: [
      {
        heading: 'Why Simulate?',
        blocks: [
          {
            type: 'text',
            content:
              'Simulation is a practical tool for exploring distributions, verifying analytical results, and approximating probabilities that are difficult to compute in closed form. Modern computers can generate large samples from virtually any distribution in milliseconds. The foundation of all simulation is the Uniform[0,1] generator, available in every programming language.',
          },
          {
            type: 'example',
            number: '2.10.0',
            title: 'Monte Carlo Integration',
            body: 'To estimate ∫_0^1 f(x) dx, generate U₁, …, Uₙ ~ Uniform[0,1] independently and compute the sample mean (f(U₁) + … + f(Uₙ))/n. By the Law of Large Numbers this converges to the integral as n → ∞.',
          },
        ],
      },
      {
        heading: 'Simulating Discrete Distributions',
        blocks: [
          {
            type: 'text',
            content:
              'To simulate a discrete distribution with finite support {x₁, …, xₖ} and probabilities {p₁, …, pₖ}, generate U ~ Uniform[0,1] and return xᵢ where U falls in the cumulative probability interval [p₁ + … + p_{i−1}, p₁ + … + pᵢ). This is a direct application of the inverse CDF method to discrete distributions.',
          },
          {
            type: 'example',
            number: '2.10.1',
            title: 'Simulating a Die Roll',
            body: 'Generate U ~ Uniform[0,1]. Return k if (k−1)/6 ≤ U < k/6, for k = 1,…,6. Each value is returned with probability 1/6, so this correctly simulates a fair die.',
          },
        ],
      },
      {
        heading: 'Simulating Continuous Distributions — Inversion Method',
        blocks: [
          {
            type: 'text',
            content:
              'The inversion method uses the quantile function (inverse CDF) to transform a Uniform[0,1] variable into any target distribution. It is the most general and widely used simulation technique.',
          },
          {
            type: 'definition',
            number: '2.10.1',
            title: 'Inverse CDF (Quantile Function)',
            text: 'The inverse CDF (or quantile function) of a distribution with CDF F is:',
            formula: 'F^{-1}(t) = \\min\\{x : F(x) \\ge t\\}, \\quad 0 < t < 1',
          },
          {
            type: 'theorem',
            number: '2.10.2',
            title: 'Inversion Theorem',
            text: 'If U ~ Uniform[0,1] and Y = F⁻¹(U), then Y has CDF F.',
          },
          {
            type: 'example',
            number: '2.10.2',
            title: 'Simulating the Exponential',
            body: 'For Exponential(λ), the CDF is F(x) = 1 − e^{−λx}. Solving F(y) = u gives y = −log(1−u)/λ. Since 1 − U is also Uniform[0,1], we can use Y = −log(U)/λ, which has distribution Exponential(λ).',
            formula: 'Y = -\\frac{\\log U}{\\lambda} \\sim \\text{Exponential}(\\lambda)',
          },
        ],
      },
      {
        heading: 'Box-Muller for Normal',
        blocks: [
          {
            type: 'text',
            content:
              'The Normal distribution has no closed-form inverse CDF, so the inversion method requires numerical approximation. The Box-Muller transform provides an elegant exact method using two independent Uniform[0,1] variables to generate two independent standard Normal variables simultaneously.',
          },
          {
            type: 'theorem',
            number: '2.10.3',
            title: 'Box-Muller Transform',
            text: 'If U₁, U₂ ~ i.i.d. Uniform[0,1], define:',
            formula:
              'X = \\sqrt{2\\log(1/U_1)}\\cos(2\\pi U_2), \\quad Y = \\sqrt{2\\log(1/U_1)}\\sin(2\\pi U_2)',
          },
          {
            type: 'corollary',
            number: '2.10.1',
            title: 'Result of Box-Muller',
            text: 'The variables X and Y defined by the Box-Muller transform are independent and each has distribution N(0,1).',
          },
          {
            type: 'example',
            number: '2.10.3',
            title: 'Box-Muller in Practice',
            body: 'Generate U₁ = 0.23, U₂ = 0.71. Then R = √(2 log(1/0.23)) = √(2 · 1.470) ≈ 1.715. X = 1.715 · cos(2π · 0.71) ≈ 1.715 · (−0.891) ≈ −1.528. Y = 1.715 · sin(2π · 0.71) ≈ 1.715 · 0.454 ≈ 0.779. Both X and Y are approximate draws from N(0,1).',
          },
        ],
      },
    ],
  },
];

export function getCh2ConceptById(id: string): ProbabilityConcept | undefined {
  return ch2Concepts.find((c) => c.id === id);
}
