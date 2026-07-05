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

  // ── Chapter 3: Expectation ────────────────────────────────────────────────

  'expectation-discrete': [
    {
      id: 'exp-disc-1',
      title: 'Verifying E(X) via Simulation (LLN)',
      description: 'Simulate 50,000 fair die rolls and watch the running average converge to E(X) = 3.5 — a direct illustration of the Law of Large Numbers.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
N = 50_000
rolls = np.random.randint(1, 7, size=N)

running_mean = np.cumsum(rolls) / np.arange(1, N + 1)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')
    ax.tick_params(colors='#94a3b8')
    for s in ax.spines.values(): s.set_edgecolor('#334155')

# Running mean convergence
axes[0].plot(running_mean, color='#3b82f6', linewidth=1.2, alpha=0.9)
axes[0].axhline(3.5, color='#ef4444', linestyle='--', linewidth=2, label='E(X) = 3.5')
axes[0].set_xscale('log')
axes[0].set_xlabel('Number of rolls (log scale)', color='#94a3b8')
axes[0].set_ylabel('Running average', color='#94a3b8')
axes[0].set_title('Running Mean Converges to E(X) = 3.5', color='white', fontsize=11)
axes[0].legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')

# PMF bar chart
vals, counts = np.unique(rolls, return_counts=True)
probs = counts / N
axes[1].bar(vals, probs, color='#8b5cf6', alpha=0.8, edgecolor='#a78bfa')
axes[1].axhline(1/6, color='#ef4444', linestyle='--', linewidth=2, label='Exact: 1/6')
for v, p in zip(vals, probs):
    axes[1].text(v, p + 0.003, f'{p:.3f}', ha='center', color='#94a3b8', fontsize=9)
axes[1].set_title('Simulated PMF (should be ≈ 1/6 each)', color='white', fontsize=11)
axes[1].set_xlabel('Die value', color='#94a3b8')
axes[1].set_ylabel('Frequency', color='#94a3b8')
axes[1].legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')

print(f"Simulated E(X) = {rolls.mean():.4f}  (exact: 3.5)")
plt.tight_layout()
plt.show()
`,
    },
    {
      id: 'exp-disc-2',
      title: 'Binomial vs Poisson Mean & Variance',
      description: 'Compare the simulated means and variances of Binomial(100, 0.04) and Poisson(4) side by side. Both share the same theoretical mean λ=4 and similar variance.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import binom, poisson

np.random.seed(7)
N = 30_000
n, p, lam = 100, 0.04, 4

binom_samples = np.random.binomial(n, p, N)
pois_samples  = np.random.poisson(lam, N)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
fig.patch.set_facecolor('#0f172a')
for ax in axes:
    ax.set_facecolor('#1e293b')
    ax.tick_params(colors='#94a3b8')
    for s in ax.spines.values(): s.set_edgecolor('#334155')

ks = np.arange(0, 15)
for ax, samp, dist_pmf, label, color in [
    (axes[0], binom_samples, binom.pmf(ks, n, p), f'Binomial({n},{p})', '#3b82f6'),
    (axes[1], pois_samples,  poisson.pmf(ks, lam), f'Poisson({lam})',   '#10b981'),
]:
    vals, counts = np.unique(samp, return_counts=True)
    ax.bar(vals[vals < 15], counts[vals < 15] / N, color=color, alpha=0.5, label='Simulated', width=0.4, align='edge')
    ax.plot(ks, dist_pmf, 'o-', color='#f59e0b', linewidth=1.5, markersize=4, label='Exact PMF')
    ax.set_title(label, color='white', fontsize=11)
    ax.set_xlabel('k', color='#94a3b8')
    ax.set_ylabel('P(X=k)', color='#94a3b8')
    ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')
    print(f"{label}: E[X]={samp.mean():.3f} (exact={lam}), Var={samp.var():.3f} (exact≈{n*p*(1-p):.3f})")

plt.suptitle('Binomial vs Poisson — same mean λ=4', color='white', fontsize=12)
plt.tight_layout()
plt.show()
`,
    },
  ],

  'expectation-continuous': [
    {
      id: 'exp-cont-1',
      title: 'Centre of Mass of a PDF',
      description: 'Numerically verify that E(X) = ∫x·f(x)dx equals the theoretical formula for three continuous distributions: Uniform, Exponential, and Normal.',
      code: `import numpy as np
from scipy import integrate
import matplotlib.pyplot as plt
from scipy.stats import uniform, expon, norm

fig, axes = plt.subplots(1, 3, figsize=(14, 4))
fig.patch.set_facecolor('#0f172a')
for ax in axes: ax.set_facecolor('#1e293b'); ax.tick_params(colors='#94a3b8')

configs = [
    ('Uniform[1, 5]', uniform(1, 4), (0.5, 5.5), '#3b82f6', 3.0),
    ('Exponential(λ=2)', expon(scale=0.5), (0, 3), '#10b981', 0.5),
    ('Normal(μ=2, σ=1)', norm(2, 1), (-1, 5), '#8b5cf6', 2.0),
]

for ax, (title, dist, xlim, color, exact_mean) in zip(axes, configs):
    xs = np.linspace(*xlim, 500)
    ys = dist.pdf(xs)
    ax.fill_between(xs, ys, alpha=0.3, color=color)
    ax.plot(xs, ys, color=color, linewidth=2)

    # Numerical E(X)
    ev, _ = integrate.quad(lambda x: x * dist.pdf(x), *xlim)
    ax.axvline(ev, color='#ef4444', linewidth=2, linestyle='--', label=f'E(X)={ev:.3f}')

    for sp in ax.spines.values(): sp.set_edgecolor('#334155')
    ax.set_title(title, color='white', fontsize=10)
    ax.set_xlabel('x', color='#94a3b8')
    ax.set_ylabel('f(x)', color='#94a3b8')
    ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=9)
    print(f"{title}: numerical E(X)={ev:.4f}, exact={exact_mean}")

plt.suptitle('E(X) = ∫ x·f(x)dx — centre of mass of the density', color='white', fontsize=11)
plt.tight_layout()
plt.show()
`,
    },
  ],

  'variance-covariance': [
    {
      id: 'var-cov-1',
      title: 'Covariance and Correlation from Samples',
      description: 'Generate bivariate normal samples for ρ = −0.8, 0, +0.8 and compute sample covariance and correlation. Compare to the population values.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
N = 2000
rhos = [-0.8, 0.0, 0.8]
colors = ['#ef4444', '#94a3b8', '#10b981']

fig, axes = plt.subplots(1, 3, figsize=(14, 4))
fig.patch.set_facecolor('#0f172a')

for ax, rho, color in zip(axes, rhos, colors):
    cov_matrix = [[1, rho], [rho, 1]]
    data = np.random.multivariate_normal([0, 0], cov_matrix, N)
    X, Y = data[:, 0], data[:, 1]

    ax.set_facecolor('#1e293b')
    ax.scatter(X, Y, s=4, alpha=0.4, color=color)
    ax.set_aspect('equal')
    for sp in ax.spines.values(): sp.set_edgecolor('#334155')
    ax.tick_params(colors='#94a3b8')

    sample_cov = np.cov(X, Y)[0, 1]
    sample_corr = np.corrcoef(X, Y)[0, 1]
    ax.set_title(f'ρ = {rho}', color='white', fontsize=11)
    ax.set_xlabel('X', color='#94a3b8')
    ax.set_ylabel('Y', color='#94a3b8')
    ax.text(0.05, 0.92, f'Cov={sample_cov:.3f}\\nCorr={sample_corr:.3f}',
            transform=ax.transAxes, color='white', fontsize=9,
            bbox=dict(boxstyle='round', facecolor='#0f172a', alpha=0.7))
    print(f"ρ={rho}: sample Cov={sample_cov:.4f}, sample Corr={sample_corr:.4f}")

plt.suptitle('Covariance & Correlation for Different ρ Values', color='white', fontsize=12)
plt.tight_layout()
plt.show()
`,
    },
    {
      id: 'var-cov-2',
      title: 'Variance of a Sum',
      description: 'Verify Var(X+Y) = Var(X) + Var(Y) + 2·Cov(X,Y) numerically by simulating correlated pairs and comparing to the formula.',
      code: `import numpy as np

np.random.seed(42)
N = 100_000

for rho in [-0.7, 0, 0.5, 0.9]:
    cov_matrix = [[4, rho * 2 * 3], [rho * 2 * 3, 9]]  # Var(X)=4, Var(Y)=9
    data = np.random.multivariate_normal([0, 0], cov_matrix, N)
    X, Y = data[:, 0], data[:, 1]

    var_x   = np.var(X, ddof=1)
    var_y   = np.var(Y, ddof=1)
    cov_xy  = np.cov(X, Y, ddof=1)[0, 1]
    var_sum_formula = var_x + var_y + 2 * cov_xy
    var_sum_direct  = np.var(X + Y, ddof=1)

    print(f"ρ={rho:+.1f} | Var(X)={var_x:.3f} Var(Y)={var_y:.3f} "
          f"Cov={cov_xy:.3f} | Formula={var_sum_formula:.3f} Direct={var_sum_direct:.3f}")

print("\\nFormula and direct measurement agree — Var(X+Y) = Var(X)+Var(Y)+2·Cov(X,Y) ✓")
`,
    },
  ],

  'generating-functions': [
    {
      id: 'mgf-1',
      title: 'MGF Moments vs Simulated Moments',
      description: 'Compare the theoretical moments E[X], E[X²], Var(X) obtained from the MGF formulas against simulation for Binomial, Poisson, and Normal.',
      code: `import numpy as np
from scipy.stats import binom, poisson, norm

np.random.seed(0)
N = 100_000

print("Distribution        | E[X] (exact / sim)  | Var(X) (exact / sim)")
print("-" * 65)

# Binomial(20, 0.3)
n, p = 20, 0.3
s = binom.rvs(n, p, size=N)
print(f"Binomial(20, 0.3)   | {n*p:.3f} / {s.mean():.3f}       | {n*p*(1-p):.3f} / {s.var():.3f}")

# Poisson(5)
lam = 5
s = poisson.rvs(lam, size=N)
print(f"Poisson(5)          | {lam:.3f} / {s.mean():.3f}       | {lam:.3f} / {s.var():.3f}")

# Normal(3, 4)
mu, sigma2 = 3, 4
s = norm.rvs(mu, np.sqrt(sigma2), size=N)
print(f"Normal(3, 4)        | {mu:.3f} / {s.mean():.3f}       | {sigma2:.3f} / {s.var():.3f}")

print("\\nMGF derivatives at s=0 reproduce the exact means and variances.")
`,
    },
  ],

  'conditional-expectation': [
    {
      id: 'cond-exp-1',
      title: 'Law of Total Expectation — Simulation',
      description: 'Simulate E(X) two ways: directly, and via E[E(X|Y)]. Both should match. Model: Y ~ Uniform{1..6}, X|Y=y ~ Binomial(y, 0.5).',
      code: `import numpy as np

np.random.seed(42)
N = 200_000

# X|Y=y ~ Binomial(y, 0.5);  Y ~ Uniform{1,...,6}
Y = np.random.randint(1, 7, N)
X = np.array([np.random.binomial(y, 0.5) for y in Y])

# 1. Direct E(X)
direct_mean = X.mean()

# 2. E[E(X|Y)] — average the conditional means
cond_means = {y: X[Y == y].mean() for y in range(1, 7)}
prob_y = 1 / 6
total_exp = sum(cond_means[y] * prob_y for y in range(1, 7))

# Theoretical: E(X|Y=y) = y/2, so E(X) = E(Y/2) = E(Y)/2 = 3.5/2 = 1.75
print(f"Direct E(X)           = {direct_mean:.4f}")
print(f"E[E(X|Y)]             = {total_exp:.4f}")
print(f"Theoretical E(X)      = {3.5/2:.4f}  (E[Y]/2)")
print()
print("Conditional means E(X|Y=y):")
for y in range(1, 7):
    print(f"  E(X|Y={y}) = {cond_means[y]:.4f}  (exact: {y/2:.2f})")
print("\\nLaw of Total Expectation verified: direct ≈ E[E(X|Y)] ✓")
`,
    },
    {
      id: 'cond-exp-2',
      title: 'Variance Decomposition (Law of Total Variance)',
      description: 'Verify Var(X) = Var(E(X|Y)) + E(Var(X|Y)) using the same Y ~ Uniform{1..6}, X|Y ~ Binomial(Y, 0.5) model.',
      code: `import numpy as np

np.random.seed(42)
N = 500_000

Y = np.random.randint(1, 7, N)
X = np.array([np.random.binomial(y, 0.5) for y in Y])

# Total variance
total_var = X.var()

# Var(E(X|Y)) — variance of conditional means
cond_mean_of_y = Y / 2   # E(X|Y=y) = y/2
var_of_cond_means = cond_mean_of_y.var()

# E(Var(X|Y)) — average conditional variance; Var(X|Y=y) = y*(0.5)*(0.5) = y/4
cond_var_of_y = Y / 4
avg_cond_var = cond_var_of_y.mean()

print(f"Var(X)                = {total_var:.5f}")
print(f"Var(E(X|Y))           = {var_of_cond_means:.5f}  (between-group variance)")
print(f"E(Var(X|Y))           = {avg_cond_var:.5f}  (within-group variance)")
print(f"Sum                   = {var_of_cond_means + avg_cond_var:.5f}")
print()
print("Law of Total Variance: Var(X) = Var(E(X|Y)) + E(Var(X|Y)) ✓")
`,
    },
  ],

  'expectation-inequalities': [
    {
      id: 'ineq-1',
      title: 'Markov vs Chebyshev vs Exact Tail Probabilities',
      description: 'For X ~ Exponential(1), compare P(X≥a) exactly, the Markov bound E(X)/a, and the Chebyshev bound Var(X)/(a-1)² for a > 1.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import expon

a_vals = np.linspace(1.1, 6, 200)
lam = 1  # Exp(1): mean=1, var=1

exact   = expon.sf(a_vals)             # P(X >= a)
markov  = 1 / a_vals                   # E(X)/a = 1/a
# Chebyshev: P(|X-1| >= a-1) <= Var(X)/(a-1)^2 = 1/(a-1)^2
cheb    = np.minimum(1.0, 1 / (a_vals - 1)**2)

fig, ax = plt.subplots(figsize=(8, 5))
fig.patch.set_facecolor('#0f172a')
ax.set_facecolor('#1e293b')
ax.tick_params(colors='#94a3b8')
for s in ax.spines.values(): s.set_edgecolor('#334155')

ax.semilogy(a_vals, exact,  color='#22c55e', linewidth=2.5, label='Exact P(X≥a)')
ax.semilogy(a_vals, markov, color='#3b82f6', linewidth=2, linestyle='--', label="Markov: E(X)/a")
ax.semilogy(a_vals, cheb,   color='#f59e0b', linewidth=2, linestyle=':', label="Chebyshev: 1/(a−1)²")

ax.set_xlabel('a', color='#94a3b8')
ax.set_ylabel('Probability (log scale)', color='#94a3b8')
ax.set_title('Tail Bound Comparison — Exp(1)', color='white', fontsize=12)
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')
ax.grid(True, color='#334155', alpha=0.5)

plt.tight_layout()
plt.show()

print("At a=3:")
a = 3
print(f"  Exact   P(X≥3) = {expon.sf(a):.5f}")
print(f"  Markov  bound  = {1/a:.5f}")
print(f"  Chebych bound  = {1/(a-1)**2:.5f}")
`,
    },
  ],

  // ── Chapter 4 ─────────────────────────────────────────────────────────────

  'sampling-distributions': [
    {
      id: 'ch4-samp-lab-1',
      title: 'Sampling Distribution of the Mean',
      description: 'Simulate the sampling distribution of X̄ₙ for n = 1, 5, 30 from an Exponential(1) population. Plot histograms side-by-side and overlay the theoretical Normal approximation predicted by the CLT.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

np.random.seed(42)
N_SIM = 5000
ns = [1, 5, 30]

fig, axes = plt.subplots(1, 3, figsize=(12, 4))
fig.patch.set_facecolor('#0f172a')

for ax, n in zip(axes, ns):
    ax.set_facecolor('#1e293b')
    # Draw N_SIM samples of size n, compute means
    samples = np.random.exponential(scale=1, size=(N_SIM, n))
    means = samples.mean(axis=1)

    mu, sigma = 1.0, 1.0 / np.sqrt(n)
    ax.hist(means, bins=40, density=True, color='#3b82f6', alpha=0.7, label='Simulated')

    x = np.linspace(mu - 4*sigma, mu + 4*sigma, 200)
    ax.plot(x, norm.pdf(x, mu, sigma), color='#10b981', linewidth=2, label='N(μ,σ²/n)')

    ax.set_title(f'n = {n}', color='white')
    ax.set_xlabel('X̄ₙ', color='#94a3b8')
    ax.tick_params(colors='#94a3b8')
    ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=8)

plt.suptitle('Sampling Distribution of X̄ₙ — Exponential(1) Population', color='white', fontsize=12)
plt.tight_layout()
plt.show()

# Print statistics for n=30
samples30 = np.random.exponential(scale=1, size=(N_SIM, 30))
means30 = samples30.mean(axis=1)
print(f"n=30: simulated mean={means30.mean():.4f} (theory=1.0000)")
print(f"n=30: simulated std ={means30.std():.4f} (theory={1/np.sqrt(30):.4f})")`,
    },
    {
      id: 'ch4-samp-lab-2',
      title: 'Geometric Mean Sampling Distribution',
      description: 'Reproduce the Example 4.1.1 sampling distribution for Y₂ = √(X₁X₂) where X₁, X₂ are i.i.d. on {1,2,3} with equal probability 1/3. Verify the exact PMF by simulation.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from collections import Counter
from fractions import Fraction

np.random.seed(0)

# Exact PMF from Example 4.1.1 — X on {1,2,3} uniform
vals = [1, 2, 3]
pairs = [(x1, x2) for x1 in vals for x2 in vals]
exact_pmf = Counter()
for x1, x2 in pairs:
    y = round(np.sqrt(x1 * x2), 6)
    exact_pmf[y] += Fraction(1, 9)

print("Exact PMF of Y₂ = √(X₁X₂):")
for y in sorted(exact_pmf):
    print(f"  Y₂={y:.4f}  P={float(exact_pmf[y]):.4f}  ({exact_pmf[y]})")

# Simulation
N = 200_000
x1 = np.random.choice(vals, size=N)
x2 = np.random.choice(vals, size=N)
y2 = np.sqrt(x1 * x2).round(6)
sim_pmf = Counter(y2)

print("\\nSimulated PMF (N=200,000):")
for y in sorted(sim_pmf):
    print(f"  Y₂={y:.4f}  P={sim_pmf[y]/N:.4f}")

# Plot comparison
fig, ax = plt.subplots(figsize=(7, 4))
fig.patch.set_facecolor('#0f172a')
ax.set_facecolor('#1e293b')
labels = [f"{y:.3f}" for y in sorted(exact_pmf)]
exact_vals = [float(exact_pmf[y]) for y in sorted(exact_pmf)]
sim_vals   = [sim_pmf.get(round(y, 6), 0) / N for y in sorted(exact_pmf)]
x = np.arange(len(labels))
ax.bar(x - 0.18, exact_vals, 0.35, label='Exact', color='#3b82f6', alpha=0.85)
ax.bar(x + 0.18, sim_vals,   0.35, label='Simulated', color='#f59e0b', alpha=0.85)
ax.set_xticks(x); ax.set_xticklabels(labels, rotation=45, color='#94a3b8')
ax.tick_params(colors='#94a3b8')
ax.set_title('PMF of Y₂ = √(X₁X₂)', color='white')
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')
plt.tight_layout(); plt.show()`,
    },
  ],

  'convergence-probability': [
    {
      id: 'ch4-convp-lab-1',
      title: 'Visualising Convergence in Probability',
      description: 'Plot multiple paths of Xₙ = Zₙ/√n (where Zₙ ~ N(0,1)) and show how the fraction of paths outside a ε-band shrinks to zero as n grows, confirming convergence in probability.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(7)
N_PATHS = 50
N_MAX   = 200
EPS     = 0.3

# Simulate all paths
Z = np.random.standard_normal((N_PATHS, N_MAX))
ns = np.arange(1, N_MAX + 1)
Xn = Z / np.sqrt(ns)  # shape (N_PATHS, N_MAX)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
fig.patch.set_facecolor('#0f172a')

# Left: sample paths
ax = axes[0]
ax.set_facecolor('#1e293b')
for i in range(N_PATHS):
    ax.plot(ns, Xn[i], alpha=0.25, linewidth=0.8, color='#3b82f6')
ax.axhline(EPS,  color='#ef4444', linestyle='--', linewidth=1.5, label=f'±ε={EPS}')
ax.axhline(-EPS, color='#ef4444', linestyle='--', linewidth=1.5)
ax.axhline(0, color='white', linewidth=1, alpha=0.4)
ax.set_xlabel('n', color='#94a3b8'); ax.set_ylabel('Xₙ', color='#94a3b8')
ax.tick_params(colors='#94a3b8')
ax.set_title('50 paths of Xₙ = Zₙ/√n', color='white')
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')

# Right: fraction outside ε-band vs n
ax2 = axes[1]
ax2.set_facecolor('#1e293b')
frac_outside = (np.abs(Xn) >= EPS).mean(axis=0)
ax2.plot(ns, frac_outside, color='#f59e0b', linewidth=2, label='Fraction |Xₙ|≥ε')
# Chebyshev bound: 1/(n·ε²) — since Var(Xₙ)=1/n
chebyshev = np.minimum(1.0, 1.0 / (ns * EPS**2))
ax2.plot(ns, chebyshev, color='#ef4444', linestyle='--', linewidth=1.5, label='Chebyshev bound')
ax2.set_xlabel('n', color='#94a3b8'); ax2.set_ylabel('P(|Xₙ|≥ε)', color='#94a3b8')
ax2.tick_params(colors='#94a3b8')
ax2.set_title(f'Fraction of paths outside ε={EPS} band', color='white')
ax2.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')

plt.tight_layout(); plt.show()`,
    },
    {
      id: 'ch4-convp-lab-2',
      title: 'WLLN — Running Sample Mean',
      description: 'Demonstrate the Weak Law of Large Numbers for i.i.d. Cauchy-distributed samples (which have no mean) vs Exponential(1) samples (finite mean). Visualise how the running mean behaves for each.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(42)
N = 2000
ns = np.arange(1, N + 1)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
fig.patch.set_facecolor('#0f172a')

for ax, dist, title, mu_theory in zip(
    axes,
    ['exp', 'cauchy'],
    ['Exponential(1) — WLLN holds (μ=1)', 'Cauchy — WLLN fails (no finite mean)'],
    [1.0, None]
):
    ax.set_facecolor('#1e293b')
    for seed in range(5):
        np.random.seed(seed * 11)
        if dist == 'exp':
            x = np.random.exponential(1, N)
        else:
            x = np.random.standard_cauchy(N)
        running_mean = np.cumsum(x) / ns
        # Clip Cauchy display so it's visible
        running_mean_clipped = np.clip(running_mean, -20, 20)
        ax.plot(ns, running_mean_clipped, alpha=0.7, linewidth=1.2)
    if mu_theory is not None:
        ax.axhline(mu_theory, color='white', linestyle='--', linewidth=1.5, label=f'μ = {mu_theory}')
    ax.set_xlabel('n', color='#94a3b8'); ax.set_ylabel('Running Mean X̄ₙ', color='#94a3b8')
    ax.tick_params(colors='#94a3b8')
    ax.set_title(title, color='white', fontsize=10)
    if mu_theory:
        ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')

plt.suptitle('Running Sample Mean: WLLN holds iff E[X] is finite', color='white', fontsize=11)
plt.tight_layout(); plt.show()`,
    },
  ],

  'convergence-probability-1': [
    {
      id: 'ch4-slln-lab-1',
      title: 'Strong LLN — All Paths Converge',
      description: 'Simulate 20 independent running-average paths for N(0,1) samples. Unlike in-probability convergence, every single path visually converges to μ = 0 once n is large enough, illustrating the almost-sure nature of the SLLN.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(123)
N = 500
N_PATHS = 20
ns = np.arange(1, N + 1)

fig, ax = plt.subplots(figsize=(10, 5))
fig.patch.set_facecolor('#0f172a')
ax.set_facecolor('#1e293b')

for i in range(N_PATHS):
    z = np.random.standard_normal(N)
    running_mean = np.cumsum(z) / ns
    ax.plot(ns, running_mean, alpha=0.55, linewidth=1.2)

ax.axhline(0, color='white', linestyle='--', linewidth=2, label='μ = 0')
# ε band
EPS = 0.15
ax.axhline(EPS,  color='#10b981', linestyle=':', linewidth=1.5, label=f'±ε = {EPS}')
ax.axhline(-EPS, color='#10b981', linestyle=':', linewidth=1.5)
ax.fill_between(ns, -EPS, EPS, alpha=0.07, color='#10b981')

ax.set_xlabel('n', color='#94a3b8', fontsize=12)
ax.set_ylabel('X̄ₙ', color='#94a3b8', fontsize=12)
ax.tick_params(colors='#94a3b8')
ax.set_title('Strong LLN: all 20 running averages of N(0,1) converge to 0', color='white', fontsize=12)
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')
plt.tight_layout(); plt.show()

# Count how many paths are inside the ε-band for n ≥ 400
paths = []
for i in range(N_PATHS):
    np.random.seed(i * 7 + 3)
    z = np.random.standard_normal(N)
    running_mean = np.cumsum(z) / ns
    paths.append(running_mean)
paths = np.array(paths)
inside_after400 = (np.abs(paths[:, 399:]) < EPS).all(axis=1).mean()
print(f"Fraction of paths permanently inside ε={EPS} band for n≥400: {inside_after400:.0%}")`,
    },
    {
      id: 'ch4-slln-lab-2',
      title: 'A.S. vs In-Probability: a Constructed Example',
      description: 'Construct the classic "moving bump" sequence where Xₙ → 0 in probability but not almost surely. Compare it to Xₙ = Zₙ/n which converges a.s. Plot empirical fractions outside a ε-band.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(99)
N = 1000
N_PATHS = 500
ns = np.arange(1, N + 1)
EPS = 0.4

# Sequence 1: Xₙ = Z_n / sqrt(n) — converges in prob but NOT a.s.
# (individual paths oscillate indefinitely, just with decreasing probability)
# Sequence 2: Xₙ = Z_n / n — converges a.s. (since Σ1/n² < ∞ by Borel-Cantelli)

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
fig.patch.set_facecolor('#0f172a')

sequences = {
    'In-prob only: Zₙ/√n': lambda z: z / np.sqrt(ns),
    'Almost sure: Zₙ/n':   lambda z: z / ns,
}

for ax, (title, seq_fn) in zip(axes, sequences.items()):
    ax.set_facecolor('#1e293b')
    outside_frac = np.zeros(N)
    for i in range(N_PATHS):
        z = np.random.standard_normal(N)
        x = seq_fn(z)
        outside_frac += (np.abs(x) >= EPS)
        if i < 5:
            ax.plot(ns, np.clip(x, -2, 2), alpha=0.5, linewidth=0.8)
    outside_frac /= N_PATHS
    ax.plot(ns, outside_frac, color='#ef4444', linewidth=2, label=f'P(|Xₙ|≥{EPS})')
    ax.axhline(0, color='#10b981', linestyle='--', linewidth=1.5, label='→ 0')
    ax.set_title(title, color='white', fontsize=10)
    ax.set_xlabel('n', color='#94a3b8'); ax.set_ylabel('Fraction outside ε-band', color='#94a3b8')
    ax.tick_params(colors='#94a3b8')
    ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=8)

plt.suptitle('Convergence in Probability vs Almost Sure', color='white', fontsize=11)
plt.tight_layout(); plt.show()`,
    },
  ],

  'convergence-distribution': [
    {
      id: 'ch4-clt-lab-1',
      title: 'Central Limit Theorem — Multiple Distributions',
      description: 'Demonstrate the CLT starting from three very different parent distributions: Exponential, Bernoulli, and a bimodal mixture. Show that, regardless of the parent shape, the standardised sample mean converges to N(0,1).',
      code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

np.random.seed(0)
N_SIM = 5000
n = 30

distributions = {
    'Exponential(1) μ=1, σ²=1': {
        'sample': lambda: np.random.exponential(1, (N_SIM, n)),
        'mu': 1.0, 'sigma': 1.0,
    },
    'Bernoulli(0.3) μ=0.3, σ²=0.21': {
        'sample': lambda: (np.random.uniform(0,1,(N_SIM,n)) < 0.3).astype(float),
        'mu': 0.3, 'sigma': np.sqrt(0.3*0.7),
    },
    'Bimodal mixture μ=0, σ²=1': {
        'sample': lambda: np.where(
            np.random.uniform(0,1,(N_SIM,n)) < 0.5,
            np.random.normal(-2, 0.5, (N_SIM,n)),
            np.random.normal( 2, 0.5, (N_SIM,n))
        ),
        'mu': 0.0, 'sigma': np.sqrt(4 + 0.25),
    },
}

fig, axes = plt.subplots(1, 3, figsize=(13, 4))
fig.patch.set_facecolor('#0f172a')

for ax, (title, cfg) in zip(axes, distributions.items()):
    ax.set_facecolor('#1e293b')
    samples = cfg['sample']()
    means = samples.mean(axis=1)
    sigma_xbar = cfg['sigma'] / np.sqrt(n)
    Z = (means - cfg['mu']) / sigma_xbar

    ax.hist(Z, bins=40, density=True, color='#3b82f6', alpha=0.7, label='Simulated Zₙ')
    x = np.linspace(-4, 4, 200)
    ax.plot(x, norm.pdf(x), color='#10b981', linewidth=2.5, label='N(0,1)')
    ax.set_title(title, color='white', fontsize=9)
    ax.set_xlabel('Zₙ', color='#94a3b8')
    ax.tick_params(colors='#94a3b8')
    ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=7)

plt.suptitle(f'CLT with n={n}: three very different parent distributions', color='white', fontsize=12)
plt.tight_layout(); plt.show()`,
    },
    {
      id: 'ch4-clt-lab-2',
      title: 'CLT Accuracy vs Sample Size',
      description: 'Quantify how well the CLT Normal approximation fits the actual distribution of X̄ₙ for n = 1, 5, 15, 50. Use a Q-Q plot to visualise normality as n grows.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from scipy import stats

np.random.seed(42)
N_SIM = 3000
ns = [1, 5, 15, 50]

fig, axes = plt.subplots(2, 4, figsize=(14, 7))
fig.patch.set_facecolor('#0f172a')

for col, n in enumerate(ns):
    samples = np.random.exponential(1, (N_SIM, n))
    means   = samples.mean(axis=1)
    sigma_xbar = 1.0 / np.sqrt(n)
    Z = (means - 1.0) / sigma_xbar

    # Top row: histogram
    ax_hist = axes[0, col]
    ax_hist.set_facecolor('#1e293b')
    ax_hist.hist(Z, bins=35, density=True, color='#3b82f6', alpha=0.75)
    x = np.linspace(-4, 4, 200)
    ax_hist.plot(x, stats.norm.pdf(x), color='#10b981', linewidth=2)
    ax_hist.set_title(f'n={n}', color='white')
    ax_hist.tick_params(colors='#94a3b8')
    ax_hist.set_xlabel('Zₙ', color='#94a3b8')

    # Bottom row: Q-Q plot
    ax_qq = axes[1, col]
    ax_qq.set_facecolor('#1e293b')
    (osm, osr), (slope, intercept, r) = stats.probplot(Z, dist='norm')
    ax_qq.scatter(osm, osr, alpha=0.3, s=4, color='#f59e0b')
    ax_qq.plot([-3,3], [-3,3], color='#ef4444', linewidth=1.5)
    ax_qq.set_title(f'Q-Q n={n}, R²={r**2:.3f}', color='white', fontsize=9)
    ax_qq.tick_params(colors='#94a3b8')
    ax_qq.set_xlabel('Theoretical', color='#94a3b8')
    ax_qq.set_ylabel('Sample', color='#94a3b8')

plt.suptitle('CLT accuracy vs n — Exponential(1) source', color='white', fontsize=12)
plt.tight_layout(); plt.show()`,
    },
  ],

  'monte-carlo-approx': [
    {
      id: 'ch4-mc-lab-1',
      title: 'Monte Carlo π Estimation',
      description: 'Estimate π using the dart-board method for increasing N. Plot the estimate vs N and show the 1/√N convergence of the error.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(21)
Ns = np.logspace(1, 5, 50).astype(int)  # 10 to 100,000

estimates = []
errors    = []
for N in Ns:
    x, y = np.random.uniform(0, 1, N), np.random.uniform(0, 1, N)
    inside = (x**2 + y**2 <= 1).sum()
    pi_est = 4 * inside / N
    estimates.append(pi_est)
    errors.append(abs(pi_est - np.pi))

fig, axes = plt.subplots(1, 2, figsize=(12, 4))
fig.patch.set_facecolor('#0f172a')

ax = axes[0]
ax.set_facecolor('#1e293b')
ax.semilogx(Ns, estimates, color='#3b82f6', linewidth=1.5, label='π̂')
ax.axhline(np.pi, color='#ef4444', linestyle='--', linewidth=2, label=f'True π = {np.pi:.5f}')
ax.set_xlabel('N (log scale)', color='#94a3b8')
ax.set_ylabel('Estimate of π', color='#94a3b8')
ax.tick_params(colors='#94a3b8')
ax.set_title('MC π estimate vs N', color='white')
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')

ax2 = axes[1]
ax2.set_facecolor('#1e293b')
ax2.loglog(Ns, errors, color='#f59e0b', linewidth=1.5, label='|π̂ − π|')
theory = 1.5 / np.sqrt(Ns)
ax2.loglog(Ns, theory, color='#10b981', linestyle='--', linewidth=2, label='1.5/√N')
ax2.set_xlabel('N (log scale)', color='#94a3b8')
ax2.set_ylabel('Absolute error (log scale)', color='#94a3b8')
ax2.tick_params(colors='#94a3b8')
ax2.set_title('MC error — log-log shows 1/√N rate', color='white')
ax2.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')

plt.tight_layout(); plt.show()
print(f"At N=100,000: π̂ = {estimates[-1]:.6f}, error = {errors[-1]:.6f}")`,
    },
    {
      id: 'ch4-mc-lab-2',
      title: 'Monte Carlo Integration — General Functions',
      description: 'Use Monte Carlo to estimate several definite integrals and compare with exact values. Visualise the convergence and compute the empirical standard error.',
      code: `import numpy as np
import matplotlib.pyplot as plt

np.random.seed(55)

integrals = [
    ('∫₀¹ x² dx',        lambda x: x**2,          0,1,  1/3),
    ('∫₀¹ eˣ dx',         lambda x: np.exp(x),     0,1,  np.e - 1),
    ('∫₀π sin(x) dx',     lambda x: np.sin(x),     0,np.pi, 2.0),
    ('∫₀¹ 4√(1-x²) dx',  lambda x: 4*np.sqrt(np.maximum(0,1-x**2)), 0,1, np.pi),
]

Ns = np.logspace(1.5, 5, 40).astype(int)

fig, axes = plt.subplots(2, 4, figsize=(14, 6))
fig.patch.set_facecolor('#0f172a')

for col, (label, f, a, b, exact) in enumerate(integrals):
    ests, errs = [], []
    for N in Ns:
        u = np.random.uniform(a, b, N)
        est = (b - a) * f(u).mean()
        ests.append(est)
        errs.append(abs(est - exact))

    ax = axes[0, col]; ax.set_facecolor('#1e293b')
    ax.semilogx(Ns, ests, color='#3b82f6', linewidth=1.5)
    ax.axhline(exact, color='#ef4444', linestyle='--', linewidth=1.5, label=f'True={exact:.4f}')
    ax.set_title(label, color='white', fontsize=9)
    ax.tick_params(colors='#94a3b8'); ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=7)

    ax2 = axes[1, col]; ax2.set_facecolor('#1e293b')
    ax2.loglog(Ns, errs, color='#f59e0b', linewidth=1.5, label='Error')
    ax2.loglog(Ns, 1/np.sqrt(Ns), color='#10b981', linestyle='--', linewidth=1.5, label='1/√N')
    ax2.tick_params(colors='#94a3b8'); ax2.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=7)

plt.suptitle('Monte Carlo Integration — four functions, 1/√N error rate', color='white', fontsize=11)
plt.tight_layout(); plt.show()`,
    },
  ],

  'normal-distribution-theory': [
    {
      id: 'ch4-normth-lab-1',
      title: 'Chi-Squared and t-Distributions',
      description: 'Simulate chi-squared and t random variables from Normal draws, verify their distributions against theoretical PDFs, and explore how the t-distribution converges to N(0,1) as df increases.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import chi2, t as t_dist, norm

np.random.seed(7)
N = 50_000

fig, axes = plt.subplots(1, 3, figsize=(13, 4))
fig.patch.set_facecolor('#0f172a')

# Panel 1: χ²(k) for several k values
ax = axes[0]; ax.set_facecolor('#1e293b')
for k, color in [(1,'#ef4444'),(2,'#f59e0b'),(3,'#3b82f6'),(5,'#10b981'),(10,'#8b5cf6')]:
    z = np.random.standard_normal((N, k))
    v = (z**2).sum(axis=1)
    ax.hist(v, bins=60, density=True, histtype='step', linewidth=1.5, color=color, label=f'k={k}')
x = np.linspace(0, 25, 300)
for k, color in [(1,'#ef4444'),(3,'#3b82f6'),(10,'#8b5cf6')]:
    ax.plot(x, chi2.pdf(x, k), '--', color=color, linewidth=1.5, alpha=0.8)
ax.set_xlim(0, 25); ax.set_ylim(0, 0.5)
ax.set_title('χ²(k) — sum of k Normal squares', color='white')
ax.tick_params(colors='#94a3b8'); ax.set_xlabel('x', color='#94a3b8')
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=8)

# Panel 2: t(df) vs N(0,1) for several df
ax2 = axes[1]; ax2.set_facecolor('#1e293b')
x = np.linspace(-5, 5, 300)
for df, color in [(1,'#ef4444'),(3,'#f59e0b'),(10,'#3b82f6'),(30,'#10b981')]:
    ax2.plot(x, t_dist.pdf(x, df), color=color, linewidth=1.8, label=f'df={df}')
ax2.plot(x, norm.pdf(x), '--', color='white', linewidth=2, label='N(0,1)')
ax2.set_title('t(df) → N(0,1) as df → ∞', color='white')
ax2.tick_params(colors='#94a3b8'); ax2.set_xlabel('x', color='#94a3b8')
ax2.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=8)

# Panel 3: t tail probability vs Normal
ax3 = axes[2]; ax3.set_facecolor('#1e293b')
dfs = [1, 2, 3, 5, 10, 20, 50, 100]
tail_t = [2 * t_dist.sf(2, df) for df in dfs]
ax3.plot(dfs, tail_t, 'o-', color='#3b82f6', linewidth=2, label='P(|T|>2) for t(df)')
ax3.axhline(2 * norm.sf(2), color='#ef4444', linestyle='--', linewidth=1.5, label='P(|Z|>2) Normal')
ax3.set_xlabel('Degrees of freedom', color='#94a3b8'); ax3.set_ylabel('Tail probability', color='#94a3b8')
ax3.tick_params(colors='#94a3b8')
ax3.set_title('Heavier tails: P(|T|>2) vs df', color='white')
ax3.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=8)

plt.tight_layout(); plt.show()
print(f"t(1) P(|T|>2) = {2*t_dist.sf(2,1):.4f}")
print(f"t(10) P(|T|>2) = {2*t_dist.sf(2,10):.4f}")
print(f"N(0,1) P(|Z|>2) = {2*norm.sf(2):.4f}")`,
    },
    {
      id: 'ch4-normth-lab-2',
      title: 'Linear Combinations of Independent Normals',
      description: 'Verify empirically that X + Y ~ N(μ₁+μ₂, σ₁²+σ₂²) for independent normals, and explore the distribution of aX + bY for general constants a, b.',
      code: `import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm

np.random.seed(3)
N = 100_000

# Three scenarios: (μ₁,σ₁,μ₂,σ₂,a,b)
scenarios = [
    (0,  1, 0,  1, 1, 1,  'X+Y, both N(0,1)'),
    (2,  1, 3,  2, 1, 1,  'X+Y, N(2,1)+N(3,4)'),
    (0,  1, 0,  1, 2, -1, '2X-Y, both N(0,1)'),
]

fig, axes = plt.subplots(1, 3, figsize=(13, 4))
fig.patch.set_facecolor('#0f172a')

for ax, (mu1, s1, mu2, s2, a, b, title) in zip(axes, scenarios):
    ax.set_facecolor('#1e293b')
    X = np.random.normal(mu1, s1, N)
    Y = np.random.normal(mu2, s2, N)
    Z = a*X + b*Y

    # Theoretical parameters
    mu_z  = a*mu1 + b*mu2
    var_z = (a*s1)**2 + (b*s2)**2
    sig_z = np.sqrt(var_z)

    ax.hist(Z, bins=60, density=True, color='#3b82f6', alpha=0.7, label='Simulated')
    x = np.linspace(mu_z - 4*sig_z, mu_z + 4*sig_z, 300)
    ax.plot(x, norm.pdf(x, mu_z, sig_z), color='#ef4444', linewidth=2.5,
            label=f'N({mu_z:.1f},{var_z:.1f})')
    ax.set_title(title, color='white', fontsize=9)
    ax.set_xlabel('Value', color='#94a3b8')
    ax.tick_params(colors='#94a3b8')
    ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=8)
    print(f"{title}: sim μ={Z.mean():.3f} (theory {mu_z:.3f}), sim σ={Z.std():.3f} (theory {sig_z:.3f})")

plt.suptitle('Linear combinations of independent Normals remain Normal', color='white', fontsize=11)
plt.tight_layout(); plt.show()`,
    },
  ],

  // ── Chapter 5: Statistical Inference ──────────────────────────────────────

  'why-statistics': [
    {
      id: 'ch5-why-lab-1',
      title: 'Simulating the Heart Transplant Study',
      description: 'Simulate two groups (control and treatment) from different distributions and compare their sample means — illustrating why statistics is needed.',
      code:
`import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
import math

rng = np.random.default_rng(42)

# Control group: Exp(1/200) -> mean ~200 days
# Treatment group: Exp(1/400) -> mean ~400 days
# Using exponential parameterised by scale (mean)
n_ctrl = 30
n_trt  = 52
ctrl   = rng.exponential(scale=180, size=n_ctrl)
trt    = rng.exponential(scale=380, size=n_trt)

fig, axes = plt.subplots(1, 2, figsize=(9, 4), facecolor='#0f172a')

def hist_plot(ax, data, color, label, binw=100):
    bins = np.arange(0, max(data)+binw, binw)
    ax.hist(data, bins=bins, density=True, color=color, alpha=0.75, edgecolor='#0f172a')
    ax.axvline(np.mean(data), color='white', lw=2, ls='--',
               label=f'Mean={np.mean(data):.0f}')
    ax.axvline(np.median(data), color='yellow', lw=1.5, ls=':',
               label=f'Median={np.median(data):.0f}')
    ax.set_facecolor('#1e293b')
    ax.set_title(label, color='white')
    ax.tick_params(colors='#94a3b8')
    ax.set_xlabel('Survival time (days)', color='#94a3b8')
    ax.set_ylabel('Density', color='#94a3b8')
    ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')
    for sp in ax.spines.values(): sp.set_edgecolor('#334155')

hist_plot(axes[0], ctrl, '#22d3ee', f'Control (n={n_ctrl})')
hist_plot(axes[1], trt,  '#f59e0b', f'Treatment (n={n_trt})')

print(f"Control   mean={np.mean(ctrl):.1f}  median={np.median(ctrl):.1f}  n={n_ctrl}")
print(f"Treatment mean={np.mean(trt):.1f}  median={np.median(trt):.1f}  n={n_trt}")
print(f"\\nDifference in means: {np.mean(trt)-np.mean(ctrl):.1f} days")
print("Is this difference statistically significant? That is the question of inference!")

plt.suptitle('Why Statistics? Two Groups, Unknown Distributions', color='white', fontsize=11)
plt.tight_layout()
plt.show()`,
    },
    {
      id: 'ch5-why-lab-2',
      title: 'Uncertainty About μ: Likelihood Surface',
      description: 'For data from N(μ,1) with unknown μ, plot the likelihood L(μ) and see how it peaks near the true value.',
      code:
`import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

rng  = np.random.default_rng(7)
MU_TRUE = 2.5
data = rng.normal(MU_TRUE, 1.0, size=16)
print(f"Data: {np.round(data,2)}")
print(f"Sample mean x-bar = {np.mean(data):.3f}  (true mu = {MU_TRUE})")

mu_grid = np.linspace(-1, 6, 400)
log_L = np.array([
    -0.5 * np.sum((data - mu)**2)   # log likelihood up to a constant
    for mu in mu_grid
])
L = np.exp(log_L - log_L.max())  # normalise for plotting

fig, ax = plt.subplots(figsize=(7, 4), facecolor='#0f172a')
ax.set_facecolor('#1e293b')
ax.plot(mu_grid, L, color='#7c6af7', lw=2, label='Likelihood L(mu | data)')
ax.axvline(np.mean(data), color='#22d3ee', lw=2, ls='--', label=f'x-bar = {np.mean(data):.3f}')
ax.axvline(MU_TRUE,       color='#4ade80', lw=2, ls=':',  label=f'True mu = {MU_TRUE}')
ax.set_xlabel('mu', color='#94a3b8')
ax.set_ylabel('Relative likelihood', color='#94a3b8')
ax.set_title('Likelihood function: L(mu) peaks at the sample mean', color='white')
ax.tick_params(colors='#94a3b8')
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')
for sp in ax.spines.values(): sp.set_edgecolor('#334155')

plt.tight_layout()
plt.show()`,
    },
  ],

  'inference-probability-model': [
    {
      id: 'ch5-inf-lab-1',
      title: 'Credible Intervals for Exponential(1)',
      description: 'Visualise prediction, 95% credible interval, and hypothesis assessment for X ~ Exp(1) — the three inference tasks.',
      code:
`import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

lam = 1.0
xs  = np.linspace(0, 8, 400)
pdf = lam * np.exp(-lam * xs)

c90 = -np.log(0.10)   # 90% CI: P(X<=c) = 0.90
c95 = -np.log(0.05)   # 95% CI
x0  = 5.0
tail_p = np.exp(-lam * x0)

fig, axes = plt.subplots(1, 3, figsize=(11, 4), facecolor='#0f172a')
titles = ['Prediction (mean)', '95% Credible Interval', f'Assess x0={x0}']
colors = ['#4ade80', '#7c6af7', '#f59e0b']

for ax, title, color in zip(axes, titles, colors):
    ax.set_facecolor('#1e293b')
    ax.plot(xs, pdf, color='#22d3ee', lw=2)
    ax.set_title(title, color='white', fontsize=10)
    ax.tick_params(colors='#94a3b8')
    ax.set_xlabel('x', color='#94a3b8')
    for sp in ax.spines.values(): sp.set_edgecolor('#334155')

# Prediction
axes[0].axvline(1/lam, color='#4ade80', lw=2, ls='--', label=f'E(X)=1')
axes[0].legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')

# 95% CI
xs_fill = xs[xs <= c95]
axes[1].fill_between(xs_fill, lam*np.exp(-lam*xs_fill), alpha=0.35, color='#7c6af7')
axes[1].axvline(c95, color='#7c6af7', lw=2, ls='--', label=f'c={c95:.3f}')
axes[1].legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')

# Tail
xs_tail = xs[xs >= x0]
axes[2].fill_between(xs_tail, lam*np.exp(-lam*xs_tail), alpha=0.45, color='#f59e0b')
axes[2].axvline(x0, color='#f59e0b', lw=2, ls='--', label=f'P(X>5)={tail_p:.4f}')
axes[2].legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')

print(f"Prediction:  E(X) = {1/lam:.1f} year")
print(f"95% CI:      (0, {c95:.4f})")
print(f"P(X > {x0}): {tail_p:.6f}  -> {'IMPLAUSIBLE' if tail_p < 0.05 else 'plausible'}")

plt.suptitle('Three Inference Tasks: Exp(1) Machine Lifelength', color='white', fontsize=11)
plt.tight_layout()
plt.show()`,
    },
    {
      id: 'ch5-inf-lab-2',
      title: 'Conditional Inference and Memorylessness',
      description: 'Compare unconditional vs conditional inference for Exp(1), illustrating the memoryless property and the principle of conditional probability.',
      code:
`import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

lam  = 1.0
t    = 1.0    # machine has already run t years
c95u = -np.log(0.05)            # unconditional 95% upper bound
c95c = t - np.log(0.05*np.exp(-lam*t)) / (-lam)  # conditional

xs = np.linspace(0, 8, 400)
pdf_uncond = lam * np.exp(-lam * xs)
# Conditional pdf given X > t: f(x|X>t) = lam*exp(-lam*(x-t)) for x>t
pdf_cond = np.where(xs > t, lam * np.exp(-lam*(xs - t)), 0)

fig, axes = plt.subplots(1, 2, figsize=(9, 4), facecolor='#0f172a')

for ax, pdf, label, col, ci in [
        (axes[0], pdf_uncond, 'Unconditional f(x)', '#22d3ee', c95u),
        (axes[1], pdf_cond,   f'Conditional f(x|X>{t})', '#f59e0b', c95c)]:
    ax.set_facecolor('#1e293b')
    ax.plot(xs, pdf, color=col, lw=2, label=label)
    xs_fill = xs[(xs <= ci) & (xs >= (0 if col=='#22d3ee' else t))]
    pdf_fill = lam*np.exp(-lam*xs_fill) if col=='#22d3ee' else lam*np.exp(-lam*(xs_fill-t))
    ax.fill_between(xs_fill, pdf_fill, alpha=0.3, color=col)
    ax.axvline(ci, color='white', lw=1.5, ls='--', label=f'95% upper={ci:.3f}')
    ax.set_title(label, color='white', fontsize=10)
    ax.tick_params(colors='#94a3b8')
    ax.set_xlabel('x', color='#94a3b8')
    ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=8)
    for sp in ax.spines.values(): sp.set_edgecolor('#334155')

# Conditional mean
cond_mean = t + 1/lam
tail_cond = np.exp(-lam * (5 - t))
print(f"Unconditional: E(X) = {1/lam:.1f},  95% CI upper = {c95u:.4f}")
print(f"Conditional (X>{t}): E(X|X>{t}) = {cond_mean:.1f},  95% CI upper = {c95c:.4f}")
print(f"P(X>5|X>1) = exp(-4) = {tail_cond:.4f}")
print(f"\\nMemoryless property: additional lifelength still Exp(1) regardless of age!")

plt.suptitle('Conditional vs Unconditional Inference for Exp(1)', color='white', fontsize=11)
plt.tight_layout()
plt.show()`,
    },
  ],

  'statistical-models': [
    {
      id: 'ch5-sm-lab-1',
      title: 'Bernoulli Model: Likelihood over Parameter Space',
      description: 'Visualise the likelihood function for the Bernoulli model and see how it identifies the true θ.',
      code:
`import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(99)
THETA_TRUE = 0.35
n = 20
data = rng.binomial(1, THETA_TRUE, size=n)
k = data.sum()
print(f"n={n}, number of successes k={k}, sample proportion tau_bar={k/n:.3f}")
print(f"True theta = {THETA_TRUE}")

theta_grid = np.linspace(0.001, 0.999, 400)
log_lik = k * np.log(theta_grid) + (n - k) * np.log(1 - theta_grid)
lik_norm = np.exp(log_lik - log_lik.max())
mle = k / n

fig, ax = plt.subplots(figsize=(7, 4), facecolor='#0f172a')
ax.set_facecolor('#1e293b')
ax.plot(theta_grid, lik_norm, color='#7c6af7', lw=2, label='L(theta | data)')
ax.axvline(mle,        color='#22d3ee', lw=2, ls='--', label=f'MLE = tau-bar = {mle:.3f}')
ax.axvline(THETA_TRUE, color='#4ade80', lw=2, ls=':',  label=f'True theta = {THETA_TRUE}')
ax.fill_between(theta_grid, lik_norm, where=(lik_norm >= np.exp(-0.5)),
                alpha=0.2, color='#7c6af7', label='Likelihood interval (exp(-0.5))')
ax.set_xlabel('theta (Bernoulli parameter)', color='#94a3b8')
ax.set_ylabel('Relative likelihood', color='#94a3b8')
ax.set_title(f'Bernoulli Model Likelihood (n={n}, k={k})', color='white')
ax.tick_params(colors='#94a3b8')
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')
for sp in ax.spines.values(): sp.set_edgecolor('#334155')
plt.tight_layout()
plt.show()`,
    },
    {
      id: 'ch5-sm-lab-2',
      title: 'Normal Location-Scale Model: Two Competing Parameters',
      description: 'Given a sample from N(μ, σ²), visualise the likelihood surface over (μ, σ) and identify where the true parameters lie.',
      code:
`import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np

rng = np.random.default_rng(13)
MU_TRUE, SIG_TRUE = 3.0, 1.5
n = 25
data = rng.normal(MU_TRUE, SIG_TRUE, size=n)
xbar = data.mean()
s    = data.std(ddof=1)
print(f"True: mu={MU_TRUE}, sigma={SIG_TRUE}")
print(f"Sample: x-bar={xbar:.3f}, s={s:.3f}")

mu_g  = np.linspace(0, 6, 100)
sig_g = np.linspace(0.5, 3.5, 100)
MU, SIG = np.meshgrid(mu_g, sig_g)

def log_lik(mu, sig):
    return -n*np.log(sig) - 0.5*np.sum((data - mu)**2) / sig**2

logL = np.array([[log_lik(m, s_) for m in mu_g] for s_ in sig_g])
logL -= logL.max()

fig, ax = plt.subplots(figsize=(7, 5), facecolor='#0f172a')
ax.set_facecolor('#1e293b')
cp = ax.contourf(MU, SIG, logL, levels=20, cmap='magma')
plt.colorbar(cp, ax=ax, label='log-likelihood (relative)')
ax.plot(xbar, s, 'w*', ms=14, label=f'MLE (x-bar={xbar:.2f}, s={s:.2f})')
ax.plot(MU_TRUE, SIG_TRUE, 'g^', ms=10, label=f'True (mu={MU_TRUE}, sigma={SIG_TRUE})')
ax.set_xlabel('mu', color='#94a3b8')
ax.set_ylabel('sigma', color='#94a3b8')
ax.set_title('Log-Likelihood Surface for N(mu, sigma^2)', color='white')
ax.tick_params(colors='#94a3b8')
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155')
for sp in ax.spines.values(): sp.set_edgecolor('#334155')
plt.tight_layout()
plt.show()`,
    },
  ],

  'data-collection': [
    {
      id: 'ch5-dc-lab-1',
      title: 'Empirical CDF Convergence',
      description: 'Watch the empirical CDF F̂_X converge to the true CDF F_X as sample size n grows — a direct application of the WLLN.',
      code:
`import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

rng = np.random.default_rng(55)
sample_sizes = [10, 50, 200, 1000]
xs = np.linspace(-4, 4, 400)
true_cdf = stats.norm.cdf(xs)

fig, axes = plt.subplots(2, 2, figsize=(9, 7), facecolor='#0f172a')
axes = axes.ravel()

for ax, n in zip(axes, sample_sizes):
    sample = rng.normal(0, 1, size=n)
    # Empirical CDF
    xs_sorted = np.sort(sample)
    ecdf_y = np.arange(1, n+1) / n

    ax.set_facecolor('#1e293b')
    ax.step(xs_sorted, ecdf_y, color='#f59e0b', lw=1.5, where='post', label='Empirical CDF')
    ax.plot(xs, true_cdf, color='#22d3ee', lw=2, label='True N(0,1) CDF')

    # Max deviation (Kolmogorov-Smirnov statistic)
    ks_stat, _ = stats.kstest(sample, 'norm')

    ax.set_title(f'n = {n}  (KS stat = {ks_stat:.3f})', color='white')
    ax.tick_params(colors='#94a3b8')
    ax.set_xlabel('x', color='#94a3b8')
    ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=8)
    for sp in ax.spines.values(): sp.set_edgecolor('#334155')
    print(f"n={n:4d}: KS statistic = {ks_stat:.4f}  (smaller is better)")

plt.suptitle('Empirical CDF Convergence to True N(0,1) CDF', color='white', fontsize=12)
plt.tight_layout()
plt.show()`,
    },
    {
      id: 'ch5-dc-lab-2',
      title: 'Density Histograms: Effect of Bin Width',
      description: 'Demonstrate how the density histogram h_X approximates f_X as bin width shrinks — the bridge between discrete and continuous distributions.',
      code:
`import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

rng = np.random.default_rng(21)
N = 10000
data = rng.normal(0, 1, size=N)
xs = np.linspace(-5, 5, 400)
true_pdf = stats.norm.pdf(xs)

bin_widths = [2.0, 1.0, 0.5, 0.25]
fig, axes = plt.subplots(2, 2, figsize=(9, 7), facecolor='#0f172a')
axes = axes.ravel()

for ax, bw in zip(axes, bin_widths):
    bins = np.arange(-5, 5 + bw, bw)
    ax.set_facecolor('#1e293b')
    ax.hist(data, bins=bins, density=True, color='#7c6af7', alpha=0.7,
            edgecolor='#0f172a', label=f'h_X (bw={bw})')
    ax.plot(xs, true_pdf, color='#22d3ee', lw=2, label='f_X = N(0,1)')
    ax.set_title(f'Bin width = {bw}', color='white')
    ax.tick_params(colors='#94a3b8')
    ax.set_xlabel('x', color='#94a3b8')
    ax.set_ylabel('density', color='#94a3b8')
    ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=8)
    for sp in ax.spines.values(): sp.set_edgecolor('#334155')
    # Compute max deviation from true pdf at bin centres
    bcs = bins[:-1] + bw/2
    h_vals = np.histogram(data, bins=bins, density=True)[0]
    true_at_bcs = stats.norm.pdf(bcs)
    max_dev = np.max(np.abs(h_vals - true_at_bcs))
    print(f"Bin width {bw}: max |h_X - f_X| at bin centres = {max_dev:.4f}")

plt.suptitle(f'Density Histogram hX → fX as bin width shrinks (N={N})', color='white', fontsize=11)
plt.tight_layout()
plt.show()`,
    },
  ],

  'basic-inferences': [
    {
      id: 'ch5-bi-lab-1',
      title: 'Descriptive Statistics: Mean vs Median under Skew and Outliers',
      description: 'Compute and visualise descriptive statistics for samples from symmetric and skewed distributions, and see the effect of outliers.',
      code:
`import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

rng = np.random.default_rng(3)
n = 30

# Symmetric: Normal(0,1)
sym   = rng.normal(0, 1, n)
# Right-skewed: Exponential(1)
skew  = rng.exponential(1, n)
# With outlier: Normal(0,1) + one extreme value
outl  = np.append(rng.normal(0, 1, n-1), 15.0)

datasets = [('N(0,1) – Symmetric', sym, '#22d3ee'),
            ('Exp(1) – Right Skewed', skew, '#f59e0b'),
            ('N(0,1) + Outlier', outl, '#ef4444')]

fig, axes = plt.subplots(1, 3, figsize=(11, 4), facecolor='#0f172a')

for ax, (title, d, col) in zip(axes, datasets):
    mn, med = np.mean(d), np.median(d)
    q1, q3  = np.percentile(d, 25), np.percentile(d, 75)
    iqr     = q3 - q1
    ax.set_facecolor('#1e293b')
    ax.scatter(d, np.random.uniform(-0.15, 0.15, len(d)), color=col, alpha=0.6, s=20)
    ax.axvline(mn,  color='white', lw=2, ls='--', label=f'Mean={mn:.2f}')
    ax.axvline(med, color='yellow', lw=2, ls=':', label=f'Median={med:.2f}')
    ax.axvspan(q1, q3, alpha=0.15, color=col, label=f'IQR={iqr:.2f}')
    ax.set_title(title, color='white', fontsize=9)
    ax.set_yticks([])
    ax.tick_params(colors='#94a3b8')
    ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=7)
    for sp in ax.spines.values(): sp.set_edgecolor('#334155')
    print(f"{title}: mean={mn:.3f}, median={med:.3f}, IQR={iqr:.3f}, s={np.std(d,ddof=1):.3f}")

plt.suptitle('Mean vs Median: Symmetric, Skewed, and Outlier Contaminated', color='white', fontsize=11)
plt.tight_layout()
plt.show()`,
    },
    {
      id: 'ch5-bi-lab-2',
      title: 'Estimation, Confidence Intervals, and Hypothesis Testing',
      description: 'For a Normal location-scale model, demonstrate all three types of inference: point estimation, 95% confidence interval, and t-test.',
      code:
`import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
from scipy import stats

rng = np.random.default_rng(42)
MU_TRUE = 64.5
SIG_TRUE = 2.4
n  = 30
MU0 = 65.0  # hypothesised mean

data = rng.normal(MU_TRUE, SIG_TRUE, n)
xbar = data.mean()
s    = data.std(ddof=1)
se   = s / np.sqrt(n)
t_stat = (xbar - MU0) / se
ci_lo, ci_hi = stats.t.interval(0.95, df=n-1, loc=xbar, scale=se)

print(f"Sample: n={n}, x-bar={xbar:.3f}, s={s:.3f}")
print(f"\\n--- Estimation ---")
print(f"Point estimate of mu: {xbar:.3f}")
print(f"\\n--- 95% Confidence Interval ---")
print(f"CI = [{ci_lo:.3f}, {ci_hi:.3f}]  (half-width = {(ci_hi-ci_lo)/2:.3f})")
print(f"True mu = {MU_TRUE} is {'inside' if ci_lo <= MU_TRUE <= ci_hi else 'OUTSIDE'} the CI")
print(f"\\n--- Hypothesis Assessment (H0: mu={MU0}) ---")
print(f"t = ({xbar:.3f} - {MU0}) / ({s:.3f}/sqrt({n})) = {t_stat:.4f}")
p_val = 2 * stats.t.sf(abs(t_stat), df=n-1)
print(f"Two-sided p-value = {p_val:.4f}  -> H0 is {'NOT rejected' if p_val > 0.05 else 'REJECTED'}")

xs = np.linspace(MU0 - 5*se*5, MU0 + 5*se*5, 400)
pdf_h0 = stats.norm.pdf(xs, MU0, se)
fig, ax = plt.subplots(figsize=(8, 4), facecolor='#0f172a')
ax.set_facecolor('#1e293b')
ax.plot(xs, pdf_h0, color='#7c6af7', lw=2, label=f'Sampling dist of x-bar under H0: N({MU0}, ({se:.3f})^2)')
ax.axvline(xbar,  color='#22d3ee', lw=2, ls='--', label=f'Observed x-bar={xbar:.3f}')
ax.axvline(ci_lo, color='#4ade80', lw=1.5, ls=':', label=f'95% CI: [{ci_lo:.3f}, {ci_hi:.3f}]')
ax.axvline(ci_hi, color='#4ade80', lw=1.5, ls=':')
ax.axvline(MU0,   color='white', lw=1.5, ls='-', alpha=0.5, label=f'H0: mu={MU0}')
ax.fill_between(xs, pdf_h0, where=(xs <= ci_lo)|(xs >= ci_hi), alpha=0.25, color='#ef4444', label='5% rejection region')
ax.tick_params(colors='#94a3b8')
ax.set_xlabel('x-bar', color='#94a3b8')
ax.legend(facecolor='#1e293b', labelcolor='white', edgecolor='#334155', fontsize=8)
ax.set_title('Three Types of Inference for Normal Location-Scale Model', color='white')
for sp in ax.spines.values(): sp.set_edgecolor('#334155')
plt.tight_layout()
plt.show()`,
    },
  ],
};
