import type { ContentBlock, ConceptSection, ProbabilityConcept } from './probabilityConceptsData';

export type { ContentBlock, ConceptSection, ProbabilityConcept };

export const ch8Concepts: ProbabilityConcept[] = [

  // ─────────────────────────────────────────────
  // 8.1  Optimal Unbiased Estimation
  // ─────────────────────────────────────────────
  {
    id: 'optimal-unbiased-estimation',
    title: 'Optimal Unbiased Estimation',
    chapterRef: 'Chapter 8 · Section 8.1',
    description:
      'Among all unbiased estimators of ψ(θ), which has the smallest variance? The Rao-Blackwell theorem reduces variance by conditioning on a sufficient statistic; the Lehmann-Scheffé theorem identifies the unique UMVU via completeness; and the Cramér-Rao inequality provides a fundamental lower bound on variance.',
    sections: [
      {
        heading: 'Mean Squared Error Decomposition',
        blocks: [
          {
            type: 'text',
            content:
              'To compare estimators of ψ(θ), we use the mean squared error (MSE), which decomposes into variance and squared bias. For an unbiased estimator (bias = 0), MSE equals variance, so minimising MSE is equivalent to minimising variance. The goal is to find the unbiased estimator with the uniformly smallest variance — called the UMVU.',
          },
          {
            type: 'formula',
            latex: '\\mathrm{MSE}_\\theta(T) = \\mathrm{Var}_\\theta(T) + [\\mathrm{bias}_\\theta(T)]^2, \\quad \\mathrm{bias}_\\theta(T) = E_\\theta(T) - \\psi(\\theta)',
            label: 'MSE decomposition',
          },
          {
            type: 'theorem',
            number: '8.1.1',
            title: 'Minimum Variance Unbiased Estimator (UMVU)',
            text: 'An unbiased estimator T of ψ(θ) is uniformly minimum variance unbiased (UMVU) if Var_θ(T) ≤ Var_θ(T\') for every θ ∈ Ω and every other unbiased estimator T\' of ψ(θ).',
          },
        ],
      },
      {
        heading: 'Rao-Blackwell Theorem',
        blocks: [
          {
            type: 'theorem',
            number: '8.1.2',
            title: 'Rao-Blackwell Theorem',
            text: 'Let T be any unbiased estimator of ψ(θ) and U a sufficient statistic. Define T_U(s) = E_{P(·|U=U(s))}(T), the conditional expectation of T given U. Then: (1) T_U is unbiased for ψ(θ); (2) Var_θ(T_U) ≤ Var_θ(T) for all θ; (3) T_U depends on s only through U.',
          },
          {
            type: 'formula',
            latex: 'T_U(s) = E_{P(\\cdot\\,|\\,U = U(s))}(T), \\quad \\mathrm{Var}_\\theta(T_U) \\le \\mathrm{Var}_\\theta(T)',
            label: 'Rao-Blackwellization: conditioning on sufficient statistic',
          },
          {
            type: 'text',
            content:
              'The Rao-Blackwell theorem tells us we can restrict attention to estimators that are functions of the sufficient statistic U — conditioning on U can never increase variance. Geometrically, T_U is the projection of T onto the space of functions of U. By Jensen\'s inequality: Var_θ(T_U) = Var_θ(E[T|U]) ≤ E_θ(Var[T|U]) + Var_θ(E[T|U]) = Var_θ(T), with equality iff T = T_U a.s.',
          },
          { type: 'viz', vizId: 'viz-ch8-rao-blackwell' },
        ],
      },
      {
        heading: 'Completeness and Lehmann-Scheffé Theorem',
        blocks: [
          {
            type: 'definition',
            number: '8.1.1',
            title: 'Complete Statistic',
            text: 'A statistic U is complete for the model {P_θ : θ ∈ Ω} if E_θ(h(U)) = 0 for all θ ∈ Ω implies h(U) = 0 P_θ-a.s. for all θ. In other words, the only function of U that has mean zero for all θ is the zero function.',
          },
          {
            type: 'theorem',
            number: '8.1.5',
            title: 'Lehmann-Scheffé Theorem',
            text: 'If U is a complete sufficient statistic and T = g(U) is any unbiased estimator of ψ(θ) that is a function only of U, then T is the unique UMVU estimator of ψ(θ). In particular, the Rao-Blackwellization of any unbiased estimator with respect to a complete sufficient statistic yields the UMVU.',
          },
          {
            type: 'example',
            number: '8.1.6',
            title: 'Poisson UMVU for e^(−λ)',
            body: 'For n iid Poisson(λ) observations, the sufficient statistic is T = nX̄. The UMVU for e^(−λ) = P(X=0) is (1 − 1/n)^(nX̄). This is obtained by Rao-Blackwellizing the indicator 1_{X₁=0} on the complete sufficient statistic nX̄.',
          },
          {
            type: 'formula',
            latex: '\\text{UMVU for } e^{-\\lambda}: \\quad T^*(s) = \\left(1 - \\frac{1}{n}\\right)^{n\\bar{x}}',
            label: 'Poisson UMVU for P(X=0)',
          },
        ],
      },
      {
        heading: 'Cramér-Rao Inequality',
        blocks: [
          {
            type: 'theorem',
            number: '8.1.2 (Corollary)',
            title: 'Cramér-Rao Inequality',
            text: 'Under regularity conditions, for any unbiased estimator T of ψ(θ): Var_θ(T) ≥ (ψ\'(θ))² / I(θ), where I(θ) = E_θ[(∂/∂θ log f_θ(X))²] is the Fisher information. Equality holds iff the model is an exponential family and T is the natural sufficient statistic.',
          },
          {
            type: 'formula',
            latex: '\\mathrm{Var}_\\theta(T) \\ge \\frac{[\\psi\'(\\theta)]^2}{I(\\theta)}, \\quad I(\\theta) = E_\\theta\\!\\left[\\left(\\frac{\\partial}{\\partial\\theta}\\log f_\\theta(X)\\right)^2\\right]',
            label: 'Cramér-Rao lower bound',
          },
          {
            type: 'text',
            content:
              'The Cramér-Rao bound gives an absolute lower limit on the variance of any unbiased estimator. An estimator achieving this bound is called efficient. The sample mean x̄ achieves the CR bound for estimating μ in the Normal model (I(μ) = n/σ², CR bound = σ²/n = Var(x̄)). The CR bound shows that even the UMVU cannot do better than this fundamental limit.',
          },
          { type: 'viz', vizId: 'viz-ch8-cramer-rao' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 8.2  Optimal Hypothesis Testing
  // ─────────────────────────────────────────────
  {
    id: 'optimal-hypothesis-testing',
    title: 'Optimal Hypothesis Testing',
    chapterRef: 'Chapter 8 · Section 8.2',
    description:
      'The Neyman-Pearson framework seeks the most powerful test at a given size α. For simple vs simple hypotheses, the Neyman-Pearson theorem prescribes an optimal test based on the likelihood ratio. UMP tests extend this to composite hypotheses when the likelihood ratio is monotone.',
    sections: [
      {
        heading: 'Power Functions and Test Size',
        blocks: [
          {
            type: 'definition',
            number: '8.2.1',
            title: 'Test Function and Power',
            text: 'A test function φ: S → [0, 1] specifies the probability of rejecting H₀ when data s is observed. The power function is β_φ(θ) = E_θ(φ(s)). The size of φ is sup_{θ ∈ H₀} β_φ(θ). A UMP size-α test has β_φ(θ) ≥ β_ψ(θ) for all θ ∈ H_a and any other size-α test ψ.',
          },
          {
            type: 'formula',
            latex: '\\beta_\\varphi(\\theta) = E_\\theta(\\varphi(s)), \\quad \\text{size} = \\sup_{\\theta \\in H_0} \\beta_\\varphi(\\theta) \\le \\alpha',
            label: 'Power function and test size',
          },
          {
            type: 'text',
            content:
              'The Type I error rate is β_φ(θ) for θ ∈ H₀ (probability of rejecting a true null). The Type II error rate is 1 − β_φ(θ) for θ ∈ H_a (probability of failing to reject a false null). We control the maximum Type I error at size α, then among all tests of size α, choose the one that maximises power (minimises Type II errors).',
          },
        ],
      },
      {
        heading: 'Neyman-Pearson Theorem',
        blocks: [
          {
            type: 'theorem',
            number: '8.2.1',
            title: 'Neyman-Pearson Theorem (UMP for Simple Hypotheses)',
            text: 'For testing H₀: θ = θ₀ vs H_a: θ = θ₁, where Ω = {θ₀, θ₁}, the UMP size-α test is the likelihood ratio test: φ₀(s) = 1 if f_{θ₁}(s)/f_{θ₀}(s) > c₀, φ₀(s) = γ if equal to c₀, φ₀(s) = 0 otherwise; where c₀ ≥ 0 and γ ∈ [0,1] are chosen so that E_{θ₀}(φ₀) = α exactly.',
          },
          {
            type: 'formula',
            latex: '\\varphi_0(s) = \\begin{cases} 1 & f_{\\theta_1}(s)/f_{\\theta_0}(s) > c_0 \\\\ \\gamma & f_{\\theta_1}(s)/f_{\\theta_0}(s) = c_0 \\\\ 0 & f_{\\theta_1}(s)/f_{\\theta_0}(s) < c_0 \\end{cases}',
            label: 'Neyman-Pearson UMP test function',
          },
          {
            type: 'text',
            content:
              'The randomisation at c₀ (the γ term) ensures exact size α even for discrete distributions, where it is generally impossible to achieve exactly P_{θ₀}(reject) = α using a deterministic test. The likelihood ratio f_{θ₁}(s)/f_{θ₀}(s) measures how much more likely the data is under H_a than H₀.',
          },
          { type: 'viz', vizId: 'viz-ch8-neyman-pearson' },
        ],
      },
      {
        heading: 'UMP Tests and Power Functions',
        blocks: [
          {
            type: 'example',
            number: '8.2.2',
            title: 'One-sided z-test is UMP',
            body: 'For n iid N(μ, σ²) with σ² known, testing H₀: μ ≤ μ₀ vs H_a: μ > μ₀. The UMP size-α test rejects when x̄ ≥ μ₀ + σ₀z_{1-α}/√n. The power function β_φ(μ) = 1 − Φ((μ₀ − μ)/(σ₀/√n) + z_{1-α}) is increasing in μ. There is no UMP test for the two-sided problem H₀: μ = μ₀ vs H_a: μ ≠ μ₀.',
          },
          { type: 'viz', vizId: 'viz-ch8-power-function' },
          {
            type: 'definition',
            number: '8.2.3',
            title: 'Unbiased Test',
            text: 'A size-α test φ is unbiased if β_φ(θ) ≤ α when ψ(θ) = ψ₀ and β_φ(θ) ≥ α when ψ(θ) ≠ ψ₀. An unbiased test has the property that the probability of rejecting H₀ is always at least as large when H₀ is false as when it is true. For the two-sided Normal problem, the two-sided z-test is UMP unbiased.',
          },
          {
            type: 'text',
            content:
              'The generalised likelihood ratio test (GLRT) extends the Neyman-Pearson approach to composite hypotheses by using the ratio L(θ̂|s)/L(θ̂_{H₀}|s). Under H₀, 2 log(GLRT statistic) converges in distribution to χ²(dim Ω − dim H₀) as n → ∞. This provides an asymptotic test for general composite hypotheses.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 8.3  Optimal Bayesian Inferences
  // ─────────────────────────────────────────────
  {
    id: 'optimal-bayesian-inferences',
    title: 'Optimal Bayesian Inferences',
    chapterRef: 'Chapter 8 · Section 8.3',
    description:
      'Adding a prior distribution Π completes the Bayesian optimization problem: Bayes rules minimize the prior-averaged performance. For estimation with squared error loss, the Bayes rule is the posterior mean. For hypothesis testing with 0-1 loss, the Bayes rule compares posterior probabilities.',
    sections: [
      {
        heading: 'Bayes Rules for Estimation',
        blocks: [
          {
            type: 'text',
            content:
              'In Section 8.1 the frequentist optimization minimised MSE_θ(T) for each θ separately — a difficult problem with no guarantee of a solution. Adding a prior Π converts this to minimising the prior-averaged MSE: E_Π(MSE_θ(T)). The solution, called a Bayes rule, always exists under mild conditions.',
          },
          {
            type: 'formula',
            latex: 'E_\\Pi(\\mathrm{MSE}_\\theta(T)) = E_M\\!\\left(E_{\\Pi(\\cdot|s)}\\!\\left((T(s) - \\psi(\\theta))^2\\right)\\right)',
            label: 'Prior-averaged MSE via tower property',
          },
          {
            type: 'theorem',
            number: '8.3.1',
            title: 'Bayes Rule for Estimation (Squared Error)',
            text: 'When the prior-averaged MSE is finite, the Bayes rule for estimating ψ(θ) under squared error loss is T(s) = E_{Π(·|s)}(ψ(θ)) — the posterior expectation of ψ(θ). This minimises the expected posterior squared error E_{Π(·|s)}((T(s) − ψ(θ))²) for every s simultaneously.',
          },
          {
            type: 'formula',
            latex: 'T^*(s) = E_{\\Pi(\\cdot|s)}(\\psi(\\theta)) \\quad \\text{(Bayes rule for squared error loss)}',
            label: 'Posterior mean is the Bayes estimator',
          },
          { type: 'viz', vizId: 'viz-ch8-bayes-decision' },
          {
            type: 'text',
            content:
              'The key insight: rather than searching for an estimator with good frequentist properties for every θ, we average over θ with the prior. The posterior mean concentrates all the information: it is the unique minimiser of the posterior expected squared error. For the Beta-Bernoulli model, the Bayes estimator of θ is (α + Σxᵢ) / (α + β + n), a shrinkage of the MLE towards the prior mean.',
          },
        ],
      },
      {
        heading: 'Bayes Rules for Hypothesis Testing',
        blocks: [
          {
            type: 'theorem',
            number: '8.3.2',
            title: 'Bayes Rule for Hypothesis Testing (0-1 Loss)',
            text: 'The Bayes rule for the hypothesis testing problem H₀: ψ(θ) = ψ₀ with 0-1 loss is: reject H₀ (φ₀(s) = 1) when Π({ψ(θ) = ψ₀} | s) ≤ 1/2, and accept H₀ (φ₀(s) = 0) when Π({ψ(θ) = ψ₀} | s) > 1/2. That is, accept H₀ whenever the posterior probability of H₀ exceeds that of H_a.',
          },
          {
            type: 'formula',
            latex: '\\varphi_0(s) = \\begin{cases} 1 & \\Pi(\\{\\psi(\\theta)=\\psi_0\\}\\mid s) \\le \\tfrac{1}{2} \\\\ 0 & \\text{otherwise} \\end{cases}',
            label: 'Bayes test: reject when posterior probability of H₀ ≤ 1/2',
          },
          {
            type: 'text',
            content:
              'The Bayes rule for hypothesis testing has an intuitive interpretation: accept H₀ when the posterior probability that H₀ is true exceeds the posterior probability that H_a is true. Note that for this to be sensible, the prior must assign positive probability to H₀; if Π({ψ(θ) = ψ₀}) = 0, then the posterior probability of H₀ is also 0 for every s, and we would always reject.',
          },
          {
            type: 'text',
            content:
              'Summary: Bayesian decision theory always produces a solution to optimisation problems (unlike frequentist theory). For estimation, the Bayes rule is the posterior mean; for hypothesis testing, compare posterior probabilities. The Bayesian approach naturally handles complex loss functions and multi-parameter problems.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 8.4  Decision Theory (Advanced)
  // ─────────────────────────────────────────────
  {
    id: 'decision-theory',
    title: 'Decision Theory (Advanced)',
    chapterRef: 'Chapter 8 · Section 8.4',
    description:
      'Decision theory provides a general framework for statistical inference: an action space A, a loss function L(θ, a), a decision function δ, and a risk function R_δ(θ). Admissibility, Bayes risk, and minimax risk are the key optimality criteria.',
    sections: [
      {
        heading: 'Decision Theory Framework',
        blocks: [
          {
            type: 'text',
            content:
              'The decision theory model for inference consists of: (1) a statistical model {f_θ : θ ∈ Ω}; (2) an action space A of possible decisions; (3) a correct action function A: Ω → A; (4) a loss function L: Ω × A → [0, ∞) with L(θ, A(θ)) = 0; and (5) a decision function δ. The statistician observes data s, then selects an action from A according to δ.',
          },
          {
            type: 'definition',
            number: '8.4.1',
            title: 'Loss Function',
            text: 'A loss function L is defined on Ω × A, taking values in [0, ∞), with L(θ, a) = 0 if and only if a = A(θ). Common choices: squared error loss L(θ, a) = (ψ(θ) − a)², absolute error loss L(θ, a) = |ψ(θ) − a|, and 0-1 loss for hypothesis testing.',
          },
          {
            type: 'definition',
            number: '8.4.4',
            title: 'Risk Function',
            text: 'The risk function of a decision function δ is R_δ(θ) = E_θ(E_{δ(s,·)}(L(θ, a))), the average loss when θ is true and we use decision rule δ. For a deterministic (nonrandomised) decision function d: S → A, this simplifies to R_d(θ) = E_θ(L(θ, d(s))).',
          },
          {
            type: 'formula',
            latex: 'R_\\delta(\\theta) = E_\\theta\\!\\left(E_{\\delta(s,\\,\\cdot)}(L(\\theta, a))\\right)',
            label: 'Risk function of decision rule δ',
          },
          { type: 'viz', vizId: 'viz-ch8-risk-function' },
        ],
      },
      {
        heading: 'Admissibility, Bayes Risk, and Minimax',
        blocks: [
          {
            type: 'definition',
            number: '8.4.5',
            title: 'Admissible Decision Function',
            text: 'A decision function δ is admissible if there is no δ₀ such that R_{δ₀}(θ) ≤ R_δ(θ) for all θ and R_{δ₀}(θ) < R_δ(θ) for some θ. That is, no other decision function uniformly dominates δ.',
          },
          {
            type: 'definition',
            number: '8.4.6',
            title: 'Bayes Risk and Bayes Rule',
            text: 'The prior risk of δ is r_δ = E_Π(R_δ(θ)). The Bayes risk is min_{δ ∈ D} r_δ. A decision function achieving the Bayes risk is called a Bayes rule. Bayesian decision theory always produces an answer: the posterior mean (for squared error) or the MAP estimator.',
          },
          {
            type: 'definition',
            number: '8.4.7',
            title: 'Minimax Decision Function',
            text: 'A decision function δ₀ is minimax if max_{θ ∈ Ω} R_{δ₀}(θ) = min_{δ ∈ D} max_{θ ∈ Ω} R_δ(θ). A minimax rule minimises the worst-case (maximum) risk over all θ. For the normal location model, x̄ is both the UMVU and the minimax estimator.',
          },
          {
            type: 'text',
            content:
              'The relationship between Bayes and minimax rules: if a Bayes rule δ_Π has constant risk R_{δ_Π}(θ) = c for all θ, then δ_Π is minimax. Typically, no single optimal decision function exists, so we use reduction criteria (size-α tests, admissibility) or ordering criteria (Bayes risk, minimax risk) to select among decision functions.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 8.5  Further Proofs (Advanced)
  // ─────────────────────────────────────────────
  {
    id: 'optimal-inferences-proofs',
    title: 'Further Proofs (Advanced)',
    chapterRef: 'Chapter 8 · Section 8.5',
    description:
      'Rigorous proofs of the foundational theorems: sufficiency characterisation via conditional independence (Theorem 8.1.2), completeness of x̄ in the Normal model using moment-generating functions, and the Neyman-Pearson theorem (Theorem 8.2.1) in the discrete case.',
    sections: [
      {
        heading: 'Proof of Sufficiency Characterisation',
        blocks: [
          {
            type: 'theorem',
            number: '8.1.2',
            title: 'Sufficiency via Conditional Independence',
            text: 'A statistic U is sufficient for {P_θ : θ ∈ Ω} if and only if the conditional distribution of the data s given U = u is the same for every θ. That is, P_θ(s | U = u) does not depend on θ.',
          },
          {
            type: 'text',
            content:
              'Proof (discrete case). If U is sufficient, the factorisation theorem gives f_θ(s) = h(s)g_θ(U(s)). For s₁ ∈ U^{-1}{u}: P_θ(s = s₁ | U = u) = f_θ(s₁) / P_θ(U = u) = h(s₁)g_θ(u) / Σ_{s ∈ U^{-1}{u}} h(s)g_θ(u) = h(s₁) / Σ h(s), which is independent of θ. The converse follows by taking s₂ as a reference point in U^{-1}{u} and writing f_θ(s₁) = [P_θ(s₁|U=u)/P_θ(s₂|U=u)] f_θ(s₂), establishing the factorisation.',
          },
        ],
      },
      {
        heading: 'Completeness of x̄ in the Normal Model',
        blocks: [
          {
            type: 'text',
            content:
              'For n iid N(μ, σ₀²) with μ ∈ ℝ and σ₀² known, the sample mean x̄ is a complete sufficient statistic. The proof uses moment-generating functions: suppose E_μ(h(x̄)) = 0 for all μ. Writing h = h⁺ − h⁻ (positive and negative parts) and c⁺(μ) = E_μ(h⁺(x̄)), the condition c⁺(μ) = c⁻(μ) for all μ implies the MGFs of two probability distributions (g⁺/∫g⁺ and g⁻/∫g⁻) are identical, hence they are equal. This forces h(x̄) = 0 a.s., establishing completeness.',
          },
          {
            type: 'formula',
            latex: 'E_\\mu(h(\\bar{X})) = \\exp(-n\\mu^2/2\\sigma_0^2)\\int_{-\\infty}^\\infty \\exp\\!\\left(\\frac{n\\mu\\bar{x}}{\\sigma_0^2}\\right)g^+(\\bar{x})\\,d\\bar{x}',
            label: 'MGF argument for completeness of x̄',
          },
        ],
      },
      {
        heading: 'Proof of the Neyman-Pearson Theorem',
        blocks: [
          {
            type: 'text',
            content:
              'We prove that φ₀ (the likelihood ratio test) is UMP size α. First, by construction E_{θ₀}(φ₀) = α. Now let φ be any other size-α test. Partition S = S₀ ∪ S₁ ∪ S₂ where S₀ = {φ₀ = φ}, S₁ = {φ₀ < φ}, and S₂ = {φ₀ > φ}.',
          },
          {
            type: 'text',
            content:
              'On S₁: φ₀(s) − φ(s) < 0, and the likelihood ratio f_{θ₁}(s)/f_{θ₀}(s) ≤ c₀ (since φ₀(s) < 1 requires ratio ≤ c₀). On S₂: φ₀(s) − φ(s) > 0, and the ratio ≥ c₀. In both cases, (φ₀(s) − φ(s)) · f_{θ₁}(s) ≥ c₀ · (φ₀(s) − φ(s)) · f_{θ₀}(s). Integrating: E_{θ₁}(φ₀ − φ) ≥ c₀ E_{θ₀}(φ₀ − φ) = c₀(α − E_{θ₀}(φ)) ≥ 0, so E_{θ₁}(φ₀) ≥ E_{θ₁}(φ), proving φ₀ is UMP.',
          },
          {
            type: 'formula',
            latex: '0 \\le E_{\\theta_1}(\\varphi_0) - E_{\\theta_1}(\\varphi) \\ge c_0\\bigl(E_{\\theta_0}(\\varphi_0) - E_{\\theta_0}(\\varphi)\\bigr) = c_0(\\alpha - E_{\\theta_0}(\\varphi)) \\ge 0',
            label: 'Neyman-Pearson proof: φ₀ maximises power',
          },
        ],
      },
    ],
  },
];

export function getCh8ConceptById(id: string): ProbabilityConcept | undefined {
  return ch8Concepts.find(c => c.id === id);
}
