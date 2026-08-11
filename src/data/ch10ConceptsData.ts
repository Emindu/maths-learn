import type { ContentBlock, ConceptSection, ProbabilityConcept } from './probabilityConceptsData';

export type { ContentBlock, ConceptSection, ProbabilityConcept };

export const ch10Concepts: ProbabilityConcept[] = [

  // ─────────────────────────────────────────────
  // 10.1  Related Variables
  // ─────────────────────────────────────────────
  {
    id: 'related-variables',
    title: 'Related Variables',
    chapterRef: 'Chapter 10 · Section 10.1',
    description:
      'What does it mean for two variables to be related, and when can we say a relationship is a cause–effect relationship rather than mere association? This section gives the precise definition, works through the danger of confounding variables, and shows how a properly designed experiment can rescue us from it.',
    hook: 'Height and weight are related. Smoking and lung cancer are related. But only one of those relationships can be probed with a randomized experiment — and that difference is the whole reason this section exists before any of the regression machinery in the rest of the chapter.',
    sections: [
      {
        heading: 'The Definition of Relationship',
        blocks: [
          {
            type: 'text',
            content:
              'Consider a population with two variables X and Y defined on it — say X is weight in kilograms and Y is height in centimetres for a population of people. We know from experience that taller people tend to be heavier, so some kind of relationship exists, but there is no exact formula linking the two: people who share a weight will still have different heights. If we look at everyone in the population with weight X = x, we get a distribution of heights for that slice — the conditional distribution of Y given X = x. As x increases, we expect this conditional distribution to shift (and possibly change shape), and that shift is exactly what we mean by saying X and Y are related.',
          },
          {
            type: 'definition',
            number: '10.1.1',
            title: 'Related Variables',
            text: 'Variables X and Y are related if there is any change in the conditional distribution of Y given X = x as x changes.',
          },
          {
            type: 'text',
            content:
              'Equivalently, X and Y are unrelated exactly when they are independent, since independence is precisely the statement that the conditional distribution of Y given X = x does not depend on x. Definition 10.1.1 applies no matter what kind of variables we have — both categorical, both quantitative, or one of each — which is why Sections 10.2 through 10.5 each handle a different combination of response and predictor type.',
          },
          {
            type: 'text',
            content:
              'Taken completely literally, Definition 10.1.1 will almost always be satisfied — a full census will typically reveal at least some tiny difference between conditional distributions. This is why the strength of a relationship matters as much as its mere existence: a large shift in the conditional distribution is a strong relationship; a barely detectable shift may be of no practical importance at all, even if it is technically nonzero.',
          },
          {
            type: 'text',
            content:
              'If a relationship exists, its full description is the entire collection of conditional distributions of Y given X — but in practice we look for a simpler summary. A statistical model prescribes a simple form for how those conditional distributions change as X changes.',
          },
          {
            type: 'example',
            number: '10.1.1',
            title: 'Simple Normal Linear Regression Model',
            body:
              'Suppose the conditional distribution of a quantitative Y given quantitative X = x is N(β₁+β₂x, σ²) for unknown β₁, β₂, σ². As x changes, the shape of the conditional distribution stays fixed and only its mean moves, sliding along the line β₁+β₂x. Here X and Y are unrelated if and only if β₂ = 0, since that is the only way the conditional distributions can stay constant as x varies.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-scatter-relationship',
          },
          {
            type: 'text',
            content:
              'When there is more than one predictor variable X₁,…,Xₖ, Definition 10.1.1 extends unchanged: a relationship exists between Y and (X₁,…,Xₖ) if the conditional distribution of Y given X₁=x₁,…,Xₖ=xₖ changes at all as (x₁,…,xₖ) varies. The multiple-predictor analogue of Example 10.1.1 again assumes only the mean moves, now along a hyperplane β₁+β₂x₁+⋯+βₖ₊₁xₖ — this is the multiple linear regression model of Section 10.3.4, and X and Y are unrelated exactly when every slope coefficient is 0.',
          },
          {
            type: 'text',
            content:
              'One caution about several predictors together: if a predictor Xⱼ is itself almost an exact linear function of another predictor Xᵢ already in the model, including both makes the fitted coefficients extremely sensitive to small changes in the data. This is the problem of multicollinearity, and it is a genuine practical concern whenever predictors are collected rather than assigned.',
          },
          {
            type: 'text',
            content:
              'The regression assumption — that only the conditional mean E(Y|X₁,…,Xₖ) can change as the predictors change — is powerful because it reduces "does a relationship exist?" to "does E(Y|X₁,…,Xₖ) change?" Writing Z = Y − E(Y|X₁,…,Xₖ) as the error term gives the decomposition used throughout the rest of this chapter.',
          },
          {
            type: 'formula',
            latex: 'Y = E(Y \\mid X_1,\\dots,X_k) + Z \\tag{10.1.1}',
            label: 'Decomposing the response into a (possibly predictor-dependent) mean and an error term independent of the predictors',
          },
        ],
      },
      {
        heading: 'Cause–Effect Relationships and Confounding',
        blocks: [
          {
            type: 'text',
            content:
              'When Y plays the role of response and X of predictor, we often want more than "related" — we want to say that changes in X cause the changes we see in Y. Rising CO₂ emissions and rising global temperatures; heavier smoking and higher rates of respiratory disease — in both cases it feels natural to suspect causation. But height and weight are related too, and it makes no sense to say a change in one causes the other. What separates these cases?',
          },
          {
            type: 'text',
            content:
              'If a relationship exists between X and Y, there are values x₁ ≠ x₂ with f(y|x₁) ≠ f(y|x₂). To say this difference is caused by X, we need to rule out a confounding variable Z — some other variable, also varying with X, that could be responsible for the observed difference instead.',
          },
          {
            type: 'example',
            number: '10.1.3',
            title: 'GPA and Gender, Confounded by Employment',
            body:
              'Suppose in a population of students, most females hold a part-time job and most males do not. A researcher finds a difference in the conditional distribution of GPA given gender and concludes a relationship exists between GPA and gender — reasonably enough. But asserting a cause–effect relationship between GPA and gender specifically is not warranted: the observed difference could equally be attributed to part-time work status, which is confounded with gender in this population.',
          },
          {
            type: 'text',
            content:
              'A more careful analysis could rescue the situation by also recording the confounding variable Z and examining f(y|X=x, Z=z): if the conditional distribution still changes with x for a fixed z, that is evidence for a genuine effect of X, controlling for Z. But there could always be further, unmeasured confounders — in an observational setting we can never be completely sure we have accounted for all of them.',
          },
          {
            type: 'predict',
            title: 'Ice cream and drowning, revisited',
            question: 'Ice cream sales and drowning incidents rise and fall together across the year, and the relationship is strong. What is the confounding variable, and why does it undermine any causal story?',
            reveal: 'Warm weather is the confounder — it independently drives up both ice cream demand and swimming (and therefore drowning risk). Conditioning on season, the relationship between ice cream sales and drowning should mostly vanish; the raw association says nothing about ice cream causing drowning (or vice versa).',
          },
        ],
      },
      {
        heading: 'Controlling Assignment: What Makes an Experiment',
        blocks: [
          {
            type: 'text',
            content:
              'Suppose instead we can control the value of X for any member of the population — we can assign X = x to whomever we like. Imagine (idealized) assigning every member of the population the value X = x₁ and taking a full census to get f(y|X=x₁), then repeating with X = x₂ to get f(y|X=x₂). If these differ, the only possible explanation is the assigned value of X, because we forced X to be the only thing that changed. No confounder can explain the difference, because nothing else was allowed to vary.',
          },
          {
            type: 'text',
            content:
              'In practice we cannot conduct a full census, but we can approximate this idealized comparison: draw a random sample from the population, randomly assign n₁ of them X = x₁ and the rest X = x₂, and treat the resulting Y-values as i.i.d. samples from f(y|X=x₁) and f(y|X=x₂) respectively (valid when the sample is small relative to the population). This gives us a way to use ordinary statistical inference to detect a genuine cause–effect relationship.',
          },
          {
            type: 'text',
            content:
              'Three conditions must hold for this to work. First, we need a random sample from the population of interest, to avoid selection effects (a sampling study, as in Chapter 5). Second, we must be able to assign any possible value of X to any sampled unit — otherwise hidden (lurking) confounders may still be driving the result. Third, having decided which values of X to use, we must randomly allocate those values to the sampled units, again to avoid selection effects. Data collected this way is called an experiment, and it is the only setting in which statistical inference can support a claim of cause and effect.',
          },
          {
            type: 'text',
            content:
              'This gives a hierarchy of data collection methods. Observational studies sit at the bottom: selection effects can undermine even the target population, and confounders can undermine any causal claim. Sampling studies fix the first problem but not the second — randomly sampling males and females in Example 10.1.3 does nothing about the part-time-work confound. Experiments sit at the top, because controlled, randomized assignment of X rules out confounding by construction.',
          },
          {
            type: 'text',
            content:
              'Often an experiment is simply impossible — we cannot assign gender, or race, or (for ethical and practical reasons) a lifetime smoking history at birth. This does not mean observational evidence is worthless; it means we treat it as evidence, potentially flawed but still evidence, the way a court weighs an eyewitness account. When many independent observational and sampling studies point the same way, and known confounders have been ruled out one by one, confidence can grow very high even without a single definitive experiment — this is exactly the case that was eventually built for smoking and lung cancer.',
          },
        ],
      },
      {
        heading: 'Design of Experiments',
        blocks: [
          {
            type: 'text',
            content:
              'Once we have decided to run an experiment, we choose the levels of the predictor (factor) X to use — x₁,…,xₖ — and how many observations n_i to take at each level (the sample sizes summing to n). Absent other information, a balanced design (n₁=⋯=nₖ) is the default choice; if some levels are known to produce more variable responses, allocating more observations to those levels improves overall accuracy. The resulting set of pairs (x₁,n₁),…,(xₖ,nₖ) is called the experimental design.',
          },
          {
            type: 'example',
            number: '10.1.4',
            title: 'Academic Advisors',
            body:
              'A university randomly samples n=100 students; 50 are randomly assigned an advisor (X=1) and 50 are not (X=0). Satisfaction Y is rated 1–10 at semester\'s end. The design is (0,50), (1,50) — a balanced two-level experiment, ready for the two-sample comparison of Section 10.4.1.',
          },
          {
            type: 'example',
            number: '10.1.5',
            title: 'Feed Additive and Weight Gain',
            body:
              'A feed company studies weight gain Y (kg) in dairy cows against additive concentration X ∈ [0,2] g/L. Using k=4 levels x₁=0.00, x₂=0.66, x₃=1.32, x₄=2.00 with n_i=10 each gives the balanced design (0.00,10), (0.66,10), (1.32,10), (2.00,10) — ready for the simple linear regression of Section 10.3.',
          },
          {
            type: 'text',
            content:
              'Notice X=0 in Example 10.1.5 — a control treatment, giving a baseline against which the additive\'s effect can be judged. Control treatments matter enormously in medicine because of the placebo effect: patients often report improvement simply because they are being treated, regardless of the treatment\'s actual content. A drug trial without a placebo (sugar-pill) arm cannot separate the drug\'s effect from the placebo effect. If subjects do not know which treatment they received, the experiment is blind; if the experimenters administering treatment do not know either (to avoid biasing their own assessments), it is double-blind.',
          },
          {
            type: 'text',
            content:
              'With two or more predictors X and W, we could examine each one\'s relationship with Y separately — but this misses how they act together. If the way f(y|X=x, W=w) changes with x depends on the value of w, we say X and W interact. To detect this, every level of X used in the study must be paired with every level of W — the predictors are then said to be completely crossed.',
          },
          {
            type: 'example',
            number: '10.1.6',
            title: 'Advising Hours and Class Size',
            body:
              'A study of calculus grade Y against advising hours per month W ∈ {0,1,2} and class size X ∈ {0,1} (small/large) crosses W and X into 3×2=6 treatments; n students are randomly assigned to each of the six combinations.',
          },
          {
            type: 'text',
            content:
              'Sometimes a predictor is included not because we care about its effect on Y, but because we already know it has one, and conditioning on it reduces unexplained variability in the comparisons we do care about — such a variable is called a blocking variable.',
          },
          {
            type: 'example',
            number: '10.1.7',
            title: 'Wheat Yield Blocked by Soil Fertility',
            body:
              'Three types of wheat are compared for yield Y, but plots of land vary substantially in fertility, which is known to affect yield. Grouping plots into low- and high-fertility blocks W and crossing wheat type with block reduces the leftover variability within each block compared to the unblocked comparison — the classic use of a blocking variable.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 10.2  Categorical Response and Predictors
  // ─────────────────────────────────────────────
  {
    id: 'categorical-relationships',
    title: 'Categorical Response and Predictors',
    chapterRef: 'Chapter 10 · Section 10.2',
    description:
      'When both the response and the predictor are categorical, everything is summarised in a contingency table of counts. Whether the predictor arrives randomly (we sample subjects and observe both variables) or deterministically (we fix how many subjects fall at each predictor value) changes the likelihood slightly — but both routes end at the same chi-squared test.',
    hook: 'Is a blood type linked to disease risk? Does leg position on a machine predict which compressor a faulty piston ring came from? Both questions collapse to exactly the same contingency-table arithmetic — the only difference is who chose the row totals.',
    sections: [
      {
        heading: 'Random Predictor',
        blocks: [
          {
            type: 'text',
            content:
              'Suppose X takes values in {1,…,a}, Y takes values in {1,…,b}, and we draw an i.i.d. sample of size n (small relative to the population). Writing πᵢⱼ = P(X=i, Y=j) and letting fᵢⱼ be the observed count in cell (i,j), the likelihood is a product of Multinomial-style terms, and the MLE is simply the empirical cell proportion π̂ᵢⱼ = fᵢⱼ/n, with standard error √(π̂ᵢⱼ(1−π̂ᵢⱼ)/n).',
          },
          {
            type: 'text',
            content:
              'No relationship exists between X and Y exactly when they are independent: πᵢⱼ = αᵢβⱼ for every i,j, where αᵢ = P(X=i) and βⱼ = P(Y=j). So testing for a relationship between two categorical variables is testing H₀: πᵢⱼ = αᵢβⱼ for all i,j.',
          },
          {
            type: 'text',
            content:
              'This is exactly the model-checking machinery of [[checking-sampling-model|Theorem 9.1.2]] applied to the independence model. Under H₀ the MLEs of the marginal probabilities are α̂ᵢ = fᵢ·/n and β̂ⱼ = f·ⱼ/n (row and column proportions), giving expected counts n·α̂ᵢβ̂ⱼ = fᵢ·f·ⱼ/n and the chi-squared statistic below, with (a−1)+(b−1) parameters fit under H₀ out of ab−1 total — hence (a−1)(b−1) degrees of freedom.',
          },
          {
            type: 'formula',
            latex: 'X^2 = \\sum_{i=1}^{a}\\sum_{j=1}^{b} \\frac{\\left(f_{ij} - n\\hat\\alpha_i\\hat\\beta_j\\right)^2}{n\\hat\\alpha_i\\hat\\beta_j} \\;\\xrightarrow{D}\\; \\chi^2\\bigl((a-1)(b-1)\\bigr)',
            label: 'Chi-squared test of independence for a random categorical predictor',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-contingency',
          },
          {
            type: 'example',
            number: '10.2.1',
            title: 'Piston Ring Failures by Compressor and Leg Position',
            body:
              'A sample of n=166 piston ring failures is cross-tabulated by compressor (Y, 4 categories) and leg position (X: North, Central, South). The row totals are f_N=53, f_C=41, f_S=72. Comparing the estimated conditional distributions of Y given each leg position shows visible differences — e.g. compressor 3 accounts for 21% of North failures but 26% of South failures — but computing the full chi-squared statistic gives X²≈11.72 on (3−1)(4−1)=6 degrees of freedom, and P(χ²(6) ≥ 11.72) ≈ 0.0685. This is suggestive but not strong evidence against independence, so we would proceed as if compressor and leg position are unrelated.',
          },
          {
            type: 'text',
            content:
              'As with the goodness of fit test of Chapter 9, the χ² approximation degrades when expected counts are small — a common rule of thumb wants n·α̂ᵢβ̂ⱼ ≥ 5 in most cells. It is also worth remembering that this test only checks the independence assumption on the cross-classification itself; whether the underlying sample really is i.i.d. is a separate question that this test does not address.',
          },
        ],
      },
      {
        heading: 'Deterministic Predictor',
        blocks: [
          {
            type: 'text',
            content:
              'Sometimes the predictor is not random at all: we deliberately sample nᵢ subjects with X=i (by assignment, in an experiment, or because we are drawing from a subpopulations), for i=1,…,a. Writing fᵢⱼ for the count of Y=j among the nᵢ subjects with X=i, the MLE of the conditional probability π_{j|X=i} is simply fᵢⱼ/nᵢ, and there is no relationship between Y and X exactly when these conditional distributions agree across every level of X: π_{j|X=1} = ⋯ = π_{j|X=a} = πⱼ for every j, for some common distribution (π₁,…,π_b).',
          },
          {
            type: 'text',
            content:
              'Under this null hypothesis the MLE of πⱼ is the pooled column proportion f·ⱼ/n, giving expected counts nᵢ·π̂ⱼ = nᵢf·ⱼ/n and — via the same Theorem 9.1.2 machinery — a chi-squared statistic with (a−1) free parameters under the full model minus (b−1) under H₀, again landing on (a−1)(b−1) degrees of freedom.',
          },
          {
            type: 'formula',
            latex: 'X^2 = \\sum_{i=1}^{a}\\sum_{j=1}^{b} \\frac{\\left(f_{ij} - n_i \\hat\\pi_j\\right)^2}{n_i \\hat\\pi_j} \\;\\xrightarrow{D}\\; \\chi^2\\bigl((a-1)(b-1)\\bigr), \\qquad \\hat\\pi_j = f_{\\cdot j}/n',
            label: 'Chi-squared test of independence for a deterministic (fixed-margin) categorical predictor',
          },
          {
            type: 'example',
            number: '10.2.2',
            title: 'Blood Type and Disease Status',
            body:
              'Three fixed-size samples — peptic ulcer sufferers (n=1796), gastric cancer sufferers (n=883), and controls (n=6087) — are classified by blood type O, A, B. The estimated conditional distributions differ noticeably: type O accounts for 54.7% of the ulcer group but only 47.5% of the controls. Computing the full statistic gives X²≈40.54 on (3−1)(3−1)=4 degrees of freedom, with P(χ²(4) ≥ 40.54) ≈ 0.0000 — strong evidence of a relationship between blood type and disease status, concentrated in the elevated type-O proportion among peptic ulcer patients (the largest standardized residual in the table).',
          },
          {
            type: 'predict',
            title: 'Same formula, different sampling',
            question: 'The random-predictor and deterministic-predictor chi-squared statistics look almost identical, and both land on (a−1)(b−1) degrees of freedom. What actually differs between the two settings?',
            reveal: 'What differs is which margin is fixed by design rather than random. In the random-predictor case, both row and column totals are themselves random outcomes of the sampling process; in the deterministic case, the row totals nᵢ are chosen by the experimenter before any data are collected, and only the within-row counts are random. The null hypothesis, the expected-count formula, and the resulting degrees of freedom end up the same either way — a convenient coincidence that lets one test cover both designs.',
          },
        ],
      },
      {
        heading: 'A Bayesian Formulation',
        blocks: [
          {
            type: 'text',
            content:
              'Both likelihoods in this section have exactly the multinomial form of [[prior-posterior-distributions|Example 7.1.3]], so Dirichlet priors are conjugate. For the random-predictor model, a Dirichlet(α₁₁,…,α_ab) prior on (π₁₁,…,π_ab) updates to a Dirichlet(f₁₁+α₁₁,…,f_ab+α_ab) posterior — add the observed counts directly to the prior parameters.',
          },
          {
            type: 'formula',
            latex: '(\\pi_{11},\\dots,\\pi_{ab}) \\mid \\text{data} \\;\\sim\\; \\text{Dirichlet}\\bigl(f_{11}+\\alpha_{11},\\,\\dots,\\, f_{ab}+\\alpha_{ab}\\bigr)',
            label: 'Dirichlet posterior for the random-predictor categorical model',
          },
          {
            type: 'text',
            content:
              'For the deterministic-predictor model, each row i gets its own independent Dirichlet prior on (π_{1|X=i},…,π_{b|X=i}), and each updates independently using only that row\'s counts — a product of a independent Dirichlet posteriors, one per level of X. A uniform (all-ones) Dirichlet prior expresses no preference among cell probabilities beforehand; samples from any Dirichlet posterior can be generated exactly via a sequence of Beta draws (Example 10.2.3), which is how a Monte Carlo analysis of these models is typically carried out in practice.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 10.3  Quantitative Response and Predictors
  // ─────────────────────────────────────────────
  {
    id: 'simple-linear-regression',
    title: 'Quantitative Response and Predictors',
    chapterRef: 'Chapter 10 · Section 10.3',
    description:
      'When both response and predictor(s) are quantitative, least squares gives closed-form estimates for the simple linear regression line, exact sampling distributions for inference, an ANOVA decomposition that separates explained from unexplained variation, and — via matrix algebra — an identical toolkit for any number of predictors at once.',
    hook: 'Every least-squares line ever fit is minimising the exact sum this section derives by hand — and the same closed-form b = (VᵀV)⁻¹Vᵀy scales that one line up to dozens of predictors without changing a single idea.',
    sections: [
      {
        heading: 'The Method of Least Squares',
        blocks: [
          {
            type: 'text',
            content:
              'Least squares is a general, distribution-free way to estimate a mean: given a sample y₁,…,yₙ from Y, the least-squares principle picks the value t(y₁,…,yₙ), among the possible values of E(Y), that minimises Σ(yᵢ−t)². When every real number is a possible value of E(Y), the identity Σ(yᵢ−t)² = Σ(yᵢ−ȳ)² + n(ȳ−t)² shows the minimiser is exactly t = ȳ — the sample mean is always the unconstrained least-squares estimate of a mean.',
          },
          {
            type: 'example',
            number: '10.3.1',
            title: 'Least Squares with a Restricted Mean',
            body:
              'Suppose E(Y) can only be 1/2 or 2/3 (two candidate Bernoulli-like models), and the sample 0,0,1,1,1 gives ȳ=3/5. Since ȳ is closer to 2/3 than to 1/2, the least-squares estimate is t=2/3 — not ȳ itself, because ȳ is not among the values E(Y) is allowed to take.',
          },
          {
            type: 'text',
            content:
              'Least squares and maximum likelihood agree exactly whenever the errors are Normal: minimising Σ(yᵢ−μ)² is the same optimisation as maximising the N(μ,σ₀²) log-likelihood over μ. This equivalence is what lets us treat the regression coefficients below as both least-squares estimates and MLEs simultaneously.',
          },
        ],
      },
      {
        heading: 'Simple Linear Regression: Fitting the Line',
        blocks: [
          {
            type: 'text',
            content:
              'For a single quantitative predictor, the simple linear regression model assumes E(Y|X=x) = β₁ + β₂x — only the conditional mean moves, and it moves linearly. Given independent observations (x₁,y₁),…,(xₙ,yₙ), we choose (β̂₁,β̂₂) to minimise the sum of squared vertical deviations Σ(yᵢ−β₁−β₂xᵢ)².',
          },
          {
            type: 'theorem',
            number: '10.3.1',
            title: 'Least Squares Estimates',
            text: 'Whenever Σ(xᵢ−x̄)² ≠ 0, the least-squares estimates minimising Σ(yᵢ−β₁−β₂xᵢ)² are b₂ = Σ(xᵢ−x̄)(yᵢ−ȳ) / Σ(xᵢ−x̄)² and b₁ = ȳ − b₂x̄. The fitted line y = b₁+b₂x always passes through the centroid (x̄, ȳ), and (b₁,b₂) coincide with the MLEs under the Normal-error model.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-regression-line',
          },
          {
            type: 'text',
            content:
              'A scatter plot of the (xᵢ,yᵢ) should always be the first step of any regression analysis — it can reveal curvature, outliers, or changing spread no summary number will show. But be wary of the axis scale: stretching the y-axis can make a real relationship look flat, so a scatter plot should always be backed up by the numerical analysis that follows.',
          },
        ],
      },
      {
        heading: 'Inference for the Regression Coefficients',
        blocks: [
          {
            type: 'theorem',
            number: '10.3.2',
            title: 'Unbiasedness',
            text: 'E(B₁) = β₁ and E(B₂) = β₂, given the observed predictor values.',
          },
          {
            type: 'theorem',
            number: '10.3.3',
            title: 'Sampling Variances',
            text: 'If Var(Y|X=x) = σ² for every x, then Var(B₂) = σ²/Σ(xᵢ−x̄)², Var(B₁) = σ²[1/n + x̄²/Σ(xᵢ−x̄)²], and Cov(B₁,B₂) = −σ²x̄/Σ(xᵢ−x̄)².',
          },
          {
            type: 'formula',
            latex: '\\operatorname{Var}\\bigl(B_1 + B_2 x\\bigr) = \\sigma^2\\left[\\frac{1}{n} + \\frac{(x-\\bar x)^2}{\\sum_i (x_i-\\bar x)^2}\\right]',
            label: 'Corollary 10.3.1 — variance of the fitted mean at a new predictor value x',
          },
          {
            type: 'text',
            content:
              'This variance grows as x moves away from x̄, which is the formal counterpart of the informal warning against extrapolation: predicting at an x outside the observed range (extrapolation) is always riskier than predicting inside it (interpolation), and the model itself may simply fail to hold once x moves far enough away.',
          },
          {
            type: 'theorem',
            number: '10.3.4',
            title: 'An Unbiased Estimator of σ²',
            text: 'S² = ESS/(n−2) = Σ(yᵢ − b₁ − b₂xᵢ)²/(n−2) is an unbiased estimator of σ², using n−2 degrees of freedom because two parameters (β₁,β₂) were estimated from the data.',
          },
          {
            type: 'example',
            number: '10.3.4',
            title: 'A Worked Fit',
            body:
              'For a small dataset, least squares gives b₁=1.33, b₂=2.06, minimised SSE=8.46 — dramatically smaller than the SSE=141.15 that a naively guessed line b₁=b₂=1 would give for the same data. With s²≈1.06, the standard errors work out to SE(b₁)≈0.341 and SE(b₂)≈0.102, and the predicted mean at X=2.0 is 1.33+2.06(2)=5.45±0.341 — an interpolation, since X=2.0 lies inside the observed range.',
          },
          {
            type: 'text',
            content:
              'Adding the assumption Y|X=x ~ N(β₁+β₂x, σ²), the pivots (Bᵢ−βᵢ)/SE(Bᵢ) and (B₁+B₂x−β₁−β₂x)/SE(·) are each exactly t(n−2)-distributed, giving confidence intervals bᵢ ± t_{α/2}(n−2)·SE(bᵢ) and a test of H₀: β₂=0 (no linear relationship) via T = b₂/SE(b₂).',
          },
          {
            type: 'example',
            number: '10.3.7',
            title: 'Confidence Interval for the Slope',
            body:
              'Continuing the worked fit, with t₀.₉₇₅(8)=2.306, a 0.95-confidence interval for β₂ is 2.06 ± 0.102(2.306) = [1.824, 2.296] — this excludes 0, so H₀: β₂=0 is rejected and we conclude a genuine linear relationship exists.',
          },
        ],
      },
      {
        heading: 'ANOVA, R², and Correlation',
        blocks: [
          {
            type: 'formula',
            latex: '\\sum_i (y_i-\\bar y)^2 = \\underbrace{b_2^2\\sum_i (x_i-\\bar x)^2}_{\\text{RSS}} + \\underbrace{\\sum_i \\bigl(y_i - b_1 - b_2 x_i\\bigr)^2}_{\\text{ESS}}',
            label: 'Lemma 10.3.1 — the ANOVA decomposition of total variability',
          },
          {
            type: 'text',
            content:
              'RSS (the regression sum of squares) is unbiased for σ² only if β₂=0, while ESS/(n−2) is always unbiased for σ² — so F = [RSS]/[ESS/(n−2)] tests H₀: β₂=0 by comparing two estimators that agree under the null and diverge under the alternative. Large F is evidence of a real linear relationship, and (as with the slope t-test) F(1,n−2) gives the exact reference distribution under Normal errors — indeed this F-test and the slope t-test of the previous section are numerically identical (T² = F).',
          },
          {
            type: 'text',
            content:
              'The coefficient of determination R² = RSS/SST = 1−ESS/SST always lies in [0,1] and is interpreted as the proportion of the observed variation in Y explained by the linear relationship with X. A worked example with R²≈0.981 says 98.1% of the variability in Y is explained by X through the fitted line — a strong basis for confident predictions within the observed range.',
          },
          {
            type: 'theorem',
            number: '10.3.5',
            title: 'R² Equals the Squared Correlation',
            text: 'R² = r²_{xy}, where r_{xy} = Sxy/√(Sxx·Syy) is the sample correlation coefficient between the observed x and y values.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-correlation',
          },
        ],
      },
      {
        heading: 'Residual Analysis',
        blocks: [
          {
            type: 'formula',
            latex: 'r_i^\\star = \\dfrac{y_i - b_1 - b_2 x_i}{s\\left[1 - \\dfrac{1}{n} - \\dfrac{(x_i-\\bar x)^2}{\\sum_j (x_j - \\bar x)^2}\\right]^{1/2}}',
            label: 'Standardized residual for the simple linear regression fit',
          },
          {
            type: 'text',
            content:
              'The standardized residual has conditional mean 0 and conditional variance 1, and — under the Normal-error model, for large n — behaves approximately like a sample from N(0,1). This is exactly the diagnostic machinery of [[checking-sampling-model|Chapter 9]] applied to a regression fit: no pattern against x, no fanning-out of spread, and no more than a handful of points outside (−3,3).',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-regression-residuals',
          },
          {
            type: 'predict',
            title: 'Reading a residual plot',
            question: 'A residual plot shows points fanning out — tight near small x, widely scattered near large x. Which model assumption does this violate, and what is a common fix?',
            reveal: 'It violates the constant-variance assumption Var(Y|X=x) = σ² (this is called heteroscedasticity). A common fix, echoing the transformation idea from Chapter 9, is to apply a variance-stabilising transformation to Y — e.g. log(Y) or √Y for positive responses whose spread grows with their level — before refitting.',
          },
        ],
      },
      {
        heading: 'Multiple Linear Regression',
        blocks: [
          {
            type: 'text',
            content:
              'With k predictors, the linear regression model is E(Y|X₁,…,Xₖ) = β₁x₁ + ⋯ + βₖxₖ, where by convention x₁=1 gives an intercept term. Writing the design matrix V (n rows, one per subject; k columns, one per predictor including the constant) and the response vector y, the least-squares problem again minimises a sum of squared errors, now over a k-dimensional parameter.',
          },
          {
            type: 'theorem',
            number: '10.3.7',
            title: 'Least Squares in Matrix Form',
            text: 'If the columns of V are linearly independent, VᵀV is invertible, the least-squares estimate is unique, and b = (VᵀV)⁻¹Vᵀy.',
          },
          {
            type: 'text',
            content:
              'This closed form directly generalises Theorem 10.3.1 — setting k=2 with x₁≡1 recovers b₂=Sxy/Sxx and b₁=ȳ−b₂x̄ exactly. Each coefficient bᵢ has variance σ²·cᵢᵢ where cᵢᵢ is the i-th diagonal entry of (VᵀV)⁻¹, and n·s² = Σ(yᵢ−ŷᵢ)² with s²=ESS/(n−k) again an unbiased estimator of σ² using n−k degrees of freedom.',
          },
          {
            type: 'text',
            content:
              'The multiple-regression ANOVA table splits SST into a regression sum of squares (attributable to X₂,…,Xₖ, since X₁≡1 contributes nothing to variation) and an error sum of squares, exactly as in the simple case — and comparing the RSS from a full model against the RSS from a reduced model with only the first l < k predictors gives a nested F-test for whether the remaining predictors Xₗ₊₁,…,Xₖ contribute anything once X₁,…,Xₗ are already in the model.',
          },
          {
            type: 'formula',
            latex: 'F = \\dfrac{\\bigl[\\text{RSS}(X_2,\\dots,X_k) - \\text{RSS}(X_2,\\dots,X_l)\\bigr] / (k-l)}{S^2} \\;\\sim\\; F(k-l,\\, n-k) \\;\\text{ under } H_0:\\beta_{l+1}=\\cdots=\\beta_k=0',
            label: 'Nested F-test for dropping a subset of predictors from a multiple regression',
          },
          {
            type: 'example',
            title: 'Stack Loss Data',
            body:
              'Fitting ln(stack loss) on air flow, water temperature, and acid concentration gives R²≈86.9% and a highly significant overall F-test. But the individual t-test for the acid-concentration coefficient gives P≈0.742 — no evidence it contributes once the other two predictors are in the model — and dropping it (confirmed by the equivalent nested F-test) leaves a simpler two-predictor model with essentially the same fit.',
          },
          {
            type: 'predict',
            title: 'Adding a redundant predictor',
            question: 'You fit Y on X₁ alone and get R²=0.60. You then add X₂, a predictor almost perfectly correlated with X₁. What happens to R², and what happens to the standard errors SE(b₁) and SE(b₂)?',
            reveal: 'R² can only stay the same or increase — adding any predictor never increases ESS in a least-squares fit. But with X₁ and X₂ nearly collinear, (VᵀV) is nearly singular, so the diagonal entries of (VᵀV)⁻¹ — and hence SE(b₁) and SE(b₂) — typically inflate dramatically, exactly the multicollinearity problem flagged in Section 10.1.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 10.4  Quantitative Response and Categorical Predictors
  // ─────────────────────────────────────────────
  {
    id: 'anova',
    title: 'Quantitative Response and Categorical Predictors',
    chapterRef: 'Chapter 10 · Section 10.4',
    description:
      'When the response is quantitative and the predictor is categorical — treatment group, plot type, poison — the analysis of variance tests whether the group means differ at all, then multiple comparisons pin down which pairs differ without inflating the false-positive rate. Repeated measures, two-way ANOVA with interaction, and randomized blocks extend the same ideas.',
    hook: 'A one-way ANOVA answers exactly one honest question — do these groups differ at all? — precisely so that finding out which pairs differ afterward does not turn into the multiple-testing trap from Chapter 9.',
    sections: [
      {
        heading: 'One-Way ANOVA',
        blocks: [
          {
            type: 'text',
            content:
              'With a categorical predictor X taking levels 1,…,a and μᵢ = E(Y|X=i), introducing dummy variables Xᵢ (1 if X=i, else 0) turns this into an ordinary linear regression model E(Y|X₁,…,Xₐ) = μ₁X₁+⋯+μₐXₐ — so all the multiple regression machinery of Section 10.3 applies directly. The least-squares (and unbiased) estimate of each μᵢ is simply the sample mean of the observations at that level, bᵢ = ȳᵢ.',
          },
          {
            type: 'text',
            content:
              'For two levels this reduces to the familiar two-sample comparison: with Ȳᵢ − Ȳⱼ ~ N(μᵢ−μⱼ, σ²(1/nᵢ+1/nⱼ)) and S² = ESS/(N−a) independent of the means (N = Σnᵢ), the pivot below gives the two-sample t-confidence interval and t-test for μᵢ−μⱼ.',
          },
          {
            type: 'formula',
            latex: 'T = \\dfrac{(\\bar Y_i - \\bar Y_j) - (\\mu_i-\\mu_j)}{S\\left(1/n_i+1/n_j\\right)^{1/2}} \\;\\sim\\; t(N-a) \\tag{10.4.1}',
            label: 'Two-sample t-pivot for comparing two group means, with the pooled ANOVA error estimate',
          },
          {
            type: 'text',
            content:
              'No relationship between Y and X exists exactly when μ₁=⋯=μₐ. The total variability decomposes into a piece explained by group membership and a leftover piece, exactly mirroring Section 10.3\'s ANOVA identity.',
          },
          {
            type: 'formula',
            latex: '\\sum_i\\sum_j (y_{ij}-\\bar y)^2 = \\underbrace{\\sum_i n_i(\\bar y_i - \\bar y)^2}_{\\text{between-groups}} + \\underbrace{\\sum_i\\sum_j (y_{ij}-\\bar y_i)^2}_{\\text{within-groups}}',
            label: 'One-way ANOVA decomposition',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-anova',
          },
          {
            type: 'text',
            content:
              'Under H₀: μ₁=⋯=μₐ, both the between-groups mean square and the within-groups mean square (=S²) are unbiased for σ² — so F = [between-groups MS]/[within-groups MS] tests the null, with F(a−1, N−a) as the reference distribution and large F as evidence of real differences among the means.',
          },
          {
            type: 'example',
            number: '10.4.1',
            title: 'Fat Absorption in Donuts',
            body:
              'Eight types of cooking fat, six donuts each, response = grams of fat absorbed. The ANOVA gives F=478/145≈3.3 on (7,40) degrees of freedom, with P(F ≥ 3.3) ≈ 0.007 — evidence that at least one fat type differs from the rest, with Fat 4 (highest absorption, mean 184.5g) at one extreme and Fats 7 and 8 (lowest, means 161.3g and 162.3g) at the other.',
          },
        ],
      },
      {
        heading: 'Multiple Comparisons',
        blocks: [
          {
            type: 'text',
            content:
              'A significant F-test says at least one pair of means differs, but not which pair. Testing every pair with its own two-sample t-test at, say, the 5% individual error rate walks straight into the multiple-testing trap of [[multiple-checks|Section 9.3]]: with a groups there are C(a,2) = a(a−1)/2 pairs, and the family error rate — the chance of at least one false "significant" difference somewhere among them, even if every μᵢ is secretly equal — climbs fast.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-multiple-comparisons',
          },
          {
            type: 'text',
            content:
              'In the donut example, all C(8,2)=28 pairwise comparisons at the 0.05 individual level give a family error rate of 0.481 — worse than a coin flip — even before looking at whether any real differences exist. Dropping the individual error rate to 0.003 brings the family error rate down to about 0.055; at that stringent level, only the Fat 4 vs. Fat 7 and Fat 4 vs. Fat 8 differences survive. This simple strategy — lowering the individual cutoff so the family rate stays controlled — is Fisher\'s multiple comparison test, the direct analogue of the partial fix given for model checking in Section 9.3.',
          },
          {
            type: 'predict',
            title: 'An awkward inconsistency',
            question: 'After multiple comparisons, Fat 4 is found different from Fat 7, but Fat 4 is not found different from Fat 5, and Fat 5 is not found different from Fat 7. Is this a contradiction?',
            reveal: 'Not a logical contradiction — "not significantly different" never means "equal," only "not enough evidence of a difference at this sample size and error-rate budget." Each pairwise test has its own power, and a modest sample size can easily fail to detect real but smaller differences (Fat 4 vs. Fat 5, Fat 5 vs. Fat 7) while still detecting a larger one (Fat 4 vs. Fat 7). Resolving genuine three-way inconsistencies like this requires either a larger sample or a more targeted follow-up design.',
          },
        ],
      },
      {
        heading: 'Repeated Measures and Paired Comparisons',
        blocks: [
          {
            type: 'text',
            content:
              'When we want to compare k similar variables Y₁,…,Yₖ (say, calculus and physics grades for the same students, or headache duration under two treatments for the same sufferers), we can either sample independently for each variable, or take repeated measures: observe all of Y₁,…,Yₖ on the same sampled units. Repeated measures are usually preferred, because Var(Yᵢ−Yⱼ) = Var(Yᵢ)+Var(Yⱼ)−2Cov(Yᵢ,Yⱼ), and similar measurements on the same subject tend to be positively correlated — so the covariance term shrinks the variance of the difference compared to independent sampling.',
          },
          {
            type: 'text',
            content:
              'With repeated measures on n subjects, the differences d₁=y₁ᵢ−y₁ⱼ,…,dₙ are treated as a one-dimensional sample with mean μᵢ−μⱼ, estimated by d̄ = ȳᵢ−ȳⱼ, with variance estimated by the ordinary sample variance of the dₗ. This is a paired comparison, and — assuming joint Normality — it uses exactly the one-sample inference machinery for a Normal mean.',
          },
          {
            type: 'example',
            number: '10.4.4',
            title: 'Blood Pressure and Captopril',
            body:
              'Fifteen patients\' systolic blood pressure is measured before and after captopril; d̄=18.93 with s=9.03, giving SE(d̄)=2.33. A 0.95-confidence interval for the mean drop is 18.93 ± 2.33·t₀.₉₇₅(14) = [13.93, 23.93] — excluding 0, so there is strong evidence the drug lowers blood pressure.',
          },
        ],
      },
      {
        heading: 'Two-Way ANOVA, Interaction, and Blocking',
        blocks: [
          {
            type: 'text',
            content:
              'With two crossed categorical predictors A (a levels) and B (b levels), let μᵢⱼ = E(Y|A=i,B=j). Predictors A and B interact if μᵢⱼ cannot be written additively as μᵢⱼ = νᵢ+γⱼ for constants ν₁,…,νₐ,γ₁,…,γᵦ — equivalently, the response curves of E(Y|A,B=j) against A are not parallel across different values of j. If an interaction exists, both A and B necessarily have some effect on Y.',
          },
          {
            type: 'text',
            content:
              'Fitting the full (interacting) model against the additive (no-interaction) model and differencing their regression sums of squares gives RSS(A×B), the portion of variability attributable to interaction, leading to an F-test of H₀: no interaction. If that null is not rejected, we go on to test for a main effect of A (H₀: ν₁=⋯=νₐ) and of B (H₀: γ₁=⋯=γᵦ) separately, each again via an F-test built from its own regression sum of squares.',
          },
          {
            type: 'example',
            number: '10.4.5',
            title: 'Poison Type and Treatment on Survival Time',
            body:
              'Twelve animals per (poison, treatment) combination give a 3×4 crossed design for survival time (reciprocal-transformed to fix a residual-plot problem in the raw response). The interaction test gives F≈1.09 on (6,36), P≈0.387 — no evidence of interaction — so both main effects are tested cleanly: treatment gives F≈28.35 (P≈0.000) and poison type gives F≈72.66 (P≈0.000), both strongly significant.',
          },
          {
            type: 'text',
            content:
              'A special case arises when there is exactly one observation per (A,B) combination (nᵢⱼ=1): there are then no residual degrees of freedom left to estimate error directly. If we are willing to assume A and B do not interact, the interaction sum of squares itself can serve as the error estimate instead, with (a−1)(b−1) degrees of freedom — this is the randomized block design, and it is an efficient way to remove the effect of a known blocking variable B while testing for an effect of A using only ab observations.',
          },
          {
            type: 'formula',
            latex: 's^2 = \\dfrac{\\text{RSS}(A\\times B)}{(a-1)(b-1)} \\qquad \\text{(randomized block design, one observation per cell)}',
            label: 'Error variance estimate for a randomized block design assuming no interaction',
          },
          {
            type: 'text',
            content:
              'A closely related idea, analysis of covariance, arises when we can measure (but not assign) a quantitative variable known to affect Y — including it in the model, alongside the categorical predictors, removes some of the unexplained variability and sharpens the comparisons among the categorical groups, at the cost of one extra degree of freedom.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 10.5  Categorical Response and Quantitative Predictors
  // ─────────────────────────────────────────────
  {
    id: 'logistic-regression',
    title: 'Categorical Response and Quantitative Predictors',
    chapterRef: 'Chapter 10 · Section 10.5',
    description:
      'When the response is binary — success or failure, ready or not ready, diseased or healthy — and the predictors are quantitative, a plain linear model for E(Y|X) breaks down, because a probability must stay in [0,1]. A link function repairs this, and the logistic link gives the workhorse logistic regression model.',
    hook: 'A straight line happily predicts a probability of 1.4 or −0.2 — nonsense a probability can never be. The logistic link is the one-line fix that keeps every prediction honestly between 0 and 1, no matter how far the predictors range.',
    sections: [
      {
        heading: 'Link Functions and the Logistic Model',
        blocks: [
          {
            type: 'text',
            content:
              'Suppose Y ∈ {0,1} and there are quantitative predictors X₁,…,Xₖ. Then E(Y|X₁,…,Xₖ) = P(Y=1|X₁,…,Xₖ) ∈ [0,1], so an ordinary linear model β₁x₁+⋯+βₖxₖ (unconstrained over all of ℝ) cannot describe it directly without artificial restrictions on the βᵢ. Instead we use a link function l: [0,1] → ℝ — any 1–1 function, such as the inverse cdf of a continuous distribution — and model l(P(Y=1|X₁,…,Xₖ)) = β₁x₁+⋯+βₖxₖ.',
          },
          {
            type: 'text',
            content:
              'Taking l to be the inverse standard Normal cdf Φ⁻¹ gives the probit link. The more commonly used choice, for its mathematical convenience, is the logistic link — the log-odds, or logit, of the probability.',
          },
          {
            type: 'formula',
            latex: 'l(p) = \\ln\\!\\left(\\dfrac{p}{1-p}\\right) \\tag{10.5.1}',
            label: 'The logistic link (logit) function',
          },
          {
            type: 'text',
            content:
              'Inverting the logit gives the logistic regression model directly in terms of the predicted probability.',
          },
          {
            type: 'formula',
            latex: 'P(Y=1 \\mid X_1,\\dots,X_k) = \\dfrac{\\exp(\\beta_1 x_1 + \\cdots + \\beta_k x_k)}{1 + \\exp(\\beta_1 x_1 + \\cdots + \\beta_k x_k)} \\tag{10.5.2}',
            label: 'The logistic regression model — predicted probability as a sigmoid function of the linear predictor',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-logistic',
          },
          {
            type: 'text',
            content:
              'Because P(Y=1|X) itself depends on X₁,…,Xₖ, so does Var(Y|X₁,…,Xₖ) = P(Y=1|·)(1−P(Y=1|·)) — the conditional variance is not constant, so logistic regression is not, strictly speaking, a regression model in the constant-shape sense of Section 10.1; only the mean/probability is being modelled directly.',
          },
        ],
      },
      {
        heading: 'Fitting and Checking a Logistic Model',
        blocks: [
          {
            type: 'text',
            content:
              'Given n independent observations (xᵢ₁,…,xᵢₖ,yᵢ), each yᵢ is Bernoulli with success probability given by (10.5.2) evaluated at (xᵢ₁,…,xᵢₖ). The conditional likelihood is the product of these Bernoulli terms, and inference proceeds exactly via the likelihood methods of [[maximum-likelihood-estimation|Chapter 6]] — there is no closed form for the MLE, so software finds it numerically, and the large-sample methods of [[mle-asymptotics|Section 6.5]] (approximate Normality of the MLE) supply confidence intervals and tests, since exact sampling distributions are not available here.',
          },
          {
            type: 'text',
            content:
              'Testing H₀: βᵢ = 0 is testing whether predictor Xᵢ has any relationship at all with the response, using the approximately-Normal statistic Z = β̂ᵢ/SE(β̂ᵢ).',
          },
          {
            type: 'example',
            number: '10.5.1',
            title: 'Ingot Readiness and Heating Time',
            body:
              'Ingots are classified ready/not-ready for rolling after treatment, cross-classified by soaking time U and heating time V across 19 settings. Fitting P(Y=1|U,V) with an intercept and both predictors gives an estimated coefficient for U with z≈0.17, P≈0.864 — no evidence U matters — while V gives z≈3.46, P≈0.001. A chi-squared goodness of fit check on the fitted model (comparing observed successes/failures per cell against the model\'s fitted probabilities, in the spirit of [[checking-sampling-model|Theorem 9.1.2]]) gives no evidence of lack of fit, so U is dropped and the model is refit using only V, giving a simple one-predictor logistic curve for the probability an ingot is ready as a function of heating time alone.',
          },
          {
            type: 'predict',
            title: 'Reading a logistic coefficient',
            question: 'In a fitted model logit(P(Y=1|X)) = −2.0 + 0.5X, what does the sign and size of the coefficient on X tell you, and what happens to P(Y=1|X) as X → ∞ and as X → −∞?',
            reveal: 'The positive coefficient 0.5 means increasing X increases the log-odds of Y=1, and hence increases P(Y=1|X) — each one-unit increase in X multiplies the odds P/(1−P) by e^0.5≈1.65. As X→∞, the linear predictor →∞ and P(Y=1|X)→1; as X→−∞, it →−∞ and P(Y=1|X)→0 — the logistic curve approaches but never reaches 0 or 1, unlike a raw linear model which would eventually predict probabilities outside [0,1].',
          },
        ],
      },
    ],
  },

];

export function getCh10ConceptById(id: string): ProbabilityConcept | undefined {
  return ch10Concepts.find(c => c.id === id);
}
