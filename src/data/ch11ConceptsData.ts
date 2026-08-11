import type { ContentBlock, ConceptSection, ProbabilityConcept } from './probabilityConceptsData';

export type { ContentBlock, ConceptSection, ProbabilityConcept };

export const ch11Concepts: ProbabilityConcept[] = [

  // ─────────────────────────────────────────────
  // 11.1  Simple Random Walk
  // ─────────────────────────────────────────────
  {
    id: 'simple-random-walk',
    title: 'Simple Random Walk',
    chapterRef: 'Chapter 11 · Section 11.1',
    description:
      'A stochastic process is a sequence X₀, X₁, X₂,… that proceeds randomly in time, where Xₙ can depend on Xₙ₋₁ or earlier values. Simple random walk — repeated $1 gambling — is the simplest interesting example, and it already contains two striking results: the exact distribution of your fortune at any time, and the gambler\'s ruin problem, whose answer is dramatically sensitive to how fair the game really is.',
    hook: 'A casino edge of 0.499 instead of 0.500 looks negligible on a single bet. Play it out from $5,000 toward $10,000 and that tiny edge turns a coin flip into a two-in-a-billion shot — the gambler\'s ruin formula in this section is the reason casinos never need to cheat.',
    sections: [
      {
        heading: 'Random Walk as Repeated Gambling',
        blocks: [
          {
            type: 'text',
            content:
              'Unlike the i.i.d. sequences studied so far, a stochastic process proceeds randomly in time: Xₙ represents some random quantity at time n, and its value may depend on Xₙ₋₁, or even on values Xₘ for other times m < n. Simple random walk models repeated $1 gambling: start with $a, and repeatedly bet $1, winning with probability p and losing with probability q = 1−p on each independent bet. If Xₙ is your fortune after n bets, then X₀ = a, and X₁ is a+1 or a−1 depending on the first bet, and so on.',
          },
          {
            type: 'definition',
            number: '11.1 (model)',
            title: 'Simple Random Walk',
            text: 'Let Z₁, Z₂,… be i.i.d. with P(Zᵢ=1) = p and P(Zᵢ=−1) = 1−p ≡ q, for some 0 < p < 1. Set X₀ = a, and for n ≥ 1 set Xₙ = a + Z₁ + Z₂ + ⋯ + Zₙ. The sequence {Xₙ} is called simple random walk.',
          },
          {
            type: 'example',
            number: '11.1.1',
            body:
              'Take a=8 and p=1/3. Then P(X₁=9) = P(8+Z₁=9) = P(Z₁=1) = 1/3, and P(X₁=7) = P(Z₁=−1) = 2/3, exactly as it should be. For two bets, P(X₂=10) = P(Z₁=Z₂=1) = (1/3)(1/3) = 1/9.',
          },
          {
            type: 'example',
            number: '11.1.2',
            body:
              'Continuing with a=8, p=1/3: P(X₃=7) = P(Z₁+Z₂+Z₃=−1). There are three ways to get a sum of −1 from three ±1 steps — exactly one step is +1 — each with probability (1/3)(2/3)(2/3), so P(X₃=7) = 3·(1/3)(2/3)² = 4/9. Enumerating paths like this becomes impractical once the number of bets grows, which motivates a systematic formula.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch11-random-walk',
          },
        ],
      },
      {
        heading: 'The Distribution of the Fortune',
        blocks: [
          {
            type: 'theorem',
            number: '11.1.1',
            title: 'Distribution of Xₙ',
            text: 'Let {Xₙ} be simple random walk and n a positive integer. If k is an integer with −n ≤ k ≤ n and n+k is even, then P(Xₙ=a+k) = C(n, (n+k)/2)·p^((n+k)/2)·q^((n−k)/2). For all other values of k, P(Xₙ=a+k) = 0. Furthermore, E(Xₙ) = a + n(2p−1).',
          },
          {
            type: 'example',
            number: '11.1.3',
            body:
              'Take p=1/3, n=8, a=1. Then P(X₈=6)=0, since 6=1+5 and n+5=13 is odd. Also P(X₈=13)=0, since 13=1+12 and 12 > n. But P(X₈=5) = C(8,6)·(1/3)⁶(2/3)² = 28·(1/3)⁶(2/3) ≈ 0.0256. And E(X₈) = 1 + 8(2/3−1) = −5/3.',
          },
          {
            type: 'theorem',
            number: 'Corollary 11.1.1',
            title: 'Fair, Subfair, and Superfair Games',
            text: 'If p=1/2, then E(Xₙ)=a for all n≥0 (a fair game — your expected fortune never changes). If p<1/2, then E(Xₙ)<a for all n≥1 (subfair — your opponent has the edge, and expected fortune decreases). If p>1/2, then E(Xₙ)>a for all n≥1 (superfair — your expected fortune increases).',
          },
          {
            type: 'text',
            content:
              'In a real casino the game is always subfair, which is exactly why the average amount of money a gambler leaves with is always less than what they walked in with.',
          },
          {
            type: 'example',
            number: '11.1.4',
            body:
              'With a=10 and p=1/4, E(Xₙ) = 10 + n(2(1/4)−1) = 10 − 3n/4. This is never more than $10, and turns negative once n ≥ 14 — after 14 or more bets, your expected fortune is actually negative.',
          },
          {
            type: 'predict',
            title: 'The "double \'til you win" strategy',
            question: 'Suppose you bet $1, and every time you lose you double your next bet, stopping the moment you win. Does this guarantee you end up ahead, even if p < 1/2?',
            reveal: 'Yes — with probability 1 you end up $1 ahead of where you started, for any p > 0, since a win must eventually happen and the moment it does you recover every previous loss plus $1. This looks like "cheating fate," and in a real sense it is: it requires potentially unlimited capital to survive a long losing streak before that first win arrives. With only finite capital available (as in any real casino), it becomes impossible to guarantee this outcome — the strategy is a mathematical curiosity, not a way to beat a subfair game in practice.',
          },
        ],
      },
      {
        heading: "The Gambler's Ruin Problem",
        blocks: [
          {
            type: 'text',
            content:
              'The previous results describe Xₙ at one fixed time n. The gambler\'s ruin problem instead asks about the whole evolution of the process: starting from $a and repeatedly betting $1, what is the probability you reach a target fortune $c before going completely broke? Formally, let τ₀ = min{n≥0 : Xₙ=0} and τ_c = min{n≥0 : Xₙ=c} be the first hitting times of 0 and c. The question is: what is P(τ_c < τ₀)?',
          },
          {
            type: 'theorem',
            number: '11.1.2',
            title: "Gambler's Ruin",
            text: 'Let {Xₙ} be simple random walk with initial fortune a and win probability p, and assume 0 < a < c. Then P(τ_c<τ₀) = a/c if p=1/2, and P(τ_c<τ₀) = [1−(q/p)^a] / [1−(q/p)^c] if p≠1/2.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch11-gamblers-ruin',
          },
          {
            type: 'example',
            number: '11.1.6',
            body:
              'Start with $5 (a=5), aiming for $10 (c=10). At p=0.500, success probability is a/c=0.500. At p=0.499, it works out to about 0.495; at p=0.501, about 0.505. Small changes in p near 1/2 lead to only small changes in the ruin probability at this modest scale.',
          },
          {
            type: 'example',
            number: '11.1.7',
            body:
              'Now start with $5000 aiming for $10,000 — the same 1:2 ratio as before, just 1000× larger. At p=0.500, success probability is still 0.500. But at p=0.499, it collapses to about 2×10⁻⁹ — two chances in a billion. At p=0.501, it is extremely close to 1. Small changes in p near 1/2 now produce enormous changes in the outcome, because reaching $10,000 from $5,000 requires many, many bets, and a tiny per-bet edge compounds over that length into an overwhelming advantage or disadvantage.',
          },
          {
            type: 'text',
            content:
              'The gambler\'s ruin formula also answers a related question: will the walk ever hit 0 at all, if we remove the upper target c entirely?',
          },
          {
            type: 'theorem',
            number: '11.1.3',
            title: 'Probability of Eventual Ruin',
            text: 'Let {Xₙ} be simple random walk with initial fortune a>0 and win probability p. Then P(τ₀<∞) = 1 if p≤1/2, and P(τ₀<∞) = (q/p)^a if p>1/2.',
          },
          {
            type: 'example',
            number: '11.1.8',
            body:
              'With a=2 and p=2/3, the probability of eventually losing everything is (q/p)^a = ((1/3)/(2/3))² = 1/4. So 3/4 of the time, starting with just $2 in a superfair game, you will be able to bet forever without ever going broke. But if p≤1/2 — a fair or subfair game — ruin is certain eventually, no matter how large a is.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 11.2  Markov Chains
  // ─────────────────────────────────────────────
  {
    id: 'markov-chains',
    title: 'Markov Chains',
    chapterRef: 'Chapter 11 · Section 11.2',
    description:
      'A Markov chain generalises simple random walk to arbitrary state spaces and arbitrary jump rules: at each step, the chain jumps from its current state to a new one according to fixed transition probabilities that depend only on where it is now, never on how it got there. This section builds the machinery for computing multi-step probabilities and introduces stationary distributions — the probability distributions a chain can settle into and never leave.',
    hook: 'The defining trick of a Markov chain is total amnesia: the chain never needs to remember its history, only where it stands right now. That one restriction is what makes an otherwise impossibly complicated random process solvable with nothing more than matrix multiplication.',
    sections: [
      {
        heading: 'Definition and Examples',
        blocks: [
          {
            type: 'text',
            content:
              'A Markov chain requires a state space S — the set of all places the object can go (e.g. S={1,2,3}, or S={top,bottom}, or all positive integers) — and transition probabilities: for i,j ∈ S, the number pᵢⱼ is the probability that, if the object is currently at i, it will next jump to j.',
          },
          {
            type: 'formula',
            latex: '\\{p_{ij} : i,j \\in S\\}, \\qquad p_{ij} \\ge 0, \\qquad \\sum_{j \\in S} p_{ij} = 1 \\text{ for each } i \\in S',
            label: 'Transition probabilities out of any state must sum to 1',
          },
          {
            type: 'text',
            content:
              'We also need an initial distribution {μᵢ : i∈S}, with μᵢ = P(X₀=i), μᵢ≥0, and Σμᵢ=1 (or simply X₀=s for a fixed starting state s). In terms of the sequence X₀,X₁,X₂,…, the defining Markov property is that the next jump depends only on the current state, never on the path taken to get there.',
          },
          {
            type: 'formula',
            latex: 'P(X_{n+1}=j \\mid X_n=i,\\, X_{n-1}=x_{n-1},\\dots,X_0=x_0) = P(X_{n+1}=j \\mid X_n=i) = p_{ij}',
            label: 'The Markov property — the future depends on the past only through the present',
          },
          {
            type: 'text',
            content:
              'The transition probabilities are conveniently written as a stochastic matrix (pᵢⱼ) — a square matrix with nonnegative entries whose rows each sum to 1.',
          },
          {
            type: 'example',
            number: '11.2.3',
            title: 'Bedroom, Kitchen, Den',
            body:
              'With S={bedroom, kitchen, den}, the transition matrix ((1/4,1/4,1/2),(0,0,1),(0.01,0.01,0.98)) defines a Markov chain where, from the bedroom, there is probability 1/4 of staying, 1/4 of moving to the kitchen, and 1/2 of moving to the den — while from the kitchen, the chain always moves straight to the den.',
          },
          {
            type: 'example',
            number: '11.2.6',
            title: 'Random Walk on the Circle',
            body:
              'Let S={0,1,…,d−1} arranged in a circle. Define pᵢᵢ=1/3, and pᵢⱼ=1/3 whenever j is one step clockwise or counter-clockwise from i (wrapping around the corner from d−1 to 0). At each step, the object stays put, moves one step clockwise, or moves one step counter-clockwise, each with probability 1/3.',
          },
          {
            type: 'example',
            number: "11.2.7",
            title: "Ehrenfest's Urn",
            body:
              'Two urns share d balls total; Xₙ is the number of balls in urn #1 at time n, so there are d−Xₙ in urn #2. Each step, one ball is chosen uniformly at random from all d balls and switched to the other urn. If there are i balls in urn #1, there is probability i/d of choosing one of them (moving to i−1), giving pᵢ,ᵢ₋₁=i/d, and probability (d−i)/d of choosing from urn #2 (moving to i+1), giving pᵢ,ᵢ₊₁=(d−i)/d. Intuitively, if d is large and the chain runs a long time, we would expect somewhere around d/2 balls in urn #1 — a question about long-run behaviour that stationary distributions, below, make precise.',
          },
          {
            type: 'example',
            number: '11.2.8',
            title: 'Simple Random Walk as a Markov Chain',
            body:
              'Simple random walk from Section 11.1 is itself a Markov chain, on the infinite state space S = {…,−2,−1,0,1,2,…}: fixing X₀=a and 0<p<1, set pᵢ,ᵢ₊₁=p and pᵢ,ᵢ₋₁=1−p for every i, with pᵢⱼ=0 whenever j≠i±1. Markov chains on infinite state spaces are just as important as those on finite ones — random walk is the running example throughout this chapter.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch11-markov-steps',
          },
        ],
      },
      {
        heading: 'Computing with Markov Chains',
        blocks: [
          {
            type: 'theorem',
            number: '11.2.1',
            text: 'Consider a Markov chain {Xₙ} with state space S, transition probabilities {pᵢⱼ}, and initial distribution {μᵢ}. Then for any i∈S, P(X₁=i) = Σ_{k∈S} μₖpₖᵢ.',
          },
          {
            type: 'example',
            number: '11.2.10',
            body:
              'With S={1,2,3}, transition matrix ((1/4,1/4,1/2),(1/3,1/3,1/3),(0.01,0.01,0.98)), and initial distribution P(X₀=1)=1/7, P(X₀=2)=2/7, P(X₀=3)=4/7: P(X₁=3) = (1/7)(1/2) + (2/7)(1/3) + (4/7)(0.98) = 0.73. About 73% of the time, this chain will be in state 3 after just one step.',
          },
          {
            type: 'text',
            content:
              'Writing Pᵢ(A) = P(A|X₀=i) for probabilities assuming the chain starts at i, we build up formulas for two, three, and eventually n steps. For n=1, Pᵢ(X₁=j)=pᵢⱼ directly.',
          },
          {
            type: 'theorem',
            number: '11.2.2',
            text: 'Pᵢ(X₁=k, X₂=j) = pᵢₖpₖⱼ.',
          },
          {
            type: 'theorem',
            number: '11.2.3',
            text: 'Pᵢ(X₂=j) = Σ_{k∈S} pᵢₖpₖⱼ.',
          },
          {
            type: 'example',
            number: '11.2.11',
            body:
              'For the chain with p₁₁=0, p₁₂=p₁₃=1/2, p₂₁=p₂₂=p₂₃=1/3, p₃₁=p₃₂=1/4, p₃₃=1/2: P₁(X₂=3) = p₁₁p₁₃+p₁₂p₂₃+p₁₃p₃₃ = 0+(1/2)(1/3)+(1/2)(1/2) = 5/12.',
          },
          {
            type: 'theorem',
            number: '11.2.4',
            title: 'The General n-Step Formula',
            text: 'Pᵢ(Xₙ=j) = Σ over all intermediate states i₁,i₂,…,iₙ₋₁∈S of pᵢᵢ₁pᵢ₁ᵢ₂pᵢ₂ᵢ₃⋯pᵢₙ₋₂ᵢₙ₋₁pᵢₙ₋₁ⱼ — summing the probability of every possible n-step path from i to j.',
          },
          {
            type: 'example',
            number: '11.2.12',
            body:
              'For the same chain, P₁(X₃=3), summed over all length-3 paths from state 1 to state 3, works out to 31/72 — the computation gets messy quickly by hand, which is exactly why the matrix formulation below is so useful.',
          },
          {
            type: 'text',
            content:
              'Writing A for the matrix (pᵢⱼ) and v₀ for the row vector (μᵢ)=(P(X₀=i)), Theorem 11.2.1 becomes the matrix equation v₁=v₀A — the distribution after one step is the initial distribution multiplied by the transition matrix. By induction, vₙ₊₁=vₙA for every n, so vₙ=v₀Aⁿ. Theorem 11.2.4 then has a clean interpretation: Pᵢ(Xₙ=j) is exactly the (i,j) entry of the n-th matrix power Aⁿ.',
          },
          {
            type: 'formula',
            latex: 'v_n = v_0 A^n, \\qquad P_i(X_n=j) = (A^n)_{ij}',
            label: 'The n-step distribution and n-step transition probabilities, as matrix powers',
          },
        ],
      },
      {
        heading: 'Stationary Distributions',
        blocks: [
          {
            type: 'text',
            content:
              'Suppose {πᵢ : i∈S} is a probability distribution on S. It is natural to ask whether this distribution, once reached, could persist forever.',
          },
          {
            type: 'definition',
            number: '11.2.1',
            title: 'Stationary Distribution',
            text: 'The distribution {πᵢ : i∈S} is stationary for a Markov chain with transition probabilities {pᵢⱼ} on a state space S if Σ_{i∈S} πᵢpᵢⱼ = πⱼ for all j∈S.',
          },
          {
            type: 'theorem',
            number: '11.2.5',
            text: 'Suppose {πᵢ} is a stationary distribution for a Markov chain with transition probabilities {pᵢⱼ}. Suppose that for some integer n, P(Xₙ=i)=πᵢ for all i∈S. Then also P(Xₙ₊₁=i)=πᵢ for all i∈S.',
          },
          {
            type: 'text',
            content:
              'By induction (Corollary 11.2.1), once a Markov chain\'s distribution matches a stationary distribution at any single time n, it matches that same distribution at every later time as well — once in the distribution {πᵢ}, the chain stays in the distribution {πᵢ} forever.',
          },
          {
            type: 'example',
            number: '11.2.14',
            body:
              'With S={0,1} and transition matrix ((0.1,0.9),(0.6,0.4)), a stationary distribution must satisfy π₀(0.1)+π₁(0.6)=π₀ and π₀(0.9)+π₁(0.4)=π₁. The first equation gives π₁=(3/2)π₀; combined with π₀+π₁=1, this gives π₀=2/5 and π₁=3/5 — and these values do satisfy both original equations.',
          },
          {
            type: 'example',
            number: '11.2.15',
            title: 'Doubly Stochastic Matrices',
            body:
              'With S={1,2,3} and transition matrix ((0,1/2,1/2),(1/2,0,1/2),(1/2,1/2,0)), every column also sums to 1 (not just every row) — such a matrix is called doubly stochastic. Taking π₁=π₂=π₃=1/3 (the uniform distribution) gives Σᵢπᵢpᵢⱼ = (1/3)Σᵢpᵢⱼ = (1/3)(1) = πⱼ for every j, so the uniform distribution is always stationary whenever the transition matrix is doubly stochastic.',
          },
          {
            type: 'example',
            number: '11.2.16',
            body:
              'With S={1,2,3} and transition matrix ((1/2,1/4,1/4),(1/3,1/3,1/3),(0,1/4,3/4)), setting up the three balance equations πⱼ=Σᵢπᵢpᵢⱼ and solving alongside π₁+π₂+π₃=1 gives the unique stationary distribution π₁=2/11, π₂=3/11, π₃=6/11.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch11-stationary-balance',
          },
          {
            type: 'predict',
            title: "Ehrenfest's urn, revisited",
            question: 'For Ehrenfest\'s urn (Example 11.2.7) with d balls, intuition suggests the long-run distribution of balls in urn #1 should cluster around d/2. Does that intuition require finding a stationary distribution, or could it be true without one existing?',
            reveal: 'It requires a stationary distribution to exist and to be concentrated near d/2. Definition 11.2.1 only tells us how to check whether a candidate distribution is stationary, not that one must exist or that the chain must approach it — establishing existence, uniqueness, and convergence toward a stationary distribution is exactly the kind of question addressed by the limiting-distribution theory that follows this section (not covered in this excerpt of the chapter).',
          },
        ],
      },
    ],
  },

];

export function getCh11ConceptById(id: string): ProbabilityConcept | undefined {
  return ch11Concepts.find(c => c.id === id);
}
