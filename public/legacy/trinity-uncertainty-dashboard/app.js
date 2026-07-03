// Application Data
const uncertaintyData = {
  aleatory: {
    name: "Aleatory Uncertainty",
    definition: "Irreducible randomness of outcomes - the uncertainty that cannot be eliminated even with perfect knowledge",
    color: "#3B82F6",
    examples: [
      "Random placement of car in Monty Hall problem",
      "Measurement uncertainty in sensors", 
      "Sampling uncertainty in data collection",
      "Market volatility during economic events"
    ]
  },
  epistemic: {
    name: "Epistemic Uncertainty",
    definition: "Uncertainty from lack of knowledge - can be reduced through acquiring more information",
    color: "#10B981",
    examples: [
      "Player's uncertainty about car location before host revelation",
      "Model selection uncertainty",
      "Feature selection uncertainty", 
      "Algorithm choice uncertainty"
    ]
  },
  ontological: {
    name: "Ontological Uncertainty",
    definition: "Uncertainty about the fundamental nature of reality - structural changes that are inherently unpredictable",
    color: "#8B5CF6",
    examples: [
      "Host's uncertainty about player's switching strategy",
      "Structural market regime changes",
      "Technological breakthroughs",
      "Political elections and policy changes"
    ]
  }
};

const quizData = [
  {
    question: "Which type of uncertainty can be reduced by acquiring more information?",
    options: ["Aleatory", "Epistemic", "Ontological", "None of the above"],
    correct: 1,
    explanation: "Epistemic uncertainty comes from lack of knowledge and can be reduced by learning more about the system."
  },
  {
    question: "In the Monty Hall problem, what type of uncertainty does the car's random placement represent?",
    options: ["Aleatory", "Epistemic", "Ontological", "All of the above"],
    correct: 0,
    explanation: "The random placement of the car represents irreducible aleatory uncertainty."
  },
  {
    question: "What causes ontological uncertainty in machine learning?",
    options: ["Measurement errors", "Limited training data", "Structural changes in the system", "Algorithm choice"],
    correct: 2,
    explanation: "Ontological uncertainty arises from fundamental changes in the nature of the system being modeled."
  }
];

// Application State
let appState = {
  currentTab: 'overview',
  progress: 0,
  visitedTabs: new Set(['overview']),
  theme: 'light',
  
  // Simulator states
  coinFlips: { total: 0, heads: 0 },
  diceRolls: [],
  activeSimulator: 'coin', // 'coin' or 'dice'
  currentDiceSides: 6,
  
  // Information revelation state
  revealedBoxes: 0,
  
  // Monty Hall game state
  montyHall: {
    carLocation: 0,
    playerChoice: 0,
    hostOpened: 0,
    gamePhase: 'choose', // choose, reveal, decide, end
    stats: { total: 0, stayWins: 0, switchWins: 0 }
  },
  
  // Quiz state
  quiz: {
    currentQuestion: 0,
    score: 0,
    answers: [],
    completed: false
  }
};

// Chart instances
let frequencyChart = null;
let predictionChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
  setupEventListeners();
  updateProgress();
});

function initializeApp() {
  // Load saved state from localStorage if available
  const saved = localStorage.getItem('uncertaintyDashboard');
  if (saved) {
    try {
      const savedState = JSON.parse(saved);
      appState = { ...appState, ...savedState };
    } catch (e) {
      console.log('Could not load saved state');
    }
  }
  
  // Initialize theme
  document.body.setAttribute('data-color-scheme', appState.theme);
  updateThemeToggle();
  
  // Initialize charts
  initializeCharts();
  
  // Initialize quiz
  loadQuizQuestion();
}

function setupEventListeners() {
  // Tab navigation
  document.querySelectorAll('.nav__tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
      const tabName = e.target.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
  
  // Theme toggle
  document.getElementById('themeToggle').addEventListener('click', toggleTheme);
  
  // Coin flip simulator
  document.getElementById('flipCoin').addEventListener('click', flipCoin);
  document.getElementById('coinBias').addEventListener('input', updateBiasDisplay);
  document.getElementById('resetCoin').addEventListener('click', resetCoinData);
  
  // Dice simulator
  document.getElementById('rollDice').addEventListener('click', rollDice);
  document.getElementById('diceSides').addEventListener('change', onDiceSidesChange);
  document.getElementById('resetDice').addEventListener('click', resetDiceData);
  
  // Information revelation
  document.getElementById('revealInfo').addEventListener('click', revealInformation);
  
  // Bias-variance tradeoff
  document.getElementById('complexitySlider').addEventListener('input', updateBiasVariance);
  
  // Regime change simulator
  document.getElementById('triggerChange').addEventListener('click', triggerRegimeChange);
  
  // Monty Hall game
  document.querySelectorAll('.door').forEach(door => {
    door.addEventListener('click', selectDoor);
  });
  document.getElementById('stayButton').addEventListener('click', () => makeDecision('stay'));
  document.getElementById('switchButton').addEventListener('click', () => makeDecision('switch'));
  document.getElementById('resetGame').addEventListener('click', resetMontyHall);
  
  // ML prediction chart
  document.getElementById('confidenceSlider').addEventListener('input', updatePredictionChart);
  
  // Quiz
  document.getElementById('submitAnswer').addEventListener('click', submitAnswer);
  document.getElementById('nextQuestion').addEventListener('click', nextQuestion);
  document.getElementById('retakeQuiz').addEventListener('click', retakeQuiz);
}

// Tab Management
function switchTab(tabName) {
  // Update active tab
  document.querySelectorAll('.nav__tab').forEach(tab => {
    tab.classList.remove('nav__tab--active');
  });
  document.querySelector(`[data-tab="${tabName}"]`).classList.add('nav__tab--active');
  
  // Update tab content
  document.querySelectorAll('.tab-content').forEach(content => {
    content.classList.remove('tab-content--active');
  });
  document.getElementById(tabName).classList.add('tab-content--active');
  
  // Update state
  appState.currentTab = tabName;
  appState.visitedTabs.add(tabName);
  updateProgress();
  
  // Initialize tab-specific features
  if (tabName === 'aleatory') {
    updateFrequencyChart();
  } else if (tabName === 'ml-applications') {
    updatePredictionChart();
  }
}

function updateProgress() {
  const totalTabs = 7;
  const progress = (appState.visitedTabs.size / totalTabs) * 100;
  appState.progress = progress;
  
  document.getElementById('progressFill').style.width = `${progress}%`;
  document.getElementById('progressText').textContent = `${Math.round(progress)}%`;
}

// Theme Management
function toggleTheme() {
  appState.theme = appState.theme === 'light' ? 'dark' : 'light';
  document.body.setAttribute('data-color-scheme', appState.theme);
  updateThemeToggle();
  
  // Update charts for theme change
  if (frequencyChart) updateFrequencyChart();
  if (predictionChart) updatePredictionChart();
}

function updateThemeToggle() {
  const button = document.getElementById('themeToggle');
  button.textContent = appState.theme === 'light' ? '🌙' : '☀️';
}

// Coin Flip Simulator
function flipCoin() {
  const bias = parseFloat(document.getElementById('coinBias').value);
  const isHeads = Math.random() < bias;
  
  appState.coinFlips.total++;
  if (isHeads) {
    appState.coinFlips.heads++;
  }
  
  // Set active simulator
  appState.activeSimulator = 'coin';
  
  // Update display
  document.getElementById('coinDisplay').textContent = isHeads ? '👑' : '🪙';
  document.getElementById('totalFlips').textContent = appState.coinFlips.total;
  document.getElementById('headsCount').textContent = appState.coinFlips.heads;
  document.getElementById('headsRate').textContent = 
    `${((appState.coinFlips.heads / appState.coinFlips.total) * 100).toFixed(1)}%`;
  
  updateFrequencyChart();
}

function updateBiasDisplay() {
  const bias = document.getElementById('coinBias').value;
  document.getElementById('biasValue').textContent = bias;
}

function resetCoinData() {
  appState.coinFlips = { total: 0, heads: 0 };
  
  // Update display
  document.getElementById('totalFlips').textContent = '0';
  document.getElementById('headsCount').textContent = '0';
  document.getElementById('headsRate').textContent = '0%';
  document.getElementById('coinDisplay').textContent = '🪙';
  
  // Update chart if coin is active simulator
  if (appState.activeSimulator === 'coin') {
    updateFrequencyChart();
  }
}

// Dice Simulator
function rollDice() {
  const sides = parseInt(document.getElementById('diceSides').value);
  const result = Math.floor(Math.random() * sides) + 1;
  
  appState.diceRolls.push({ value: result, sides: sides });
  appState.activeSimulator = 'dice';
  appState.currentDiceSides = sides;
  
  document.getElementById('diceResult').textContent = result;
  
  // Update dice display emoji
  const diceEmojis = {6: '🎲', 8: '🎱', 12: '⚡', 20: '🔮'};
  document.getElementById('diceDisplay').textContent = diceEmojis[sides] || '🎲';
  
  updateFrequencyChart();
}

function onDiceSidesChange() {
  const sides = parseInt(document.getElementById('diceSides').value);
  appState.currentDiceSides = sides;
  
  // Update dice display emoji
  const diceEmojis = {6: '🎲', 8: '🎱', 12: '⚡', 20: '🔮'};
  document.getElementById('diceDisplay').textContent = diceEmojis[sides] || '🎲';
  
  // If dice is the active simulator, update the chart
  if (appState.activeSimulator === 'dice') {
    updateFrequencyChart();
  }
}

function resetDiceData() {
  appState.diceRolls = [];
  
  // Update display
  document.getElementById('diceResult').textContent = '-';
  const sides = parseInt(document.getElementById('diceSides').value);
  const diceEmojis = {6: '🎲', 8: '🎱', 12: '⚡', 20: '🔮'};
  document.getElementById('diceDisplay').textContent = diceEmojis[sides] || '🎲';
  
  // Update chart if dice is active simulator
  if (appState.activeSimulator === 'dice') {
    updateFrequencyChart();
  }
}

// Information Revelation Demo
function revealInformation() {
  if (appState.revealedBoxes < 3) {
    const boxes = document.querySelectorAll('.mystery-box');
    const box = boxes[appState.revealedBoxes];
    
    box.classList.add('revealed');
    box.textContent = box.getAttribute('data-value');
    
    appState.revealedBoxes++;
    
    // Update uncertainty level
    const uncertaintyLevel = ((3 - appState.revealedBoxes) / 3) * 100;
    document.getElementById('uncertaintyFill').style.width = `${uncertaintyLevel}%`;
    document.getElementById('uncertaintyPercent').textContent = `${Math.round(uncertaintyLevel)}%`;
    
    if (appState.revealedBoxes === 3) {
      document.getElementById('revealInfo').textContent = 'Reset';
      document.getElementById('revealInfo').onclick = resetRevelation;
    }
  }
}

function resetRevelation() {
  appState.revealedBoxes = 0;
  document.querySelectorAll('.mystery-box').forEach(box => {
    box.classList.remove('revealed');
    box.textContent = '?';
  });
  document.getElementById('uncertaintyFill').style.width = '100%';
  document.getElementById('uncertaintyPercent').textContent = '100%';
  document.getElementById('revealInfo').textContent = 'Reveal Information';
  document.getElementById('revealInfo').onclick = revealInformation;
}

// Bias-Variance Tradeoff
function updateBiasVariance() {
  const complexity = parseInt(document.getElementById('complexitySlider').value);
  
  // Calculate bias and variance based on complexity
  const bias = Math.max(0, 100 - (complexity * 10));
  const variance = Math.min(100, complexity * 10);
  const totalError = bias + variance + 20; // Add some irreducible error
  
  document.getElementById('biasFill').style.width = `${bias}%`;
  document.getElementById('varianceFill').style.width = `${variance}%`;
  document.getElementById('totalErrorFill').style.width = `${Math.min(100, totalError)}%`;
}

// Regime Change Simulator
function triggerRegimeChange() {
  const regime1 = document.getElementById('regime1');
  const regime2 = document.getElementById('regime2');
  const currentRegime = document.getElementById('currentRegime');
  const predictability = document.getElementById('predictability');
  
  // Swap regime colors and update text
  if (regime1.style.backgroundColor === 'rgb(59, 130, 246)') {
    regime1.style.backgroundColor = '#EF4444';
    regime2.style.backgroundColor = '#3B82F6';
    regime1.textContent = 'Crisis Period';
    regime2.textContent = 'Recovery';
    currentRegime.textContent = 'Market Crisis';
    predictability.textContent = 'Very Low';
  } else {
    regime1.style.backgroundColor = '#3B82F6';
    regime2.style.backgroundColor = '#EF4444';
    regime1.textContent = 'Stable Period';
    regime2.textContent = 'New Regime';
    currentRegime.textContent = 'Stable Market';
    predictability.textContent = 'High';
  }
}

// Monty Hall Game
function resetMontyHall() {
  // Reset game state
  appState.montyHall.carLocation = Math.floor(Math.random() * 3) + 1;
  appState.montyHall.playerChoice = 0;
  appState.montyHall.hostOpened = 0;
  appState.montyHall.gamePhase = 'choose';
  
  // Reset UI
  document.querySelectorAll('.door').forEach(door => {
    door.classList.remove('selected', 'opened');
    door.querySelector('.door-content').textContent = '';
  });
  
  document.getElementById('gameStatus').textContent = 'Choose a door to start!';
  document.getElementById('stayButton').style.display = 'none';
  document.getElementById('switchButton').style.display = 'none';
}

function selectDoor(e) {
  if (appState.montyHall.gamePhase !== 'choose') return;
  
  const doorNumber = parseInt(e.currentTarget.getAttribute('data-door'));
  appState.montyHall.playerChoice = doorNumber;
  
  // Update UI
  document.querySelectorAll('.door').forEach(door => {
    door.classList.remove('selected');
  });
  e.currentTarget.classList.add('selected');
  
  // Host opens a door with a goat
  hostOpensDoor();
}

function hostOpensDoor() {
  const availableDoors = [1, 2, 3].filter(door => 
    door !== appState.montyHall.playerChoice && 
    door !== appState.montyHall.carLocation
  );
  
  appState.montyHall.hostOpened = availableDoors[Math.floor(Math.random() * availableDoors.length)];
  
  // Show goat in opened door
  const openedDoor = document.querySelector(`[data-door="${appState.montyHall.hostOpened}"]`);
  openedDoor.classList.add('opened');
  openedDoor.querySelector('.door-content').textContent = '🐐';
  
  // Update game phase and UI
  appState.montyHall.gamePhase = 'decide';
  document.getElementById('gameStatus').textContent = 
    `The host opened door ${appState.montyHall.hostOpened} and revealed a goat! Do you want to stay or switch?`;
  document.getElementById('stayButton').style.display = 'inline-block';
  document.getElementById('switchButton').style.display = 'inline-block';
}

function makeDecision(decision) {
  let finalChoice = appState.montyHall.playerChoice;
  
  if (decision === 'switch') {
    // Find the other unopened door
    finalChoice = [1, 2, 3].find(door => 
      door !== appState.montyHall.playerChoice && 
      door !== appState.montyHall.hostOpened
    );
  }
  
  // Reveal all doors
  document.querySelectorAll('.door').forEach((door, index) => {
    const doorNum = index + 1;
    const content = door.querySelector('.door-content');
    
    if (doorNum === appState.montyHall.carLocation) {
      content.textContent = '🚗';
    } else if (doorNum !== appState.montyHall.hostOpened) {
      content.textContent = '🐐';
    }
  });
  
  // Check if player won
  const won = finalChoice === appState.montyHall.carLocation;
  
  // Update statistics
  appState.montyHall.stats.total++;
  if (decision === 'stay' && won) {
    appState.montyHall.stats.stayWins++;
  } else if (decision === 'switch' && won) {
    appState.montyHall.stats.switchWins++;
  }
  
  // Update UI
  document.getElementById('gameStatus').textContent = 
    won ? `Congratulations! You won by choosing to ${decision}!` : 
          `Sorry, you lost. The car was behind door ${appState.montyHall.carLocation}.`;
  
  document.getElementById('stayButton').style.display = 'none';
  document.getElementById('switchButton').style.display = 'none';
  
  updateMontyHallStats();
  
  appState.montyHall.gamePhase = 'end';
}

function updateMontyHallStats() {
  const stats = appState.montyHall.stats;
  
  document.getElementById('totalGames').textContent = stats.total;
  document.getElementById('stayWins').textContent = stats.stayWins;
  document.getElementById('switchWins').textContent = stats.switchWins;
  
  const stayRate = stats.total > 0 ? (stats.stayWins / stats.total * 100).toFixed(1) : 0;
  const switchRate = stats.total > 0 ? (stats.switchWins / stats.total * 100).toFixed(1) : 67;
  
  document.getElementById('stayRate').textContent = `${stayRate}%`;
  document.getElementById('switchRate').textContent = `${switchRate}%`;
}

// Chart Initialization and Updates
function initializeCharts() {
  // Frequency Chart
  const frequencyCtx = document.getElementById('frequencyChart').getContext('2d');
  frequencyChart = new Chart(frequencyCtx, {
    type: 'bar',
    data: {
      labels: ['Heads', 'Tails'],
      datasets: [{
        label: 'Frequency',
        data: [0, 0],
        backgroundColor: ['#3B82F6', '#EF4444'],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
  
  // Prediction Chart
  const predictionCtx = document.getElementById('predictionChart').getContext('2d');
  predictionChart = new Chart(predictionCtx, {
    type: 'line',
    data: {
      labels: Array.from({length: 20}, (_, i) => i + 1),
      datasets: [{
        label: 'Prediction',
        data: generatePredictionData(0.5),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      },
      layout: {
        padding: 10
      },
      onResize: function(chart, size) {
        // Ensure height stays fixed at 300px
        chart.canvas.style.height = '300px';
      }
    }
  });
}

function updateFrequencyChart() {
  if (!frequencyChart) return;
  
  if (appState.activeSimulator === 'coin') {
    // Coin flip data
    const heads = appState.coinFlips.heads;
    const tails = appState.coinFlips.total - heads;
    
    frequencyChart.data.labels = ['Heads', 'Tails'];
    frequencyChart.data.datasets[0].data = [heads, tails];
    frequencyChart.data.datasets[0].backgroundColor = ['#3B82F6', '#EF4444'];
    frequencyChart.data.datasets[0].label = 'Coin Flips';
  } else if (appState.activeSimulator === 'dice') {
    // Handle legacy data format (convert old numeric arrays to new object format)
    appState.diceRolls = appState.diceRolls.map(roll => {
      if (typeof roll === 'number') {
        return { value: roll, sides: 6 }; // Assume old data was 6-sided
      }
      return roll;
    });
    
    // Dice roll data - filter by current dice sides
    const currentSidesRolls = appState.diceRolls.filter(roll => roll.sides === appState.currentDiceSides);
    
    // Count frequency of each outcome
    const frequencies = new Array(appState.currentDiceSides).fill(0);
    currentSidesRolls.forEach(roll => {
      frequencies[roll.value - 1]++;
    });
    
    // Generate labels (1, 2, 3, ... up to current dice sides)
    const labels = Array.from({length: appState.currentDiceSides}, (_, i) => (i + 1).toString());
    
    // Generate colors - use a gradient from blue to purple
    const colors = generateDiceColors(appState.currentDiceSides);
    
    frequencyChart.data.labels = labels;
    frequencyChart.data.datasets[0].data = frequencies;
    frequencyChart.data.datasets[0].backgroundColor = colors;
    frequencyChart.data.datasets[0].label = `${appState.currentDiceSides}-sided Dice`;
  }
  
  frequencyChart.update();
}

// Helper function to generate colors for dice outcomes
function generateDiceColors(sides) {
  const colors = [];
  for (let i = 0; i < sides; i++) {
    const hue = (240 + (i * 300 / sides)) % 360; // Blue to purple gradient
    colors.push(`hsl(${hue}, 70%, 60%)`);
  }
  return colors;
}

function updatePredictionChart() {
  if (!predictionChart) return;
  
  const confidence = parseFloat(document.getElementById('confidenceSlider').value);
  document.getElementById('confidenceValue').textContent = confidence;
  
  predictionChart.data.datasets[0].data = generatePredictionData(confidence);
  
  // Ensure canvas height stays fixed before updating
  const canvas = document.getElementById('predictionChart');
  canvas.style.height = '300px';
  canvas.style.maxHeight = '300px';
  
  predictionChart.update('none'); // Use 'none' animation mode to prevent height jumping
}

function generatePredictionData(confidence) {
  const baseData = [2, 4, 3, 6, 8, 7, 9, 11, 10, 13, 15, 14, 16, 18, 17, 19, 21, 20, 22, 24];
  const uncertainty = 1 - confidence;
  
  return baseData.map(value => {
    const noise = (Math.random() - 0.5) * uncertainty * 10;
    return Math.max(0, value + noise);
  });
}

// Quiz Management
function loadQuizQuestion() {
  const currentIndex = appState.quiz.currentQuestion;
  if (currentIndex >= quizData.length) {
    showQuizResults();
    return;
  }
  
  const question = quizData[currentIndex];
  
  document.getElementById('questionText').textContent = question.question;
  document.getElementById('quizProgressFill').style.width = 
    `${((currentIndex + 1) / quizData.length) * 100}%`;
  document.getElementById('quizProgressText').textContent = 
    `Question ${currentIndex + 1} of ${quizData.length}`;
  
  // Create option elements
  const optionsContainer = document.getElementById('questionOptions');
  optionsContainer.innerHTML = '';
  
  question.options.forEach((option, index) => {
    const optionElement = document.createElement('div');
    optionElement.className = 'option';
    optionElement.textContent = option;
    optionElement.addEventListener('click', () => selectOption(index));
    optionsContainer.appendChild(optionElement);
  });
  
  // Reset UI state
  document.getElementById('questionFeedback').style.display = 'none';
  document.getElementById('submitAnswer').disabled = true;
  document.getElementById('nextQuestion').style.display = 'none';
}

function selectOption(index) {
  // Remove previous selections
  document.querySelectorAll('.option').forEach(opt => {
    opt.classList.remove('selected');
  });
  
  // Select new option
  document.querySelectorAll('.option')[index].classList.add('selected');
  appState.quiz.selectedAnswer = index;
  document.getElementById('submitAnswer').disabled = false;
}

function submitAnswer() {
  const currentIndex = appState.quiz.currentQuestion;
  const question = quizData[currentIndex];
  const selectedAnswer = appState.quiz.selectedAnswer;
  const isCorrect = selectedAnswer === question.correct;
  
  // Update score
  if (isCorrect) {
    appState.quiz.score++;
  }
  
  // Store answer
  appState.quiz.answers.push({
    question: currentIndex,
    selected: selectedAnswer,
    correct: isCorrect
  });
  
  // Show feedback
  const options = document.querySelectorAll('.option');
  options[question.correct].classList.add('correct');
  if (!isCorrect) {
    options[selectedAnswer].classList.add('incorrect');
  }
  
  // Show explanation
  const feedback = document.getElementById('questionFeedback');
  feedback.innerHTML = `
    <strong>${isCorrect ? 'Correct!' : 'Incorrect.'}</strong><br>
    ${question.explanation}
  `;
  feedback.style.display = 'block';
  
  // Update buttons
  document.getElementById('submitAnswer').style.display = 'none';
  document.getElementById('nextQuestion').style.display = 'inline-block';
}

function nextQuestion() {
  appState.quiz.currentQuestion++;
  loadQuizQuestion();
}

function showQuizResults() {
  const score = appState.quiz.score;
  const total = quizData.length;
  const percentage = Math.round((score / total) * 100);
  
  document.getElementById('quizQuestion').style.display = 'none';
  document.getElementById('quizResults').style.display = 'block';
  
  document.getElementById('finalScore').textContent = `${score}/${total}`;
  document.getElementById('finalPercentage').textContent = `${percentage}%`;
  
  appState.quiz.completed = true;
}

function retakeQuiz() {
  // Reset quiz state
  appState.quiz = {
    currentQuestion: 0,
    score: 0,
    answers: [],
    completed: false,
    selectedAnswer: null
  };
  
  // Reset UI
  document.getElementById('quizQuestion').style.display = 'block';
  document.getElementById('quizResults').style.display = 'none';
  document.getElementById('submitAnswer').style.display = 'inline-block';
  
  loadQuizQuestion();
}

// Initialize bias-variance demo
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(() => {
    updateBiasVariance();
    resetMontyHall();
  }, 100);
});

// Save state periodically
setInterval(() => {
  try {
    localStorage.setItem('uncertaintyDashboard', JSON.stringify(appState));
  } catch (e) {
    console.log('Could not save state');
  }
}, 5000);