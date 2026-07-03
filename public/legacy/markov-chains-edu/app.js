// Markov Chains Educational App - JavaScript

// Application State
let appState = {
    currentSection: 'introduction',
    completedSections: new Set(),
    discreteGame: {
        currentState: 3,
        history: ['Starting at state 3'],
        stepCount: 0
    },
    randomWalk: {
        data: [],
        currentStep: 0,
        currentValue: 0,
        isRunning: false,
        chart: null
    },
    modifiedWalk: {
        data: [{x: 0, y: 0}],
        currentStep: 0,
        currentValue: 0,
        phi: 0,
        isRunning: false,
        chart: null
    },
    simulation: {
        data: [],
        frequencies: [0, 0, 0, 0, 0],
        currentStep: 0,
        currentState: 1,
        isRunning: false,
        chart: null
    },
    transitionMatrix: [
        [0.0, 0.5, 0.0, 0.0, 0.5],
        [0.5, 0.0, 0.5, 0.0, 0.0],
        [0.0, 0.5, 0.0, 0.5, 0.0],
        [0.0, 0.0, 0.5, 0.0, 0.5],
        [0.5, 0.0, 0.0, 0.5, 0.0]
    ]
};

// Data from the provided JSON
const matrixPowers = {
    "Q5": [
        [0.062, 0.312, 0.156, 0.156, 0.312],
        [0.312, 0.062, 0.312, 0.156, 0.156],
        [0.156, 0.312, 0.062, 0.312, 0.156],
        [0.156, 0.156, 0.312, 0.062, 0.312],
        [0.312, 0.156, 0.156, 0.312, 0.062]
    ],
    "Q10": [
        [0.248, 0.161, 0.215, 0.215, 0.161],
        [0.161, 0.248, 0.161, 0.215, 0.215],
        [0.215, 0.161, 0.248, 0.161, 0.215],
        [0.215, 0.215, 0.161, 0.248, 0.161],
        [0.161, 0.215, 0.215, 0.161, 0.248]
    ],
    "Q30": [
        [0.201, 0.199, 0.200, 0.200, 0.199],
        [0.199, 0.201, 0.199, 0.200, 0.200],
        [0.200, 0.199, 0.201, 0.199, 0.200],
        [0.200, 0.200, 0.199, 0.201, 0.199],
        [0.199, 0.200, 0.200, 0.199, 0.201]
    ]
};

const stationaryDistribution = [0.2, 0.2, 0.2, 0.2, 0.2];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    updateProgress();
});

function initializeApp() {
    // Mark introduction as completed when first visiting
    markSectionCompleted('introduction');
    
    // Initialize charts
    setTimeout(() => {
        initializeCharts();
    }, 500);

    // Initialize state transition diagram with initial state
    updateStateTransitionDiagram(3);
}

function setupEventListeners() {
    // Navigation
    setupNavigation();
    
    // Discrete game
    setupDiscreteGame();
    
    // Random walk
    setupRandomWalk();
    
    // Matrix operations
    setupMatrixOperations();
    
    // Stationary distribution
    setupStationaryDistribution();
    
    // Simulations
    setupSimulations();
}

function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            navigateToSection(section);
        });
    });
}

function navigateToSection(sectionId) {
    // Hide current section
    const currentSection = document.querySelector('.content-section.active');
    if (currentSection) {
        currentSection.classList.remove('active');
    }
    
    // Show new section
    const newSection = document.getElementById(sectionId);
    if (newSection) {
        newSection.classList.add('active');
        newSection.classList.add('fade-in');
    }
    
    // Update navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeNavItem = document.querySelector(`[data-section="${sectionId}"]`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
    
    // Update state
    appState.currentSection = sectionId;
    markSectionCompleted(sectionId);
    updateProgress();
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function markSectionCompleted(sectionId) {
    appState.completedSections.add(sectionId);
    const checkElement = document.getElementById(`${sectionId.substring(0, 3)}-check`);
    if (checkElement) {
        checkElement.classList.add('completed');
    }
}

function updateProgress() {
    const totalSections = 7;
    const completedCount = appState.completedSections.size;
    const percentage = Math.round((completedCount / totalSections) * 100);
    
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `${percentage}% Complete`;
    }
}

function setupDiscreteGame() {
    const flipCoinBtn = document.getElementById('flipCoin');
    const resetGameBtn = document.getElementById('resetGame');
    
    if (flipCoinBtn) {
        flipCoinBtn.addEventListener('click', flipCoin);
    }
    
    if (resetGameBtn) {
        resetGameBtn.addEventListener('click', resetDiscreteGame);
    }
    
    // Initialize the game state and visualization
    updateDiscreteGameDisplay();
    updateStateTransitionDiagram(appState.discreteGame.currentState);
}

function flipCoin() {
    const isHeads = Math.random() < 0.5;
    const coinResult = document.getElementById('coinResult');
    const currentState = appState.discreteGame.currentState;
    
    let newState;
    if (isHeads) {
        newState = currentState === 5 ? 1 : currentState + 1;
        coinResult.textContent = "🪙 Heads → Move Forward";
        coinResult.style.color = "var(--color-success)";
    } else {
        newState = currentState === 1 ? 5 : currentState - 1;
        coinResult.textContent = "🪙 Tails → Move Backward";
        coinResult.style.color = "var(--color-warning)";
    }
    
    appState.discreteGame.currentState = newState;
    appState.discreteGame.stepCount++;
    appState.discreteGame.history.push(`Step ${appState.discreteGame.stepCount}: ${currentState} → ${newState} (${isHeads ? 'Heads' : 'Tails'})`);
    
    updateDiscreteGameDisplay();
    updateStateTransitionDiagram(newState);
    
    // Add pulse animation to new state
    const newStateElement = document.querySelector(`[data-state="${newState}"]`);
    if (newStateElement) {
        newStateElement.classList.add('pulse');
        setTimeout(() => {
            newStateElement.classList.remove('pulse');
        }, 1000);
    }
}

function updateStateTransitionDiagram(currentState) {
    // Remove focus from all states
    document.querySelectorAll('.state-node').forEach(node => {
        node.classList.remove('state-focused');
        node.style.fill = 'var(--color-primary)';
        node.style.stroke = 'none';
        node.style.strokeWidth = '0';
    });
    // Add focus to the current state
    const stateNode = document.getElementById(`state${currentState}`);
    if (stateNode) {
        stateNode.classList.add('state-focused');
    }
    // Reset all transition paths to default
    document.querySelectorAll('.transition-diagram path').forEach(path => {
        path.style.stroke = 'var(--color-primary)';
        path.style.strokeWidth = '2';
    });
}

function resetDiscreteGame() {
    appState.discreteGame = {
        currentState: 3,
        history: ['Starting at state 3'],
        stepCount: 0
    };
    
    document.getElementById('coinResult').textContent = '';
    
    updateStateTransitionDiagram(3);
    updateDiscreteGameDisplay();
}

function updateDiscreteGameDisplay() {
    const currentStateSpan = document.getElementById('currentState');
    const historyList = document.getElementById('historyList');
    
    if (currentStateSpan) {
        currentStateSpan.textContent = appState.discreteGame.currentState;
    }
    
    // Update state visualization
    document.querySelectorAll('.state-circle').forEach(circle => {
        circle.classList.remove('active');
        if (parseInt(circle.dataset.state) === appState.discreteGame.currentState) {
            circle.classList.add('active');
        }
    });
    
    // Update history
    if (historyList) {
        historyList.innerHTML = appState.discreteGame.history.slice(-10).join('<br>');
        historyList.scrollTop = historyList.scrollHeight;
    }
}

function setupRandomWalk() {
    const startWalkBtn = document.getElementById('startWalk');
    const pauseWalkBtn = document.getElementById('pauseWalk');
    const resetWalkBtn = document.getElementById('resetWalk');
    const phiSlider = document.getElementById('phiSlider');
    
    if (startWalkBtn) {
        startWalkBtn.addEventListener('click', startRandomWalk);
    }
    
    if (pauseWalkBtn) {
        pauseWalkBtn.addEventListener('click', pauseRandomWalk);
    }
    
    if (resetWalkBtn) {
        resetWalkBtn.addEventListener('click', resetRandomWalk);
    }
    
    if (phiSlider) {
        phiSlider.addEventListener('input', function() {
            appState.modifiedWalk.phi = parseFloat(this.value);
            document.getElementById('phiValue').textContent = this.value;
        });
    }

    // Add event listeners for modified walk
    const startModWalkBtn = document.getElementById('startModWalk');
    const pauseModWalkBtn = document.getElementById('pauseModWalk');
    const resetModWalkBtn = document.getElementById('resetModWalk');

    if (startModWalkBtn) {
        startModWalkBtn.addEventListener('click', startModifiedWalk);
    }

    if (pauseModWalkBtn) {
        pauseModWalkBtn.addEventListener('click', pauseModifiedWalk);
    }

    if (resetModWalkBtn) {
        resetModWalkBtn.addEventListener('click', resetModifiedWalk);
    }
}

function startRandomWalk() {
    if (appState.randomWalk.isRunning) return;
    
    appState.randomWalk.isRunning = true;
    document.getElementById('startWalk').disabled = true;
    
    const walkInterval = setInterval(() => {
        if (!appState.randomWalk.isRunning) {
            clearInterval(walkInterval);
            return;
        }
        
        // Generate next step: N(current_value, 1)
        const nextValue = normalRandom(appState.randomWalk.currentValue, 1);
        appState.randomWalk.currentValue = nextValue;
        appState.randomWalk.currentStep++;
        appState.randomWalk.data.push({x: appState.randomWalk.currentStep, y: nextValue});
        
        // Keep only last 100 points for performance
        if (appState.randomWalk.data.length > 100) {
            appState.randomWalk.data.shift();
        }
        
        updateRandomWalkDisplay();
        updateRandomWalkChart();
        
        if (appState.randomWalk.currentStep >= 1000) {
            pauseRandomWalk();
        }
    }, 50);
}

function pauseRandomWalk() {
    appState.randomWalk.isRunning = false;
    document.getElementById('startWalk').disabled = false;
}

function resetRandomWalk() {
    pauseRandomWalk();
    appState.randomWalk = {
        data: [{x: 0, y: 0}],
        currentStep: 0,
        currentValue: 0,
        isRunning: false,
        chart: appState.randomWalk.chart
    };
    
    updateRandomWalkDisplay();
    updateRandomWalkChart();
}

function updateRandomWalkDisplay() {
    const stepElement = document.getElementById('walkStep');
    const valueElement = document.getElementById('walkValue');
    
    if (stepElement) {
        stepElement.textContent = appState.randomWalk.currentStep;
    }
    
    if (valueElement) {
        valueElement.textContent = appState.randomWalk.currentValue.toFixed(2);
    }
}

function normalRandom(mean = 0, stdDev = 1) {
    // Box-Muller transform
    let u = 0, v = 0;
    while(u === 0) u = Math.random();
    while(v === 0) v = Math.random();
    
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
}

function setupMatrixOperations() {
    const calculatePowersBtn = document.getElementById('calculatePowers');
    const resetMatrixBtn = document.getElementById('resetMatrix');
    const powerSelect = document.getElementById('powerSelect');
    
    if (calculatePowersBtn) {
        calculatePowersBtn.addEventListener('click', calculateMatrixPowers);
    }
    
    if (resetMatrixBtn) {
        resetMatrixBtn.addEventListener('click', resetTransitionMatrix);
    }
    
    if (powerSelect) {
        powerSelect.addEventListener('change', showMatrixPower);
    }
    
    // Setup matrix input listeners
    setupMatrixInputs();
}

function setupMatrixInputs() {
    const matrixInputs = document.querySelectorAll('.transition-matrix input');
    matrixInputs.forEach(input => {
        input.addEventListener('change', function() {
            const row = parseInt(this.dataset.row);
            const col = parseInt(this.dataset.col);
            const value = parseFloat(this.value) || 0;
            
            appState.transitionMatrix[row][col] = value;
            validateMatrixRow(row);
        });
    });
}

function validateMatrixRow(row) {
    const rowSum = appState.transitionMatrix[row].reduce((sum, val) => sum + val, 0);
    const tolerance = 0.001;
    
    if (Math.abs(rowSum - 1.0) > tolerance) {
        console.warn(`Row ${row + 1} sum: ${rowSum.toFixed(3)} (should be 1.0)`);
    }
}

function calculateMatrixPowers() {
    try {
        const Q = math.matrix(appState.transitionMatrix);
        const Q2 = math.multiply(Q, Q);
        const Q5 = math.multiply(math.multiply(Q2, Q2), Q);
        
        console.log('Matrix powers calculated successfully');
        showMatrixPower(); // Show current selection
    } catch (error) {
        console.error('Error calculating matrix powers:', error);
    }
}

function showMatrixPower() {
    const powerSelect = document.getElementById('powerSelect');
    const powerResult = document.getElementById('powerResult');
    
    if (!powerSelect || !powerResult) return;
    
    const power = powerSelect.value;
    let matrix;
    
    try {
        if (power === '1') {
            matrix = appState.transitionMatrix;
        } else if (power === '2') {
            const Q = math.matrix(appState.transitionMatrix);
            matrix = math.multiply(Q, Q)._data;
        } else {
            // Use predefined matrices for higher powers
            const key = 'Q' + power;
            matrix = matrixPowers[key] || appState.transitionMatrix;
        }
        
        powerResult.innerHTML = formatMatrix(matrix, `Q^${power}`);
    } catch (error) {
        powerResult.innerHTML = 'Error calculating matrix power';
        console.error(error);
    }
}

function formatMatrix(matrix, title) {
    let html = `<h4>${title}:</h4><table class="power-matrix">`;
    
    for (let i = 0; i < matrix.length; i++) {
        html += '<tr>';
        for (let j = 0; j < matrix[i].length; j++) {
            const value = typeof matrix[i][j] === 'number' ? matrix[i][j].toFixed(3) : matrix[i][j];
            html += `<td>${value}</td>`;
        }
        html += '</tr>';
    }
    
    html += '</table>';
    return html;
}

function resetTransitionMatrix() {
    appState.transitionMatrix = [
        [0.0, 0.5, 0.0, 0.0, 0.5],
        [0.5, 0.0, 0.5, 0.0, 0.0],
        [0.0, 0.5, 0.0, 0.5, 0.0],
        [0.0, 0.0, 0.5, 0.0, 0.5],
        [0.5, 0.0, 0.0, 0.5, 0.0]
    ];
    
    // Update input fields
    const matrixInputs = document.querySelectorAll('.transition-matrix input');
    matrixInputs.forEach(input => {
        const row = parseInt(input.dataset.row);
        const col = parseInt(input.dataset.col);
        input.value = appState.transitionMatrix[row][col];
    });
}

function setupStationaryDistribution() {
    const verifyBtn = document.getElementById('verifyStationary');
    
    if (verifyBtn) {
        verifyBtn.addEventListener('click', verifyStationaryProperty);
    }
    
    setTimeout(() => {
        createConvergenceChart();
    }, 1000);
}

function verifyStationaryProperty() {
    const resultDiv = document.getElementById('verificationResult');
    
    try {
        const pi = math.matrix([stationaryDistribution]);
        const Q = math.matrix(appState.transitionMatrix);
        const result = math.multiply(pi, Q);
        const resultArray = result._data[0];
        
        let html = '<h4>Verification: π = πQ</h4>';
        html += '<p>π = [0.2, 0.2, 0.2, 0.2, 0.2]</p>';
        html += '<p>πQ = [' + resultArray.map(x => x.toFixed(3)).join(', ') + ']</p>';
        
        const isStationary = resultArray.every(x => Math.abs(x - 0.2) < 0.001);
        
        if (isStationary) {
            html += '<p style="color: var(--color-success);">✓ Stationary property verified!</p>';
            resultDiv.className = 'verification-result success';
        } else {
            html += '<p style="color: var(--color-error);">✗ Not stationary with current matrix</p>';
            resultDiv.className = 'verification-result';
        }
        
        resultDiv.innerHTML = html;
    } catch (error) {
        resultDiv.innerHTML = 'Error in verification: ' + error.message;
        resultDiv.className = 'verification-result';
    }
}

function setupSimulations() {
    const startSimBtn = document.getElementById('startSimulation');
    const pauseSimBtn = document.getElementById('pauseSimulation');
    const resetSimBtn = document.getElementById('resetSimulation');
    const simSteps = document.getElementById('simSteps');
    const simSpeed = document.getElementById('simSpeed');
    
    if (startSimBtn) {
        startSimBtn.addEventListener('click', startLongRunSimulation);
    }
    
    if (pauseSimBtn) {
        pauseSimBtn.addEventListener('click', pauseLongRunSimulation);
    }
    
    if (resetSimBtn) {
        resetSimBtn.addEventListener('click', resetLongRunSimulation);
    }
    
    if (simSteps) {
        simSteps.addEventListener('input', function() {
            document.getElementById('simStepsValue').textContent = this.value;
        });
    }
    
    if (simSpeed) {
        simSpeed.addEventListener('input', function() {
            document.getElementById('simSpeedValue').textContent = this.value;
        });
    }
    
    setTimeout(() => {
        initializeFrequencyChart();
    }, 1500);
}

function startLongRunSimulation() {
    if (appState.simulation.isRunning) return;
    
    appState.simulation.isRunning = true;
    document.getElementById('startSimulation').disabled = true;
    
    const maxSteps = parseInt(document.getElementById('simSteps').value);
    const speed = parseInt(document.getElementById('simSpeed').value);
    const delay = Math.max(1, 11 - speed);
    
    const simInterval = setInterval(() => {
        if (!appState.simulation.isRunning || appState.simulation.currentStep >= maxSteps) {
            clearInterval(simInterval);
            document.getElementById('startSimulation').disabled = false;
            appState.simulation.isRunning = false;
            return;
        }
        
        simulateStep();
        updateSimulationDisplay();
        
        // Update chart every 10 steps for performance
        if (appState.simulation.currentStep % 10 === 0) {
            updateFrequencyChart();
        }
    }, delay);
}

function simulateStep() {
    const currentState = appState.simulation.currentState;
    const probabilities = appState.transitionMatrix[currentState - 1];
    
    const random = Math.random();
    let cumulative = 0;
    let nextState = 1;
    
    for (let i = 0; i < probabilities.length; i++) {
        cumulative += probabilities[i];
        if (random <= cumulative) {
            nextState = i + 1;
            break;
        }
    }
    
    appState.simulation.currentState = nextState;
    appState.simulation.frequencies[nextState - 1]++;
    appState.simulation.currentStep++;
}

function updateSimulationDisplay() {
    const currentStepElement = document.getElementById('currentStep');
    const simCurrentStateElement = document.getElementById('simCurrentState');
    
    if (currentStepElement) {
        currentStepElement.textContent = appState.simulation.currentStep;
    }
    
    if (simCurrentStateElement) {
        simCurrentStateElement.textContent = appState.simulation.currentState;
    }
    
    // Update comparison table
    updateComparisonTable();
}

function updateComparisonTable() {
    const totalSteps = appState.simulation.currentStep;
    if (totalSteps === 0) return;
    
    for (let i = 1; i <= 5; i++) {
        const observed = appState.simulation.frequencies[i - 1] / totalSteps;
        const theoretical = 0.2;
        const difference = Math.abs(observed - theoretical);
        
        const obsElement = document.getElementById(`obs${i}`);
        const diffElement = document.getElementById(`diff${i}`);
        
        if (obsElement) {
            obsElement.textContent = observed.toFixed(3);
        }
        
        if (diffElement) {
            diffElement.textContent = difference.toFixed(3);
            diffElement.style.color = difference > 0.05 ? 'var(--color-warning)' : 'var(--color-success)';
        }
    }
}

function pauseLongRunSimulation() {
    appState.simulation.isRunning = false;
    document.getElementById('startSimulation').disabled = false;
}

function resetLongRunSimulation() {
    pauseLongRunSimulation();
    
    appState.simulation = {
        data: [],
        frequencies: [0, 0, 0, 0, 0],
        currentStep: 0,
        currentState: 1,
        isRunning: false,
        chart: appState.simulation.chart
    };
    
    updateSimulationDisplay();
    updateFrequencyChart();
    updateComparisonTable();
}

function initializeCharts() {
    // Initialize random walk chart
    const walkCanvas = document.getElementById('randomWalkChart');
    if (walkCanvas) {
        const ctx = walkCanvas.getContext('2d');
        appState.randomWalk.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Random Walk',
                    data: [{x: 0, y: 0}],
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    tension: 0.1,
                    pointRadius: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Step' }
                    },
                    y: {
                        title: { display: true, text: 'Value' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
    
    // Initialize modified walk chart
    const modWalkCanvas = document.getElementById('modifiedWalkChart');
    if (modWalkCanvas) {
        const ctx = modWalkCanvas.getContext('2d');
        appState.modifiedWalk.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'Modified Random Walk',
                    data: [{x: 0, y: 0}],
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    tension: 0.1,
                    pointRadius: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        title: { display: true, text: 'Step' }
                    },
                    y: {
                        title: { display: true, text: 'Value' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

function updateRandomWalkChart() {
    if (appState.randomWalk.chart) {
        appState.randomWalk.chart.data.datasets[0].data = appState.randomWalk.data;
        appState.randomWalk.chart.update('none');
    }
}

function createConvergenceChart() {
    const canvas = document.getElementById('convergenceChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Create data for convergence visualization
    const powers = [1, 2, 5, 10, 30];
    const datasets = [];
    
    // Define different line styles for each state
    const lineStyles = [
        { color: '#1FB8CD', dash: [], marker: 'circle' },    // State 1: Solid line with circles
        { color: '#FFC185', dash: [5, 5], marker: 'square' }, // State 2: Dashed line with squares
        { color: '#B4413C', dash: [2, 2], marker: 'triangle' }, // State 3: Dotted line with triangles
        { color: '#5D878F', dash: [10, 5], marker: 'diamond' }, // State 4: Long dashed line with diamonds
        { color: '#DB4545', dash: [2, 8], marker: 'star' }   // State 5: Mixed dash with stars
    ];
    
    for (let state = 1; state <= 5; state++) {
        const data = powers.map(power => {
            if (power === 1) return appState.transitionMatrix[0][state - 1];
            const key = 'Q' + power;
            return matrixPowers[key] ? matrixPowers[key][0][state - 1] : 0.2;
        });
        
        const style = lineStyles[state - 1];
        datasets.push({
            label: `→ State ${state}`,
            data: data,
            borderColor: style.color,
            backgroundColor: style.color + '20',
            borderWidth: 2,
            borderDash: style.dash,
            pointStyle: style.marker,
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.1
        });
    }
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: powers.map(p => `Q^${p}`),
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 0.5,
                    title: { 
                        display: true, 
                        text: 'Probability',
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    title: { 
                        display: true, 
                        text: 'Matrix Power',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'Convergence to Stationary Distribution (from State 1)',
                    font: {
                        size: 14
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.y.toFixed(3)}`;
                        }
                    }
                }
            }
        }
    });
}

function initializeFrequencyChart() {
    const canvas = document.getElementById('frequencyChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    appState.simulation.chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['State 1', 'State 2', 'State 3', 'State 4', 'State 5'],
            datasets: [
                {
                    label: 'Theoretical',
                    data: [0.2, 0.2, 0.2, 0.2, 0.2],
                    backgroundColor: 'rgba(31, 184, 205, 0.3)',
                    borderColor: '#1FB8CD',
                    borderWidth: 2
                },
                {
                    label: 'Observed',
                    data: [0, 0, 0, 0, 0],
                    backgroundColor: 'rgba(255, 193, 133, 0.7)',
                    borderColor: '#FFC185',
                    borderWidth: 2
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 0.4,
                    title: { 
                        display: true, 
                        text: 'Frequency',
                        font: {
                            size: 12
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'States',
                        font: {
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'State Visit Frequencies',
                    font: {
                        size: 14
                    },
                    padding: {
                        top: 10,
                        bottom: 20
                    }
                },
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15
                    }
                }
            }
        }
    });
}

function updateFrequencyChart() {
    if (!appState.simulation.chart) return;
    
    const totalSteps = appState.simulation.currentStep;
    if (totalSteps === 0) return;
    
    const frequencies = appState.simulation.frequencies.map(freq => freq / totalSteps);
    appState.simulation.chart.data.datasets[1].data = frequencies;
    appState.simulation.chart.update();
}

function startModifiedWalk() {
    if (appState.modifiedWalk.isRunning) return;
    
    appState.modifiedWalk.isRunning = true;
    const startBtn = document.getElementById('startModWalk');
    if (startBtn) startBtn.disabled = true;
    
    const walkInterval = setInterval(() => {
        if (!appState.modifiedWalk.isRunning) {
            clearInterval(walkInterval);
            return;
        }
        
        // Generate next step: N(phi * current_value, 1)
        const nextValue = normalRandom(appState.modifiedWalk.phi * appState.modifiedWalk.currentValue, 1);
        appState.modifiedWalk.currentValue = nextValue;
        appState.modifiedWalk.currentStep++;
        appState.modifiedWalk.data.push({x: appState.modifiedWalk.currentStep, y: nextValue});
        
        // Keep only last 100 points for performance
        if (appState.modifiedWalk.data.length > 100) {
            appState.modifiedWalk.data.shift();
        }
        
        updateModifiedWalkDisplay();
        updateModifiedWalkChart();
        
        if (appState.modifiedWalk.currentStep >= 1000) {
            pauseModifiedWalk();
        }
    }, 50);
}

function pauseModifiedWalk() {
    appState.modifiedWalk.isRunning = false;
    const startBtn = document.getElementById('startModWalk');
    if (startBtn) startBtn.disabled = false;
}

function resetModifiedWalk() {
    pauseModifiedWalk();
    appState.modifiedWalk = {
        data: [{x: 0, y: 0}],
        currentStep: 0,
        currentValue: 0,
        phi: parseFloat(document.getElementById('phiSlider').value),
        isRunning: false,
        chart: appState.modifiedWalk.chart
    };
    
    updateModifiedWalkDisplay();
    updateModifiedWalkChart();
}

function updateModifiedWalkDisplay() {
    const stepElement = document.getElementById('modWalkStep');
    const valueElement = document.getElementById('modWalkValue');
    
    if (stepElement) {
        stepElement.textContent = appState.modifiedWalk.currentStep;
    }
    
    if (valueElement) {
        valueElement.textContent = appState.modifiedWalk.currentValue.toFixed(2);
    }
}

function updateModifiedWalkChart() {
    if (appState.modifiedWalk.chart) {
        appState.modifiedWalk.chart.data.datasets[0].data = appState.modifiedWalk.data;
        appState.modifiedWalk.chart.update('none');
    }
}

// Global navigation function
window.navigateToSection = navigateToSection;

// CSS for power matrix styling
const style = document.createElement('style');
style.textContent = `
    .power-matrix {
        width: 100%;
        border-collapse: collapse;
        margin-top: 12px;
        font-family: var(--font-family-mono);
        font-size: 12px;
    }
    
    .power-matrix td {
        padding: 4px 8px;
        text-align: center;
        border: 1px solid var(--color-border);
        background: var(--color-surface);
    }
`;
document.head.appendChild(style);