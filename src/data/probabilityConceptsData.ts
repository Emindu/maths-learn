export type BlockType = 'text' | 'definition' | 'theorem' | 'corollary' | 'example' | 'formula' | 'viz';

export interface ContentBlock {
  type: BlockType;
  content?: string;   // 'text' blocks
  latex?: string;     // 'formula' blocks (display math)
  label?: string;     // optional label for formula block
  number?: string;    // definition/theorem/corollary/example numbering
  title?: string;     // optional box title
  text?: string;      // body text inside a box
  formula?: string;   // optional formula inside a box
  body?: string;      // example body text
  vizId?: string;     // 'viz' blocks — key into VIZ_REGISTRY
}

export interface ConceptSection {
  heading?: string;
  blocks: ContentBlock[];
}

export interface ProbabilityConcept {
  id: string;
  title: string;
  chapterRef: string;
  description: string;
  sections: ConceptSection[];
}

export const probabilityConcepts: ProbabilityConcept[] = [
  {
    id: 'probability-intro',
    title: 'Probability: A Measure of Uncertainty',
    chapterRef: 'Chapter 1 · Section 1.1',
    description: 'Probability as the science of uncertainty — why we need it, how it developed, and its real-world applications.',
    sections: [
      {
        heading: 'What Is Probability?',
        blocks: [
          {
            type: 'text',
            content:
              'Probability is the science of uncertainty. It provides precise mathematical rules for understanding and analysing our own ignorance. It does not tell us tomorrow\'s weather or next week\'s stock prices; rather, it gives us a framework for working with limited knowledge and for making sensible decisions based on what we do and do not know.',
          },
          {
            type: 'text',
            content:
              'To say there is a 40% chance of rain tomorrow is not to know tomorrow\'s weather. Rather, it is to know what we do not know about tomorrow\'s weather. Probability theory lets us work precisely with ideas of randomness, expectation, prediction, and estimation.',
          },
        ],
      },
      {
        heading: 'Sources of Randomness',
        blocks: [
          {
            type: 'text',
            content:
              'Randomness arises from several sources: genuine uncertainty about future events (traffic, weather, elections), pseudorandom processes used in computers, and truly random quantum phenomena at the atomic level. Another useful way to think about probability is in terms of relative frequency — if an experiment is repeated many times, the probability of an event approximates the fraction of times that event occurs.',
          },
        ],
      },
      {
        heading: 'Why Do We Need Probability Theory?',
        blocks: [
          {
            type: 'text',
            content:
              'A good understanding of probability allows you to correctly assess probabilities in everyday situations, leading to wiser decisions. Consider three illustrative examples:',
          },
          {
            type: 'example',
            number: '1',
            title: 'Lottery Odds',
            body: 'In a "Lotto 6/49" lottery you pick 6 distinct integers from 1 to 49, and 6 are drawn at random. The probability of winning the jackpot is exactly 1 in 13,983,816 — roughly 14 million times more likely that you will not win than that you will. Furthermore, once the jackpot exceeds ~$14 million many extra people buy tickets, making the prize likely to be split, so the expected value is even lower.',
          },
          {
            type: 'example',
            number: '2',
            title: 'The Red Card Bet',
            body: 'A "friend" shows you one side of a card that is red and bets $4 against your $3 that the other side is also red. At first glance, the probability seems 50%. However, conditional probability (Section 1.5) reveals the conditional probability of the other side being red is 2/3, not 1/2 — so you should refuse the bet.',
          },
          {
            type: 'example',
            number: '3',
            title: 'Coin Flips and Large Numbers',
            body: 'A friend bets $100 that if you flip a coin 1000 times you will get at least 600 heads, against your $1. Despite 500 being the most likely count, the laws of large numbers show the probability of 600+ heads is less than one in ten billion — so you should decline this too.',
          },
        ],
      },
      {
        heading: 'Interactive: Relative Frequency Simulation',
        blocks: [{ type: 'viz', vizId: 'coin-flip' }],
      },
      {
        heading: 'Risk and Everyday Life',
        blocks: [
          {
            type: 'text',
            content:
              'Probability theory also plays a key role in science and technology. The design of a nuclear reactor must ensure that radioactive emissions are extremely rare events. The gambling and nuclear examples both deal with the concept of risk — the risk of losing money, of exposure to danger, and so on. We assess risk every time we drive, fly, or cross a street. The insurance industry exists precisely to help us cope with such risks, using probability to determine premiums.',
          },
        ],
      },
      {
        heading: 'A Brief History',
        blocks: [
          {
            type: 'text',
            content:
              'The mathematical theory of probability originated in the seventeenth century. In 1654 the Paris gambler Chevalier de Méré posed questions about gambling to Blaise Pascal, who corresponded with Pierre de Fermat. Pascal later wrote the Traité du Triangle Arithmetique, discussing binomial coefficients (Pascal\'s triangle) and the binomial probability distribution.',
          },
          {
            type: 'text',
            content:
              'At the beginning of the twentieth century, Russians including Andrei Markov, Andrey Kolmogorov, and Pafnuty Chebyshev developed a formal mathematical theory of probability. Americans William Feller and Joseph Doob popularised the subject in the west through important books in the 1950s, establishing its role in physics, economics, computer science, and finance.',
          },
        ],
      },
    ],
  },

  {
    id: 'probability-models',
    title: 'Probability Models',
    chapterRef: 'Chapter 1 · Section 1.2',
    description: 'Formal definition of a probability model: sample spaces, collections of events, and the probability measure P with its four axioms.',
    sections: [
      {
        heading: 'Sample Spaces',
        blocks: [
          {
            type: 'text',
            content:
              'A formal definition of probability begins with a sample space, often written S. This sample space is any set that lists all possible outcomes of some unknown experiment or situation. For example, when predicting tomorrow\'s weather:',
          },
          {
            type: 'formula',
            latex: 'S = \\{\\text{rain},\\; \\text{snow},\\; \\text{clear}\\}',
          },
          {
            type: 'text',
            content:
              'S can be any set at all — finite, countably infinite, or uncountable. We usually write s for an element of S, so that s ∈ S. S describes only things relevant to the experiment; rain and snow might be in S, but tomorrow\'s stock prices would not be.',
          },
        ],
      },
      {
        heading: 'Events',
        blocks: [
          {
            type: 'text',
            content:
              'A probability model also requires a collection of events, which are subsets of S to which probabilities can be assigned. For the weather example, subsets such as {rain}, {snow}, {rain, snow}, {rain, snow, clear}, and even the empty set ∅ = {} are all events. The comma means "or"; thus {rain, snow} is the event that it will rain or snow. We generally assume all subsets of S are events.',
          },
        ],
      },
      {
        heading: 'The Probability Measure',
        blocks: [
          {
            type: 'text',
            content:
              'Finally, a probability model requires a probability measure, usually written P. This must assign a probability P(A) to each event A, satisfying four properties:',
          },
          {
            type: 'text',
            content:
              '1. P(A) is always a non-negative real number, between 0 and 1 inclusive.\n2. P(∅) = 0 — the probability of nothing happening is zero.\n3. P(S) = 1 — some outcome must occur with certainty.\n4. P is countably additive: for any finite or countable sequence of disjoint events A₁, A₂, …:',
          },
          {
            type: 'formula',
            label: '(1.2.1)',
            latex: 'P(A_1 \\cup A_2 \\cup \\cdots) = P(A_1) + P(A_2) + \\cdots',
          },
          {
            type: 'definition',
            number: '1.2.1',
            title: 'Probability Model',
            text: 'A probability model consists of a nonempty set called the sample space S; a collection of events that are subsets of S; and a probability measure P assigning a probability between 0 and 1 to each event, with P(∅) = 0 and P(S) = 1 and with P additive as in (1.2.1).',
          },
        ],
      },
      {
        heading: 'Worked Examples',
        blocks: [
          {
            type: 'example',
            number: '1.2.1',
            title: 'Weather',
            body: 'Let S = {rain, snow, clear} with P({rain}) = 0.40, P({snow}) = 0.15, P({clear}) = 0.45. Then P({rain, snow}) = P({rain}) + P({snow}) = 0.40 + 0.15 = 0.55, i.e., there is a 55% chance of rain or snow.',
          },
          {
            type: 'example',
            number: '1.2.3',
            title: 'Fair Coin',
            body: 'Flipping a fair coin gives S = {H, T} with P({H}) = P({T}) = 0.5. Of course P(H) + P(T) = 1.',
          },
          {
            type: 'example',
            number: '1.2.4',
            title: 'Three Fair Coins',
            body: 'Flipping three fair coins yields S = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT}. Each outcome has probability 1/8. The event "first coin heads and second coin tails" = {HTH, HTT}, so P = 1/8 + 1/8 = 1/4.',
          },
          {
            type: 'example',
            number: '1.2.6',
            title: 'Uniform Distribution on [0, 1]',
            body: 'Let S = [0, 1]. Define P([a, b]) = b − a for 0 ≤ a ≤ b ≤ 1. For any sub-interval the probability equals its length. This is the uniform distribution on [0, 1].',
            formula: 'P([a,b]) = b - a, \\quad 0 \\le a \\le b \\le 1',
          },
        ],
      },
      {
        heading: 'Interactive: Venn Diagram Explorer',
        blocks: [{ type: 'viz', vizId: 'venn-diagram' }],
      },
      {
        heading: 'Venn Diagrams and Set Operations',
        blocks: [
          {
            type: 'text',
            content:
              'Venn diagrams are a useful graphical method for depicting S and subsets. For two events A and B inside S, the key set operations are:',
          },
          {
            type: 'text',
            content:
              'Complement: A^c = {s : s ∉ A} — all outcomes in S but not in A.\nIntersection: A ∩ B = {s : s ∈ A and s ∈ B} — outcomes in both A and B.\nUnion: A ∪ B = {s : s ∈ A or s ∈ B} — outcomes in A or B (or both).',
          },
          {
            type: 'text',
            content: 'Two important identities (De Morgan\'s Laws):',
          },
          {
            type: 'formula',
            latex: '(A \\cup B)^c = A^c \\cap B^c \\qquad (A \\cap B)^c = A^c \\cup B^c',
          },
          {
            type: 'text',
            content:
              'Events A and B are called disjoint if they share no outcomes, i.e., A ∩ B = ∅. Disjoint events are depicted as non-overlapping circles in a Venn diagram.',
          },
        ],
      },
    ],
  },

  {
    id: 'probability-properties',
    title: 'Properties of Probability Models',
    chapterRef: 'Chapter 1 · Section 1.3',
    description: 'Core mathematical properties derived from the axioms: complement rule, law of total probability, monotonicity, inclusion-exclusion, and subadditivity.',
    sections: [
      {
        heading: 'The Complement Rule',
        blocks: [
          {
            type: 'text',
            content:
              'For any event A, its complement A^c is the event that A does not occur. Since A and A^c are disjoint and A ∪ A^c = S, the additivity property gives P(A) + P(A^c) = P(S) = 1, so:',
          },
          {
            type: 'formula',
            label: '(1.3.1)',
            latex: 'P(A^c) = 1 - P(A)',
          },
          {
            type: 'text',
            content:
              'In words: the probability that any event does not occur equals one minus the probability that it does. This is used extremely often in probability calculations.',
          },
        ],
      },
      {
        heading: 'Law of Total Probability (Unconditioned)',
        blocks: [
          {
            type: 'text',
            content:
              'Suppose A₁, A₂, … are events that form a partition of the sample space S — meaning they are disjoint and their union is all of S. Then for any event B, we can decompose the probability of B into contributions from each partition element:',
          },
          {
            type: 'theorem',
            number: '1.3.1',
            title: 'Law of Total Probability (unconditioned version)',
            text: 'Let A₁, A₂, … be events forming a partition of S. Let B be any event. Then:',
            formula: 'P(B) = P(A_1 \\cap B) + P(A_2 \\cap B) + \\cdots',
          },
        ],
      },
      {
        heading: 'Monotonicity',
        blocks: [
          {
            type: 'text',
            content:
              'If event A contains event B (written A ⊇ B), meaning all outcomes in B are also in A, then intuitively A is "larger" and should have at least as large a probability.',
          },
          {
            type: 'theorem',
            number: '1.3.2',
            text: 'Let A and B be two events with A ⊇ B. Then:',
            formula: 'P(A) = P(B) + P(A \\cap B^c)',
          },
          {
            type: 'corollary',
            number: '1.3.1',
            title: 'Monotonicity',
            text: 'Let A and B be two events, with A ⊇ B. Then P(A) ≥ P(B).',
          },
          {
            type: 'corollary',
            number: '1.3.2',
            text: 'Let A and B be two events, with A ⊇ B. Then:',
            formula: 'P(A \\cap B^c) = P(A) - P(B)',
          },
        ],
      },
      {
        heading: 'Inclusion-Exclusion',
        blocks: [
          {
            type: 'text',
            content:
              'For two events that may overlap, the probability of their union cannot simply be the sum of their probabilities — the intersection would be counted twice. The Principle of Inclusion-Exclusion corrects this:',
          },
          {
            type: 'theorem',
            number: '1.3.3',
            title: 'Inclusion-Exclusion (two events)',
            text: 'Let A and B be two events. Then:',
            formula: 'P(A \\cup B) = P(A) + P(B) - P(A \\cap B)',
          },
          {
            type: 'text',
            content:
              'This generalises to three or more events. For three events A, B, C:',
          },
          {
            type: 'formula',
            latex:
              'P(A \\cup B \\cup C) = P(A)+P(B)+P(C) - P(A\\cap B) - P(A\\cap C) - P(B\\cap C) + P(A\\cap B\\cap C)',
          },
        ],
      },
      {
        heading: 'Interactive: Inclusion-Exclusion Explorer',
        blocks: [{ type: 'viz', vizId: 'inclusion-exclusion' }],
      },
      {
        heading: 'Subadditivity',
        blocks: [
          {
            type: 'theorem',
            number: '1.3.4',
            title: 'Subadditivity',
            text: 'Let A₁, A₂, … be a finite or countably infinite sequence of events, not necessarily disjoint. Then:',
            formula: 'P(A_1 \\cup A_2 \\cup \\cdots) \\le P(A_1) + P(A_2) + \\cdots',
          },
          {
            type: 'text',
            content:
              'Subadditivity is useful when we do not need the exact probability of a union, but only an upper bound. Note that equality holds when the events are disjoint (the countable additivity axiom), and strict inequality holds when events overlap.',
          },
        ],
      },
    ],
  },

  {
    id: 'uniform-probability',
    title: 'Uniform Probability on Finite Spaces',
    chapterRef: 'Chapter 1 · Section 1.4',
    description: 'When all outcomes are equally likely, P(A) = |A|/|S|. Counting techniques: multiplication principle, permutations, combinations, and binomial coefficients.',
    sections: [
      {
        heading: 'Uniform Probability',
        blocks: [
          {
            type: 'text',
            content:
              'If the sample space S is finite, the simplest and most natural probability measure is the uniform probability measure, which assigns probability 1/|S| to each individual outcome (where |S| denotes the number of elements in S). By additivity, for any event A:',
          },
          {
            type: 'formula',
            label: '(1.4.1)',
            latex: 'P(A) = \\frac{|A|}{|S|}',
          },
          {
            type: 'text',
            content:
              'Computing P(A) therefore reduces to counting |A| and |S|. This is the domain of combinatorics.',
          },
          {
            type: 'example',
            number: '1.4.1',
            title: 'Fair Six-Sided Die',
            body: 'Rolling a fair die gives S = {1, 2, 3, 4, 5, 6} with |S| = 6. Each outcome has probability 1/6. The event {3, 4} has probability 2/6 = 1/3; the event {1, 5, 6} has probability 3/6 = 1/2.',
          },
        ],
      },
      {
        heading: 'The Multiplication Principle',
        blocks: [
          {
            type: 'text',
            content:
              'When an experiment has multiple stages, the number of possible outcomes is the product of the number of choices at each stage.',
          },
          {
            type: 'example',
            number: '1.4.5',
            title: 'Multiplication Principle',
            body: 'Flipping 3 fair coins and rolling 2 fair dice: there are 2 × 2 × 2 × 6 × 6 = 288 total possible outcomes. The single outcome "HHH66" has probability 1/288.',
          },
          {
            type: 'text',
            content:
              'More generally, if we have k finite sets S₁, …, Sₖ and form sequences (s₁, …, sₖ) with sᵢ ∈ Sᵢ, the total number of such sequences is |S₁| × |S₂| × … × |Sₖ|.',
          },
        ],
      },
      {
        heading: 'Permutations',
        blocks: [
          {
            type: 'text',
            content:
              'A permutation is an ordered selection of distinct elements. From a set of n elements, the number of ordered sequences of length k (with no repetition) is:',
          },
          {
            type: 'formula',
            latex: 'n(n-1)\\cdots(n-k+1) = \\frac{n!}{(n-k)!}',
          },
          {
            type: 'text',
            content: 'When k = n, there are n! permutations of the full set.',
          },
          {
            type: 'example',
            number: '1.4.7',
            title: 'Coat Check',
            body: 'Four friends check coats, which are returned at random. The total arrangements are 4! = 24. Only one arrangement returns every coat to its owner, so the probability all coats are returned correctly is 1/24.',
          },
        ],
      },
      {
        heading: 'Combinations and the Binomial Coefficient',
        blocks: [
          {
            type: 'text',
            content:
              'When order does not matter, we count subsets. The number of subsets of size k from a set of n elements is the binomial coefficient:',
          },
          {
            type: 'formula',
            latex: '\\binom{n}{k} = \\frac{n!}{k!\\,(n-k)!}',
          },
          {
            type: 'text',
            content:
              'The probability of exactly k heads when flipping n fair coins is:',
          },
          {
            type: 'formula',
            latex: 'P(\\text{exactly }k\\text{ heads}) = \\binom{n}{k} 2^{-n} = \\frac{n!}{k!\\,(n-k)!}\\,2^{-n}',
          },
          {
            type: 'text',
            content:
              'More generally, if each coin has probability θ of heads (and 1−θ of tails), then:',
          },
          {
            type: 'formula',
            label: '(1.4.2)',
            latex: 'P(\\text{exactly }k\\text{ heads}) = \\binom{n}{k}\\,\\theta^k(1-\\theta)^{n-k}',
          },
          {
            type: 'example',
            number: '1.4.8',
            title: 'Counting Subsets',
            body: '10 fair coins are flipped. The total number of outcomes is 2¹⁰ = 1024. The number of outcomes with exactly 7 heads is C(10, 7) = 10!/(3! × 7!) = 120. So the probability of exactly 7 heads is 120/1024 ≈ 11.7%.',
          },
        ],
      },
      {
        heading: 'Interactive: Binomial Distribution',
        blocks: [{ type: 'viz', vizId: 'binomial' }],
      },
      {
        heading: 'Multinomial Coefficient',
        blocks: [
          {
            type: 'text',
            content:
              'When dividing n objects into groups of sizes k₁, k₂, …, kₗ (where k₁ + k₂ + … + kₗ = n), the number of ways is the multinomial coefficient:',
          },
          {
            type: 'formula',
            label: '(1.4.4)',
            latex: '\\binom{n}{k_1\\;k_2\\;\\cdots\\;k_l} = \\frac{n!}{k_1!\\,k_2!\\,\\cdots\\,k_l!}',
          },
          {
            type: 'example',
            number: '',
            title: 'Bridge Hands',
            body: 'The number of ways to deal a 52-card deck into four 13-card bridge hands (North, East, South, West) is 52! / (13! × 13! × 13! × 13!) ≈ 5.36 × 10²⁸.',
          },
        ],
      },
    ],
  },

  {
    id: 'conditional-probability',
    title: 'Conditional Probability and Independence',
    chapterRef: 'Chapter 1 · Section 1.5',
    description: 'How new information updates probabilities. Definition of P(A|B), the multiplication formula, Bayes\' theorem, and when events are independent.',
    sections: [
      {
        heading: 'Conditional Probability',
        blocks: [
          {
            type: 'text',
            content:
              'Suppose we flip three fair coins, giving S = {HHH, HHT, HTH, HTT, THH, THT, TTH, TTT} with P(s) = 1/8. Normally P(first coin heads) = 4/8 = 1/2. But if we are told exactly two coins came up heads, we restrict attention to {HHT, HTH, THH}, and among these only HHT and HTH have the first coin as heads — so P(first coin heads | exactly two heads) = 2/3.',
          },
          {
            type: 'definition',
            number: '1.5.1',
            title: 'Conditional Probability',
            text: 'Given two events A and B with P(B) > 0, the conditional probability of A given B is:',
            formula: 'P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}',
          },
          {
            type: 'text',
            content:
              'The ratio P(A ∩ B) / P(B) gives the proportion of times A occurs among the times B occurs. Conditioning on B can either increase or decrease the probability of A.',
          },
        ],
      },
      {
        heading: 'The Multiplication Formula',
        blocks: [
          {
            type: 'text',
            content:
              'Rearranging the definition of conditional probability immediately gives the multiplication formula, which lets us compute joint probabilities from conditional ones:',
          },
          {
            type: 'formula',
            label: '(1.5.2)',
            latex: 'P(A \\cap B) = P(A)\\,P(B \\mid A)',
          },
        ],
      },
      {
        heading: 'Law of Total Probability (Conditioned Version)',
        blocks: [
          {
            type: 'theorem',
            number: '1.5.1',
            title: 'Law of Total Probability (conditioned version)',
            text: 'Let A₁, A₂, … be events forming a partition of S, each of positive probability. Let B be any event. Then:',
            formula: 'P(B) = P(A_1)\\,P(B\\mid A_1) + P(A_2)\\,P(B\\mid A_2) + \\cdots',
          },
          {
            type: 'example',
            number: '1.5.1',
            title: 'Long Hair in a Class',
            body: 'A class is 60% girls and 40% boys. 30% of girls have long hair, 20% of boys have long hair. The probability a randomly chosen student has long hair is P(B) = (0.6)(0.3) + (0.4)(0.2) = 0.18 + 0.08 = 0.26, i.e., 26%.',
          },
        ],
      },
      {
        heading: "Bayes' Theorem",
        blocks: [
          {
            type: 'text',
            content:
              "Bayes' theorem reverses the conditioning: given P(A), P(B), and P(B|A), we can find P(A|B). This is fundamental to Bayesian reasoning.",
          },
          {
            type: 'theorem',
            number: '1.5.2',
            title: "Bayes' Theorem",
            text: 'Let A and B be two events, each of positive probability. Then:',
            formula: 'P(A \\mid B) = \\frac{P(A)}{P(B)}\\,P(B \\mid A)',
          },
          {
            type: 'example',
            number: '1.5.2',
            title: 'Two Urns',
            body: 'Urn #1 has 3 red and 2 blue balls; urn #2 has 4 red and 7 blue balls. An urn is chosen at random (prob. 1/2 each), then one ball is drawn. Given the ball is blue, the conditional probability that urn #2 was chosen is P(A|B) = (1/2)(7/11) / [(1/2)(7/11) + (1/2)(2/5)] = 35/57 ≈ 0.614.',
          },
        ],
      },
      {
        heading: "Interactive: Bayes' Theorem Calculator",
        blocks: [{ type: 'viz', vizId: 'bayes' }],
      },
      {
        heading: 'Independence of Events',
        blocks: [
          {
            type: 'text',
            content:
              'Two events are independent if knowledge of one occurring has no effect on the probability of the other.',
          },
          {
            type: 'definition',
            number: '1.5.2',
            title: 'Independence (two events)',
            text: 'Two events A and B are independent if:',
            formula: 'P(A \\cap B) = P(A)\\,P(B)',
          },
          {
            type: 'text',
            content:
              'Equivalently (when P(A) > 0 and P(B) > 0), A and B are independent if and only if P(A|B) = P(A) or P(B|A) = P(B).',
          },
          {
            type: 'definition',
            number: '1.5.3',
            title: 'Independence (multiple events)',
            text: 'A collection of events A₁, A₂, A₃, … are independent if for any finite subcollection Aᵢ₁, …, Aᵢⱼ of distinct events:',
            formula: 'P(A_{i_1} \\cap \\cdots \\cap A_{i_j}) = P(A_{i_1})\\cdots P(A_{i_j})',
          },
          {
            type: 'text',
            content:
              'Pairwise independence (every pair is independent) is not sufficient for mutual independence — all subset conditions must hold simultaneously.',
          },
        ],
      },
    ],
  },

  {
    id: 'continuity-of-p',
    title: 'Continuity of Probability',
    chapterRef: 'Chapter 1 · Section 1.6',
    description: 'How probability measures behave as sequences of events grow or shrink toward a limit event. The fundamental continuity theorem for probability.',
    sections: [
      {
        heading: 'Sequences of Events',
        blocks: [
          {
            type: 'text',
            content:
              'Suppose A₁, A₂, … is a sequence of events getting "closer" to another event A. We might expect that P(A₁), P(A₂), … converge to P(A). Formalising this requires two notions of convergence for sequences of sets.',
          },
          {
            type: 'text',
            content:
              'We say {Aₙ} increases to A (written {Aₙ} ↗ A) if A₁ ⊆ A₂ ⊆ A₃ ⊆ … and ∪Aₙ = A. This is an increasing sequence of sets whose union is A.',
          },
          {
            type: 'text',
            content:
              'We say {Aₙ} decreases to A (written {Aₙ} ↘ A) if A₁ ⊇ A₂ ⊇ A₃ ⊇ … and ∩Aₙ = A. This is a decreasing sequence of sets whose intersection is A.',
          },
        ],
      },
      {
        heading: 'The Continuity Theorem',
        blocks: [
          {
            type: 'theorem',
            number: '1.6.1',
            title: 'Continuity of Probability',
            text: 'Let A, A₁, A₂, … be events, and suppose that either {Aₙ} ↗ A or {Aₙ} ↘ A. Then:',
            formula: '\\lim_{n \\to \\infty} P(A_n) = P(A)',
          },
          {
            type: 'text',
            content:
              'This theorem says that probability measures are continuous in the sense that taking limits of sets commutes with applying P. It follows from the countable additivity axiom. The result allows us to compute or bound probabilities that would otherwise be inaccessible.',
          },
        ],
      },
      {
        heading: 'Interactive: Convergence Viewer',
        blocks: [{ type: 'viz', vizId: 'continuity' }],
      },
      {
        heading: 'Applications',
        blocks: [
          {
            type: 'example',
            number: '1.6.1',
            title: 'Infinite Sample Space',
            body: 'Suppose S = {1, 2, 3, …} with P({s}) = 2⁻ˢ for all s ∈ S. What is P({5, 6, 7, …})? Let Aₙ = {5, 6, …, n}. Then {Aₙ} ↗ A = {5, 6, 7, …}, so by continuity P(A) = lim P(Aₙ). We compute P(Aₙ) = 2⁻⁵ + … + 2⁻ⁿ = 2⁻⁴ − 2⁻ⁿ → 2⁻⁴ = 1/16.',
            formula: 'P(\\{5,6,7,\\ldots\\}) = 2^{-4} = \\tfrac{1}{16}',
          },
          {
            type: 'example',
            number: '1.6.2',
            title: 'Decreasing Intervals',
            body: 'Let P be some probability measure on S = ℝ. Suppose P((3, 5 + 1/n)) ≥ δ > 0 for all n. Then Aₙ = (3, 5 + 1/n) ↘ A = (3, 5], so by continuity P((3, 5]) ≥ δ > 0 as well. Note however that P({5}) could still be 0.',
          },
          {
            type: 'text',
            content:
              'The proof of Theorem 1.6.1 for increasing sequences proceeds by writing A as a disjoint union A₁ ∪ (A₂ ∩ A₁ᶜ) ∪ (A₃ ∩ A₂ᶜ) ∪ … and applying countable additivity. The decreasing case follows by taking complements and applying the complement rule (Equation 1.3.1).',
          },
        ],
      },
    ],
  },
];

export function getConceptById(id: string): ProbabilityConcept | undefined {
  return probabilityConcepts.find((c) => c.id === id);
}
