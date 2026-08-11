import type { ContentBlock, ConceptSection, ProbabilityConcept } from './probabilityConceptsData';

export type { ContentBlock, ConceptSection, ProbabilityConcept };

export const ch12Concepts: ProbabilityConcept[] = [

  // ─────────────────────────────────────────────
  // 12.1  Markov Chains
  // ─────────────────────────────────────────────
  {
    id: 'hmm-markov-chains',
    title: 'Markov Chains',
    chapterRef: 'Chapter 12 · Section 12.1',
    description:
      'A Markov chain assigns a probability to a sequence of observable events — states that we watch unfold directly, one after another — using the same one-step-memory assumption as Chapter 11\'s Markov chains. Before we can talk about hidden states in Section 12.2, we need this fully-observed case pinned down precisely: a set of states, a transition matrix, and a starting distribution.',
    hook: 'A bigram language model — assigning a probability to a sentence one word at a time, using only the previous word — is nothing more than a Markov chain wearing a different name. Once you see the equivalence, every technique in this chapter becomes something you can point at two completely different problems: predicting the weather, and predicting text.',
    sections: [
      {
        heading: 'Sequences of Random States',
        blocks: [
          {
            type: 'text',
            content:
              'A Markov chain tells us something about the probabilities of sequences of random variables, states, each of which can take on values from some set. These sets can be words, or tags, or symbols representing anything at all — like the weather. A Markov chain makes a very strong assumption: if we want to predict the future of the sequence, all that matters is the current state. The states before the current one have no impact on the future except via the current state — as if predicting tomorrow\'s weather let you examine today\'s weather but never yesterday\'s.',
          },
          {
            type: 'definition',
            number: '12.1',
            title: 'Markov Assumption',
            text: 'For a sequence of state variables q₁, q₂, …, qᵢ, the Markov assumption says that when predicting the future, the past doesn\'t matter — only the present.',
            formula: 'P(q_i = a \\mid q_1 \\dots q_{i-1}) = P(q_i = a \\mid q_{i-1})',
          },
          {
            type: 'text',
            content:
              'This is exactly the Markov property from [[markov-chains|Chapter 11, Definition 11.2]] — the same restriction, phrased for a chain whose states are watched directly rather than inferred. A Markov chain for assigning a probability to a sequence of weather events might have vocabulary {HOT, COLD, WARM}: the states are nodes in a graph, and the transitions between them — with their probabilities — are the edges. The probabilities of arcs leaving any one state must sum to 1.',
          },
          {
            type: 'text',
            content:
              'A Markov chain over words w₁ … wₙ is exactly a bigram language model: each edge expresses the probability p(wᵢ|wⱼ) of one word following another. Given a fully-specified chain — states, transitions, and a starting distribution — we can assign a probability to any sequence drawn from its vocabulary, whether that vocabulary is {HOT, COLD, WARM} or the words of a language.',
          },
          { type: 'viz', vizId: 'viz-ch12-weather-chain' },
        ],
      },
      {
        heading: 'Specifying a Markov Chain',
        blocks: [
          {
            type: 'text',
            content:
              'Formally, a Markov chain is specified by three components, matching the state space, transition matrix, and initial distribution of [[markov-chains|Chapter 11]] exactly:',
          },
          {
            type: 'definition',
            number: '12.2',
            title: 'Markov Chain Components',
            text: 'Q = q₁q₂…q_N is a set of N states. A = a₁₁a₁₂…a_{NN} is a transition probability matrix, where each aᵢⱼ represents the probability of moving from state i to state j. π = π₁,π₂,…,π_N is an initial probability distribution over states, where πᵢ is the probability the chain starts in state i (some states may have πᵢ=0, meaning they cannot be initial states).',
            formula: '\\sum_{j=1}^{N} a_{ij} = 1 \\quad \\forall i, \\qquad \\sum_{i=1}^{N} \\pi_i = 1',
          },
          {
            type: 'text',
            content:
              'These constraints — every row of A sums to 1, and π sums to 1 — are just the requirement that transition probabilities out of any state, and the initial distribution over all states, are genuine probability distributions. This is identical to the stochastic matrix and initial distribution of [[markov-chains|Chapter 11, Section 11.2]]; nothing new is being assumed yet. What changes starting in Section 12.2 is that the states themselves stop being directly observable.',
          },
        ],
      },
      {
        heading: 'Computing the Probability of a Sequence',
        blocks: [
          {
            type: 'text',
            content:
              'For a fully-observed Markov chain, computing the probability of a state sequence is immediate: multiply the initial probability of the first state by the transition probability along every subsequent edge in the sequence.',
          },
          {
            type: 'example',
            number: '12.1.1',
            title: 'A Three-State Weather Chain',
            body:
              'Take Q={HOT, WARM, COLD} with π=[0.1, 0.2, 0.7] (probability 0.1 of starting HOT, 0.2 WARM, 0.7 COLD), and transition matrix a_HOT={.6 HOT, .3 WARM, .1 COLD}, a_WARM={.4 HOT, .5 WARM, .1 COLD}, a_COLD={.1 HOT, .1 WARM, .8 COLD}. The probability of the sequence HOT WARM WARM is π_HOT · a_{HOT,WARM} · a_{WARM,WARM} = (0.1)(0.3)(0.5) = 0.015.',
          },
          {
            type: 'predict',
            title: 'Two four-day sequences',
            question: 'Using the chain in Example 12.1.1 (π=[0.1,0.2,0.7] for HOT, WARM, COLD), which is more probable: the sequence "COLD COLD COLD COLD", or the sequence "HOT WARM COLD HOT"? Estimate roughly before computing.',
            reveal: 'COLD COLD COLD COLD is far more probable: π_COLD·a_{COLD,COLD}³ = (0.7)(0.8)³ = (0.7)(0.512) = 0.358. The alternating sequence needs a low-probability start and low-probability jumps at every step: π_HOT·a_{HOT,WARM}·a_{WARM,COLD}·a_{COLD,HOT} = (0.1)(0.3)(0.1)(0.1) = 0.00003 — over 10,000 times smaller. This mirrors a real-world fact this particular chain encodes: COLD is "sticky" (a_{COLD,COLD}=0.8), so runs of the same weather are common and abrupt daily swings are rare — exactly the kind of local persistence real weather (and real text, for a bigram model) actually has.',
          },
          {
            type: 'text',
            content:
              'This computation — multiplying probabilities straight along the sequence of states — is only possible because the states are directly observable. Section 12.2 breaks that assumption: the states become hidden, and we only get to see something they produced.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 12.2  The Hidden Markov Model
  // ─────────────────────────────────────────────
  {
    id: 'hidden-markov-model',
    title: 'The Hidden Markov Model',
    chapterRef: 'Chapter 12 · Section 12.2',
    description:
      'A Markov chain is useful when we need a probability for a sequence of observable events. Often, though, the events we care about are hidden: we don\'t observe them directly, only something they produced. A hidden Markov model (HMM) augments the Markov chain with exactly this distinction — hidden states generating observed symbols — and gives rise to three fundamental computational problems that the rest of this chapter solves one by one.',
    hook: 'You will never see the actual weather in this chapter\'s running example — only how many ice creams someone ate. That gap between what happened and what you can observe is the entire reason HMMs exist, and it shows up everywhere: unlabelled sensor readings, undiagnosed disease states, unobserved market regimes — anywhere the thing you can measure is only a symptom of the thing you actually want to know.',
    sections: [
      {
        heading: 'Hidden Events and Observed Events',
        blocks: [
          {
            type: 'text',
            content:
              'A Markov chain is useful when we need to compute a probability for a sequence of observable events. In many cases, however, the events we are interested in are hidden: we don\'t observe them directly. For example, we don\'t normally observe the weather directly from historical records — we see proxies for it, and must infer the weather from those proxies. We call the underlying states hidden because they are not observed.',
          },
          {
            type: 'text',
            content:
              'A hidden Markov model (HMM) lets us talk about both observed events (like measurements we see in the input) and hidden events (like an underlying regime) that we think of as the causal factors in a probabilistic model. Formally, an HMM is specified by four components, extending the three components of a plain Markov chain from Section 12.1:',
          },
          {
            type: 'definition',
            number: '12.3',
            title: 'Hidden Markov Model Components',
            text: 'Q = q₁q₂…q_N is a set of N (hidden) states. A = a₁₁…aᵢⱼ…a_{NN} is a transition probability matrix, each aᵢⱼ the probability of moving from state i to state j, with Σⱼaᵢⱼ=1 for every i. B = bᵢ(oₜ) is a sequence of observation likelihoods, also called emission probabilities, each expressing the probability of an observation oₜ (drawn from a vocabulary V=v₁,…,v_V) being generated from state qᵢ. π = π₁,…,π_N is an initial probability distribution over states, with Σπᵢ=1.',
          },
          {
            type: 'text',
            content:
              'The HMM is given as input O = o₁o₂…o_T: a sequence of T observations, each drawn from the vocabulary V. Writing λ=(A,B) for the model\'s parameters, the whole point of this chapter is to compute things about O without ever directly observing the hidden sequence Q that produced it.',
          },
        ],
      },
      {
        heading: 'Two Simplifying Assumptions',
        blocks: [
          {
            type: 'text',
            content:
              'A first-order hidden Markov model instantiates two simplifying assumptions. First, exactly as for a first-order Markov chain, the probability of a particular state depends only on the previous state:',
          },
          {
            type: 'formula',
            latex: 'P(q_i \\mid q_1 \\dots q_{i-1}) = P(q_i \\mid q_{i-1})',
            label: 'The Markov assumption, applied to the hidden state sequence',
          },
          {
            type: 'text',
            content:
              'Second, the probability of an output observation oᵢ depends only on the state qᵢ that produced it, and not on any other states or any other observations — the output independence assumption:',
          },
          {
            type: 'formula',
            latex: 'P(o_i \\mid q_1 \\dots q_i \\dots q_T,\\, o_1 \\dots o_i \\dots o_T) = P(o_i \\mid q_i)',
            label: 'Output independence — each observation depends only on the state that emitted it',
          },
          {
            type: 'text',
            content:
              'Because each hidden state produces exactly one observation under these assumptions, the sequence of hidden states and the sequence of observations always have the same length T.',
          },
        ],
      },
      {
        heading: 'The Ice Cream Task',
        blocks: [
          {
            type: 'text',
            content:
              'To make these definitions concrete, consider a task invented by Jason Eisner (2002). Imagine you are a climatologist far in the future studying the history of a summer for which you cannot find any weather records — but you do find a diary listing how many ice creams someone ate every day that summer. Simplify the weather to two kinds of days, hot (H) and cold (C): given the sequence of ice-cream counts, find the hidden sequence of weather states that caused that many ice creams to be eaten.',
          },
          {
            type: 'example',
            number: '12.2.1',
            title: 'The Ice Cream HMM',
            body:
              'Two hidden states, COLD and HOT, with π_COLD=0.2, π_HOT=0.8; transitions P(HOT|HOT)=0.6, P(COLD|HOT)=0.4, P(COLD|COLD)=0.5, P(HOT|COLD)=0.5; and emissions (over the observation alphabet {1,2,3} ice creams) P(1|COLD)=.5, P(2|COLD)=.4, P(3|COLD)=.1, and P(1|HOT)=.2, P(2|HOT)=.4, P(3|HOT)=.4. This one HMM is used throughout the rest of the chapter as the running example for every algorithm.',
          },
          { type: 'viz', vizId: 'viz-ch12-icecream-hmm' },
        ],
      },
      {
        heading: 'The Three Fundamental Problems',
        blocks: [
          {
            type: 'text',
            content:
              'An influential tutorial by Rabiner (1989), itself based on tutorials by Jack Ferguson in the 1960s, characterised hidden Markov models by three fundamental problems. Every remaining section of this chapter solves exactly one of them.',
          },
          {
            type: 'definition',
            number: 'Problem 1 (Likelihood)',
            title: 'Section 12.3',
            text: 'Given an HMM λ=(A,B) and an observation sequence O, determine the likelihood P(O|λ) — solved by the forward algorithm.',
          },
          {
            type: 'definition',
            number: 'Problem 2 (Decoding)',
            title: 'Section 12.4',
            text: 'Given an observation sequence O and an HMM λ=(A,B), discover the best hidden state sequence Q — solved by the Viterbi algorithm.',
          },
          {
            type: 'definition',
            number: 'Problem 3 (Learning)',
            title: 'Section 12.5',
            text: 'Given an observation sequence O and the set of states in the HMM, learn the HMM parameters A and B — solved by the forward-backward (Baum-Welch) algorithm.',
          },
          {
            type: 'predict',
            title: 'Why not just enumerate every hidden sequence?',
            question: 'For the ice-cream HMM (2 hidden states) observing T=10 days, how many possible hidden state sequences are there? What does that suggest about solving Problem 1 by brute force?',
            reveal: '2¹⁰ = 1024 sequences — already unwieldy by hand, and for an HMM with N states and T observations there are Nᵀ possible hidden sequences in general, which grows exponentially in T. Computing P(O,Q) for every single one and summing would be correct but computationally hopeless for any realistic T. Section 12.3\'s forward algorithm gets the exact same answer in O(N²T) time by reusing partial computations — the same dynamic-programming idea that makes matrix powers a shortcut in [[markov-chains|Chapter 11\'s Markov chains]] instead of multiplying out every path by hand.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 12.3  Likelihood Computation: The Forward Algorithm
  // ─────────────────────────────────────────────
  {
    id: 'forward-algorithm',
    title: 'Likelihood Computation: The Forward Algorithm',
    chapterRef: 'Chapter 12 · Section 12.3',
    description:
      'Problem 1 asks for the total probability of an observation sequence, summed over every hidden state sequence that could have produced it. Enumerating those sequences directly costs Nᵀ work — hopeless for realistic T. The forward algorithm computes the exact same quantity in O(N²T) time by folding every possible path into a single trellis of partial sums.',
    hook: 'The forward algorithm is the same trick as the "matrix power" shortcut from Chapter 11\'s Markov chains — computing the total probability without ever having to enumerate the exponentially many individual paths that contribute to it — applied to a chain whose states you cannot see.',
    sections: [
      {
        heading: 'From a Known Path to All Paths',
        blocks: [
          {
            type: 'text',
            content:
              'Computing likelihood means: given an HMM λ=(A,B) and an observation sequence O, determine P(O|λ). For a Markov chain, where the observations are the states themselves, this is a straight product along the sequence (Section 12.1). For an HMM, we don\'t know the hidden state sequence — so we start with the easier sub-problem: if we already knew the hidden sequence, how easy would it be to compute the output likelihood?',
          },
          {
            type: 'text',
            content:
              'Given a particular hidden state sequence Q=q₁,…,q_T and observation sequence O=o₁,…,o_T, the output-independence assumption of Section 12.2 makes the likelihood a simple product:',
          },
          {
            type: 'formula',
            latex: 'P(O \\mid Q) = \\prod_{i=1}^{T} P(o_i \\mid q_i)',
            label: 'Likelihood of the observations given one specific hidden path',
          },
          {
            type: 'example',
            number: '12.3.1',
            body:
              'For the ice-cream observations 3 1 3 and the candidate hidden sequence hot hot cold: P(3 1 3 | hot hot cold) = P(3|hot)·P(1|hot)·P(3|cold) = (0.4)(0.2)(0.1) = 0.008.',
          },
          {
            type: 'text',
            content:
              'But we also don\'t know Q, so the joint probability of a particular weather sequence and a particular set of ice-cream events matters more — combining the emission likelihoods above with the transition probabilities of the hidden path itself:',
          },
          {
            type: 'formula',
            latex: 'P(O, Q) = P(O \\mid Q)\\, P(Q) = \\prod_{i=1}^{T} P(o_i \\mid q_i) \\times \\prod_{i=1}^{T} P(q_i \\mid q_{i-1})',
            label: 'Joint probability of the observations and one specific hidden path',
          },
          {
            type: 'example',
            number: '12.3.2',
            body:
              'P(3 1 3, hot hot cold) = P(hot|start)·P(hot|hot)·P(cold|hot) × P(3|hot)·P(1|hot)·P(3|cold) = (0.8)(0.6)(0.4) × (0.4)(0.2)(0.1) = (0.192)(0.008) = 0.001536, using π_hot=0.8 as P(hot|start).',
          },
          {
            type: 'text',
            content:
              'Now we can get the total probability of the observations just by summing over every possible hidden state sequence:',
          },
          {
            type: 'formula',
            latex: 'P(O) = \\sum_{Q} P(O, Q) = \\sum_{Q} P(O \\mid Q)\\,P(Q)',
            label: 'The total observation likelihood, summed over all hidden paths',
          },
          {
            type: 'text',
            content:
              'For the ice-cream example this means summing over all eight length-3 hidden sequences: cold cold cold, cold cold hot, …, hot hot cold, and so on. For an HMM with N hidden states and T observations, there are Nᵀ possible hidden sequences — for real tasks, with N and T both large, this is far too many to enumerate one at a time.',
          },
        ],
      },
      {
        heading: 'The Forward Trellis',
        blocks: [
          {
            type: 'text',
            content:
              'Instead of this exponential approach, the forward algorithm — an O(N²T) dynamic-programming algorithm — computes the observation probability by summing over the probabilities of all possible hidden paths, but does so efficiently by implicitly folding every path into a single forward trellis. Each cell αₜ(j) represents the probability of being in state j after seeing the first t observations, given the model λ:',
          },
          {
            type: 'formula',
            latex: '\\alpha_t(j) = P(o_1, o_2, \\dots, o_t,\\, q_t = j \\mid \\lambda)',
            label: 'The forward variable — probability of the partial observations and being in state j at time t',
          },
          {
            type: 'text',
            content:
              'Each αₜ(j) is computed by summing over the extensions of every path that could lead to that cell — one extension per state at the previous time step, weighted by (i) the previous forward probability, (ii) the transition into state j, and (iii) the probability of the current observation given state j.',
          },
          {
            type: 'theorem',
            number: '12.3.1',
            title: 'The Forward Recursion',
            text: 'For a given state qⱼ at time t, the forward probability is computed from every state qᵢ at time t−1:',
            formula: '\\alpha_t(j) = \\sum_{i=1}^{N} \\alpha_{t-1}(i)\\, a_{ij}\\, b_j(o_t)',
          },
          {
            type: 'text',
            content:
              'Consider computing α₂(HOT) for the ice-cream sequence 3 1: it extends the α probabilities from time step 1 via two paths, each with three factors — α₁(HOT)·a_{HOT,HOT}·b_HOT(1) and α₁(COLD)·a_{COLD,HOT}·b_HOT(1) — and adds them together, exactly Theorem 12.3.1 with j=HOT, t=2.',
          },
        ],
      },
      {
        heading: 'The Full Algorithm',
        blocks: [
          {
            type: 'text',
            content:
              'The complete forward algorithm has the same three-part structure — initialization, recursion, termination — as every dynamic-programming algorithm in this chapter.',
          },
          {
            type: 'theorem',
            number: '12.3 (algorithm)',
            title: 'The Forward Algorithm',
            text: '1. Initialization: α₁(j)=πⱼbⱼ(o₁) for 1≤j≤N. 2. Recursion: αₜ(j)=Σᵢαₜ₋₁(i)aᵢⱼbⱼ(oₜ) for 1<t≤T, 1≤j≤N. 3. Termination: P(O|λ)=Σᵢα_T(i).',
          },
          {
            type: 'example',
            number: '12.3.3',
            title: 'Forward Probabilities for 3 1 3',
            body:
              'Using the ice-cream HMM of Example 12.2.1, the forward trellis for O=3,1,3 gives α₁(HOT)=0.320, α₁(COLD)=0.020; α₂(HOT)=0.0404, α₂(COLD)=0.069; α₃(HOT)=0.023496, α₃(COLD)=0.005066. Summing the final column: P(3 1 3 | λ) = α₃(HOT)+α₃(COLD) = 0.023496+0.005066 ≈ 0.02856 — the total probability of seeing exactly 3, then 1, then 3 ice creams, summed correctly over all eight possible three-day weather sequences, using only 3×2 cells of work instead of 8 full path evaluations.',
          },
          { type: 'viz', vizId: 'viz-ch12-forward-trellis' },
          {
            type: 'predict',
            title: 'Reusing work across paths',
            question: 'Both the hidden sequence "hot hot cold" and "cold hot cold" pass through state HOT at time 2. Does the forward algorithm recompute the probability of reaching HOT at time 2 separately for each of them?',
            reveal: 'No — this is exactly the saving that makes the forward algorithm efficient. α₂(HOT) is computed once, as the sum over both ways of reaching HOT at time 2 (from HOT or from COLD at time 1), and that single cell value is then reused by every hidden sequence that happens to pass through HOT at time 2, no matter what it does afterward. This is the same principle behind every dynamic-programming algorithm: solve each overlapping sub-problem exactly once, then reuse the answer everywhere it is needed, rather than re-deriving it inside every full path.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 12.4  Decoding: The Viterbi Algorithm
  // ─────────────────────────────────────────────
  {
    id: 'viterbi-algorithm',
    title: 'Decoding: The Viterbi Algorithm',
    chapterRef: 'Chapter 12 · Section 12.4',
    description:
      'Problem 2 asks a different question from Problem 1: not the total probability summed over all hidden paths, but the single most probable hidden path itself. The Viterbi algorithm answers it with a trellis almost identical to the forward algorithm\'s — sum replaced by max — plus one new ingredient, backpointers, needed to recover the winning path once the best final probability is found.',
    hook: 'Swap one symbol — Σ for max — in the forward recursion and you get an entirely different algorithm solving an entirely different problem. That single-symbol relationship between "total probability" and "best explanation" recurs throughout probabilistic modelling, and Viterbi is the cleanest place to see it happen.',
    sections: [
      {
        heading: 'The Decoding Task',
        blocks: [
          {
            type: 'text',
            content:
              'For any model with hidden variables, the task of determining which sequence of hidden values most likely produced the observations is called decoding. In the ice-cream domain, given observations 3 1 3, the decoder\'s job is to find the best hidden weather sequence.',
          },
          {
            type: 'definition',
            number: '12.4',
            title: 'Decoding',
            text: 'Given as input an HMM λ=(A,B) and a sequence of observations O=o₁,o₂,…,o_T, find the most probable sequence of states Q=q₁q₂q₃…q_T.',
          },
          {
            type: 'text',
            content:
              'One might propose: for every possible hidden state sequence, run the forward algorithm restricted to that one path and compute P(O|Q), then choose the Q with the largest value. This has exactly the same problem as Section 12.3\'s naive approach to Problem 1 — there are Nᵀ candidate sequences, an exponential number. Instead, the Viterbi algorithm — like the forward algorithm, a dynamic-programming method using a trellis — finds the best sequence directly, in O(N²T) time.',
          },
        ],
      },
      {
        heading: 'The Viterbi Trellis',
        blocks: [
          {
            type: 'text',
            content:
              'Each cell of the Viterbi trellis, vₜ(j), represents the probability that the HMM is in state j after seeing the first t observations and passing through the single most probable state sequence q₁,…,q_{t−1} leading there — the maximum, not the sum, over every path into that cell:',
          },
          {
            type: 'formula',
            latex: 'v_t(j) = \\max_{q_1,\\dots,q_{t-1}} P(q_1 \\dots q_{t-1},\\, o_1, o_2 \\dots o_t,\\, q_t = j \\mid \\lambda)',
            label: 'The Viterbi variable — the probability of the single best path reaching state j at time t',
          },
          {
            type: 'theorem',
            number: '12.4.1',
            title: 'The Viterbi Recursion',
            text: 'Given the Viterbi probability of every state at time t−1, the value at time t is the single best extension:',
            formula: 'v_t(j) = \\max_{i=1}^{N} v_{t-1}(i)\\, a_{ij}\\, b_j(o_t)',
          },
          {
            type: 'text',
            content:
              'This is the forward recursion of Theorem 12.3.1 with the sum replaced by a max — every other ingredient is identical: the previous path probability vₜ₋₁(i), the transition aᵢⱼ, and the observation likelihood bⱼ(oₜ).',
          },
        ],
      },
      {
        heading: 'Backpointers and the Viterbi Backtrace',
        blocks: [
          {
            type: 'text',
            content:
              'The Viterbi algorithm needs one thing the forward algorithm doesn\'t: backpointers. The forward algorithm only ever needs to produce a single number, the total likelihood — but Viterbi must also produce the winning state sequence itself, not just its probability. This is done by recording, at every cell, which predecessor state achieved the maximum.',
          },
          {
            type: 'theorem',
            number: '12.4 (algorithm)',
            title: 'The Viterbi Algorithm',
            text: '1. Initialization: v₁(j)=πⱼbⱼ(o₁), bt₁(j)=0, for 1≤j≤N. 2. Recursion, for 1<t≤T, 1≤j≤N: vₜ(j)=maxᵢ vₜ₋₁(i)aᵢⱼbⱼ(oₜ), and btₜ(j)=argmaxᵢ vₜ₋₁(i)aᵢⱼbⱼ(oₜ). 3. Termination: the best score is P*=maxᵢv_T(i), and the backtrace starts at q_T*=argmaxᵢv_T(i), following backpointers back to time 1.',
          },
          {
            type: 'example',
            number: '12.4.2',
            title: 'Decoding 3 1 3',
            body:
              'Using the ice-cream HMM (Example 12.2.1), the Viterbi trellis for O=3,1,3 gives v₁(HOT)=0.320, v₁(COLD)=0.020; v₂(HOT)=max(0.320·0.12, 0.020·0.10)=0.0384 (from HOT), v₂(COLD)=max(0.320·0.20, 0.020·0.25)=0.064 (from HOT); v₃(HOT)=max(0.0384·0.24, 0.064·0.20)=0.0128 (from COLD), v₃(COLD)=max(0.0384·0.04, 0.064·0.05)=0.0032 (from COLD). The best final score is v₃(HOT)=0.0128, and following backpointers gives the best hidden sequence HOT, COLD, HOT — someone eating a lot of ice cream, then a little, then a lot again is best explained by hot weather, a cold snap, then hot weather again.',
          },
          { type: 'viz', vizId: 'viz-ch12-viterbi-trellis' },
          {
            type: 'predict',
            title: 'Forward vs. Viterbi on the same trellis',
            question: 'Both α₃(HOT)+α₃(COLD) (forward, Example 12.3.3) and v₃(HOT) (Viterbi, Example 12.4.2) are computed from the same HMM and the same observations 3 1 3, using structurally identical trellises. Why is the forward total (≈0.02856) so much larger than the single best Viterbi path probability (0.0128)?',
            reveal: 'Because the forward total sums the probability contributed by all eight possible three-day hidden sequences, while the Viterbi value is the probability of exactly one of them — the single most probable path. The best path alone (HOT, COLD, HOT at 0.0128) accounts for a large share of the total (0.0128/0.02856 ≈ 45%), but the other seven sequences, even though each is individually much less probable, still contribute the remaining probability mass when added together. This is the general relationship between decoding and likelihood: the best path\'s probability is always at most the total likelihood, since it is only one term inside the sum that produces it.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 12.5  HMM Training: The Forward-Backward Algorithm
  // ─────────────────────────────────────────────
  {
    id: 'forward-backward-algorithm',
    title: 'HMM Training: The Forward-Backward Algorithm',
    chapterRef: 'Chapter 12 · Section 12.5',
    description:
      'Problem 3 is learning: given only an observation sequence and a set of possible hidden states — no labels at all — estimate the transition matrix A and emission matrix B. The forward-backward (Baum-Welch) algorithm solves this with Expectation-Maximization: repeatedly compute expected state occupancy from the current parameter estimates, then re-estimate the parameters from those expectations, iterating until convergence.',
    hook: 'When the hidden states are actually labelled, learning an HMM is just counting — no different from estimating any Markov chain\'s transition matrix from data. Forward-backward is what happens when you try to keep counting even though you can no longer see what you\'re counting: it replaces every count with its expected value under the model\'s own current best guess, then repeats.',
    sections: [
      {
        heading: 'The Fully-Observed Case: Learning by Counting',
        blocks: [
          {
            type: 'text',
            content:
              'The input to a learning algorithm is an unlabelled sequence of observations O and a set of possible hidden states. Before tackling the hard, unlabelled case, consider the much simpler case of training a fully-visible Markov model, where the hidden state at every time step happens to be known.',
          },
          {
            type: 'example',
            number: '12.5.1',
            title: 'Learning from Labelled Data',
            body:
              'Suppose we see the observation sequence 3 3 2 1 1 2 1 2 3, aligned with the known hidden sequence hot hot cold cold cold cold cold hot hot. Counting the initial states across three independent 3-day runs gives π_hot=1/3, π_cold=2/3. Counting transitions (ignoring the final state of each run) gives P(hot|hot)=2/3, P(cold|hot)=1/3, P(cold|cold)=2/3, P(hot|cold)=1/3. Counting emissions per state gives P(1|hot)=0/4=0, P(2|hot)=1/4=.25, P(3|hot)=3/4=.75, and P(1|cold)=3/5=.6, P(2|cold)=2/5=.4, P(3|cold)=0/5=0 — plain maximum-likelihood estimation, exactly as in [[markov-chains|Chapter 11]].',
          },
          {
            type: 'text',
            content:
              'For a real HMM, we cannot compute these counts directly, since we don\'t know which hidden path was actually taken for a given observation sequence. Worse than just one missing label: we don\'t know the counts of being in any hidden state at all. The Baum-Welch algorithm solves this by iteratively estimating the counts — starting from some estimate of A and B, computing the forward probability for the observations, dividing that probability mass among all the paths that contributed to it, and using the result to derive better and better probabilities.',
          },
        ],
      },
      {
        heading: 'The Backward Probability',
        blocks: [
          {
            type: 'text',
            content:
              'To understand the algorithm, we need a probability related to the forward probability, but running in the opposite direction: the backward probability β. It is the probability of seeing the observations from time t+1 to the end, given that we are in state i at time t:',
          },
          {
            type: 'formula',
            latex: '\\beta_t(i) = P(o_{t+1}, o_{t+2}, \\dots, o_T \\mid q_t = i, \\lambda)',
            label: 'The backward variable',
          },
          {
            type: 'theorem',
            number: '12.5 (backward algorithm)',
            title: 'The Backward Recursion',
            text: '1. Initialization: β_T(i)=1 for 1≤i≤N. 2. Recursion, for 1≤t<T, 1≤i≤N: βₜ(i)=Σⱼaᵢⱼbⱼ(oₜ₊₁)βₜ₊₁(j). 3. Termination: P(O|λ)=Σⱼπⱼbⱼ(o₁)β₁(j).',
          },
          {
            type: 'example',
            number: '12.5.2',
            title: 'Backward Probabilities for 3 1 3',
            body:
              'For the ice-cream HMM and O=3,1,3: β₃(HOT)=β₃(COLD)=1 (initialization). Then β₂(HOT)=0.6·0.4·1+0.4·0.1·1=0.28, β₂(COLD)=0.5·0.4·1+0.5·0.1·1=0.25. Then β₁(HOT)=0.6·0.2·0.28+0.4·0.5·0.25=0.0836, β₁(COLD)=0.5·0.2·0.28+0.5·0.5·0.25=0.0905. Checking the termination formula: π_HOT·b_HOT(3)·β₁(HOT)+π_COLD·b_COLD(3)·β₁(COLD) = 0.8·0.4·0.0836+0.2·0.1·0.0905 ≈ 0.02856 — matching the forward algorithm\'s total from Example 12.3.3 exactly, as it must, since both compute the same P(O|λ) by summing over the same paths in opposite directions.',
          },
        ],
      },
      {
        heading: 'Re-estimating the Transition Probabilities',
        blocks: [
          {
            type: 'text',
            content:
              'We are now ready to see how the forward and backward probabilities together let us estimate the transition probability aᵢⱼ and observation probability bᵢ(oₜ) from an observation sequence, even though the actual hidden path is never directly seen. Begin with a variant of ordinary maximum-likelihood estimation:',
          },
          {
            type: 'formula',
            latex: '\\hat{a}_{ij} = \\frac{\\text{expected number of transitions from state } i \\text{ to state } j}{\\text{expected number of transitions from state } i}',
            label: 'Re-estimating a transition probability from expected, rather than observed, counts',
          },
          {
            type: 'text',
            content:
              'The numerator needs the probability that a given transition i→j was taken at each particular time t, summed over all t. Define ξₜ(i,j) as the probability of being in state i at time t and state j at time t+1, given the observations and the model:',
          },
          {
            type: 'formula',
            latex: '\\xi_t(i,j) = P(q_t = i, q_{t+1} = j \\mid O, \\lambda) = \\frac{\\alpha_t(i)\\, a_{ij}\\, b_j(o_{t+1})\\, \\beta_{t+1}(j)}{P(O \\mid \\lambda)}',
            label: 'The probability of taking transition i→j at time t, given all the observations',
          },
          {
            type: 'text',
            content:
              'The numerator α_t(i) a_ij b_j(o_{t+1}) β_{t+1}(j) multiplies exactly four things: the forward probability up to and including state i at time t, the transition probability, the emission probability of the next observation, and the backward probability from state j at time t+1 onward — every path through the arc i→j at time t, weighted correctly. Dividing by P(O|λ) turns this into a genuine conditional probability. Summing ξₜ(i,j) over every t gives the expected number of transitions from i to j; summing over every destination j as well gives the expected number of transitions out of i altogether:',
          },
          {
            type: 'formula',
            latex: '\\hat{a}_{ij} = \\frac{\\sum_{t=1}^{T-1} \\xi_t(i,j)}{\\sum_{t=1}^{T-1} \\sum_{k=1}^{N} \\xi_t(i,k)}',
            label: 'The Baum-Welch re-estimation formula for the transition matrix',
          },
        ],
      },
      {
        heading: 'Re-estimating the Observation Probabilities',
        blocks: [
          {
            type: 'text',
            content:
              'A similar idea re-estimates the observation probability b̂ⱼ(v_k) — the probability of a given symbol v_k from the vocabulary, given state j. First define γₜ(j), the probability of being in state j at time t given the observations:',
          },
          {
            type: 'formula',
            latex: '\\gamma_t(j) = P(q_t = j \\mid O, \\lambda) = \\frac{\\alpha_t(j)\\,\\beta_t(j)}{P(O \\mid \\lambda)}',
            label: 'The probability of occupying state j at time t, given all the observations',
          },
          {
            type: 'text',
            content:
              'γ is really a degenerate case of ξ, with the destination state collapsed onto the source state — the numerator is just the product of the forward and backward probabilities at that one cell. The re-estimated emission probability then sums γₜ(j) over exactly those time steps where the observation actually was v_k, divided by the sum of γₜ(j) over every time step:',
          },
          {
            type: 'formula',
            latex: '\\hat{b}_j(v_k) = \\frac{\\displaystyle\\sum_{t=1 \\text{ s.t. } o_t = v_k}^{T} \\gamma_t(j)}{\\displaystyle\\sum_{t=1}^{T} \\gamma_t(j)}',
            label: 'The Baum-Welch re-estimation formula for the emission matrix',
          },
          {
            type: 'example',
            number: '12.5.3',
            title: 'State Occupancy for 3 1 3',
            body:
              'Combining the forward probabilities of Example 12.3.3 and backward probabilities of Example 12.5.2 with P(O|λ)≈0.02856 gives γₜ(HOT) at each day: γ₁(HOT)=(0.320)(0.0836)/0.02856≈0.937, γ₂(HOT)=(0.0404)(0.28)/0.02856≈0.396, γ₃(HOT)=(0.023496)(1)/0.02856≈0.823 — so, having observed 3, 1, then 3 ice creams, the model believes day 1 was very likely hot (94%), day 2 more likely cold (60% cold), and day 3 hot again (82%), a "soft" version of the single hard Viterbi path (HOT, COLD, HOT) found in Example 12.4.2.',
          },
          { type: 'viz', vizId: 'viz-ch12-forward-backward' },
        ],
      },
      {
        heading: 'Putting It Together: Expectation-Maximization',
        blocks: [
          {
            type: 'text',
            content:
              'The standard algorithm for HMM training is the forward-backward, or Baum-Welch, algorithm (Baum, 1972), a special case of the Expectation-Maximization (EM) algorithm (Dempster et al., 1977). It starts with some initial estimate of the HMM parameters λ=(A,B), then iterates two steps until convergence.',
          },
          {
            type: 'theorem',
            number: '12.5 (algorithm)',
            title: 'The Forward-Backward Algorithm',
            text: 'E-step: compute γₜ(j) and ξₜ(i,j) for every t, i, and j from the current A and B (using the forward and backward recursions). M-step: use those expected counts to recompute new estimates â and b̂ via the re-estimation formulas above. Iterate until the parameters (or the observation likelihood) converge.',
          },
          {
            type: 'text',
            content:
              'In the E-step (expectation step), we compute the expected state-occupancy count γ and the expected state-transition count ξ from the current A and B probabilities. In the M-step (maximization step), we use γ and ξ to recompute new A and B probabilities — each iteration is guaranteed not to decrease the observation likelihood P(O|λ), the defining property of EM.',
          },
          {
            type: 'predict',
            title: 'Why initial conditions matter',
            question: 'Although forward-backward can in principle learn A and B from completely unlabelled data, why might starting it from a poor initial guess for A and B lead to a bad final answer, given that EM is guaranteed never to decrease the likelihood at each step?',
            reveal: 'EM is only guaranteed to converge to a local maximum of the likelihood, not necessarily the global one — "never decreasing" each step still allows the algorithm to climb into, and get permanently stuck at, a mediocre local peak if the starting point is bad. In practice, this is exactly why forward-backward is often given extra information rather than run from a blank slate: for example, the HMM\'s structure is frequently set by hand, with only some of the emission and transition probabilities left to be learned from data — narrowing the search space so the EM iterations have a much better chance of finding a genuinely good solution rather than settling for a poor local one.',
          },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────
  // 12.6  Summary and Historical Notes
  // ─────────────────────────────────────────────
  {
    id: 'hmm-summary',
    title: 'Summary and Historical Notes',
    chapterRef: 'Chapter 12 · Section 12.6',
    description:
      'This chapter introduced the hidden Markov model for probabilistic sequence modelling: how to specify one, how to compute the likelihood of an observation sequence (forward algorithm), how to decode the most probable hidden sequence (Viterbi algorithm), and how to learn the model\'s own parameters from unlabelled data (forward-backward / Baum-Welch algorithm). This closing section ties the three algorithms together and traces where each one came from.',
    hook: 'Every algorithm in this chapter reduces to the same trellis, with one operator swapped: sum for Problem 1, max for Problem 2, and sum again — twice, forwards and backwards — for Problem 3. Seeing that shared skeleton is worth more than memorising any one of the three recursions individually.',
    sections: [
      {
        heading: 'Chapter Summary',
        blocks: [
          {
            type: 'text',
            content:
              'Hidden Markov models (HMMs) are a way of relating a sequence of observations to a sequence of hidden states that explain them, extending the plain Markov chains of Section 12.1 and [[markov-chains|Chapter 11]] with an emission layer B connecting each hidden state to what is actually observed.',
          },
          {
            type: 'text',
            content:
              'The three fundamental problems of Section 12.2 each have a dedicated dynamic-programming solution: Problem 1 (likelihood, P(O|λ)) is solved by the forward algorithm in O(N²T) time, summing over all Nᵀ hidden paths without ever enumerating them individually. Problem 2 (decoding, the single best hidden sequence) is solved by the Viterbi algorithm — structurally the forward algorithm with max in place of sum, plus backpointers to recover the winning path. Problem 3 (learning A and B from unlabelled data) is solved by the forward-backward, or Baum-Welch, algorithm, an instance of Expectation-Maximization that alternates computing expected state occupancy (γ) and expected transition counts (ξ) with re-estimating the model parameters from them.',
          },
          {
            type: 'formula',
            latex: '\\underbrace{\\alpha_t(j)=\\sum_i \\alpha_{t-1}(i)a_{ij}b_j(o_t)}_{\\text{forward: total probability}} \\qquad \\underbrace{v_t(j)=\\max_i v_{t-1}(i)a_{ij}b_j(o_t)}_{\\text{Viterbi: best single path}}',
            label: 'The shared trellis recursion behind Problems 1 and 2 — sum versus max',
          },
          {
            type: 'text',
            content:
              'Together, these three algorithms let an HMM be specified, queried, and — crucially — fit to data without ever needing to see the hidden states directly. That last property, learning entirely from what can be observed, is what makes HMMs useful far beyond any one application: any process with an unobserved regime driving observable outputs is a candidate for this same machinery.',
          },
        ],
      },
      {
        heading: 'Historical Notes',
        blocks: [
          {
            type: 'text',
            content:
              'Markov chains were first used by Markov (1913) to predict whether an upcoming letter in Pushkin\'s Eugene Onegin would be a vowel or a consonant — the same one-step-memory idea underlying every Markov chain in [[markov-chains|Chapter 11]]. The hidden Markov model itself was developed by Leonard Baum and colleagues at the Institute for Defense Analyses in Princeton in the mid-to-late 1960s (Baum and Petrie, 1966; Baum and Eagon, 1967), with the forward-backward training algorithm following in Baum (1972).',
          },
          {
            type: 'text',
            content:
              'The Viterbi algorithm has, in the words of one historian of the subject, a "remarkable history of multiple independent discovery and publication." At least seven independently-discovered variants have been published across four separate fields: information theory (Viterbi, 1967), speech processing (Vintsyuk, 1968; Sakoe and Chiba, 1971), molecular biology (Needleman and Wunsch, 1970; Sankoff, 1972; Reichert et al., 1973), and computer science (Wagner and Fischer, 1974) — the same underlying dynamic-programming idea reinvented again and again because so many different fields turn out to need exactly this operation.',
          },
          {
            type: 'text',
            content:
              'The presentation of HMMs as characterised by three fundamental problems (Section 12.2) follows an influential tutorial by Rabiner (1989), itself based on earlier tutorials by Jack Ferguson of IDA in the 1960s. The forward-backward algorithm\'s relationship to the general Expectation-Maximization framework was formalised by Dempster, Laird, and Rubin (1977), and the ice-cream teaching example used throughout this chapter is due to Jason Eisner (2002), designed specifically to make the forward-backward algorithm workable by hand on a spreadsheet.',
          },
          {
            type: 'predict',
            title: 'One idea, many names',
            question: 'The same dynamic-programming recursion behind the Viterbi algorithm was independently discovered in speech processing, molecular biology, and computer science, under different names (dynamic time warping, sequence alignment, edit distance). What does this recurring pattern suggest about when a "max over one-step extensions" trellis is the right tool to reach for?',
            reveal: 'Whenever a problem asks for the single best way to build up a structure step by step — matching two sequences, decoding a hidden path, aligning two strings — and "best so far" at each partial step can be computed purely from "best so far" one step earlier plus one local cost, a max-based trellis of this kind is almost always available and almost always efficient, turning an exponential search over full structures into a polynomial one over partial ones. Recognising that shape in a new problem is often the entire difficulty; once recognised, the recursion itself is usually short, exactly as Viterbi\'s independent rediscovery across four unrelated fields suggests.',
          },
        ],
      },
    ],
  },

];

export function getCh12ConceptById(id: string): ProbabilityConcept | undefined {
  return ch12Concepts.find(c => c.id === id);
}
