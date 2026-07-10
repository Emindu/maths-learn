import type { ContentBlock, ConceptSection, ProbabilityConcept } from './probabilityConceptsData';

export type { ContentBlock, ConceptSection, ProbabilityConcept };

export const ch6Concepts: ProbabilityConcept[] = [
  // ─────────────────────────────────────────────
  // 6.1  The Likelihood Function
  // ─────────────────────────────────────────────
  {
    id: 'likelihood-function',
    title: 'The Likelihood Function',
    chapterRef: 'Chapter 6 · Section 6.1',
    description:
      'The likelihood function encodes all the information in observed data about the unknown parameter θ. We explore how to construct it, what makes a statistic sufficient, and how the factorization theorem characterises sufficiency.',
    hook: 'The likelihood is the same joint density you already know — just re-read as a function of θ instead of the data. That flip is the entire foundation of frequentist and Bayesian inference: whichever camp you\'re in, the likelihood is what the data actually tell you about the parameter.',
    sections: [
      {
        heading: 'Likelihood and the Statistical Problem',
        blocks: [
          {
            type: 'text',
            content:
              'In Chapter 5 we set up the general framework for statistical inference: we observe a response s from an unknown probability distribution P_θ ∈ {P_θ : θ ∈ Ω} and we wish to make inferences about the unknown parameter θ. The first key concept is the likelihood function, which measures how consistent each candidate θ is with the observed data.',
          },
          {
            type: 'definition',
            number: '6.1.1',
            title: 'Likelihood Function',
            text: 'Let {f_θ : θ ∈ Ω} be a statistical model. For observed data s, the likelihood function is L : Ω → [0,∞) defined by L(θ | s) = f_θ(s). When f_θ is a density, L(θ | s) is the density value at s; when f_θ is a probability function, L(θ | s) = P_θ(S = s).',
          },
          {
            type: 'text',
            content:
              'The likelihood is a function of θ for a fixed observed s — it is not a probability distribution over θ. We read L(θ | s) as "the likelihood of θ given data s." Higher likelihood means the observed data are more probable (or have higher density) under θ.',
          },
          { type: 'viz', vizId: 'viz-ch6-likelihood-fn' },
          {
            type: 'example',
            number: '6.1.1',
            title: 'Binomial Likelihood',
            body: 'Suppose we observe s = 4 successes in n = 10 Bernoulli(θ) trials. The likelihood is L(θ | 4) = C(10,4) θ⁴(1−θ)⁶ ∝ θ⁴(1−θ)⁶. The binomial coefficient is a constant with respect to θ and does not affect relative likelihoods. The maximum occurs at θ = 4/10 = 0.4.',
          },
          {
            type: 'text',
            content:
              'Two likelihood functions L₁ and L₂ that are proportional — L₁(θ | s) = c·L₂(θ | s) for all θ with constant c > 0 — carry exactly the same information about θ. This is the likelihood principle: inference should depend on the data only through the likelihood function.',
          },
        ],
      },
      {
        heading: 'Sufficient Statistics',
        blocks: [
          {
            type: 'text',
            content:
              'Often the full data vector contains redundancy. A sufficient statistic is a summary that captures everything the data tell us about θ — no additional information can be extracted from the full data once the sufficient statistic is known.',
          },
          {
            type: 'definition',
            number: '6.1.2',
            title: 'Sufficient Statistic',
            text: 'A statistic T(s) is sufficient for θ if the conditional distribution of the sample S given T(S) = t does not depend on θ for any t. Equivalently, T is sufficient if and only if the likelihood factors as L(θ | s) = g(T(s), θ) · h(s) for non-negative functions g and h.',
          },
          {
            type: 'theorem',
            number: '6.1.1',
            title: 'Factorization Theorem',
            text:'T(s) is sufficient for θ if and only if there exist non-negative functions g(t, θ) and h(s) such that for all s and all θ ∈ Ω: f_θ(s) = g(T(s), θ) · h(s). The function h does not depend on θ.',
          },
          {
            type: 'example',
            number: '6.1.2',
            title: 'Sufficient Statistic for Bernoulli Trials',
            body: 'For n iid Bernoulli(θ) observations x₁,…,xₙ, the joint probability function is f_θ(x₁,…,xₙ) = θ^(Σxᵢ) (1−θ)^(n−Σxᵢ). By the factorization theorem T = Σxᵢ (the number of successes) is sufficient for θ. The sufficient statistic compresses n binary values into one integer.',
          },
          {
            type: 'example',
            number: '6.1.3',
            title: 'Order Statistics as Sufficient',
            body: 'For n iid observations from a family with density f_θ, the order statistic (x_(1),…,x_(n)) is always sufficient because the joint density factors as f_θ(x_(1))·…·f_θ(x_(n)) · n! (the n! factor being h(s)). For many parametric models a lower-dimensional sufficient statistic exists.',
          },
          {
            type: 'text',
            content:
              'The factorization theorem is the practical tool for identifying sufficient statistics. Once we identify T such that the likelihood depends on the data only through T, we know T is sufficient. All analyses based on the likelihood — including MLEs, confidence intervals, and hypothesis tests — depend on the data only through the sufficient statistic.',
          },
        ],
      },
      {
        heading: 'Relative Likelihood and Likelihood Intervals',
        blocks: [
          {
            type: 'definition',
            number: '6.1.3',
            title: 'Relative Likelihood',
            text: 'The relative likelihood function is RL(θ | s) = L(θ | s) / L(θ̂ | s), where θ̂ is the maximum likelihood estimate. The relative likelihood takes values in [0, 1] with RL(θ̂ | s) = 1.',
          },
          {
            type: 'definition',
            number: '6.1.4',
            title: 'p-Likelihood Interval',
            text: 'For p ∈ (0, 1], the p-likelihood interval (or p-likelihood region) is {θ : RL(θ | s) ≥ p}. The 0.5-likelihood interval contains all θ values at least half as likely as the MLE. Likelihood intervals provide an alternative to confidence intervals that directly reflects the evidence in the data.',
          },
          {
            type: 'formula',
            latex: 'RL(\\theta \\mid s) = \\frac{L(\\theta \\mid s)}{L(\\hat{\\theta} \\mid s)} \\geq p',
            label: 'p-Likelihood region condition',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 6.2  Maximum Likelihood Estimation
  // ─────────────────────────────────────────────
  {
    id: 'maximum-likelihood-estimation',
    title: 'Maximum Likelihood Estimation',
    chapterRef: 'Chapter 6 · Section 6.2',
    description:
      'The maximum likelihood estimate (MLE) is the value of θ that makes the observed data most probable. We derive MLEs using the log-likelihood and score equation, and examine the equivariance property of MLEs under reparametrisation.',
    hook: 'Maximum likelihood is the workhorse principle behind logistic regression, GLMs, and — via cross-entropy — most modern neural network training. Once you understand what "maximum likelihood" is really doing, most of ML stops feeling like a bag of tricks.',
    sections: [
      {
        heading: 'Definition and Motivation',
        blocks: [
          {
            type: 'predict',
            title: 'What\'s the MLE of θ?',
            question: 'You flip a coin 10 times and observe 7 heads. Under a Bernoulli(θ) model, what value of θ makes this data most probable — i.e., what\'s the MLE?',
            reveal: '0.7 — exactly the sample proportion. The likelihood is L(θ) = θ⁷(1−θ)³. Taking log and differentiating: 7/θ = 3/(1−θ), giving θ̂ = 7/10. This is the general lesson: for many natural models, the MLE turns out to be the "obvious" sample statistic. Where MLE really earns its keep is when the sample statistic isn\'t obvious — e.g., variance-with-known-mean, mixture components, censored data.',
          },
          {
            type: 'definition',
            number: '6.2.1',
            title: 'Maximum Likelihood Estimate (MLE)',
            text: 'The maximum likelihood estimate of θ given data s is θ̂(s) = argmax_{θ ∈ Ω} L(θ | s). It is the value of θ that maximises the likelihood function. When Ω is an open set and L is differentiable, θ̂ is found by solving the score equation S(θ | s) = 0.',
          },
          {
            type: 'text',
            content:
              'Because the logarithm is a strictly increasing function, maximising L(θ | s) is equivalent to maximising the log-likelihood ℓ(θ | s) = log L(θ | s). The log-likelihood is often easier to work with algebraically, turning products into sums.',
          },
          {
            type: 'formula',
            latex: '\\ell(\\theta \\mid s) = \\log L(\\theta \\mid s), \\qquad S(\\theta \\mid s) = \\frac{\\partial}{\\partial \\theta} \\ell(\\theta \\mid s)',
            label: 'Log-likelihood and score function',
          },
          { type: 'viz', vizId: 'viz-ch6-mle-score' },
        ],
      },
      {
        heading: 'Score Function and the Score Equation',
        blocks: [
          {
            type: 'definition',
            number: '6.2.2',
            title: 'Score Function',
            text: 'The score function is S(θ | s) = ∂ℓ(θ | s)/∂θ = (∂/∂θ) log L(θ | s). For an interior maximum, the MLE satisfies the score equation S(θ̂ | s) = 0.',
          },
          {
            type: 'example',
            number: '6.2.1',
            title: 'MLE for Bernoulli(θ)',
            body: 'For n iid Bernoulli(θ) with data s = (x₁,…,xₙ) and t = Σxᵢ, the log-likelihood is ℓ(θ | s) = t log θ + (n−t) log(1−θ). The score equation is S(θ) = t/θ − (n−t)/(1−θ) = 0, giving θ̂ = t/n = x̄. The MLE is the sample mean, which is also the sufficient statistic divided by n.',
          },
          {
            type: 'example',
            number: '6.2.2',
            title: 'MLE for Normal(μ, σ²)',
            body: 'For n iid N(μ, σ²) observations, ℓ(μ, σ² | x) = −n/2 · log(2πσ²) − 1/(2σ²) Σ(xᵢ−μ)². Setting ∂ℓ/∂μ = 0 gives μ̂ = x̄. Setting ∂ℓ/∂σ² = 0 gives σ̂² = (1/n)Σ(xᵢ−x̄)². Note that σ̂² is biased — it divides by n, not n−1.',
          },
          {
            type: 'example',
            number: '6.2.3',
            title: 'MLE for Uniform(0, θ)',
            body: 'For n iid Uniform(0, θ) observations, L(θ | s) = θ^(−n) for θ ≥ x_(n), and 0 otherwise. The likelihood is not differentiable at the boundary. The MLE is θ̂ = x_(n) = max(x₁,…,xₙ) — found by inspection, not by the score equation.',
          },
        ],
      },
      {
        heading: 'Properties of MLEs',
        blocks: [
          {
            type: 'theorem',
            number: '6.2.1',
            title: 'Equivariance (Invariance) of MLEs',
            text:'If θ̂ is the MLE of θ and ψ = g(θ) is a one-to-one transformation, then ĝ = g(θ̂) is the MLE of ψ. More generally, for any function ψ = g(θ), the MLE of ψ is ψ̂ = g(θ̂).',
          },
          {
            type: 'example',
            number: '6.2.4',
            title: 'Equivariance in Practice',
            body: 'If the MLE of the mean μ of an exponential distribution is μ̂ = x̄, then the MLE of the rate λ = 1/μ is λ̂ = 1/x̄. Similarly, the MLE of P(X > c) = e^(−c/μ) is e^(−c/x̄). Equivariance makes MLEs easy to compute for derived quantities.',
          },
          {
            type: 'text',
            content:
              'The MLE is one of the most widely used estimation methods in statistics. It has excellent large-sample properties (consistency, asymptotic normality) which we will examine in Section 6.5. For small samples, the MLE may be biased, but bias often vanishes as n → ∞.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 6.3  Inferences Based on the MLE
  // ─────────────────────────────────────────────
  {
    id: 'inferences-based-on-mle',
    title: 'Inferences Based on the MLE',
    chapterRef: 'Chapter 6 · Section 6.3',
    description:
      'Using the MLE as a pivot, we derive confidence intervals, conduct hypothesis tests, and compute the power of tests. We also address the choice of sample size for a desired margin of error.',
    hook: 'A point estimate on its own tells you almost nothing — is it 5 ± 0.1 or 5 ± 500? Confidence intervals and hypothesis tests are what turn a bare number into an actionable statement. This section is also where the most-abused sentence in all of statistics gets defined: what a 95% CI actually means.',
    sections: [
      {
        heading: 'Bias, MSE, and Comparing Estimators',
        blocks: [
          {
            type: 'predict',
            title: 'What does "95% confidence" actually mean?',
            question: 'A researcher reports a 95% confidence interval of [4.2, 5.8] for the true mean μ. Which of these is a correct interpretation? (a) There\'s a 95% probability μ is between 4.2 and 5.8. (b) If we repeated this whole experiment many times, about 95% of the resulting intervals would contain the true μ. (c) 95% of the data lie between 4.2 and 5.8.',
            reveal: 'Only (b) is right. Once you have data, the interval [4.2, 5.8] is fixed and μ is fixed — there\'s nothing random left, so no "probability" statement about μ makes sense in the frequentist framework. The 95% refers to the *procedure*: over many repetitions, the interval-making rule captures μ 95% of the time. (a) sounds intuitive and is actually the Bayesian "credible interval" statement — see Chapter 7 for the framework where (a) is legal.',
          },
          {
            type: 'definition',
            number: '6.3.1',
            title: 'Bias and Mean Squared Error',
            text: 'The bias of an estimator T for parameter ψ(θ) is bias_θ(T) = E_θ[T] − ψ(θ). The mean squared error is MSE_θ(T) = E_θ[(T − ψ(θ))²] = Var_θ(T) + [bias_θ(T)]².',
          },
          {
            type: 'text',
            content:
              'An unbiased estimator has E_θ[T] = ψ(θ) for all θ, so MSE equals variance. Unbiasedness is often sought but is not always achievable or even desirable — a slightly biased estimator with much smaller variance can have smaller MSE than an unbiased one.',
          },
          { type: 'viz', vizId: 'viz-ch6-bias-mse' },
          {
            type: 'example',
            number: '6.3.1',
            title: 'Comparing Estimators for Bernoulli θ',
            body: 'For Bernoulli(θ) with n observations, the MLE T₁ = x̄ is unbiased with Var = θ(1−θ)/n. A "smoothed" estimator T₂ = (nx̄+1)/(n+2) is biased but has smaller variance for θ near 0 or 1. The MSE of T₂ is smaller than T₁ for many values of θ when n is small.',
          },
          {
            type: 'formula',
            latex: 'MSE_\\theta(T) = \\mathrm{Var}_\\theta(T) + [\\mathrm{bias}_\\theta(T)]^2',
            label: 'Bias–variance decomposition of MSE',
          },
        ],
      },
      {
        heading: 'Confidence Intervals',
        blocks: [
          {
            type: 'definition',
            number: '6.3.2',
            title: 'Confidence Interval',
            text: 'A (1−α)-level confidence interval for θ is an interval [L(s), U(s)] such that P_θ(L(S) ≤ θ ≤ U(S)) ≥ 1−α for all θ ∈ Ω. The interval is random (it depends on the sample); θ is fixed. The confidence level 1−α is the probability that the procedure captures θ.',
          },
          { type: 'viz', vizId: 'viz-ch6-confidence-intervals' },
          {
            type: 'example',
            number: '6.3.2',
            title: 'z-CI for μ when σ² known',
            body: 'For n iid N(μ, σ²) observations with σ² known, the pivot Z = √n(X̄ − μ)/σ ~ N(0,1). A 95% confidence interval is x̄ ± 1.96·σ/√n. The interval is centred at the MLE x̄ with half-width z_{α/2} · σ/√n.',
          },
          {
            type: 'example',
            number: '6.3.3',
            title: 't-CI for μ when σ² unknown',
            body: 'When σ² is unknown, replace σ by the sample standard deviation s. The pivot T = √n(X̄ − μ)/s ~ t(n−1). A 95% CI is x̄ ± t_{α/2}(n−1) · s/√n. The t-distribution is heavier-tailed than the normal, producing wider intervals that account for the extra uncertainty.',
          },
          {
            type: 'formula',
            latex: '\\bar{x} \\pm z_{\\alpha/2} \\frac{\\sigma}{\\sqrt{n}} \\quad (\\sigma^2 \\text{ known}) \\qquad \\bar{x} \\pm t_{\\alpha/2}(n-1) \\frac{s}{\\sqrt{n}} \\quad (\\sigma^2 \\text{ unknown})',
            label: 'Confidence intervals for the normal mean',
          },
        ],
      },
      {
        heading: 'Hypothesis Testing',
        blocks: [
          {
            type: 'definition',
            number: '6.3.3',
            title: 'Hypothesis Test',
            text: 'A hypothesis test of H₀: θ ∈ Ω₀ versus H₁: θ ∈ Ω₁ is a decision rule based on data s: reject H₀ if s falls in the critical region C, otherwise do not reject. The size (type I error) is α = sup_{θ ∈ Ω₀} P_θ(S ∈ C). The power function is β(θ) = P_θ(S ∈ C) for θ ∈ Ω₁.',
          },
          { type: 'viz', vizId: 'viz-ch6-pvalue-test' },
          {
            type: 'definition',
            number: '6.3.4',
            title: 'P-value',
            text: 'The P-value is the probability, computed under H₀, of observing a test statistic at least as extreme as the one observed: P-value = P_{H₀}(|T| ≥ |t_obs|) for a two-sided test. A small P-value is evidence against H₀.',
          },
          {
            type: 'example',
            number: '6.3.4',
            title: 'Two-Sided z-Test',
            body: 'Testing H₀: μ = μ₀ against H₁: μ ≠ μ₀ with known σ². Compute z_obs = √n(x̄ − μ₀)/σ. The P-value is P(|Z| ≥ |z_obs|) = 2(1 − Φ(|z_obs|)). Reject H₀ at level α if P-value < α, equivalently if |z_obs| > z_{α/2}.',
          },
          {
            type: 'text',
            content:
              'The power β(θ) = P_θ(reject H₀) should be large when θ is far from Ω₀. For a one-sided test H₀: μ ≤ μ₀ versus H₁: μ > μ₀, the power at μ = μ₁ is P_{μ₁}(X̄ > c) = 1 − Φ((c − μ₁)/(σ/√n)). Increasing n increases power.',
          },
        ],
      },
      {
        heading: 'Sample Size Determination',
        blocks: [
          {
            type: 'text',
            content:
              'Before collecting data, we can choose n to achieve a desired accuracy. For a confidence interval of half-width at most d with probability 1−α, we need n ≥ (z_{α/2} σ / d)². For a test with power at least 1−β at a specific alternative θ₁, the required n can be calculated from the power equation.',
          },
          {
            type: 'formula',
            latex: 'n \\geq \\left(\\frac{z_{\\alpha/2}\\,\\sigma}{d}\\right)^2',
            label: 'Sample size for half-width ≤ d (known σ)',
          },
          {
            type: 'example',
            number: '6.3.5',
            title: 'Sample Size for Estimating a Proportion',
            body: 'For estimating a Bernoulli proportion θ with margin of error d = 0.05 at 95% confidence, use the conservative bound σ² ≤ 1/4 (since θ(1−θ) ≤ 1/4). Then n ≥ (1.96)² · (0.25) / (0.05)² = 384.16, so n = 385.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 6.4  Distribution-Free Methods
  // ─────────────────────────────────────────────
  {
    id: 'distribution-free-methods',
    title: 'Distribution-Free Methods',
    chapterRef: 'Chapter 6 · Section 6.4',
    description:
      'When the form of the underlying distribution is unknown, we can still make inferences using distribution-free (nonparametric) methods: the method of moments, bootstrapping, and the sign test.',
    hook: 'When you can\'t or won\'t assume a distributional family, nonparametric methods still let you infer, estimate, and test. Bootstrapping in particular is the closest thing to a universal statistical solvent — resample your data and let the computer approximate any sampling distribution you need.',
    sections: [
      {
        heading: 'Method of Moments',
        blocks: [
          {
            type: 'definition',
            number: '6.4.1',
            title: 'Method of Moments Estimator',
            text: 'The k-th population moment is μₖ = E[Xᵏ]. The k-th sample moment is m_k = (1/n)Σxᵢᵏ. The method of moments (MOM) estimator equates population moments to sample moments and solves for the parameter(s). If the model has p parameters, equate the first p moments.',
          },
          {
            type: 'example',
            number: '6.4.1',
            title: 'MOM for Gamma(α, β)',
            body: 'The Gamma(α, β) distribution has E[X] = αβ and E[X²] = αβ²(α+1) = α²β² + αβ². Setting m₁ = αβ and m₂ = αβ²(α+1) and solving: β̂ = (m₂ − m₁²)/m₁ = s²/x̄, α̂ = m₁/β̂ = x̄²/s². For many distributions the MOM estimator coincides with the MLE.',
          },
          {
            type: 'text',
            content:
              'The method of moments is computationally simple and works even when the likelihood is complex or the MLE has no closed form. Its estimators are consistent but may be less efficient than MLEs in large samples.',
          },
        ],
      },
      {
        heading: 'Bootstrapping',
        blocks: [
          {
            type: 'text',
            content:
              'The bootstrap is a simulation-based method for estimating the sampling distribution of any statistic T(X₁,…,Xₙ). The idea is to treat the empirical distribution (the sample) as if it were the true distribution, and resample from it repeatedly.',
          },
          {
            type: 'definition',
            number: '6.4.2',
            title: 'Bootstrap Procedure',
            text: 'Given data s = (x₁,…,xₙ), draw m bootstrap samples s*₁,…,s*_m each of size n by sampling with replacement from {x₁,…,xₙ}. Compute T* = T(s*ⱼ) for each. The bootstrap distribution of T* approximates the sampling distribution of T(S). Bootstrap standard errors and confidence intervals can be read off from this distribution.',
          },
          { type: 'viz', vizId: 'viz-ch6-bootstrap' },
          {
            type: 'example',
            number: '6.4.2',
            title: 'Bootstrap SE of the Median',
            body: 'Fifteen subjects with chronic hepatitis C had log₁₀(viral load) measurements: −2.0, −0.2, −5.2, −3.5, −3.9, −0.6, −4.3, −1.7, −9.5, 1.6, −2.9, 0.9, −1.0, −2.0, 3.0. The sample median is −2.0. Drawing 2000 bootstrap samples of size 15 with replacement, computing the median of each, and taking the SD of these 2000 medians gives the bootstrap SE ≈ 0.93.',
          },
          {
            type: 'text',
            content:
              'Bootstrap confidence intervals can be constructed in several ways: the normal approximation T̂ ± z_{α/2}·SE*, the percentile method (using quantiles of the bootstrap distribution), or the bias-corrected accelerated (BCa) method. The percentile interval is [T*_{α/2}, T*_{1−α/2}] where T*_p is the p-th quantile of the bootstrap distribution.',
          },
        ],
      },
      {
        heading: 'The Sign Test',
        blocks: [
          {
            type: 'definition',
            number: '6.4.3',
            title: 'Sign Test',
            text: 'To test H₀: median = m₀ versus a one- or two-sided alternative using continuous data x₁,…,xₙ, compute the number of observations above m₀: K = #{i : xᵢ > m₀}. Under H₀, K ~ Binomial(n, 1/2). The P-value is computed using the Binomial(n, 1/2) distribution.',
          },
          {
            type: 'example',
            number: '6.4.3',
            title: 'Sign Test for Viral Load Data',
            body: 'Using the hepatitis C data, test H₀: median log-viral-load = −2.0. Only 5 of 15 observations exceed −2.0 (discard ties). Under H₀, K ~ Bin(15, 0.5). P-value = 2·P(K ≤ 5) = 2·0.1509 = 0.302. We cannot reject H₀ at any reasonable significance level.',
          },
          {
            type: 'text',
            content:
              'The sign test is nonparametric: it makes no assumptions about the distribution of the data beyond continuity (to ensure no ties with probability one). It is less powerful than a t-test when normality holds, but more robust when the distribution is heavy-tailed or skewed.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 6.5  Asymptotics for the MLE (Advanced)
  // ─────────────────────────────────────────────
  {
    id: 'mle-asymptotics',
    title: 'Asymptotics for the MLE',
    chapterRef: 'Chapter 6 · Section 6.5',
    description:
      'For large samples, the MLE has two remarkable properties: it is consistent (converges to the true θ) and asymptotically normal. The Fisher information quantifies the curvature of the log-likelihood and determines the limiting variance of the MLE.',
    hook: 'The large-sample MLE story is astonishingly clean: consistent, asymptotically normal, and variance equal to the inverse Fisher information — the tightest possible. This is why standard errors in nearly every scientific paper are computed as if the estimator were Gaussian: because for MLEs, at large n, it very nearly is.',
    sections: [
      {
        heading: 'Fisher Information',
        blocks: [
          {
            type: 'definition',
            number: '6.5.1',
            title: 'Fisher Information',
            text: 'The Fisher information in a single observation is I(θ) = E_θ[(S(θ | X))²] = E_θ[−∂²/∂θ² log f_θ(X)], where S(θ | x) = ∂/∂θ log f_θ(x) is the score. For n iid observations, the total Fisher information is n·I(θ).',
          },
          {
            type: 'formula',
            latex: 'I(\\theta) = E_\\theta\\!\\left[\\left(\\frac{\\partial}{\\partial\\theta}\\log f_\\theta(X)\\right)^2\\right] = -E_\\theta\\!\\left[\\frac{\\partial^2}{\\partial\\theta^2}\\log f_\\theta(X)\\right]',
            label: 'Fisher information (single observation)',
          },
          {
            type: 'example',
            number: '6.5.1',
            title: 'Fisher Information for Bernoulli(θ)',
            body: 'For X ~ Bernoulli(θ), log f_θ(x) = x log θ + (1−x) log(1−θ). The score is S(θ | x) = x/θ − (1−x)/(1−θ). Then S² evaluated: E[S²] = θ/θ² + (1−θ)/(1−θ)² = 1/θ + 1/(1−θ) = 1/(θ(1−θ)). So I(θ) = 1/(θ(1−θ)).',
          },
          {
            type: 'definition',
            number: '6.5.2',
            title: 'Observed Fisher Information',
            text: 'The observed Fisher information is Î(s) = −∂²/∂θ² ℓ(θ | s)|_{θ = θ̂}, the negative second derivative of the log-likelihood evaluated at the MLE. It is the sample-based analogue of I(θ) and is used in practice to estimate the variance of the MLE.',
          },
        ],
      },
      {
        heading: 'Cramér–Rao Lower Bound',
        blocks: [
          {
            type: 'theorem',
            number: '6.5.1',
            title: 'Cramér–Rao Inequality',
            text:'Let T be any unbiased estimator of θ based on n iid observations from f_θ. Under regularity conditions, Var_θ(T) ≥ 1/(n·I(θ)). An unbiased estimator achieving equality is called a minimum variance unbiased estimator (MVUE).',
          },
          {
            type: 'text',
            content:
              'The Cramér–Rao bound gives a fundamental lower bound on how accurately we can estimate θ. No unbiased estimator can have variance smaller than 1/(n·I(θ)). The MLE is asymptotically efficient — it achieves this bound in the limit as n → ∞.',
          },
          {
            type: 'example',
            number: '6.5.2',
            title: 'Efficiency of the Sample Mean for Bernoulli',
            body: 'For Bernoulli(θ) with n observations, I(θ) = 1/(θ(1−θ)), so the Cramér–Rao bound is θ(1−θ)/n. The MLE θ̂ = x̄ has Var(x̄) = θ(1−θ)/n, so it achieves the bound exactly. The MLE x̄ is the MVUE for θ in the Bernoulli model.',
          },
        ],
      },
      {
        heading: 'Consistency and Asymptotic Normality',
        blocks: [
          {
            type: 'theorem',
            number: '6.5.2',
            title: 'Consistency of the MLE',
            text:'Under regularity conditions, the MLE θ̂_n converges in probability to the true parameter θ₀ as n → ∞: θ̂_n →_P θ₀. That is, for every ε > 0, P_{θ₀}(|θ̂_n − θ₀| > ε) → 0.',
          },
          {
            type: 'theorem',
            number: '6.5.3',
            title: 'Asymptotic Normality of the MLE',
            text:'Under regularity conditions, √n(θ̂_n − θ₀) →_d N(0, 1/I(θ₀)) as n → ∞. Equivalently, θ̂_n is approximately N(θ₀, 1/(n·I(θ₀))) for large n.',
          },
          {
            type: 'formula',
            latex: '\\sqrt{n}\\,(\\hat{\\theta}_n - \\theta_0) \\xrightarrow{d} N\\!\\left(0,\\; \\frac{1}{I(\\theta_0)}\\right)',
            label: 'Asymptotic normality of the MLE',
          },
          {
            type: 'text',
            content:
              'Asymptotic normality justifies using the MLE to construct large-sample confidence intervals and hypothesis tests. An approximate (1−α) CI for θ is θ̂ ± z_{α/2}/√(n·Î(s)), where Î(s) is the observed Fisher information. This is valid for any parametric model, not just the normal model.',
          },
          {
            type: 'example',
            number: '6.5.3',
            title: 'Large-Sample CI using Fisher Information',
            body: 'For n = 100 Bernoulli trials with s = 40 successes, θ̂ = 0.4. The observed Fisher information is Î = 1/(θ̂(1−θ̂)) = 1/(0.24) ≈ 4.167. An approximate 95% CI is 0.4 ± 1.96/√(100 × 4.167) = 0.4 ± 0.096 = (0.304, 0.496). This matches the standard Wilson or normal-approximation interval.',
          },
          {
            type: 'text',
            content:
              'The delta method extends asymptotic normality to smooth functions of the MLE: if ψ = g(θ), then √n(g(θ̂_n) − g(θ₀)) →_d N(0, (g′(θ₀))²/I(θ₀)). This allows us to build confidence intervals for any differentiable function of θ directly from the MLE and its asymptotic variance.',
          },
        ],
      },
    ],
  },
];

export function getCh6ConceptById(id: string): ProbabilityConcept | undefined {
  return ch6Concepts.find(c => c.id === id);
}
