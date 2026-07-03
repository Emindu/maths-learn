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
};
