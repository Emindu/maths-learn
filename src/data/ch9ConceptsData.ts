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
      {
        heading: 'The Chi-Squared Goodness of Fit Test',
        blocks: [
          {
            type: 'text',
            content:
              'The chi-squared goodness of fit test has an important historical place in model checking. It assesses whether a categorical random variable W, taking values in a finite sample space {1,…,k}, has a specified probability measure P, based on an observed sample (w₁,…,wₙ). A discrete variable with infinitely many values is handled by partitioning into k categories; a quantitative variable is handled by partitioning ℝ into k subintervals and letting W record which one occurred.',
          },
          {
            type: 'text',
            content:
              'Let (X₁,…,Xₖ) be the observed counts of 1,…,k. If P is correct, then (X₁,…,Xₖ) ∼ Multinomial(n, p₁,…,pₖ) with pᵢ = P({i}), so E(Xᵢ) = npᵢ and Var(Xᵢ) = npᵢ(1 − pᵢ). This gives standardized counts that converge to N(0,1):',
          },
          {
            type: 'formula',
            latex: 'R_i = \\frac{X_i - np_i}{\\sqrt{np_i(1-p_i)}} \\xrightarrow{D} N(0,1) \\tag{9.1.6}',
            label: 'Standardized cell counts',
          },
          {
            type: 'text',
            content:
              'For finite n the distribution of Rᵢ depends on P, but the limiting N(0,1) distribution does not — so for large n the Rᵢ behave like standardized residuals. A natural discrepancy statistic is then ΣRᵢ², which would be approximately χ²(k) if the Rᵢ were independent — but the constraint x₁ + ⋯ + xₖ = n means they are not, so the limit is not χ²(k). The correct result, which nonetheless gives a similar discrepancy statistic, is:',
          },
          {
            type: 'theorem',
            number: '9.1.1',
            text: 'If (X₁,…,Xₖ) ∼ Multinomial(n, p₁,…,pₖ), then X² = Σᵢ₌₁ᵏ (1 − pᵢ)Rᵢ² = Σᵢ₌₁ᵏ (Xᵢ − npᵢ)²/(npᵢ) →^D χ²(k − 1) as n → ∞.',
          },
          {
            type: 'text',
            content:
              'We call X² the chi-squared statistic, and the process of computing the P-value P(X² ≥ X₀²) — where X₀² is the observed value and X² ∼ χ²(k − 1) — the chi-squared goodness of fit test. Small P-values near 0 are evidence the probability model is incorrect. Note that the i-th term of X² can be written suggestively as (number in the i-th cell − expected number in the i-th cell)² / expected number in the i-th cell. It is recommended (e.g. Snedecor and Cochran) that cells be grouped so that E(Xᵢ) = npᵢ ≥ 1 for every i, as this improves the accuracy of the χ² approximation to the true P-value.',
          },
          {
            type: 'example',
            number: '9.1.7',
            title: 'Testing the Accuracy of a Random Number Generator',
            body:
              'Every Monte Carlo simulation is built on a stream U₁, U₂,… meant to be i.i.d. Uniform[0, 1], typically produced by iterating some function f. A poor choice of f can badly distort simulation results, so it is worth testing whether a given generator behaves as an i.i.d. Uniform[0,1] sequence should. Since ⌈10U₁⌉, ⌈10U₂⌉,… is i.i.d. Uniform{1,…,10} whenever the Uᵢ are, we can generate n = 10⁴ values, set xᵢ = ⌈10Uᵢ⌉, and run a chi-squared goodness of fit test against the 10 categories {1,…,10}, each with probability 1/10.',
          },
          {
            type: 'formula',
            latex: '\\begin{array}{c|cccccccccc} i & 1 & 2 & 3 & 4 & 5 & 6 & 7 & 8 & 9 & 10 \\\\ \\hline x_i & 993 & 1044 & 1061 & 1021 & 1017 & 973 & 975 & 965 & 996 & 955 \\\\ r_i & -0.233 & 1.467 & 2.033 & 0.700 & 0.567 & -0.900 & -0.833 & -1.167 & -0.133 & -1.500 \\end{array}',
            label: 'Counts and standardized residuals for a generator tested with n = 10⁴',
          },
          {
            type: 'text',
            content:
              'All ten standardized residuals look like reasonable N(0,1) values. Summing (1 − 0.1)rᵢ² over the table gives X₀² = 11.0560, and P(X² ≥ 11.0560) = 0.27190 for X² ∼ χ²(9) — no evidence that this random number generator is defective. (A full audit would go further, e.g. testing joint frequencies of pairs (i, j) to check independence of successive draws — the story rarely ends with a single check.)',
          },
          {
            type: 'text',
            content:
              'More generally, we may not have a fully specified P, only a statistical model {Pθ : θ ∈ Ω} with pᵢ(θ) = Pθ({i}). A natural way to assess fit is to find the [[maximum-likelihood-estimation|MLE]] θ̂ from L(θ | x₁,…,xₖ) = p₁(θ)ˣ¹⋯pₖ(θ)ˣᵏ and then look at the plug-in standardized residuals rᵢ(θ̂) = (xᵢ − npᵢ(θ̂)) / √(npᵢ(θ̂)(1 − pᵢ(θ̂))).',
          },
          {
            type: 'theorem',
            number: '9.1.2',
            text: 'Under regularity conditions (similar to those for the MLE asymptotics of Section 6.5), Rᵢ(θ̂) →^D N(0,1) and X² = Σᵢ₌₁ᵏ (1 − pᵢ(θ̂))Rᵢ²(θ̂) = Σᵢ₌₁ᵏ (Xᵢ − npᵢ(θ̂))²/(npᵢ(θ̂)) →^D χ²(k − 1 − dim Ω) as n → ∞, where dim Ω is the dimension of the parameter space (loosely, the minimum number of coordinates needed to specify a point in Ω — a line needs one, a plane in ℝ³ needs two, etc.). This forces the requirement k > 1 + dim Ω.',
          },
          {
            type: 'example',
            number: '9.1.8',
            title: 'Testing for Exponentiality',
            body:
              'A sample of light-bulb lifelengths (in thousands of hours) is assumed Exponential(θ), θ ∈ (0,∞), so dim Ω = 1 and we need at least two cells. Using manufacturer expectations, partition (0,∞) = (0,1] ∪ (1,2] ∪ (2,3] ∪ (3,∞). For n = 30 bulbs the counts were x₁ = 5, x₂ = 16, x₃ = 8, x₄ = 1, giving likelihood L(θ|x) = (1 − e⁻ᶿ)⁵(e⁻ᶿ − e⁻²ᶿ)¹⁶(e⁻²ᶿ − e⁻³ᶿ)⁸(e⁻³ᶿ)¹. Plotting the log-likelihood over successively smaller intervals gives θ̂ = 0.603535.',
          },
          {
            type: 'text',
            content:
              'This MLE yields fitted probabilities p₁(θ̂) = 0.453125, p₂(θ̂) = 0.247803, p₃(θ̂) = 0.135517, p₄(θ̂) = 0.163555 — fitted counts 13.594, 7.434, 4.066, 4.907 — and standardized residuals r₁(θ̂) = −3.152, r₂(θ̂) = 3.622, r₃(θ̂) = 2.099, r₄(θ̂) = −1.928. Two of these already look large. Summing (1 − pᵢ(θ̂))rᵢ(θ̂)² gives X₀² = 22.221, and P(X² ≥ 22.221) = 0.0000 for X² ∼ χ²(2) — strong evidence that the Exponential(θ) model is not correct for these data, and we would not use it for inference about θ. Crucially, the MLE used here came from the grouped count data, not the raw sample; using the raw-sample MLE (here, simply x̄) would invalidate Theorem 9.1.2.',
          },
          {
            type: 'text',
            content:
              'The chi-squared goodness of fit test is just one of many discrepancy statistics proposed for model checking — the general recipe is to pick a D whose exact or asymptotic distribution is known and independent of θ, then compute a P-value from it. The Kolmogorov–Smirnov test and the Cramér–von Mises test are further examples built this way, though we do not discuss them here.',
          },
        ],
      },
      {
        heading: 'Prediction, Cross-Validation, and What to Do When a Model Fails',
        blocks: [
          {
            type: 'text',
            content:
              'Perhaps the most rigorous test a scientific model can face is how well it predicts new data after being fit — indeed, this is a crucial step in accepting any empirically developed theory. If a model does not predict new data well, that is evidence against it: an overly simple model will underfit both the observed and future data, while an overly complex model will overfit the original data and be exposed only once new data arrive.',
          },
          {
            type: 'text',
            content:
              'Since we typically cannot wait for genuinely new data, statisticians use cross-validation instead: split an original data set x₁,…,xₙ into a training set T of k values (used to fit the model) and a validation set V of the remaining n − k values, then use discrepancies between T-based predictions and the actual V values to assess whether V is surprising as a future sample from the fitted model. There are C(n, k) possible such splits, so a serious cross-validational analysis cannot rely on just one — it must also settle on a discrepancy measure and a choice of k, questions we do not pursue further here.',
          },
          {
            type: 'text',
            content:
              'Suppose model checking leads us to reject an assumed model — what then? There is no guaranteed recipe, but one simple and often effective technique is the method of transformations. For example, if y₁,…,yₙ is a sample from Y = exp(X) with X ∼ N(μ, σ²), a normal probability plot of the raw yᵢ will detect the nonnormality of Y, but the transformed values ln yᵢ will typically produce a reasonable-looking normal probability plot — since ln Y = X is Normal by construction. We will see further applications of this idea in Chapter 10.',
          },
          {
            type: 'text',
            content:
              'The most commonly applied transformation is the logarithm, when the data are positive — a necessity for this transform. Another common choice for count data is the square-root transformation (a power transformation Yᵖ with p = 1/2); power transformations Yᵖ for other p ≠ 0 are also used. It is not correct, however, to keep trying transformation after transformation until the probability or residual plots happen to look acceptable — that is exactly the kind of data snooping the P-value caution in Section 9.1.1 warns against. Instead, try a small number of simple, well-motivated transformations.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 9.2  Checking for Prior–Data Conflict
  // ─────────────────────────────────────────────
  {
    id: 'checking-prior-data-conflict',
    title: 'Checking for Prior–Data Conflict',
    chapterRef: 'Chapter 9 · Section 9.2',
    description:
      'A Bayesian model can fail in two distinct ways: the sampling model {Pθ} may be wrong (Section 9.1 handles this), or — even when it is right — the prior may put most of its mass on values of θ for which the observed data are surprising. This section develops a prior predictive check for that second failure mode.',
    hook: 'A textbook-correct sampling model does not save you from a prior that is confidently looking in the wrong place. Prior–data conflict is the check most Bayesian analyses skip — and the one most likely to quietly wreck the posterior.',
    sections: [
      {
        heading: 'Prior Predictive Checking',
        blocks: [
          {
            type: 'text',
            content:
              'Bayesian methodology adds a prior probability measure Π to the statistical model {Pθ : θ ∈ Ω}. Adding the prior amounts to assigning a prior predictive probability M(A) = E_Π(Pθ(A)) for A ⊂ Ω to describe the process generating the data. A natural Bayesian model check compares the observed data s against the distribution given by M, to see if it is surprising.',
          },
          {
            type: 'text',
            content:
              'One caution: if s turns out to be surprising under M, that only tells us M is unlikely to have produced the data — not that the sampling model {Pθ : θ ∈ Ω} itself is wrong. The following example shows the two checks can genuinely disagree.',
          },
          {
            type: 'example',
            number: '9.2.1',
            title: 'Prior–Data Conflict',
            body:
              'Suppose we observe n = 20 values, all equal to s = 1, from a model with Ω = {1, 2} and P(s=1) given by f₁ = 0.1, f₂ = 0.9. The probability of this sample under f₂ is (0.9)²⁰ = 0.12158, a perfectly reasonable value — no evidence against the sampling model {f₁, f₂}. Now place a prior with Π({1}) = 0.9999 — virtually certain that θ = 1. The prior predictive probability of these data is M = (0.9999)(0.1)²⁰ + (0.0001)(0.9)²⁰ = 1.2158 × 10⁻⁵, and the probability of a sample of 20 at least this surprising under M works out to about 0.04.',
          },
          {
            type: 'text',
            content:
              'So checking {f₁, f₂} directly concludes the model is entirely plausible for these data, while checking M concludes the Bayesian model (sampling model plus this prior) is implausible — a genuine prior–data conflict, driven entirely by a prior that was very confident about the wrong value of θ.',
          },
          {
            type: 'text',
            content:
              'The lesson: a Bayesian model can fail in two ways. First, the data s may be surprising under {fθ : θ ∈ Ω} itself (Section 9.1 methods apply). Second, even when the data are plausible under this model, the prior and the data may conflict — this happens whenever the prior assigns most of its probability to distributions in the model for which the data are surprising. If the prior has positive density (or probability) everywhere, the [[bayesian-asymptotics|consistency results for Bayesian inference]] mean a large amount of data will eventually overwhelm any prior–data conflict — so its existence does not automatically mean the resulting inferences are wrong. Still, it is useful to know whether a conflict exists, since it is often hard to tell whether the data at hand are already "enough" to make it harmless. The recommended order is: first apply the Section 9.1 checks to the sampling model; only once those pass do we look for prior–data conflict.',
          },
        ],
      },
      {
        heading: 'A General Method for Prior Predictive Checks',
        blocks: [
          {
            type: 'text',
            content:
              'The prior predictive distribution of any ancillary statistic is the same as its distribution under the sampling model — it is not affected by the choice of prior. So the observed value of an ancillary statistic can never tell us anything about prior–data conflict; whatever check function we use must have a marginal distribution that actually depends on θ.',
          },
          {
            type: 'theorem',
            number: '9.2.1',
            text: 'Suppose T is a sufficient statistic for {fθ : θ ∈ Ω} for data s. Then the conditional prior predictive distribution of the data s given T is independent of the prior π.',
          },
          {
            type: 'text',
            content:
              'Proof (discrete case). By the factorization theorem, fθ(s) = h(s)gθ(T(s)) for some h and gθ. The prior predictive probability function of s is m(s) = h(s)Σ_θ gθ(T(s))π(θ), and the prior predictive probability function of T at t is m*(t) = Σ_{s:T(s)=t} h(s)Σ_θ gθ(t)π(θ). Dividing, the conditional prior predictive probability of s given T(s) = t is m(s|T=t) = h(s) / Σ_{s′:T(s′)=t} h(s′), which no longer involves π at all.',
          },
          {
            type: 'text',
            content:
              'So, by Theorem 9.2.1, any aspect of the data beyond the value of a minimal sufficient statistic tells us nothing about prior–data conflict. To base a check on the prior predictive, we must therefore use the prior predictive distribution of a minimal sufficient statistic.',
          },
          {
            type: 'example',
            number: '9.2.2',
            title: 'Checking a Beta Prior for a Bernoulli Model',
            body:
              'Suppose (x₁,…,xₙ) is a sample from Bernoulli(θ), θ ∈ [0,1], with θ ∼ Beta(α, β). The count y = Σxᵢ is minimal sufficient and Binomial(n, θ) under the sampling model.',
          },
          {
            type: 'formula',
            latex: 'm(y) \\propto \\frac{\\Gamma(y+\\alpha)\\,\\Gamma(n-y+\\beta)}{\\Gamma(y+1)\\,\\Gamma(n-y+1)}',
            label: 'Prior predictive of y — the Beta-Binomial distribution',
          },
          {
            type: 'text',
            content:
              'When α = β = 1 (the uniform prior on θ), m(y) = 1/(n+1) — every count y ∈ {0,…,n} is equally reasonable, matching the fact that a uniform prior implicitly treats every count as plausible. When α = β = 2 (a prior favouring 1/2), m(y) ∝ (y+1)(n−y+1); for n = 20, counts near 0 or 20 are evidence of prior–data conflict — e.g. observing y = 3 gives a P-value m(0)+m(2)+m(19)+m(20) = 0.0689, not surprising at the 5% level. For n = 50 with the right-skewed α = 2, β = 4 prior (mean 1/3), values of y near 50 give evidence against the model — e.g. y = 35 gives a P-value m(36)+⋯+m(50) = 0.0500, right at the boundary of the 5% level.',
          },
          {
            type: 'example',
            number: '9.2.3',
            title: 'Checking a Normal Prior for a Location Normal Model',
            body:
              'Suppose (x₁,…,xₙ) is a sample from N(μ, σ₀²) with σ₀² known and μ ∼ N(μ₀, τ₀²). Here x̄ is minimal sufficient, so we compare it to its prior predictive distribution. Writing x̄ = μ + z with μ ∼ N(μ₀, τ₀²) independent of z ∼ N(0, σ₀²/n), the prior predictive distribution of x̄ is N(μ₀, τ₀² + σ₀²/n). By symmetry of this density about μ₀, the P-value for checking prior–data conflict is:',
          },
          {
            type: 'formula',
            latex: 'M\\bigl(|\\bar{X}-\\mu_0| \\le |\\bar{x}-\\mu_0|\\bigr) = 2\\Bigl(1-\\Phi\\bigl(|\\bar{x}-\\mu_0|/(\\tau_0^2+\\sigma_0^2/n)^{1/2}\\bigr)\\Bigr) \\tag{9.2.1}',
            label: 'P-value for a Normal prior on a Normal location model',
          },
          {
            type: 'text',
            content:
              'A small value of (9.2.1) is evidence of a conflict between the observed data and the prior — i.e. the prior is putting most of its mass on values of μ for which the observed data are surprising.',
          },
          {
            type: 'example',
            number: '9.2.4',
            title: 'Example 9.2.1 continued',
            body:
              'In Example 9.2.1 we found a prior–data conflict. Yet the posterior probability of θ = 2 works out to (0.0001)(0.9)²⁰ / [(0.9999)(0.1)²⁰ + (0.0001)(0.9)²⁰] ≈ 1, so the posterior predictive probability of the observed sequence is 0.12158 — no indication of conflict from that vantage point. Here the data were sufficient in number to overwhelm a badly placed prior, leading to a sensible inference about θ despite the prior–data conflict that the prior predictive check correctly flagged.',
          },
          {
            type: 'text',
            content:
              'It is tempting to instead use the posterior predictive distribution directly to check for prior–data conflict, but this is a form of the double use of the data: the model was fit using the observed data, and then that same data is used again to check the fit. Double use of the data leads to overly optimistic assessments of model validity and will often fail to detect real discrepancies, so we do not pursue posterior predictive checking further here.',
          },
          {
            type: 'text',
            content:
              'With more complicated models, one can check individual [[choosing-priors|components of a prior]] separately — e.g. the location and scale parts of a location-scale Normal prior — to pinpoint more precisely where a conflict is arising. Ancillary statistics also play a role: since ancillary variation does not depend on the prior, it must be removed before computing the P-value. And when the prior predictive distribution of a minimal sufficient statistic is continuous, further care is needed in exactly how the P-value is computed. These refinements are topics for a further course in statistics.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 9.3  The Problem with Multiple Checks
  // ─────────────────────────────────────────────
  {
    id: 'multiple-checks',
    title: 'The Problem with Multiple Checks',
    chapterRef: 'Chapter 9 · Section 9.3',
    description:
      'Model checking is essential — but running too many checks on the same model is its own trap. Even a perfectly correct model will almost certainly fail at least one of a large enough battery of checks, purely by chance. This section shows why, and what to do about it.',
    hook: 'Check a correct model in enough different ways and you will eventually find something "wrong" with it, by chance alone. Knowing when to stop checking is as important as knowing how to check.',
    sections: [
      {
        heading: 'Multiple Comparisons in Model Checking',
        blocks: [
          {
            type: 'text',
            content:
              'Model checking is a part of good statistical practice, and one should be wary of any statistical work whose investigators have not engaged in, and reported the results of, reasonably rigorous model checking — it is the analyst\'s job to convince us their model is reasonable, bearing in mind the effects of both underfitting and overfitting. This chapter has covered some of the main categories of model-checking procedure, and perhaps the most commonly used methods within each; there is no single best approach, and further research may eventually clarify a recommendation.',
          },
          {
            type: 'text',
            content:
              'One recommendation can already be made, however: it is not reasonable to implement every possible model-checking procedure you can think of. A simple example illustrates the trap.',
          },
          {
            type: 'example',
            number: '9.3.1',
            body:
              'Suppose (x₁,…,xₙ) is meant to be a sample from N(0,1). Suppose we check this, coordinate by coordinate, via Pᵢ = P(Xᵢ² ≥ xᵢ²) for i = 1,…,n, where Xᵢ² ∼ χ²(1), and decide the model is incorrect whenever min{P₁,…,Pₙ} < 0.05.',
          },
          {
            type: 'formula',
            latex: '\\min\\{P_1,\\dots,P_n\\} < 0.05 \\iff \\max\\{x_1^2,\\dots,x_n^2\\} \\ge \\chi^2_{0.95}(1)',
            label: 'Rejection condition, rewritten in terms of the maximum squared value',
          },
          {
            type: 'formula',
            latex: 'P\\bigl(\\min\\{P_1,\\dots,P_n\\} < 0.05\\bigr) = 1 - \\prod_{i=1}^{n} P\\bigl(X_i^2 \\le \\chi^2_{0.95}(1)\\bigr) = 1-(0.95)^n \\;\\longrightarrow\\; 1',
            label: 'Probability of (wrongly) rejecting a correct model, as n → ∞',
          },
          {
            type: 'text',
            content:
              'So when the model is actually correct, this procedure rejects it with near certainty once n is large enough — and n need not be very large at all: the error probability is already 0.40 at n = 10, 0.64 at n = 20, and 0.99 at n = 100.',
          },
          {
            type: 'text',
            content:
              'The lesson of Example 9.3.1 is that carrying out too many model-checking procedures makes it almost certain we will find something wrong, even when the model is correct. The cure is to decide, before looking at the data, on a small number of relevant checks — so the choice of checks is not itself influenced by the data — and to use only those.',
          },
          {
            type: 'text',
            content:
              'This is an instance of the broader multiple comparisons problem, which also arises elsewhere in statistics — e.g. when comparing many means pairwise for differences (Chapter 10 revisits this in that context). One partial fix is to simply lower the P-value cutoff so that the overall error probability stays small: e.g. in Example 9.3.1, requiring an individual P-value below 0.0001 rather than 0.05 keeps the overall error probability down to about 0.01 even at n = 100. The general difficulty with this fix is that model-checking procedures are usually not independent of one another, so it is not always possible to determine the exactly right cutoff for the individual P-values — this needs more advanced methods to handle properly.',
          },
        ],
      },
    ],
  },

];

export function getCh9ConceptById(id: string): ProbabilityConcept | undefined {
  return ch9Concepts.find(c => c.id === id);
}
