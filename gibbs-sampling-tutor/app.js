// Sample data and constants
const SAMPLE_DATA = [1.2, 1.4, -0.5, 0.3, 0.9, 2.3, 1.0, 0.1, 1.3, 1.9];
const SAMPLE_SIZE = SAMPLE_DATA.length;
const SAMPLE_MEAN = SAMPLE_DATA.reduce((sum, val) => sum + val, 0) / SAMPLE_SIZE;

// Initialize MathJax
window.addEventListener('load', () => {
    if (window.MathJax) {
        MathJax.typesetPromise().then(() => {
            console.log('MathJax loaded successfully');
        }).catch((err) => console.log('MathJax error:', err));
    }
});

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Update sample data display
    document.getElementById('sample-data').textContent = 
        '[' + SAMPLE_DATA.map(x => x.toFixed(1)).join(', ') + ']';
    
    // Initialize demo controls
    initializeDemoControls();
    
    // Initialize calculator
    initializeCalculator();
    
    // Initialize practice exercises
    initializePractice();
});

// Demo simulation functionality
let traceChart = null;
let simulationData = {
    mu: [],
    sigma2: [],
    iterations: 0
};

function initializeDemoControls() {
    const iterationsSlider = document.getElementById('iterations');
    const iterationsValue = document.getElementById('iterations-value');
    const runButton = document.getElementById('run-simulation');
    
    // Update iterations display
    iterationsSlider.addEventListener('input', function() {
        iterationsValue.textContent = this.value;
    });
    
    // Run simulation button
    runButton.addEventListener('click', runGibbsSimulation);
    
    // Initialize chart
    initializeChart();
}

function initializeChart() {
    const ctx = document.getElementById('trace-chart').getContext('2d');
    
    traceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'μ (Mean)',
                    data: [],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                },
                {
                    label: 'σ² (Variance)',
                    data: [],
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Iteration'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Parameter Value'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Gibbs Sampling: Parameter Evolution'
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            animation: {
                duration: 0
            }
        }
    });
}

function runGibbsSimulation() {
    const iterations = parseInt(document.getElementById('iterations').value);
    const mu0 = parseFloat(document.getElementById('mu0').value);
    const sig0 = parseFloat(document.getElementById('sig0').value);
    const nu0 = parseFloat(document.getElementById('nu0').value);
    const beta0 = parseFloat(document.getElementById('beta0').value);
    
    // Reset simulation data
    simulationData = {
        mu: [],
        sigma2: [],
        iterations: iterations
    };
    
    // Initial values
    let mu = mu0;
    let sigma2 = 1.0;
    
    // Add initial values
    simulationData.mu.push(mu);
    simulationData.sigma2.push(sigma2);
    
    // Run Gibbs sampling
    for (let i = 1; i <= iterations; i++) {
        // Sample mu | sigma2, y
        const mu_precision = SAMPLE_SIZE / sigma2 + 1 / sig0;
        const mu_mean = (SAMPLE_SIZE * SAMPLE_MEAN / sigma2 + mu0 / sig0) / mu_precision;
        const mu_variance = 1 / mu_precision;
        
        mu = sampleNormal(mu_mean, mu_variance);
        
        // Sample sigma2 | mu, y
        const sum_squared_residuals = SAMPLE_DATA.reduce((sum, y) => sum + Math.pow(y - mu, 2), 0);
        const alpha = nu0 + SAMPLE_SIZE / 2;
        const beta = beta0 + sum_squared_residuals / 2;
        
        sigma2 = sampleInverseGamma(alpha, beta);
        
        // Store values
        simulationData.mu.push(mu);
        simulationData.sigma2.push(sigma2);
    }
    
    // Update chart
    updateChart();
    
    // Update statistics
    updateStatistics();
    
    console.log('Simulation completed with', iterations, 'iterations');
}

function sampleNormal(mean, variance) {
    // Box-Muller transform
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + Math.sqrt(variance) * z0;
}

function sampleInverseGamma(alpha, beta) {
    // Sample from Gamma(alpha, 1/beta) then take reciprocal
    const gamma_sample = sampleGamma(alpha, 1/beta);
    return 1 / gamma_sample;
}

function sampleGamma(shape, scale) {
    // Marsaglia and Tsang method for Gamma sampling
    if (shape < 1) {
        return sampleGamma(shape + 1, scale) * Math.pow(Math.random(), 1/shape);
    }
    
    const d = shape - 1/3;
    const c = 1 / Math.sqrt(9 * d);
    
    while (true) {
        let x, v;
        do {
            x = sampleNormal(0, 1);
            v = 1 + c * x;
        } while (v <= 0);
        
        v = v * v * v;
        const u = Math.random();
        
        if (u < 1 - 0.0331 * x * x * x * x) {
            return d * v * scale;
        }
        
        if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
            return d * v * scale;
        }
    }
}

function updateChart() {
    const labels = Array.from({length: simulationData.mu.length}, (_, i) => i);
    
    traceChart.data.labels = labels;
    traceChart.data.datasets[0].data = simulationData.mu;
    traceChart.data.datasets[1].data = simulationData.sigma2;
    
    traceChart.update();
}

function updateStatistics() {
    const burnIn = Math.floor(simulationData.iterations * 0.2); // 20% burn-in
    const mu_samples = simulationData.mu.slice(burnIn);
    const sigma2_samples = simulationData.sigma2.slice(burnIn);
    
    const mu_mean = mu_samples.reduce((sum, val) => sum + val, 0) / mu_samples.length;
    const mu_var = mu_samples.reduce((sum, val) => sum + Math.pow(val - mu_mean, 2), 0) / (mu_samples.length - 1);
    
    const sigma2_mean = sigma2_samples.reduce((sum, val) => sum + val, 0) / sigma2_samples.length;
    const sigma2_var = sigma2_samples.reduce((sum, val) => sum + Math.pow(val - sigma2_mean, 2), 0) / (sigma2_samples.length - 1);
    
    const statsOutput = document.getElementById('stats-output');
    statsOutput.innerHTML = `
        <div class="stats-grid">
            <div class="stat-item">
                <span class="stat-value">${mu_mean.toFixed(3)}</span>
                <div class="stat-label">μ Posterior Mean</div>
            </div>
            <div class="stat-item">
                <span class="stat-value">${Math.sqrt(mu_var).toFixed(3)}</span>
                <div class="stat-label">μ Posterior SD</div>
            </div>
            <div class="stat-item">
                <span class="stat-value">${sigma2_mean.toFixed(3)}</span>
                <div class="stat-label">σ² Posterior Mean</div>
            </div>
            <div class="stat-item">
                <span class="stat-value">${Math.sqrt(sigma2_var).toFixed(3)}</span>
                <div class="stat-label">σ² Posterior SD</div>
            </div>
        </div>
        <p><strong>Effective Sample Size:</strong> ${mu_samples.length} (after ${burnIn} burn-in)</p>
        <p><strong>Acceptance Rate:</strong> 100% (Gibbs sampling)</p>
    `;
}

// Calculator functionality
function initializeCalculator() {
    const calculateButton = document.getElementById('calculate-step');
    calculateButton.addEventListener('click', calculateNextStep);
}

function calculateNextStep() {
    const currentSig2 = parseFloat(document.getElementById('calc-sig2').value);
    const currentMu = parseFloat(document.getElementById('calc-mu').value);
    
    // Prior parameters (using defaults from demo)
    const mu0 = 0.0;
    const sig0 = 1.0;
    const nu0 = 1.0;
    const beta0 = 1.0;
    
    // Calculate full conditional for mu
    const mu_precision = SAMPLE_SIZE / currentSig2 + 1 / sig0;
    const mu_mean = (SAMPLE_SIZE * SAMPLE_MEAN / currentSig2 + mu0 / sig0) / mu_precision;
    const mu_variance = 1 / mu_precision;
    
    // Calculate full conditional for sigma2
    const sum_squared_residuals = SAMPLE_DATA.reduce((sum, y) => sum + Math.pow(y - currentMu, 2), 0);
    const alpha = nu0 + SAMPLE_SIZE / 2;
    const beta = beta0 + sum_squared_residuals / 2;
    
    const resultsDiv = document.getElementById('calculation-results');
    resultsDiv.innerHTML = `
        <h4>Step-by-Step Calculation Results</h4>
        
        <div class="calc-step">
            <h5>Step 1: Calculate μ | σ² = ${currentSig2.toFixed(2)}</h5>
            <p><strong>Precision:</strong> τ = n/σ² + 1/σ₀² = ${SAMPLE_SIZE}/${currentSig2.toFixed(2)} + 1/${sig0} = ${mu_precision.toFixed(4)}</p>
            <p><strong>Mean:</strong> μ* = (nȳ/σ² + μ₀/σ₀²)/τ = (${SAMPLE_SIZE} × ${SAMPLE_MEAN.toFixed(2)}/${currentSig2.toFixed(2)} + ${mu0}/${sig0})/${mu_precision.toFixed(4)} = ${mu_mean.toFixed(4)}</p>
            <p><strong>Variance:</strong> σ*² = 1/τ = 1/${mu_precision.toFixed(4)} = ${mu_variance.toFixed(4)}</p>
            <p><strong>Distribution:</strong> μ | σ², y ~ N(${mu_mean.toFixed(4)}, ${mu_variance.toFixed(4)})</p>
        </div>
        
        <div class="calc-step">
            <h5>Step 2: Calculate σ² | μ = ${currentMu.toFixed(2)}</h5>
            <p><strong>Sum of squared residuals:</strong> Σ(yᵢ - μ)² = ${sum_squared_residuals.toFixed(4)}</p>
            <p><strong>Shape parameter:</strong> α = ν₀ + n/2 = ${nu0} + ${SAMPLE_SIZE}/2 = ${alpha.toFixed(1)}</p>
            <p><strong>Rate parameter:</strong> β = β₀ + Σ(yᵢ - μ)²/2 = ${beta0} + ${sum_squared_residuals.toFixed(4)}/2 = ${beta.toFixed(4)}</p>
            <p><strong>Distribution:</strong> σ² | μ, y ~ InverseGamma(${alpha.toFixed(1)}, ${beta.toFixed(4)})</p>
            <p><strong>Expected value:</strong> E[σ²] = β/(α-1) = ${beta.toFixed(4)}/${(alpha-1).toFixed(1)} = ${(beta/(alpha-1)).toFixed(4)}</p>
        </div>
    `;
}

// Practice exercises functionality
function initializePractice() {
    const checkAnswersButton = document.getElementById('check-answers');
    const checkExerciseButton = document.getElementById('check-exercise');
    
    checkAnswersButton.addEventListener('click', checkMultipleChoice);
    checkExerciseButton.addEventListener('click', checkNumericalExercise);
}

function checkMultipleChoice() {
    // Question 1: Correct answer is 'b'
    const q1Answer = document.querySelector('input[name="q1"]:checked');
    const feedback1 = document.getElementById('feedback-1');
    
    if (q1Answer) {
        if (q1Answer.value === 'b') {
            feedback1.textContent = 'Correct! Gibbs sampling alternates between sampling from full conditional distributions.';
            feedback1.className = 'question-feedback correct';
        } else {
            feedback1.textContent = 'Incorrect. Gibbs sampling works by alternating between sampling from conditional distributions, not direct sampling from the joint distribution.';
            feedback1.className = 'question-feedback incorrect';
        }
    } else {
        feedback1.textContent = 'Please select an answer.';
        feedback1.className = 'question-feedback incorrect';
    }
    
    // Question 2: Correct answer is 'c'
    const q2Answer = document.querySelector('input[name="q2"]:checked');
    const feedback2 = document.getElementById('feedback-2');
    
    if (q2Answer) {
        if (q2Answer.value === 'c') {
            feedback2.textContent = 'Correct! The posterior precision increases as n/σ² + 1/σ₀², so more data increases precision.';
            feedback2.className = 'question-feedback correct';
        } else {
            feedback2.textContent = 'Incorrect. The precision τ = n/σ² + 1/σ₀² increases with sample size n.';
            feedback2.className = 'question-feedback incorrect';
        }
    } else {
        feedback2.textContent = 'Please select an answer.';
        feedback2.className = 'question-feedback incorrect';
    }
}

function checkNumericalExercise() {
    const userMean = parseFloat(document.getElementById('exercise-mean').value);
    const userVar = parseFloat(document.getElementById('exercise-var').value);
    const feedback = document.getElementById('exercise-feedback');
    
    // Calculate correct answers (σ² = 1, prior parameters as defaults)
    const sigma2 = 1.0;
    const mu0 = 0.0;
    const sig0 = 1.0;
    
    const correctPrecision = SAMPLE_SIZE / sigma2 + 1 / sig0;
    const correctMean = (SAMPLE_SIZE * SAMPLE_MEAN / sigma2 + mu0 / sig0) / correctPrecision;
    const correctVar = 1 / correctPrecision;
    
    const meanTolerance = 0.02;
    const varTolerance = 0.01;
    
    const meanCorrect = Math.abs(userMean - correctMean) < meanTolerance;
    const varCorrect = Math.abs(userVar - correctVar) < varTolerance;
    
    feedback.classList.add('show');
    
    if (meanCorrect && varCorrect) {
        feedback.textContent = `Excellent! Your answers are correct. Mean = ${correctMean.toFixed(3)}, Variance = ${correctVar.toFixed(3)}`;
        feedback.className = 'exercise-feedback show correct';
    } else {
        let message = 'Not quite right. ';
        if (!meanCorrect) {
            message += `The correct posterior mean is ${correctMean.toFixed(3)}. `;
        }
        if (!varCorrect) {
            message += `The correct posterior variance is ${correctVar.toFixed(3)}. `;
        }
        message += 'Remember: precision = n/σ² + 1/σ₀², mean = (nȳ/σ² + μ₀/σ₀²)/precision, variance = 1/precision.';
        feedback.textContent = message;
        feedback.className = 'exercise-feedback show incorrect';
    }
}

// Utility functions
function formatNumber(num, decimals = 3) {
    return parseFloat(num.toFixed(decimals));
}

function downloadResults() {
    if (simulationData.mu.length === 0) {
        alert('Please run a simulation first.');
        return;
    }
    
    const data = {
        parameters: {
            mu: simulationData.mu,
            sigma2: simulationData.sigma2
        },
        sample_data: SAMPLE_DATA,
        iterations: simulationData.iterations
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gibbs_sampling_results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Add keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl+Enter to run simulation
    if (e.ctrlKey && e.key === 'Enter') {
        e.preventDefault();
        runGibbsSimulation();
    }
});

// Initialize tooltips and help text
document.addEventListener('DOMContentLoaded', function() {
    // Add tooltips to form inputs
    const tooltips = {
        'iterations': 'Number of MCMC iterations to run. More iterations give better approximation but take longer.',
        'mu0': 'Prior mean for μ parameter. Center of prior distribution.',
        'sig0': 'Prior variance for μ parameter. Larger values = more uncertainty.',
        'nu0': 'Prior shape parameter for σ². Must be > 0.',
        'beta0': 'Prior rate parameter for σ². Must be > 0.'
    };
    
    Object.entries(tooltips).forEach(([id, text]) => {
        const element = document.getElementById(id);
        if (element) {
            element.title = text;
        }
    });
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    
    // Show user-friendly error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #ff4444;
        color: white;
        padding: 12px 16px;
        border-radius: 6px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        font-size: 14px;
        max-width: 300px;
    `;
    errorDiv.textContent = 'An error occurred. Please refresh the page and try again.';
    
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        document.body.removeChild(errorDiv);
    }, 5000);
});

console.log('Gibbs Sampling Tutor loaded successfully!');