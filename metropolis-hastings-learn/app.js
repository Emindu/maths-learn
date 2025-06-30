// Application data
const appData = {
  coinFlipData: {
    priorLoadedProb: 0.6,
    fairHeadProb: 0.5,
    loadedHeadProb: 0.7,
    observedHeads: 2,
    observedTails: 3,
    calculations: {
      fairLikelihood: 0.0125,
      loadedLikelihood: 0.00794,
      posteriorFair: 0.612,
      posteriorLoaded: 0.388,
      acceptanceFairToLoaded: 0.635,
      acceptanceLoadedToFair: 1.0
    }
  },
  normalTData: {
    observations: [1.2, 1.4, -0.5, 0.3, 0.9, 2.3, 1.0, 0.1, 1.3, 1.9],
    sampleMean: 1.01,
    sampleSize: 10,
    proposalStdOptions: [0.05, 0.9, 3.0],
    acceptanceRates: [0.946, 0.38, 0.122]
  }
};

// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
  initializeNavigation();
  initializeCoinDemo();
  initializeNormalExample();
  initializeVisualization();
  initializePractice();
  
  // Render MathJax
  if (window.MathJax) {
    MathJax.typesetPromise();
  }
});

function initializeNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.section');
  
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetSection = tab.dataset.section;
      
      // Update active tab
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Update active section
      sections.forEach(s => s.classList.remove('active'));
      document.getElementById(targetSection).classList.add('active');
    });
  });
}

// Coin Flip Demo Implementation
function initializeCoinDemo() {
  const startBtn = document.getElementById('start-coin-sim');
  const resetBtn = document.getElementById('reset-coin-sim');
  const canvas = document.getElementById('coin-chain-canvas');
  const ctx = canvas.getContext('2d');
  
  let simulation = {
    running: false,
    currentState: 'fair',
    steps: 0,
    fairVisits: 0,
    loadedVisits: 0,
    chain: [],
    intervalId: null
  };
  
  startBtn.addEventListener('click', () => {
    if (simulation.running) {
      stopCoinSimulation();
    } else {
      startCoinSimulation();
    }
  });
  
  resetBtn.addEventListener('click', resetCoinSimulation);
  
  function startCoinSimulation() {
    simulation.running = true;
    startBtn.textContent = 'Stop Simulation';
    startBtn.classList.remove('btn--primary');
    startBtn.classList.add('btn--secondary');
    
    simulation.intervalId = setInterval(() => {
      simulationStep();
      updateCoinDisplay();
      drawCoinChain();
    }, 500);
  }
  
  function stopCoinSimulation() {
    simulation.running = false;
    startBtn.textContent = 'Start Simulation';
    startBtn.classList.remove('btn--secondary');
    startBtn.classList.add('btn--primary');
    clearInterval(simulation.intervalId);
  }
  
  function resetCoinSimulation() {
    stopCoinSimulation();
    simulation.currentState = 'fair';
    simulation.steps = 0;
    simulation.fairVisits = 0;
    simulation.loadedVisits = 0;
    simulation.chain = [];
    updateCoinDisplay();
    drawCoinChain();
  }
  
  function simulationStep() {
    const { calculations } = appData.coinFlipData;
    const currentIsFair = simulation.currentState === 'fair';
    
    // Propose transition
    const proposedState = currentIsFair ? 'loaded' : 'fair';
    const acceptanceProb = currentIsFair ? 
      calculations.acceptanceFairToLoaded : 
      calculations.acceptanceLoadedToFair;
    
    // Accept or reject
    if (Math.random() < acceptanceProb) {
      simulation.currentState = proposedState;
    }
    
    // Update counts
    simulation.steps++;
    if (simulation.currentState === 'fair') {
      simulation.fairVisits++;
    } else {
      simulation.loadedVisits++;
    }
    
    simulation.chain.push(simulation.currentState);
  }
  
  function updateCoinDisplay() {
    document.getElementById('current-state').textContent = 
      simulation.currentState.charAt(0).toUpperCase() + simulation.currentState.slice(1);
    document.getElementById('coin-steps').textContent = simulation.steps;
    document.getElementById('fair-visits').textContent = simulation.fairVisits;
    document.getElementById('loaded-visits').textContent = simulation.loadedVisits;
  }
  
  function drawCoinChain() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (simulation.chain.length === 0) return;
    
    const width = canvas.width;
    const height = canvas.height;
    const maxPoints = Math.floor(width / 4);
    const startIndex = Math.max(0, simulation.chain.length - maxPoints);
    const visibleChain = simulation.chain.slice(startIndex);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]);
    
    // Horizontal lines
    ctx.beginPath();
    ctx.moveTo(0, height / 4);
    ctx.lineTo(width, height / 4);
    ctx.moveTo(0, 3 * height / 4);
    ctx.lineTo(width, 3 * height / 4);
    ctx.stroke();
    
    // Draw chain
    ctx.setLineDash([]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#2180bd';
    
    ctx.beginPath();
    visibleChain.forEach((state, i) => {
      const x = (i / (visibleChain.length - 1 || 1)) * (width - 40) + 20;
      const y = state === 'fair' ? height / 4 : 3 * height / 4;
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      
      // Draw point
      ctx.fillStyle = state === 'fair' ? '#4CAF50' : '#f44336';
      ctx.fillRect(x - 3, y - 3, 6, 6);
    });
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Fair Coin', 10, height / 4 - 10);
    ctx.fillText('Loaded Coin', 10, 3 * height / 4 - 10);
  }
  
  // Initialize display
  updateCoinDisplay();
  drawCoinChain();
}

// Normal-t Example Implementation
function initializeNormalExample() {
  const runBtn = document.getElementById('run-normal-mcmc');
  const resetBtn = document.getElementById('reset-normal-mcmc');
  const proposalSelect = document.getElementById('proposal-std');
  const numSamplesInput = document.getElementById('num-samples');
  const traceCanvas = document.getElementById('trace-plot');
  const histCanvas = document.getElementById('histogram-plot');
  
  let mcmcResults = null;
  
  runBtn.addEventListener('click', runNormalMCMC);
  resetBtn.addEventListener('click', resetNormalMCMC);
  
  function runNormalMCMC() {
    const proposalStd = parseFloat(proposalSelect.value);
    const numSamples = parseInt(numSamplesInput.value);
    
    runBtn.disabled = true;
    runBtn.textContent = 'Running...';
    
    setTimeout(() => {
      mcmcResults = performNormalMCMC(proposalStd, numSamples);
      updateNormalResults();
      drawTracePlot();
      drawHistogram();
      
      runBtn.disabled = false;
      runBtn.textContent = 'Run MCMC';
    }, 100);
  }
  
  function resetNormalMCMC() {
    mcmcResults = null;
    clearCanvas(traceCanvas);
    clearCanvas(histCanvas);
    document.getElementById('acceptance-rate').textContent = '-';
    document.getElementById('posterior-mean').textContent = '-';
    document.getElementById('eff-sample-size').textContent = '-';
  }
  
  function performNormalMCMC(proposalStd, numSamples) {
    const { observations, sampleMean, sampleSize } = appData.normalTData;
    const samples = [];
    let current = 0; // Starting value
    let accepted = 0;
    
    for (let i = 0; i < numSamples; i++) {
      // Propose new value
      const proposed = current + (Math.random() - 0.5) * 2 * proposalStd;
      
      // Calculate log acceptance ratio
      const currentLogPosterior = logPosterior(current, observations);
      const proposedLogPosterior = logPosterior(proposed, observations);
      const logAlpha = proposedLogPosterior - currentLogPosterior;
      
      // Accept or reject
      if (Math.log(Math.random()) < logAlpha) {
        current = proposed;
        accepted++;
      }
      
      samples.push(current);
    }
    
    const acceptanceRate = accepted / numSamples;
    const posteriorMean = samples.reduce((a, b) => a + b, 0) / samples.length;
    const effectiveSampleSize = calculateESS(samples);
    
    return {
      samples,
      acceptanceRate,
      posteriorMean,
      effectiveSampleSize
    };
  }
  
  function logPosterior(mu, observations) {
    // Log-likelihood: sum of log(N(y_i | mu, 1))
    let logLik = 0;
    for (const y of observations) {
      logLik -= 0.5 * (y - mu) * (y - mu);
    }
    
    // Log-prior: t_3(0, 1) distribution (simplified)
    const logPrior = -2 * Math.log(1 + mu * mu / 3);
    
    return logLik + logPrior;
  }
  
  function calculateESS(samples) {
    // Simplified effective sample size calculation
    const n = samples.length;
    if (n < 10) return n;
    
    // Calculate autocorrelation at lag 1
    const mean = samples.reduce((a, b) => a + b, 0) / n;
    let autoCorr = 0;
    let variance = 0;
    
    for (let i = 0; i < n - 1; i++) {
      autoCorr += (samples[i] - mean) * (samples[i + 1] - mean);
      variance += (samples[i] - mean) * (samples[i] - mean);
    }
    
    autoCorr /= (n - 1);
    variance /= (n - 1);
    
    const rho = autoCorr / variance;
    return Math.round(n * (1 - rho) / (1 + rho));
  }
  
  function updateNormalResults() {
    if (!mcmcResults) return;
    
    document.getElementById('acceptance-rate').textContent = 
      (mcmcResults.acceptanceRate * 100).toFixed(1) + '%';
    document.getElementById('posterior-mean').textContent = 
      mcmcResults.posteriorMean.toFixed(3);
    document.getElementById('eff-sample-size').textContent = 
      mcmcResults.effectiveSampleSize;
  }
  
  function drawTracePlot() {
    if (!mcmcResults) return;
    
    const ctx = traceCanvas.getContext('2d');
    const { samples } = mcmcResults;
    const width = traceCanvas.width;
    const height = traceCanvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Find range
    const minVal = Math.min(...samples);
    const maxVal = Math.max(...samples);
    const range = maxVal - minVal;
    const padding = range * 0.1;
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 30);
    ctx.stroke();
    
    // Draw trace
    ctx.strokeStyle = '#2180bd';
    ctx.lineWidth = 1;
    ctx.beginPath();
    
    samples.forEach((value, i) => {
      const x = 40 + (i / (samples.length - 1)) * (width - 60);
      const y = height - 30 - ((value - minVal + padding) / (range + 2 * padding)) * (height - 50);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Iteration', width / 2, height - 5);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('μ', 0, 0);
    ctx.restore();
  }
  
  function drawHistogram() {
    if (!mcmcResults) return;
    
    const ctx = histCanvas.getContext('2d');
    const { samples } = mcmcResults;
    const width = histCanvas.width;
    const height = histCanvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Create histogram
    const numBins = 20;
    const minVal = Math.min(...samples);
    const maxVal = Math.max(...samples);
    const binWidth = (maxVal - minVal) / numBins;
    const bins = new Array(numBins).fill(0);
    
    samples.forEach(value => {
      const binIndex = Math.min(Math.floor((value - minVal) / binWidth), numBins - 1);
      bins[binIndex]++;
    });
    
    const maxBinCount = Math.max(...bins);
    
    // Draw histogram
    ctx.fillStyle = '#2180bd';
    bins.forEach((count, i) => {
      const x = 40 + (i / numBins) * (width - 60);
      const barWidth = (width - 60) / numBins * 0.8;
      const barHeight = (count / maxBinCount) * (height - 50);
      const y = height - 30 - barHeight;
      
      ctx.fillRect(x, y, barWidth, barHeight);
    });
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.moveTo(40, 20);
    ctx.lineTo(40, height - 30);
    ctx.stroke();
    
    // Labels
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('μ', width / 2, height - 5);
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Frequency', 0, 0);
    ctx.restore();
  }
}

// Visualization Section
function initializeVisualization() {
  const startBtn = document.getElementById('start-viz');
  const pauseBtn = document.getElementById('pause-viz');
  const resetBtn = document.getElementById('reset-viz');
  const targetSelect = document.getElementById('target-dist');
  const stepSizeSlider = document.getElementById('step-size');
  const stepSizeValue = document.getElementById('step-size-value');
  const canvas = document.getElementById('mcmc-viz-canvas');
  const ctx = canvas.getContext('2d');
  
  let vizState = {
    running: false,
    currentX: 0,
    currentY: 0,
    samples: [],
    accepted: 0,
    intervalId: null,
    targetDist: 'normal'
  };
  
  stepSizeSlider.addEventListener('input', () => {
    stepSizeValue.textContent = stepSizeSlider.value;
  });
  
  startBtn.addEventListener('click', () => {
    vizState.running = true;
    vizState.targetDist = targetSelect.value;
    vizState.intervalId = setInterval(vizStep, 100);
  });
  
  pauseBtn.addEventListener('click', () => {
    vizState.running = false;
    clearInterval(vizState.intervalId);
  });
  
  resetBtn.addEventListener('click', () => {
    vizState.running = false;
    clearInterval(vizState.intervalId);
    vizState.currentX = 0;
    vizState.currentY = 0;
    vizState.samples = [];
    vizState.accepted = 0;
    updateVizDisplay();
    drawVisualization();
  });
  
  function vizStep() {
    const stepSize = parseFloat(stepSizeSlider.value);
    
    // Propose new position
    const proposedX = vizState.currentX + (Math.random() - 0.5) * stepSize;
    const proposedY = vizState.currentY + (Math.random() - 0.5) * stepSize;
    
    // Calculate acceptance probability
    const currentLogDensity = getLogDensity(vizState.currentX, vizState.currentY, vizState.targetDist);
    const proposedLogDensity = getLogDensity(proposedX, proposedY, vizState.targetDist);
    const logAlpha = proposedLogDensity - currentLogDensity;
    
    // Accept or reject
    if (Math.log(Math.random()) < logAlpha) {
      vizState.currentX = proposedX;
      vizState.currentY = proposedY;
      vizState.accepted++;
    }
    
    vizState.samples.push({ x: vizState.currentX, y: vizState.currentY });
    
    updateVizDisplay();
    drawVisualization();
  }
  
  function getLogDensity(x, y, distType) {
    switch (distType) {
      case 'normal':
        return -0.5 * (x * x + y * y);
      case 'bimodal':
        const d1 = (x + 2) * (x + 2) + y * y;
        const d2 = (x - 2) * (x - 2) + y * y;
        return Math.log(Math.exp(-0.5 * d1) + Math.exp(-0.5 * d2));
      case 'banana':
        const y_adj = y - x * x / 4;
        return -0.5 * (x * x / 4 + y_adj * y_adj);
      default:
        return -0.5 * (x * x + y * y);
    }
  }
  
  function updateVizDisplay() {
    document.getElementById('viz-samples').textContent = vizState.samples.length;
    const acceptanceRate = vizState.samples.length > 0 ? 
      (vizState.accepted / vizState.samples.length * 100).toFixed(1) : '0';
    document.getElementById('viz-acceptance').textContent = acceptanceRate + '%';
    document.getElementById('viz-x').textContent = vizState.currentX.toFixed(2);
    document.getElementById('viz-y').textContent = vizState.currentY.toFixed(2);
  }
  
  function drawVisualization() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const scale = 50;
    
    // Draw background density
    drawDensityBackground(ctx, width, height, scale, vizState.targetDist);
    
    // Draw sample path
    if (vizState.samples.length > 1) {
      ctx.strokeStyle = '#ff4444';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      vizState.samples.forEach((sample, i) => {
        const x = centerX + sample.x * scale;
        const y = centerY - sample.y * scale;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
    }
    
    // Draw current position
    const currentX = centerX + vizState.currentX * scale;
    const currentY = centerY - vizState.currentY * scale;
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    // Draw axes
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();
  }
  
  function drawDensityBackground(ctx, width, height, scale, distType) {
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;
    
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        const x = (i - width / 2) / scale;
        const y = -(j - height / 2) / scale;
        const density = Math.exp(getLogDensity(x, y, distType));
        
        const pixelIndex = (j * width + i) * 4;
        const intensity = Math.min(255, density * 255);
        
        data[pixelIndex] = 200 - intensity;     // R
        data[pixelIndex + 1] = 200 - intensity; // G
        data[pixelIndex + 2] = 255;             // B
        data[pixelIndex + 3] = 100;             // A
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }
  
  // Initialize
  updateVizDisplay();
  drawVisualization();
}

// Practice Section
function initializePractice() {
  const tuningStdSlider = document.getElementById('tuning-std');
  const tuningStdValue = document.getElementById('tuning-std-value');
  const predictionSpan = document.getElementById('predicted-acceptance');
  
  tuningStdSlider.addEventListener('input', () => {
    const stdValue = parseFloat(tuningStdSlider.value);
    tuningStdValue.textContent = stdValue.toFixed(1);
    
    // Simple heuristic for acceptance rate prediction
    let predictedRate;
    if (stdValue < 0.3) {
      predictedRate = Math.min(95, 60 + stdValue * 100);
    } else if (stdValue > 2.0) {
      predictedRate = Math.max(5, 50 - (stdValue - 1) * 20);
    } else {
      predictedRate = 50 - Math.abs(stdValue - 1) * 20;
    }
    
    predictionSpan.textContent = `~${Math.round(predictedRate)}%`;
  });
}

// Practice exercise answer checking
function checkAnswer(questionNum, correctAnswer) {
  const selectedInput = document.querySelector(`input[name="q${questionNum}"]:checked`);
  const feedbackDiv = document.getElementById(`answer${questionNum}`);
  
  if (!selectedInput) {
    feedbackDiv.textContent = 'Please select an answer.';
    feedbackDiv.className = 'answer-feedback incorrect';
    return;
  }
  
  const selectedValue = selectedInput.value;
  
  if (selectedValue === correctAnswer) {
    feedbackDiv.textContent = 'Correct! Well done.';
    feedbackDiv.className = 'answer-feedback correct';
  } else {
    let explanation = '';
    switch (questionNum) {
      case 1:
        explanation = 'Incorrect. When the proposed state has higher probability (0.5 > 0.3), we always accept (α = min(1, 0.5/0.3) = 1.0).';
        break;
      case 2:
        explanation = 'Incorrect. Large proposal variance leads to big jumps that are often rejected, resulting in low acceptance rate and slow exploration.';
        break;
      case 3:
        explanation = 'Incorrect. Good convergence shows stationary behavior around the target distribution without trends or getting stuck.';
        break;
    }
    feedbackDiv.textContent = `Incorrect. ${explanation}`;
    feedbackDiv.className = 'answer-feedback incorrect';
  }
}

// Utility functions
function clearCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Make checkAnswer global for inline onclick handlers
window.checkAnswer = checkAnswer;