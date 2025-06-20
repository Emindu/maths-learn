// Likelihood Function Dashboard JavaScript

// Application data
const applicationData = {
    hospital_data: {
        total_patients: 400,
        deaths: 72,
        survivors: 328,
        mortality_rate: 0.18
    },
    exponential_sample: [1.2, 0.8, 2.3, 1.7, 0.9, 3.1, 1.4, 2.0, 1.1, 2.8, 1.6, 0.7, 2.5, 1.9, 1.3],
    uniform_sample: [2.1, 3.7, 1.8, 4.2, 2.9, 3.1, 4.0, 2.5, 3.8, 1.9, 3.4, 2.7, 4.1, 3.3, 2.8]
};

// Chart instances
let bernoulliChart = null;
let exponentialChart = null;
let uniformChart = null;

// Current view states
let currentView = {
    bernoulli: 'likelihood',
    exponential: 'likelihood'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTabs();
    initializeBernoulliTab();
    initializeExponentialTab();
    initializeUniformTab();
    
    // Initialize MathJax if available
    if (window.MathJax) {
        MathJax.typesetPromise();
    }
});

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Re-render charts when switching tabs
            setTimeout(() => {
                if (tabId === 'bernoulli' && bernoulliChart) {
                    bernoulliChart.resize();
                } else if (tabId === 'exponential' && exponentialChart) {
                    exponentialChart.resize();
                } else if (tabId === 'uniform' && uniformChart) {
                    uniformChart.resize();
                }
            }, 100);
        });
    });
}

// Bernoulli Distribution Tab
function initializeBernoulliTab() {
    const thetaSlider = document.getElementById('theta-slider');
    const thetaValue = document.getElementById('theta-value');
    const likelihoodBtn = document.getElementById('bernoulli-likelihood-btn');
    const logLikelihoodBtn = document.getElementById('bernoulli-log-likelihood-btn');
    
    // Initialize chart
    const ctx = document.getElementById('bernoulli-chart').getContext('2d');
    bernoulliChart = createBernoulliChart(ctx);
    
    // Update display
    updateBernoulliDisplay(0.18);
    
    // Event listeners
    thetaSlider.addEventListener('input', (e) => {
        const theta = parseFloat(e.target.value);
        thetaValue.textContent = theta.toFixed(3);
        updateBernoulliDisplay(theta);
        updateBernoulliChart();
    });
    
    likelihoodBtn.addEventListener('click', () => {
        currentView.bernoulli = 'likelihood';
        likelihoodBtn.classList.add('active');
        logLikelihoodBtn.classList.remove('active');
        updateBernoulliChart();
    });
    
    logLikelihoodBtn.addEventListener('click', () => {
        currentView.bernoulli = 'log-likelihood';
        logLikelihoodBtn.classList.add('active');
        likelihoodBtn.classList.remove('active');
        updateBernoulliChart();
    });
    
    // Display sample data (deaths/survivors)
    displayBernoulliResults();
}

function createBernoulliChart(ctx) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Likelihood',
                data: [],
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.1
            }, {
                label: 'MLE',
                data: [],
                borderColor: '#DB4545',
                backgroundColor: '#DB4545',
                borderWidth: 3,
                pointRadius: 8,
                pointHoverRadius: 10,
                showLine: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Bernoulli Likelihood Function'
                },
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'θ (Mortality Rate)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Likelihood'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function updateBernoulliDisplay(theta) {
    const n = applicationData.hospital_data.total_patients;
    const k = applicationData.hospital_data.deaths;
    
    // Calculate likelihood
    const likelihood = Math.pow(theta, k) * Math.pow(1 - theta, n - k);
    const logLikelihood = k * Math.log(theta) + (n - k) * Math.log(1 - theta);
    
    // Calculate Fisher Information
    const fisherInfo = n / (theta * (1 - theta));
    
    // Calculate 95% confidence interval
    const mle = k / n;
    const se = Math.sqrt(mle * (1 - mle) / n);
    const ciLower = Math.max(0, mle - 1.96 * se);
    const ciUpper = Math.min(1, mle + 1.96 * se);
    
    // Update display
    document.getElementById('current-likelihood').textContent = likelihood.toExponential(3);
    document.getElementById('fisher-info').textContent = fisherInfo.toFixed(2);
    document.getElementById('ci-lower').textContent = ciLower.toFixed(3);
    document.getElementById('ci-upper').textContent = ciUpper.toFixed(3);
}

function updateBernoulliChart() {
    const n = applicationData.hospital_data.total_patients;
    const k = applicationData.hospital_data.deaths;
    const mle = k / n;
    
    const thetaValues = [];
    const likelihoodValues = [];
    
    // Generate theta values from 0.01 to 0.99
    for (let i = 1; i < 99; i++) {
        const theta = i / 100;
        thetaValues.push(theta.toFixed(2));
        
        if (currentView.bernoulli === 'likelihood') {
            const likelihood = Math.pow(theta, k) * Math.pow(1 - theta, n - k);
            likelihoodValues.push(likelihood);
        } else {
            const logLikelihood = k * Math.log(theta) + (n - k) * Math.log(1 - theta);
            likelihoodValues.push(logLikelihood);
        }
    }
    
    // Update chart data
    bernoulliChart.data.labels = thetaValues;
    bernoulliChart.data.datasets[0].data = likelihoodValues;
    bernoulliChart.data.datasets[0].label = currentView.bernoulli === 'likelihood' ? 'Likelihood' : 'Log-Likelihood';
    
    // MLE point
    const mleIndex = Math.round(mle * 100) - 1;
    if (mleIndex >= 0 && mleIndex < likelihoodValues.length) {
        bernoulliChart.data.datasets[1].data = [{
            x: mle.toFixed(2),
            y: likelihoodValues[mleIndex]
        }];
    }
    
    // Update y-axis label
    bernoulliChart.options.scales.y.title.text = currentView.bernoulli === 'likelihood' ? 'Likelihood' : 'Log-Likelihood';
    bernoulliChart.options.plugins.title.text = `Bernoulli ${currentView.bernoulli === 'likelihood' ? 'Likelihood' : 'Log-Likelihood'} Function`;
    
    bernoulliChart.update();
}

function displayBernoulliResults() {
    // Results are already displayed in HTML, just ensure MLE is highlighted
    document.querySelector('.mle-value').textContent = '0.18';
}

// Exponential Distribution Tab
function initializeExponentialTab() {
    const lambdaSlider = document.getElementById('lambda-slider');
    const lambdaValue = document.getElementById('lambda-value');
    const likelihoodBtn = document.getElementById('exp-likelihood-btn');
    const logLikelihoodBtn = document.getElementById('exp-log-likelihood-btn');
    
    // Calculate sample statistics
    const sampleData = applicationData.exponential_sample;
    const sampleMean = sampleData.reduce((a, b) => a + b, 0) / sampleData.length;
    const mle = 1 / sampleMean;
    
    // Initialize chart
    const ctx = document.getElementById('exponential-chart').getContext('2d');
    exponentialChart = createExponentialChart(ctx);
    
    // Initialize slider to MLE value
    lambdaSlider.value = mle.toFixed(2);
    lambdaValue.textContent = mle.toFixed(2);
    
    // Update display
    updateExponentialDisplay(mle);
    
    // Display sample data
    displayExponentialData();
    
    // Event listeners
    lambdaSlider.addEventListener('input', (e) => {
        const lambda = parseFloat(e.target.value);
        lambdaValue.textContent = lambda.toFixed(2);
        updateExponentialDisplay(lambda);
        updateExponentialChart();
    });
    
    likelihoodBtn.addEventListener('click', () => {
        currentView.exponential = 'likelihood';
        likelihoodBtn.classList.add('active');
        logLikelihoodBtn.classList.remove('active');
        updateExponentialChart();
    });
    
    logLikelihoodBtn.addEventListener('click', () => {
        currentView.exponential = 'log-likelihood';
        logLikelihoodBtn.classList.add('active');
        likelihoodBtn.classList.remove('active');
        updateExponentialChart();
    });
}

function createExponentialChart(ctx) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Likelihood',
                data: [],
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.1
            }, {
                label: 'MLE',
                data: [],
                borderColor: '#DB4545',
                backgroundColor: '#DB4545',
                borderWidth: 3,
                pointRadius: 8,
                pointHoverRadius: 10,
                showLine: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Exponential Likelihood Function'
                },
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'λ (Rate Parameter)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Likelihood'
                    }
                }
            }
        }
    });
}

function updateExponentialDisplay(lambda) {
    const sampleData = applicationData.exponential_sample;
    const n = sampleData.length;
    const sumX = sampleData.reduce((a, b) => a + b, 0);
    const mle = n / sumX;
    
    // Calculate likelihood
    const likelihood = Math.pow(lambda, n) * Math.exp(-lambda * sumX);
    
    // Update display elements
    document.getElementById('sample-mean').textContent = (sumX / n).toFixed(2);
    document.getElementById('lambda-mle').textContent = mle.toFixed(2);
    document.getElementById('current-likelihood-exp').textContent = likelihood.toExponential(3);
}

function updateExponentialChart() {
    const sampleData = applicationData.exponential_sample;
    const n = sampleData.length;
    const sumX = sampleData.reduce((a, b) => a + b, 0);
    const mle = n / sumX;
    
    // Dynamically expand lambda range to always include the MLE
    let minLambda = Math.min(0.1, mle * 0.8);
    let maxLambda = Math.max(3.0, mle * 1.2);
    if (minLambda === maxLambda) {
        maxLambda = minLambda + 0.5;
    }
    let lambdaValues = [];
    let likelihoodValues = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
        const lambda = minLambda + (maxLambda - minLambda) * i / steps;
        lambdaValues.push(lambda);
        if (currentView.exponential === 'likelihood') {
            likelihoodValues.push(Math.pow(lambda, n) * Math.exp(-lambda * sumX));
        } else {
            likelihoodValues.push(n * Math.log(lambda) - lambda * sumX);
        }
    }
    // Add the MLE point
    let mleY;
    if (currentView.exponential === 'likelihood') {
        mleY = Math.pow(mle, n) * Math.exp(-mle * sumX);
    } else {
        mleY = n * Math.log(mle) - mle * sumX;
    }
    lambdaValues.push(mle);
    likelihoodValues.push(mleY);
    // Sort both arrays by lambda
    const combined = lambdaValues.map((l, i) => ({ l, y: likelihoodValues[i] }));
    combined.sort((a, b) => a.l - b.l);
    lambdaValues = combined.map(d => d.l.toFixed(2));
    likelihoodValues = combined.map(d => d.y);
    // Update chart data
    exponentialChart.data.labels = lambdaValues;
    exponentialChart.data.datasets[0].data = likelihoodValues;
    exponentialChart.data.datasets[0].label = currentView.exponential === 'likelihood' ? 'Likelihood' : 'Log-Likelihood';
    exponentialChart.data.datasets[1].data = [{
        x: mle.toFixed(2),
        y: mleY
    }];
    
    // Update labels
    exponentialChart.options.scales.y.title.text = currentView.exponential === 'likelihood' ? 'Likelihood' : 'Log-Likelihood';
    exponentialChart.options.plugins.title.text = `Exponential ${currentView.exponential === 'likelihood' ? 'Likelihood' : 'Log-Likelihood'} Function`;
    
    exponentialChart.update();
}

function displayExponentialData() {
    const dataDisplay = document.getElementById('sample-data-display');
    const sampleData = applicationData.exponential_sample;
    
    dataDisplay.innerHTML = sampleData.map(value => 
        `<div class="data-point">${value.toFixed(1)}</div>`
    ).join('');
}

// Uniform Distribution Tab
function initializeUniformTab() {
    const thetaSlider = document.getElementById('uniform-theta-slider');
    const thetaValue = document.getElementById('uniform-theta-value');
    
    // Calculate sample statistics
    const sampleData = applicationData.uniform_sample;
    const maxValue = Math.max(...sampleData);
    
    // Initialize chart
    const ctx = document.getElementById('uniform-chart').getContext('2d');
    uniformChart = createUniformChart(ctx);
    
    // Initialize slider
    thetaSlider.min = maxValue.toFixed(2);
    thetaSlider.value = maxValue.toFixed(2);
    thetaValue.textContent = maxValue.toFixed(2);
    
    // Update displays
    updateUniformDisplay(maxValue);
    displayUniformData();
    
    // Event listener
    thetaSlider.addEventListener('input', (e) => {
        const theta = parseFloat(e.target.value);
        thetaValue.textContent = theta.toFixed(2);
        updateUniformDisplay(theta);
        updateUniformChart();
    });
}

function createUniformChart(ctx) {
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Likelihood',
                data: [],
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0
            }, {
                label: 'MLE',
                data: [],
                borderColor: '#DB4545',
                backgroundColor: '#DB4545',
                borderWidth: 3,
                pointRadius: 8,
                pointHoverRadius: 10,
                showLine: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Uniform Distribution Likelihood Function'
                },
                legend: {
                    display: true
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'θ (Upper Bound)'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Likelihood'
                    }
                }
            }
        }
    });
}

function updateUniformDisplay(theta) {
    const sampleData = applicationData.uniform_sample;
    const n = sampleData.length;
    const maxValue = Math.max(...sampleData);
    
    // Calculate likelihood (only valid if theta >= max value)
    const likelihood = theta >= maxValue ? Math.pow(1/theta, n) : 0;
    
    // Update display elements
    document.getElementById('max-obs').textContent = maxValue.toFixed(2);
    document.getElementById('current-likelihood-uniform').textContent = likelihood.toExponential(3);
}

function updateUniformChart() {
    const sampleData = applicationData.uniform_sample;
    const n = sampleData.length;
    const maxValue = Math.max(...sampleData);
    
    const thetaValues = [];
    const likelihoodValues = [];
    
    // Generate theta values starting from max value
    const startTheta = maxValue;
    const endTheta = maxValue + 4;
    
    for (let i = 0; i <= 100; i++) {
        const theta = startTheta + (endTheta - startTheta) * i / 100;
        thetaValues.push(theta.toFixed(2));
        
        const likelihood = Math.pow(1/theta, n);
        likelihoodValues.push(likelihood);
    }
    
    // Update chart data
    uniformChart.data.labels = thetaValues;
    uniformChart.data.datasets[0].data = likelihoodValues;
    
    // MLE point (at the maximum value)
    uniformChart.data.datasets[1].data = [{
        x: maxValue.toFixed(2),
        y: Math.pow(1/maxValue, n)
    }];
    
    uniformChart.update();
}

function displayUniformData() {
    const dataDisplay = document.getElementById('uniform-sample-data-display');
    const sampleData = applicationData.uniform_sample;
    const maxValue = Math.max(...sampleData);
    
    dataDisplay.innerHTML = sampleData.map(value => 
        `<div class="data-point ${value === maxValue ? 'max-value' : ''}">${value.toFixed(1)}</div>`
    ).join('');
}

// Utility functions
function formatScientific(number) {
    return number.toExponential(3);
}

function animateValue(element, newValue) {
    element.classList.add('value-update');
    element.textContent = newValue;
    setTimeout(() => {
        element.classList.remove('value-update');
    }, 500);
}