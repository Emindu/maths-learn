import type { ContentBlock, ConceptSection, ProbabilityConcept } from './probabilityConceptsData';

export type { ContentBlock, ConceptSection, ProbabilityConcept };

export const ch5Concepts: ProbabilityConcept[] = [
  // ─────────────────────────────────────────────
  // 5.1  Why Do We Need Statistics?
  // ─────────────────────────────────────────────
  {
    id: 'why-statistics',
    title: 'Why Do We Need Statistics?',
    chapterRef: 'Chapter 5 · Section 5.1',
    description:
      'Statistics is applied when we face uncertainty about the true probability model. We observe data from an unknown distribution and make inferences about it — bridging pure probability theory with real-world questions.',
    hook: 'Probability starts from a known model and asks about data; statistics starts from data and asks about the model. That inversion is where every real-world question lives — how good is this drug, does this feature move revenue, is this signal noise. Everything from here on is about running that arrow in reverse.',
    sections: [
      {
        heading: 'Statistics vs Probability',
        blocks: [
          {
            type: 'text',
            content:
              'Probability theory is primarily concerned with calculating quantities when we know the correct probability model. In applications, however, the true probability model is often unknown — the best we can say is that it belongs to some collection of possible models, called the statistical model. This uncertainty is the domain of statistical inference.',
          },
          {
            type: 'text',
            content:
              'Statistical inference is concerned with making statements about characteristics of the true underlying probability measure based on an observed outcome (the data). Inferences take many forms: predictions of future values, credible or confidence regions, or assessments of whether a particular value is plausible.',
          },
          {
            type: 'definition',
            number: '5.1.1',
            title: 'Statistical Inference',
            text: 'Statistical inference refers to the process of drawing conclusions about the true probability distribution P — or characteristics thereof — from observed data s. The data s is a realization from P, which is unknown but is assumed to belong to the statistical model.',
          },
        ],
      },
      {
        heading: 'A Motivating Example: Heart Transplants',
        blocks: [
          {
            type: 'example',
            number: '5.1.1',
            title: 'Stanford Heart Transplant Study',
            body: 'An analysis was conducted to determine whether a heart transplant program at Stanford University was producing the intended outcome — an increased length of life. The lifelengths of the control group (no transplant) are modelled by density f_C, and the treatment group (transplant) by f_T. With only 30 control and 52 treatment patients, we cannot determine these distributions exactly from the data. Statistical inference provides the methods to compare f_T and f_C and assess whether the treatment is effective.',
          },
          { type: 'viz', vizId: 'viz-ch5-inference-motivation' },
          {
            type: 'text',
            content:
              'The central ingredient in all statistical problems is uncertainty. There are two sources: variation in the data (modelled by probability) and not having enough observations to know the correct probability model (addressed by statistical inference). The first four chapters dealt with the first source; this chapter begins the second.',
          },
        ],
      },
      {
        heading: 'When Is Statistics Necessary?',
        blocks: [
          {
            type: 'text',
            content:
              'Statistics is applied to situations in which questions cannot be answered definitively, typically because of variation in data. Probability is used to model this variation. When we observe data from an unknown distribution, we use statistical methodology to learn about that distribution — and so gain insight into the questions of interest.',
          },
          {
            type: 'text',
            content:
              'Not every question requires statistics. For example, if you have access to the complete database of all students at a college (a census), you can compute the average age exactly with no uncertainty. Statistics is needed precisely when we can only observe a subset (a sample) of the full population.',
          },
          {
            type: 'formula',
            latex: '\\text{Data} + \\text{Statistical Model} \\xrightarrow{\\text{inference}} \\text{Conclusions about } P',
            label: 'The fundamental setup of statistical inference',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 5.2  Inference Using a Probability Model
  // ─────────────────────────────────────────────
  {
    id: 'inference-probability-model',
    title: 'Inference Using a Probability Model',
    chapterRef: 'Chapter 5 · Section 5.2',
    description:
      'When the probability model P is known but the response s is not, we can make three types of inference: predict an unknown value, construct a credible interval, or assess the plausibility of a specific value. The principle of conditional probability governs updating inferences with partial information.',
    hook: 'Even when the model is fully known, we still have to decide *what to say* about the unobserved outcome: a single best guess, a range, or a yes/no verdict. These three inference tasks — prediction, interval estimation, and hypothesis assessment — recur through every remaining chapter under different names.',
    sections: [
      {
        heading: 'Known Model, Unknown Response',
        blocks: [
          {
            type: 'text',
            content:
              'In some applications, we presume we know P but are uncertain about a future or concealed response s ∈ S. We may wish to predict s, find a region containing s with high probability, or assess whether a specific value s₀ is plausible under P. These are the three basic types of inference when P is known.',
          },
          {
            type: 'definition',
            number: '5.2.1',
            title: 'Three Inference Tasks (Known P)',
            text: 'Given a known probability measure P on sample space S and an unknown response s ∈ S:\n(i) Prediction: choose a value t as a plausible estimate of s.\n(ii) Credible/Confidence Region: find a subset C ⊆ S with P(C) ≥ 1−α that is as small as possible.\n(iii) Hypothesis Assessment: determine whether a proposed value s₀ is plausible, e.g., by checking whether P({s₀ or more extreme}) is small.',
          },
          { type: 'viz', vizId: 'viz-ch5-prob-inference' },
        ],
      },
      {
        heading: 'Example: Machine Lifelength',
        blocks: [
          {
            type: 'example',
            number: '5.2.1',
            title: 'Exponential(1) Lifelength',
            body: 'Suppose the lifelength X of a machine is X ~ Exponential(1). The predicted lifelength is E(X) = 1 year. The smallest interval containing 95% of the probability for X is (0, c), where 0.95 = 1 − e⁻ᶜ, giving c = −ln(0.05) ≈ 2.996. To assess x₀ = 5: P(X > 5) = e⁻⁵ ≈ 0.0067, which is very small — x₀ = 5 is implausible.',
            formula: 'P(X > 5) = \\int_5^\\infty e^{-x}\\,dx = e^{-5} \\approx 0.0067',
          },
          {
            type: 'text',
            content:
              'The same machine, having already run for one year, is modelled by the conditional distribution given X > 1. The Exponential distribution\'s memoryless property means the additional lifelength still follows Exponential(1), so the predicted additional lifelength remains 1 year. This memorylessness is a special feature of the Exponential distribution.',
          },
          {
            type: 'example',
            number: '5.2.2',
            title: 'Conditional Inference (Machine Has Run 1 Year)',
            body: 'Given X > 1, the conditional density is e^{−(x−1)} for x > 1. The conditional expected additional life is E(X|X>1) = 2. The 95% credible interval becomes (1, c) where c = −ln(e⁻¹ − 0.95e⁻¹) ≈ 3.996. The tail probability P(X > 5 | X > 1) = e⁻⁴ ≈ 0.0183 — x₀ = 5 is a little more plausible now.',
            formula: 'P(X > 5 \\mid X > 1) = \\int_5^\\infty e^{-(x-1)}\\,dx = e^{-4} \\approx 0.0183',
          },
        ],
      },
      {
        heading: 'The Principle of Conditional Probability',
        blocks: [
          {
            type: 'theorem',
            number: '5.2.1',
            title: 'Principle of Conditional Probability',
            text: 'When partial information takes the form s ∈ C ⊂ S, we replace P by the conditional probability measure P(· | C) when making inferences. This principle is not derived from a mathematical theorem; it is a basic axiom of statistical reasoning that most statisticians agree is the right approach.',
          },
          {
            type: 'text',
            content:
              'This principle governs inference in all contexts where partial information is available. It will play a key role in later chapters — particularly in Bayesian inference (Chapter 7), where the "partial information" is a prior distribution on parameters.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 5.3  Statistical Models
  // ─────────────────────────────────────────────
  {
    id: 'statistical-models',
    title: 'Statistical Models',
    chapterRef: 'Chapter 5 · Section 5.3',
    description:
      'In a statistical context, we observe the data s but are uncertain about P. The statistical model {P_θ : θ ∈ Ω} is a family of probability measures parameterised by θ in parameter space Ω. The goal is to infer the true parameter value from the data.',
    hook: 'A statistical model is the box of candidate worlds you\'re willing to consider — Normal(μ, σ²) with unknown mean and variance, or a linear regression with unknown slopes. Every inference below is really a claim about which world in that box the data most likely came from.',
    sections: [
      {
        heading: 'The Statistical Model',
        blocks: [
          {
            type: 'text',
            content:
              'In a statistical problem, we observe the data s but are uncertain about which probability measure P generated it. We model our knowledge by assuming P belongs to a known family {P_θ : θ ∈ Ω} — the statistical model. The variable θ is called the parameter and Ω is the parameter space.',
          },
          {
            type: 'definition',
            number: '5.3.1',
            title: 'Statistical Model',
            text: 'A statistical model for data s is a family of probability measures {P_θ : θ ∈ Ω} on sample space S, where Ω is the parameter space. It is assumed that the true unknown probability measure P equals P_θ for some unique θ ∈ Ω, called the true parameter value. When P_θ can be represented by a density or probability function f_θ, the model is written {f_θ : θ ∈ Ω}.',
          },
          {
            type: 'text',
            content:
              'The parameter θ is merely a label distinguishing the distributions in the model. Any 1–1 function of θ is an equally valid parameterization — this is called a reparameterization. Different parameterizations represent the same statistical model.',
          },
          { type: 'viz', vizId: 'viz-ch5-stat-model' },
        ],
      },
      {
        heading: 'Key Examples',
        blocks: [
          {
            type: 'example',
            number: '5.3.3',
            title: 'Bernoulli Model',
            body: 'A sample (x₁, …, xₙ) from a Bernoulli(θ) distribution with θ ∈ [0,1] unknown. The probability function for the ith observation is f_θ(xᵢ) = θ^xᵢ(1−θ)^{1−xᵢ}. The joint probability function for the sample is the product, which simplifies to θ^{nτ̄}(1−θ)^{n(1−τ̄)}, where τ̄ = (1/n)Σxᵢ is the sample proportion.',
            formula: '\\prod_{i=1}^n f_\\theta(x_i) = \\theta^{n\\bar{\\tau}}(1-\\theta)^{n(1-\\bar{\\tau})}',
          },
          {
            type: 'example',
            number: '5.3.4',
            title: 'Location-Scale Normal Model',
            body: 'A sample from N(μ, σ²) with θ = (μ, σ²) ∈ ℝ × ℝ⁺ unknown. This arises in many applications, e.g., heights of individuals assumed to be approximately normal with unknown mean and variance. The joint density for the sample simplifies via the sample mean x̄ = (1/n)Σxᵢ and sample variance s² = (1/(n−1))Σ(xᵢ − x̄)².',
            formula: '\\prod_{i=1}^n f_{(\\mu,\\sigma^2)}(x_i) = (2\\pi\\sigma^2)^{-n/2}\\exp\\!\\left\\{-\\frac{n(\\bar{x}-\\mu)^2 + (n-1)s^2}{2\\sigma^2}\\right\\}',
          },
        ],
      },
      {
        heading: 'The Statistical Model for a Sample',
        blocks: [
          {
            type: 'text',
            content:
              'When a single observation X has statistical model {f_θ : θ ∈ Ω}, a sample (X₁, …, Xₙ) of i.i.d. observations has joint density f_θ(x₁)·f_θ(x₂)···f_θ(xₙ) for some θ ∈ Ω. This is the statistical model for the sample. The true value of θ is the same as for the single-observation model.',
          },
          {
            type: 'formula',
            latex: '\\sum_{i=1}^n (x_i - \\mu)^2 = n(\\bar{x}-\\mu)^2 + \\sum_{i=1}^n(x_i-\\bar{x})^2 = n(\\bar{x}-\\mu)^2 + (n-1)s^2',
            label: 'Key identity (5.3.1) decomposing sum of squared deviations',
          },
          {
            type: 'text',
            content:
              'The statistical model information {f_θ : θ ∈ Ω} represents what the statistician is willing to assume about the true distribution. These assumptions require checking via model-checking procedures (Chapter 9). If the model is wrong, inferences can be erroneous.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 5.4  Data Collection
  // ─────────────────────────────────────────────
  {
    id: 'data-collection',
    title: 'Data Collection',
    chapterRef: 'Chapter 5 · Section 5.4',
    description:
      'Data are modelled as realizations from a probability distribution. In finite populations, this distribution is the population distribution F_X. Simple random sampling guarantees the sample represents the population. As n → ∞, the empirical CDF F̂_X converges to the true F_X.',
    hook: 'Bad data collection breaks every technique that follows, no matter how sophisticated the model. Random sampling is the invisible foundation that makes "the sample looks like the population" a mathematical guarantee rather than a hope.',
    sections: [
      {
        heading: 'Finite Populations and Population Distributions',
        blocks: [
          {
            type: 'text',
            content:
              'Consider a finite population Π of N objects, each with a real-valued measurement X. The population cumulative distribution function (CDF) is F_X(x) = |{π : X(π) ≤ x}|/N — the proportion of population members with measurement at most x. This is an empirical distribution, not a smooth density.',
          },
          {
            type: 'definition',
            number: '5.4.1',
            title: 'Population CDF and Relative Frequency Function',
            text: 'For a finite population Π with measurement X : Π → ℝ:\n• F_X(x) = |{π ∈ Π : X(π) ≤ x}|/N is the population CDF.\n• f_X(x) = |{π : X(π) = x}|/N is the population relative frequency function (plays the role of the probability function for discrete X).\n• For continuous X, a density histogram function h_X approximates the distribution over intervals.',
          },
          {
            type: 'formula',
            latex: 'F_X(x) = \\frac{|\\{\\pi \\in \\Pi : X(\\pi) \\le x\\}|}{N}',
            label: 'Population CDF for a finite population of size N',
          },
        ],
      },
      {
        heading: 'Simple Random Sampling and the Empirical CDF',
        blocks: [
          {
            type: 'text',
            content:
              'To estimate F_X without a census, we select a subset {π₁, …, πₙ} ⊂ Π using simple random sampling: each subset of size n has probability 1/C(N,n) of being chosen. This guarantees no selection bias. When n is small relative to N, the sample is approximately i.i.d. from F_X.',
          },
          {
            type: 'definition',
            number: '5.4.2',
            title: 'Empirical CDF',
            text: 'Given a sample (x₁, …, xₙ) from F_X, the empirical distribution function is',
            formula: '\\hat{F}_X(x) = \\frac{1}{n}\\sum_{i=1}^n I_{(-\\infty,x]}(x_i)',
          },
          {
            type: 'text',
            content:
              'By the Weak Law of Large Numbers, F̂_X(x) →^P F_X(x) as n → ∞ for every fixed x. Equivalently, F̂_X(x) →^D F_X(x) as n → ∞. The empirical CDF is thus a consistent estimate of the population CDF.',
          },
          { type: 'viz', vizId: 'viz-ch5-empirical-cdf' },
        ],
      },
      {
        heading: 'Histograms and Survey Sampling',
        blocks: [
          {
            type: 'text',
            content:
              'For continuous quantitative variables, we group values into intervals (h₁, h₂], (h₂, h₃], … and define the density histogram function h_X(x) = |{π : X(π) ∈ (hᵢ, hᵢ₊₁]}| / (N·(hᵢ₊₁ − hᵢ)) for x ∈ (hᵢ, hᵢ₊₁]. As bin widths shrink and N grows, h_X approaches a smooth density function f_X.',
          },
          {
            type: 'formula',
            latex: 'h_X(x) = \\frac{|\\{\\pi : X(\\pi) \\in (h_i, h_{i+1}]\\}|}{N(h_{i+1}-h_i)}, \\quad x \\in (h_i, h_{i+1}]',
            label: 'Density histogram function',
          },
          {
            type: 'text',
            content:
              'Survey sampling (polling) applies these ideas to multi-measurement settings. A random sample of respondents provides estimates of the joint distribution of several variables — e.g., voting intent and age in a pre-election poll. Sampling studies are preferred over observational studies because simple random sampling eliminates selection bias. The sample size n must be chosen large enough to achieve the required accuracy, a process called sample-size calculation.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 5.5  Some Basic Inferences
  // ─────────────────────────────────────────────
  {
    id: 'basic-inferences',
    title: 'Some Basic Inferences',
    chapterRef: 'Chapter 5 · Section 5.5',
    description:
      'Descriptive statistics — sample mean, median, quantiles, IQR — summarise the observed sample and estimate the corresponding population quantities. The three formal types of inference are estimation, credible/confidence regions, and hypothesis assessment.',
    hook: 'Before any fancy method, get the sample summary right — mean, median, quartiles, spread. These simple statistics are also estimators, with their own sampling distributions, and are the workhorses behind nearly every real data report.',
    sections: [
      {
        heading: 'Descriptive Statistics',
        blocks: [
          {
            type: 'text',
            content:
              'Given data (x₁, …, xₙ), descriptive statistics are informal summaries used as first estimates of population characteristics. The sample mean x̄ estimates the population mean μ_X; the sample variance s² estimates σ²_X; the sample median x̃_{0.5} estimates the population median x_{0.5}.',
          },
          {
            type: 'definition',
            number: '5.5.1',
            title: 'Quantiles',
            text: 'For p ∈ [0,1], the pth quantile (100pth percentile) x_p for a distribution with CDF F_X is the smallest x satisfying p ≤ F_X(x). The 0.5-quantile is the median; x_{0.25} and x_{0.75} are the first and third quartiles.',
            formula: 'x_p = F_X^{-1}(p) = \\min\\{x : p \\le F_X(x)\\}',
          },
          {
            type: 'text',
            content:
              'The sample pth quantile is estimated by x̂_p = x_{(i)} (the i-th order statistic) whenever (i−1)/n < p ≤ i/n. A linear interpolation formula gives a smoother estimate: x̃_p = x_{(i−1)} + n(x_{(i)} − x_{(i−1)})(p − (i−1)/n).',
          },
          {
            type: 'formula',
            latex: 's^2 = \\frac{1}{n-1}\\sum_{i=1}^n (x_i - \\bar{x})^2, \\quad \\bar{x} = \\frac{1}{n}\\sum_{i=1}^n x_i',
            label: 'Sample variance (unbiased estimator of σ²) and sample mean',
          },
          { type: 'viz', vizId: 'viz-ch5-descriptive-stats' },
        ],
      },
      {
        heading: 'Plotting Data',
        blocks: [
          {
            type: 'text',
            content:
              'Plotting the data is always a good first step. For discrete quantitative variables, plot the sample frequency function f̂_X. For continuous variables, use a density histogram. A boxplot shows the median, quartiles, and adjacent values (whiskers up to 1.5·IQR from the box), with outliers plotted as individual points.',
          },
          {
            type: 'example',
            number: '5.5.4',
            title: 'Boxplots and Outliers',
            body: 'For the data {1.2, 2.1, 0.4, 3.3, −2.1, 4.0, −0.3, 2.2, 1.5, 5.0}, order statistics give x̃₀.₅ = 1.5, x̃₀.₂₅ ≈ 0.05, x̃₀.₇₅ ≈ 2.75, IQR ≈ 2.70. If x_{(10)} changes from 5.0 to 500, the mean jumps from 1.73 to 51.23 while the median stays at 1.5 — illustrating the median\'s robustness to outliers.',
          },
          {
            type: 'text',
            content:
              'The mean and median agree when the distribution is symmetric. For skewed distributions, the median is preferred as a measure of location. For example, the χ²(4) distribution has mean 4 but median ≈ 3.357 because it is right-skewed.',
          },
        ],
      },
      {
        heading: 'Types of Statistical Inference',
        blocks: [
          {
            type: 'text',
            content:
              'Moving beyond descriptive statistics, formal inference uses both the data s and the statistical model {f_θ : θ ∈ Ω} to draw conclusions about the characteristic of interest ψ(θ). There are three types:',
          },
          {
            type: 'definition',
            number: '5.5.2',
            title: 'Three Types of Formal Inference',
            text: '(i) Estimation: choose a function T(s) of the data as an estimate of ψ(θ). This is the problem of estimation.\n(ii) Credible/Confidence Region: construct a subset C(s) of possible values for ψ(θ) that we believe contains the true value. This is credible region or confidence region construction.\n(iii) Hypothesis Assessment: determine whether a proposed value ψ₀ is plausible for ψ(θ) after observing s. This is hypothesis assessment.',
          },
          { type: 'viz', vizId: 'viz-ch5-types-of-inference' },
          {
            type: 'example',
            number: '5.5.6',
            title: 'Application: Heights of Students',
            body: 'A sample of n = 30 student heights (inches) is modelled by N(μ, σ²) with θ = (μ, σ²) unknown. The sample mean x̄ = 64.517 estimates μ. The 95% confidence interval for μ is [x̄ − sc, x̄ + sc] = [64.517 − 0.888, 64.517 + 0.888] = [63.629, 65.405], where c = 0.3734 and s = 2.379. To assess μ₀ = 65, we compute t = (x̄ − μ₀)/(s/√n) = −1.112, which is a plausible value — no evidence against μ = 65.',
            formula: 't = \\frac{\\bar{x} - \\mu_0}{s/\\sqrt{n}} = \\frac{64.517 - 65}{2.379/\\sqrt{30}} = -1.112',
          },
        ],
      },
    ],
  },
];

export function getCh5ConceptById(id: string): ProbabilityConcept | undefined {
  return ch5Concepts.find((c) => c.id === id);
}
