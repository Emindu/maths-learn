export interface PythonExercise {
  id: string;
  number: string;
  title: string;
  description: string;
  starterCode: string;
  solution: string;
  expectedHint?: string;
}

export const pythonExercisesByConceptId: Record<string, PythonExercise[]> = {

  'probability-intro': [
    {
      id: 'py-intro-1',
      number: 'Py 1.1',
      title: 'Sample Space Enumeration',
      description:
        'Use Python to build and inspect sample spaces. ' +
        'Task: (a) Create the sample space for rolling one fair die. ' +
        '(b) Create the sample space for tossing two coins. ' +
        '(c) Print the size of each sample space.',
      starterCode:
`import itertools

# (a) One fair die
die_space = list(range(1, 7))
print("Die S:", die_space)
print("|S| =", len(die_space))

# (b) Two coins — complete the code below
coin_faces = ['H', 'T']
# TODO: use itertools.product to build the sample space for 2 coins
two_coins = list(itertools.product(coin_faces, coin_faces))
print("\\nTwo-coin S:", two_coins)
print("|S| =", len(two_coins))

# (c) Event: both coins are Heads
# TODO: filter two_coins for the event A = {(H,H)}
A = [s for s in two_coins if all(c == 'H' for c in s)]
print("\\nA = both Heads:", A)
print("P(A) =", len(A) / len(two_coins))
`,
      solution:
`import itertools

# (a) One fair die
die_space = list(range(1, 7))
print("Die S:", die_space)
print("|S| =", len(die_space))

# (b) Two coins
coin_faces = ['H', 'T']
two_coins = list(itertools.product(coin_faces, coin_faces))
print("\\nTwo-coin S:", two_coins)
print("|S| =", len(two_coins))

# (c) Event A = {(H,H)}
A = [s for s in two_coins if all(c == 'H' for c in s)]
print("\\nA = both Heads:", A)
print("P(A) =", len(A) / len(two_coins))
`,
      expectedHint: 'Expect |S| = 6 for one die, |S| = 4 for two coins, P(HH) = 0.25',
    },
    {
      id: 'py-intro-2',
      number: 'Py 1.2',
      title: 'Law of Large Numbers — Coin Flip Simulation',
      description:
        'Simulate many coin flips and watch the relative frequency of Heads converge to 0.5. ' +
        'Task: flip a fair coin N times and print the relative frequency for N = 10, 100, 1 000, 10 000, 100 000.',
      starterCode:
`import random
random.seed(42)

# TODO: for each N in [10, 100, 1000, 10000, 100000],
# simulate N flips and compute freq = (# Heads) / N
sizes = [10, 100, 1_000, 10_000, 100_000]
for N in sizes:
    flips = [random.choice(['H', 'T']) for _ in range(N)]
    heads = flips.count('H')
    freq  = heads / N
    # TODO: print N and freq, formatted nicely
    print(f"N={N:>7,}  freq(H)={freq:.5f}  error={abs(freq - 0.5):.5f}")
`,
      solution:
`import random
random.seed(42)

sizes = [10, 100, 1_000, 10_000, 100_000]
for N in sizes:
    flips = [random.choice(['H', 'T']) for _ in range(N)]
    heads = flips.count('H')
    freq  = heads / N
    print(f"N={N:>7,}  freq(H)={freq:.5f}  error={abs(freq - 0.5):.5f}")
`,
      expectedHint: 'As N grows the error should shrink toward 0.',
    },
  ],

  'probability-models': [
    {
      id: 'py-models-1',
      number: 'Py 1.3',
      title: 'Validating a Probability Model',
      description:
        'Write a function that verifies the three Kolmogorov axioms for a finite probability model. ' +
        'Test it on a fair die and a loaded die.',
      starterCode:
`def is_valid_model(sample_space, prob):
    """
    sample_space: list of outcomes
    prob: dict mapping each outcome -> probability
    Returns True if axioms hold, False otherwise.
    """
    # Axiom 1: all probabilities >= 0
    if any(prob[s] < 0 for s in sample_space):
        return False, "Axiom 1 violated: negative probability"
    # Axiom 2: probabilities sum to 1
    total = sum(prob[s] for s in sample_space)
    if abs(total - 1.0) > 1e-9:
        return False, f"Axiom 2 violated: total = {total}"
    return True, "Valid probability model ✓"

# Fair die
S = [1, 2, 3, 4, 5, 6]
fair = {s: 1/6 for s in S}
print("Fair die:", is_valid_model(S, fair))

# Loaded die — P(6) = 0.5, rest share 0.5
loaded = {1: 0.1, 2: 0.1, 3: 0.1, 4: 0.1, 5: 0.1, 6: 0.5}
print("Loaded die:", is_valid_model(S, loaded))

# Invalid model — negative prob
invalid = {1: -0.1, 2: 0.3, 3: 0.3, 4: 0.3, 5: 0.1, 6: 0.1}
print("Invalid:", is_valid_model(S, invalid))

# TODO: try your own model — change the probabilities below and test
my_model = {1: 1/3, 2: 0, 3: 2/3}
print("My model:", is_valid_model([1, 2, 3], my_model))
`,
      solution:
`def is_valid_model(sample_space, prob):
    if any(prob[s] < 0 for s in sample_space):
        return False, "Axiom 1 violated: negative probability"
    total = sum(prob[s] for s in sample_space)
    if abs(total - 1.0) > 1e-9:
        return False, f"Axiom 2 violated: total = {total}"
    return True, "Valid probability model ✓"

S = [1, 2, 3, 4, 5, 6]
fair   = {s: 1/6 for s in S}
loaded = {1: 0.1, 2: 0.1, 3: 0.1, 4: 0.1, 5: 0.1, 6: 0.5}
invalid = {1: -0.1, 2: 0.3, 3: 0.3, 4: 0.3, 5: 0.1, 6: 0.1}

print("Fair die:", is_valid_model(S, fair))
print("Loaded die:", is_valid_model(S, loaded))
print("Invalid:", is_valid_model(S, invalid))

my_model = {1: 1/3, 2: 0, 3: 2/3}
print("My model (Ex 1.2.8):", is_valid_model([1, 2, 3], my_model))
`,
      expectedHint: 'Fair die ✓, loaded die ✓, invalid → Axiom 1 violated.',
    },
    {
      id: 'py-models-2',
      number: 'Py 1.4',
      title: 'Computing Event Probabilities',
      description:
        'Given a probability model, write a general function that computes P(A) for any event A (subset of S). ' +
        'Use it to verify Exercise 1.2.1.',
      starterCode:
`# Probability model: fair die
S    = list(range(1, 7))
prob = {s: 1/6 for s in S}

def P(event, prob_dict):
    """Return P(event) = sum of prob[s] for s in event."""
    # TODO: implement this
    return sum(prob_dict[s] for s in event)

# Test with Exercise 1.2.1
print("P({1,2})      =", P([1, 2], prob))      # should be 1/3 ≈ 0.3333
print("P({1,2,3,4,5,6}) =", P(S, prob))        # should be 1

# Even numbers
A_even = [s for s in S if s % 2 == 0]
print("P(even)       =", P(A_even, prob))       # 0.5

# Numbers > 4
A_gt4 = [s for s in S if s > 4]
print("P(>4)         =", P(A_gt4, prob))        # 1/3
`,
      solution:
`S    = list(range(1, 7))
prob = {s: 1/6 for s in S}

def P(event, prob_dict):
    return sum(prob_dict[s] for s in event)

print("P({1,2})      =", round(P([1, 2], prob), 6))
print("P(S)          =", P(S, prob))
A_even = [s for s in S if s % 2 == 0]
print("P(even)       =", P(A_even, prob))
A_gt4  = [s for s in S if s > 4]
print("P(>4)         =", round(P(A_gt4, prob), 6))
`,
      expectedHint: 'P({1,2}) ≈ 0.3333, P(S) = 1.0, P(even) = 0.5, P(>4) ≈ 0.3333',
    },
  ],

  'probability-properties': [
    {
      id: 'py-props-1',
      number: 'Py 1.5',
      title: 'Inclusion-Exclusion Principle',
      description:
        'Implement the inclusion-exclusion formula and verify it empirically by simulation. ' +
        'Task: for a fair die, let A = even faces and B = faces ≤ 3. ' +
        'Verify P(A ∪ B) = P(A) + P(B) − P(A ∩ B) both analytically and by simulation.',
      starterCode:
`import random
random.seed(0)

S = list(range(1, 7))
prob = {s: 1/6 for s in S}

def P(event, prob_dict):
    return sum(prob_dict[s] for s in event if s in prob_dict)

# Define events
A = {2, 4, 6}       # even
B = {1, 2, 3}       # <= 3
A_inter_B = A & B
A_union_B = A | B

# TODO: compute analytically using inclusion-exclusion
p_A     = P(A, prob)
p_B     = P(B, prob)
p_AB    = P(A_inter_B, prob)
p_AuB   = p_A + p_B - p_AB   # inclusion-exclusion

print("=== Analytical ===")
print(f"P(A)      = {p_A:.4f}")
print(f"P(B)      = {p_B:.4f}")
print(f"P(A∩B)    = {p_AB:.4f}")
print(f"P(A∪B) IE = {p_AuB:.4f}")
print(f"P(A∪B) direct = {P(A_union_B, prob):.4f}")

# TODO: verify by simulation (N = 100_000)
N = 100_000
hits_AuB = sum(1 for _ in range(N) if random.choice(S) in A_union_B)
print(f"\\n=== Simulation (N={N:,}) ===")
print(f"P(A∪B) ≈ {hits_AuB / N:.4f}")
`,
      solution:
`import random
random.seed(0)

S    = list(range(1, 7))
prob = {s: 1/6 for s in S}

def P(event, prob_dict):
    return sum(prob_dict[s] for s in event if s in prob_dict)

A = {2, 4, 6}; B = {1, 2, 3}
A_inter_B = A & B; A_union_B = A | B

p_A = P(A, prob); p_B = P(B, prob); p_AB = P(A_inter_B, prob)
p_AuB = p_A + p_B - p_AB

print("=== Analytical ===")
print(f"P(A)={p_A:.4f}  P(B)={p_B:.4f}  P(A∩B)={p_AB:.4f}")
print(f"P(A∪B) via I-E = {p_AuB:.4f}")
print(f"P(A∪B) direct  = {P(A_union_B, prob):.4f}")

N = 100_000
hits = sum(1 for _ in range(N) if random.choice(S) in A_union_B)
print(f"\\nSimulation (N={N:,}): P(A∪B) ≈ {hits/N:.4f}")
`,
      expectedHint: 'P(A∪B) should be 5/6 ≈ 0.8333 by both methods.',
    },
    {
      id: 'py-props-2',
      number: 'Py 1.6',
      title: 'Complement Rule and Boole\'s Inequality',
      description:
        'Verify the complement rule P(Aᶜ) = 1 − P(A) and Boole\'s inequality ' +
        'P(A ∪ B) ≤ P(A) + P(B) for random events on a deck of 52 cards.',
      starterCode:
`import random
random.seed(1)

# Build a deck
suits = ['♠', '♥', '♦', '♣']
ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
deck  = [(r, s) for s in suits for r in ranks]

# Event A: card is an Ace
A = {c for c in deck if c[0] == 'A'}
# Event B: card is a Heart
B = {c for c in deck if c[1] == '♥'}

p_A  = len(A) / 52
p_B  = len(B) / 52
p_Ac = len(set(deck) - A) / 52   # complement

print("=== Complement rule ===")
print(f"P(A)  = {p_A:.4f}")
print(f"P(Aᶜ) = {p_Ac:.4f}")
print(f"P(A) + P(Aᶜ) = {p_A + p_Ac:.4f}  (should be 1)")

# Inclusion-exclusion on A ∪ B
p_AB  = len(A & B) / 52
p_AuB = p_A + p_B - p_AB

print("\\n=== Boole's inequality ===")
print(f"P(A) + P(B)  = {p_A + p_B:.4f}")
print(f"P(A ∪ B)     = {p_AuB:.4f}  (≤ P(A)+P(B) ✓)")

# TODO: simulate drawing 100 000 cards and estimate P(Ace or Heart)
N = 100_000
hits = sum(1 for _ in range(N) if random.choice(deck) in (A | B))
print(f"\\nSimulation P(A∪B) ≈ {hits/N:.4f}  (expected {p_AuB:.4f})")
`,
      solution:
`import random
random.seed(1)

suits = ['♠','♥','♦','♣']
ranks = ['A','2','3','4','5','6','7','8','9','10','J','Q','K']
deck  = [(r,s) for s in suits for r in ranks]

A = {c for c in deck if c[0]=='A'}
B = {c for c in deck if c[1]=='♥'}

p_A = len(A)/52; p_B = len(B)/52
p_Ac = len(set(deck)-A)/52
p_AB = len(A&B)/52; p_AuB = p_A+p_B-p_AB

print("P(A) =",round(p_A,4),"  P(Aᶜ) =",round(p_Ac,4))
print("P(A)+P(Aᶜ) =", round(p_A+p_Ac,4))
print("P(A)+P(B) =",round(p_A+p_B,4),"  P(A∪B) =",round(p_AuB,4))

N=100_000
hits=sum(1 for _ in range(N) if random.choice(deck) in (A|B))
print(f"Simulation P(A∪B) ≈ {hits/N:.4f}")
`,
      expectedHint: 'P(A∪B) = 16/52 ≈ 0.3077; Boole upper bound = 4/52+13/52 = 17/52 ≈ 0.3269.',
    },
  ],

  'uniform-probability': [
    {
      id: 'py-uniform-1',
      number: 'Py 1.7',
      title: 'Dice Sum Distribution',
      description:
        'Compute the theoretical probability distribution of the sum of two fair dice, ' +
        'then verify it by simulation. Print a table showing P(sum = k) for k = 2 to 12.',
      starterCode:
`import random
from collections import Counter
random.seed(7)

# --- Theoretical ---
# Count outcomes for each sum
outcomes = {}
for d1 in range(1, 7):
    for d2 in range(1, 7):
        s = d1 + d2
        outcomes[s] = outcomes.get(s, 0) + 1

print(f"{'Sum':>4}  {'Theory':>8}  {'Sim(100k)':>10}")
print("-" * 28)

# --- Simulation ---
N = 100_000
rolls = [random.randint(1,6) + random.randint(1,6) for _ in range(N)]
sim_counts = Counter(rolls)

for k in range(2, 13):
    theory = outcomes.get(k, 0) / 36
    sim    = sim_counts.get(k, 0) / N
    print(f"{k:>4}  {theory:>8.4f}  {sim:>10.4f}")

# TODO: which sum is most likely?
most_likely = max(outcomes, key=outcomes.get)
print(f"\\nMost likely sum: {most_likely}  (P = {outcomes[most_likely]/36:.4f})")
`,
      solution:
`import random
from collections import Counter
random.seed(7)

outcomes = {}
for d1 in range(1,7):
    for d2 in range(1,7):
        outcomes[d1+d2] = outcomes.get(d1+d2, 0) + 1

N = 100_000
rolls = [random.randint(1,6)+random.randint(1,6) for _ in range(N)]
sim   = Counter(rolls)

print(f"{'Sum':>4}  {'Theory':>8}  {'Sim':>8}")
for k in range(2,13):
    print(f"{k:>4}  {outcomes.get(k,0)/36:>8.4f}  {sim.get(k,0)/N:>8.4f}")

best = max(outcomes, key=outcomes.get)
print(f"Most likely sum: {best}  P={outcomes[best]/36:.4f}")
`,
      expectedHint: 'Sum = 7 is most likely with P = 6/36 ≈ 0.1667.',
    },
    {
      id: 'py-uniform-2',
      number: 'Py 1.8',
      title: 'Monte Carlo Estimation of π',
      description:
        'Use the geometric probability model to estimate π. ' +
        'Points are chosen uniformly in [−1, 1] × [−1, 1]. ' +
        'P(point inside unit circle) = π/4. Estimate π for N = 1 000, 10 000, 100 000.',
      starterCode:
`import random, math
random.seed(3)

print(f"{'N':>8}  {'π estimate':>12}  {'error':>10}")
print("-" * 36)

for N in [1_000, 10_000, 100_000]:
    inside = 0
    for _ in range(N):
        x = random.uniform(-1, 1)
        y = random.uniform(-1, 1)
        # TODO: check if (x, y) is inside the unit circle
        if x**2 + y**2 <= 1:
            inside += 1
    pi_est = 4 * inside / N
    print(f"{N:>8,}  {pi_est:>12.6f}  {abs(pi_est - math.pi):>10.6f}")

print(f"\\nTrue π = {math.pi:.6f}")
`,
      solution:
`import random, math
random.seed(3)

print(f"{'N':>8}  {'π estimate':>12}  {'error':>10}")
print("-" * 36)

for N in [1_000, 10_000, 100_000]:
    inside = sum(1 for _ in range(N)
                 if random.uniform(-1,1)**2 + random.uniform(-1,1)**2 <= 1)
    pi_est = 4 * inside / N
    print(f"{N:>8,}  {pi_est:>12.6f}  {abs(pi_est-math.pi):>10.6f}")

print(f"\\nTrue π = {math.pi:.6f}")
`,
      expectedHint: 'With N=100 000 you should get π ≈ 3.14 ± 0.01.',
    },
  ],

  'conditional-probability': [
    {
      id: 'py-cond-1',
      number: 'Py 1.9',
      title: 'Bayes\' Theorem Calculator',
      description:
        'Implement Bayes\' theorem as a Python function and apply it to the medical testing scenario from Exercise 1.5.7. ' +
        'Then sweep P(disease) from 0.001 to 0.5 and print the posterior P(D|+).',
      starterCode:
`def bayes_posterior(p_disease, p_pos_given_disease, p_pos_given_no_disease):
    """
    Computes P(disease | positive test) using Bayes' theorem.
    """
    p_no_disease = 1 - p_disease
    # Law of total probability
    p_positive = (p_pos_given_disease * p_disease
                  + p_pos_given_no_disease * p_no_disease)
    if p_positive == 0:
        return 0.0
    # Bayes
    return (p_pos_given_disease * p_disease) / p_positive

# Exercise 1.5.7 values
p_d   = 0.01    # prior prevalence
p_pos_d  = 0.98 # sensitivity
p_pos_nd = 0.05 # false positive rate

posterior = bayes_posterior(p_d, p_pos_d, p_pos_nd)
print(f"P(D|+) = {posterior:.4f}  ({posterior*100:.2f}%)")
print(f"Prior P(D) = {p_d:.2f} → Posterior = {posterior:.4f}")

# Sweep prevalence
print("\\n=== Effect of disease prevalence ===")
print(f"{'P(D)':>8}  {'P(D|+)':>10}")
for p in [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5]:
    post = bayes_posterior(p, p_pos_d, p_pos_nd)
    print(f"{p:>8.3f}  {post:>10.4f}")
`,
      solution:
`def bayes_posterior(p_disease, sensitivity, fpr):
    p_no = 1 - p_disease
    p_pos = sensitivity * p_disease + fpr * p_no
    return (sensitivity * p_disease) / p_pos if p_pos > 0 else 0.0

p_d = 0.01; sens = 0.98; fpr = 0.05
post = bayes_posterior(p_d, sens, fpr)
print(f"P(D|+) = {post:.4f}  ({post*100:.2f}%)")

print("\\nPrevalence sweep:")
print(f"{'P(D)':>8}  {'P(D|+)':>10}")
for p in [0.001, 0.005, 0.01, 0.05, 0.1, 0.2, 0.5]:
    print(f"{p:>8.3f}  {bayes_posterior(p, sens, fpr):>10.4f}")
`,
      expectedHint: 'P(D|+) ≈ 0.165 for prevalence 0.01. At 0.5 prevalence it rises to ~0.951.',
    },
    {
      id: 'py-cond-2',
      number: 'Py 1.10',
      title: 'Independence Check by Simulation',
      description:
        'Simulate rolling a fair die and check whether A = {even} and B = {≤ 3} are independent ' +
        'by verifying P(A ∩ B) ≈ P(A) × P(B) empirically.',
      starterCode:
`import random
random.seed(5)

N = 200_000
A_count = B_count = AB_count = 0

for _ in range(N):
    roll = random.randint(1, 6)
    in_A = (roll % 2 == 0)      # even: {2,4,6}
    in_B = (roll <= 3)           # <= 3: {1,2,3}
    if in_A: A_count += 1
    if in_B: B_count += 1
    if in_A and in_B: AB_count += 1

p_A  = A_count  / N
p_B  = B_count  / N
p_AB = AB_count / N

print(f"P(A)       = {p_A:.4f}  (theoretical: {3/6:.4f})")
print(f"P(B)       = {p_B:.4f}  (theoretical: {3/6:.4f})")
print(f"P(A∩B)     = {p_AB:.4f}  (theoretical: {1/6:.4f})")
print(f"P(A)×P(B)  = {p_A*p_B:.4f}  (theoretical: {(3/6)*(3/6):.4f})")

# Are they independent?
# TODO: compare p_AB to p_A * p_B
diff = abs(p_AB - p_A * p_B)
print(f"\\n|P(A∩B) - P(A)P(B)| = {diff:.4f}")
print("Independent?" , "Yes ✓" if diff < 0.005 else "No ✗")
`,
      solution:
`import random
random.seed(5)

N = 200_000
A_c = B_c = AB_c = 0
for _ in range(N):
    r = random.randint(1,6)
    a = r%2==0; b = r<=3
    if a: A_c+=1
    if b: B_c+=1
    if a and b: AB_c+=1

pA=A_c/N; pB=B_c/N; pAB=AB_c/N
print(f"P(A)={pA:.4f}  P(B)={pB:.4f}  P(A∩B)={pAB:.4f}")
print(f"P(A)×P(B)={pA*pB:.4f}")
print(f"|diff|={abs(pAB-pA*pB):.4f}  Independent: {'Yes ✓' if abs(pAB-pA*pB)<0.005 else 'No ✗'}")
`,
      expectedHint: 'P(A∩B) = 1/6 ≈ 0.1667, P(A)×P(B) = (1/2)(1/2) = 0.25 → NOT independent.',
    },
  ],

  'continuity-of-p': [
    {
      id: 'py-cont-1',
      number: 'Py 1.11',
      title: 'Continuity of Probability — Convergence Table',
      description:
        'For S = {1,2,3,…} with P({s}) = 2⁻ˢ, let Aₙ = {5, 6, …, n}. ' +
        'Compute P(Aₙ) = 2⁻⁴ − 2⁻ⁿ and print the convergence to P(A) = 1/16 = 0.0625.',
      starterCode:
`# P(Aₙ) = 2^{-5} + 2^{-6} + ... + 2^{-n} = 2^{-4} - 2^{-n}
LIMIT = 2**-4  # = 0.0625

print(f"{'n':>5}  {'P(Aₙ)':>12}  {'gap to 1/16':>14}")
print("-" * 36)

for n in list(range(5, 16)) + [20, 25, 30, 50]:
    p_An = 2**-4 - 2**-n
    gap  = LIMIT - p_An
    print(f"{n:>5}  {p_An:>12.8f}  {gap:>14.2e}")

print(f"\\nLimit P(A) = 1/16 = {LIMIT}")
print("As n→∞, P(Aₙ) → P(A) — this is continuity from below.")
`,
      solution:
`LIMIT = 2**-4
print(f"{'n':>5}  {'P(Aₙ)':>12}  {'gap':>12}")
print("-"*32)
for n in list(range(5,16))+[20,25,30,50]:
    p = 2**-4 - 2**-n
    print(f"{n:>5}  {p:>12.8f}  {LIMIT-p:>12.2e}")
print(f"\\nLimit = {LIMIT}")
`,
      expectedHint: 'At n=5: P≈0.03125, gap=0.03125. At n=30: gap≈9.3×10⁻¹⁰.',
    },
    {
      id: 'py-cont-2',
      number: 'Py 1.12',
      title: 'Geometric Distribution and Set Limits',
      description:
        'Demonstrate continuity from above: let Bₙ = {n, n+1, n+2, …} with P({k}) = 2⁻ᵏ. ' +
        'Show P(Bₙ) = 2^{−(n−1)} → 0 as n → ∞, and verify ∩ Bₙ = ∅.',
      starterCode:
`# P({k}) = 2^{-k} for k=1,2,3,...
# P(Bₙ) = sum_{k=n}^{inf} 2^{-k} = 2^{-(n-1)}

import math

print("Continuity from ABOVE: decreasing sequence B₁ ⊇ B₂ ⊇ ...")
print(f"{'n':>5}  {'P(Bₙ) exact':>15}  {'2^(-(n-1))':>15}")
print("-" * 40)

for n in [1, 2, 3, 5, 10, 20, 50]:
    # Geometric series: sum_{k=n}^{inf} 2^{-k} = 2^{-n} / (1 - 1/2) = 2^{-(n-1)}
    p_Bn = 2**(-(n-1))
    print(f"{n:>5}  {p_Bn:>15.10f}  {p_Bn:>15.10f}")

print("\\nAs n→∞, P(Bₙ)→0")
print("Intersection of all Bₙ is ∅ (no outcome belongs to ALL sets)")
print("P(∩ Bₙ) = P(∅) = 0 ✓  — confirms continuity theorem")

# Numerical check: P(B_50)
p_B50 = 2**(-(50-1))
print(f"\\nP(B₅₀) = {p_B50:.2e}  ≈ 0")
`,
      solution:
`print("Continuity from ABOVE: B₁⊇B₂⊇...")
print(f"{'n':>5}  {'P(Bₙ)':>16}")
print("-"*24)
for n in [1,2,3,5,10,20,50]:
    p = 2**(-(n-1))
    print(f"{n:>5}  {p:>16.10f}")
print("\\nP(∩Bₙ) = lim P(Bₙ) = 0 = P(∅) ✓")
`,
      expectedHint: 'P(B₁)=1.0, P(B₂)=0.5, P(B₅)=0.0625, P(B₂₀)≈1.9×10⁻⁶, P(B₅₀)≈0.',
    },
  ],

  'discrete-distributions': [
    {
      id: 'py-dd-1',
      number: 'Py 2.1',
      title: 'Binomial Probabilities Table',
      description: 'Compute P(X=k) for X ~ Binomial(10, 0.3) for k=0..10 using the formula. Find the mode.',
      starterCode: `import math

n, theta = 10, 0.3

print(f"{'k':>4}  {'P(X=k)':>10}  {'Cumulative':>12}")
print("-" * 32)

cum = 0.0
for k in range(n + 1):
    # TODO: compute the Binomial PMF
    p = math.comb(n, k) * (theta ** k) * ((1 - theta) ** (n - k))
    cum += p
    print(f"{k:>4}  {p:>10.6f}  {cum:>12.6f}")
`,
      solution: `import math

n, theta = 10, 0.3
print(f"{'k':>4}  {'P(X=k)':>10}  {'Cumul':>10}")
print("-"*28)
cum = 0.0
for k in range(n+1):
    p = math.comb(n,k)*(theta**k)*((1-theta)**(n-k))
    cum += p
    print(f"{k:>4}  {p:>10.6f}  {cum:>10.6f}")
`,
      expectedHint: 'P(X=3) ≈ 0.2668 is the mode. All probabilities sum to 1.',
    },
    {
      id: 'py-dd-2',
      number: 'Py 2.2',
      title: 'Poisson Approximation to Binomial',
      description: 'For n=100, θ=0.05 (λ=5), compare Binomial(100,0.05) to Poisson(5) probabilities for k=0..15.',
      starterCode: `import math

n, theta, lam = 100, 0.05, 5.0

print(f"{'k':>4}  {'Binomial':>12}  {'Poisson':>12}  {'|diff|':>10}")
print("-" * 44)

for k in range(16):
    binom   = math.comb(n, k) * (theta**k) * ((1-theta)**(n-k))
    # TODO: compute Poisson PMF
    poisson = (lam**k) * math.exp(-lam) / math.factorial(k)
    print(f"{k:>4}  {binom:>12.6f}  {poisson:>12.6f}  {abs(binom-poisson):>10.2e}")
`,
      solution: `import math

n, theta, lam = 100, 0.05, 5.0
print(f"{'k':>4}  {'Binomial':>12}  {'Poisson':>12}  {'|diff|':>10}")
print("-"*44)
for k in range(16):
    b = math.comb(n,k)*(theta**k)*((1-theta)**(n-k))
    p = lam**k * math.exp(-lam)/math.factorial(k)
    print(f"{k:>4}  {b:>12.6f}  {p:>12.6f}  {abs(b-p):>10.2e}")
`,
      expectedHint: 'Differences are small (< 0.003). Poisson(5) approximates Binomial(100, 0.05) well.',
    },
  ],

  'continuous-distributions': [
    {
      id: 'py-cd-1',
      number: 'Py 2.3',
      title: 'Exponential CDF and Tail Probabilities',
      description: 'For X ~ Exponential(λ=2), compute P(a < X < b) analytically and verify P(X > 2) = e^{-4}.',
      starterCode: `import math

lam = 2.0

# P(a < X < b) = e^{-lam*a} - e^{-lam*b}
a, b = 0.5, 1.5
p = math.exp(-lam * a) - math.exp(-lam * b)
print(f"P(0.5 < X < 1.5) = {p:.6f}")

# Tail probability table
print("\\nTail probabilities P(X > t):")
print(f"{'t':>6}  {'P(X>t)':>12}")
print("-" * 22)
for t in [0.5, 1.0, 1.5, 2.0, 3.0]:
    # TODO: compute P(X > t) = e^{-lam*t}
    tail = math.exp(-lam * t)
    print(f"{t:>6.1f}  {tail:>12.6f}")
`,
      solution: `import math

lam = 2.0
a, b = 0.5, 1.5
p = math.exp(-lam*a) - math.exp(-lam*b)
print(f"P(0.5 < X < 1.5) = {p:.6f}")
print("\\nP(X > t):")
for t in [0.5,1.0,1.5,2.0,3.0]:
    print(f"t={t}: {math.exp(-lam*t):.6f}")
`,
      expectedHint: 'P(0.5 < X < 1.5) ≈ 0.3181. P(X>2) = e^{-4} ≈ 0.0183.',
    },
    {
      id: 'py-cd-2',
      number: 'Py 2.4',
      title: 'Standard Normal CDF via Error Function',
      description: 'Compute Φ(z) = P(Z ≤ z) for Z ~ N(0,1) using math.erf. Verify the 68-95-99.7 rule.',
      starterCode: `import math

def phi(z):
    """Standard normal CDF."""
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))

print(f"{'z':>6}  {'Phi(z)':>10}")
print("-" * 20)
for z in [-3, -2, -1, 0, 1, 2, 3]:
    print(f"{z:>6}  {phi(z):>10.6f}")

print("\\n68-95-99.7 rule:")
for sigma in [1, 2, 3]:
    p = phi(sigma) - phi(-sigma)
    print(f"  P(-{sigma} < Z < {sigma}) = {p:.6f}  ({p*100:.2f}%)")
`,
      solution: `import math

def phi(z):
    return 0.5*(1+math.erf(z/math.sqrt(2)))

for z in [-3,-2,-1,0,1,2,3]:
    print(f"Phi({z}) = {phi(z):.6f}")

print()
for s in [1,2,3]:
    p = phi(s)-phi(-s)
    print(f"P(-{s}<Z<{s}) = {p:.6f} ({p*100:.2f}%)")
`,
      expectedHint: 'Φ(0)=0.5. P(-1<Z<1)≈68.27%, P(-2<Z<2)≈95.45%, P(-3<Z<3)≈99.73%.',
    },
  ],

  'cumulative-distribution': [
    {
      id: 'py-cdf-1',
      number: 'Py 2.5',
      title: 'CDF by Numerical Integration',
      description: 'For f_X(x) = 2x (0 ≤ x ≤ 1), compute the CDF F(x) = x² numerically via rectangle rule and compare to the exact formula.',
      starterCode: `def f_X(x):
    return 2*x if 0 <= x <= 1 else 0.0

def F_numerical(x, n=10000):
    if x <= 0: return 0.0
    if x >= 1: return 1.0
    dx = x / n
    return sum(f_X(i*dx + dx/2) * dx for i in range(n))

def F_exact(x):
    if x < 0: return 0.0
    if x > 1: return 1.0
    return x**2

print(f"{'x':>6}  {'F_exact':>10}  {'F_num':>10}  {'error':>8}")
print("-" * 40)
for x in [0.0, 0.25, 0.5, 0.75, 1.0]:
    fe = F_exact(x)
    fn = F_numerical(x)
    print(f"{x:>6.2f}  {fe:>10.6f}  {fn:>10.6f}  {abs(fe-fn):>8.2e}")
`,
      solution: `def f(x): return 2*x if 0<=x<=1 else 0.0

def F_num(x, n=10000):
    if x<=0: return 0.0
    if x>=1: return 1.0
    dx=x/n
    return sum(f(i*dx+dx/2)*dx for i in range(n))

print(f"{'x':>5}  {'Exact':>8}  {'Num':>8}")
for x in [0,0.25,0.5,0.75,1.0]:
    print(f"{x:>5.2f}  {x**2:>8.6f}  {F_num(x):>8.6f}")
`,
      expectedHint: 'F(0.5)=0.25, F(0.75)=0.5625, F(1)=1.0. Numerical error < 1e-5.',
    },
  ],

  'change-of-variable': [
    {
      id: 'py-cov-1',
      number: 'Py 2.6',
      title: 'Inverse CDF: Uniform to Exponential',
      description: 'Simulate X ~ Exponential(λ=2) using Y = -ln(U)/λ where U ~ Uniform[0,1]. Verify the mean ≈ 1/λ = 0.5.',
      starterCode: `import random, math, statistics
random.seed(42)

lam = 2.0
N = 100_000

# Inverse CDF: if U ~ Uniform[0,1], then Y = -ln(U)/lam ~ Exponential(lam)
samples = []
for _ in range(N):
    U = random.random()
    # TODO: apply the transformation
    Y = -math.log(U) / lam
    samples.append(Y)

mean_sim = statistics.mean(samples)
print(f"Simulated mean  = {mean_sim:.4f}")
print(f"Theoretical 1/λ = {1/lam:.4f}")
p_gt_1 = sum(1 for y in samples if y > 1) / N
print(f"P(X>1) sim  = {p_gt_1:.4f}")
print(f"P(X>1) theory = {math.exp(-lam):.4f}")
`,
      solution: `import random, math, statistics
random.seed(42)

lam=2.0; N=100_000
samples = [-math.log(random.random())/lam for _ in range(N)]
print(f"mean={statistics.mean(samples):.4f}  (theory {1/lam:.4f})")
p = sum(1 for y in samples if y>1)/N
print(f"P(X>1) sim={p:.4f}  theory={math.exp(-lam):.4f}")
`,
      expectedHint: 'Mean ≈ 0.50. P(X>1) ≈ 0.1353 = e^{-2}.',
    },
  ],

  'joint-distributions': [
    {
      id: 'py-jd-1',
      number: 'Py 2.7',
      title: 'Joint PMF Table and Marginals',
      description: 'For p_{X,Y}(x,y)=(x+y)/21 with x∈{1,2,3}, y∈{1,2}: print the joint table, compute marginals, and check if X and Y are independent.',
      starterCode: `xs = [1, 2, 3]
ys = [1, 2]
total = sum(x+y for x in xs for y in ys)

def p(x, y):
    return (x + y) / total

# Joint table
print(f"{'':>5}", end="")
for y in ys:
    print(f"  y={y}", end="")
print(f"  {'p_X':>6}")
print("-" * 28)

p_X = {}
for x in xs:
    row = sum(p(x, y) for y in ys)
    p_X[x] = row
    print(f"x={x}  ", end="")
    for y in ys:
        print(f"  {p(x,y):.4f}", end="")
    print(f"  {row:.4f}")

p_Y = {y: sum(p(x, y) for x in xs) for y in ys}
print("\\nMarginal p_Y:", {y: round(v, 4) for y, v in p_Y.items()})

# Independence check
print("\\nIndependence check:")
indep = all(abs(p(x,y) - p_X[x]*p_Y[y]) < 1e-9 for x in xs for y in ys)
print(f"X and Y independent? {indep}")
`,
      solution: `xs=[1,2,3]; ys=[1,2]
tot=sum(x+y for x in xs for y in ys)
def p(x,y): return (x+y)/tot
pX={x:sum(p(x,y) for y in ys) for x in xs}
pY={y:sum(p(x,y) for x in xs) for y in ys}
for x in xs:
    print(f"x={x}:", [round(p(x,y),4) for y in ys], "sum=",round(pX[x],4))
print("pY=",{y:round(v,4) for y,v in pY.items()})
indep=all(abs(p(x,y)-pX[x]*pY[y])<1e-9 for x in xs for y in ys)
print(f"Independent: {indep}")
`,
      expectedHint: 'p_X(1)≈0.1905, p_X(3)≈0.4762. X and Y are NOT independent.',
    },
  ],

  'conditioning-independence': [
    {
      id: 'py-ci-1',
      number: 'Py 2.8',
      title: 'Box-Muller Normal Simulation',
      description: 'Generate N(0,1) samples using the Box-Muller transform from two Uniform[0,1] variables. Verify mean≈0, variance≈1.',
      starterCode: `import random, math, statistics
random.seed(7)

N = 100_000
samples = []

for _ in range(N // 2):
    U1 = random.random()
    U2 = random.random()
    # Box-Muller: X,Y ~ N(0,1) independently
    r = math.sqrt(-2 * math.log(U1))
    X = r * math.cos(2 * math.pi * U2)
    Y = r * math.sin(2 * math.pi * U2)
    samples.extend([X, Y])

mean_s = statistics.mean(samples)
var_s  = statistics.variance(samples)
p_1s   = sum(1 for x in samples if -1 < x < 1) / len(samples)

print(f"Mean     = {mean_s:.4f}  (theory: 0)")
print(f"Variance = {var_s:.4f}  (theory: 1)")
print(f"P(-1<X<1)= {p_1s:.4f}  (theory: 0.6827)")
`,
      solution: `import random, math, statistics
random.seed(7)
N=100_000; samples=[]
for _ in range(N//2):
    u1,u2=random.random(),random.random()
    r=math.sqrt(-2*math.log(u1))
    samples+=[r*math.cos(2*math.pi*u2), r*math.sin(2*math.pi*u2)]
print(f"Mean={statistics.mean(samples):.4f}  Var={statistics.variance(samples):.4f}")
print(f"P(-1<X<1)={sum(1 for x in samples if -1<x<1)/len(samples):.4f}")
`,
      expectedHint: 'Mean ≈ 0.000, Variance ≈ 1.000, P(-1<X<1) ≈ 0.683.',
    },
  ],

  'simulating-distributions': [
    {
      id: 'py-sim-1',
      number: 'Py 2.9',
      title: 'Inverse CDF: General Method',
      description: 'Simulate from F(x) = x² (0≤x≤1) using F⁻¹(t) = √t. Verify mean ≈ 2/3 and compute empirical P(X < 0.5).',
      starterCode: `import random, math, statistics
random.seed(1)

N = 100_000
# F^{-1}(t) = sqrt(t)
samples = [math.sqrt(random.random()) for _ in range(N)]

mean_sim = statistics.mean(samples)
print(f"Simulated mean   = {mean_sim:.4f}")
print(f"Theoretical mean = {2/3:.4f}")

p_lt_half = sum(1 for x in samples if x < 0.5) / N
# P(X < 0.5) = F(0.5) = 0.25
print(f"\\nP(X < 0.5) sim    = {p_lt_half:.4f}")
print(f"P(X < 0.5) theory = {0.25:.4f}")
`,
      solution: `import random, math, statistics
random.seed(1)
N=100_000
s=[math.sqrt(random.random()) for _ in range(N)]
print(f"Mean={statistics.mean(s):.4f}  (theory={2/3:.4f})")
print(f"P(X<0.5)={sum(1 for x in s if x<0.5)/N:.4f}  (theory=0.25)")
`,
      expectedHint: 'Mean ≈ 0.6667. P(X < 0.5) ≈ 0.25 = F(0.5).',
    },
    {
      id: 'py-sim-2',
      number: 'Py 2.10',
      title: 'Simulate any Discrete Distribution',
      description: 'Use the inverse CDF method (Theorem 2.10.1) to simulate a discrete distribution with P(X=-7)=1/2, P(X=-2)=1/3, P(X=5)=1/6.',
      starterCode: `import random
random.seed(2)

# Distribution
values = [-7, -2, 5]
probs  = [1/2, 1/3, 1/6]

# Build CDF
cdf = []
total = 0.0
for p in probs:
    total += p
    cdf.append(total)

def sample_once():
    u = random.random()
    for val, c in zip(values, cdf):
        if u <= c:
            return val
    return values[-1]

N = 100_000
samples = [sample_once() for _ in range(N)]

# Count frequencies
from collections import Counter
counts = Counter(samples)
print(f"{'Value':>8}  {'Theory':>10}  {'Simulated':>12}")
print("-" * 34)
for v, p in zip(values, probs):
    sim = counts[v] / N
    print(f"{v:>8}  {p:>10.4f}  {sim:>12.4f}")
`,
      solution: `import random
from collections import Counter
random.seed(2)

vals=[-7,-2,5]; probs=[1/2,1/3,1/6]
cdf=[]; t=0
for p in probs: t+=p; cdf.append(t)

def draw():
    u=random.random()
    for v,c in zip(vals,cdf):
        if u<=c: return v
    return vals[-1]

N=100_000
counts=Counter(draw() for _ in range(N))
for v,p in zip(vals,probs):
    print(f"{v}: theory={p:.4f}  sim={counts[v]/N:.4f}")
`,
      expectedHint: 'Each simulated proportion should be within ±0.005 of the theoretical probability.',
    },
  ],

  // ── Chapter 4 ─────────────────────────────────────────────────────────────

  'sampling-distributions': [
    {
      id: 'py-samp-1',
      number: 'Py 4.1.1',
      title: 'Sampling Distribution by Simulation',
      description:
        'Simulate the sampling distribution of X̄ₙ for i.i.d. Exponential(1) samples. ' +
        'Task: (a) For n = 1, 5, 20, draw N_SIM = 4000 sample means and store them in a dict keyed by n. ' +
        '(b) Print the simulated mean and standard deviation of X̄ₙ for each n. ' +
        '(c) Compare with theory: E[X̄ₙ] = 1, Std(X̄ₙ) = 1/√n.',
      starterCode:
`import numpy as np

np.random.seed(42)
N_SIM = 4000

# (a) Simulate sample means for n = 1, 5, 20
ns = [1, 5, 20]
means_dict = {}
for n in ns:
    samples = np.random.exponential(1.0, size=(N_SIM, n))
    # TODO: compute sample mean across each row and store in means_dict[n]
    means_dict[n] = samples.mean(axis=1)

# (b) Print simulated mean and std
for n in ns:
    sim_mean = means_dict[n].mean()
    sim_std  = means_dict[n].std()
    # TODO: print results
    print(f"n={n}: sim mean={sim_mean:.4f} (theory=1.0000), sim std={sim_std:.4f} (theory={1/np.sqrt(n):.4f})")
`,
      solution:
`import numpy as np

np.random.seed(42)
N_SIM = 4000
ns = [1, 5, 20]
means_dict = {}

for n in ns:
    samples = np.random.exponential(1.0, size=(N_SIM, n))
    means_dict[n] = samples.mean(axis=1)

for n in ns:
    sim_mean = means_dict[n].mean()
    sim_std  = means_dict[n].std()
    print(f"n={n}: sim mean={sim_mean:.4f} (theory=1.0000), sim std={sim_std:.4f} (theory={1/np.sqrt(n):.4f})")
`,
      expectedHint: 'For n=20 the simulated std should be close to 1/√20 ≈ 0.2236.',
    },
    {
      id: 'py-samp-2',
      number: 'Py 4.1.2',
      title: 'Variance of the Sample Mean',
      description:
        'Verify Var(X̄ₙ) = σ²/n empirically for Bernoulli(0.4) samples. ' +
        'Task: (a) For n = 1, 4, 16, 64 simulate N_SIM = 10000 sample means. ' +
        '(b) Compute the empirical variance of X̄ₙ for each n. ' +
        '(c) Confirm the ratio Var(X̄ₙ) × n is approximately constant (≈ σ² = 0.4×0.6 = 0.24).',
      starterCode:
`import numpy as np

np.random.seed(0)
N_SIM = 10_000
p = 0.4
sigma2 = p * (1 - p)  # = 0.24
ns = [1, 4, 16, 64]

print(f"True σ² = {sigma2:.4f}")
print(f"{'n':>6}  {'Var(X̄ₙ)':>12}  {'Var×n':>10}  {'Theory σ²/n':>14}")
for n in ns:
    # TODO: simulate n×N_SIM Bernoulli(p) values and compute sample means
    samps = (np.random.uniform(0, 1, (N_SIM, n)) < p).astype(float)
    xbar  = samps.mean(axis=1)
    var_xbar = xbar.var()
    print(f"{n:>6}  {var_xbar:>12.6f}  {var_xbar*n:>10.6f}  {sigma2/n:>14.6f}")
`,
      solution:
`import numpy as np

np.random.seed(0)
N_SIM = 10_000
p = 0.4
sigma2 = p * (1 - p)
ns = [1, 4, 16, 64]

print(f"True σ² = {sigma2:.4f}")
print(f"{'n':>6}  {'Var(X̄ₙ)':>12}  {'Var×n':>10}  {'Theory σ²/n':>14}")
for n in ns:
    samps = (np.random.uniform(0, 1, (N_SIM, n)) < p).astype(float)
    xbar  = samps.mean(axis=1)
    var_xbar = xbar.var()
    print(f"{n:>6}  {var_xbar:>12.6f}  {var_xbar*n:>10.6f}  {sigma2/n:>14.6f}")
`,
      expectedHint: 'The Var×n column should be approximately 0.24 for all n.',
    },
  ],

  'convergence-probability': [
    {
      id: 'py-convp-1',
      number: 'Py 4.2.1',
      title: 'Chebyshev Bound vs Simulation',
      description:
        'Compare the Chebyshev bound with simulated probabilities for the WLLN. ' +
        'Task: for Exp(1) samples, compute P(|X̄ₙ − 1| ≥ 0.2) both by simulation and by the Chebyshev bound, for n = 10, 25, 50, 100, 250.',
      starterCode:
`import numpy as np

np.random.seed(11)
N_SIM = 20_000
EPS = 0.2
sigma2 = 1.0  # Exp(1) variance
ns = [10, 25, 50, 100, 250]

print(f"ε = {EPS}")
print(f"{'n':>6}  {'Simulated P':>14}  {'Chebyshev bound':>18}")
for n in ns:
    # TODO: simulate N_SIM sample means and compute fraction outside ε band
    samples = np.random.exponential(1.0, size=(N_SIM, n))
    xbar = samples.mean(axis=1)
    sim_prob = (np.abs(xbar - 1.0) >= EPS).mean()
    # TODO: compute Chebyshev bound = σ²/(n·ε²)
    cheby = sigma2 / (n * EPS**2)
    print(f"{n:>6}  {sim_prob:>14.6f}  {cheby:>18.6f}")
`,
      solution:
`import numpy as np

np.random.seed(11)
N_SIM = 20_000
EPS = 0.2
sigma2 = 1.0
ns = [10, 25, 50, 100, 250]

print(f"ε = {EPS}")
print(f"{'n':>6}  {'Simulated P':>14}  {'Chebyshev bound':>18}")
for n in ns:
    samples = np.random.exponential(1.0, size=(N_SIM, n))
    xbar = samples.mean(axis=1)
    sim_prob = (np.abs(xbar - 1.0) >= EPS).mean()
    cheby = sigma2 / (n * EPS**2)
    print(f"{n:>6}  {sim_prob:>14.6f}  {cheby:>18.6f}")
`,
      expectedHint: 'At n=100 the simulated probability should be well below the Chebyshev bound of 0.25.',
    },
    {
      id: 'py-convp-2',
      number: 'Py 4.2.2',
      title: 'WLLN Running Average',
      description:
        'Visualise the running sample mean for 5 independent Exponential(1) sequences up to n = 500. ' +
        'Task: (a) Compute and plot the running mean for each sequence. ' +
        '(b) Add a horizontal dashed line at μ = 1. ' +
        '(c) Print the mean and std of the final sample mean (at n = 500) across the 5 paths.',
      starterCode:
`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(99)
N = 500
N_PATHS = 5
ns = np.arange(1, N + 1)

fig, ax = plt.subplots(figsize=(8, 4))
fig.patch.set_facecolor('#0f172a')
ax.set_facecolor('#1e293b')

final_means = []
for i in range(N_PATHS):
    # TODO: generate N Exp(1) samples and compute running mean
    x = np.random.exponential(1.0, N)
    running = np.cumsum(x) / ns
    final_means.append(running[-1])
    ax.plot(ns, running, alpha=0.8, linewidth=1.5)

# TODO: add reference line at μ = 1
ax.axhline(1.0, color='white', linestyle='--', linewidth=2, label='μ = 1')
ax.set_xlabel('n', color='#94a3b8'); ax.set_ylabel('X̄ₙ', color='#94a3b8')
ax.set_title('WLLN — Running mean of Exp(1)', color='white')
ax.tick_params(colors='#94a3b8')
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')
plt.tight_layout(); plt.show()

print(f"Final means at n=500: {[f'{m:.4f}' for m in final_means]}")
`,
      solution:
`import numpy as np
import matplotlib.pyplot as plt

np.random.seed(99)
N = 500
N_PATHS = 5
ns = np.arange(1, N + 1)

fig, ax = plt.subplots(figsize=(8, 4))
fig.patch.set_facecolor('#0f172a')
ax.set_facecolor('#1e293b')

final_means = []
for i in range(N_PATHS):
    x = np.random.exponential(1.0, N)
    running = np.cumsum(x) / ns
    final_means.append(running[-1])
    ax.plot(ns, running, alpha=0.8, linewidth=1.5)

ax.axhline(1.0, color='white', linestyle='--', linewidth=2, label='μ = 1')
ax.set_xlabel('n', color='#94a3b8'); ax.set_ylabel('X̄ₙ', color='#94a3b8')
ax.set_title('WLLN — Running mean of Exp(1)', color='white')
ax.tick_params(colors='#94a3b8')
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')
plt.tight_layout(); plt.show()
print(f"Final means at n=500: {[f'{m:.4f}' for m in final_means]}")
`,
      expectedHint: 'All 5 final means should be close to 1.0 (within ±0.1).',
    },
  ],

  'convergence-probability-1': [
    {
      id: 'py-as-1',
      number: 'Py 4.3.1',
      title: 'SLLN — Fraction Inside ε-Band',
      description:
        'Verify the SLLN by checking that, for large n, all running averages of N(0,1) are permanently inside a ε-band. ' +
        'Task: simulate 100 paths of length N=1000 and, for each path, find the smallest n* such that |X̄ₖ| < ε for all k ≥ n*. Print the median n* and the fraction of paths that are permanently inside by n=500.',
      starterCode:
`import numpy as np

np.random.seed(7)
N = 1000
N_PATHS = 100
EPS = 0.2
ns = np.arange(1, N + 1)

capture_times = []
for i in range(N_PATHS):
    z = np.random.standard_normal(N)
    running = np.cumsum(z) / ns  # X̄ₙ

    # TODO: find the first index n* such that all values from n* onward are inside ε band
    n_star = N  # default: never captured
    for start in range(N - 1, -1, -1):
        if abs(running[start]) < EPS:
            n_star = start + 1
        else:
            break
    capture_times.append(n_star)

capture_times = np.array(capture_times)
print(f"Median capture time n*: {np.median(capture_times):.0f}")
print(f"Fraction permanently inside by n=500: {(capture_times <= 500).mean():.2%}")
`,
      solution:
`import numpy as np

np.random.seed(7)
N = 1000
N_PATHS = 100
EPS = 0.2
ns = np.arange(1, N + 1)

capture_times = []
for i in range(N_PATHS):
    z = np.random.standard_normal(N)
    running = np.cumsum(z) / ns

    n_star = N
    for start in range(N - 1, -1, -1):
        if abs(running[start]) < EPS:
            n_star = start + 1
        else:
            break
    capture_times.append(n_star)

capture_times = np.array(capture_times)
print(f"Median capture time n*: {np.median(capture_times):.0f}")
print(f"Fraction permanently inside by n=500: {(capture_times <= 500).mean():.2%}")
`,
      expectedHint: 'Most paths should be permanently inside the ε-band well before n=500.',
    },
    {
      id: 'py-as-2',
      number: 'Py 4.3.2',
      title: 'A.S. vs In-Probability — Empirical Comparison',
      description:
        'For sequences Xₙ = Zₙ/√n (in-prob only) and Yₙ = Zₙ/n (a.s.), compute and print the fraction of 500 paths that are within ε = 0.3 at each of n = 10, 50, 100, 200, 500.',
      starterCode:
`import numpy as np

np.random.seed(13)
N_PATHS = 500
N_MAX   = 500
EPS     = 0.3
check_ns = [10, 50, 100, 200, 500]

# Generate all paths
Z = np.random.standard_normal((N_PATHS, N_MAX))
ns = np.arange(1, N_MAX + 1)
# Xₙ = Zₙ/√n  (in-probability convergence)
Xn = Z / np.sqrt(ns)
# Yₙ = Zₙ/n   (a.s. convergence — faster shrinkage)
Yn = Z / ns

print(f"{'n':>6}  {'|Xₙ|<ε (in-prob)':>20}  {'|Yₙ|<ε (a.s.)':>18}")
for n in check_ns:
    frac_x = (np.abs(Xn[:, n-1]) < EPS).mean()
    frac_y = (np.abs(Yn[:, n-1]) < EPS).mean()
    print(f"{n:>6}  {frac_x:>20.4f}  {frac_y:>18.4f}")
`,
      solution:
`import numpy as np

np.random.seed(13)
N_PATHS = 500
N_MAX   = 500
EPS     = 0.3
check_ns = [10, 50, 100, 200, 500]

Z  = np.random.standard_normal((N_PATHS, N_MAX))
ns = np.arange(1, N_MAX + 1)
Xn = Z / np.sqrt(ns)
Yn = Z / ns

print(f"{'n':>6}  {'|Xₙ|<ε (in-prob)':>20}  {'|Yₙ|<ε (a.s.)':>18}")
for n in check_ns:
    frac_x = (np.abs(Xn[:, n-1]) < EPS).mean()
    frac_y = (np.abs(Yn[:, n-1]) < EPS).mean()
    print(f"{n:>6}  {frac_x:>20.4f}  {frac_y:>18.4f}")
`,
      expectedHint: 'At n=500, both should be >99% inside the band, but Yₙ converges faster.',
    },
  ],

  'convergence-distribution': [
    {
      id: 'py-clt-1',
      number: 'Py 4.4.1',
      title: 'CLT — Standardised Sample Mean',
      description:
        'Verify the CLT for Exponential(1) samples. ' +
        'Task: for n = 1, 10, 50, simulate N_SIM = 5000 standardised sample means Zₙ = (X̄ₙ−1)/(1/√n) and compare with the N(0,1) CDF using a K-S test.',
      starterCode:
`import numpy as np
from scipy.stats import kstest, norm

np.random.seed(5)
N_SIM = 5000

print(f"{'n':>5}  {'KS statistic':>14}  {'p-value':>10}  {'Close to N(0,1)?':>18}")
for n in [1, 5, 10, 30, 50]:
    samples = np.random.exponential(1.0, size=(N_SIM, n))
    xbar = samples.mean(axis=1)
    # TODO: standardise xbar to get Zₙ
    Zn = (xbar - 1.0) / (1.0 / np.sqrt(n))
    # TODO: run K-S test against N(0,1)
    ks_stat, p_val = kstest(Zn, 'norm')
    close = "Yes" if p_val > 0.05 else "No"
    print(f"{n:>5}  {ks_stat:>14.6f}  {p_val:>10.4f}  {close:>18}")
`,
      solution:
`import numpy as np
from scipy.stats import kstest

np.random.seed(5)
N_SIM = 5000

print(f"{'n':>5}  {'KS statistic':>14}  {'p-value':>10}  {'Close to N(0,1)?':>18}")
for n in [1, 5, 10, 30, 50]:
    samples = np.random.exponential(1.0, size=(N_SIM, n))
    xbar = samples.mean(axis=1)
    Zn = (xbar - 1.0) / (1.0 / np.sqrt(n))
    ks_stat, p_val = kstest(Zn, 'norm')
    close = "Yes" if p_val > 0.05 else "No"
    print(f"{n:>5}  {ks_stat:>14.6f}  {p_val:>10.4f}  {close:>18}")
`,
      expectedHint: 'For n ≥ 30, the K-S test should fail to reject normality (p > 0.05).',
    },
    {
      id: 'py-clt-2',
      number: 'Py 4.4.2',
      title: 'Normal Approximation to Binomial',
      description:
        'Compare Binomial(n, p) probabilities with their Normal approximation. ' +
        'Task: for n = 20, 50, 100 and p = 0.3, compute P(X ≤ k) for k = floor(np) using both the exact Binomial CDF and the Normal approximation. Print the absolute error.',
      starterCode:
`import numpy as np
from scipy.stats import binom, norm

p = 0.3
print(f"p = {p}")
print(f"{'n':>6}  {'k':>5}  {'Exact CDF':>12}  {'Normal approx':>15}  {'|Error|':>10}")
for n in [20, 50, 100, 200]:
    k = int(n * p)      # floor(np)
    mu    = n * p
    sigma = np.sqrt(n * p * (1 - p))
    # TODO: compute exact Binomial CDF and Normal approximation CDF
    exact  = binom.cdf(k, n, p)
    approx = norm.cdf(k, mu, sigma)
    error  = abs(exact - approx)
    print(f"{n:>6}  {k:>5}  {exact:>12.6f}  {approx:>15.6f}  {error:>10.6f}")
`,
      solution:
`import numpy as np
from scipy.stats import binom, norm

p = 0.3
print(f"p = {p}")
print(f"{'n':>6}  {'k':>5}  {'Exact CDF':>12}  {'Normal approx':>15}  {'|Error|':>10}")
for n in [20, 50, 100, 200]:
    k = int(n * p)
    mu    = n * p
    sigma = np.sqrt(n * p * (1 - p))
    exact  = binom.cdf(k, n, p)
    approx = norm.cdf(k, mu, sigma)
    error  = abs(exact - approx)
    print(f"{n:>6}  {k:>5}  {exact:>12.6f}  {approx:>15.6f}  {error:>10.6f}")
`,
      expectedHint: 'The error should decrease as n increases — the approximation gets better.',
    },
  ],

  'monte-carlo-approx': [
    {
      id: 'py-mc-1',
      number: 'Py 4.5.1',
      title: 'Monte Carlo Integration',
      description:
        'Estimate ∫₀² eˣ dx using Monte Carlo. ' +
        'Task: (a) Use N = 100, 1000, 10000 uniform samples from [0,2] to estimate the integral. ' +
        '(b) Compare with the exact value e² − 1. ' +
        '(c) Compute the MC standard error for each N.',
      starterCode:
`import numpy as np

np.random.seed(17)
exact = np.e**2 - 1

print(f"True value: {exact:.6f}")
print(f"{'N':>8}  {'Estimate':>12}  {'Error':>10}  {'Std error':>12}")
for N in [100, 1_000, 10_000, 100_000]:
    # TODO: sample N uniform points on [0, 2] and estimate the integral
    u = np.random.uniform(0, 2, N)
    f = np.exp(u)
    estimate = 2.0 * f.mean()         # (b-a) * E[f(U)]
    std_err  = 2.0 * f.std() / np.sqrt(N)
    error    = abs(estimate - exact)
    print(f"{N:>8}  {estimate:>12.6f}  {error:>10.6f}  {std_err:>12.6f}")
`,
      solution:
`import numpy as np

np.random.seed(17)
exact = np.e**2 - 1

print(f"True value: {exact:.6f}")
print(f"{'N':>8}  {'Estimate':>12}  {'Error':>10}  {'Std error':>12}")
for N in [100, 1_000, 10_000, 100_000]:
    u = np.random.uniform(0, 2, N)
    f = np.exp(u)
    estimate = 2.0 * f.mean()
    std_err  = 2.0 * f.std() / np.sqrt(N)
    error    = abs(estimate - exact)
    print(f"{N:>8}  {estimate:>12.6f}  {error:>10.6f}  {std_err:>12.6f}")
`,
      expectedHint: 'At N=10000 the error should be well below 0.01.',
    },
    {
      id: 'py-mc-2',
      number: 'Py 4.5.2',
      title: 'MC Error Rate — Verify 1/√N Scaling',
      description:
        'Empirically confirm that the Monte Carlo error scales as 1/√N. ' +
        'Task: for N = 100, 400, 1600, 6400, 25600 repeat the π estimation experiment R = 50 times each and compute the mean absolute error. Then check whether doubling √N halves the error.',
      starterCode:
`import numpy as np

np.random.seed(33)
R = 50  # repetitions per N
Ns = [100, 400, 1600, 6400, 25600]

print(f"{'N':>8}  {'Mean |error|':>14}  {'Ratio to prev':>15}")
prev_err = None
for N in Ns:
    errors = []
    for r in range(R):
        # TODO: estimate π with N darts
        x, y = np.random.uniform(0, 1, N), np.random.uniform(0, 1, N)
        pi_est = 4 * (x**2 + y**2 <= 1).mean()
        errors.append(abs(pi_est - np.pi))
    mean_err = np.mean(errors)
    ratio = (prev_err / mean_err) if prev_err else float('nan')
    print(f"{N:>8}  {mean_err:>14.6f}  {ratio:>15.3f}")
    prev_err = mean_err
`,
      solution:
`import numpy as np

np.random.seed(33)
R = 50
Ns = [100, 400, 1600, 6400, 25600]

print(f"{'N':>8}  {'Mean |error|':>14}  {'Ratio to prev':>15}")
prev_err = None
for N in Ns:
    errors = []
    for r in range(R):
        x, y = np.random.uniform(0, 1, N), np.random.uniform(0, 1, N)
        pi_est = 4 * (x**2 + y**2 <= 1).mean()
        errors.append(abs(pi_est - np.pi))
    mean_err = np.mean(errors)
    ratio = (prev_err / mean_err) if prev_err else float('nan')
    print(f"{N:>8}  {mean_err:>14.6f}  {ratio:>15.3f}")
    prev_err = mean_err
`,
      expectedHint: 'Each 4× increase in N should give a ratio of approximately 2.0 (error halves).',
    },
  ],

  'normal-distribution-theory': [
    {
      id: 'py-normth-1',
      number: 'Py 4.6.1',
      title: 'Constructing Chi-Squared from Normals',
      description:
        'Simulate χ²(k) as the sum of k squared standard normals and verify the mean and variance. ' +
        'Task: for k = 1, 2, 4, 8, draw N = 50000 chi-squared samples and print simulated vs theoretical mean and variance.',
      starterCode:
`import numpy as np

np.random.seed(20)
N = 50_000

print(f"{'k':>5}  {'Sim mean':>10}  {'Theory mean':>13}  {'Sim var':>10}  {'Theory var':>12}")
for k in [1, 2, 4, 8]:
    # TODO: simulate chi-squared(k) as sum of k squared standard normals
    z = np.random.standard_normal((N, k))
    v = (z**2).sum(axis=1)
    sim_mean = v.mean()
    sim_var  = v.var()
    print(f"{k:>5}  {sim_mean:>10.4f}  {k:>13.4f}  {sim_var:>10.4f}  {2*k:>12.4f}")
`,
      solution:
`import numpy as np

np.random.seed(20)
N = 50_000

print(f"{'k':>5}  {'Sim mean':>10}  {'Theory mean':>13}  {'Sim var':>10}  {'Theory var':>12}")
for k in [1, 2, 4, 8]:
    z = np.random.standard_normal((N, k))
    v = (z**2).sum(axis=1)
    sim_mean = v.mean()
    sim_var  = v.var()
    print(f"{k:>5}  {sim_mean:>10.4f}  {k:>13.4f}  {sim_var:>10.4f}  {2*k:>12.4f}")
`,
      expectedHint: 'The simulated mean should be within 0.05 of k, and variance within 0.2 of 2k.',
    },
    {
      id: 'py-normth-2',
      number: 'Py 4.6.2',
      title: 't-Distribution Tail Probability',
      description:
        'Confirm that t(df) → N(0,1) as df → ∞ by comparing tail probabilities. ' +
        'Task: for df = 1, 3, 10, 30, 100, 1000, compute P(T > 2) using scipy and print the convergence to P(Z > 2) ≈ 0.02275.',
      starterCode:
`import numpy as np
from scipy.stats import t as t_dist, norm

z_tail = norm.sf(2)  # P(Z > 2)
print(f"P(Z > 2) = {z_tail:.6f}")
print()
print(f"{'df':>8}  {'P(T>2)':>12}  {'|diff|':>10}")
for df in [1, 3, 10, 30, 100, 1000]:
    # TODO: compute P(T > 2) for t(df) using t_dist.sf
    p_t = t_dist.sf(2, df)
    diff = abs(p_t - z_tail)
    print(f"{df:>8}  {p_t:>12.6f}  {diff:>10.6f}")
`,
      solution:
`import numpy as np
from scipy.stats import t as t_dist, norm

z_tail = norm.sf(2)
print(f"P(Z > 2) = {z_tail:.6f}")
print()
print(f"{'df':>8}  {'P(T>2)':>12}  {'|diff|':>10}")
for df in [1, 3, 10, 30, 100, 1000]:
    p_t = t_dist.sf(2, df)
    diff = abs(p_t - z_tail)
    print(f"{df:>8}  {p_t:>12.6f}  {diff:>10.6f}")
`,
      expectedHint: 'By df=1000, P(T>2) should be within 0.0001 of P(Z>2) ≈ 0.02275.',
    },
  ],

  // ── Chapter 5: Statistical Inference ──────────────────────────────────────

  'why-statistics': [
    {
      id: 'py-ch5-why-1',
      number: '1',
      title: 'Sample Mean as an Estimator',
      description: 'Generate 30 samples from Exponential(1/200) and 52 from Exponential(1/400) (scales representing days). Compute each group\'s mean and explain what additional information is needed to conclude the treatment works.',
      starterCode:
`import numpy as np

rng = np.random.default_rng(42)

# TODO: Generate n_ctrl=30 samples from Exponential with scale=180 (mean 180 days)
# and n_trt=52 samples from Exponential with scale=380 (mean 380 days)
n_ctrl = 30
n_trt  = 52
ctrl   = None  # TODO
trt    = None  # TODO

# TODO: Compute and print the sample mean for each group
mean_ctrl = None  # TODO
mean_trt  = None  # TODO
print(f"Control mean: {mean_ctrl:.1f} days")
print(f"Treatment mean: {mean_trt:.1f} days")
print(f"Difference: {mean_trt - mean_ctrl:.1f} days")

# TODO: Print a brief explanation of why this difference alone is NOT enough
# to conclude the treatment is effective
`,
      solution:
`import numpy as np

rng = np.random.default_rng(42)
n_ctrl, n_trt = 30, 52
ctrl = rng.exponential(scale=180, size=n_ctrl)
trt  = rng.exponential(scale=380, size=n_trt)
mean_ctrl = np.mean(ctrl)
mean_trt  = np.mean(trt)
print(f"Control mean: {mean_ctrl:.1f} days")
print(f"Treatment mean: {mean_trt:.1f} days")
print(f"Difference: {mean_trt - mean_ctrl:.1f} days")
print()
print("The observed difference could be due to random variation,")
print("not necessarily the treatment. Statistical inference (e.g.,")
print("a hypothesis test or confidence interval) is needed to assess")
print("whether this difference is statistically significant.")
`,
      expectedHint: 'Typical output: Control mean ~160-200, Treatment mean ~350-410. The difference ~150-250 days, but we need a p-value or CI to draw conclusions.',
    },
    {
      id: 'py-ch5-why-2',
      number: '2',
      title: 'Plausible Values of μ via Likelihood',
      description: 'Given 16 values from N(μ,1), compute the log-likelihood L(μ) for μ in [−3, 3] and find the value that maximises it. Verify it equals the sample mean.',
      starterCode:
`import numpy as np

rng  = np.random.default_rng(7)
data = rng.normal(2.5, 1.0, size=16)
print(f"Data: {np.round(data, 2)}")

# TODO: Compute x_bar
x_bar = None  # TODO

# TODO: Define a grid of mu values from -3 to 3 (use 500 points)
mu_grid = None  # TODO

# TODO: For each mu in mu_grid, compute log L(mu | data)
# log L(mu) = -0.5 * sum((data_i - mu)^2)   [dropping constant terms]
log_L = None  # TODO

# TODO: Find the mu that maximises log_L and compare to x_bar
mu_mle = None  # TODO
print(f"x_bar   = {x_bar:.4f}")
print(f"MLE mu  = {mu_mle:.4f}")
print(f"Match?  {np.isclose(x_bar, mu_mle, atol=0.01)}")
`,
      solution:
`import numpy as np

rng  = np.random.default_rng(7)
data = rng.normal(2.5, 1.0, size=16)
print(f"Data: {np.round(data, 2)}")
x_bar   = np.mean(data)
mu_grid = np.linspace(-3, 3, 500)
log_L   = np.array([-0.5 * np.sum((data - mu)**2) for mu in mu_grid])
mu_mle  = mu_grid[np.argmax(log_L)]
print(f"x_bar   = {x_bar:.4f}")
print(f"MLE mu  = {mu_mle:.4f}")
print(f"Match?  {np.isclose(x_bar, mu_mle, atol=0.01)}")
`,
      expectedHint: 'x_bar and MLE mu should agree to within the grid resolution (~0.012). Both should be near 2.5.',
    },
  ],

  'inference-probability-model': [
    {
      id: 'py-ch5-inf-1',
      number: '1',
      title: 'Credible Intervals for Exponential(λ)',
      description: 'For X ~ Exponential(λ) with various λ values, compute the smallest interval (0, c) containing 95% of the probability. Print a table of λ vs c.',
      starterCode:
`import numpy as np

lambdas = [0.5, 1.0, 1.5, 2.0, 3.0]

print(f"{'lambda':>8}  {'E(X)=1/lambda':>14}  {'95% upper c':>12}")
print("-" * 40)

for lam in lambdas:
    # TODO: Compute c such that P(X <= c) = 0.95 for Exp(lam)
    # P(X <= c) = 1 - exp(-lam * c) = 0.95
    # => exp(-lam * c) = 0.05
    # => c = -ln(0.05) / lam
    c = None  # TODO
    mean_X = None  # TODO
    print(f"{lam:>8.1f}  {mean_X:>14.4f}  {c:>12.4f}")
`,
      solution:
`import numpy as np

lambdas = [0.5, 1.0, 1.5, 2.0, 3.0]
print(f"{'lambda':>8}  {'E(X)=1/lambda':>14}  {'95% upper c':>12}")
print("-" * 40)
for lam in lambdas:
    c      = -np.log(0.05) / lam
    mean_X = 1 / lam
    print(f"{lam:>8.1f}  {mean_X:>14.4f}  {c:>12.4f}")
`,
      expectedHint: 'For lambda=1: c ≈ 2.9957. For lambda=2: c ≈ 1.4979. Note c = 2.9957/lambda always.',
    },
    {
      id: 'py-ch5-inf-2',
      number: '2',
      title: 'Tail Probability Assessment',
      description: 'For X ~ Exponential(1), compute P(X > x₀) for x₀ ∈ {1, 2, 3, 4, 5, 6}. Print which values are "implausible" (tail probability < 0.05).',
      starterCode:
`import numpy as np

x0_values = [1, 2, 3, 4, 5, 6]

print(f"{'x0':>4}  {'P(X > x0)':>12}  {'Implausible?':>14}")
print("-" * 36)

for x0 in x0_values:
    # TODO: Compute P(X > x0) = exp(-x0) for Exp(1)
    tail_p = None  # TODO
    # TODO: Determine if implausible (tail_p < 0.05)
    implausible = None  # TODO
    print(f"{x0:>4}  {tail_p:>12.6f}  {'YES' if implausible else 'no':>14}")
`,
      solution:
`import numpy as np

x0_values = [1, 2, 3, 4, 5, 6]
print(f"{'x0':>4}  {'P(X > x0)':>12}  {'Implausible?':>14}")
print("-" * 36)
for x0 in x0_values:
    tail_p     = np.exp(-x0)
    implausible = tail_p < 0.05
    print(f"{x0:>4}  {tail_p:>12.6f}  {'YES' if implausible else 'no':>14}")
`,
      expectedHint: 'x0=3: P≈0.0498 (borderline), x0=4: P≈0.0183 (implausible), x0=5: P≈0.0067 (implausible).',
    },
  ],

  'statistical-models': [
    {
      id: 'py-ch5-sm-1',
      number: '1',
      title: 'Bernoulli Model: MLE and Sample Proportion',
      description: 'Simulate n=50 coin flips from Bernoulli(0.3). Compute the MLE (sample proportion) and plot the likelihood function L(θ).',
      starterCode:
`import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

rng = np.random.default_rng(17)
THETA_TRUE = 0.3
n    = 50

# TODO: Simulate n Bernoulli(THETA_TRUE) observations
data = None  # TODO

# TODO: Compute k (number of successes) and tau_bar (sample proportion = MLE)
k      = None  # TODO
tau_bar = None  # TODO

print(f"n={n}, k={k}, MLE tau_bar = {tau_bar:.4f}  (true theta={THETA_TRUE})")

# TODO: Define theta_grid from 0.001 to 0.999 (300 points)
# Compute log_lik = k*log(theta) + (n-k)*log(1-theta) for each theta
theta_grid = None  # TODO
log_lik    = None  # TODO
lik_norm   = np.exp(log_lik - log_lik.max())

fig, ax = plt.subplots(figsize=(7, 4), facecolor='#0f172a')
ax.set_facecolor('#1e293b')
ax.plot(theta_grid, lik_norm, color='#7c6af7', lw=2)
# TODO: Add vertical lines for tau_bar and THETA_TRUE
ax.set_xlabel('theta', color='#94a3b8')
ax.set_ylabel('Relative likelihood', color='#94a3b8')
ax.set_title('Bernoulli Likelihood', color='white')
ax.tick_params(colors='#94a3b8')
plt.tight_layout()
plt.show()
`,
      solution:
`import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

rng = np.random.default_rng(17)
THETA_TRUE, n = 0.3, 50
data   = rng.binomial(1, THETA_TRUE, size=n)
k      = data.sum()
tau_bar = k / n
print(f"n={n}, k={k}, MLE tau_bar = {tau_bar:.4f}  (true theta={THETA_TRUE})")
theta_grid = np.linspace(0.001, 0.999, 300)
log_lik    = k*np.log(theta_grid) + (n-k)*np.log(1-theta_grid)
lik_norm   = np.exp(log_lik - log_lik.max())

fig, ax = plt.subplots(figsize=(7, 4), facecolor='#0f172a')
ax.set_facecolor('#1e293b')
ax.plot(theta_grid, lik_norm, color='#7c6af7', lw=2, label='L(theta|data)')
ax.axvline(tau_bar,    color='#22d3ee', lw=2, ls='--', label=f'MLE={tau_bar:.3f}')
ax.axvline(THETA_TRUE, color='#4ade80', lw=2, ls=':',  label=f'True={THETA_TRUE}')
ax.set_xlabel('theta', color='#94a3b8'); ax.set_ylabel('Relative likelihood', color='#94a3b8')
ax.set_title('Bernoulli Likelihood', color='white')
ax.tick_params(colors='#94a3b8')
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')
for sp in ax.spines.values(): sp.set_edgecolor('#334155')
plt.tight_layout(); plt.show()
`,
      expectedHint: 'tau_bar (MLE) should be close to 0.3. The likelihood peaks exactly at tau_bar.',
    },
    {
      id: 'py-ch5-sm-2',
      number: '2',
      title: 'Normal Model: Sample Mean and Variance as Estimators',
      description: 'For 1000 simulated datasets of size n=20 from N(3, 4), verify that E(x̄) ≈ μ = 3 and E(s²) ≈ σ² = 4 (unbiasedness).',
      starterCode:
`import numpy as np

rng = np.random.default_rng(88)
MU, SIGMA2 = 3.0, 4.0
SIGMA = np.sqrt(SIGMA2)
n_sim = 1000
n     = 20

# TODO: Generate n_sim datasets, each of size n from N(MU, SIGMA^2)
# For each dataset, compute x_bar and s^2
# Store them in arrays x_bars and s_squares

x_bars    = np.zeros(n_sim)
s_squares = np.zeros(n_sim)

for i in range(n_sim):
    data = None  # TODO: generate one dataset
    x_bars[i]    = None  # TODO: compute x_bar
    s_squares[i] = None  # TODO: compute s^2 (ddof=1)

# TODO: Print E[x_bar] and E[s^2] and compare to true mu and sigma^2
print(f"True mu    = {MU},     E[x_bar]   = {x_bars.mean():.4f}")
print(f"True sigma^2 = {SIGMA2},   E[s^2]     = {s_squares.mean():.4f}")
print(f"Var(x_bar) = {x_bars.var():.4f}  (theory: sigma^2/n = {SIGMA2/n:.4f})")
`,
      solution:
`import numpy as np

rng = np.random.default_rng(88)
MU, SIGMA2, n_sim, n = 3.0, 4.0, 1000, 20
SIGMA = np.sqrt(SIGMA2)
x_bars    = np.zeros(n_sim)
s_squares = np.zeros(n_sim)
for i in range(n_sim):
    data         = rng.normal(MU, SIGMA, size=n)
    x_bars[i]    = data.mean()
    s_squares[i] = data.var(ddof=1)
print(f"True mu    = {MU},     E[x_bar]   = {x_bars.mean():.4f}")
print(f"True sigma^2 = {SIGMA2},   E[s^2]     = {s_squares.mean():.4f}")
print(f"Var(x_bar) = {x_bars.var():.4f}  (theory: sigma^2/n = {SIGMA2/n:.4f})")
`,
      expectedHint: 'E[x_bar] ≈ 3.0 (unbiased), E[s²] ≈ 4.0 (unbiased), Var(x_bar) ≈ 0.2 = 4/20.',
    },
  ],

  'data-collection': [
    {
      id: 'py-ch5-dc-1',
      number: '1',
      title: 'Empirical CDF and Population CDF',
      description: 'For a small population of N=20 measurements, compute F_X exactly, then approximate it with the empirical CDF F̂_X from samples of n=3, 5, 10.',
      starterCode:
`import numpy as np

# Population of N=20 measurements (fertility scores from Example 5.4.1)
population = np.array([4,8,6,7,8,3,7,5,4,6,
                        9,5,7,5,8,3,4,7,8,3])
N = len(population)

# TODO: Compute F_X(x) for x in [0, 1, 2, ..., 10]
# F_X(x) = |{pi: X(pi) <= x}| / N
xs = np.arange(0, 11)
F_X = None  # TODO: array of F_X(x) for each x in xs

print("Population CDF F_X:")
for x, fx in zip(xs, F_X):
    print(f"  F_X({x}) = {fx:.3f}")

# TODO: For sample sizes n=3, 5, 10:
# Draw WITHOUT replacement from population, compute F_hat_X(x) for x in xs
rng = np.random.default_rng(42)
for n in [3, 5, 10]:
    sample = None  # TODO: draw n elements without replacement
    F_hat = None   # TODO: compute empirical CDF at each x in xs
    max_dev = None # TODO: max |F_hat - F_X|
    print(f"n={n}: max deviation from true CDF = {max_dev:.3f}")
`,
      solution:
`import numpy as np

population = np.array([4,8,6,7,8,3,7,5,4,6,9,5,7,5,8,3,4,7,8,3])
N = len(population)
xs  = np.arange(0, 11)
F_X = np.array([np.sum(population <= x) / N for x in xs])

print("Population CDF F_X:")
for x, fx in zip(xs, F_X):
    print(f"  F_X({x}) = {fx:.3f}")

rng = np.random.default_rng(42)
for n in [3, 5, 10]:
    sample  = rng.choice(population, size=n, replace=False)
    F_hat   = np.array([np.sum(sample <= x) / n for x in xs])
    max_dev = np.max(np.abs(F_hat - F_X))
    print(f"n={n}: max deviation from true CDF = {max_dev:.3f}")
`,
      expectedHint: 'max deviation should decrease as n increases. Population CDF has jumps at 3,4,5,6,7,8,9.',
    },
    {
      id: 'py-ch5-dc-2',
      number: '2',
      title: 'Density Histogram and Bin Width Choice',
      description: 'For n=500 samples from N(0,1), construct density histograms with bin widths 0.25, 0.5, 1.0, 2.0 and compute the L1 error ∫|h_X − f_X| dx for each.',
      starterCode:
`import numpy as np

rng  = np.random.default_rng(31)
data = rng.normal(0, 1, size=500)

from scipy import stats

bin_widths = [0.25, 0.5, 1.0, 2.0]
print(f"{'Bin width':>10}  {'L1 error':>12}")
print("-" * 28)

for bw in bin_widths:
    # TODO: Create bins from -5 to 5 with width bw
    bins = None  # TODO
    # TODO: Compute histogram counts and convert to density
    counts, _ = None, None  # TODO: np.histogram(data, bins=bins)
    # TODO: For each bin, compute the density h_X(x) = count / (n * bw)
    # Then compute |h_X - f_X| * bw and sum (approximating the integral)
    bin_centres = None  # TODO
    h_X = None         # TODO
    f_X = None         # TODO: stats.norm.pdf(bin_centres)
    L1  = None         # TODO: sum |h_X - f_X| * bw
    print(f"{bw:>10.2f}  {L1:>12.4f}")
`,
      solution:
`import numpy as np
from scipy import stats

rng  = np.random.default_rng(31)
data = rng.normal(0, 1, size=500)
bin_widths = [0.25, 0.5, 1.0, 2.0]
print(f"{'Bin width':>10}  {'L1 error':>12}")
print("-" * 28)
for bw in bin_widths:
    bins  = np.arange(-5, 5 + bw, bw)
    counts, _ = np.histogram(data, bins=bins)
    h_X   = counts / (len(data) * bw)
    bcs   = bins[:-1] + bw / 2
    f_X   = stats.norm.pdf(bcs)
    L1    = np.sum(np.abs(h_X - f_X)) * bw
    print(f"{bw:>10.2f}  {L1:>12.4f}")
`,
      expectedHint: 'Smallest bw=0.25 should give smallest L1 error. L1 error decreases as bin width decreases (more resolution).',
    },
  ],

  'basic-inferences': [
    {
      id: 'py-ch5-bi-1',
      number: '1',
      title: 'Computing Descriptive Statistics',
      description: 'For the heights dataset from Example 5.5.6, compute mean, median, sample variance, Q1, Q3, IQR, and the 90th percentile.',
      starterCode:
`import numpy as np

heights = np.array([64.9,61.4,66.3,64.3,65.1,64.4,59.8,63.6,66.5,65.0,
                    64.9,64.3,62.5,63.1,65.0,65.8,63.4,61.9,66.6,60.9,
                    61.6,64.0,61.5,64.2,66.8,66.4,65.8,71.4,67.8,66.3])
n = len(heights)

# TODO: Compute the following descriptive statistics
x_bar  = None  # sample mean
s2     = None  # sample variance (ddof=1)
s      = None  # sample std (ddof=1)
median = None  # sample median
q1     = None  # 25th percentile
q3     = None  # 75th percentile
iqr    = None  # interquartile range
p90    = None  # 90th percentile (quantile)

print(f"n     = {n}")
print(f"x_bar = {x_bar:.3f}")
print(f"s^2   = {s2:.4f}")
print(f"s     = {s:.4f}")
print(f"Median = {median:.3f}")
print(f"Q1    = {q1:.3f}")
print(f"Q3    = {q3:.3f}")
print(f"IQR   = {iqr:.3f}")
print(f"90th percentile = {p90:.3f}")
`,
      solution:
`import numpy as np

heights = np.array([64.9,61.4,66.3,64.3,65.1,64.4,59.8,63.6,66.5,65.0,
                    64.9,64.3,62.5,63.1,65.0,65.8,63.4,61.9,66.6,60.9,
                    61.6,64.0,61.5,64.2,66.8,66.4,65.8,71.4,67.8,66.3])
n = len(heights)
x_bar  = heights.mean()
s2     = heights.var(ddof=1)
s      = heights.std(ddof=1)
median = np.median(heights)
q1     = np.percentile(heights, 25)
q3     = np.percentile(heights, 75)
iqr    = q3 - q1
p90    = np.percentile(heights, 90)

print(f"n     = {n}")
print(f"x_bar = {x_bar:.3f}")
print(f"s^2   = {s2:.4f}")
print(f"s     = {s:.4f}")
print(f"Median = {median:.3f}")
print(f"Q1    = {q1:.3f}")
print(f"Q3    = {q3:.3f}")
print(f"IQR   = {iqr:.3f}")
print(f"90th percentile = {p90:.3f}")
`,
      expectedHint: 'x_bar ≈ 64.517, s ≈ 2.379, median ≈ 64.95, IQR ≈ 2.525.',
    },
    {
      id: 'py-ch5-bi-2',
      number: '2',
      title: 'Confidence Interval and t-Test',
      description: 'Using the heights data, construct a 95% confidence interval for μ and perform a t-test for H₀: μ = 65. Verify using scipy.stats.',
      starterCode:
`import numpy as np
from scipy import stats

heights = np.array([64.9,61.4,66.3,64.3,65.1,64.4,59.8,63.6,66.5,65.0,
                    64.9,64.3,62.5,63.1,65.0,65.8,63.4,61.9,66.6,60.9,
                    61.6,64.0,61.5,64.2,66.8,66.4,65.8,71.4,67.8,66.3])
n     = len(heights)
x_bar = heights.mean()
s     = heights.std(ddof=1)
MU0   = 65.0

# TODO: Compute standard error se = s / sqrt(n)
se = None  # TODO

# TODO: Compute t-statistic
t_stat = None  # TODO: (x_bar - MU0) / se

# TODO: Compute 95% CI using t-distribution critical value (df = n-1)
alpha = 0.05
t_crit = None  # TODO: stats.t.ppf(1 - alpha/2, df=n-1)
ci_lo  = None  # TODO
ci_hi  = None  # TODO

# TODO: Compute two-sided p-value
p_val = None  # TODO: 2 * stats.t.sf(|t_stat|, df=n-1)

print(f"x_bar = {x_bar:.3f}, s = {s:.3f}, n = {n}")
print(f"SE    = {se:.4f}")
print(f"t     = {t_stat:.4f}")
print(f"95% CI: [{ci_lo:.3f}, {ci_hi:.3f}]")
print(f"p-value (two-sided) = {p_val:.4f}")
print(f"Decision: {'Reject H0' if p_val < 0.05 else 'Fail to reject H0'} (alpha=0.05)")

# Verify with scipy
t_scipy, p_scipy = stats.ttest_1samp(heights, popmean=MU0)
print(f"\\nscipy verification: t={t_scipy:.4f}, p={p_scipy:.4f}")
`,
      solution:
`import numpy as np
from scipy import stats

heights = np.array([64.9,61.4,66.3,64.3,65.1,64.4,59.8,63.6,66.5,65.0,
                    64.9,64.3,62.5,63.1,65.0,65.8,63.4,61.9,66.6,60.9,
                    61.6,64.0,61.5,64.2,66.8,66.4,65.8,71.4,67.8,66.3])
n, MU0 = len(heights), 65.0
x_bar  = heights.mean()
s      = heights.std(ddof=1)
se     = s / np.sqrt(n)
t_stat = (x_bar - MU0) / se
alpha  = 0.05
t_crit = stats.t.ppf(1 - alpha/2, df=n-1)
ci_lo  = x_bar - t_crit * se
ci_hi  = x_bar + t_crit * se
p_val  = 2 * stats.t.sf(abs(t_stat), df=n-1)

print(f"x_bar = {x_bar:.3f}, s = {s:.3f}, n = {n}")
print(f"SE    = {se:.4f}")
print(f"t     = {t_stat:.4f}")
print(f"95% CI: [{ci_lo:.3f}, {ci_hi:.3f}]")
print(f"p-value (two-sided) = {p_val:.4f}")
print(f"Decision: {'Reject H0' if p_val < 0.05 else 'Fail to reject H0'} (alpha=0.05)")
t_scipy, p_scipy = stats.ttest_1samp(heights, popmean=MU0)
print(f"\\nscipy verification: t={t_scipy:.4f}, p={p_scipy:.4f}")
`,
      expectedHint: 't ≈ -1.112, p ≈ 0.276, CI ≈ [63.629, 65.405]. Fail to reject H0: μ=65 is plausible.',
    },
  ],

  // ── Chapter 6: Likelihood Inference ──────────────────────────────────────

  'likelihood-function': [
    {
      id: 'py-ch6-lf-1',
      number: '1',
      title: 'Plot the Likelihood and Find the 0.5-Likelihood Interval',
      description: 'For n = 15 Bernoulli trials with s = 6 successes, plot L(θ | 6) ∝ θ⁶(1−θ)⁹ over θ ∈ (0,1). Identify the MLE and find the 0.5-likelihood interval numerically.',
      starterCode:
`import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

n = 15
s = 6
theta = np.linspace(0.001, 0.999, 1000)

# TODO: Compute the likelihood L ∝ theta^s * (1-theta)^(n-s)
L = None  # TODO

# TODO: Compute relative likelihood RL = L / L.max()
RL = None  # TODO

# TODO: Find the MLE (the theta where RL is maximised)
mle = None  # TODO: theta[RL.argmax()]

# TODO: Find the 0.5-likelihood interval (theta values where RL >= 0.5)
mask = None  # TODO: RL >= 0.5
lo   = None  # TODO: theta[mask][0]
hi   = None  # TODO: theta[mask][-1]

print(f"MLE = {mle:.4f}")
print(f"0.5-likelihood interval: [{lo:.4f}, {hi:.4f}]")

# TODO: Plot RL, mark MLE and shade the 0.5-LI
`,
      solution:
`import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

n, s = 15, 6
theta = np.linspace(0.001, 0.999, 1000)
L  = theta**s * (1 - theta)**(n - s)
RL = L / L.max()
mle = theta[RL.argmax()]
mask = RL >= 0.5
lo, hi = theta[mask][0], theta[mask][-1]

print(f"MLE = {mle:.4f}  (exact: {s/n:.4f})")
print(f"0.5-likelihood interval: [{lo:.4f}, {hi:.4f}]")

fig, ax = plt.subplots(figsize=(8, 4), facecolor='#0f172a')
ax.set_facecolor('#1e293b')
ax.plot(theta, RL, color='#38bdf8', lw=2)
ax.fill_between(theta, RL, where=mask, color='#818cf8', alpha=0.4, label=f'0.5-LI: [{lo:.3f},{hi:.3f}]')
ax.axvline(mle, color='#fb923c', ls='--', lw=2, label=f'MLE={mle:.3f}')
ax.axhline(0.5, color='#64748b', ls=':', lw=1)
ax.set_xlabel('θ', color='#94a3b8'); ax.set_ylabel('RL(θ)', color='#94a3b8')
ax.set_title(f'Relative Likelihood — Binomial(n={n}, s={s})', color='white')
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')
ax.tick_params(colors='#94a3b8')
for sp in ax.spines.values(): sp.set_edgecolor('#334155')
plt.tight_layout(); plt.show()
`,
      expectedHint: 'MLE = 0.4 (= s/n = 6/15). 0.5-LI ≈ [0.198, 0.623].',
    },
    {
      id: 'py-ch6-lf-2',
      number: '2',
      title: 'Verify Sufficiency via Conditional Distribution',
      description: 'For n = 4 Bernoulli(θ=0.3) trials, enumerate all sequences with T = Σxᵢ = 2. Verify that the conditional distribution of each sequence given T = 2 is uniform (does not depend on θ).',
      starterCode:
`import numpy as np
from itertools import product as iproduct

n     = 4
T_val = 2
theta_test = [0.1, 0.3, 0.5, 0.7, 0.9]

# TODO: List all binary sequences of length n with sum = T_val
seqs = [seq for seq in iproduct([0,1], repeat=n) if sum(seq) == T_val]
print(f"Sequences with T={T_val}: {seqs}")

# TODO: For each theta, compute P(seq) and P(T = T_val)
# Then compute P(seq | T) = P(seq) / P(T)
# Verify that P(seq | T) = 1/C(n, T_val) regardless of theta

C_n_T = None  # TODO: scipy.special.comb(n, T_val, exact=True)

for th in theta_test:
    # TODO: compute P(T = T_val) using binomial PMF
    # TODO: compute P(seq | T) for each sequence and verify = 1/C_n_T
    pass
`,
      solution:
`import numpy as np
from itertools import product as iproduct
from scipy.special import comb

n, T_val = 4, 2
theta_tests = [0.1, 0.3, 0.5, 0.7, 0.9]
seqs = [seq for seq in iproduct([0,1], repeat=n) if sum(seq) == T_val]
C_n_T = int(comb(n, T_val, exact=True))
print(f"Sequences with T={T_val}: {seqs}")
print(f"C({n},{T_val}) = {C_n_T}")
print(f"Expected conditional prob = 1/{C_n_T} = {1/C_n_T:.6f}\\n")

for th in theta_tests:
    P_T = float(comb(n, T_val)) * th**T_val * (1-th)**(n-T_val)
    cond_probs = []
    for seq in seqs:
        P_seq = np.prod([th**x * (1-th)**(1-x) for x in seq])
        cond_probs.append(P_seq / P_T)
    print(f"θ={th}: P(seq|T) = {[f'{p:.6f}' for p in cond_probs]}")
    assert all(abs(p - 1/C_n_T) < 1e-9 for p in cond_probs), "NOT uniform!"
print("\\nAll conditional probabilities are 1/C(n,T) — T is sufficient!")
`,
      expectedHint: 'For every θ and every sequence with T=2, P(seq|T=2) = 1/C(4,2) = 1/6 ≈ 0.1667. This confirms T=Σxᵢ is sufficient.',
    },
  ],

  'maximum-likelihood-estimation': [
    {
      id: 'py-ch6-mle-1',
      number: '1',
      title: 'Numerical MLE via Log-Likelihood Maximisation',
      description: 'Generate 50 observations from Gamma(α=3, β=2) and find the MLE using numerical optimisation of the log-likelihood. Compare to the method of moments estimators.',
      starterCode:
`import numpy as np
from scipy import stats, optimize

rng = np.random.default_rng(7)
ALPHA_TRUE, BETA_TRUE = 3.0, 2.0
n   = 50
data = rng.gamma(ALPHA_TRUE, BETA_TRUE, n)  # shape=alpha, scale=beta

# TODO: Write the negative log-likelihood for Gamma(alpha, beta)
# Gamma pdf: f(x; alpha, beta) = x^(alpha-1)*exp(-x/beta) / (beta^alpha * Gamma(alpha))
def neg_log_lik(params):
    alpha, beta = params
    if alpha <= 0 or beta <= 0:
        return np.inf
    return -np.sum(stats.gamma.logpdf(data, a=alpha, scale=beta))

# TODO: Minimise neg_log_lik starting from method of moments estimates
xbar = data.mean()
s2   = data.var(ddof=1)
beta_mom  = None  # TODO: s2 / xbar
alpha_mom = None  # TODO: xbar / beta_mom

result = None  # TODO: optimize.minimize(neg_log_lik, x0=[alpha_mom, beta_mom], method='Nelder-Mead')

print(f"True: alpha={ALPHA_TRUE}, beta={BETA_TRUE}")
print(f"MOM:  alpha_mom={alpha_mom:.4f}, beta_mom={beta_mom:.4f}")
print(f"MLE:  ...")
`,
      solution:
`import numpy as np
from scipy import stats, optimize

rng = np.random.default_rng(7)
ALPHA_TRUE, BETA_TRUE = 3.0, 2.0
n    = 50
data = rng.gamma(ALPHA_TRUE, BETA_TRUE, n)

def neg_log_lik(params):
    alpha, beta = params
    if alpha <= 0 or beta <= 0:
        return np.inf
    return -np.sum(stats.gamma.logpdf(data, a=alpha, scale=beta))

xbar = data.mean()
s2   = data.var(ddof=1)
beta_mom  = s2 / xbar
alpha_mom = xbar / beta_mom

result = optimize.minimize(neg_log_lik, x0=[alpha_mom, beta_mom], method='Nelder-Mead',
                           options={'xatol':1e-7,'fatol':1e-7,'maxiter':10000})
alpha_mle, beta_mle = result.x

print(f"True:  alpha={ALPHA_TRUE},  beta={BETA_TRUE}")
print(f"MOM:   alpha={alpha_mom:.4f},  beta={beta_mom:.4f}")
print(f"MLE:   alpha={alpha_mle:.4f},  beta={beta_mle:.4f}")
print(f"Converged: {result.success}, fun={result.fun:.4f}")
`,
      expectedHint: 'MLE and MOM estimates should be close to the true values α=3, β=2, with MLE typically slightly more accurate.',
    },
    {
      id: 'py-ch6-mle-2',
      number: '2',
      title: 'MLE for the Uniform(0, θ) Distribution',
      description: 'Generate data from Uniform(0, θ=5). The MLE is θ̂ = max(x₁,…,xₙ). Show that this is biased and compute the bias-corrected version.',
      starterCode:
`import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

rng   = np.random.default_rng(42)
THETA = 5.0
N_SIMS = 5000
ns = [5, 10, 20, 50, 100]

# TODO: For each n, simulate N_SIMS samples and compute:
#   mle = max(sample)
#   bias-corrected estimate: theta_bc = (n+1)/n * mle
# Then compute mean bias for each

for n in ns:
    mles, bcs = [], []
    for _ in range(N_SIMS):
        s = rng.uniform(0, THETA, n)
        mle = s.max()
        bc  = (n + 1) / n * mle
        mles.append(mle); bcs.append(bc)
    # TODO: print bias and MSE for each estimator
    pass
`,
      solution:
`import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

rng   = np.random.default_rng(42)
THETA = 5.0
N_SIMS = 5000
ns = [5, 10, 20, 50, 100]

print(f"True theta = {THETA}")
print(f"{'n':>5} | {'E[MLE]':>8} | {'Bias(MLE)':>10} | {'E[BC]':>8} | {'Bias(BC)':>10}")
print('-'*55)
for n in ns:
    samples = rng.uniform(0, THETA, (N_SIMS, n))
    mles    = samples.max(axis=1)
    bcs     = (n + 1) / n * mles
    print(f"{n:>5} | {mles.mean():>8.4f} | {mles.mean()-THETA:>10.4f} | {bcs.mean():>8.4f} | {bcs.mean()-THETA:>10.4f}")

# Plot distributions for n=10
n = 10
samples = rng.uniform(0, THETA, (N_SIMS, n))
mles = samples.max(axis=1)
bcs  = (n+1)/n * mles

fig, ax = plt.subplots(figsize=(8, 4), facecolor='#0f172a')
ax.set_facecolor('#1e293b')
ax.hist(mles, bins=50, density=True, color='#38bdf8', alpha=0.6, label=f'MLE (mean={mles.mean():.3f})')
ax.hist(bcs,  bins=50, density=True, color='#34d399', alpha=0.6, label=f'BC  (mean={bcs.mean():.3f})')
ax.axvline(THETA, color='#fb923c', lw=2, ls='--', label=f'True θ={THETA}')
ax.set_xlabel('Estimate', color='#94a3b8'); ax.set_ylabel('Density', color='#94a3b8')
ax.set_title(f'MLE vs Bias-Corrected Estimator for Uniform(0,θ), n={n}', color='white')
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')
ax.tick_params(colors='#94a3b8')
for sp in ax.spines.values(): sp.set_edgecolor('#334155')
plt.tight_layout(); plt.show()
`,
      expectedHint: 'MLE is biased downward: E[max] = n/(n+1)·θ. The bias-corrected estimator (n+1)/n·max is unbiased.',
    },
  ],

  'inferences-based-on-mle': [
    {
      id: 'py-ch6-inf-1',
      number: '1',
      title: 'z-CI and t-CI Comparison',
      description: 'For a sample of size n=10 from N(μ=5, σ²=4), compute both the z-CI (σ known) and the t-CI (σ unknown). Compare their widths and verify using scipy.',
      starterCode:
`import numpy as np
from scipy import stats

rng = np.random.default_rng(0)
MU_TRUE = 5.0
SIGMA   = 2.0
n       = 10
alpha   = 0.05
data    = rng.normal(MU_TRUE, SIGMA, n)

xbar = data.mean()
s    = data.std(ddof=1)
se_known   = SIGMA / np.sqrt(n)
se_unknown = s / np.sqrt(n)

# TODO: Compute z-CI (sigma known)
z_crit = None  # TODO: stats.norm.ppf(1 - alpha/2)
z_lo   = None  # TODO
z_hi   = None  # TODO

# TODO: Compute t-CI (sigma unknown)
t_crit = None  # TODO: stats.t.ppf(1 - alpha/2, df=n-1)
t_lo   = None  # TODO
t_hi   = None  # TODO

print(f"x_bar = {xbar:.4f}, s = {s:.4f}")
print(f"z-CI (σ={SIGMA} known): [{z_lo:.4f}, {z_hi:.4f}], width={z_hi-z_lo:.4f}")
print(f"t-CI (σ unknown):       [{t_lo:.4f}, {t_hi:.4f}], width={t_hi-t_lo:.4f}")
`,
      solution:
`import numpy as np
from scipy import stats

rng = np.random.default_rng(0)
MU_TRUE, SIGMA, n, alpha = 5.0, 2.0, 10, 0.05
data = rng.normal(MU_TRUE, SIGMA, n)
xbar, s = data.mean(), data.std(ddof=1)
se_known   = SIGMA / np.sqrt(n)
se_unknown = s / np.sqrt(n)

z_crit = stats.norm.ppf(1 - alpha/2)
z_lo, z_hi = xbar - z_crit*se_known, xbar + z_crit*se_known

t_crit = stats.t.ppf(1 - alpha/2, df=n-1)
t_lo, t_hi = xbar - t_crit*se_unknown, xbar + t_crit*se_unknown

print(f"x_bar = {xbar:.4f}, s = {s:.4f}")
print(f"z-CI (σ={SIGMA}): [{z_lo:.4f}, {z_hi:.4f}], width={z_hi-z_lo:.4f}")
print(f"t-CI (σ unknown): [{t_lo:.4f}, {t_hi:.4f}], width={t_hi-t_lo:.4f}")
print(f"t-CI wider than z-CI: {t_hi-t_lo > z_hi-z_lo}")
sci_lo, sci_hi = stats.t.interval(0.95, df=n-1, loc=xbar, scale=se_unknown)
print(f"scipy verification: [{sci_lo:.4f}, {sci_hi:.4f}]")
`,
      expectedHint: 'The t-CI is wider because t_{α/2}(9) ≈ 2.262 > z_{α/2} = 1.960. With small n, the extra uncertainty in σ matters.',
    },
    {
      id: 'py-ch6-inf-2',
      number: '2',
      title: 'Two-Sample z-Test and P-value Calculation',
      description: 'Test whether two groups have the same mean using a two-sample z-test (σ₁ = σ₂ = 1 known). Generate data, compute the test statistic and P-value.',
      starterCode:
`import numpy as np
from scipy import stats

rng = np.random.default_rng(5)
MU1, MU2 = 0.0, 0.5  # true means
SIGMA = 1.0
n1, n2 = 30, 30

data1 = rng.normal(MU1, SIGMA, n1)
data2 = rng.normal(MU2, SIGMA, n2)

# TODO: Compute the two-sample z-statistic
# H0: mu1 = mu2 vs H1: mu1 != mu2
# z = (x1_bar - x2_bar) / sqrt(sigma^2/n1 + sigma^2/n2)
xbar1, xbar2 = data1.mean(), data2.mean()
se_diff = None  # TODO: np.sqrt(SIGMA**2/n1 + SIGMA**2/n2)
z_stat  = None  # TODO: (xbar1 - xbar2) / se_diff

# TODO: Compute two-sided P-value
p_val = None  # TODO: 2 * stats.norm.sf(abs(z_stat))

print(f"x1_bar={xbar1:.4f}, x2_bar={xbar2:.4f}")
print(f"z = {z_stat:.4f}, p-value = {p_val:.4f}")
print(f"Decision at alpha=0.05: {'Reject H0' if p_val < 0.05 else 'Fail to reject H0'}")
`,
      solution:
`import numpy as np
from scipy import stats

rng = np.random.default_rng(5)
MU1, MU2 = 0.0, 0.5
SIGMA = 1.0
n1, n2 = 30, 30
data1 = rng.normal(MU1, SIGMA, n1)
data2 = rng.normal(MU2, SIGMA, n2)

xbar1, xbar2 = data1.mean(), data2.mean()
se_diff = np.sqrt(SIGMA**2/n1 + SIGMA**2/n2)
z_stat  = (xbar1 - xbar2) / se_diff
p_val   = 2 * stats.norm.sf(abs(z_stat))

print(f"x1_bar={xbar1:.4f}, x2_bar={xbar2:.4f}, diff={xbar1-xbar2:.4f}")
print(f"SE(diff) = {se_diff:.4f}")
print(f"z = {z_stat:.4f}, p-value = {p_val:.4f}")
print(f"Decision at alpha=0.05: {'Reject H0' if p_val < 0.05 else 'Fail to reject H0'}")
print(f"(True difference = {MU1-MU2:.1f})")
`,
      expectedHint: 'z ≈ −1.9 to −1.3 depending on the random seed. With μ₁−μ₂=−0.5 and n=30, we may or may not reject at α=0.05 — power is moderate.',
    },
  ],

  'distribution-free-methods': [
    {
      id: 'py-ch6-df-1',
      number: '1',
      title: 'Parametric Bootstrap vs Nonparametric Bootstrap',
      description: 'Compare the parametric (assuming normality) and nonparametric bootstrap for estimating the SE of the sample mean. Use the hepatitis C data.',
      starterCode:
`import numpy as np
from scipy import stats

rng = np.random.default_rng(10)
data = np.array([-2.0, -0.2, -5.2, -3.5, -3.9, -0.6, -4.3, -1.7,
                 -9.5,  1.6, -2.9,  0.9, -1.0, -2.0,  3.0])
n = len(data)
B = 2000

# TODO: Nonparametric bootstrap — resample with replacement from data
np_boot_means = None  # TODO: array of B bootstrap means

# TODO: Parametric bootstrap — sample from N(xbar, s^2)
xbar = data.mean()
s    = data.std(ddof=1)
p_boot_means = None  # TODO: array of B bootstrap means from normal

# TODO: Compute SE for each and compare to the analytical SE = s/sqrt(n)
np_se = None  # TODO
p_se  = None  # TODO
analytic_se = s / np.sqrt(n)

print(f"x_bar = {xbar:.4f}, s = {s:.4f}")
print(f"Analytic SE = s/√n = {analytic_se:.4f}")
print(f"NP bootstrap SE  = {np_se:.4f}")
print(f"Param bootstrap SE = {p_se:.4f}")
`,
      solution:
`import numpy as np
from scipy import stats

rng = np.random.default_rng(10)
data = np.array([-2.0, -0.2, -5.2, -3.5, -3.9, -0.6, -4.3, -1.7,
                 -9.5,  1.6, -2.9,  0.9, -1.0, -2.0,  3.0])
n = len(data)
B = 2000
xbar, s = data.mean(), data.std(ddof=1)

np_boot_means = np.array([rng.choice(data, size=n, replace=True).mean() for _ in range(B)])
p_boot_means  = np.array([rng.normal(xbar, s, n).mean() for _ in range(B)])

np_se = np_boot_means.std()
p_se  = p_boot_means.std()
analytic_se = s / np.sqrt(n)

print(f"x_bar={xbar:.4f}, s={s:.4f}")
print(f"Analytic SE     = {analytic_se:.4f}")
print(f"NP bootstrap SE = {np_se:.4f}")
print(f"Param boot SE   = {p_se:.4f}")
print(f"\\nFor the mean, both should match s/√n closely.")
print(f"The parametric bootstrap assumes normality; the NP bootstrap does not.")
`,
      expectedHint: 'All three SEs should be close (~0.73). For the mean, both bootstraps agree because CLT holds regardless of distribution.',
    },
    {
      id: 'py-ch6-df-2',
      number: '2',
      title: 'Sign Test Implementation from Scratch',
      description: 'Implement the sign test for the median from scratch using the Binomial distribution. Test H₀: median = 0 vs H₁: median ≠ 0 on simulated skewed data.',
      starterCode:
`import numpy as np
from scipy import stats

rng = np.random.default_rng(3)
# Skewed data: Exponential(1) shifted by -1, so true median = log(2)-1 ≈ -0.307
data = rng.exponential(1, 30) - 1.0
true_median = np.log(2) - 1
m0 = 0.0  # null hypothesis: median = 0

print(f"n={len(data)}, sample median={np.median(data):.4f}, true median={true_median:.4f}")

# TODO: Count positives (values strictly above m0)
K = None  # TODO: np.sum(data > m0)

# TODO: Compute two-sided P-value using Binomial(n, 0.5)
n = len(data)
p_sign = None  # TODO: 2 * stats.binom.cdf(min(K, n-K), n, 0.5)

# TODO: Compare with t-test
t_stat, p_t = None, None  # TODO: stats.ttest_1samp(data, popmean=m0)

print(f"Sign test: K={K}, p-value={p_sign:.4f}")
print(f"t-test: t={t_stat:.4f}, p-value={p_t:.4f}")
`,
      solution:
`import numpy as np
from scipy import stats

rng = np.random.default_rng(3)
data = rng.exponential(1, 30) - 1.0
true_median = np.log(2) - 1
m0 = 0.0
n = len(data)
print(f"n={n}, sample median={np.median(data):.4f}, true median={true_median:.4f}")

K = int(np.sum(data > m0))
p_sign = 2 * stats.binom.cdf(min(K, n - K), n, 0.5)

t_stat, p_t = stats.ttest_1samp(data, popmean=m0)

print(f"Sign test: K={K}, p-value={p_sign:.4f}")
print(f"t-test:  t={t_stat:.4f}, p-value={p_t:.4f}")
print(f"True H0 is FALSE (true median ≈ {true_median:.3f} ≠ 0)")
print(f"Sign test {'correctly rejects' if p_sign < 0.05 else 'fails to reject'} H0 at α=0.05")
print(f"t-test   {'correctly rejects' if p_t   < 0.05 else 'fails to reject'} H0 at α=0.05")
`,
      expectedHint: 'With n=30 and true median ≈ −0.307, both tests should detect the departure from 0. The t-test may be more powerful due to using magnitudes.',
    },
  ],

  'mle-asymptotics': [
    {
      id: 'py-ch6-asy-1',
      number: '1',
      title: 'Computing Observed Fisher Information',
      description: 'For Bernoulli(θ) data, compute the observed Fisher information Î(s) = 1/(θ̂(1−θ̂)) and use it to construct a large-sample CI for θ.',
      starterCode:
`import numpy as np
from scipy import stats

rng  = np.random.default_rng(21)
THETA_TRUE = 0.35
n = 100
data = rng.binomial(1, THETA_TRUE, n)

# MLE
theta_hat = data.mean()

# TODO: Compute observed Fisher information I_hat = 1 / (theta_hat * (1 - theta_hat))
I_hat = None  # TODO

# TODO: Asymptotic variance of theta_hat = 1 / (n * I_hat)
asy_var = None  # TODO

# TODO: Large-sample 95% CI: theta_hat +/- z_{0.025} / sqrt(n * I_hat)
z_crit = stats.norm.ppf(0.975)
hw     = None  # TODO: z_crit * np.sqrt(asy_var)
ci_lo  = None  # TODO
ci_hi  = None  # TODO

print(f"n={n}, theta_hat={theta_hat:.4f}, true theta={THETA_TRUE}")
print(f"Observed Fisher info: I_hat = {I_hat:.4f}")
print(f"Asymptotic SE = {np.sqrt(asy_var):.4f}")
print(f"95% CI: [{ci_lo:.4f}, {ci_hi:.4f}]")
print(f"True theta is {'inside' if ci_lo <= THETA_TRUE <= ci_hi else 'OUTSIDE'} the CI")
`,
      solution:
`import numpy as np
from scipy import stats

rng = np.random.default_rng(21)
THETA_TRUE = 0.35
n = 100
data = rng.binomial(1, THETA_TRUE, n)
theta_hat = data.mean()

I_hat   = 1 / (theta_hat * (1 - theta_hat))
asy_var = 1 / (n * I_hat)
z_crit  = stats.norm.ppf(0.975)
hw      = z_crit * np.sqrt(asy_var)
ci_lo, ci_hi = theta_hat - hw, theta_hat + hw

print(f"n={n}, theta_hat={theta_hat:.4f}, true theta={THETA_TRUE}")
print(f"I_hat = {I_hat:.4f} (exact: {1/(THETA_TRUE*(1-THETA_TRUE)):.4f})")
print(f"Asymptotic SE = {np.sqrt(asy_var):.4f}  (exact: {np.sqrt(THETA_TRUE*(1-THETA_TRUE)/n):.4f})")
print(f"95% CI: [{ci_lo:.4f}, {ci_hi:.4f}]")
print(f"True theta is {'inside' if ci_lo <= THETA_TRUE <= ci_hi else 'OUTSIDE'} the CI")
`,
      expectedHint: 'I_hat ≈ 4.44 (varies by sample). Asymptotic SE ≈ 0.047. The 95% CI should cover the true θ=0.35 approximately 95% of the time.',
    },
    {
      id: 'py-ch6-asy-2',
      number: '2',
      title: 'Delta Method in Practice',
      description: 'The MLE of θ in Bernoulli(θ) is θ̂ = x̄. Use the delta method to compute the SE of ψ̂ = log(θ̂/(1−θ̂)) (log-odds) and construct a 95% CI for ψ.',
      starterCode:
`import numpy as np
from scipy import stats

rng = np.random.default_rng(55)
THETA_TRUE = 0.4
n = 80
data = rng.binomial(1, THETA_TRUE, n)
theta_hat = data.mean()

# True log-odds
psi_true = np.log(THETA_TRUE / (1 - THETA_TRUE))

# MLE of log-odds by equivariance
psi_hat = np.log(theta_hat / (1 - theta_hat))

# TODO: Delta method SE for psi_hat = log(theta/(1-theta))
# g(theta) = log(theta/(1-theta)), g'(theta) = 1/(theta*(1-theta))
# Var(theta_hat) = theta*(1-theta)/n
# Var(psi_hat) ≈ [g'(theta_hat)]^2 * Var(theta_hat) by delta method

g_prime = None  # TODO: 1 / (theta_hat * (1 - theta_hat))
var_theta_hat = None  # TODO: theta_hat * (1 - theta_hat) / n
var_psi_hat   = None  # TODO: g_prime**2 * var_theta_hat
se_psi        = None  # TODO: np.sqrt(var_psi_hat)

z = stats.norm.ppf(0.975)
ci_lo = psi_hat - z * se_psi
ci_hi = psi_hat + z * se_psi

print(f"theta_hat={theta_hat:.4f}, psi_hat={psi_hat:.4f}, true psi={psi_true:.4f}")
print(f"Delta-method SE(psi_hat) = {se_psi:.4f}")
print(f"95% CI for log-odds: [{ci_lo:.4f}, {ci_hi:.4f}]")
print(f"True psi in CI: {ci_lo <= psi_true <= ci_hi}")
`,
      solution:
`import numpy as np
from scipy import stats

rng = np.random.default_rng(55)
THETA_TRUE = 0.4
n = 80
data = rng.binomial(1, THETA_TRUE, n)
theta_hat = data.mean()

psi_true = np.log(THETA_TRUE / (1 - THETA_TRUE))
psi_hat  = np.log(theta_hat / (1 - theta_hat))

g_prime       = 1 / (theta_hat * (1 - theta_hat))
var_theta_hat = theta_hat * (1 - theta_hat) / n
var_psi_hat   = g_prime**2 * var_theta_hat
se_psi        = np.sqrt(var_psi_hat)

z = stats.norm.ppf(0.975)
ci_lo, ci_hi = psi_hat - z*se_psi, psi_hat + z*se_psi

print(f"theta_hat={theta_hat:.4f}, psi_hat={psi_hat:.4f}, true psi={psi_true:.4f}")
print(f"g'(theta_hat) = {g_prime:.4f}, Var(theta_hat) = {var_theta_hat:.6f}")
print(f"Delta-method SE(psi_hat) = {se_psi:.4f}")
print(f"95% CI for log-odds: [{ci_lo:.4f}, {ci_hi:.4f}]")
print(f"True psi={'inside' if ci_lo <= psi_true <= ci_hi else 'OUTSIDE'} CI")
`,
      expectedHint: 'psi_true = log(0.4/0.6) ≈ −0.405. SE(ψ̂) ≈ 0.354. The CI should cover −0.405 approximately 95% of the time.',
    },
  ],
};
