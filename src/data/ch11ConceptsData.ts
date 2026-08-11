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
            type: 'example',
            number: '11.2.17',
            title: 'Random Walk on the Circle, Revisited',
            body:
              'For any state j in Example 11.2.6, exactly three states i satisfy pᵢⱼ=1/3 (namely j itself, and its two neighbours), so Σᵢpᵢⱼ=1 — the transition matrix is doubly stochastic. As in Example 11.2.15, the uniform distribution πᵢ=1/d for every i is therefore stationary.',
          },
        ],
      },
      {
        heading: 'Reversibility',
        blocks: [
          {
            type: 'text',
            content:
              'Solving the balance equations πⱼ=Σᵢπᵢpᵢⱼ directly, as in Example 11.2.16, gets messy fast for larger state spaces. A useful shortcut works whenever a much stronger, cell-by-cell balance holds.',
          },
          {
            type: 'definition',
            number: '11.2.2',
            title: 'Reversibility',
            text: 'A Markov chain is reversible with respect to a distribution {πᵢ} if, for all i,j∈S, πᵢpᵢⱼ = πⱼpⱼᵢ.',
          },
          {
            type: 'theorem',
            number: '11.2.6',
            text: 'If a Markov chain is reversible with respect to {πᵢ}, then {πᵢ} is a stationary distribution for the chain.',
          },
          {
            type: 'text',
            content:
              'The proof is immediate: Σᵢπᵢpᵢⱼ = Σᵢπⱼpⱼᵢ = πⱼΣᵢpⱼᵢ = πⱼ(1) = πⱼ, using reversibility on the first step and Σᵢpⱼᵢ=1 on the last. Reversibility is a stronger, easier-to-check condition than plain stationarity — it replaces one global balance equation per state with a simple pairwise check.',
          },
          {
            type: 'example',
            number: '11.2.18',
            title: "Ehrenfest's Urn via Reversibility",
            body:
              'It is not obvious what the stationary distribution of Ehrenfest\'s urn (Example 11.2.7) should be — but thinking about each ball individually, each one usually stays put but occasionally flips urns, so in the long run each ball should be equally likely to be in either urn. This suggests the total count in urn #1 is Binomial(d,1/2): πᵢ = C(d,i)/2^d. Checking reversibility directly (using the identity C(d,i+1)=C(d,i)·(d−i)/(i+1), a form of Pascal\'s triangle) confirms πᵢpᵢ,ᵢ₊₁ = πᵢ₊₁pᵢ₊₁,ᵢ for every i — so the chain is reversible with respect to this Binomial(d,1/2) distribution, which is therefore stationary. This confirms the intuition from Example 11.2.7 that, run for a long time, Ehrenfest\'s urn tends to have close to d/2 balls in each urn.',
          },
          {
            type: 'example',
            number: '11.2.19',
            title: 'A Birth-Death Chain',
            body:
              'For S={1,2,3,4,5} with pᵢ,ᵢ₊₁=2/3 and pᵢ,ᵢ₋₁=1/3 (a chain that can only move one step at a time — a "birth-death chain"), reversibility requires πᵢpᵢ,ᵢ₊₁=πᵢ₊₁pᵢ₊₁,ᵢ, i.e. πᵢ(2/3)=πᵢ₊₁(1/3), so πᵢ₊₁=2πᵢ. This recursion gives πᵢ ∝ 2ⁱ, and normalizing over i=1,…,5 pins down the constant exactly — far less work than solving five simultaneous balance equations directly.',
          },
          {
            type: 'predict',
            title: 'When reversibility cannot be used',
            question: 'The chain of Example 11.2.16 (with p₃₁=0 but p₁₃=1/4) has a stationary distribution π=(2/11,3/11,6/11). Is this chain reversible with respect to π?',
            reveal: 'No. Reversibility requires π₁p₁₃=π₃p₃₁ for every pair, but p₃₁=0 while p₁₃=1/4≠0 and π₁,π₃>0, so π₁p₁₃≠π₃p₃₁=0. The chain is stationary with respect to π (Theorem 11.2.5 style balance holds in aggregate), just not reversible — reversibility is a sufficient, not necessary, condition for stationarity, and Example 11.2.16 is exactly the kind of case where the balance equations must be solved directly instead.',
          },
        ],
      },
      {
        heading: 'Irreducibility, Periodicity, and the Convergence Theorem',
        blocks: [
          {
            type: 'text',
            content:
              'A stationary distribution, once reached, persists forever (Theorem 11.2.5) — but does a chain run for a long time actually approach its stationary distribution, regardless of where it started? Not always, as the next two examples show.',
          },
          {
            type: 'example',
            number: '11.2.20',
            body:
              'With S={1,2} and pᵢⱼ = identity matrix (p₁₁=p₂₂=1, p₁₂=p₂₁=0), the chain never moves at all. Starting at X₀=1, we have Pᵢ(Xₙ=1)=1 for every n, even though π=(1/2,1/2) is a valid stationary distribution — the chain never approaches π because it never goes anywhere.',
          },
          {
            type: 'example',
            number: '11.2.21',
            body:
              'With S={1,2} and p₁₂=p₂₁=1, p₁₁=p₂₂=0, the chain deterministically alternates 1,2,1,2,…. Starting at X₀=1, P₁(Xₙ=1)=1 for even n and 0 for odd n — this never settles down to the stationary π=(1/2,1/2) either, since it oscillates forever instead of converging.',
          },
          {
            type: 'text',
            content:
              'Two properties rule out exactly these failure modes.',
          },
          {
            type: 'definition',
            number: '11.2.3',
            title: 'Irreducibility',
            text: 'A Markov chain is irreducible if it is possible to move from any state to any other state — equivalently, for any i,j∈S there is a positive integer n with Pᵢ(Xₙ=j) > 0.',
          },
          {
            type: 'text',
            content:
              'Example 11.2.20\'s chain is not irreducible (you can never leave state 1 once there). A chain can still be irreducible even if some single-step transitions are impossible, as long as a longer path exists.',
          },
          {
            type: 'example',
            number: '11.2.22',
            body:
              'With p₁₃=0 but p₁₂>0 and p₂₃>0, it is impossible to reach state 3 from state 1 in one step — but going 1→2→3 works, so the chain can still be irreducible.',
          },
          {
            type: 'definition',
            number: '11.2.4 & 11.2.5',
            title: 'Period and Aperiodicity',
            text: 'The period of state i is the greatest common divisor of {n≥1 : Pᵢ(Xₙ=i)>0} — the set of times at which it is possible to return to i. A Markov chain is aperiodic if every state has period 1.',
          },
          {
            type: 'example',
            number: '11.2.24',
            body:
              'With S={1,2,3} and a chain forced to cycle 1→2→3→1→2→3→⋯ deterministically, the only way to return to state 1 is after a multiple of 3 steps — the period is 3, and the chain is not aperiodic.',
          },
          {
            type: 'theorem',
            number: '11.2.7',
            text: 'If pᵢⱼ > 0 for all i,j∈S, then the chain is both irreducible and aperiodic.',
          },
          {
            type: 'text',
            content:
              'This gives an easy sufficient (though not necessary) condition: if every transition probability is strictly positive, both good properties come for free. We can now state the central result of this section.',
          },
          {
            type: 'theorem',
            number: '11.2.8',
            title: 'Markov Chain Convergence Theorem',
            text: 'Suppose a Markov chain is irreducible and aperiodic and has a stationary distribution {πᵢ}. Then, regardless of the initial distribution {μᵢ}, lim_{n→∞} P(Xₙ=i) = πᵢ for every state i.',
          },
          {
            type: 'text',
            content:
              'This is a remarkable strengthening of Theorem 11.2.5: not only does the chain stay at its stationary distribution once there, but for essentially any well-behaved chain (irreducible and aperiodic), it gets arbitrarily close to that stationary distribution no matter where it starts. This is exactly the property Section 11.3\'s Markov chain Monte Carlo method exploits: run any such chain long enough, and its distribution becomes an arbitrarily good approximation to {πᵢ}.',
          },
          {
            type: 'example',
            number: '11.2.28',
            title: 'Putting It Together',
            body:
              'For the chain of Example 11.2.16 (π=(2/11,3/11,6/11)), the transition matrix has some zero entries (p₃₁=0), so Theorem 11.2.7 does not directly apply — but P₃(X₂=1)=p₃₂p₂₁>0 shows the chain is still irreducible, and checking that returns to state 3 are possible after both 2 and 3 steps (whose gcd is 1) confirms it is aperiodic too. By Theorem 11.2.8, lim_{n→∞}P(Xₙ=1)=2/11, lim_{n→∞}P(Xₙ=2)=3/11, and lim_{n→∞}P(Xₙ=3)=6/11 — so after, say, 500 steps, we would expect the chain\'s distribution to already be extremely close to (2/11, 3/11, 6/11), regardless of where it started.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch11-markov-steps',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 11.3  Markov Chain Monte Carlo
  // ─────────────────────────────────────────────
  {
    id: 'markov-chain-monte-carlo',
    title: 'Markov Chain Monte Carlo',
    chapterRef: 'Chapter 11 · Section 11.3',
    description:
      'For most probability distributions there is no easy, direct way to generate a random sample on a computer. Markov chain Monte Carlo sidesteps the problem entirely: build any convenient Markov chain whose stationary distribution happens to be the one you want, run it for a long time, and — by the convergence theorem of Section 11.2 — its state becomes an arbitrarily good approximate sample.',
    hook: 'You almost never need to know how to sample from a distribution directly — you only need a Markov chain that happens to have it as a stationary distribution. The Metropolis–Hastings algorithm builds that chain for you, out of almost any distribution you can name.',
    sections: [
      {
        heading: 'Why Markov Chain Monte Carlo?',
        blocks: [
          {
            type: 'text',
            content:
              'Ordinary Monte Carlo methods (see [[simulating-distributions|Section 2.10]] and [[monte-carlo-approx|Section 4.5]]) estimate a quantity A=E(h(Z)) by generating i.i.d. Y₁,…,Yₘ with the same distribution as Z and averaging h(Y₁),…,h(Yₘ). The catch: for many distributions — especially unusual, non-standard ones defined only up to an unknown normalising constant — there is no simple way to generate such i.i.d. samples directly.',
          },
          {
            type: 'example',
            number: '11.3.1',
            body:
              'Let Z take integer values with P(Z=j) = C·j²·(1/4)^|j|·e^{-3|j|}·cos²(j), where C is whatever constant makes the probabilities sum to 1. Computing E(Z²−20)² directly by ordinary Monte Carlo would require generating i.i.d. samples with this exact distribution — but it is not even easy to compute C, let alone simulate from the distribution.',
          },
          {
            type: 'text',
            content:
              'The key insight: suppose we can build a Markov chain on the same state space that is irreducible, aperiodic, and has exactly this distribution {πⱼ} as its stationary distribution. By the convergence theorem ([[markov-chains|Theorem 11.2.8]]), running the chain for a long time N gives P(X_N=j) ≈ πⱼ for every j — so X_N behaves almost exactly like a genuine random draw from {πⱼ}, even though no direct sampling method was ever used.',
          },
          {
            type: 'theorem',
            number: '11.3.1 & 11.3.2',
            title: 'The Markov Chain Monte Carlo Method',
            text: 'Suppose we want to estimate A=E(h(Z)) where P(Z=j)=πⱼ. If X₀,X₁,…,X_N is generated from a Markov chain that is irreducible, aperiodic, and has {πⱼ} as its stationary distribution, then for large N, h(X_N) approximates a draw from h(Z). Running M independent such chains and averaging h(X_N^{[1]}),…,h(X_N^{[M]}) approximates A for large M and N (Theorem 11.3.1). More commonly, a single long chain is run instead, averaging h(X_i) over i=B+1,…,N after discarding an initial "burn-in" period of B steps to reduce the influence of the starting value (Theorem 11.3.2).',
          },
          {
            type: 'text',
            content:
              'This still leaves the seemingly hard problem of constructing a Markov chain with a specific, possibly very complicated, stationary distribution. Remarkably, this turns out to be easy.',
          },
        ],
      },
      {
        heading: 'The Metropolis–Hastings Algorithm',
        blocks: [
          {
            type: 'text',
            content:
              'Given a target distribution {πᵢ} on a state space S, choose any simple proposal Markov chain {qᵢⱼ} on S (it need not have {πᵢ} as a stationary distribution, or even have one at all). Given Xₙ=i, the Metropolis–Hastings algorithm generates Xₙ₊₁ in two stages: propose a new state, then accept or reject it.',
          },
          {
            type: 'definition',
            number: '11.3 (algorithm)',
            title: 'Metropolis–Hastings Algorithm',
            text: '1. Propose Yₙ₊₁=j according to the proposal chain qᵢⱼ. 2. Compute the acceptance probability αᵢⱼ = min(1, [πⱼqⱼᵢ] / [πᵢqᵢⱼ]). 3. With probability αᵢⱼ, accept: set Xₙ₊₁=j. Otherwise reject: set Xₙ₊₁=i (stay put).',
          },
          {
            type: 'theorem',
            number: '11.3.3',
            text: 'The Markov chain produced by the Metropolis–Hastings algorithm has {πᵢ} as a stationary distribution — in fact, it is reversible with respect to {πᵢ} (see Section 11.7 for the proof).',
          },
          {
            type: 'viz',
            vizId: 'viz-ch11-metropolis',
          },
          {
            type: 'text',
            content:
              'The genius of the acceptance ratio αᵢⱼ is that any unknown normalising constant in πᵢ cancels out completely — only the ratio πⱼ/πᵢ ever appears, so the algorithm works even when the constant C in Example 11.3.1 is unknown or impossible to compute.',
          },
          {
            type: 'example',
            number: '11.3.3',
            body:
              'For the distribution of Example 11.3.1, take the proposal to be simple random walk with p=1/2 (propose i+1 or i−1, each with probability 1/2). Because qᵢⱼ=qⱼᵢ=1/2 whenever a move is proposed at all, the acceptance probability simplifies to αᵢⱼ = min(1, πⱼ/πᵢ) — the unknown constant C cancels from both the numerator and denominator, leaving something any computer can evaluate instantly.',
          },
          {
            type: 'example',
            number: '11.3.5',
            title: 'A Continuous Target Distribution',
            body:
              'The algorithm extends to continuous distributions using densities in place of probabilities. To sample (approximately) from a distribution with density proportional to f(y)=e^{-y⁴}(1+y²) on ℝ, take the proposal to be Yₙ₊₁ ~ N(Xₙ,1) (a Normal step centred at the current value). The acceptance probability becomes α(x,y) = min(1, f(y)/f(x)) — again, no need to know the normalising constant of f.',
          },
          {
            type: 'predict',
            title: 'A proposal that never moves far',
            question: 'In Example 11.3.5, what would happen to the Metropolis–Hastings chain\'s efficiency if the proposal variance were shrunk from N(x,1) to N(x,0.0001)?',
            reveal: 'Nearly every proposal would be accepted (since y stays extremely close to x, f(y)/f(x)≈1), but the chain would then explore the state space extremely slowly — each step barely moves, so it would take an enormous number of iterations N to adequately cover the target distribution. This is the fundamental Metropolis–Hastings tuning tradeoff: too large a proposal step and most proposals get rejected (the chain rarely moves); too small a step and proposals are always accepted but barely explore anything. A well-tuned proposal balances the two.',
          },
        ],
      },
      {
        heading: 'The Gibbs Sampler',
        blocks: [
          {
            type: 'text',
            content:
              'For multivariate distributions, the Gibbs sampler is a specialised version of Metropolis–Hastings, designed so that the acceptance probability is always exactly 1 — no proposal is ever rejected. For a bivariate state i=(i₁,i₂), the idea is to alternate: propose a new value with the same second coordinate (moving along the "vertical line" through i, drawn from the true conditional distribution given i₂), always accept it, then propose a new value with the same first coordinate (moving "horizontally", drawn from the conditional distribution given the new first coordinate), and always accept that too.',
          },
          {
            type: 'text',
            content:
              'Because each proposal is drawn from the exact conditional distribution of the coordinate being updated, the Metropolis–Hastings acceptance ratio for each half-step algebraically simplifies to exactly 1 — every proposal is accepted, and the chain does a "zigzag" walk through the state space, alternately updating one coordinate then the other from its exact conditional distribution.',
          },
          {
            type: 'theorem',
            number: '11.3.4',
            text: 'The Gibbs sampler produces a Markov chain that has the target joint distribution {πᵢ} as a stationary distribution.',
          },
          {
            type: 'text',
            content:
              'This is exactly the Gibbs sampling method used for Bayesian computation in [[bayesian-computations|Section 7.3.3]] — the Gibbs sampler is not a separate technique from Metropolis–Hastings, but a particular, rejection-free special case of it, tailor-made for multivariate targets whose full conditional distributions are easy to sample from directly.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 11.4  Martingales
  // ─────────────────────────────────────────────
  {
    id: 'martingales',
    title: 'Martingales',
    chapterRef: 'Chapter 11 · Section 11.4',
    description:
      'A martingale is a stochastic process that "stays the same on average" — its expected next value, given everything known now, always equals its current value. This simple property, combined with the optional stopping theorem, turns some genuinely hard problems (like gambler\'s ruin) into a few lines of algebra.',
    hook: 'The gambler\'s ruin formula took a page of careful casework to derive in Section 11.1. With martingale theory it takes three lines — proof that sometimes the right abstraction does almost all the work for you.',
    sections: [
      {
        heading: 'Definition and Examples',
        blocks: [
          {
            type: 'text',
            content:
              'Consider fair simple random walk (p=1/2), stopped the moment it hits either 0 or c, starting from a with 0<a<c. By the gambler\'s ruin formula, P(hit c)=a/c, so E(final fortune) = c·(a/c) + 0·(1−a/c) = a — exactly the starting value. This is no accident: because the game is fair, the fortune "stays the same on average" at every single step, not just at the end.',
          },
          {
            type: 'definition',
            number: '11.4.1',
            title: 'Martingale',
            text: 'A Markov chain {Xₙ} is a martingale if E(Xₙ₊₁−Xₙ | Xₙ) = 0 for every n — on average, the chain\'s value does not change, regardless of its current value.',
          },
          {
            type: 'example',
            number: '11.4.1 & 11.4.2',
            body:
              'Simple random walk with p=1/2: Xₙ₊₁−Xₙ is +1 or −1 with equal probability, so E(Xₙ₊₁−Xₙ|Xₙ) = (1/2)(1)+(1/2)(−1) = 0 — a martingale. But with p=2/3: E(Xₙ₊₁−Xₙ|Xₙ) = (2/3)(1)+(1/3)(−1) = 1/3 ≠ 0 — not a martingale, since the walk drifts upward on average.',
          },
          {
            type: 'example',
            number: '11.4.3',
            body:
              'Starting at 5, at each step add 3 with probability 1/4 or subtract 1 with probability 3/4. Then E(Xₙ₊₁−Xₙ|Xₙ) = (1/4)(3)+(3/4)(−1) = 3/4−3/4 = 0 — this is a martingale even though the two possible jumps (+3 and −1) are wildly asymmetric, because the probabilities were chosen to exactly balance them out.',
          },
          {
            type: 'example',
            number: '11.4.4',
            title: 'A Martingale Built from a Non-Martingale',
            body:
              'General simple random walk (any p) is not a martingale unless p=1/2, since E(Xₙ₊₁−Xₙ|Xₙ)=2p−1≠0 otherwise. But define Zₙ=(q/p)^{Xₙ}. Increasing Xₙ by 1 multiplies Zₙ by q/p (probability p), while decreasing it multiplies Zₙ by p/q (probability q). Computing E(Zₙ₊₁|Zₙ) shows the two effects exactly cancel: E(Zₙ₊₁−Zₙ|Zₙ)=0 for every p — so Zₙ is a martingale regardless of p, even though Xₙ itself generally is not. This transformed process turns out to be exactly the right tool for solving gambler\'s ruin when p≠1/2.',
          },
        ],
      },
      {
        heading: 'Expected Values and Stopping Times',
        blocks: [
          {
            type: 'theorem',
            number: '11.4.1',
            text: 'If {Xₙ} is a martingale with X₀=a, then E(Xₙ)=a for every n.',
          },
          {
            type: 'example',
            number: '11.4.6',
            body:
              'Start at 10; at each step add 2 (probability 1/3) or subtract 1 (probability 2/3). Since E(Xₙ₊₁−Xₙ|Xₙ) = (1/3)(2)+(2/3)(−1) = 0, this is a martingale, so E(X₂₅)=X₀=10 — without any computation about the 25 individual steps.',
          },
          {
            type: 'text',
            content:
              'Theorem 11.4.1 tells us E(Xₙ)=a at any fixed time n — but it would be even more useful to know E(X_T)=a at a random time T, such as the first time the chain hits some target value. This requires T to not "look into the future."',
          },
          {
            type: 'definition',
            number: '11.4.2',
            title: 'Stopping Time',
            text: 'A random variable T taking values in {0,1,2,…} is a stopping time for {Xₙ} if, for every m, the event {T=m} depends only on X₀,…,Xₘ — never on future values Xₘ₊₁,Xₘ₊₂,….',
          },
          {
            type: 'example',
            number: '11.4.7',
            body:
              'The first hitting time τ_b=min{n≥0 : Xₙ=b} is a stopping time — deciding whether τ_b=m only requires knowing X₀,…,Xₘ. But T=τ_b−1 (stopping one step before hitting b) is not a stopping time, since deciding to stop at time m would require already knowing the future value Xₘ₊₁.',
          },
          {
            type: 'theorem',
            number: '11.4.2',
            title: 'Optional Stopping Theorem',
            text: 'Let {Xₙ} be a martingale with X₀=a, and T a stopping time. If either (a) the martingale is bounded up to time T (|Xₙ|≤M for all n≤T), or (b) T itself is bounded (T≤M), then E(X_T)=a.',
          },
        ],
      },
      {
        heading: "Solving Gambler's Ruin with Martingales",
        blocks: [
          {
            type: 'example',
            number: '11.4.9 & 11.4.10',
            title: "Gambler's Ruin Revisited (p=1/2)",
            body:
              'Let T=min(τ_r,τ_s) be the first time the walk hits r or s, with r<a<s (using r=0, s=c recovers ordinary gambler\'s ruin). Since Xₙ is bounded between r and s up to time T, the optional stopping theorem gives E(X_T)=a. But X_T is always either r or s, so writing h=P(X_T=r): E(X_T) = hr+(1−h)s = a, giving h=(s−a)/(s−r). With r=0, s=c, this is h=(c−a)/c — wait, we want P(hit c before 0), i.e. 1−h = (a−r)/(s−r) = a/c, exactly matching Theorem 11.1.2\'s p=1/2 case — derived here in three lines instead of the multi-page argument of Section 11.7.',
          },
          {
            type: 'example',
            number: '11.4.11',
            title: "Gambler's Ruin Revisited (p≠1/2)",
            body:
              'For p≠1/2, Xₙ itself is not a martingale, so apply the optional stopping theorem instead to Zₙ=(q/p)^{Xₙ} from Example 11.4.4, which is bounded between (q/p)^0=1 and (q/p)^c up to T=min(τ_c,τ_0). This gives E(Z_T)=Z₀=(q/p)^a. Writing g=P(hit c before 0): E(Z_T) = g(q/p)^c + (1−g)(1) = (q/p)^a, and solving for g reproduces exactly the p≠1/2 formula of Theorem 11.1.2 — again with far less algebra than the direct approach.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch11-martingale-stopping',
          },
          {
            type: 'predict',
            title: 'When optional stopping fails',
            question: 'Let Xₙ be fair simple random walk (p=1/2) starting at 0, and let T=τ₁=min{n : Xₙ=1} with no upper bound on T at all. We know P(T<∞)=1 (Theorem 11.1.3, since p=1/2), so X_T=1 always. Does E(X_T)=0 (the martingale\'s starting value), as Theorem 11.4.2 might suggest?',
            reveal: 'No — E(X_T)=1, not 0, because neither condition of the optional stopping theorem holds here: T is unbounded (no fixed M with T≤M always), and Xₙ is unbounded for n≤T (the walk can wander arbitrarily far from 0 before finally hitting 1). This is exactly the trap of Example 11.4.13: martingale theory guarantees E(X_T)=X₀ only when one of the two boundedness conditions actually holds — without it, the "obvious" conclusion can be flatly wrong.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 11.5  Brownian Motion
  // ─────────────────────────────────────────────
  {
    id: 'brownian-motion',
    title: 'Brownian Motion',
    chapterRef: 'Chapter 11 · Section 11.5',
    description:
      'Speed up simple random walk faster and faster while shrinking its step size to match, and in the limit it becomes Brownian motion — a continuous-time process whose value at any moment is exactly Normally distributed. Named after the botanist who first observed the chaotic jitter of pollen grains in water, Brownian motion is also the foundation of the diffusion models used to describe stock prices.',
    hook: 'Every random walk you\'ve studied so far jumps at fixed, discrete moments. Brownian motion is what happens when you let those jumps happen infinitely often, infinitely small — and the central limit theorem turns that chaos into an exact Normal distribution at every instant.',
    sections: [
      {
        heading: 'Constructing Brownian Motion as a Limit',
        blocks: [
          {
            type: 'text',
            content:
              'Start with i.i.d. Z₁,Z₂,… taking values ±1 with probability 1/2 each — the steps of fair simple random walk. For a large integer M, define a sped-up, shrunk-down process: at time i/M (for integer i≥0), let Y^M_{i/M} = (1/√M)(Z₁+⋯+Zᵢ) — time has been sped up by a factor of M (M steps now happen in one unit of time), and space has been shrunk by a factor of √M. Filling in linearly between these points gives a continuous-time process Y^M_t for all t≥0.',
          },
          {
            type: 'theorem',
            number: '11.5.1',
            text: 'For large M: (a) Y^M_t is approximately N(0,t); (b) Cov(Y^M_s,Y^M_t) is approximately min(s,t); (c) for s<t, the increment Y^M_t−Y^M_s is approximately N(0,t−s) and approximately independent of Y^M_s; (d) Y^M_t is a continuous function of t.',
          },
          {
            type: 'text',
            content:
              'The scaling by √M is exactly what the central limit theorem needs: Y^M_{i/M} is (1/√M) times a sum of i≈tM i.i.d. mean-0, variance-1 terms, so by the CLT it converges in distribution to N(0,t) as M→∞. Brownian motion is defined as this limit.',
          },
          {
            type: 'definition',
            number: '11.5 (definition)',
            title: 'Brownian Motion',
            text: 'Brownian motion {Bₜ : t≥0} is the process obtained as the limit of {Y^M_t : t≥0} as M→∞, inheriting all the properties of Theorem 11.5.1 exactly in the limit.',
          },
          {
            type: 'theorem',
            number: '11.5.2',
            title: 'Properties of Brownian Motion',
            text: '(a) Bₜ ~ N(0,t) for every t≥0; (b) Cov(Bₛ,Bₜ) = min(s,t) for s,t≥0; (c) for 0≤s<t, the increment Bₜ−Bₛ ~ N(0,t−s) and is independent of Bₛ; (d) t↦Bₜ is a continuous function.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch11-brownian-motion',
          },
        ],
      },
      {
        heading: 'Computing Probabilities for Brownian Motion',
        blocks: [
          {
            type: 'example',
            number: '11.5.1 & 11.5.3',
            body:
              'For Brownian motion Bₜ: since B₅~N(0,5), P(B₅<3) = Φ(3/√5) ≈ Φ(1.342) ≈ 0.910. Since B₈−B₆ ~ N(0,2) (independent increment over a length-2 interval), P(B₈−B₆<−1.5) = Φ(−1.5/√2) ≈ Φ(−1.061) ≈ 0.144.',
          },
          {
            type: 'text',
            content:
              'Because Brownian motion was built from a fair (p=1/2) random walk, it inherits the martingale property: E(Bₜ)=0 for every t, and — by the optional stopping theorem — E(B_T)=0 for any suitably bounded stopping time T as well.',
          },
          {
            type: 'example',
            number: '11.5.5',
            title: 'Hitting Probabilities for Brownian Motion',
            body:
              'Let c<0<b, and let T be the first time Brownian motion hits either c or b. Writing h=P(B_T=c), the optional stopping theorem gives E(B_T)=hc+(1−h)b=0, so h=b/(b−c) — the exact continuous-time analogue of the gambler\'s ruin computation from Section 11.4, obtained the same way.',
          },
          {
            type: 'predict',
            title: 'Independent increments in action',
            question: 'For Brownian motion, are the events {B₂<0.5} and {B₅−B₂>1.5} independent? Why does this make the joint probability easy to compute?',
            reveal: 'Yes — Theorem 11.5.2(c) says the increment B₅−B₂ is independent of B₂ itself, so P(B₂<0.5, B₅−B₂>1.5) = P(B₂<0.5)·P(B₅−B₂>1.5), each computed as an ordinary univariate Normal probability (B₂~N(0,2) and B₅−B₂~N(0,3)) and simply multiplied together — no joint distribution machinery needed.',
          },
        ],
      },
      {
        heading: 'Diffusions and Stock Prices',
        blocks: [
          {
            type: 'text',
            content:
              'Brownian motion is the building block for diffusion processes, commonly used to model stock prices. A diffusion Xₜ = a + μt + σBₜ describes a quantity that drifts linearly (rate μ, the drift) while fluctuating randomly around that trend (scaled by σ, the volatility), starting from initial value a.',
          },
          {
            type: 'theorem',
            number: '11.5.3',
            text: 'For the diffusion Xₜ = a + μt + σBₜ: E(Xₜ) = a+μt, Var(Xₜ) = σ²t, and Xₜ ~ N(a+μt, σ²t).',
          },
          {
            type: 'example',
            number: '11.5.6',
            title: 'A Stock Price Model',
            body:
              'A stock starts at $20, with drift $3/year and volatility σ=1.4. After 2.5 years, X₂.₅ ~ N(20+3(2.5), 1.4²·2.5) = N(27.5, 4.9). Then P(X₂.₅>30) = P(B₂.₅ > (30−27.5)/1.4) = 1−Φ(1.79) ≈ 0.129 — about a 13% chance the stock exceeds $30 after two and a half years.',
          },
          {
            type: 'text',
            content:
              'Diffusions are not perfect models of real stock prices or particle motion (Brownian motion is, famously, nowhere differentiable — a real particle cannot literally move this way), but their tractable Normal distributions make them the workhorse starting point for mathematical finance.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 11.6  Poisson Processes
  // ─────────────────────────────────────────────
  {
    id: 'poisson-processes',
    title: 'Poisson Processes',
    chapterRef: 'Chapter 11 · Section 11.6',
    description:
      'A Poisson process models events that occur at random times — the nth fire in a city, the nth particle detected by a Geiger counter, the nth car passing a checkpoint — built from i.i.d. Exponential waiting times between consecutive events. The resulting event count at any fixed time turns out to have exactly a Poisson distribution, which is where the process gets its name.',
    hook: 'Why does the Poisson distribution show up everywhere from radioactive decay to call centres to earthquakes? Because all of those are Poisson processes in disguise — and this section shows exactly why an Exponential waiting time between events forces a Poisson count of events.',
    sections: [
      {
        heading: 'Definition and the Poisson Distribution',
        blocks: [
          {
            type: 'text',
            content:
              'Fix a>0, called the intensity or rate. Let R₁,R₂,… be i.i.d. Exponential(a) — the waiting times between consecutive events. Let T₀=0 and Tₙ=R₁+⋯+Rₙ for n≥1, so Tₙ is the (random) time of the n-th event. Define Nₜ = max{n : Tₙ≤t} — the number of events that have occurred by time t.',
          },
          {
            type: 'theorem',
            number: '11.6.1',
            text: 'For any t≥0, Nₜ ~ Poisson(at).',
          },
          {
            type: 'text',
            content:
              'This connects two distributions that seem unrelated at first: the continuous Exponential distribution governing individual waiting times, and the discrete Poisson distribution governing the count of events. The proof (Section 11.7) uses the fact that the event {Nₜ≥n} is the same as the event {Tₙ≤t}, and Tₙ (a sum of n i.i.d. Exponential(a) variables) has a Gamma(n,a) distribution — integrating its density gives exactly the Poisson(at) tail probabilities.',
          },
          {
            type: 'theorem',
            number: '11.6.2',
            title: 'Independent Poisson Increments',
            text: 'For 0≤t₀<t₁<⋯<t_d, the increments Nₜᵢ−Nₜᵢ₋₁ are independent, with Nₜᵢ−Nₜᵢ₋₁ ~ Poisson(a(tᵢ−tᵢ₋₁)) for each i.',
          },
          {
            type: 'text',
            content:
              'This follows from the memoryless property of the Exponential distribution: regardless of what has already happened up to time tᵢ₋₁, the process of counting further events restarts fresh from that point, with the same Poisson-process structure.',
          },
          {
            type: 'viz',
            vizId: 'viz-ch11-poisson-process',
          },
        ],
      },
      {
        heading: 'Computing Poisson Process Probabilities',
        blocks: [
          {
            type: 'example',
            number: '11.6.1 & 11.6.2',
            body:
              'For a Poisson process with intensity a=5: N₃ ~ Poisson(15), so P(N₃=12) = e^{-15}15¹²/12! ≈ 0.083. For intensity a=2: N₆ ~ Poisson(12), so P(N₆=11) = e^{-12}12¹¹/11! ≈ 0.114.',
          },
          {
            type: 'example',
            number: '11.6.3',
            title: 'Using Independent Increments',
            body:
              'For a=4, compute P(N₂=3, N₅=4) by rewriting it as P(N₂=3, N₅−N₂=1) — since N₂~Poisson(8) and N₅−N₂~Poisson(12) are independent (Theorem 11.6.2), this is P(N₂=3)·P(N₅−N₂=1) = [e^{-8}8³/3!]·[e^{-12}12¹/1!] ≈ 0.0000021, an extremely small (and jointly unlikely) combination.',
          },
          {
            type: 'predict',
            title: 'Rescaling time',
            question: 'A Poisson process has intensity a=6 events per hour. If you instead measure time in minutes, what is the process\'s intensity in events per minute, and why does this matter for computing probabilities?',
            reveal: 'The intensity becomes a=0.1 events per minute (6 per 60 minutes) — the process itself does not change, only the units used to describe it. This matters because Theorem 11.6.1 says Nₜ~Poisson(at): getting the units of a and t to match (both in hours, or both in minutes) is essential before plugging into the Poisson formula, exactly the same unit-consistency check needed anywhere rates are involved.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 11.7  Further Proofs (Advanced)
  // ─────────────────────────────────────────────
  {
    id: 'stochastic-processes-proofs',
    title: 'Further Proofs (Advanced)',
    chapterRef: 'Chapter 11 · Section 11.7',
    description:
      'Rigorous proofs of the chapter\'s key results: the exact distribution of simple random walk and the gambler\'s ruin formula (via a clever recursive trick), the reversibility of the Metropolis–Hastings chain, the central-limit-theorem argument behind Brownian motion, and the Gamma-distribution computation behind the Poisson process.',
    hook: 'The gambler\'s ruin proof here is a small masterclass in problem-solving: instead of attacking the hard question directly, it sets up a recursion relating every possible starting fortune at once, then solves all of them simultaneously.',
    sections: [
      {
        heading: "Random Walk and Gambler's Ruin",
        blocks: [
          {
            type: 'text',
            content:
              'Theorem 11.1.1\'s distribution formula follows from counting: if Wₙ is the number of wins in the first n bets, then Xₙ=a+2Wₙ−n, so Wₙ~Binomial(n,p) directly gives P(Xₙ=a+k)=P(Wₙ=(n+k)/2), which is the stated binomial probability whenever (n+k)/2 is a valid integer count between 0 and n — exactly the condition that n+k is even and −n≤k≤n. Since E(Wₙ)=np, E(Xₙ)=a+2np−n=a+n(2p−1) follows immediately.',
          },
          {
            type: 'text',
            content:
              'For gambler\'s ruin (Theorem 11.1.2), write s(b)=P(hit c before 0 | start at b) for every possible starting fortune b∈{0,1,…,c} at once — not just b=a. Conditioning on the outcome of the very first bet gives a recursion linking s(b) to its neighbours.',
          },
          {
            type: 'formula',
            latex: 's(b) = p\\cdot s(b+1) + q\\cdot s(b-1), \\qquad 1 \\le b \\le c-1, \\qquad s(0)=0,\\ s(c)=1',
            label: 'The gambler\'s-ruin recursion, linking every starting fortune simultaneously',
          },
          {
            type: 'text',
            content:
              'Rearranging using p+q=1 gives s(b+1)−s(b) = (q/p)[s(b)−s(b−1)], so the successive differences form a geometric sequence in q/p. Summing this telescoping relation from 0 up to b−1, then applying the boundary conditions s(0)=0 and s(c)=1 to pin down the one remaining unknown constant s(1), produces exactly the two-case formula of Theorem 11.1.2 (a linear formula a/c when p=1/2, since q/p=1 collapses the geometric sum to a simple count; a geometric-series formula otherwise). Theorem 11.1.3 (probability of eventual ruin) then follows by taking c→∞ in Theorem 11.1.2 and using continuity of probability.',
          },
        ],
      },
      {
        heading: 'Metropolis–Hastings, Brownian Motion, and Poisson Processes',
        blocks: [
          {
            type: 'text',
            content:
              'Theorem 11.3.3 (Metropolis–Hastings produces a chain with {πᵢ} stationary) is proved by directly verifying reversibility: for i≠j, P(Xₙ₊₁=j|Xₙ=i) = qᵢⱼαᵢⱼ = qᵢⱼ·min(1, πⱼqⱼᵢ/(πᵢqᵢⱼ)) = min(qᵢⱼ, πⱼqⱼᵢ/πᵢ), so πᵢP(Xₙ₊₁=j|Xₙ=i) = min(πᵢqᵢⱼ, πⱼqⱼᵢ). This last expression is symmetric in i and j, so it also equals πⱼP(Xₙ₊₁=i|Xₙ=j) — exactly the reversibility condition πᵢpᵢⱼ=πⱼpⱼᵢ of Definition 11.2.2, which by Theorem 11.2.6 guarantees {πᵢ} is stationary.',
          },
          {
            type: 'text',
            content:
              'Theorem 11.5.1 (Brownian motion\'s limiting properties) follows from the central limit theorem: for large M, Y^M_t is (approximately) (1/√M) times a sum of ⌊tM⌋ i.i.d. mean-0, variance-1 terms, which by the CLT converges in distribution to N(0,t) as M→∞ — giving part (a). The covariance formula (part (b)) follows from directly expanding Cov(Y^M_s,Y^M_t) as a sum of the underlying i.i.d. terms\' covariances, which are nonzero only where the two sums of ±1 steps overlap (min(s,t) many terms, each contributing variance 1/M, for a total of min(s,t) once scaled).',
          },
          {
            type: 'text',
            content:
              'Theorem 11.6.1 (Nₜ~Poisson(at)) is proved via the identity P(Nₜ≥n)=P(Tₙ≤t), since the n-th event occurring by time t is exactly the same event as at least n events having occurred by time t. Because Tₙ~Gamma(n,a) (a sum of n i.i.d. Exponential(a) variables), integrating its density from 0 to t and simplifying (via a telescoping identity relating consecutive Gamma tail probabilities) yields exactly the Poisson(at) survival function P(Nₜ≥n)=Σ_{i≥n} e^{-at}(at)ⁱ/i!, which is equivalent to Nₜ~Poisson(at). Theorem 11.6.2\'s independent-increments property then follows from the memoryless property of the Exponential distribution: conditional on the process\'s state at time tᵢ₋₁, the future evolution restarts completely fresh, independent of everything before tᵢ₋₁.',
          },
        ],
      },
    ],
  },

];

export function getCh11ConceptById(id: string): ProbabilityConcept | undefined {
  return ch11Concepts.find(c => c.id === id);
}
