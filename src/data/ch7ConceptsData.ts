import type { ContentBlock, ConceptSection, ProbabilityConcept } from './probabilityConceptsData';

export type { ContentBlock, ConceptSection, ProbabilityConcept };

export const ch7Concepts: ProbabilityConcept[] = [

  // ─────────────────────────────────────────────
  // 7.1  The Prior and Posterior Distributions
  // ─────────────────────────────────────────────
  {
    id: 'prior-posterior-distributions',
    title: 'The Prior and Posterior Distributions',
    chapterRef: 'Chapter 7 · Section 7.1',
    description:
      'Bayesian inference treats the unknown parameter θ as a random variable. A prior distribution π(θ) encodes beliefs before observing data; after observing s the prior is updated to the posterior π(θ|s) via Bayes\' theorem. Conjugate families make this update analytically tractable.',
    sections: [
      {
        heading: 'Bayesian Framework',
        blocks: [
          {
            type: 'text',
            content:
              'In the frequentist framework of Chapters 5–6, the parameter θ is an unknown fixed constant and probability statements about θ are not meaningful. In the Bayesian framework, θ is treated as a random variable with a distribution that reflects our uncertainty. Before collecting data, we specify a prior distribution π(θ); after observing data s, we update our beliefs using Bayes\' theorem to obtain the posterior distribution π(θ|s).',
          },
          {
            type: 'definition',
            number: '7.1.1',
            title: 'Prior and Posterior Distributions',
            text: 'The prior distribution π(θ) for θ ∈ Ω represents beliefs about θ before the data are observed. After observing data s with density/PMF f_θ(s), the posterior distribution of θ given s is π(θ|s) = π(θ)f_θ(s) / m(s), where m(s) = ∫_Ω π(θ)f_θ(s) dθ is the prior predictive density of s.',
          },
          {
            type: 'formula',
            latex: '\\pi(\\theta \\mid s) = \\frac{\\pi(\\theta)\\,f_\\theta(s)}{m(s)}, \\qquad m(s) = \\int_\\Omega \\pi(\\theta)\\,f_\\theta(s)\\,d\\theta',
            label: 'Bayes\' theorem for the posterior',
          },
          {
            type: 'text',
            content:
              'The denominator m(s) is the prior predictive density at the observed data — it does not depend on θ and acts as a normalising constant. Because π(θ|s) ∝ π(θ)f_θ(s), the posterior is proportional to the product of the prior and the likelihood. This is the fundamental Bayesian identity.',
          },
          { type: 'viz', vizId: 'viz-ch7-prior-posterior' },
        ],
      },
      {
        heading: 'Conjugate Families',
        blocks: [
          {
            type: 'definition',
            number: '7.1.2',
            title: 'Conjugate Prior',
            text: 'A family of prior distributions F is conjugate to the likelihood f_θ if, for every prior π ∈ F, the resulting posterior π(θ|s) is also a member of F. Conjugate priors produce analytically tractable posteriors.',
          },
          {
            type: 'example',
            number: '7.1.1',
            title: 'Beta–Bernoulli Conjugate',
            body: 'For iid Bernoulli(θ) data with t = Σxᵢ successes in n trials, if the prior is π(θ) = Beta(α, β) then the posterior is π(θ|s) = Beta(α + t, β + n − t). The hyperparameters α and β act like pseudo-counts of prior successes and failures. The prior predictive mass is m(s) = C(n,t)·B(α+t, β+n−t)/B(α,β).',
          },
          {
            type: 'example',
            number: '7.1.2',
            title: 'Normal–Normal Conjugate (Location)',
            body: 'For n iid N(μ, σ²) observations with σ² known, if the prior is μ ~ N(μ₀, τ₀²) then the posterior is μ|s ~ N(μ₁, τ₁²), where 1/τ₁² = 1/τ₀² + n/σ² and μ₁ = (μ₀/τ₀² + nx̄/σ²)·τ₁². The posterior mean is a precision-weighted average of prior mean μ₀ and sample mean x̄.',
          },
          {
            type: 'formula',
            latex: '\\frac{1}{\\tau_1^2} = \\frac{1}{\\tau_0^2} + \\frac{n}{\\sigma^2}, \\qquad \\mu_1 = \\frac{\\mu_0/\\tau_0^2 + n\\bar{x}/\\sigma^2}{1/\\tau_1^2}',
            label: 'Normal–Normal posterior parameters',
          },
          { type: 'viz', vizId: 'viz-ch7-normal-update' },
          {
            type: 'example',
            number: '7.1.3',
            title: 'Dirichlet–Multinomial Conjugate',
            body: 'For n iid observations from a Multinomial(1, p) distribution with counts (x₁,…,xₖ), if the prior is p ~ Dirichlet(α₁,…,αₖ) then the posterior is p|s ~ Dirichlet(x₁+α₁,…,xₖ+αₖ). The Dirichlet is the multivariate generalisation of the Beta distribution and is conjugate to the Multinomial.',
          },
          {
            type: 'text',
            content:
              'Conjugate priors are popular because they make computation easy and the prior hyperparameters have natural interpretations as "pseudo-data." However, conjugate priors may not always represent realistic prior beliefs. In Section 7.4 we discuss how to choose priors more carefully.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 7.2  Inferences Based on the Posterior
  // ─────────────────────────────────────────────
  {
    id: 'inferences-based-on-posterior',
    title: 'Inferences Based on the Posterior',
    chapterRef: 'Chapter 7 · Section 7.2',
    description:
      'All Bayesian inferences flow from the posterior distribution: point estimates (mode, mean), credible intervals (HPD regions), hypothesis testing via posterior probabilities and Bayes factors, and prediction via the posterior predictive distribution.',
    sections: [
      {
        heading: 'Point Estimation from the Posterior',
        blocks: [
          {
            type: 'definition',
            number: '7.2.1',
            title: 'Posterior Mode and Mean',
            text: 'The posterior mode (MAP estimate) maximises π(ψ|s) over ψ; it minimises expected 0–1 loss. The posterior mean E(ψ(θ)|s) minimises expected squared-error loss. For symmetric unimodal posteriors mode = mean = median; for skewed posteriors they differ.',
          },
          {
            type: 'text',
            content:
              'For the Beta(α+t, β+n−t) posterior in the Bernoulli model, the posterior mean is (α+t)/(α+β+n) and the posterior mode is (α+t−1)/(α+β+n−2) (for α+t, β+n−t > 1). As n → ∞ both converge to the MLE t/n.',
          },
          { type: 'viz', vizId: 'viz-ch7-bayes-estimation' },
        ],
      },
      {
        heading: 'Credible Intervals',
        blocks: [
          {
            type: 'definition',
            number: '7.2.2',
            title: 'Credible Interval',
            text: 'A γ-credible interval (or Bayesian credible region) C(s) satisfies P(ψ(θ) ∈ C(s) | s) ≥ γ. Unlike a frequentist confidence interval, a γ-credible interval has a direct probability interpretation: the probability that the parameter lies in C(s) given the observed data is at least γ.',
          },
          {
            type: 'definition',
            number: '7.2.3',
            title: 'Highest Posterior Density (HPD) Interval',
            text: 'The HPD interval of level γ is the shortest credible interval. For a unimodal posterior it is C(s) = {ψ : ω(ψ|s) ≥ c} where c is chosen so that P(ψ(θ) ∈ C(s)|s) = γ. The HPD region has the property that every point inside has higher posterior density than every point outside.',
          },
          { type: 'viz', vizId: 'viz-ch7-credible-interval' },
          {
            type: 'example',
            number: '7.2.1',
            title: '95% Credible Interval for Bernoulli θ',
            body: 'With prior Beta(1,1) (uniform) and 14 successes in 20 trials, the posterior is Beta(15, 7). The 95% equal-tails credible interval is [Q_{0.025}, Q_{0.975}] of Beta(15,7), approximately [0.477, 0.855]. The HPD interval is slightly shorter because the Beta(15,7) is mildly right-skewed.',
          },
        ],
      },
      {
        heading: 'Hypothesis Testing: Bayes Factors',
        blocks: [
          {
            type: 'definition',
            number: '7.2.4',
            title: 'Bayes Factor',
            text: 'For two models/hypotheses H₀ and H₁ with prior predictive densities m₁(s) and m₂(s), the Bayes factor of H₀ against H₁ is BF(H₀:H₁) = m₁(s)/m₂(s). It equals the ratio of the posterior odds to the prior odds: BF = [P(H₀|s)/P(H₁|s)] / [P(H₀)/P(H₁)].',
          },
          {
            type: 'formula',
            latex: 'BF(H_0:H_1) = \\frac{m_1(s)}{m_2(s)} = \\frac{P(H_0 \\mid s)/P(H_1 \\mid s)}{P(H_0)/P(H_1)}',
            label: 'Bayes factor as ratio of marginal likelihoods',
          },
          { type: 'viz', vizId: 'viz-ch7-bayes-factor' },
          {
            type: 'text',
            content:
              'A Bayes factor BF > 1 supports H₀; BF > 10 is strong evidence; BF > 100 is decisive. If P(H₀) = P(H₁) = 1/2 (equal prior probability), then P(H₀|s) = BF / (1 + BF). Bayes factors avoid the "reject or not reject" dichotomy and provide a continuous measure of evidence.',
          },
          {
            type: 'example',
            number: '7.2.2',
            title: 'Bayes Factor for Bernoulli θ = 0.5',
            body: 'Testing H₀: θ = 0.5 against H₁: θ ~ Uniform(0,1) with n = 20 and t = 10 successes: BF(H₀:H₁) = P(T=10|θ=0.5) / m(T=10|H₁). Under H₁, m(t) = 1/(n+1) = 1/21 by the Beta-Binomial integral with Uniform prior. Under H₀, P(T=10|θ=0.5) = C(20,10)·(0.5)²⁰ ≈ 0.176. So BF ≈ 0.176 × 21 ≈ 3.7 — modest support for H₀.',
          },
        ],
      },
      {
        heading: 'Prediction: Posterior Predictive',
        blocks: [
          {
            type: 'definition',
            number: '7.2.5',
            title: 'Posterior Predictive Distribution',
            text: 'Given observed data s, the posterior predictive distribution of a future observation T is q(t|s) = ∫_Ω q_θ(t|s) π(θ|s) dθ, where q_θ(t|s) is the conditional density of T given θ and s. The posterior predictive averages the predictive density over the posterior uncertainty in θ.',
          },
          {
            type: 'text',
            content:
              'A γ-prediction region for T is any set R(s) such that P(T ∈ R(s)|s) ≥ γ under the posterior predictive. The posterior predictive properly accounts for parameter uncertainty — it is wider than a plug-in prediction that uses only the point estimate θ̂.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 7.3  Bayesian Computations
  // ─────────────────────────────────────────────
  {
    id: 'bayesian-computations',
    title: 'Bayesian Computations',
    chapterRef: 'Chapter 7 · Section 7.3',
    description:
      'When the posterior has no closed form, we rely on asymptotic approximations (the posterior is approximately normal for large n) and Monte Carlo methods including importance sampling and Gibbs sampling to compute posterior summaries.',
    sections: [
      {
        heading: 'Asymptotic Normality of the Posterior',
        blocks: [
          {
            type: 'theorem',
            number: '7.3.1',
            title: 'Asymptotic Normality of the Posterior',
            text: 'Under regularity conditions, as n → ∞ the posterior π(θ|s) is approximately N(θ̂_n, 1/(n·I(θ̂_n))), where θ̂_n is the MLE and I(θ) is the Fisher information. This mirrors the asymptotic normality of the MLE but is a statement about the posterior distribution rather than the sampling distribution of the estimator.',
          },
          {
            type: 'text',
            content:
              'Asymptotic normality of the posterior implies that for large n the choice of prior has diminishing influence — the data overwhelm the prior. Consequently, frequentist and Bayesian inferences tend to agree for large samples under smooth priors.',
          },
          {
            type: 'formula',
            latex: '\\pi(\\theta \\mid s) \\approx N\\!\\left(\\hat{\\theta}_n,\\; \\frac{1}{n\\,I(\\hat{\\theta}_n)}\\right) \\quad \\text{as } n \\to \\infty',
            label: 'Laplace approximation to the posterior',
          },
        ],
      },
      {
        heading: 'Monte Carlo from the Posterior',
        blocks: [
          {
            type: 'text',
            content:
              'When we can draw iid samples θ₁,…,θ_N from the posterior π(θ|s), Monte Carlo approximations give E(w(θ)|s) ≈ (1/N) Σ w(θᵢ). This works for any function w and requires only the ability to sample from the posterior. Many posterior quantities — means, quantiles, credible intervals — reduce to expectations that can be estimated this way.',
          },
          {
            type: 'definition',
            number: '7.3.1',
            title: 'Importance Sampling from the Posterior',
            text: 'If direct sampling from π(θ|s) is difficult, draw θᵢ from a proposal distribution g(θ) and compute importance weights wᵢ ∝ π(θᵢ|s) / g(θᵢ). The weighted average (Σwᵢ·h(θᵢ)) / (Σwᵢ) estimates E(h(θ)|s). Efficiency depends on how closely g matches π(·|s).',
          },
        ],
      },
      {
        heading: 'Gibbs Sampling',
        blocks: [
          {
            type: 'definition',
            number: '7.3.2',
            title: 'Gibbs Sampler',
            text: 'For a multivariate posterior π(θ₁,…,θₖ|s), the Gibbs sampler iteratively samples each component θⱼ from its full conditional distribution π(θⱼ | θ_{-j}, s), where θ_{-j} denotes all components except θⱼ. The resulting Markov chain converges to the joint posterior, generating approximate samples after a burn-in period.',
          },
          { type: 'viz', vizId: 'viz-ch7-gibbs-sampling' },
          {
            type: 'example',
            number: '7.3.1',
            title: 'Gibbs Sampler for Location-Scale Normal',
            body: 'For n iid N(μ, σ²) data with conjugate prior μ|σ² ~ N(μ₀, τ₀²σ²) and 1/σ² ~ Gamma(α₀, β₀), the full conditionals are: μ|(σ², s) ~ N(weighted mean, posterior variance) and 1/σ²|(μ, s) ~ Gamma(α₀ + n/2, β₀ + ½·SSE). We alternate sampling μ and 1/σ² in a Gibbs chain.',
          },
          {
            type: 'text',
            content:
              'Gibbs sampling is the simplest MCMC method. More general approaches (Metropolis–Hastings, Hamiltonian Monte Carlo) are needed when full conditionals are not tractable. Modern probabilistic programming languages (Stan, PyMC) implement these methods automatically.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 7.4  Choosing Priors
  // ─────────────────────────────────────────────
  {
    id: 'choosing-priors',
    title: 'Choosing Priors',
    chapterRef: 'Chapter 7 · Section 7.4',
    description:
      'The choice of prior is the most subjective element of Bayesian inference. We survey strategies: elicited priors from expert knowledge, conjugate priors for tractability, empirical Bayes, hierarchical Bayes, improper priors, and Jeffreys\' invariant prior.',
    sections: [
      {
        heading: 'Elicitation and Conjugate Priors',
        blocks: [
          {
            type: 'text',
            content:
              'The most principled approach is prior elicitation: ask a domain expert to specify quantiles of their belief distribution and fit a parametric family to those quantiles. For example, for a Bernoulli probability θ, ask the expert for their median and 90th percentile of θ, then fit a Beta(α,β) distribution to these two constraints.',
          },
          {
            type: 'text',
            content:
              'Conjugate priors (Definition 7.1.2) are popular when they also represent realistic prior beliefs. Because the hyperparameters of conjugate priors often have interpretations as pseudo-observations, they provide a natural way to encode prior information: α pseudo-successes and β pseudo-failures in the Beta prior for a Bernoulli model.',
          },
        ],
      },
      {
        heading: 'Empirical Bayes',
        blocks: [
          {
            type: 'definition',
            number: '7.4.1',
            title: 'Empirical Bayes',
            text: 'In empirical Bayes the hyperparameter λ of the prior π_λ(θ) is estimated from the data by maximising the prior predictive m_λ(s) = ∫ π_λ(θ)f_θ(s) dθ with respect to λ. The estimated λ̂ is then plugged into the prior: π_{λ̂}(θ). This data-driven approach uses the observed data to inform the prior.',
          },
          {
            type: 'text',
            content:
              'Empirical Bayes is a pragmatic compromise: it avoids subjective elicitation yet retains the Bayesian computational framework. However, using the data twice (once to estimate λ̂ and once for the likelihood) violates the Bayesian coherence principle and can understate posterior uncertainty.',
          },
        ],
      },
      {
        heading: 'Hierarchical Bayes',
        blocks: [
          {
            type: 'definition',
            number: '7.4.2',
            title: 'Hierarchical Bayes',
            text: 'Rather than fixing the hyperparameter λ, hierarchical Bayes places a hyperprior ω(λ) on λ. The marginal prior for θ is π(θ) = ∫ π_λ(θ)ω(λ) dλ. The joint posterior π(θ, λ|s) ∝ f_θ(s)π_λ(θ)ω(λ) accounts for uncertainty in both θ and λ. Gibbs sampling naturally applies to hierarchical models.',
          },
        ],
      },
      {
        heading: 'Improper and Jeffreys\' Priors',
        blocks: [
          {
            type: 'definition',
            number: '7.4.3',
            title: 'Improper Prior',
            text: 'An improper prior is a non-negative function π(θ) with ∫ π(θ)dθ = ∞. Improper priors are not probability distributions, but they can still yield proper posteriors if ∫ π(θ)f_θ(s)dθ < ∞. Flat priors π(θ) = 1 and scale priors π(σ) = 1/σ are common improper priors.',
          },
          {
            type: 'definition',
            number: '7.4.4',
            title: 'Jeffreys\' Prior',
            text: 'Jeffreys\' prior is π_J(θ) ∝ I(θ)^(1/2), where I(θ) is the Fisher information. It is invariant under reparametrisation: if we change variables to ψ = g(θ), the Jeffreys\' prior for ψ is also proportional to the Fisher information in ψ. Jeffreys\' prior represents a default "non-informative" prior.',
          },
          {
            type: 'formula',
            latex: '\\pi_J(\\theta) \\propto I(\\theta)^{1/2} = \\left[-E_\\theta\\!\\left(\\frac{\\partial^2}{\\partial\\theta^2}\\log f_\\theta(X)\\right)\\right]^{1/2}',
            label: 'Jeffreys\' invariant prior',
          },
          {
            type: 'example',
            number: '7.4.1',
            title: 'Jeffreys\' Prior for Bernoulli',
            body: 'For Bernoulli(θ), I(θ) = 1/(θ(1−θ)), so π_J(θ) ∝ θ^(−1/2)(1−θ)^(−1/2) = Beta(1/2, 1/2). This is a U-shaped distribution that concentrates mass near 0 and 1, reflecting the scale-invariant nature of the prior.',
          },
          {
            type: 'text',
            content:
              'The choice of prior always matters for finite samples; for large samples the posterior is dominated by the likelihood regardless of the prior (by asymptotic normality). In practice, a sensitivity analysis varying the prior is advisable to assess how much conclusions depend on prior assumptions.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 7.5  Further Proofs (Advanced)
  // ─────────────────────────────────────────────
  {
    id: 'bayesian-asymptotics',
    title: 'Bayesian Asymptotics (Advanced)',
    chapterRef: 'Chapter 7 · Section 7.5',
    description:
      'The location-scale Normal conjugate derivation, asymptotic consistency of the posterior (Bernstein–von Mises theorem), and connections between Bayesian and frequentist procedures for large samples.',
    sections: [
      {
        heading: 'Location-Scale Normal Conjugate',
        blocks: [
          {
            type: 'text',
            content:
              'When both the mean μ and variance σ² of a Normal distribution are unknown, we use the Normal-Gamma conjugate family. The joint prior for (μ, 1/σ²) = (μ, λ) takes the form: λ ~ Gamma(α₀, β₀) and μ|λ ~ N(μ₀, 1/(κ₀λ)). This gives the Normal-Gamma (or Normal-Inverse-Gamma) prior.',
          },
          {
            type: 'theorem',
            number: '7.5.1',
            title: 'Normal-Gamma Conjugate Update',
            text: 'For n iid N(μ, 1/λ) observations with sufficient statistics (n, x̄, s²), the Normal-Gamma prior (μ₀, κ₀, α₀, β₀) updates to posterior parameters: κₙ = κ₀ + n, μₙ = (κ₀μ₀ + nx̄)/κₙ, αₙ = α₀ + n/2, βₙ = β₀ + ½·Σ(xᵢ−x̄)² + κ₀n(x̄−μ₀)²/(2κₙ).',
          },
          {
            type: 'formula',
            latex: '\\kappa_n = \\kappa_0 + n, \\quad \\mu_n = \\frac{\\kappa_0\\mu_0 + n\\bar{x}}{\\kappa_n}, \\quad \\alpha_n = \\alpha_0 + \\tfrac{n}{2}, \\quad \\beta_n = \\beta_0 + \\tfrac{1}{2}\\sum(x_i-\\bar{x})^2 + \\frac{\\kappa_0 n(\\bar{x}-\\mu_0)^2}{2\\kappa_n}',
            label: 'Normal-Gamma posterior hyperparameters',
          },
        ],
      },
      {
        heading: 'Bernstein–von Mises Theorem',
        blocks: [
          {
            type: 'theorem',
            number: '7.5.2',
            title: 'Bernstein–von Mises (BvM) Theorem',
            text: 'Under regularity conditions and any prior π that is positive and continuous at the true θ₀, the total variation distance between the posterior π(·|s) and N(θ̂_n, 1/(n·I(θ₀))) converges to 0 in P_{θ₀}-probability. In other words, for large n the posterior concentrates around the MLE θ̂_n and has approximate normal shape regardless of the prior.',
          },
          {
            type: 'text',
            content:
              'The BvM theorem has two important consequences. First, Bayesian credible intervals are asymptotically equivalent to frequentist confidence intervals — the same interval serves both purposes for large n. Second, the prior information becomes asymptotically negligible: any two priors that are both positive at θ₀ lead to the same limiting posterior.',
          },
          {
            type: 'text',
            content:
              'The BvM theorem fails for: improper priors that put zero mass near θ₀, non-parametric models (infinite-dimensional θ), and misspecified models. In these cases Bayesian and frequentist inferences can diverge even for large samples.',
          },
        ],
      },
      {
        heading: 'Connections to Frequentist Inference',
        blocks: [
          {
            type: 'text',
            content:
              'Under the Normal approximation to the posterior, the 95% HPD credible interval is approximately θ̂ ± 1.96/√(nI(θ̂)), which coincides with the frequentist Wald confidence interval. The posterior mode equals the MLE; the posterior mean equals the MLE plus a bias correction term of order 1/n. For large samples these distinctions vanish.',
          },
          {
            type: 'text',
            content:
              'The Bayesian framework retains key advantages even asymptotically: it provides calibrated credible intervals with a direct probability interpretation, naturally handles hierarchical models, incorporates genuine prior information, and updates sequentially as data arrive without re-derivation of the sampling distribution.',
          },
        ],
      },
    ],
  },
];

export function getCh7ConceptById(id: string): ProbabilityConcept | undefined {
  return ch7Concepts.find(c => c.id === id);
}
