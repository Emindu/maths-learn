// Mixture Model Explorer JavaScript

// Global state
let currentTab = 'concept';
let mixtureConfig = {
    numComponents: 2,
    components: [
        { type: 'normal', mean: -1, variance: 1, weight: 0.5, color: '#1FB8CD' },
        { type: 'normal', mean: 1, variance: 1, weight: 0.5, color: '#FFC185' }
    ]
};

let emState = {
    step: 0,
    data: [],
    currentParams: [],
    trueParams: [],
    logLikelihood: [],
    responsibilities: [],
    iteration: 0,
    converged: false,
    autoRunning: false
};

let simulationData = {
    generated: [],
    fitted: null,
    clusters: []
};

// Mathematical functions
const Math2 = {
    // Normal PDF
    normalPDF: (x, mean, variance) => {
        const sigma = Math.sqrt(variance);
        const coefficient = 1 / (sigma * Math.sqrt(2 * Math.PI));
        const exponent = -Math.pow(x - mean, 2) / (2 * variance);
        return coefficient * Math.exp(exponent);
    },

    // Exponential PDF
    exponentialPDF: (x, rate) => {
        return x >= 0 ? rate * Math.exp(-rate * x) : 0;
    },

    // Mixture PDF
    mixturePDF: (x, components) => {
        return components.reduce((sum, comp) => {
            let pdf;
            if (comp.type === 'normal') {
                pdf = Math2.normalPDF(x, comp.mean, comp.variance);
            } else if (comp.type === 'exponential') {
                pdf = Math2.exponentialPDF(x, comp.rate || 1);
            }
            return sum + comp.weight * pdf;
        }, 0);
    },

    // Generate random normal number (Box-Muller transform)
    randomNormal: (mean = 0, variance = 1) => {
        if (Math2.randomNormal.hasSpare) {
            Math2.randomNormal.hasSpare = false;
            return Math2.randomNormal.spare * Math.sqrt(variance) + mean;
        }
        
        Math2.randomNormal.hasSpare = true;
        const u = Math.random();
        const v = Math.random();
        const mag = variance * Math.sqrt(-2 * Math.log(u));
        Math2.randomNormal.spare = mag * Math.cos(2 * Math.PI * v);
        return mag * Math.sin(2 * Math.PI * v) + mean;
    },

    // Generate random exponential number
    randomExponential: (rate) => {
        return -Math.log(Math.random()) / rate;
    }
};

// Canvas plotting utilities
const Plot = {
    drawAxes: (ctx, width, height, xMin, xMax, yMin, yMax) => {
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 1;
        
        // X-axis
        const y0 = height - (0 - yMin) / (yMax - yMin) * height;
        ctx.beginPath();
        ctx.moveTo(0, y0);
        ctx.lineTo(width, y0);
        ctx.stroke();
        
        // Y-axis
        const x0 = (0 - xMin) / (xMax - xMin) * width;
        ctx.beginPath();
        ctx.moveTo(x0, 0);
        ctx.lineTo(x0, height);
        ctx.stroke();
    },

    drawFunction: (ctx, width, height, xMin, xMax, yMin, yMax, func, color, lineWidth = 2, lineDash = []) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash(lineDash);
        
        ctx.beginPath();
        let firstPoint = true;
        
        for (let px = 0; px <= width; px += 2) {
            const x = xMin + (px / width) * (xMax - xMin);
            const y = func(x);
            const py = height - ((y - yMin) / (yMax - yMin)) * height;
            
            if (firstPoint) {
                ctx.moveTo(px, py);
                firstPoint = false;
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.stroke();
        ctx.setLineDash([]);
    },

    drawPoints: (ctx, width, height, xMin, xMax, yMin, yMax, points, color, size = 3) => {
        ctx.fillStyle = color;
        points.forEach(point => {
            const px = ((point.x - xMin) / (xMax - xMin)) * width;
            const py = height - ((point.y - yMin) / (yMax - yMin)) * height;
            
            ctx.beginPath();
            ctx.arc(px, py, size, 0, 2 * Math.PI);
            ctx.fill();
        });
    },

    drawHistogram: (ctx, width, height, xMin, xMax, yMin, yMax, data, bins = 30, color = '#1FB8CD') => {
        const binWidth = (xMax - xMin) / bins;
        const counts = new Array(bins).fill(0);
        
        data.forEach(value => {
            const binIndex = Math.min(Math.floor((value - xMin) / binWidth), bins - 1);
            if (binIndex >= 0) counts[binIndex]++;
        });
        
        const maxCount = Math.max(...counts);
        const scale = data.length * binWidth;
        
        ctx.fillStyle = color + '80'; // Semi-transparent
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        
        for (let i = 0; i < bins; i++) {
            const density = counts[i] / scale;
            const x1 = ((i * binWidth + xMin - xMin) / (xMax - xMin)) * width;
            const x2 = (((i + 1) * binWidth + xMin - xMin) / (xMax - xMin)) * width;
            const y = height - ((density - yMin) / (yMax - yMin)) * height;
            
            ctx.fillRect(x1, y, x2 - x1, height - y);
            ctx.strokeRect(x1, y, x2 - x1, height - y);
        }
    }
};

// Tab navigation
function initTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            
            // Update active states
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            currentTab = targetTab;
            
            // Initialize tab-specific functionality
            if (targetTab === 'concept') {
                initConceptTab();
            } else if (targetTab === 'demo') {
                initDemoTab();
            } else if (targetTab === 'em') {
                initEMTab();
            } else if (targetTab === 'simulation') {
                initSimulationTab();
            } else if (targetTab === 'applications') {
                initApplicationsTab();
            }
        });
    });
}

// Concept Tab
function initConceptTab() {
    const canvas = document.getElementById('conceptCanvas');
    const ctx = canvas.getContext('2d');
    const weight1Slider = document.getElementById('weight1-slider');
    const weight1Value = document.getElementById('weight1-value');
    const weight2Value = document.getElementById('weight2-value');

    function updateWeights() {
        const w1 = parseFloat(weight1Slider.value);
        const w2 = 1 - w1;
        
        weight1Value.textContent = w1.toFixed(1);
        weight2Value.textContent = w2.toFixed(1);
        
        drawConceptVisualization(ctx, canvas.width, canvas.height, w1, w2);
    }

    weight1Slider.addEventListener('input', updateWeights);
    updateWeights();
}

function drawConceptVisualization(ctx, width, height, w1, w2) {
    ctx.clearRect(0, 0, width, height);
    
    const xMin = -4, xMax = 4, yMin = 0, yMax = 0.5;
    
    Plot.drawAxes(ctx, width, height, xMin, xMax, yMin, yMax);
    
    // Component 1 (mean = -1)
    Plot.drawFunction(ctx, width, height, xMin, xMax, yMin, yMax, 
        x => w1 * Math2.normalPDF(x, -1, 1), '#1FB8CD', 2, [5, 5]);
    
    // Component 2 (mean = 1)
    Plot.drawFunction(ctx, width, height, xMin, xMax, yMin, yMax, 
        x => w2 * Math2.normalPDF(x, 1, 1), '#FFC185', 2, [5, 5]);
    
    // Mixture
    Plot.drawFunction(ctx, width, height, xMin, xMax, yMin, yMax, 
        x => w1 * Math2.normalPDF(x, -1, 1) + w2 * Math2.normalPDF(x, 1, 1), '#B4413C', 3);
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '12px var(--font-family-base)';
    ctx.fillText('Component 1', 10, 20);
    ctx.fillText('Component 2', 10, 35);
    ctx.fillText('Mixture', 10, 50);
}

// Demo Tab
function initDemoTab() {
    const numComponentsSelect = document.getElementById('numComponents');
    const componentControls = document.getElementById('componentControls');
    const legendItems = document.getElementById('legendItems');
    
    numComponentsSelect.addEventListener('change', updateComponentCount);
    
    updateComponentCount();
    updateDemoVisualization();
}

function updateComponentCount() {
    const numComponents = parseInt(document.getElementById('numComponents').value);
    const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5'];
    
    // Update mixtureConfig
    mixtureConfig.numComponents = numComponents;
    
    // Adjust components array
    while (mixtureConfig.components.length < numComponents) {
        const index = mixtureConfig.components.length;
        mixtureConfig.components.push({
            type: 'normal',
            mean: (index - numComponents/2) * 2,
            variance: 1,
            weight: 1/numComponents,
            color: colors[index % colors.length]
        });
    }
    mixtureConfig.components = mixtureConfig.components.slice(0, numComponents);
    
    // Normalize weights
    const totalWeight = mixtureConfig.components.reduce((sum, comp) => sum + comp.weight, 0);
    mixtureConfig.components.forEach(comp => comp.weight /= totalWeight);
    
    createComponentControls();
    updateLegend();
    updateDemoVisualization();
}

function createComponentControls() {
    const container = document.getElementById('componentControls');
    container.innerHTML = '';
    
    mixtureConfig.components.forEach((comp, index) => {
        const div = document.createElement('div');
        div.className = 'component-control';
        
        div.innerHTML = `
            <h4>
                <span class="color-indicator" style="background-color: ${comp.color}"></span>
                Component ${index + 1}
            </h4>
            <div class="form-group">
                <label class="form-label">Distribution Type</label>
                <select class="form-control comp-type" data-index="${index}">
                    <option value="normal" ${comp.type === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="exponential" ${comp.type === 'exponential' ? 'selected' : ''}>Exponential</option>
                </select>
            </div>
            <div class="parameter-row">
                <div class="parameter-group">
                    <label class="form-label">${comp.type === 'normal' ? 'Mean' : 'Rate'}</label>
                    <input type="number" class="form-control comp-param1" data-index="${index}" 
                           value="${comp.type === 'normal' ? comp.mean : (comp.rate || 1)}" step="0.1">
                </div>
                <div class="parameter-group ${comp.type === 'exponential' ? 'hidden' : ''}">
                    <label class="form-label">Variance</label>
                    <input type="number" class="form-control comp-param2" data-index="${index}" 
                           value="${comp.variance || 1}" step="0.1" min="0.1">
                </div>
            </div>
            <div class="form-group">
                <label class="form-label">Weight</label>
                <input type="number" class="form-control comp-weight" data-index="${index}" 
                       value="${comp.weight.toFixed(2)}" step="0.01" min="0.01" max="1">
            </div>
        `;
        
        container.appendChild(div);
    });
    
    // Add event listeners
    container.addEventListener('change', handleComponentChange);
    container.addEventListener('input', handleComponentChange);
}

function handleComponentChange(e) {
    const index = parseInt(e.target.dataset.index);
    const comp = mixtureConfig.components[index];
    
    if (e.target.classList.contains('comp-type')) {
        comp.type = e.target.value;
        if (comp.type === 'exponential') {
            comp.rate = comp.rate || 1;
        }
        createComponentControls(); // Recreate to update parameter labels
    } else if (e.target.classList.contains('comp-param1')) {
        if (comp.type === 'normal') {
            comp.mean = parseFloat(e.target.value);
        } else {
            comp.rate = parseFloat(e.target.value);
        }
    } else if (e.target.classList.contains('comp-param2')) {
        comp.variance = Math.max(0.1, parseFloat(e.target.value));
    } else if (e.target.classList.contains('comp-weight')) {
        comp.weight = Math.max(0.01, Math.min(1, parseFloat(e.target.value)));
        normalizeWeights();
    }
    
    updateDemoVisualization();
}

function normalizeWeights() {
    const total = mixtureConfig.components.reduce((sum, comp) => sum + comp.weight, 0);
    mixtureConfig.components.forEach(comp => comp.weight /= total);
    
    // Update the input values
    document.querySelectorAll('.comp-weight').forEach(input => {
        const index = parseInt(input.dataset.index);
        input.value = mixtureConfig.components[index].weight.toFixed(2);
    });
}

function updateLegend() {
    const container = document.getElementById('legendItems');
    container.innerHTML = '';
    
    mixtureConfig.components.forEach((comp, index) => {
        const div = document.createElement('div');
        div.className = 'legend-item';
        div.innerHTML = `
            <div class="legend-color" style="background-color: ${comp.color}; border-style: dashed;"></div>
            Component ${index + 1}
        `;
        container.appendChild(div);
    });
    
    // Add mixture line
    const mixDiv = document.createElement('div');
    mixDiv.className = 'legend-item';
    mixDiv.innerHTML = `
        <div class="legend-color" style="background-color: #13343B;"></div>
        Mixture
    `;
    container.appendChild(mixDiv);
}

function updateDemoVisualization() {
    const canvas = document.getElementById('demoCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Determine plot range
    let xMin = -5, xMax = 5;
    let yMax = 0;
    
    // Calculate y range
    for (let x = xMin; x <= xMax; x += 0.1) {
        const y = Math2.mixturePDF(x, mixtureConfig.components);
        yMax = Math.max(yMax, y);
    }
    yMax *= 1.1; // Add some padding
    
    Plot.drawAxes(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax);
    
    // Draw individual components
    mixtureConfig.components.forEach(comp => {
        Plot.drawFunction(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax,
            x => {
                if (comp.type === 'normal') {
                    return comp.weight * Math2.normalPDF(x, comp.mean, comp.variance);
                } else {
                    return comp.weight * Math2.exponentialPDF(x, comp.rate);
                }
            }, comp.color, 2, [5, 5]);
    });
    
    // Draw mixture
    Plot.drawFunction(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax,
        x => Math2.mixturePDF(x, mixtureConfig.components), '#13343B', 3);
    
    updateCurrentFormula();
}

function updateCurrentFormula() {
    const container = document.getElementById('currentFormula');
    let formula = 'f(x) = ';
    
    mixtureConfig.components.forEach((comp, index) => {
        if (index > 0) formula += ' + ';
        formula += `${comp.weight.toFixed(2)} × `;
        
        if (comp.type === 'normal') {
            formula += `N(${comp.mean}, ${comp.variance})`;
        } else {
            formula += `Exp(${comp.rate})`;
        }
    });
    
    container.textContent = formula;
}

// EM Algorithm Tab
function initEMTab() {
    document.getElementById('nextStep').addEventListener('click', nextEMStep);
    document.getElementById('autoRun').addEventListener('click', toggleAutoRun);
    document.getElementById('resetEM').addEventListener('click', resetEM);
    
    resetEM();
}

function resetEM() {
    emState = {
        step: 0,
        data: [],
        currentParams: [],
        trueParams: [],
        logLikelihood: [],
        responsibilities: [],
        iteration: 0,
        converged: false,
        autoRunning: false
    };
    
    // Generate sample data from known mixture
    generateEMData();
    initializeEMParameters();
    updateEMDisplay();
}

function generateEMData() {
    const n = 200;
    const trueComponents = [
        { type: 'normal', mean: -2, variance: 1, weight: 0.4 },
        { type: 'normal', mean: 2, variance: 1.5, weight: 0.6 }
    ];
    
    emState.trueParams = JSON.parse(JSON.stringify(trueComponents));
    emState.data = [];
    
    for (let i = 0; i < n; i++) {
        // Choose component based on weights
        const rand = Math.random();
        let cumWeight = 0;
        let chosenComp = 0;
        
        for (let j = 0; j < trueComponents.length; j++) {
            cumWeight += trueComponents[j].weight;
            if (rand < cumWeight) {
                chosenComp = j;
                break;
            }
        }
        
        // Generate point from chosen component
        const comp = trueComponents[chosenComp];
        const x = Math2.randomNormal(comp.mean, comp.variance);
        emState.data.push({ x, trueComponent: chosenComp });
    }
}

function initializeEMParameters() {
    // Initialize with random parameters
    emState.currentParams = [
        { type: 'normal', mean: Math.random() * 2 - 1, variance: 1 + Math.random(), weight: 0.5 },
        { type: 'normal', mean: Math.random() * 2 + 1, variance: 1 + Math.random(), weight: 0.5 }
    ];
    
    emState.logLikelihood = [];
    emState.iteration = 0;
    emState.step = 0;
}

function nextEMStep() {
    if (emState.converged) return;
    
    if (emState.step === 0) {
        // E-step
        eStep();
        emState.step = 1;
        updateStepInfo('E-step', 'Calculate responsibility values: how likely each data point belongs to each component');
    } else {
        // M-step
        mStep();
        emState.step = 0;
        emState.iteration++;
        updateStepInfo('M-step', 'Update parameters using weighted maximum likelihood estimates');
        
        // Check convergence
        if (emState.iteration > 1) {
            const prevLL = emState.logLikelihood[emState.logLikelihood.length - 2];
            const currLL = emState.logLikelihood[emState.logLikelihood.length - 1];
            if (Math.abs(currLL - prevLL) < 0.001) {
                emState.converged = true;
                updateStepInfo('Converged', 'Algorithm has converged - parameters are stable');
            }
        }
    }
    
    updateEMDisplay();
}

function eStep() {
    emState.responsibilities = emState.data.map(point => {
        const probs = emState.currentParams.map(comp => 
            comp.weight * Math2.normalPDF(point.x, comp.mean, comp.variance)
        );
        const total = probs.reduce((sum, p) => sum + p, 0);
        return probs.map(p => p / total);
    });
}

function mStep() {
    const n = emState.data.length;
    
    emState.currentParams.forEach((comp, k) => {
        // Update weights
        const nk = emState.responsibilities.reduce((sum, resp) => sum + resp[k], 0);
        comp.weight = nk / n;
        
        // Update means
        const numerator = emState.data.reduce((sum, point, i) => 
            sum + emState.responsibilities[i][k] * point.x, 0);
        comp.mean = numerator / nk;
        
        // Update variances
        const variance = emState.data.reduce((sum, point, i) => 
            sum + emState.responsibilities[i][k] * Math.pow(point.x - comp.mean, 2), 0);
        comp.variance = variance / nk;
    });
    
    // Calculate log-likelihood
    const logLikelihood = emState.data.reduce((sum, point) => {
        const likelihood = emState.currentParams.reduce((compSum, comp) => 
            compSum + comp.weight * Math2.normalPDF(point.x, comp.mean, comp.variance), 0);
        return sum + Math.log(likelihood);
    }, 0);
    
    emState.logLikelihood.push(logLikelihood);
}

function toggleAutoRun() {
    emState.autoRunning = !emState.autoRunning;
    const button = document.getElementById('autoRun');
    
    if (emState.autoRunning) {
        button.textContent = 'Stop';
        runEMStep();
    } else {
        button.textContent = 'Auto Run';
    }
}

function runEMStep() {
    if (!emState.autoRunning || emState.converged) {
        emState.autoRunning = false;
        document.getElementById('autoRun').textContent = 'Auto Run';
        return;
    }
    
    nextEMStep();
    setTimeout(runEMStep, 1000);
}

function updateStepInfo(step, description) {
    document.getElementById('currentStep').textContent = step;
    document.getElementById('stepDescription').textContent = description;
}

function updateEMDisplay() {
    updateParameterDisplay();
    updateEMVisualization();
    updateConvergenceChart();
}

function updateParameterDisplay() {
    const container = document.getElementById('parameterDisplay');
    let html = '';
    
    emState.currentParams.forEach((comp, i) => {
        html += `<div class="parameter-item">Component ${i + 1}:</div>`;
        html += `<div class="parameter-item">  μ = ${comp.mean.toFixed(3)}</div>`;
        html += `<div class="parameter-item">  σ² = ${comp.variance.toFixed(3)}</div>`;
        html += `<div class="parameter-item">  π = ${comp.weight.toFixed(3)}</div>`;
    });
    
    html += `<div class="parameter-item">Iteration: ${emState.iteration}</div>`;
    if (emState.logLikelihood.length > 0) {
        html += `<div class="parameter-item">Log-likelihood: ${emState.logLikelihood[emState.logLikelihood.length - 1].toFixed(3)}</div>`;
    }
    
    container.innerHTML = html;
}

function updateEMVisualization() {
    const canvas = document.getElementById('emCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const xMin = -6, xMax = 6, yMax = 0.3;
    
    Plot.drawAxes(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax);
    
    // Draw data points
    const dataPoints = emState.data.map(point => ({ x: point.x, y: 0.01 }));
    Plot.drawPoints(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax, dataPoints, '#666', 2);
    
    // Draw current mixture
    if (emState.currentParams.length > 0) {
        Plot.drawFunction(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax,
            x => Math2.mixturePDF(x, emState.currentParams), '#1FB8CD', 3);
        
        // Draw individual components
        emState.currentParams.forEach((comp, i) => {
            const color = i === 0 ? '#FFC185' : '#B4413C';
            Plot.drawFunction(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax,
                x => comp.weight * Math2.normalPDF(x, comp.mean, comp.variance), color, 2, [5, 5]);
        });
    }
    
    // Draw true mixture
    Plot.drawFunction(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax,
        x => Math2.mixturePDF(x, emState.trueParams), '#13343B', 2, [10, 5]);
}

function updateConvergenceChart() {
    const canvas = document.getElementById('convergenceCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (emState.logLikelihood.length === 0) return;
    
    const maxIter = Math.max(10, emState.logLikelihood.length);
    const minLL = Math.min(...emState.logLikelihood);
    const maxLL = Math.max(...emState.logLikelihood);
    const range = maxLL - minLL || 1;
    
    Plot.drawAxes(ctx, canvas.width, canvas.height, 0, maxIter, minLL - range * 0.1, maxLL + range * 0.1);
    
    // Draw log-likelihood curve
    const points = emState.logLikelihood.map((ll, i) => ({ x: i + 1, y: ll }));
    if (points.length > 1) {
        ctx.strokeStyle = '#1FB8CD';
        ctx.lineWidth = 2;
        ctx.beginPath();
        points.forEach((point, i) => {
            const px = (point.x / maxIter) * canvas.width;
            const py = canvas.height - ((point.y - minLL + range * 0.1) / (range * 1.2)) * canvas.height;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.stroke();
    }
}

// Simulation Tab
function initSimulationTab() {
    document.getElementById('generateData').addEventListener('click', generateSimulationData);
    document.getElementById('fitModel').addEventListener('click', fitSimulationModel);
    
    generateSimulationData();
}

function generateSimulationData() {
    const sampleSize = parseInt(document.getElementById('sampleSize').value);
    simulationData.generated = [];
    
    // Use current mixture configuration
    for (let i = 0; i < sampleSize; i++) {
        // Choose component
        const rand = Math.random();
        let cumWeight = 0;
        let chosenComp = 0;
        
        for (let j = 0; j < mixtureConfig.components.length; j++) {
            cumWeight += mixtureConfig.components[j].weight;
            if (rand < cumWeight) {
                chosenComp = j;
                break;
            }
        }
        
        // Generate point
        const comp = mixtureConfig.components[chosenComp];
        let x;
        if (comp.type === 'normal') {
            x = Math2.randomNormal(comp.mean, comp.variance);
        } else {
            x = Math2.randomExponential(comp.rate);
        }
        
        simulationData.generated.push({ x, component: chosenComp });
    }
    
    updateSimulationVisualization();
}

function fitSimulationModel() {
    const numComponents = parseInt(document.getElementById('fitComponents').value);
    
    // Simple EM fitting (simplified version)
    const data = simulationData.generated.map(point => point.x);
    const fitted = fitEM(data, numComponents);
    
    simulationData.fitted = fitted;
    
    // Display results
    const container = document.getElementById('fittingResults');
    let html = '<h4>Fitted Parameters:</h4>';
    fitted.forEach((comp, i) => {
        html += `Component ${i + 1}: μ=${comp.mean.toFixed(3)}, σ²=${comp.variance.toFixed(3)}, π=${comp.weight.toFixed(3)}<br>`;
    });
    container.innerHTML = html;
    
    updateSimulationVisualization();
    updateClusterVisualization();
}

function fitEM(data, numComponents) {
    // Initialize parameters
    const params = [];
    for (let i = 0; i < numComponents; i++) {
        params.push({
            mean: data[Math.floor(Math.random() * data.length)],
            variance: 1,
            weight: 1 / numComponents
        });
    }
    
    // Run EM for fixed iterations
    for (let iter = 0; iter < 50; iter++) {
        // E-step
        const responsibilities = data.map(x => {
            const probs = params.map(comp => 
                comp.weight * Math2.normalPDF(x, comp.mean, comp.variance)
            );
            const total = probs.reduce((sum, p) => sum + p, 0);
            return probs.map(p => p / total);
        });
        
        // M-step
        params.forEach((comp, k) => {
            const nk = responsibilities.reduce((sum, resp) => sum + resp[k], 0);
            comp.weight = nk / data.length;
            
            const numerator = data.reduce((sum, x, i) => sum + responsibilities[i][k] * x, 0);
            comp.mean = numerator / nk;
            
            const variance = data.reduce((sum, x, i) => 
                sum + responsibilities[i][k] * Math.pow(x - comp.mean, 2), 0);
            comp.variance = Math.max(0.1, variance / nk);
        });
    }
    
    return params;
}

function updateSimulationVisualization() {
    const canvas = document.getElementById('simCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (simulationData.generated.length === 0) return;
    
    const data = simulationData.generated.map(point => point.x);
    const xMin = Math.min(...data) - 1;
    const xMax = Math.max(...data) + 1;
    const yMax = 0.5;
    
    Plot.drawAxes(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax);
    
    // Draw histogram
    Plot.drawHistogram(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax, data, 30, '#1FB8CD');
    
    // Draw true mixture
    Plot.drawFunction(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax,
        x => Math2.mixturePDF(x, mixtureConfig.components), '#13343B', 3);
    
    // Draw fitted mixture if available
    if (simulationData.fitted) {
        Plot.drawFunction(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax,
            x => Math2.mixturePDF(x, simulationData.fitted), '#B4413C', 2, [5, 5]);
    }
}

function updateClusterVisualization() {
    const canvas = document.getElementById('clusterCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (!simulationData.fitted || simulationData.generated.length === 0) return;
    
    const data = simulationData.generated.map(point => point.x);
    const xMin = Math.min(...data) - 1;
    const xMax = Math.max(...data) + 1;
    
    Plot.drawAxes(ctx, canvas.width, canvas.height, xMin, xMax, -0.5, 1.5);
    
    // Color points by most likely component
    const colors = ['#1FB8CD', '#FFC185', '#B4413C'];
    
    simulationData.generated.forEach(point => {
        // Calculate responsibilities for this point
        const probs = simulationData.fitted.map(comp => 
            comp.weight * Math2.normalPDF(point.x, comp.mean, comp.variance)
        );
        const total = probs.reduce((sum, p) => sum + p, 0);
        const responsibilities = probs.map(p => p / total);
        
        // Find most likely component
        const maxComp = responsibilities.indexOf(Math.max(...responsibilities));
        const color = colors[maxComp % colors.length];
        
        Plot.drawPoints(ctx, canvas.width, canvas.height, xMin, xMax, -0.5, 1.5, 
            [{ x: point.x, y: Math.random() * 0.8 + 0.1 }], color, 3);
    });
}

// Applications Tab
function initApplicationsTab() {
    drawApplicationExample('financeCanvas', [
        { type: 'normal', mean: 0.05, variance: 0.01, weight: 0.8 },
        { type: 'normal', mean: -0.02, variance: 0.09, weight: 0.2 }
    ]);
    
    drawApplicationExample('heightCanvas', [
        { type: 'normal', mean: 178, variance: 49, weight: 0.5 },
        { type: 'normal', mean: 165, variance: 36, weight: 0.5 }
    ]);
    
    drawApplicationExample('customerCanvas', [
        { type: 'normal', mean: 500, variance: 10000, weight: 0.2 },
        { type: 'normal', mean: 200, variance: 2500, weight: 0.5 },
        { type: 'normal', mean: 50, variance: 400, weight: 0.3 }
    ]);
}

function drawApplicationExample(canvasId, components) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Determine range
    let xMin = Infinity, xMax = -Infinity;
    components.forEach(comp => {
        const sigma = Math.sqrt(comp.variance);
        xMin = Math.min(xMin, comp.mean - 3 * sigma);
        xMax = Math.max(xMax, comp.mean + 3 * sigma);
    });
    
    let yMax = 0;
    for (let x = xMin; x <= xMax; x += (xMax - xMin) / 100) {
        const y = Math2.mixturePDF(x, components);
        yMax = Math.max(yMax, y);
    }
    yMax *= 1.1;
    
    Plot.drawAxes(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax);
    
    // Draw components
    const colors = ['#1FB8CD', '#FFC185', '#B4413C'];
    components.forEach((comp, i) => {
        Plot.drawFunction(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax,
            x => comp.weight * Math2.normalPDF(x, comp.mean, comp.variance), 
            colors[i % colors.length], 2, [5, 5]);
    });
    
    // Draw mixture
    Plot.drawFunction(ctx, canvas.width, canvas.height, xMin, xMax, 0, yMax,
        x => Math2.mixturePDF(x, components), '#13343B', 3);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    initTabNavigation();
    initConceptTab(); // Start with concept tab
});