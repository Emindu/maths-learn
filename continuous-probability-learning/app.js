// Continuous Probability Distributions Explorer
class ContinuousDistributionsApp {
    constructor() {
        this.distributions = {
            normal: {
                name: "Normal Distribution",
                symbol: "N(μ,σ²)",
                parameters: ["mean (μ)", "standard deviation (σ)"],
                support: "(-∞, ∞)",
                applications: ["Heights and weights", "Measurement errors", "Test scores", "Natural phenomena"],
                defaultParams: {mean: 0, std: 1},
                paramRanges: {mean: [-5, 5], std: [0.1, 3]}
            },
            exponential: {
                name: "Exponential Distribution",
                symbol: "Exp(λ)",
                parameters: ["rate (λ)"],
                support: "[0, ∞)",
                applications: ["Time between events", "Survival analysis", "Reliability engineering", "Radioactive decay"],
                defaultParams: {rate: 1},
                paramRanges: {rate: [0.1, 3]}
            },
            uniform: {
                name: "Uniform Distribution",
                symbol: "U(a,b)",
                parameters: ["minimum (a)", "maximum (b)"],
                support: "[a, b]",
                applications: ["Random number generation", "Equal probability scenarios", "Monte Carlo simulations"],
                defaultParams: {min: 0, max: 1},
                paramRanges: {min: [-2, 0], max: [1, 3]}
            },
            gamma: {
                name: "Gamma Distribution",
                symbol: "Γ(α,β)",
                parameters: ["shape (α)", "rate (β)"],
                support: "(0, ∞)",
                applications: ["Waiting times", "Rainfall amounts", "Insurance claims", "Queue lengths"],
                defaultParams: {shape: 2, rate: 1},
                paramRanges: {shape: [0.5, 5], rate: [0.5, 3]}
            },
            beta: {
                name: "Beta Distribution",
                symbol: "Beta(α,β)",
                parameters: ["shape α", "shape β"],
                support: "[0, 1]",
                applications: ["Proportions and percentages", "Success rates", "Bayesian priors", "Quality control"],
                defaultParams: {alpha: 2, beta: 2},
                paramRanges: {alpha: [0.5, 5], beta: [0.5, 5]}
            },
            lognormal: {
                name: "Log-Normal Distribution",
                symbol: "LogN(μ,σ²)",
                parameters: ["log-mean (μ)", "log-std (σ)"],
                support: "(0, ∞)",
                applications: ["Stock prices", "Income distribution", "File sizes", "Particle sizes"],
                defaultParams: {logMean: 0, logStd: 1},
                paramRanges: {logMean: [-1, 1], logStd: [0.1, 1.5]}
            }
        };

        this.currentDistribution = 'normal';
        this.currentParams = {...this.distributions.normal.defaultParams};
        this.charts = {};
        this.quizData = this.generateQuizQuestions();
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.selectedAnswer = null;
        
        this.init();
    }

    init() {
        this.setupTabNavigation();
        this.setupOverview();
        this.setupDistributionExplorer();
        this.setupConvergenceLab();
        this.setupMonteCarloStudio();
        this.setupAssessment();
    }

    // Tab Navigation
    setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                // Update active states
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
                
                // Initialize charts for the active tab
                setTimeout(() => this.initializeChartsForTab(targetTab), 100);
            });
        });
    }

    initializeChartsForTab(tabName) {
        switch(tabName) {
            case 'overview':
                this.updateOverviewChart();
                break;
            case 'explorer':
                this.updateDistributionChart();
                break;
        }
    }

    // Overview Section
    setupOverview() {
        const slider = document.getElementById('overviewStdSlider');
        const valueSpan = document.getElementById('overviewStdValue');

        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            valueSpan.textContent = value.toFixed(1);
            this.updateOverviewChart(value);
        });

        this.updateOverviewChart(1.0);
    }

    updateOverviewChart(std = 1.0) {
        const ctx = document.getElementById('overviewChart');
        if (!ctx) return;

        const x = [];
        const pdf = [];
        const cdf = [];

        for (let i = -4; i <= 4; i += 0.1) {
            x.push(i);
            pdf.push(this.normalPDF(i, 0, std));
            cdf.push(this.normalCDF(i, 0, std));
        }

        if (this.charts.overview) {
            this.charts.overview.destroy();
        }

        this.charts.overview = new Chart(ctx, {
            type: 'line',
            data: {
                labels: x.map(val => val.toFixed(1)),
                datasets: [{
                    label: 'PDF',
                    data: pdf,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'CDF',
                    data: cdf,
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 1
                    }
                }
            }
        });
    }

    // Distribution Explorer
    setupDistributionExplorer() {
        // Distribution selection buttons
        const distBtns = document.querySelectorAll('.dist-btn');
        distBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                distBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentDistribution = btn.dataset.dist;
                this.currentParams = {...this.distributions[this.currentDistribution].defaultParams};
                this.updateDistributionInfo();
                this.createParameterControls();
                this.updateDistributionChart();
                this.updateStatistics();
                this.updateProbabilityCalculations();
            });
        });

        // Chart type buttons
        const chartTabBtns = document.querySelectorAll('.chart-tab-btn');
        chartTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                chartTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.updateDistributionChart(btn.dataset.chart);
            });
        });

        // Probability calculator inputs
        const probInputs = document.querySelectorAll('#probA, #probRangeA, #probRangeB');
        probInputs.forEach(input => {
            input.addEventListener('input', () => this.updateProbabilityCalculations());
        });

        // Initialize
        this.updateDistributionInfo();
        this.createParameterControls();
        this.updateDistributionChart();
        this.updateStatistics();
        this.updateProbabilityCalculations();
    }

    updateDistributionInfo() {
        const dist = this.distributions[this.currentDistribution];
        document.getElementById('distName').textContent = dist.name;
        document.getElementById('distSymbol').textContent = dist.symbol;
        document.getElementById('distSupport').textContent = dist.support;
        
        const appList = document.getElementById('appList');
        appList.innerHTML = dist.applications.map(app => `<li>${app}</li>`).join('');
    }

    createParameterControls() {
        const container = document.getElementById('parameterControls');
        const dist = this.distributions[this.currentDistribution];
        
        container.innerHTML = '';
        
        Object.keys(this.currentParams).forEach(param => {
            const range = dist.paramRanges[param];
            const value = this.currentParams[param];
            
            const controlGroup = document.createElement('div');
            controlGroup.className = 'control-group';
            
            controlGroup.innerHTML = `
                <label>${param}: <span id="${param}Value">${value.toFixed(2)}</span></label>
                <input type="range" id="${param}Slider" min="${range[0]}" max="${range[1]}" step="0.01" value="${value}">
            `;
            
            container.appendChild(controlGroup);
            
            const slider = controlGroup.querySelector(`#${param}Slider`);
            const valueSpan = controlGroup.querySelector(`#${param}Value`);
            
            slider.addEventListener('input', (e) => {
                const newValue = parseFloat(e.target.value);
                this.currentParams[param] = newValue;
                valueSpan.textContent = newValue.toFixed(2);
                this.updateDistributionChart();
                this.updateStatistics();
                this.updateProbabilityCalculations();
            });
        });
    }

    updateDistributionChart(chartType = 'pdf') {
        const ctx = document.getElementById('distributionChart');
        if (!ctx) return;

        const dist = this.currentDistribution;
        let xMin, xMax, step;
        
        // Set appropriate ranges for each distribution
        switch(dist) {
            case 'normal':
                xMin = this.currentParams.mean - 4 * this.currentParams.std;
                xMax = this.currentParams.mean + 4 * this.currentParams.std;
                step = (xMax - xMin) / 200;
                break;
            case 'exponential':
                xMin = 0;
                xMax = 5 / this.currentParams.rate;
                step = xMax / 200;
                break;
            case 'uniform':
                xMin = this.currentParams.min - 0.5;
                xMax = this.currentParams.max + 0.5;
                step = (xMax - xMin) / 200;
                break;
            case 'gamma':
                xMin = 0;
                xMax = (this.currentParams.shape + 3) / this.currentParams.rate;
                step = xMax / 200;
                break;
            case 'beta':
                xMin = 0;
                xMax = 1;
                step = 1 / 200;
                break;
            case 'lognormal':
                xMin = 0.01;
                xMax = Math.exp(this.currentParams.logMean + 3 * this.currentParams.logStd);
                step = xMax / 200;
                break;
        }

        const x = [];
        const pdf = [];
        const cdf = [];

        for (let i = xMin; i <= xMax; i += step) {
            x.push(i);
            pdf.push(this.getPDF(dist, i, this.currentParams));
            cdf.push(this.getCDF(dist, i, this.currentParams));
        }

        const datasets = [];
        
        if (chartType === 'pdf' || chartType === 'both') {
            datasets.push({
                label: 'PDF',
                data: pdf,
                borderColor: '#1FB8CD',
                backgroundColor: 'rgba(31, 184, 205, 0.1)',
                fill: chartType === 'pdf',
                tension: 0.4,
                yAxisID: 'y'
            });
        }
        
        if (chartType === 'cdf' || chartType === 'both') {
            datasets.push({
                label: 'CDF',
                data: cdf,
                borderColor: '#FFC185',
                backgroundColor: 'rgba(255, 193, 133, 0.1)',
                fill: false,
                tension: 0.4,
                yAxisID: chartType === 'both' ? 'y1' : 'y'
            });
        }

        if (this.charts.distribution) {
            this.charts.distribution.destroy();
        }

        const scales = {
            y: {
                type: 'linear',
                display: true,
                position: 'left',
                beginAtZero: true
            }
        };

        if (chartType === 'both') {
            scales.y1 = {
                type: 'linear',
                display: true,
                position: 'right',
                max: 1,
                grid: {
                    drawOnChartArea: false,
                }
            };
        }

        this.charts.distribution = new Chart(ctx, {
            type: 'line',
            data: {
                labels: x.map(val => val.toFixed(2)),
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: scales
            }
        });
    }

    updateStatistics() {
        const dist = this.currentDistribution;
        const params = this.currentParams;
        
        const mean = this.getMean(dist, params);
        const variance = this.getVariance(dist, params);
        const mode = this.getMode(dist, params);
        
        document.getElementById('statMean').textContent = mean.toFixed(3);
        document.getElementById('statVariance').textContent = variance.toFixed(3);
        document.getElementById('statMode').textContent = mode.toFixed(3);
    }

    updateProbabilityCalculations() {
        const dist = this.currentDistribution;
        const params = this.currentParams;
        
        const a = parseFloat(document.getElementById('probA').value) || 0;
        const rangeA = parseFloat(document.getElementById('probRangeA').value) || -1;
        const rangeB = parseFloat(document.getElementById('probRangeB').value) || 1;
        
        const probA = this.getCDF(dist, a, params);
        const probRange = this.getCDF(dist, rangeB, params) - this.getCDF(dist, rangeA, params);
        
        document.getElementById('probAResult').textContent = probA.toFixed(3);
        document.getElementById('probRangeResult').textContent = probRange.toFixed(3);
    }

    // Convergence Lab
    setupConvergenceLab() {
        // Convergence tab buttons
        const convTabBtns = document.querySelectorAll('.conv-tab-btn');
        convTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                convTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const panels = document.querySelectorAll('.conv-panel');
                panels.forEach(p => p.classList.remove('active'));
                document.getElementById(`${btn.dataset.conv}-panel`).classList.add('active');
            });
        });

        // CLT controls
        const cltSampleSize = document.getElementById('cltSampleSize');
        const cltNumSamples = document.getElementById('cltNumSamples');
        
        cltSampleSize.addEventListener('input', (e) => {
            document.getElementById('cltSampleSizeValue').textContent = e.target.value;
        });
        
        cltNumSamples.addEventListener('input', (e) => {
            document.getElementById('cltNumSamplesValue').textContent = e.target.value;
        });

        document.getElementById('runCLT').addEventListener('click', () => this.runCLTSimulation());

        // LLN controls
        const llnMaxSize = document.getElementById('llnMaxSize');
        llnMaxSize.addEventListener('input', (e) => {
            document.getElementById('llnMaxSizeValue').textContent = e.target.value;
        });

        document.getElementById('runLLN').addEventListener('click', () => this.runLLNSimulation());
    }

    runCLTSimulation() {
        const sourceDist = document.getElementById('cltSourceDist').value;
        const sampleSize = parseInt(document.getElementById('cltSampleSize').value);
        const numSamples = parseInt(document.getElementById('cltNumSamples').value);

        // Generate sample means
        const sampleMeans = [];
        for (let i = 0; i < numSamples; i++) {
            let sum = 0;
            for (let j = 0; j < sampleSize; j++) {
                sum += this.generateRandom(sourceDist);
            }
            sampleMeans.push(sum / sampleSize);
        }

        // Create histograms
        this.createHistogram('cltSourceChart', this.generateSampleData(sourceDist, 1000), `${sourceDist} Distribution`);
        this.createHistogram('cltResultChart', sampleMeans, `Sample Means (n=${sampleSize})`);
    }

    runLLNSimulation() {
        const dist = document.getElementById('llnDist').value;
        const maxSize = parseInt(document.getElementById('llnMaxSize').value);

        const samples = [];
        const runningAverages = [];
        let sum = 0;

        for (let i = 1; i <= maxSize; i++) {
            const sample = this.generateRandom(dist);
            samples.push(sample);
            sum += sample;
            runningAverages.push(sum / i);
        }

        const trueMean = this.getTrueMean(dist);
        
        this.createConvergenceChart('llnChart', runningAverages, trueMean);
    }

    createHistogram(canvasId, data, title) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Create histogram bins
        const min = Math.min(...data);
        const max = Math.max(...data);
        const numBins = 30;
        const binWidth = (max - min) / numBins;
        const bins = new Array(numBins).fill(0);
        const binLabels = [];

        for (let i = 0; i < numBins; i++) {
            binLabels.push((min + i * binWidth).toFixed(2));
        }

        data.forEach(value => {
            const binIndex = Math.min(Math.floor((value - min) / binWidth), numBins - 1);
            bins[binIndex]++;
        });

        // Normalize to get density
        const totalArea = bins.reduce((sum, count) => sum + count, 0) * binWidth;
        const density = bins.map(count => count / totalArea);

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: binLabels,
                datasets: [{
                    label: title,
                    data: density,
                    backgroundColor: 'rgba(31, 184, 205, 0.7)',
                    borderColor: '#1FB8CD',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Density'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Value'
                        }
                    }
                }
            }
        });
    }

    createConvergenceChart(canvasId, data, trueMean) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        const labels = data.map((_, index) => index + 1);
        const trueMeanLine = new Array(data.length).fill(trueMean);

        if (this.charts[canvasId]) {
            this.charts[canvasId].destroy();
        }

        this.charts[canvasId] = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Running Average',
                    data: data,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: false,
                    tension: 0.1
                }, {
                    label: 'True Mean',
                    data: trueMeanLine,
                    borderColor: '#B4413C',
                    borderDash: [5, 5],
                    fill: false,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Average Value'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Sample Size'
                        }
                    }
                }
            }
        });
    }

    // Monte Carlo Studio
    setupMonteCarloStudio() {
        const mcSampleSize = document.getElementById('mcSampleSize');
        mcSampleSize.addEventListener('input', (e) => {
            document.getElementById('mcSampleSizeValue').textContent = e.target.value;
        });

        document.getElementById('runMC').addEventListener('click', () => this.runMonteCarloSimulation());
    }

    runMonteCarloSimulation() {
        const mcType = document.getElementById('mcType').value;
        const sampleSize = parseInt(document.getElementById('mcSampleSize').value);

        let estimate, trueValue, error;

        switch(mcType) {
            case 'pi':
                ({estimate, trueValue, error} = this.estimatePi(sampleSize));
                break;
            case 'integration':
                ({estimate, trueValue, error} = this.numericalIntegration(sampleSize));
                break;
            case 'probability':
                ({estimate, trueValue, error} = this.complexProbability(sampleSize));
                break;
        }

        document.getElementById('mcEstimate').textContent = estimate.toFixed(4);
        document.getElementById('mcTrueValue').textContent = trueValue.toFixed(4);
        document.getElementById('mcError').textContent = error.toFixed(4);

        this.createMonteCarloVisualization(mcType, sampleSize);
    }

    estimatePi(n) {
        let inside = 0;

        for (let i = 0; i < n; i++) {
            const x = Math.random() * 2 - 1;
            const y = Math.random() * 2 - 1;
            const isInside = x * x + y * y <= 1;
            if (isInside) inside++;
        }

        const estimate = 4 * inside / n;
        const trueValue = Math.PI;
        const error = Math.abs(estimate - trueValue);

        return {estimate, trueValue, error};
    }

    numericalIntegration(n) {
        // Integrate x^2 from 0 to 1 using Monte Carlo
        let sum = 0;

        for (let i = 0; i < n; i++) {
            const x = Math.random();
            const y = x * x;
            sum += y;
        }

        const estimate = sum / n;
        const trueValue = 1/3; // ∫₀¹ x² dx = 1/3
        const error = Math.abs(estimate - trueValue);

        return {estimate, trueValue, error};
    }

    complexProbability(n) {
        // Estimate P(X + Y > 1) where X,Y ~ Uniform(0,1)
        let count = 0;

        for (let i = 0; i < n; i++) {
            const x = Math.random();
            const y = Math.random();
            const satisfies = x + y > 1;
            if (satisfies) count++;
        }

        const estimate = count / n;
        const trueValue = 0.5; // True probability is 1/2
        const error = Math.abs(estimate - trueValue);

        return {estimate, trueValue, error};
    }

    createMonteCarloVisualization(mcType, sampleSize) {
        // Create convergence chart showing how estimate improves with sample size
        const estimates = [];
        let runningSum = 0;
        const maxPoints = Math.min(sampleSize, 1000);

        for (let i = 1; i <= maxPoints; i++) {
            let sample;
            switch(mcType) {
                case 'pi':
                    const x = Math.random() * 2 - 1;
                    const y = Math.random() * 2 - 1;
                    sample = (x * x + y * y <= 1) ? 4 : 0;
                    break;
                case 'integration':
                    sample = Math.random() ** 2;
                    break;
                case 'probability':
                    sample = (Math.random() + Math.random() > 1) ? 1 : 0;
                    break;
            }
            runningSum += sample;
            estimates.push(runningSum / i);
        }

        this.createConvergenceChart('mcConvergenceChart', estimates, this.getTrueValueForMC(mcType));
        
        // Create a simple scatter plot for the MC chart
        this.createMCScatterChart(mcType, Math.min(sampleSize, 500));
    }

    createMCScatterChart(mcType, n) {
        const ctx = document.getElementById('mcChart');
        if (!ctx) return;

        const points = [];
        const colors = [];

        for (let i = 0; i < n; i++) {
            let x, y, inside;
            switch(mcType) {
                case 'pi':
                    x = Math.random() * 2 - 1;
                    y = Math.random() * 2 - 1;
                    inside = x * x + y * y <= 1;
                    break;
                case 'integration':
                    x = Math.random();
                    y = Math.random();
                    inside = y <= x * x;
                    break;
                case 'probability':
                    x = Math.random();
                    y = Math.random();
                    inside = x + y > 1;
                    break;
            }
            points.push({x: x, y: y});
            colors.push(inside ? 'rgba(31, 184, 205, 0.7)' : 'rgba(255, 193, 133, 0.7)');
        }

        if (this.charts.mcChart) {
            this.charts.mcChart.destroy();
        }

        this.charts.mcChart = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Monte Carlo Points',
                    data: points,
                    backgroundColor: colors,
                    pointRadius: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom'
                    },
                    y: {
                        type: 'linear'
                    }
                }
            }
        });
    }

    getTrueValueForMC(mcType) {
        switch(mcType) {
            case 'pi': return Math.PI;
            case 'integration': return 1/3;
            case 'probability': return 0.5;
        }
    }

    // Assessment
    setupAssessment() {
        this.loadQuestion();
        
        document.getElementById('submitAnswer').addEventListener('click', () => this.submitAnswer());
        document.getElementById('nextQuestion').addEventListener('click', () => this.nextQuestion());
    }

    generateQuizQuestions() {
        return [
            {
                question: "Which distribution is characterized by the 'memoryless' property?",
                options: ["Normal", "Exponential", "Uniform", "Gamma"],
                correct: 1,
                explanation: "The exponential distribution has the memoryless property: P(X > s+t | X > s) = P(X > t)"
            },
            {
                question: "What is the support of the Beta distribution?",
                options: ["(-∞, ∞)", "(0, ∞)", "[0, 1]", "[a, b]"],
                correct: 2,
                explanation: "The Beta distribution is defined on the interval [0, 1]"
            },
            {
                question: "According to the Central Limit Theorem, what does the distribution of sample means approach?",
                options: ["Uniform distribution", "Exponential distribution", "Normal distribution", "Gamma distribution"],
                correct: 2,
                explanation: "The CLT states that sample means approach a normal distribution regardless of the original distribution"
            },
            {
                question: "Which parameter controls the rate of decay in an exponential distribution?",
                options: ["μ (mu)", "σ (sigma)", "λ (lambda)", "α (alpha)"],
                correct: 2,
                explanation: "λ (lambda) is the rate parameter that controls how quickly the exponential distribution decays"
            },
            {
                question: "What happens to the variance of sample means as sample size increases?",
                options: ["Increases", "Decreases", "Stays constant", "Becomes negative"],
                correct: 1,
                explanation: "The variance of sample means decreases as sample size increases: Var(X̄) = σ²/n"
            },
            {
                question: "Which distribution is often used to model waiting times until the k-th event?",
                options: ["Normal", "Exponential", "Gamma", "Beta"],
                correct: 2,
                explanation: "The Gamma distribution models the time until the k-th event in a Poisson process"
            },
            {
                question: "What is the relationship between PDF and CDF?",
                options: ["PDF = CDF'", "CDF = PDF'", "PDF = ∫CDF dx", "CDF = ∫PDF dx"],
                correct: 3,
                explanation: "The CDF is the integral of the PDF: F(x) = ∫₋∞ˣ f(t) dt"
            },
            {
                question: "Which distribution is symmetric around its mean?",
                options: ["Exponential", "Log-normal", "Normal", "Gamma"],
                correct: 2,
                explanation: "The normal distribution is symmetric around its mean μ"
            },
            {
                question: "What does the Law of Large Numbers guarantee?",
                options: ["Sample variance converges to population variance", "Sample means converge to population mean", "Sample size affects distribution shape", "All samples are independent"],
                correct: 1,
                explanation: "The LLN states that sample means converge to the population mean as sample size increases"
            },
            {
                question: "Which distribution has support on positive real numbers only?",
                options: ["Normal", "Uniform", "Exponential", "All of the above"],
                correct: 2,
                explanation: "The exponential distribution is defined only for positive values: x ≥ 0"
            }
        ];
    }

    loadQuestion() {
        if (this.currentQuestionIndex >= this.quizData.length) {
            this.showFinalResults();
            return;
        }

        const question = this.quizData[this.currentQuestionIndex];
        
        document.getElementById('questionTitle').textContent = `Question ${this.currentQuestionIndex + 1}`;
        document.getElementById('questionText').textContent = question.question;
        
        const optionsContainer = document.getElementById('questionOptions');
        optionsContainer.innerHTML = '';
        optionsContainer.className = 'question-options';
        
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;
            button.dataset.index = index;
            button.addEventListener('click', () => this.selectOption(button, index));
            optionsContainer.appendChild(button);
        });

        // Update progress
        document.getElementById('currentQuestion').textContent = this.currentQuestionIndex + 1;
        document.getElementById('totalQuestions').textContent = this.quizData.length;
        document.getElementById('maxScore').textContent = this.currentQuestionIndex;
        
        const progress = ((this.currentQuestionIndex) / this.quizData.length) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;

        // Reset UI
        this.selectedAnswer = null;
        document.getElementById('submitAnswer').disabled = true;
        document.getElementById('nextQuestion').classList.add('hidden');
        document.getElementById('feedback').classList.add('hidden');
    }

    selectOption(button, index) {
        // Remove previous selections
        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.classList.remove('selected');
        });
        
        button.classList.add('selected');
        this.selectedAnswer = index;
        document.getElementById('submitAnswer').disabled = false;
    }

    submitAnswer() {
        if (this.selectedAnswer === null) return;
        
        const question = this.quizData[this.currentQuestionIndex];
        const isCorrect = this.selectedAnswer === question.correct;
        
        if (isCorrect) {
            this.score++;
        }

        // Show feedback
        const feedback = document.getElementById('feedback');
        feedback.className = `feedback ${isCorrect ? 'correct' : 'incorrect'}`;
        feedback.innerHTML = `
            <strong>${isCorrect ? 'Correct!' : 'Incorrect'}</strong><br>
            ${question.explanation}
        `;
        feedback.classList.remove('hidden');

        // Highlight correct/incorrect answers
        document.querySelectorAll('.option-btn').forEach((btn, index) => {
            if (index === question.correct) {
                btn.classList.add('correct');
            } else if (index === this.selectedAnswer && !isCorrect) {
                btn.classList.add('incorrect');
            }
            btn.disabled = true;
        });

        document.getElementById('submitAnswer').classList.add('hidden');
        document.getElementById('nextQuestion').classList.remove('hidden');
        document.getElementById('currentScore').textContent = this.score;
    }

    nextQuestion() {
        this.currentQuestionIndex++;
        this.loadQuestion();
    }

    showFinalResults() {
        const percentage = (this.score / this.quizData.length * 100).toFixed(1);
        document.getElementById('questionPanel').innerHTML = `
            <div class="final-results">
                <h2>Quiz Complete!</h2>
                <div class="score-display">
                    <div class="final-score">${this.score}/${this.quizData.length}</div>
                    <div class="percentage">${percentage}%</div>
                </div>
                <p class="performance-message">
                    ${percentage >= 80 ? 'Excellent work!' : 
                      percentage >= 60 ? 'Good job!' : 
                      'Keep studying and try again!'}
                </p>
                <button class="btn btn--primary" onclick="location.reload()">Restart Quiz</button>
            </div>
        `;
    }

    // Mathematical Functions
    normalPDF(x, mean, std) {
        const coeff = 1 / (std * Math.sqrt(2 * Math.PI));
        const exponent = -0.5 * Math.pow((x - mean) / std, 2);
        return coeff * Math.exp(exponent);
    }

    normalCDF(x, mean, std) {
        return 0.5 * (1 + this.erf((x - mean) / (std * Math.sqrt(2))));
    }

    erf(x) {
        // Approximation of error function
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;

        const sign = x < 0 ? -1 : 1;
        x = Math.abs(x);

        const t = 1.0 / (1.0 + p * x);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

        return sign * y;
    }

    exponentialPDF(x, rate) {
        return x >= 0 ? rate * Math.exp(-rate * x) : 0;
    }

    exponentialCDF(x, rate) {
        return x >= 0 ? 1 - Math.exp(-rate * x) : 0;
    }

    uniformPDF(x, min, max) {
        return (x >= min && x <= max) ? 1 / (max - min) : 0;
    }

    uniformCDF(x, min, max) {
        if (x < min) return 0;
        if (x > max) return 1;
        return (x - min) / (max - min);
    }

    gammaPDF(x, shape, rate) {
        if (x <= 0) return 0;
        return (Math.pow(rate, shape) / this.gamma(shape)) * Math.pow(x, shape - 1) * Math.exp(-rate * x);
    }

    betaPDF(x, alpha, beta) {
        if (x <= 0 || x >= 1) return 0;
        const B = this.beta(alpha, beta);
        return Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1) / B;
    }

    lognormalPDF(x, logMean, logStd) {
        if (x <= 0) return 0;
        const coeff = 1 / (x * logStd * Math.sqrt(2 * Math.PI));
        const exponent = -0.5 * Math.pow((Math.log(x) - logMean) / logStd, 2);
        return coeff * Math.exp(exponent);
    }

    gamma(z) {
        // Stirling's approximation for gamma function
        if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * this.gamma(1 - z));
        z -= 1;
        const x = 0.99999999999980993 + 676.5203681218851 / (z + 1) - 1259.1392167224028 / (z + 2) + 771.32342877765313 / (z + 3) - 176.61502916214059 / (z + 4) + 12.507343278686905 / (z + 5) - 0.13857109526572012 / (z + 6) + 9.9843695780195716e-6 / (z + 7) + 1.5056327351493116e-7 / (z + 8);
        const t = z + 7 + 0.5;
        return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
    }

    beta(alpha, beta) {
        return this.gamma(alpha) * this.gamma(beta) / this.gamma(alpha + beta);
    }

    getPDF(dist, x, params) {
        switch(dist) {
            case 'normal':
                return this.normalPDF(x, params.mean, params.std);
            case 'exponential':
                return this.exponentialPDF(x, params.rate);
            case 'uniform':
                return this.uniformPDF(x, params.min, params.max);
            case 'gamma':
                return this.gammaPDF(x, params.shape, params.rate);
            case 'beta':
                return this.betaPDF(x, params.alpha, params.beta);
            case 'lognormal':
                return this.lognormalPDF(x, params.logMean, params.logStd);
        }
    }

    getCDF(dist, x, params) {
        switch(dist) {
            case 'normal':
                return this.normalCDF(x, params.mean, params.std);
            case 'exponential':
                return this.exponentialCDF(x, params.rate);
            case 'uniform':
                return this.uniformCDF(x, params.min, params.max);
            case 'gamma':
                // Approximate using numerical integration
                return this.numericalCDF(dist, x, params);
            case 'beta':
                return this.numericalCDF(dist, x, params);
            case 'lognormal':
                return this.normalCDF(Math.log(x), params.logMean, params.logStd);
        }
    }

    numericalCDF(dist, x, params) {
        // Simple numerical integration for CDF
        let sum = 0;
        const steps = 1000;
        let min = 0;
        let max = x;
        
        if (dist === 'beta') {
            min = 0;
            max = Math.min(x, 1);
        }
        
        const step = (max - min) / steps;
        
        for (let i = 0; i < steps; i++) {
            const xi = min + i * step;
            sum += this.getPDF(dist, xi, params) * step;
        }
        
        return Math.min(sum, 1);
    }

    getMean(dist, params) {
        switch(dist) {
            case 'normal':
                return params.mean;
            case 'exponential':
                return 1 / params.rate;
            case 'uniform':
                return (params.min + params.max) / 2;
            case 'gamma':
                return params.shape / params.rate;
            case 'beta':
                return params.alpha / (params.alpha + params.beta);
            case 'lognormal':
                return Math.exp(params.logMean + params.logStd * params.logStd / 2);
        }
    }

    getVariance(dist, params) {
        switch(dist) {
            case 'normal':
                return params.std * params.std;
            case 'exponential':
                return 1 / (params.rate * params.rate);
            case 'uniform':
                return Math.pow(params.max - params.min, 2) / 12;
            case 'gamma':
                return params.shape / (params.rate * params.rate);
            case 'beta':
                const sum = params.alpha + params.beta;
                return (params.alpha * params.beta) / (sum * sum * (sum + 1));
            case 'lognormal':
                const expVar = Math.exp(params.logStd * params.logStd);
                return Math.exp(2 * params.logMean + params.logStd * params.logStd) * (expVar - 1);
        }
    }

    getMode(dist, params) {
        switch(dist) {
            case 'normal':
                return params.mean;
            case 'exponential':
                return 0;
            case 'uniform':
                return (params.min + params.max) / 2; // Any value in range, using midpoint
            case 'gamma':
                return params.shape > 1 ? (params.shape - 1) / params.rate : 0;
            case 'beta':
                if (params.alpha > 1 && params.beta > 1) {
                    return (params.alpha - 1) / (params.alpha + params.beta - 2);
                }
                return 0.5; // Default for edge cases
            case 'lognormal':
                return Math.exp(params.logMean - params.logStd * params.logStd);
        }
    }

    generateRandom(dist) {
        switch(dist) {
            case 'uniform':
                return Math.random();
            case 'exponential':
                return -Math.log(Math.random());
            case 'normal':
                return this.boxMuller();
            case 'gamma':
                return this.gammaRandom(2, 1);
        }
    }

    generateSampleData(dist, n) {
        const data = [];
        for (let i = 0; i < n; i++) {
            data.push(this.generateRandom(dist));
        }
        return data;
    }

    boxMuller() {
        // Box-Muller transform for normal random variables
        if (this.spare !== undefined) {
            const tmp = this.spare;
            this.spare = undefined;
            return tmp;
        }
        
        const u1 = Math.random();
        const u2 = Math.random();
        const mag = Math.sqrt(-2 * Math.log(u1));
        const z0 = mag * Math.cos(2 * Math.PI * u2);
        const z1 = mag * Math.sin(2 * Math.PI * u2);
        
        this.spare = z1;
        return z0;
    }

    gammaRandom(shape, rate) {
        // Simple gamma random number generation (approximate)
        let sum = 0;
        for (let i = 0; i < Math.floor(shape); i++) {
            sum += -Math.log(Math.random()) / rate;
        }
        return sum;
    }

    getTrueMean(dist) {
        switch(dist) {
            case 'normal': return 2;
            case 'exponential': return 2;
            case 'uniform': return 2;
        }
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ContinuousDistributionsApp();
});