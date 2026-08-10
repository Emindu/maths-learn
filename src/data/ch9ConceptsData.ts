import type { ContentBlock, ConceptSection, ProbabilityConcept } from './probabilityConceptsData';

export type { ContentBlock, ConceptSection, ProbabilityConcept };

export const ch9Concepts: ProbabilityConcept[] = [

  // ─────────────────────────────────────────────
  // 9.1  Checking the Sampling Model
  // ─────────────────────────────────────────────
  {
    id: 'checking-sampling-model',
    title: 'Checking the Sampling Model',
    chapterRef: 'Chapter 9 · Section 9.1',
    description:
      'Every inference method in Chapters 6 through 8 assumes the data came from the model {f_θ : θ ∈ Ω}. Model checking assesses whether that assumption is plausible, using discrepancy statistics and P-values, ancillary statistics, and — more informally — residual and normal probability plots.',
    hook: 'You can never prove a model is correct — only fail to find evidence that it is wrong. Model checking is the discipline of actively trying to break that assumption before trusting any inference built on top of it.',
    sections: [
      {
        heading: 'Discrepancy Statistics and Ancillary Statistics',
        blocks: [
          {
            type: 'text',
            content:
              'All statistical methodology rests on assumptions or choices made by the analyst, and these must be checked if we want to feel confident that our inferences are relevant. We call this process model checking. Except in rare circumstances, we can never know categorically that a model is correct — the most we can hope for is to assess whether or not the observed data s could plausibly have arisen from it.',
          },
          {
            type: 'text',
            content:
              'If the observed data are surprising under every distribution in the model, that is evidence the model is incorrect. This leads naturally to computing a [[inferences-based-on-mle|P-value]] to check correctness: the null hypothesis is that the model is correct, and the alternative is that it is not. As with any P-value, we must be careful — with a large enough sample, essentially any reasonable check will detect some deviation, so the real question is whether the size of that deviation actually matters for the application.',
          },
          {
            type: 'text',
            content:
              'One P-value approach specifies a discrepancy statistic D : S → ℝ that measures deviation from the model. Large values of D are meant to indicate a deviation has occurred, but the raw value D(s) only matters relative to how surprising it is under the model — so we ask whether D(s) falls in a region of low probability for the distribution of D when the model is correct. A discrepancy statistic can even have a bimodal sampling distribution: a value far in either tail, or awkwardly stuck in a low-probability valley between two modes, is equally strong evidence against the model.',
          },
          {
            type: 'text',
            content:
              'This approach requires D to have a single distribution when the model is correct — that distribution cannot depend on θ. For commonly used discrepancy statistics this distribution is unimodal: a value in the right tail indicates underfitting (the discrepancies are unnaturally large), while a value in the left tail indicates overfitting (the discrepancies are unnaturally small). There are two general routes to obtaining this single reference distribution.',
          },
          {
            type: 'definition',
            number: '9.1.1',
            title: 'Ancillary Statistic',
            text: 'A statistic D whose distribution under the model does not depend upon θ is called ancillary, i.e., if s ∼ P_θ, then D(s) has the same distribution for every θ ∈ Ω.',
          },
          {
            type: 'text',
            content:
              'If D is ancillary, it has a single distribution specified entirely by the model, and a surprising value of D(s) is evidence against the model. Not every ancillary D is useful, however — a constant is ancillary but tells us nothing. Useful ancillary statistics are often found by looking at residuals: the information left over in the data after the model has been fit. If we have used all the relevant information in fitting, the residuals should contain no further information about θ, which is exactly what makes them ancillary and well suited to model checking.',
          },
          {
            type: 'text',
            content:
              'The second route works with any discrepancy statistic D, ancillary or not, by using its conditional distribution given the value of a [[optimal-unbiased-estimation|sufficient statistic]] T. By the sufficiency characterisation (Theorem 8.1.2), this conditional distribution is the same for every θ, so a surprising D(s) under it is again evidence against the model. The two approaches usually agree when D depends on the data only through an ancillary residual, but not always — the following examples explore both.',
          },
          {
            type: 'example',
            number: '9.1.1',
            title: 'Location Normal',
            body:
              'Suppose (x₁,…,xₙ) is a sample from an N(μ, σ₀²) distribution with μ unknown and σ₀² known. The sample mean x̄ is minimal sufficient, and it represents the model\'s fit to the data. Define the residual r = (x₁ − x̄, …, xₙ − x̄). The data can be reconstructed from x̄ and r, and R = (X₁ − X̄, …, Xₙ − X̄) has a distribution independent of μ, with E(Rᵢ) = 0 and Cov(Rᵢ, Rⱼ) = σ₀²(δᵢⱼ − 1/n) — so R is ancillary, and independent of X̄ itself.',
          },
          {
            type: 'formula',
            latex: 'D(R) = \\frac{1}{\\sigma_0^2}\\sum_{i=1}^{n} R_i^2 = \\frac{1}{\\sigma_0^2}\\sum_{i=1}^{n} (X_i - \\bar{X})^2 \\;\\sim\\; \\chi^2(n-1)',
            label: 'Discrepancy statistic for the location Normal model',
          },
          {
            type: 'formula',
            latex: 'P\\text{-value} = P\\bigl(D > D(r)\\bigr), \\quad D \\sim \\chi^2(n-1) \\tag{9.1.1}',
            label: 'P-value for checking the location Normal model',
          },
          {
            type: 'text',
            content:
              'Because r is ancillary and D depends on the data only through r, the two approaches to obtaining a P-value agree here. Values of (9.1.1) near 0 or near 1 are both evidence against the model: near 0 means D(r) is in the right tail (the data are more spread out than an N(μ, σ₀²) predicts); near 1 means D(r) is in the left tail — e.g. if we are actually sampling from N(μ, σ²) with σ² ≪ σ₀², then E(D(R)) = (n − 1)σ²/σ₀² is small, pushing D(r) into the left tail. One important caution applies throughout: the choice of D cannot be based on having already looked at the data, since doing so invalidates the P-value computed as above.',
          },
          {
            type: 'example',
            number: '9.1.2',
            title: 'Location-Scale Normal',
            body:
              'Suppose (x₁,…,xₙ) is a sample from N(μ, σ²) with (μ, σ²) both unknown, so that (x̄, s²) is minimal sufficient. Define the residual r = ((x₁ − x̄)/s, …, (xₙ − x̄)/s); again the data can be reconstructed from (x̄, s²) and r. This R has a distribution independent of (μ, σ²) — so it is ancillary — and is independent of (X̄, S²) as well, so the two approaches to a P-value again agree for any discrepancy statistic depending on the data only through r.',
          },
          {
            type: 'formula',
            latex: 'D(r) = -\\frac{1}{n}\\sum_{i=1}^{n} \\ln\\!\\left(\\frac{r_i^2}{n-1}\\right)',
            label: 'One possible discrepancy statistic based on the location-scale residual',
          },
          {
            type: 'text',
            content:
              'Unlike D(R) in Example 9.1.1, this statistic has no simple named distribution, so we obtain it by simulation: because the distribution of D(R) does not depend on (μ, σ²), we can simulate N samples of size n from N(0,1), compute D(R) for each, and compare the observed D(r) against the resulting histogram. For the observed sample −2.08, −0.28, 2.01, −1.37, 40.08, we get D(r) = 4.93; simulating 10⁴ values under the model puts D(r) out in the right tail, with only 0.0057 of the simulated values larger — definite evidence against Normality (driven by the extreme outlier 40.08). Other useful choices include the skewness statistic D_skew(r) = (n − 1)^(−3/2) Σrᵢ³ and the kurtosis statistic D_kurtosis(r) = (n − 1)^(−2) Σrᵢ⁴, simulated and compared the same way.',
          },
          {
            type: 'example',
            number: '9.1.3',
            title: 'Location-Scale Cauchy',
            body:
              'Suppose (x₁,…,xₙ) is a sample from μ + σZ where Z ∼ t(1) (the standard Cauchy) and (μ, σ²) is unknown. Here (x̄, s²) is no longer minimal sufficient, but the residual r from Example 9.1.2 is still ancillary. We can again estimate P-values for discrepancy statistics such as D(r) by simulation — this time generating samples from t(1) instead of N(0,1) and computing r for each simulated sample.',
          },
          {
            type: 'example',
            number: '9.1.4',
            title: "Fisher's Exact Test",
            body:
              'Sample n students and record (aᵢ, bᵢ): gender A ∈ {1,2} and part-time employment status B ∈ {1,2}, giving four categories. If A and B are independent with P(A=1) = α₁ and P(B=1) = β₁ unknown, then the cell counts satisfy (X₁₁, X₁₂, X₂₁, X₂₂) ∼ Multinomial(n, α₁β₁, α₁β₂, α₂β₁, α₂β₂). The MLE is (α̂₁, β̂₁) = (x₁·/n, x·₁/n), and because these determine and are determined by the likelihood, (x₁·, x·₁) is minimal sufficient.',
          },
          {
            type: 'text',
            content:
              'A natural residual is not readily apparent here, so we instead condition on the minimal sufficient statistic. Given (x₁·, x·₁), the conditional distribution of x₁₁ is Hypergeometric(n, x₁·, x·₁): P(x₁₁ = i | x₁·, x·₁) = C(x₁·, i)·C(n − x₁·, x·₁ − i) / C(n, x·₁). We have evidence against independence whenever x₁₁ lies in the tails of this distribution.',
          },
          {
            type: 'text',
            content:
              'As a numerical example, take n = 20 students with x·₁ = 12 unemployed, x₁· = 6 males, and x₁₁ = 2 employed males. The Hypergeometric(20, 12, 6) probability function is:',
          },
          {
            type: 'formula',
            latex: '\\begin{array}{c|ccccccc} i & 0 & 1 & 2 & 3 & 4 & 5 & 6 \\\\ \\hline p(i) & 0.001 & 0.017 & 0.119 & 0.318 & 0.358 & 0.163 & 0.024 \\end{array}',
            label: 'Hypergeometric(20, 12, 6) probability function',
          },
          {
            type: 'text',
            content:
              'The P-value is the probability of a value at least as far out in the tails as x₁₁ = 2, namely (0.119 + 0.017 + 0.001) + 0.024 = 0.161 — no evidence against independence, though the sample here is quite small. (An alternative approach only assumes independence of the unclassified sample and tests independence of A and B directly via the Multinomial(n, α₁₁, α₁₂, α₂₁, α₂₂) model — see the discussion of categorical independence testing in Chapter 10.)',
          },
        ],
      },
      {
        heading: 'Residual and Probability Plots',
        blocks: [
          {
            type: 'text',
            content:
              'Alongside formal P-values, a more informal — but often more revealing — family of methods plots the residuals directly. These plots lack the rigor of a P-value but are very good at exposing gross departures from the model\'s assumptions. Standardizing the residuals from Example 9.1.1 to have variance 1 gives:',
          },
          {
            type: 'formula',
            latex: 'r_i^{\\star} = \\sqrt{\\frac{n}{\\sigma_0^2(n-1)}}\\,(x_i - \\bar{x}) \\tag{9.1.3}',
            label: 'Standardized residuals — location Normal model',
          },
          {
            type: 'text',
            content:
              'The standardized residuals are distributed N(0,1), and for reasonably large n they are approximately independent, so (r₁⋆,…,rₙ⋆) can be treated as an approximate sample from N(0,1). A plot of the points (i, rᵢ⋆) should then show no discernible pattern, with essentially all values inside (−3, 3). A visible pattern, or several extreme values, is evidence the model assumption is wrong — though it always helps to simulate a few samples from the assumed model first to get a feel for how much apparent pattern is just sampling variability.',
          },
          {
            type: 'text',
            content:
              'The qualitative signature differs by the kind of model failure: a genuine N(0,1) sample gives a patternless scatter fully inside (−3, 3). A sample from a heavier-tailed distribution — e.g. 3^(−1/2)Z with Z ∼ [[normal-distribution-theory|t(3)]], which also has mean 0 and variance 1 — shows a similar scatter but with a handful of points venturing outside (−3, 3), since the t(3) distribution has only two finite moments and much longer tails than the Normal. A sample from a skewed distribution such as Exponential(1) instead shows a lopsided pattern of mostly-positive, occasionally very large residuals, reflecting the right-skewness that a symmetric Normal model cannot capture.',
          },
          {
            type: 'formula',
            latex: 'r_i^{\\star} = \\sqrt{\\frac{n}{s^2(n-1)}}\\,(x_i - \\bar{x}) \\tag{9.1.4}',
            label: 'Standardized residuals — location-scale Normal model (variance estimated by s²)',
          },
          {
            type: 'text',
            content:
              'For the location-scale Normal model of Example 9.1.2, the unknown variance is instead estimated by s², giving (9.1.4). Again, for large n the values (r₁⋆,…,rₙ⋆) form an approximate N(0,1) sample and are plotted and interpreted exactly as for the location Normal model.',
          },
          {
            type: 'text',
            content:
              'A second, closely related diagnostic is the probability plot. If (x₁,…,xₙ) is a sample from N(μ, σ²) and n is large, the i-th order statistic satisfies E(X₍ᵢ₎) ≈ μ + σΦ⁻¹(i/(n+1)). If a data value xⱼ corresponds to order statistic x₍ᵢ₎, we call Φ⁻¹(i/(n+1)) the normal score of xⱼ. Then the points (x₍ᵢ₎, Φ⁻¹(i/(n+1))) should lie approximately on a line with intercept μ and slope σ — this is the normal probability plot (or normal quantile plot); similar plots exist for other reference distributions.',
          },
          {
            type: 'formula',
            latex: 'E(X_{(i)}) \\approx \\mu + \\sigma\\,\\Phi^{-1}\\!\\bigl(i/(n+1)\\bigr) \\tag{9.1.5}',
            label: 'Expected order statistic under a Normal model',
          },
          {
            type: 'example',
            number: '9.1.6',
            title: 'Location-Scale Normal',
            body:
              'Assess whether the sample 2.00, 0.28, 0.47, 3.33, 1.66, 8.17, 1.18, 4.15, 6.43, 1.77 (n = 10) could plausibly be Normal. The order statistics and their normal scores are:',
          },
          {
            type: 'formula',
            latex: '\\begin{array}{c|cccccccccc} i & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9 & 10 \\\\ \\hline x_{(i)} & 0.28 & 0.47 & 1.18 & 1.66 & 1.77 & 2.00 & 3.33 & 4.15 & 6.43 & 8.17 \\\\ \\Phi^{-1}(i/(n+1)) & -1.34 & -0.91 & -0.61 & -0.35 & -0.12 & 0.11 & 0.34 & 0.60 & 0.90 & 1.33 \\end{array}',
            label: 'Order statistics and normal scores for Example 9.1.6',
          },
          {
            type: 'text',
            content:
              'Plotting (x₍ᵢ₎, Φ⁻¹(i/(n+1))) shows some definite deviation from a straight line, but with only n = 10 points it is genuinely hard to tell whether this is unusual for a true Normal sample — again, simulating a few same-size samples from N(0,1) and eyeballing their probability plots is the recommended check. Doing so here, the plot looks reasonable, i.e. not obviously worse than what pure sampling variability alone would produce.',
          },
          {
            type: 'text',
            content:
              'Assuming n is large enough that the standardized residuals (9.1.3) or (9.1.4) can be treated as an approximate N(0,1) sample, a normal probability plot of the standardized residuals should itself be approximately linear with y-intercept ≈ 0 and slope ≈ 1; a substantial deviation from this is evidence the assumed model is incorrect. Comparing such plots for a genuine N(0,1) sample against one from 3^(−1/2)t(3) — both mean 0, variance 1 — shows visibly heavier, more scattered tails at the plot\'s extremes for the t(3) case, purely from the difference in tail behaviour between the two distributions. We will see in Chapter 10 that normal probability plots of standardized residuals play a major role in model checking for more complicated models.',
          },
        ],
      },
    ],
  },

];

export function getCh9ConceptById(id: string): ProbabilityConcept | undefined {
  return ch9Concepts.find(c => c.id === id);
}
