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
      'Almost every practical question in statistics is really a question about how one variable relates to another: does a drug affect recovery, does study time affect exam scores, does gender relate to employment status? This section sets up the vocabulary — response and predictor variables, and what it actually means for two variables to be "related" — that every other tool in this chapter builds on.',
    hook: 'Every regression line, every ANOVA table, and every chi-squared test in this chapter answers exactly one question in disguise: does knowing X change what we believe about Y? Get comfortable with that question here, before the machinery arrives.',
    sections: [
      {
        heading: 'Response and Predictor Variables',
        blocks: [
          {
            type: 'text',
            content:
              'So far we have mostly studied a single [[rv-intro|random variable]] or a small fixed collection of them. In practice, however, we usually collect several measurements on each subject in a study and want to know how they relate to one another. We call the variable we are trying to explain, predict, or understand the response, and denote it Y. The variables we use to explain, predict, or account for Y are called predictors (or explanatory variables, or covariates), denoted X, X₁, X₂, … .',
          },
          {
            type: 'text',
            content:
              'A statistics course, a medical trial, a marketing experiment — all of these produce data of the form (x₁, y₁), …, (xₙ, yₙ), one pair (or tuple) per subject. The central question of this chapter is: does the value of X tell us something about the likely value of Y? If it does, we say X and Y are related, or associated. If it does not, we say X and Y are unrelated — which, for random variables, is exactly [[conditioning-independence|independence]].',
          },
          {
            type: 'definition',
            number: '10.1.1',
            title: 'Related Variables',
            text: 'Random variables X and Y are related if the conditional distribution of Y given X = x depends on the value of x, i.e. if f(y|x) is not the same function of y for every x in the range of X. If f(y|x) = f(y) for every x, then X and Y are unrelated — equivalently, independent.',
          },
          {
            type: 'text',
            content:
              'This definition covers every kind of pairing we will meet in this chapter: X and Y can each be categorical (e.g. gender, treatment group) or quantitative (e.g. age, income, blood pressure), and the tools we reach for depend on which combination we have. Section 10.2 handles categorical response and predictors via contingency tables and the chi-squared test of independence — a direct generalisation of Fisher\'s exact test and the goodness of fit ideas from [[checking-sampling-model|Chapter 9]]. Sections 10.3 and 10.4 handle a quantitative response and one or more quantitative predictors via regression and correlation. Section 10.5 handles a quantitative response and a categorical predictor via the analysis of variance, and revisits the multiple comparisons problem first raised in [[multiple-checks|Section 9.3]].',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-scatter-relationship',
          },
          {
            type: 'text',
            content:
              'The left panel above shows a scatterplot of 40 points where X and Y were generated independently — the vertical spread of Y looks the same no matter which slice of X you look at, and there is no discernible trend. The right panel shows X and Y that were generated so Y tends to increase with X — the conditional mean E(Y|X=x), marked by the dashed line, clearly shifts as x increases. Scatterplots like these are always the first thing to look at before reaching for a formal test.',
          },
        ],
      },
      {
        heading: 'The Regression Function and What "Explaining" Y Means',
        blocks: [
          {
            type: 'text',
            content:
              'When Y is quantitative, the single most useful summary of how X relates to Y is the regression function m(x) = E(Y|X=x) — the conditional mean of Y at each value of x. Section 10.1\'s definition of "related" says X and Y are related exactly when m(x) is not a constant function of x. Sections 10.3–10.4 study the important special case where m(x) is assumed linear, m(x) = β₀ + β₁x, and estimate β₀ and β₁ from data.',
          },
          {
            type: 'formula',
            latex: 'm(x) = E(Y \\mid X = x)',
            label: 'The regression function — the conditional mean of Y given X = x',
          },
          {
            type: 'predict',
            title: 'Related, but not linearly',
            question: 'Suppose Y = X² + ε with X ~ Uniform[−2, 2] and ε a small independent noise term. Are X and Y related in the sense of Definition 10.1.1? Would a straight-line summary of E(Y|X=x) be a good idea?',
            reveal: 'Yes, X and Y are related — f(y|x) clearly depends on x, since E(Y|X=x) = x² + E(ε) is not constant. But a linear model E(Y|X=x) = β₀+β₁x would badly misdescribe the relationship: the true regression function is a parabola, symmetric around x=0, so a fitted straight line would have a near-zero slope despite a very strong (nonlinear) relationship. This is exactly why residual and scatter plots (as in Sections 9.1 and 10.3) matter — a linear fit\'s R² or correlation can look weak even when the variables are strongly related in a nonlinear way.',
          },
          {
            type: 'text',
            content:
              'One further caution, easy to state but easy to forget in practice: a statistical relationship between X and Y — however strong — is not by itself evidence that X causes Y. Both could be driven by a third, unmeasured variable (a confounder), or the direction of causation could run the other way. Establishing causation generally requires a designed experiment with randomised assignment of X, not just observational data; the tools of this chapter measure and quantify association, not causation, and it is the analyst\'s job to keep that distinction in view when interpreting results.',
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
      'When both variables are categorical — gender and voting preference, treatment and outcome, brand and satisfaction level — their relationship is summarised in a contingency table, and tested formally with the chi-squared test of independence. This generalises the 2×2 reasoning behind Fisher\'s exact test to any number of rows and columns.',
    hook: 'Is unemployment related to gender? Is a side effect related to which drug a patient took? The chi-squared test of independence is the single most widely used tool in applied statistics for exactly this shape of question — and it is nothing more than the Chapter 9 goodness of fit idea, aimed at a different target.',
    sections: [
      {
        heading: 'Contingency Tables and Independence',
        blocks: [
          {
            type: 'text',
            content:
              'Suppose we sample n subjects and record two categorical variables per subject: A, taking values in {1,…,r}, and B, taking values in {1,…,c}. The data are naturally summarised in an r×c contingency table of observed counts x_ij, the number of subjects with A=i and B=j. Row and column totals are x_i· = Σⱼxᵢⱼ and x·ⱼ = Σᵢxᵢⱼ, with x_i· + x·ⱼ summing to n overall.',
          },
          {
            type: 'definition',
            number: '10.2.1',
            title: 'Independence of Categorical Variables',
            text: 'A and B are independent if P(A=i, B=j) = P(A=i)·P(B=j) for every i ∈ {1,…,r} and j ∈ {1,…,c}, i.e. every joint cell probability factors as the product of its row and column marginal probabilities.',
          },
          {
            type: 'text',
            content:
              'If (Xᵢⱼ) ∼ Multinomial(n, (pᵢⱼ)) with pᵢⱼ = αᵢβⱼ under independence — where αᵢ = P(A=i) and βⱼ = P(B=j) — the natural estimates of the unknown marginal probabilities are α̂ᵢ = xᵢ·/n and β̂ⱼ = x·ⱼ/n, giving expected counts under independence of eᵢⱼ = n·α̂ᵢβ̂ⱼ = xᵢ·x·ⱼ/n. These are exactly the fitted counts we compare the observed xᵢⱼ against.',
          },
          {
            type: 'formula',
            latex: 'e_{ij} = \\frac{x_{i\\cdot}\\,x_{\\cdot j}}{n} \\qquad \\text{(expected count in cell } (i,j) \\text{ under independence)}',
            label: 'Expected cell counts under the independence model',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-contingency',
          },
        ],
      },
      {
        heading: 'The Chi-Squared Test of Independence',
        blocks: [
          {
            type: 'text',
            content:
              'This is precisely the chi-squared goodness of fit machinery of [[checking-sampling-model|Theorem 9.1.2]], applied to the independence model instead of a fully general categorical model. The independence model has dim Ω = (r−1) + (c−1) free parameters (the row and column marginal probabilities, each summing to 1), out of a saturated k = rc-cell model — giving the following degrees of freedom.',
          },
          {
            type: 'theorem',
            number: '10.2.1',
            title: 'Chi-Squared Test of Independence',
            text: 'If A and B are independent, then as n → ∞, X² = Σᵢ₌₁ʳ Σⱼ₌₁ᶜ (xᵢⱼ − eᵢⱼ)²/eᵢⱼ →^D χ²((r−1)(c−1)), where eᵢⱼ = xᵢ·x·ⱼ/n. Large values of X² are evidence against independence; the P-value is P(χ²((r−1)(c−1)) ≥ X₀²) for the observed X₀².',
          },
          {
            type: 'example',
            number: '10.2.1',
            title: 'Gender and Employment Status, Revisited',
            body:
              'Recall Example 9.1.4: n=20 students, x₁·=6 males, x·₁=12 unemployed, x₁₁=2 unemployed males. The 2×2 table is x₁₁=2, x₁₂=4 (employed males), x₂₁=10 (unemployed females), x₂₂=4 (employed females). Expected counts under independence are e₁₁ = 6·12/20 = 3.6, e₁₂ = 6·8/20 = 2.4, e₂₁ = 14·12/20 = 8.4, e₂₂ = 14·8/20 = 5.6.',
          },
          {
            type: 'formula',
            latex: 'X^2 = \\frac{(2-3.6)^2}{3.6} + \\frac{(4-2.4)^2}{2.4} + \\frac{(10-8.4)^2}{8.4} + \\frac{(4-5.6)^2}{5.6} \\approx 1.984',
            label: 'Chi-squared statistic for the gender/employment table',
          },
          {
            type: 'text',
            content:
              'With (r−1)(c−1) = 1 degree of freedom, P(χ²(1) ≥ 1.984) ≈ 0.159 — no evidence against independence, consistent with the P-value of 0.161 found via the exact hypergeometric calculation in Example 9.1.4. This agreement is not a coincidence: for a 2×2 table, the chi-squared test of independence and Fisher\'s exact test are asking the same question, and for larger cell counts they give very similar answers — the chi-squared version is simply the large-sample approximation, and it generalises immediately to any number of rows and columns where an exact hypergeometric calculation becomes impractical.',
          },
          {
            type: 'predict',
            title: 'Degrees of freedom for a bigger table',
            question: 'A survey cross-tabulates political affiliation (5 categories) against region (4 categories). How many degrees of freedom does the chi-squared test of independence use?',
            reveal: '(r−1)(c−1) = (5−1)(4−1) = 4·3 = 12 degrees of freedom.',
          },
          {
            type: 'text',
            content:
              'As with the goodness of fit test of Section 9.1, the χ² approximation is only reliable when expected counts eᵢⱼ are not too small — a common rule of thumb requires eᵢⱼ ≥ 5 in most cells (or ≥ 1 with adjacent cells merged if needed). For a 2×2 table with very small samples, prefer Fisher\'s exact test directly rather than relying on the asymptotic χ² approximation.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 10.3  Quantitative Response and Predictor — Simple Linear Regression
  // ─────────────────────────────────────────────
  {
    id: 'simple-linear-regression',
    title: 'Simple Linear Regression',
    chapterRef: 'Chapter 10 · Section 10.3',
    description:
      'When both the response Y and the predictor X are quantitative, the workhorse model is simple linear regression: Y = β₀ + β₁X + ε. This section derives the least-squares estimators, their sampling distributions, and the residual diagnostics that check whether the straight-line model is believable in the first place.',
    hook: 'Every trend line ever fitted through a scatterplot is solving the same least-squares problem this section derives from scratch — and every one of those trend lines needs the residual checks from Chapter 9 before you trust it.',
    sections: [
      {
        heading: 'The Linear Model and Least Squares',
        blocks: [
          {
            type: 'text',
            content:
              'The simple linear regression model assumes that, for i = 1,…,n independent subjects, the response Yᵢ is generated as a linear function of a known predictor value xᵢ plus random error:',
          },
          {
            type: 'formula',
            latex: 'Y_i = \\beta_0 + \\beta_1 x_i + \\varepsilon_i, \\qquad \\varepsilon_i \\overset{iid}{\\sim} N(0, \\sigma^2) \\tag{10.3.1}',
            label: 'The simple linear regression model',
          },
          {
            type: 'text',
            content:
              'Here β₀ (the intercept) and β₁ (the slope) are unknown parameters we want to estimate, and σ² is the unknown error variance. Given a sample (x₁,y₁),…,(xₙ,yₙ), the least squares estimators (β̂₀, β̂₁) minimise the sum of squared vertical deviations between the data and the fitted line.',
          },
          {
            type: 'formula',
            latex: 'SSE(b_0, b_1) = \\sum_{i=1}^{n} (y_i - b_0 - b_1 x_i)^2',
            label: 'The sum of squared errors being minimised',
          },
          {
            type: 'theorem',
            number: '10.3.1',
            title: 'Least Squares Estimators',
            text: 'The values (β̂₀, β̂₁) minimising SSE(b₀,b₁) are β̂₁ = Sxy/Sxx and β̂₀ = ȳ − β̂₁x̄, where Sxx = Σ(xᵢ−x̄)² and Sxy = Σ(xᵢ−x̄)(yᵢ−ȳ). Equivalently, (β̂₀, β̂₁) is the unique minimiser of SSE, and (β̂₀,β̂₁) coincide exactly with the MLEs of (β₀,β₁) under model (10.3.1).',
          },
          {
            type: 'text',
            content:
              'That last fact is worth pausing on: because the εᵢ are Normal, maximising the likelihood L(β₀,β₁,σ²|data) over (β₀,β₁) for fixed σ² is exactly the same optimisation problem as minimising SSE(b₀,b₁) — the two approaches to fitting a line, least squares and [[maximum-likelihood-estimation|maximum likelihood]], agree completely here. The fitted line ŷ = β̂₀ + β̂₁x always passes through the point (x̄, ȳ), the centroid of the data.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-regression-line',
          },
          {
            type: 'text',
            content:
              'Try dragging the slope slider above the true minimum and below it — the sum of squared errors SSE always increases as you move away from the OLS line, which is exactly the defining property of a least-squares fit: no other line through the data achieves a smaller SSE.',
          },
        ],
      },
      {
        heading: 'Inference for the Slope, and Model Checking',
        blocks: [
          {
            type: 'text',
            content:
              'Because β̂₁ = Sxy/Sxx is a linear combination of the Yᵢ, and each Yᵢ is Normal under model (10.3.1), β̂₁ is itself exactly Normal — this lets us build confidence intervals and hypothesis tests exactly as we did for the location Normal model in [[inferences-based-on-mle|Chapter 6]].',
          },
          {
            type: 'theorem',
            number: '10.3.2',
            title: 'Sampling Distribution of the Slope',
            text: 'Under model (10.3.1), β̂₁ ∼ N(β₁, σ²/Sxx). With σ² estimated by S² = SSE/(n−2), the pivot (β̂₁ − β₁)/(S/√Sxx) has a t(n−2) distribution, giving the confidence interval β̂₁ ± t_{α/2}(n−2)·S/√Sxx, and a test of H₀: β₁ = 0 (no linear relationship) via the statistic T = β̂₁/(S/√Sxx).',
          },
          {
            type: 'formula',
            latex: 'R^2 = 1 - \\frac{SSE}{SST}, \\qquad SST = \\sum_{i=1}^{n}(y_i - \\bar{y})^2, \\qquad SSE = \\sum_{i=1}^{n}(y_i - \\hat{y}_i)^2',
            label: 'Coefficient of determination R² — the fraction of variability in Y explained by X',
          },
          {
            type: 'text',
            content:
              'R² ranges from 0 (the line explains none of the variability in Y beyond the sample mean ȳ) to 1 (every point lies exactly on the fitted line). It is a useful headline summary, but by itself it says nothing about whether the linear model is actually the right shape — a strong nonlinear relationship, as in the predict box of Section 10.1, can have an R² near zero for a fitted straight line despite X and Y being tightly related.',
          },
          {
            type: 'text',
            content:
              'This is exactly why the model checking machinery of [[checking-sampling-model|Chapter 9]] matters here: fitting a line is easy, but trusting it requires checking the residuals eᵢ = yᵢ − ŷᵢ. If model (10.3.1) is correct, the standardized residuals eᵢ/s should behave like an approximate N(0,1) sample — no pattern against x, no trend in spread, and no more than a handful of points outside (−3,3), exactly the diagnostic used for the location-scale Normal model in Section 9.1.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-regression-residuals',
          },
          {
            type: 'predict',
            title: 'Reading a residual plot',
            question: 'A residual plot shows points fanning out — small scatter for small x, large scatter for large x. What model assumption does this violate, and what is a common fix?',
            reveal: 'It violates the constant-variance assumption Var(εᵢ) = σ² (homoscedasticity) — this is called heteroscedasticity. A common fix, echoing the transformation idea flagged at the end of Section 9.1, is to apply a variance-stabilising transformation to Y (e.g. log(Y) or √Y when Y is positive and its spread grows with its level) before refitting the linear model.',
          },
          {
            type: 'example',
            number: '10.3.1',
            title: 'A Worked Numeric Fit',
            body:
              'For n=5 points with x̄=3, Sxx=10, Sxy=14, ȳ=6: β̂₁ = 14/10 = 1.4 and β̂₀ = 6 − 1.4·3 = 1.8, giving the fitted line ŷ = 1.8 + 1.4x. If SSE for this fit is 3.6, then S² = SSE/(n−2) = 3.6/3 = 1.2, so S ≈ 1.095 and SE(β̂₁) = S/√Sxx ≈ 1.095/√10 ≈ 0.346. A test of H₀: β₁=0 gives T = 1.4/0.346 ≈ 4.04 on 3 degrees of freedom — strong evidence of a genuine linear relationship.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 10.4  Correlation and Multiple Regression
  // ─────────────────────────────────────────────
  {
    id: 'correlation-multiple-regression',
    title: 'Correlation and Multiple Regression',
    chapterRef: 'Chapter 10 · Section 10.4',
    description:
      'The sample correlation coefficient r measures the strength and direction of a linear relationship on a fixed scale from −1 to 1, and connects directly to R² and the slope test of Section 10.3. When more than one predictor is available, multiple regression extends the same least-squares machinery to several explanatory variables at once.',
    hook: 'Correlation is the single most quoted — and most misquoted — number in applied statistics. This section gives you the exact formula, the exact test that goes with it, and the exact reason "correlation is not causation" is more than a slogan.',
    sections: [
      {
        heading: 'The Sample Correlation Coefficient',
        blocks: [
          {
            type: 'definition',
            number: '10.4.1',
            title: 'Sample Correlation Coefficient',
            text: 'For paired data (x₁,y₁),…,(xₙ,yₙ), the sample correlation coefficient is r = Sxy/√(Sxx·Syy), where Sxx=Σ(xᵢ−x̄)², Syy=Σ(yᵢ−ȳ)², Sxy=Σ(xᵢ−x̄)(yᵢ−ȳ). Always −1 ≤ r ≤ 1, by the [[expectation-inequalities|Cauchy–Schwarz inequality]].',
          },
          {
            type: 'text',
            content:
              'r = 1 or r = −1 occurs exactly when the points lie perfectly on a line with positive or negative slope, respectively; r = 0 indicates no linear relationship (though, as in the predict box of Section 10.1, X and Y can still be strongly related nonlinearly even when r ≈ 0). The sign of r always matches the sign of the fitted slope β̂₁ from simple linear regression, and the two are related by r² = R² — the square of the correlation coefficient equals the coefficient of determination from the simple linear regression of Y on X.',
          },
          {
            type: 'formula',
            latex: 'r^2 = R^2 = 1 - \\frac{SSE}{SST}',
            label: 'The identity linking r to the regression R²',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-correlation',
          },
          {
            type: 'theorem',
            number: '10.4.1',
            title: 'Testing H₀: ρ = 0',
            text: 'Suppose (Xᵢ,Yᵢ) are i.i.d. bivariate Normal with population correlation ρ. Under H₀: ρ=0, T = r√(n−2)/√(1−r²) has a t(n−2) distribution. This is algebraically identical to the slope test of Theorem 10.3.2 — testing ρ=0 and testing β₁=0 are the same test viewed two ways.',
          },
          {
            type: 'example',
            number: '10.4.1',
            title: 'Correlation vs Causation',
            body:
              'Ice cream sales and drowning incidents are strongly positively correlated across the year. Neither causes the other — both are driven by a third variable, warm weather, which increases both swimming (and hence drowning risk) and ice cream demand. A large, statistically significant r here says nothing about a causal link between ice cream and drowning; it is a textbook example of confounding, echoing the caution raised at the end of Section 10.1.',
          },
        ],
      },
      {
        heading: 'Multiple Regression',
        blocks: [
          {
            type: 'text',
            content:
              'When several predictors X₁,…,Xₖ are available, the natural extension of model (10.3.1) is multiple linear regression:',
          },
          {
            type: 'formula',
            latex: 'Y_i = \\beta_0 + \\beta_1 x_{i1} + \\beta_2 x_{i2} + \\cdots + \\beta_k x_{ik} + \\varepsilon_i, \\qquad \\varepsilon_i \\overset{iid}{\\sim} N(0,\\sigma^2)',
            label: 'The multiple linear regression model',
          },
          {
            type: 'text',
            content:
              'Writing the design matrix X (n rows, one per subject; k+1 columns, one constant column of 1s plus one per predictor) and the response vector Y, the least squares estimator has the closed form β̂ = (XᵀX)⁻¹XᵀY, generalising the simple linear regression formulas of Theorem 10.3.1 — indeed setting k=1 recovers β̂₁=Sxy/Sxx and β̂₀=ȳ−β̂₁x̄ exactly.',
          },
          {
            type: 'formula',
            latex: '\\hat{\\boldsymbol{\\beta}} = (\\mathbf{X}^\\top \\mathbf{X})^{-1}\\mathbf{X}^\\top \\mathbf{Y}',
            label: 'Least squares estimator in matrix form',
          },
          {
            type: 'text',
            content:
              'Each coefficient β̂ⱼ is interpreted as the expected change in Y for a one-unit increase in Xⱼ, holding all other predictors fixed — a subtly different quantity from the simple regression slope of Y on Xⱼ alone whenever the predictors are themselves correlated with one another (a phenomenon called multicollinearity, which inflates the standard errors of the β̂ⱼ and can make individual coefficients unstable even when the overall fit is good).',
          },
          {
            type: 'predict',
            title: 'Adding a redundant predictor',
            question: 'You fit Y on X₁ alone and get R²=0.60. You then add X₂, a predictor that is almost perfectly correlated with X₁, to get a multiple regression. What happens to R², and what happens to the standard errors of β̂₁ and β̂₂?',
            reveal: 'R² can only stay the same or increase — adding any predictor, however useless, never decreases R² in a least-squares fit, since SSE cannot increase. But because X₁ and X₂ are almost collinear, the individual standard errors SE(β̂₁) and SE(β̂₂) typically blow up: the data can no longer distinguish "credit to X₁" from "credit to X₂", even though the combined fit is barely better than X₁ alone.',
          },
          {
            type: 'text',
            content:
              'Residual and normal probability plots (Section 9.1) apply here exactly as in simple regression, now plotted against fitted values ŷᵢ or against each predictor in turn, and the transformation ideas flagged at the end of Section 9.1 — logarithms for positive, right-skewed responses; square roots for count data — remain the first line of defence when a linear model in the raw variables does not fit well.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 10.5  Analysis of Variance and Multiple Comparisons
  // ─────────────────────────────────────────────
  {
    id: 'anova',
    title: 'Analysis of Variance and Multiple Comparisons',
    chapterRef: 'Chapter 10 · Section 10.5',
    description:
      'When the response Y is quantitative and the predictor is categorical — a treatment group, a manufacturing line, a study condition — the analysis of variance (ANOVA) tests whether the group means differ at all. But once ANOVA says "some group differs", pinning down which pairs differ reopens the multiple comparisons problem first raised in Chapter 9.',
    hook: 'ANOVA answers one honest question — do these groups differ at all? — precisely so you are not tempted to run k(k−1)/2 separate t-tests and walk straight into the false-positive trap of Section 9.3.',
    sections: [
      {
        heading: 'One-Way ANOVA',
        blocks: [
          {
            type: 'text',
            content:
              'Suppose we have k independent groups, with nⱼ observations in group j, and assume Yᵢⱼ (the i-th observation in group j) is Normal with a group-specific mean μⱼ and a common variance σ²:',
          },
          {
            type: 'formula',
            latex: 'Y_{ij} = \\mu_j + \\varepsilon_{ij}, \\qquad \\varepsilon_{ij} \\overset{iid}{\\sim} N(0,\\sigma^2), \\qquad i=1,\\dots,n_j,\\; j=1,\\dots,k',
            label: 'The one-way ANOVA model',
          },
          {
            type: 'text',
            content:
              'The question "does the group (a categorical predictor) affect Y?" becomes the hypothesis test H₀: μ₁=μ₂=⋯=μₖ against Hₐ: at least two μⱼ differ. The idea, exactly parallel to the residual decomposition of Section 9.1, is to split the total variability in Y into a piece explained by group membership and a piece left over within groups.',
          },
          {
            type: 'formula',
            latex: 'SST = \\underbrace{\\sum_{j=1}^{k} n_j(\\bar{y}_{\\cdot j} - \\bar{y})^2}_{SSB} + \\underbrace{\\sum_{j=1}^{k}\\sum_{i=1}^{n_j}(y_{ij}-\\bar{y}_{\\cdot j})^2}_{SSW} \\tag{10.5.1}',
            label: 'The ANOVA decomposition: total = between-groups + within-groups',
          },
          {
            type: 'text',
            content:
              'Here ȳ is the grand mean of all N=Σnⱼ observations and ȳ·ⱼ is the sample mean of group j. SSB (sum of squares between groups) measures how spread out the group means are around the grand mean; SSW (sum of squares within groups) measures the leftover variability inside each group, and is entirely driven by the common error variance σ² regardless of whether H₀ is true.',
          },
          {
            type: 'theorem',
            number: '10.5.1',
            title: 'The F-Test for Equal Means',
            text: 'Under H₀: μ₁=⋯=μₖ, F = MSB/MSW = [SSB/(k−1)] / [SSW/(N−k)] has an F(k−1, N−k) distribution. Large values of F are evidence against H₀; the P-value is P(F(k−1,N−k) ≥ F₀) for the observed F₀. Under Hₐ, MSB is inflated by the true spread of the μⱼ, so F tends to be larger than 1.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-anova',
          },
          {
            type: 'text',
            content:
              'Drag the effect size slider above toward 0 and the between-group differences shrink toward the sampling noise already present within each group — watch SSB shrink toward SSW and F fall toward 1, the value expected under H₀. This F-test is, in fact, algebraically identical to a chi-squared test of independence between the categorical group label and a discretised Y in the k=2 special case, and it directly generalises the two-sample t-test to more than two groups.',
          },
        ],
      },
      {
        heading: 'Multiple Comparisons After ANOVA',
        blocks: [
          {
            type: 'text',
            content:
              'A significant F-test tells us at least one pair of group means differs — but not which pair. The naive next step, comparing every pair with its own two-sample t-test, walks straight into the trap of [[multiple-checks|Section 9.3]]: with k groups there are C(k,2) = k(k−1)/2 pairs, and running that many tests at level α=0.05 each makes a false "significant difference" almost certain even when H₀ is entirely true.',
          },
          {
            type: 'example',
            number: '10.5.1',
            title: 'How Fast the Trap Grows',
            body:
              'With k=6 groups there are C(6,2)=15 pairwise comparisons. Exactly as in Example 9.3.1, if these were independent tests each at level 0.05, the chance of at least one false "significant" difference would be 1−(0.95)¹⁵ ≈ 0.537 — worse than a coin flip, even though every μⱼ is secretly equal.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch10-multiple-comparisons',
          },
          {
            type: 'text',
            content:
              'The standard fix mirrors the partial remedy given at the end of Section 9.3: adjust the per-comparison significance level downward so that the family-wise error rate — the probability of at least one false positive across all comparisons — stays controlled at the target α.',
          },
          {
            type: 'theorem',
            number: '10.5.2',
            title: 'Bonferroni Correction',
            text: 'If m comparisons are each tested at level α/m, then by the union bound (subadditivity of probability — [[probability-properties|Chapter 1]]), the family-wise probability of at least one false positive under a global null is at most m·(α/m) = α, regardless of any dependence between the tests.',
          },
          {
            type: 'text',
            content:
              'The Bonferroni correction is simple and always valid, but conservative — it can be much smaller than the true family-wise error rate when the tests are positively correlated (as pairwise group comparisons usually are, since each group mean appears in several comparisons). Sharper procedures designed specifically for all-pairs comparisons after ANOVA — Tukey\'s HSD (honestly significant difference) test chief among them — use the exact sampling distribution of the range of k independent sample means to get a less conservative, but still valid, family-wise error guarantee. The underlying lesson, as in Chapter 9, does not change: decide on your comparisons before looking at the data, and adjust for however many you run.',
          },
          {
            type: 'predict',
            title: 'Choosing a correction',
            question: 'A researcher runs one ANOVA F-test across 4 treatment groups, finds a significant result, and plans to report only the single pairwise comparison between the two groups with the most extreme sample means. Does the Bonferroni correction with m = C(4,2) = 6 apply here?',
            reveal: 'No — Bonferroni\'s guarantee assumes the m comparisons are decided in advance, not chosen after seeing which pair looks most different. Picking the most extreme pair post hoc is itself a form of the multiple-checks trap: you have implicitly searched over all 6 possible pairs and reported only the most favourable one, so a single m=1 Bonferroni correction badly understates the true false-positive risk. A procedure like Tukey\'s HSD, designed exactly for "search over all pairs" comparisons, is the appropriate tool here.',
          },
        ],
      },
    ],
  },

];

export function getCh10ConceptById(id: string): ProbabilityConcept | undefined {
  return ch10Concepts.find(c => c.id === id);
}
