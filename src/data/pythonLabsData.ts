export interface PythonLabDemo {
  id: string;
  title: string;
  description: string;
  code: string;
}

export const pythonLabsByConceptId: Record<string, PythonLabDemo[]> = {

  'simulating-distributions': [
    {
      id: 'sim-lab-1',
      title: 'Box-Muller Transform',
      description: 'Simulate 10,000 standard Normal variables using the Box-Muller transform from pure Uniform pseudo-random numbers. We will plot a 2D histogram of (X, Y) to show the perfectly circular standard normal distribution, and plot the marginal histograms to verify the bell curves.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1. Generate 10000 independent Uniform(0,1) pairs
N = 10000
U1 = np.random.uniform(0, 1, N)
U2 = np.random.uniform(0, 1, N)

# 2. Apply Box-Muller transform
R = np.sqrt(-2 * np.log(U1))
Theta = 2 * np.pi * U2

X = R * np.cos(Theta)
Y = R * np.sin(Theta)

# 3. Setup plots
fig = plt.figure(figsize=(12, 4))
fig.patch.set_facecolor('#0f172a')

# 2D Histogram of (X,Y)
ax1 = fig.add_subplot(131)
ax1.set_facecolor('#1e293b')
ax1.hist2d(X, Y, bins=50, cmap='plasma')
ax1.set_title("2D Scatter (X, Y)", color='white')
ax1.set_xlabel("X", color='#cbd5e1')
ax1.set_ylabel("Y", color='#cbd5e1')
ax1.tick_params(colors='#94a3b8')

# Marginal X
ax2 = fig.add_subplot(132)
ax2.set_facecolor('#1e293b')
ax2.hist(X, bins=50, density=True, color='#3b82f6', alpha=0.7)
ax2.set_title("Marginal X ~ N(0,1)", color='white')
ax2.tick_params(colors='#94a3b8')

# Marginal Y
ax3 = fig.add_subplot(133)
ax3.set_facecolor('#1e293b')
ax3.hist(Y, bins=50, density=True, color='#ec4899', alpha=0.7)
ax3.set_title("Marginal Y ~ N(0,1)", color='white')
ax3.tick_params(colors='#94a3b8')

plt.tight_layout()
plt.show()`
    }
  ],

  'multidim-cov': [
    {
      id: 'multidim-lab-1',
      title: 'Convolution of Two Exponentials',
      description: 'Simulate drawing $X$ and $Y$ independently from an Exponential(1) distribution, and compute their sum $Z = X + Y$. Plot the empirical distribution of $Z$ and compare it to the theoretical convolution result, which is the Gamma(2, 1) density.',
      code: `import numpy as np
import matplotlib.pyplot as plt
import scipy.stats as stats

# 1. Simulate independent X, Y ~ Exp(1)
N = 100000
lam = 1.0
X = np.random.exponential(1/lam, N)
Y = np.random.exponential(1/lam, N)

# 2. Compute the sum (Convolution)
Z = X + Y

# 3. Setup the plot
fig, ax = plt.subplots(figsize=(9, 5))
fig.patch.set_facecolor('#0f172a')
ax.set_facecolor('#1e293b')

# 4. Plot empirical histogram of Z
ax.hist(Z, bins=100, density=True, color='#a855f7', alpha=0.6, label='Empirical Z = X + Y')

# 5. Overlay theoretical Gamma(2, lambda) density
z_vals = np.linspace(0, 10, 200)
# Gamma PDF: f(z) = lambda^2 * z * exp(-lambda * z)
f_z = lam**2 * z_vals * np.exp(-lam * z_vals)
ax.plot(z_vals, f_z, color='#f472b6', lw=3, label='Theoretical Gamma(2, 1)')

# Styling
ax.set_title("Convolution: Sum of Two Independent Exponentials", color='white', fontsize=14)
ax.set_xlabel("z", color='#cbd5e1')
ax.set_ylabel("Density", color='#cbd5e1')
ax.tick_params(colors='#94a3b8')
ax.legend(facecolor='#1e293b', labelcolor='white')
ax.set_xlim(0, 10)

plt.tight_layout()
plt.show()`
    }
  ],

  'conditioning-independence': [
    {
      id: 'cond-lab-1',
      title: 'Law of Large Numbers (i.i.d. Trials)',
      description: 'Simulate 1,000 independent and identically distributed (i.i.d.) coin flips. Plot the running average of heads to see how independence allows the empirical probability to converge exactly to the true probability (0.5).',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1. Simulate 1000 i.i.d. Bernoulli(0.5) trials
N = 1000
flips = np.random.choice([0, 1], size=N, p=[0.5, 0.5])

# 2. Compute the running average
# running_avg[i] will be the average of the first i+1 flips
running_avg = np.cumsum(flips) / np.arange(1, N + 1)

# 3. Setup the plot
fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#0f172a')
ax.set_facecolor('#1e293b')

# Plot the running average
ax.plot(np.arange(1, N + 1), running_avg, color='#3b82f6', lw=2, label='Running Average of Heads')

# Plot the theoretical probability line
ax.axhline(0.5, color='#ec4899', lw=2, linestyle='--', label='Theoretical P(Heads) = 0.5')

# Styling
ax.set_title("Law of Large Numbers for i.i.d. Coin Flips", color='white', fontsize=14)
ax.set_xlabel("Number of Flips (N)", color='#cbd5e1')
ax.set_ylabel("Empirical Probability", color='#cbd5e1')
ax.tick_params(colors='#94a3b8')
ax.legend(facecolor='#1e293b', labelcolor='white', loc='upper right')
ax.set_ylim(0, 1)

plt.tight_layout()
plt.show()`
    }
  ],

  'joint-distributions': [
    {
      id: 'joint-lab-1',
      title: 'Bivariate Normal Distribution',
      description: 'Simulate a 2D Bivariate Normal distribution with a specified correlation ρ. Plot the joint scatter plot and the marginal histograms for X and Y.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# Parameters for Bivariate Normal
mu_x, mu_y = 0, 0
sigma_x, sigma_y = 1, 1
rho = 0.7  # Correlation coefficient

# Covariance matrix
cov_matrix = [[sigma_x**2, rho * sigma_x * sigma_y],
              [rho * sigma_x * sigma_y, sigma_y**2]]

# 1. Simulate (X, Y) ~ BivariateNormal
N = 5000
X, Y = np.random.multivariate_normal([mu_x, mu_y], cov_matrix, N).T

# 2. Setup the plot with subplots (Joint + Marginals)
fig = plt.figure(figsize=(8, 8))
fig.patch.set_facecolor('#0f172a')

# Define grid for subplots
gs = fig.add_gridspec(3, 3, wspace=0.1, hspace=0.1)
ax_joint = fig.add_subplot(gs[1:, 0:2])
ax_marg_x = fig.add_subplot(gs[0, 0:2], sharex=ax_joint)
ax_marg_y = fig.add_subplot(gs[1:, 2], sharey=ax_joint)

# Styling
for ax in [ax_joint, ax_marg_x, ax_marg_y]:
    ax.set_facecolor('#1e293b')
    ax.tick_params(colors='#94a3b8')

# 3. Plot Joint Scatter
ax_joint.scatter(X, Y, alpha=0.3, s=5, color='#3b82f6')
ax_joint.set_xlabel("X", color='#cbd5e1')
ax_joint.set_ylabel("Y", color='#cbd5e1')

# 4. Plot Marginal X (Top)
ax_marg_x.hist(X, bins=50, density=True, color='#10b981', alpha=0.7)
ax_marg_x.tick_params(labelbottom=False)
ax_marg_x.set_title(f"Bivariate Normal (ρ = {rho})", color='white')

# 5. Plot Marginal Y (Right)
ax_marg_y.hist(Y, bins=50, density=True, orientation="horizontal", color='#ec4899', alpha=0.7)
ax_marg_y.tick_params(labelleft=False)

plt.show()`
    }
  ],

  'change-of-variable': [
    {
      id: 'cov-lab-1',
      title: 'Squaring a Uniform Distribution',
      description: 'Simulate drawing from a Uniform(0,1) distribution and transforming the samples by squaring them. Notice how the empirical histogram perfectly matches the theoretical density $f_Y(y) = 1 / (2\\sqrt{y})$.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1. Simulate X ~ U[0, 1]
N = 100000
X = np.random.uniform(0, 1, N)

# 2. Transform Y = X^2
Y = X**2

# 3. Setup the plot
fig, ax = plt.subplots(figsize=(8, 5))
fig.patch.set_facecolor('#0f172a')
ax.set_facecolor('#1e293b')

# 4. Plot empirical histogram
counts, bins, patches = ax.hist(Y, bins=100, density=True, color='#ec4899', alpha=0.6, label='Empirical Histogram')

# 5. Overlay theoretical density
# f_Y(y) = 1 / (2 * sqrt(y)) for y in (0, 1]
y_vals = np.linspace(0.01, 1, 200) # avoid 0 to prevent div by zero
f_y = 1 / (2 * np.sqrt(y_vals))
ax.plot(y_vals, f_y, color='#fbcfe8', lw=2, label='Theoretical f_Y(y)')

# Formatting
ax.set_title("Transformation: Y = X² where X ~ U[0, 1]", color='white', fontsize=14)
ax.set_xlabel("y", color='#cbd5e1')
ax.set_ylabel("Density", color='#cbd5e1')
ax.tick_params(colors='#94a3b8')
ax.legend(facecolor='#1e293b', labelcolor='white')
ax.set_ylim(0, 4) # cap the y-axis for better visualization

plt.tight_layout()
plt.show()`
    },
    {
      id: 'cov-lab-2',
      title: 'Log-Normal from Normal',
      description: 'Generate standard normal random variables $Z \\sim N(0,1)$ and apply the exponential transformation $Y = e^Z$. The resulting distribution is heavily right-skewed, demonstrating the strictly increasing transformation rule.',
      code: `import numpy as np
import matplotlib.pyplot as plt

# 1. Simulate Z ~ N(0, 1)
N = 100000
Z = np.random.normal(0, 1, N)

# 2. Transform Y = e^Z
Y = np.exp(Z)

# 3. Setup the plot
fig, axes = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')
    ax.tick_params(colors='#94a3b8')
    ax.xaxis.label.set_color('#cbd5e1')
    ax.yaxis.label.set_color('#cbd5e1')
    ax.title.set_color('white')

# 4. Plot Z ~ N(0, 1)
axes[0].hist(Z, bins=100, density=True, color='#3b82f6', alpha=0.7)
axes[0].set_title("Z ~ N(0, 1)")
axes[0].set_xlabel("z")
axes[0].set_ylabel("Density")

# 5. Plot Y = e^Z (Log-Normal)
# Filter Y for better visualization (tails can be very long)
y_filtered = Y[Y < 10]
axes[1].hist(y_filtered, bins=100, density=True, color='#10b981', alpha=0.7, label='Empirical')

# Overlay theoretical Log-Normal density
y_vals = np.linspace(0.01, 10, 200)
f_y = (1 / (y_vals * np.sqrt(2 * np.pi))) * np.exp(-0.5 * (np.log(y_vals))**2)
axes[1].plot(y_vals, f_y, color='#a7f3d0', lw=2, label='Theoretical')

axes[1].set_title("Y = e^Z (Log-Normal)")
axes[1].set_xlabel("y")
axes[1].legend(facecolor='#1e293b', labelcolor='white')

plt.tight_layout()
plt.show()`
    }
  ],

  'probability-intro': [
    {
      id: 'intro-lab-1',
      title: 'Sample Space & Events',
      description: 'Visualize the sample space of a fair die and highlight event subsets.',
      code: `import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np

fig, axes = plt.subplots(1, 2, figsize=(11, 4))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')

# ── Left: Sample space bar chart ──────────────────────────────────────────────
S = [1, 2, 3, 4, 5, 6]
probs = [1/6] * 6

A = {2, 4, 6}   # even
B = {1, 2, 3}   # <= 3

colors = []
for s in S:
    if s in A and s in B:  colors.append('#06b6d4')  # A ∩ B  (cyan)
    elif s in A:            colors.append('#3b82f6')  # A only (blue)
    elif s in B:            colors.append('#8b5cf6')  # B only (purple)
    else:                   colors.append('#475569')  # neither

axes[0].bar(S, probs, color=colors, edgecolor='#0f172a', linewidth=1.5, width=0.7)
axes[0].set_title('Sample Space  S = {1,2,3,4,5,6}', color='white', fontsize=11, pad=10)
axes[0].set_xlabel('Outcome', color='#94a3b8')
axes[0].set_ylabel('P({s}) = 1/6', color='#94a3b8')
axes[0].set_ylim(0, 0.26)
axes[0].tick_params(colors='#94a3b8')
for spine in axes[0].spines.values():
    spine.set_edgecolor('#334155')
axes[0].axhline(1/6, color='#ef4444', linestyle='--', linewidth=1, alpha=0.7)

legend_patches = [
    mpatches.Patch(color='#3b82f6', label='A = even  {2,4,6}'),
    mpatches.Patch(color='#8b5cf6', label='B = ≤ 3   {1,2,3}'),
    mpatches.Patch(color='#06b6d4', label='A ∩ B     {2}'),
    mpatches.Patch(color='#475569', label='neither   {5}'),
]
axes[0].legend(handles=legend_patches, facecolor='#1e293b', edgecolor='#334155',
               labelcolor='white', fontsize=8.5)

# ── Right: Event probabilities ────────────────────────────────────────────────
events  = ['P(A)\\neven', 'P(B)\\n≤ 3', 'P(A∩B)', 'P(A∪B)', 'P(Aᶜ)', 'P(S)']
vals    = [3/6,          3/6,         1/6,       5/6,       3/6,     1.0]
ecols   = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444']

bars = axes[1].bar(events, vals, color=ecols, edgecolor='#0f172a', linewidth=1.5, width=0.6)
axes[1].set_title('Key Event Probabilities', color='white', fontsize=11, pad=10)
axes[1].set_ylabel('Probability', color='#94a3b8')
axes[1].set_ylim(0, 1.15)
axes[1].tick_params(colors='#94a3b8', axis='x', labelsize=8.5)
axes[1].tick_params(colors='#94a3b8', axis='y')
for spine in axes[1].spines.values():
    spine.set_edgecolor('#334155')

for bar, v in zip(bars, vals):
    axes[1].text(bar.get_x() + bar.get_width()/2, v + 0.02,
                 f'{v:.3f}', ha='center', va='bottom', color='white', fontsize=8.5, fontweight='bold')

plt.tight_layout(pad=1.5)
plt.show()
`,
    },
    {
      id: 'intro-lab-2',
      title: 'Law of Large Numbers',
      description: 'Watch relative frequency converge to P = 0.5 as N grows.',
      code: `import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(42)

fig, axes = plt.subplots(1, 2, figsize=(11, 4))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')

# ── Left: Convergence path ────────────────────────────────────────────────────
N = 2000
flips   = rng.integers(0, 2, size=N)           # 0 = T, 1 = H
cum_sum = np.cumsum(flips)
ns      = np.arange(1, N + 1)
freq    = cum_sum / ns

axes[0].plot(ns, freq, color='#3b82f6', linewidth=1.2, alpha=0.9, label='Relative freq(H)')
axes[0].axhline(0.5, color='#ef4444', linewidth=1.5, linestyle='--', label='True P = 0.5')
axes[0].fill_between(ns, 0.5 - 2/np.sqrt(ns), 0.5 + 2/np.sqrt(ns),
                      color='#ef4444', alpha=0.08, label='±2/√N band')
axes[0].set_xscale('log')
axes[0].set_ylim(0.2, 0.8)
axes[0].set_xlabel('Number of flips (log scale)', color='#94a3b8')
axes[0].set_ylabel('Relative frequency of H', color='#94a3b8')
axes[0].set_title('Law of Large Numbers', color='white', fontsize=11, pad=10)
axes[0].tick_params(colors='#94a3b8')
for sp in axes[0].spines.values():
    sp.set_edgecolor('#334155')
axes[0].legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=9)

# ── Right: Final distribution at various N ────────────────────────────────────
sample_sizes = [10, 50, 200, 1000, 5000]
final_freqs  = [rng.integers(0,2,N).mean() for N in sample_sizes]
colors_bar   = plt.cm.Blues(np.linspace(0.4, 0.9, len(sample_sizes)))

bars = axes[1].barh([f'N={n:,}' for n in sample_sizes], final_freqs,
                     color=colors_bar, edgecolor='#0f172a', linewidth=1.2, height=0.6)
axes[1].axvline(0.5, color='#ef4444', linewidth=1.5, linestyle='--', label='True P = 0.5')
axes[1].set_xlim(0, 1)
axes[1].set_xlabel('Relative frequency of H', color='#94a3b8')
axes[1].set_title('One Trial per Sample Size', color='white', fontsize=11, pad=10)
axes[1].tick_params(colors='#94a3b8')
for sp in axes[1].spines.values():
    sp.set_edgecolor('#334155')
for bar, v in zip(bars, final_freqs):
    axes[1].text(v + 0.01, bar.get_y() + bar.get_height()/2,
                 f'{v:.3f}', va='center', color='white', fontsize=9)
axes[1].legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=9)

plt.tight_layout(pad=1.5)
plt.show()
`,
    },
  ],

  'probability-models': [
    {
      id: 'models-lab-1',
      title: 'Comparing Probability Models',
      description: 'Side-by-side bar charts of three different probability models on {1,...,6}.',
      code: `import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(1, 3, figsize=(12, 4), sharey=True)
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')

S = [1, 2, 3, 4, 5, 6]

models = [
    {
        'title': 'Fair die\\nP({k}) = 1/6',
        'probs': [1/6]*6,
        'color': '#3b82f6',
    },
    {
        'title': 'Loaded die\\nP({6}) = 0.5',
        'probs': [0.1, 0.1, 0.1, 0.1, 0.1, 0.5],
        'color': '#8b5cf6',
    },
    {
        'title': 'Skewed model\\nP({k}) ∝ k',
        'probs': [k/21 for k in S],
        'color': '#10b981',
    },
]

for ax, m in zip(axes, models):
    bars = ax.bar(S, m['probs'], color=m['color'], edgecolor='#0f172a',
                  linewidth=1.5, width=0.7, alpha=0.85)
    ax.axhline(1/6, color='#ef4444', linestyle='--', linewidth=1,
               alpha=0.6, label='Fair = 1/6')
    ax.set_title(m['title'], color='white', fontsize=10, pad=8)
    ax.set_xlabel('Outcome k', color='#94a3b8')
    ax.set_ylim(0, 0.6)
    ax.tick_params(colors='#94a3b8')
    for sp in ax.spines.values():
        sp.set_edgecolor('#334155')
    for bar, p in zip(bars, m['probs']):
        ax.text(bar.get_x() + bar.get_width()/2, p + 0.01,
                f'{p:.3f}', ha='center', va='bottom', color='white', fontsize=8)
    total = sum(m['probs'])
    ax.text(0.95, 0.92, f'Σ = {total:.3f}', transform=ax.transAxes,
            ha='right', color='#10b981' if abs(total-1)<1e-9 else '#ef4444',
            fontsize=9, fontweight='bold')

axes[0].set_ylabel('P({k})', color='#94a3b8')
fig.suptitle('Probability Models on S = {1, 2, 3, 4, 5, 6}',
             color='white', fontsize=12, y=1.02)
plt.tight_layout(pad=1.5)
plt.show()
`,
    },
    {
      id: 'models-lab-2',
      title: 'Simulation vs Theory',
      description: 'Simulate 10 000 die rolls and compare the empirical histogram to the theoretical model.',
      code: `import matplotlib.pyplot as plt
import numpy as np
from collections import Counter

rng = np.random.default_rng(7)
N   = 10_000

fig, axes = plt.subplots(1, 2, figsize=(11, 4))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')

# Two models to compare
for ax, (title, weights) in zip(axes, [
    ('Fair die  P(k)=1/6',       [1/6]*6),
    ('Loaded die  P(6)=0.5',     [0.1,0.1,0.1,0.1,0.1,0.5]),
]):
    S       = [1,2,3,4,5,6]
    rolls   = rng.choice(S, size=N, p=weights)
    counts  = Counter(rolls)
    sim_p   = [counts[k]/N for k in S]

    x      = np.arange(1, 7)
    width  = 0.35
    b1 = ax.bar(x - width/2, weights, width, label='Theory',
                color='#3b82f6', edgecolor='#0f172a', linewidth=1.2, alpha=0.85)
    b2 = ax.bar(x + width/2, sim_p,  width, label=f'Simulation (N={N:,})',
                color='#f59e0b', edgecolor='#0f172a', linewidth=1.2, alpha=0.85)

    ax.set_title(title, color='white', fontsize=10, pad=8)
    ax.set_xlabel('Outcome', color='#94a3b8')
    ax.set_ylabel('Probability', color='#94a3b8')
    ax.set_xticks(x)
    ax.set_ylim(0, 0.65)
    ax.tick_params(colors='#94a3b8')
    for sp in ax.spines.values():
        sp.set_edgecolor('#334155')
    ax.legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=8.5)

    # Error annotation
    max_err = max(abs(t-s) for t,s in zip(weights, sim_p))
    ax.text(0.05, 0.93, f'Max error: {max_err:.4f}', transform=ax.transAxes,
            color='#94a3b8', fontsize=8.5)

plt.tight_layout(pad=1.5)
plt.show()
`,
    },
    {
      id: 'lab-sim-1',
      title: 'Box-Muller: Uniform → Normal',
      description: 'Visualise the Box-Muller transform: scatter of (U₁, U₂) inputs vs (X, Y) normal outputs, with a histogram.',
      code: `import matplotlib.pyplot as plt
import math, random

random.seed(42)
N = 2000
U1s = [random.random() for _ in range(N)]
U2s = [random.random() for _ in range(N)]
Xs = [math.sqrt(-2*math.log(u1)) * math.cos(2*math.pi*u2) for u1, u2 in zip(U1s, U2s)]
Ys = [math.sqrt(-2*math.log(u1)) * math.sin(2*math.pi*u2) for u1, u2 in zip(U1s, U2s)]

fig, axes = plt.subplots(1, 3, figsize=(14, 4))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')

axes[0].scatter(U1s[:500], U2s[:500], s=6, color='#3b82f6', alpha=0.5)
axes[0].set_title('Inputs (U₁, U₂) ~ Unif[0,1]', color='white', fontsize=10)
axes[0].set_xlabel('U₁', color='#94a3b8')
axes[0].set_ylabel('U₂', color='#94a3b8')
axes[0].tick_params(colors='#94a3b8')
for s in axes[0].spines.values(): s.set_edgecolor('#334155')

axes[1].scatter(Xs[:500], Ys[:500], s=6, color='#10b981', alpha=0.5)
axes[1].set_title('Outputs (X, Y) ~ N(0,1)', color='white', fontsize=10)
axes[1].set_xlabel('X', color='#94a3b8')
axes[1].set_ylabel('Y', color='#94a3b8')
axes[1].tick_params(colors='#94a3b8')
for s in axes[1].spines.values(): s.set_edgecolor('#334155')

min_x, max_x = min(Xs), max(Xs)
bins = 30
bw = (max_x - min_x) / bins
hist = [0] * bins
for x in Xs:
    idx = min(int((x - min_x) / bw), bins - 1)
    hist[idx] += 1
bcs = [min_x + (i + 0.5) * bw for i in range(bins)]
axes[2].bar(bcs, [h / (len(Xs) * bw) for h in hist], width=bw*0.9,
            color='#f59e0b', alpha=0.8, edgecolor='#0f172a')
xs_th = [min_x + i*(max_x-min_x)/200 for i in range(201)]
axes[2].plot(xs_th, [math.exp(-x*x/2)/math.sqrt(2*math.pi) for x in xs_th],
             color='#ef4444', linewidth=2)
axes[2].set_title('Histogram of X vs N(0,1)', color='white', fontsize=10)
axes[2].set_xlabel('x', color='#94a3b8')
axes[2].set_ylabel('density', color='#94a3b8')
axes[2].tick_params(colors='#94a3b8')
for s in axes[2].spines.values(): s.set_edgecolor('#334155')

mean_X = sum(Xs) / len(Xs)
var_X  = sum(x*x for x in Xs) / len(Xs)
print(f"Mean(X) = {mean_X:.4f}  Var(X) = {var_X:.4f}")
plt.suptitle('Box-Muller: Uniform → Normal', color='white', fontsize=12, y=1.02)
plt.tight_layout()
plt.show()
`,
    },
    {
      id: 'lab-sim-2',
      title: 'Inverse CDF Method',
      description: 'Simulate three different distributions using inverse CDF and compare histograms to theoretical densities.',
      code: `import matplotlib.pyplot as plt
import math, random

random.seed(123)
N = 5000

exp_samples  = [-math.log(random.random()) / 2 for _ in range(N)]
uni_samples  = [3 + 4 * random.random() for _ in range(N)]
cube_samples = [random.random() ** (1/3) for _ in range(N)]

fig, axes = plt.subplots(1, 3, figsize=(13, 4))
fig.patch.set_facecolor('#0f172a')

configs = [
    (exp_samples,  'Exponential(2)',    '#3b82f6', lambda x: 2*math.exp(-2*x), 0, 3.5),
    (uni_samples,  'Uniform[3, 7]',     '#10b981', lambda x: 0.25,             3, 7),
    (cube_samples, 'F(x) = x³ on [0,1]','#f59e0b', lambda x: 3*x**2,          0, 1),
]

for ax, (samps, title, color, pdf, lo, hi) in zip(axes, configs):
    ax.set_facecolor('#1e293b')
    bins = 30
    rng = hi - lo
    bw = rng / bins
    hist = [0] * bins
    for s in samps:
        idx = min(int((s - lo) / bw), bins - 1)
        if 0 <= idx < bins:
            hist[idx] += 1
    bcs = [lo + (i + 0.5) * bw for i in range(bins)]
    ax.bar(bcs, [h / (len(samps) * bw) for h in hist], width=bw*0.9,
           color=color, alpha=0.8, edgecolor='#0f172a')
    xs_th = [lo + i * rng / 100 for i in range(101)]
    ax.plot(xs_th, [pdf(x) for x in xs_th], color='#ef4444', linewidth=2, linestyle='--')
    ax.set_title(title, color='white', fontsize=10)
    ax.set_xlabel('x', color='#94a3b8')
    ax.set_ylabel('density', color='#94a3b8')
    ax.tick_params(colors='#94a3b8', labelsize=8)
    for s in ax.spines.values(): s.set_edgecolor('#334155')

plt.suptitle('Inverse CDF Simulation', color='white', fontsize=12, y=1.02)
plt.tight_layout()
plt.show()
`,
    },
  ],

  'probability-properties': [
    {
      id: 'props-lab-1',
      title: 'Venn Diagram',
      description: 'Visualize set operations A, B, A∩B, A∪B with a Matplotlib Venn diagram.',
      code: `import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import Circle
from matplotlib.collections import PatchCollection
import numpy as np

fig, axes = plt.subplots(1, 2, figsize=(11, 4.5))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')
    ax.set_aspect('equal')
    ax.axis('off')

def draw_venn(ax, pA, pB, pAB, title):
    # Draw two overlapping circles
    r = 1.0
    cx_A, cx_B = -0.55, 0.55
    cy = 0.0

    circle_A = Circle((cx_A, cy), r, alpha=0.0)
    circle_B = Circle((cx_B, cy), r, alpha=0.0)

    # Filled regions via patch drawing order
    theta = np.linspace(0, 2*np.pi, 300)

    def circle_pts(cx):
        return np.column_stack([cx + r*np.cos(theta), cy + r*np.sin(theta)])

    # A region (blue)
    ax.add_patch(Circle((cx_A, cy), r, facecolor='#3b82f6', alpha=0.35, zorder=2))
    # B region (purple)
    ax.add_patch(Circle((cx_B, cy), r, facecolor='#8b5cf6', alpha=0.35, zorder=2))
    # Intersection boost (cyan overlay)
    ax.add_patch(Circle((cx_A, cy), r, facecolor='none', edgecolor='#3b82f6', linewidth=2, zorder=3))
    ax.add_patch(Circle((cx_B, cy), r, facecolor='none', edgecolor='#8b5cf6', linewidth=2, zorder=3))

    # Labels
    ax.text(cx_A - 0.45, cy + 0.25, 'A', color='#93c5fd', fontsize=16, fontweight='bold', zorder=5)
    ax.text(cx_B + 0.25, cy + 0.25, 'B', color='#c4b5fd', fontsize=16, fontweight='bold', zorder=5)
    ax.text(0.0,   cy - 0.12, 'A∩B', color='#06b6d4', fontsize=9, fontweight='bold',
            ha='center', zorder=5)

    ax.text(cx_A - 0.5, cy - 0.55, f'P(A)={pA:.2f}', color='#93c5fd', fontsize=9, ha='center')
    ax.text(cx_B + 0.5, cy - 0.55, f'P(B)={pB:.2f}', color='#c4b5fd', fontsize=9, ha='center')
    ax.text(0.0, cy + 1.3,
            f'P(A∩B)={pAB:.2f}   P(A∪B)={pA+pB-pAB:.2f}',
            color='white', fontsize=9, ha='center')

    ax.set_xlim(-2.2, 2.2)
    ax.set_ylim(-1.6, 1.7)
    ax.set_title(title, color='white', fontsize=10, pad=6)

draw_venn(axes[0], pA=0.5, pB=0.5, pAB=1/6,
          title='Fair die: A=even, B=≤3\\nP(A∩B) = 1/6')
draw_venn(axes[1], pA=0.6, pB=0.5, pAB=0.2,
          title='Custom model\\nP(A)=0.6, P(B)=0.5, P(A∩B)=0.2')

fig.suptitle('Venn Diagrams — Set Operations', color='white', fontsize=12, y=1.0)
plt.tight_layout(pad=1.5)
plt.show()
`,
    },
    {
      id: 'props-lab-2',
      title: 'Inclusion-Exclusion & Complement',
      description: 'Step-by-step bar chart showing how P(A∪B) = P(A) + P(B) - P(A∩B) and complement rule.',
      code: `import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')

# ── Left: Inclusion-Exclusion waterfall ───────────────────────────────────────
pA, pB, pAB = 0.6, 0.5, 0.2
pAuB = pA + pB - pAB

labels  = ['P(A)', '+ P(B)', '− P(A∩B)', '= P(A∪B)']
vals    = [pA,      pB,       -pAB,        pAuB]
bottoms = [0,       pA,        pA+pB,       0]
colors  = ['#3b82f6', '#8b5cf6', '#ef4444', '#10b981']

for i, (lab, val, bot, col) in enumerate(zip(labels, vals, bottoms, colors)):
    if i < 3:
        axes[0].bar(i, abs(val), bottom=bot if val > 0 else bot+val,
                    color=col, edgecolor='#0f172a', linewidth=1.5, width=0.5, alpha=0.85)
    else:
        axes[0].bar(i, val, color=col, edgecolor='#0f172a', linewidth=1.5, width=0.5, alpha=0.85)
    axes[0].text(i, (bot + abs(val)/2) if i < 3 else val/2,
                 f'{val:+.2f}' if i > 0 else f'{val:.2f}',
                 ha='center', va='center', color='white', fontsize=11, fontweight='bold')

axes[0].set_xticks(range(4))
axes[0].set_xticklabels(labels, color='#94a3b8', fontsize=9)
axes[0].set_ylim(0, 1.15)
axes[0].set_ylabel('Probability', color='#94a3b8')
axes[0].set_title('Inclusion-Exclusion Principle', color='white', fontsize=11, pad=10)
axes[0].tick_params(colors='#94a3b8')
for sp in axes[0].spines.values():
    sp.set_edgecolor('#334155')
axes[0].text(0.5, 0.95,
             f'P(A∪B) = {pA} + {pB} − {pAB} = {pAuB:.2f}',
             transform=axes[0].transAxes, ha='center', color='#94a3b8', fontsize=9)

# ── Right: Complement rule across many events ─────────────────────────────────
events = ['P(even)\\n{2,4,6}', 'P(>3)\\n{4,5,6}', 'P(prime)\\n{2,3,5}', 'P({6})']
ps     = [3/6, 3/6, 3/6, 1/6]
x = np.arange(len(events))
w = 0.38

b1 = axes[1].bar(x - w/2, ps,       w, label='P(A)',  color='#3b82f6', edgecolor='#0f172a', linewidth=1.2, alpha=0.85)
b2 = axes[1].bar(x + w/2, [1-p for p in ps], w, label='P(Aᶜ)', color='#f59e0b', edgecolor='#0f172a', linewidth=1.2, alpha=0.85)

for b, p in zip(b1, ps):
    axes[1].text(b.get_x()+b.get_width()/2, p+0.02, f'{p:.3f}',
                 ha='center', color='white', fontsize=8.5, fontweight='bold')
for b, p in zip(b2, ps):
    axes[1].text(b.get_x()+b.get_width()/2, (1-p)+0.02, f'{1-p:.3f}',
                 ha='center', color='white', fontsize=8.5, fontweight='bold')

axes[1].set_xticks(x)
axes[1].set_xticklabels(events, color='#94a3b8', fontsize=8.5)
axes[1].set_ylim(0, 1.15)
axes[1].set_ylabel('Probability', color='#94a3b8')
axes[1].set_title('Complement Rule  P(Aᶜ) = 1 − P(A)', color='white', fontsize=11, pad=10)
axes[1].tick_params(colors='#94a3b8')
for sp in axes[1].spines.values():
    sp.set_edgecolor('#334155')
axes[1].legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=9)
axes[1].axhline(0.5, color='#ef4444', linestyle=':', linewidth=1, alpha=0.5)

plt.tight_layout(pad=1.5)
plt.show()
`,
    },
  ],

  'uniform-probability': [
    {
      id: 'uniform-lab-1',
      title: 'Monte Carlo Estimation of π',
      description: 'Points thrown uniformly in [−1,1]² — fraction inside the unit circle estimates π/4.',
      code: `import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(3)
N   = 3000

x = rng.uniform(-1, 1, N)
y = rng.uniform(-1, 1, N)
inside = x**2 + y**2 <= 1.0

fig, axes = plt.subplots(1, 2, figsize=(11, 5))
fig.patch.set_facecolor('#0f172a')

# ── Left: Scatter plot ────────────────────────────────────────────────────────
axes[0].set_facecolor('#1e293b')
axes[0].scatter(x[inside],  y[inside],  s=2.5, color='#3b82f6', alpha=0.55, label='Inside circle')
axes[0].scatter(x[~inside], y[~inside], s=2.5, color='#ef4444', alpha=0.40, label='Outside circle')

theta = np.linspace(0, 2*np.pi, 400)
axes[0].plot(np.cos(theta), np.sin(theta), color='white', linewidth=1.5)
axes[0].set_aspect('equal')
axes[0].set_xlim(-1, 1); axes[0].set_ylim(-1, 1)
axes[0].tick_params(colors='#94a3b8')
for sp in axes[0].spines.values():
    sp.set_edgecolor('#334155')

pi_est = 4 * inside.sum() / N
axes[0].set_title(
    f'N={N:,}  →  π ≈ 4 × {inside.sum()}/{N} = {pi_est:.5f}\\n(true π = {np.pi:.5f})',
    color='white', fontsize=10, pad=8)
axes[0].legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white',
               fontsize=9, markerscale=4)

# ── Right: Convergence of π estimate ─────────────────────────────────────────
axes[1].set_facecolor('#1e293b')
Ns      = np.geomspace(10, N, 120).astype(int)
pi_ests = [4 * (x[:n]**2 + y[:n]**2 <= 1).sum() / n for n in Ns]

axes[1].plot(Ns, pi_ests, color='#3b82f6', linewidth=1.5, label='π estimate')
axes[1].axhline(np.pi, color='#ef4444', linewidth=1.5, linestyle='--', label=f'True π = {np.pi:.4f}')
axes[1].fill_between(Ns,
                      np.pi - 2/np.sqrt(Ns),
                      np.pi + 2/np.sqrt(Ns),
                      color='#ef4444', alpha=0.1, label='±2/√N band')
axes[1].set_xscale('log')
axes[1].set_ylim(2.0, 4.3)
axes[1].set_xlabel('N (log scale)', color='#94a3b8')
axes[1].set_ylabel('π estimate', color='#94a3b8')
axes[1].set_title('Convergence of Monte Carlo π', color='white', fontsize=10, pad=8)
axes[1].tick_params(colors='#94a3b8')
for sp in axes[1].spines.values():
    sp.set_edgecolor('#334155')
axes[1].legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=9)

plt.tight_layout(pad=1.5)
plt.show()
`,
    },
    {
      id: 'uniform-lab-2',
      title: 'Dice Sum Distribution',
      description: 'Theoretical vs simulated distribution of the sum of two fair dice.',
      code: `import matplotlib.pyplot as plt
import numpy as np
from collections import Counter

rng = np.random.default_rng(99)

fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')

# Theoretical
theory = {}
for d1 in range(1, 7):
    for d2 in range(1, 7):
        s = d1 + d2
        theory[s] = theory.get(s, 0) + 1/36

sums = list(range(2, 13))
th_p = [theory[s] for s in sums]

# ── Left: Theory only ─────────────────────────────────────────────────────────
cmap  = plt.cm.Blues(np.linspace(0.4, 0.9, len(sums)))
bars  = axes[0].bar(sums, th_p, color=cmap, edgecolor='#0f172a', linewidth=1.2, width=0.7)
axes[0].set_title('Theoretical  P(sum = k)', color='white', fontsize=11, pad=8)
axes[0].set_xlabel('Sum of two dice', color='#94a3b8')
axes[0].set_ylabel('Probability', color='#94a3b8')
axes[0].set_xticks(sums)
axes[0].tick_params(colors='#94a3b8')
for sp in axes[0].spines.values():
    sp.set_edgecolor('#334155')
for bar, p in zip(bars, th_p):
    axes[0].text(bar.get_x()+bar.get_width()/2, p+0.003,
                 f'{p:.4f}', ha='center', va='bottom', color='white', fontsize=7.5, rotation=90)
axes[0].axvline(7, color='#ef4444', linestyle='--', linewidth=1.5, alpha=0.7, label='Mode = 7')
axes[0].legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=9)

# ── Right: Theory vs Simulation ───────────────────────────────────────────────
N    = 50_000
rolls = rng.integers(1, 7, (N, 2)).sum(axis=1)
sim   = Counter(rolls)
sim_p = [sim[s]/N for s in sums]

x, w = np.arange(len(sums)), 0.38
b1 = axes[1].bar(x - w/2, th_p,  w, label='Theory',       color='#3b82f6', edgecolor='#0f172a', linewidth=1, alpha=0.85)
b2 = axes[1].bar(x + w/2, sim_p, w, label=f'Sim N={N:,}', color='#f59e0b', edgecolor='#0f172a', linewidth=1, alpha=0.85)
axes[1].set_xticks(x)
axes[1].set_xticklabels(sums, color='#94a3b8', fontsize=9)
axes[1].set_xlabel('Sum of two dice', color='#94a3b8')
axes[1].set_ylabel('Probability', color='#94a3b8')
axes[1].set_title(f'Theory vs Simulation (N={N:,})', color='white', fontsize=11, pad=8)
axes[1].tick_params(colors='#94a3b8')
for sp in axes[1].spines.values():
    sp.set_edgecolor('#334155')
axes[1].legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=9)

max_err = max(abs(t-s) for t,s in zip(th_p, sim_p))
axes[1].text(0.97, 0.95, f'Max err: {max_err:.4f}',
             transform=axes[1].transAxes, ha='right', color='#94a3b8', fontsize=8.5)

plt.tight_layout(pad=1.5)
plt.show()
`,
    },
  ],

  'conditional-probability': [
    {
      id: 'cond-lab-1',
      title: 'Bayes\' Theorem — Prior vs Posterior',
      description: 'Visualize how evidence updates belief: sweep disease prevalence and see P(D|+) change.',
      code: `import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')

sensitivity = 0.98   # P(+|D)
fpr         = 0.05   # P(+|Dᶜ)

def posterior(pD):
    pPos = sensitivity*pD + fpr*(1-pD)
    return (sensitivity*pD) / pPos if pPos > 0 else 0

# ── Left: Prior vs Posterior bar chart (single scenario) ─────────────────────
prevalences = [0.001, 0.01, 0.05, 0.10, 0.20, 0.50]
posts       = [posterior(p) for p in prevalences]
labels      = [f'{p:.1%}' for p in prevalences]
x = np.arange(len(prevalences))
w = 0.38

b1 = axes[0].bar(x - w/2, prevalences, w, label='Prior P(D)',     color='#475569', edgecolor='#0f172a', linewidth=1.2, alpha=0.9)
b2 = axes[0].bar(x + w/2, posts,       w, label='Posterior P(D|+)', color='#3b82f6', edgecolor='#0f172a', linewidth=1.2, alpha=0.9)

for b, v in zip(b1, prevalences):
    axes[0].text(b.get_x()+b.get_width()/2, v+0.01, f'{v:.1%}',
                 ha='center', color='#94a3b8', fontsize=8, fontweight='bold')
for b, v in zip(b2, posts):
    axes[0].text(b.get_x()+b.get_width()/2, v+0.01, f'{v:.1%}',
                 ha='center', color='white', fontsize=8, fontweight='bold')

axes[0].set_xticks(x)
axes[0].set_xticklabels([f'P(D)={l}' for l in labels], color='#94a3b8', fontsize=8.5, rotation=15)
axes[0].set_ylabel('Probability', color='#94a3b8')
axes[0].set_title('Bayes — How Prevalence Affects Posterior\\n'
                  f'(Sensitivity={sensitivity:.0%}, FPR={fpr:.0%})',
                  color='white', fontsize=10, pad=8)
axes[0].set_ylim(0, 1.12)
axes[0].tick_params(colors='#94a3b8')
for sp in axes[0].spines.values():
    sp.set_edgecolor('#334155')
axes[0].legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=9)

# ── Right: Continuous curve P(D|+) vs P(D) ───────────────────────────────────
pD_range = np.linspace(0.001, 0.999, 400)
post_range = [posterior(p) for p in pD_range]

axes[1].plot(pD_range, pD_range,    color='#475569', linewidth=1.5, linestyle='--', label='No update (posterior = prior)')
axes[1].plot(pD_range, post_range,  color='#3b82f6', linewidth=2,   label='Posterior P(D|+)')
axes[1].fill_between(pD_range, pD_range, post_range,
                      where=[p > d for p,d in zip(post_range, pD_range)],
                      color='#3b82f6', alpha=0.12, label='Evidence gain')

axes[1].set_xlabel('Prior P(D)', color='#94a3b8')
axes[1].set_ylabel('Posterior P(D|+)', color='#94a3b8')
axes[1].set_title('Posterior vs Prior (Bayes Curve)', color='white', fontsize=10, pad=8)
axes[1].tick_params(colors='#94a3b8')
for sp in axes[1].spines.values():
    sp.set_edgecolor('#334155')
axes[1].legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=8.5)

# Annotate medical test scenario
pD_mark = 0.01
post_mark = posterior(pD_mark)
axes[1].annotate(f'  Ex 1.5.7\\n  P(D)=1%, P(D|+)≈{post_mark:.1%}',
                 xy=(pD_mark, post_mark), xytext=(0.15, 0.45),
                 textcoords='axes fraction',
                 arrowprops=dict(arrowstyle='->', color='#f59e0b'),
                 color='#f59e0b', fontsize=8.5)

plt.tight_layout(pad=1.5)
plt.show()
`,
    },
    {
      id: 'cond-lab-2',
      title: 'Joint Probability Heatmap',
      description: 'Heatmap of joint distribution P(X=i, Y=j) and marginal distributions for two dice.',
      code: `import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(1, 2, figsize=(12, 5))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')

# ── Left: Joint distribution heatmap (two dice) ───────────────────────────────
joint = np.full((6, 6), 1/36)

im = axes[0].imshow(joint, cmap='Blues', vmin=0, vmax=1/6, aspect='auto')
axes[0].set_xticks(range(6)); axes[0].set_xticklabels(range(1,7), color='#94a3b8')
axes[0].set_yticks(range(6)); axes[0].set_yticklabels(range(1,7), color='#94a3b8')
axes[0].set_xlabel('Die 2 (Y)', color='#94a3b8')
axes[0].set_ylabel('Die 1 (X)', color='#94a3b8')
axes[0].set_title('Joint Distribution P(X=i, Y=j)\\nFair dice — each cell = 1/36',
                  color='white', fontsize=10, pad=8)
for i in range(6):
    for j in range(6):
        axes[0].text(j, i, '1/36', ha='center', va='center', color='white', fontsize=8)

# Highlight conditional row X=3
axes[0].add_patch(plt.Rectangle((-0.5, 1.5), 6, 1, fill=False,
                                  edgecolor='#ef4444', linewidth=2.5, zorder=3))
axes[0].text(5.6, 2.0, 'P(Y|X=3)', color='#ef4444', fontsize=8.5, va='center',
             rotation=90)

# ── Right: Conditional P(Y=j | X=3) and marginals ────────────────────────────
Y = np.arange(1, 7)
conditional_Y_given_X3 = np.full(6, 1/6)   # uniform (independent dice)
marginal_Y             = np.full(6, 1/6)

w = 0.38; x = np.arange(6)
b1 = axes[1].bar(x - w/2, marginal_Y,             w, label='Marginal P(Y=j)',       color='#475569', edgecolor='#0f172a', linewidth=1, alpha=0.85)
b2 = axes[1].bar(x + w/2, conditional_Y_given_X3, w, label='Conditional P(Y=j|X=3)', color='#ef4444', edgecolor='#0f172a', linewidth=1, alpha=0.85)

axes[1].set_xticks(x)
axes[1].set_xticklabels(Y, color='#94a3b8')
axes[1].set_xlabel('Y (die 2 value)', color='#94a3b8')
axes[1].set_ylabel('Probability', color='#94a3b8')
axes[1].set_ylim(0, 0.35)
axes[1].set_title('Marginal vs Conditional Distribution\\n(X and Y are independent → equal)',
                  color='white', fontsize=10, pad=8)
axes[1].tick_params(colors='#94a3b8')
for sp in axes[1].spines.values():
    sp.set_edgecolor('#334155')
axes[1].legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=9)
axes[1].text(0.5, 0.85,
             "Independence: P(Y|X) = P(Y)\\nConditioning doesn't change distribution",
             transform=axes[1].transAxes, ha='center', color='#10b981',
             fontsize=8.5, bbox=dict(boxstyle='round,pad=0.4', facecolor='#1e293b',
                                      edgecolor='#10b981', alpha=0.8))

plt.tight_layout(pad=1.5)
plt.show()
`,
    },
  ],

  'continuity-of-p': [
    {
      id: 'cont-lab-1',
      title: 'Sequence Convergence P(Aₙ) → P(A)',
      description: 'Plot P(Aₙ) = 2⁻⁴ − 2⁻ⁿ approaching the limit 1/16 from below (continuity from below).',
      code: `import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')

LIMIT = 2**-4   # 1/16 = 0.0625

# ── Left: Line plot of P(Aₙ) ─────────────────────────────────────────────────
ns   = np.arange(5, 35)
p_An = 2**-4 - 2.0**(-ns)

axes[0].plot(ns, p_An, 'o-', color='#3b82f6', linewidth=2, markersize=5, label='P(Aₙ) = 2⁻⁴ − 2⁻ⁿ')
axes[0].axhline(LIMIT, color='#ef4444', linewidth=1.8, linestyle='--', label='Limit P(A) = 1/16')
axes[0].fill_between(ns, p_An, LIMIT, color='#3b82f6', alpha=0.12, label='Gap to limit')

axes[0].set_xlabel('n', color='#94a3b8')
axes[0].set_ylabel('P(Aₙ)', color='#94a3b8')
axes[0].set_title('Continuity from Below\\nA₅ ⊆ A₆ ⊆ A₇ ⊆ ···  →  P(Aₙ) ↑ P(A)',
                  color='white', fontsize=10, pad=8)
axes[0].tick_params(colors='#94a3b8')
for sp in axes[0].spines.values():
    sp.set_edgecolor('#334155')
axes[0].legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=9)

# Annotate gap at specific n
for n_mark in [5, 8, 12]:
    p_mark = float(2**-4 - 2**(-n_mark))
    axes[0].annotate(f'n={n_mark}\\ngap={LIMIT-p_mark:.5f}',
                     xy=(n_mark, p_mark),
                     xytext=(n_mark + 2, p_mark - 0.007),
                     color='#f59e0b', fontsize=7.5,
                     arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=0.8))

# ── Right: Geometric distribution P({s}) = 2⁻ˢ ──────────────────────────────
s_vals = np.arange(1, 16)
p_s    = 2.0**(-s_vals)

bars = axes[1].bar(s_vals, p_s, color='#8b5cf6', edgecolor='#0f172a', linewidth=1.2,
                   width=0.7, alpha=0.85)

# Highlight Aₙ = {5,...,10}
n_highlight = 10
for s, bar in zip(s_vals, bars):
    if 5 <= s <= n_highlight:
        bar.set_facecolor('#06b6d4')
        bar.set_alpha(0.9)

axes[1].set_xlabel('s', color='#94a3b8')
axes[1].set_ylabel('P({s}) = 2⁻ˢ', color='#94a3b8')
axes[1].set_title(f'P({{s}}) = 2⁻ˢ  —  Aₙ = {{5,…,{n_highlight}}} highlighted\\n'
                  f'P(A₁₀) = {float(2**-4 - 2**-n_highlight):.5f}  →  limit 0.0625',
                  color='white', fontsize=10, pad=8)
axes[1].tick_params(colors='#94a3b8')
for sp in axes[1].spines.values():
    sp.set_edgecolor('#334155')

import matplotlib.patches as mpatches
leg = [mpatches.Patch(color='#06b6d4', label=f'Aₙ = {{5,…,{n_highlight}}}'),
       mpatches.Patch(color='#8b5cf6', label='other s values')]
axes[1].legend(handles=leg, facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=9)

plt.tight_layout(pad=1.5)
plt.show()
`,
    },
    {
      id: 'cont-lab-2',
      title: 'Continuity from Above — Bₙ ↓ ∅',
      description: 'Plot P(Bₙ) = 2^{−(n−1)} → 0 as n→∞ for the decreasing sequence Bₙ = {n, n+1, …}.',
      code: `import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(1, 2, figsize=(12, 4.5))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')

# ── Left: P(Bₙ) = 2^{-(n-1)} ─────────────────────────────────────────────────
ns   = np.arange(1, 30)
p_Bn = 2.0**(-(ns - 1))

axes[0].semilogy(ns, p_Bn, 'o-', color='#8b5cf6', linewidth=2, markersize=5, label='P(Bₙ) = 2^{-(n-1)}')
axes[0].axhline(0, color='#ef4444', linewidth=1.5, linestyle='--', alpha=0.6, label='Limit = 0')
axes[0].fill_between(ns, p_Bn, 1e-10, color='#8b5cf6', alpha=0.1)

axes[0].set_xlabel('n', color='#94a3b8')
axes[0].set_ylabel('P(Bₙ)  (log scale)', color='#94a3b8')
axes[0].set_title('Continuity from Above\\nB₁ ⊇ B₂ ⊇ ···  →  P(Bₙ) ↓ 0 = P(∅)',
                  color='white', fontsize=10, pad=8)
axes[0].tick_params(colors='#94a3b8')
for sp in axes[0].spines.values():
    sp.set_edgecolor('#334155')
axes[0].legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=9)

for n_mark in [1, 5, 10, 20]:
    p_mark = float(2**(-(n_mark-1)))
    if p_mark > 1e-10:
        axes[0].annotate(f'n={n_mark}\\n{p_mark:.2e}',
                         xy=(n_mark, p_mark), xytext=(n_mark+1.5, p_mark*3),
                         color='#f59e0b', fontsize=7.5,
                         arrowprops=dict(arrowstyle='->', color='#f59e0b', lw=0.8))

# ── Right: Side-by-side: Below vs Above ───────────────────────────────────────
ns2 = np.arange(5, 25)
p_below = 2**-4 - 2.0**(-ns2)    # P(Aₙ) — increasing to 1/16
p_above = 2.0**(-(ns2 - 1))       # P(Bₙ) — decreasing to 0

axes[1].plot(ns2, p_below, 'o-', color='#3b82f6', linewidth=2, markersize=5,
             label='P(Aₙ) — cont. from below')
axes[1].plot(ns2, p_above, 's-', color='#8b5cf6', linewidth=2, markersize=5,
             label='P(Bₙ) — cont. from above')
axes[1].axhline(2**-4, color='#3b82f6', linestyle=':', linewidth=1, alpha=0.5)
axes[1].axhline(0,     color='#8b5cf6', linestyle=':', linewidth=1, alpha=0.5)

axes[1].text(23.5, 2**-4 + 0.001, '1/16', color='#3b82f6', fontsize=8)
axes[1].text(23.5, 0.001,          '0',   color='#8b5cf6', fontsize=8)

axes[1].set_xlabel('n', color='#94a3b8')
axes[1].set_ylabel('Probability', color='#94a3b8')
axes[1].set_title('Both Continuity Theorems Side-by-Side',
                  color='white', fontsize=10, pad=8)
axes[1].tick_params(colors='#94a3b8')
for sp in axes[1].spines.values():
    sp.set_edgecolor('#334155')
axes[1].legend(facecolor='#1e293b', edgecolor='#334155', labelcolor='white', fontsize=9)

plt.tight_layout(pad=1.5)
plt.show()
`,
    },
  ],

  'discrete-distributions': [
    {
      id: 'lab-dd-1',
      title: 'Binomial PMF Explorer',
      description: 'Plot Binomial(n, θ) PMFs side by side for three parameter combinations and identify the mode of each.',
      code: `import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import math

def binom_pmf(n, theta, k):
    return math.comb(n, k) * (theta**k) * ((1-theta)**(n-k))

params = [(10, 0.3), (10, 0.5), (20, 0.3)]
colors = ['#3b82f6', '#10b981', '#f59e0b']

fig, axes = plt.subplots(1, 3, figsize=(13, 4))
fig.patch.set_facecolor('#0f172a')

for ax, (n, t), color in zip(axes, params, colors):
    ax.set_facecolor('#1e293b')
    ks = list(range(n + 1))
    ps = [binom_pmf(n, t, k) for k in ks]
    ax.bar(ks, ps, color=color, alpha=0.85, edgecolor='#0f172a', linewidth=0.8)
    ax.set_title(f'Binomial({n}, {t})', color='white', fontsize=11, pad=8)
    ax.set_xlabel('k', color='#94a3b8', fontsize=9)
    ax.set_ylabel('P(X = k)', color='#94a3b8', fontsize=9)
    ax.tick_params(colors='#94a3b8', labelsize=8)
    for spine in ax.spines.values():
        spine.set_edgecolor('#334155')
    mode_k = ps.index(max(ps))
    ax.axvline(mode_k, color='#ef4444', linestyle='--', linewidth=1.2, alpha=0.8, label=f'mode = {mode_k}')
    ax.legend(fontsize=8, labelcolor='white', facecolor='#1e293b', edgecolor='#334155')

plt.suptitle('Binomial PMF — Different Parameters', color='white', fontsize=12, y=1.02)
plt.tight_layout()
plt.show()
`,
    },
    {
      id: 'lab-dd-2',
      title: 'Poisson PMF & Normal Approximation',
      description: 'Plot Poisson(λ) PMFs for λ = 1, 3, 7 and overlay the Normal approximation N(λ, λ).',
      code: `import matplotlib.pyplot as plt
import math

def poisson_pmf(lam, k):
    return (lam**k) * math.exp(-lam) / math.factorial(k)

def normal_pdf(x, mu, sigma):
    return math.exp(-0.5*((x-mu)/sigma)**2) / (sigma * math.sqrt(2*math.pi))

lambdas = [1, 3, 7]
colors  = ['#3b82f6', '#10b981', '#f59e0b']

fig, axes = plt.subplots(1, 3, figsize=(13, 4))
fig.patch.set_facecolor('#0f172a')

for ax, lam, color in zip(axes, lambdas, colors):
    ax.set_facecolor('#1e293b')
    k_max = int(lam * 3) + 1
    ks = list(range(k_max))
    ps = [poisson_pmf(lam, k) for k in ks]
    ax.bar(ks, ps, color=color, alpha=0.8, edgecolor='#0f172a', linewidth=0.8, label=f'Poisson({lam})')
    xs = [i * 0.1 for i in range(int(k_max * 10) + 1)]
    ax.plot(xs, [normal_pdf(x, lam, math.sqrt(lam)) for x in xs],
            color='#ef4444', linewidth=1.8, linestyle='--', label=f'N({lam}, {lam})')
    ax.set_title(f'Poisson(λ={lam})', color='white', fontsize=11, pad=8)
    ax.set_xlabel('k', color='#94a3b8', fontsize=9)
    ax.set_ylabel('P(X = k)', color='#94a3b8', fontsize=9)
    ax.tick_params(colors='#94a3b8', labelsize=8)
    for spine in ax.spines.values():
        spine.set_edgecolor('#334155')
    ax.legend(fontsize=8, labelcolor='white', facecolor='#1e293b', edgecolor='#334155')

plt.suptitle('Poisson PMF vs Normal Approximation', color='white', fontsize=12, y=1.02)
plt.tight_layout()
plt.show()
`,
    },
  ],

  'continuous-distributions': [
    {
      id: 'lab-cd-1',
      title: 'Exponential and Normal PDFs',
      description: 'Plot Exponential(λ) for λ = 0.5, 1, 2 and Normal(μ, σ²) for different parameters on the same axes.',
      code: `import matplotlib.pyplot as plt
import math

def exp_pdf(x, lam):
    return lam * math.exp(-lam * x) if x >= 0 else 0.0

def norm_pdf(x, mu, sigma):
    return math.exp(-0.5*((x-mu)/sigma)**2) / (sigma * math.sqrt(2*math.pi))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
fig.patch.set_facecolor('#0f172a')
ax1.set_facecolor('#1e293b')
ax2.set_facecolor('#1e293b')

xs_exp = [i * 0.05 for i in range(100)]
for lam, color in [(0.5, '#3b82f6'), (1.0, '#10b981'), (2.0, '#f59e0b')]:
    ax1.plot(xs_exp, [exp_pdf(x, lam) for x in xs_exp],
             color=color, linewidth=2, label=f'λ = {lam}')
ax1.set_title('Exponential PDF', color='white', fontsize=11, pad=8)
ax1.set_xlabel('x', color='#94a3b8')
ax1.set_ylabel('f(x)', color='#94a3b8')
ax1.tick_params(colors='#94a3b8')
for s in ax1.spines.values(): s.set_edgecolor('#334155')
ax1.legend(fontsize=9, labelcolor='white', facecolor='#1e293b', edgecolor='#334155')

xs_norm = [i * 0.05 - 5 for i in range(200)]
for mu, sigma, color, label in [(0, 1, '#3b82f6', 'N(0,1)'), (1, 1, '#10b981', 'N(1,1)'), (0, 2, '#f59e0b', 'N(0,4)')]:
    ax2.plot(xs_norm, [norm_pdf(x, mu, sigma) for x in xs_norm],
             color=color, linewidth=2, label=label)
ax2.set_title('Normal PDF', color='white', fontsize=11, pad=8)
ax2.set_xlabel('x', color='#94a3b8')
ax2.set_ylabel('f(x)', color='#94a3b8')
ax2.tick_params(colors='#94a3b8')
for s in ax2.spines.values(): s.set_edgecolor('#334155')
ax2.legend(fontsize=9, labelcolor='white', facecolor='#1e293b', edgecolor='#334155')

plt.suptitle('Continuous Distribution PDFs', color='white', fontsize=12, y=1.02)
plt.tight_layout()
plt.show()
`,
    },
  ],

  'cumulative-distribution': [
    {
      id: 'lab-cdf-1',
      title: 'CDF: Discrete vs Continuous',
      description: 'Compare the step-function CDF of Binomial(10, 0.4) with the smooth CDF of Exponential(2).',
      code: `import matplotlib.pyplot as plt
import math

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
fig.patch.set_facecolor('#0f172a')
ax1.set_facecolor('#1e293b')
ax2.set_facecolor('#1e293b')

n, theta = 10, 0.4
cum = 0.0
xs_s, ys_s = [], []
for k in range(n + 1):
    cum += math.comb(n, k) * (theta**k) * ((1-theta)**(n-k))
    xs_s += [k, k + 0.999]
    ys_s += [cum, cum]
ax1.plot(xs_s, ys_s, color='#3b82f6', linewidth=2)
ax1.set_title('CDF of Binomial(10, 0.4)', color='white', fontsize=11, pad=8)
ax1.set_xlabel('k', color='#94a3b8')
ax1.set_ylabel('F(k)', color='#94a3b8')
ax1.tick_params(colors='#94a3b8')
ax1.set_ylim(-0.05, 1.05)
for s in ax1.spines.values(): s.set_edgecolor('#334155')

lam = 2.0
xs_e = [i * 0.05 for i in range(80)]
ys_e = [1 - math.exp(-lam * x) for x in xs_e]
ax2.plot(xs_e, ys_e, color='#10b981', linewidth=2)
ax2.fill_between(xs_e, ys_e, alpha=0.15, color='#10b981')
ax2.axhline(1.0, color='#94a3b8', linestyle='--', linewidth=1, alpha=0.5)
ax2.set_title('CDF of Exponential(2)', color='white', fontsize=11, pad=8)
ax2.set_xlabel('x', color='#94a3b8')
ax2.set_ylabel('F(x)', color='#94a3b8')
ax2.tick_params(colors='#94a3b8')
for s in ax2.spines.values(): s.set_edgecolor('#334155')

plt.suptitle('Cumulative Distribution Functions', color='white', fontsize=12, y=1.02)
plt.tight_layout()
plt.show()
`,
    },
  ],
};
