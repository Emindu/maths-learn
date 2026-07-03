class StatisticalVisualization {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupVisualizations();
        this.setupQuiz();
        this.currentQuestion = 1;
        this.totalQuestions = 2;
    }

    // Navigation functionality
    setupNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        const sections = document.querySelectorAll('.section');

        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSection = btn.dataset.section;
                
                // Update active nav button
                navButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active section
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');
                
                // Initialize section-specific content
                this.initializeSection(targetSection);
            });
        });
    }

    initializeSection(section) {
        switch(section) {
            case 'mean-std':
                this.initMeanStdVisualization();
                break;
            case 'skewness':
                this.initSkewnessVisualization();
                break;
            case 'kurtosis':
                this.initKurtosisVisualization();
                break;
            case 'practice':
                this.initPracticeQuestions();
                break;
        }
    }

    // Visualization setup
    setupVisualizations() {
        // Initialize all visualizations when DOM is loaded
        setTimeout(() => {
            this.initMeanStdVisualization();
        }, 100);
    }

    // Mean and Standard Deviation Visualization
    initMeanStdVisualization() {
        const canvas = document.getElementById('mean-std-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const slider = document.getElementById('std-slider');
        const stdValue = document.getElementById('std-value');
        const currentStd = document.getElementById('current-std');

        const drawMeanStdChart = (stdDev) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const mean = 70;
            const width = canvas.width;
            const height = canvas.height;
            const margin = 60;
            
            // Draw axes
            this.drawAxes(ctx, width, height, margin, 'Test Scores', 'Frequency');
            
            // Draw normal distribution
            const points = this.generateNormalDistribution(mean, stdDev, 40, 100, 200);
            this.drawDistribution(ctx, points, width, height, margin, '#1FB8CD', `Std Dev: ${stdDev}`);
            
            // Draw mean line
            const meanX = margin + ((mean - 40) / 60) * (width - 2 * margin);
            ctx.beginPath();
            ctx.moveTo(meanX, margin);
            ctx.lineTo(meanX, height - margin);
            ctx.strokeStyle = '#DB4545';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Label mean
            ctx.fillStyle = '#DB4545';
            ctx.font = '14px var(--font-family-base)';
            ctx.fillText(`Mean: ${mean}`, meanX + 5, margin + 20);
        };

        // Slider event listener
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            stdValue.textContent = value;
            currentStd.textContent = value;
            drawMeanStdChart(parseInt(value));
        });

        // Initial draw
        drawMeanStdChart(10);
    }

    // Skewness Visualization
    initSkewnessVisualization() {
        const canvas = document.getElementById('skewness-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const slider = document.getElementById('skew-slider');
        const skewValue = document.getElementById('skew-value');
        const currentSkew = document.getElementById('current-skew');
        const interpretation = document.getElementById('skew-interpretation');

        const drawSkewnessChart = (skewness) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const mean = 70;
            const stdDev = 12;
            const width = canvas.width;
            const height = canvas.height;
            const margin = 60;
            
            // Draw axes
            this.drawAxes(ctx, width, height, margin, 'Test Scores', 'Frequency');
            
            // Draw skewed distribution
            const points = this.generateSkewedDistribution(mean, stdDev, skewness, 30, 110, 200);
            this.drawDistribution(ctx, points, width, height, margin, '#FFC185', `Skewness: ${skewness.toFixed(1)}`);
            
            // Update interpretation
            this.updateSkewnessInterpretation(skewness, interpretation);
        };

        // Slider event listener
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            skewValue.textContent = value.toFixed(1);
            currentSkew.textContent = value.toFixed(1);
            drawSkewnessChart(value);
        });

        // Initial draw
        drawSkewnessChart(0);
    }

    // Kurtosis Visualization
    initKurtosisVisualization() {
        const canvas = document.getElementById('kurtosis-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const slider = document.getElementById('kurt-slider');
        const kurtValue = document.getElementById('kurt-value');
        const currentKurt = document.getElementById('current-kurt');
        const interpretation = document.getElementById('kurt-interpretation');

        const drawKurtosisChart = (kurtosis) => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const mean = 70;
            const stdDev = 10;
            const width = canvas.width;
            const height = canvas.height;
            const margin = 60;
            
            // Draw axes
            this.drawAxes(ctx, width, height, margin, 'Test Scores', 'Frequency');
            
            // Draw normal distribution (reference)
            const normalPoints = this.generateNormalDistribution(mean, stdDev, 30, 110, 200);
            this.drawDistribution(ctx, normalPoints, width, height, margin, '#B4413C', 'Normal (reference)', true);
            
            // Draw kurtotic distribution
            const kurtPoints = this.generateKurtoticDistribution(mean, stdDev, kurtosis, 30, 110, 200);
            this.drawDistribution(ctx, kurtPoints, width, height, margin, '#1FB8CD', `Excess Kurtosis: ${kurtosis.toFixed(1)}`);
            
            // Update interpretation
            this.updateKurtosisInterpretation(kurtosis, interpretation);
        };

        // Slider event listener
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            kurtValue.textContent = value.toFixed(1);
            currentKurt.textContent = value.toFixed(1);
            drawKurtosisChart(value);
        });

        // Initial draw
        drawKurtosisChart(0);
    }

    // Distribution generation functions
    generateNormalDistribution(mean, stdDev, min, max, points) {
        const data = [];
        const step = (max - min) / points;
        
        for (let x = min; x <= max; x += step) {
            const y = this.normalPDF(x, mean, stdDev);
            data.push({ x, y });
        }
        
        return data;
    }

    generateSkewedDistribution(mean, stdDev, skewness, min, max, points) {
        const data = [];
        const step = (max - min) / points;
        
        for (let x = min; x <= max; x += step) {
            let y = this.normalPDF(x, mean, stdDev);
            
            // Apply skewness transformation
            if (skewness !== 0) {
                const z = (x - mean) / stdDev;
                const skewFactor = 1 + skewness * z * Math.exp(-z * z / 2);
                y *= Math.max(0.1, skewFactor);
            }
            
            data.push({ x, y });
        }
        
        // Normalize
        const maxY = Math.max(...data.map(d => d.y));
        return data.map(d => ({ x: d.x, y: d.y / maxY }));
    }

    generateKurtoticDistribution(mean, stdDev, excessKurtosis, min, max, points) {
        const data = [];
        const step = (max - min) / points;
        
        for (let x = min; x <= max; x += step) {
            const z = (x - mean) / stdDev;
            let y = this.normalPDF(x, mean, stdDev);
            
            // Apply kurtosis transformation
            if (excessKurtosis !== 0) {
                const kurtFactor = Math.exp(excessKurtosis * z * z / 6);
                y *= kurtFactor;
            }
            
            data.push({ x, y });
        }
        
        // Normalize
        const maxY = Math.max(...data.map(d => d.y));
        return data.map(d => ({ x: d.x, y: d.y / maxY }));
    }

    normalPDF(x, mean, stdDev) {
        const coefficient = 1 / (stdDev * Math.sqrt(2 * Math.PI));
        const exponent = -0.5 * Math.pow((x - mean) / stdDev, 2);
        return coefficient * Math.exp(exponent);
    }

    // Drawing helper functions
    drawAxes(ctx, width, height, margin, xLabel, yLabel) {
        ctx.strokeStyle = '#5D878F';
        ctx.lineWidth = 2;
        
        // X-axis
        ctx.beginPath();
        ctx.moveTo(margin, height - margin);
        ctx.lineTo(width - margin, height - margin);
        ctx.stroke();
        
        // Y-axis
        ctx.beginPath();
        ctx.moveTo(margin, margin);
        ctx.lineTo(margin, height - margin);
        ctx.stroke();
        
        // Labels
        ctx.fillStyle = '#13343B';
        ctx.font = '14px var(--font-family-base)';
        ctx.textAlign = 'center';
        ctx.fillText(xLabel, width / 2, height - 10);
        
        ctx.save();
        ctx.translate(15, height / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(yLabel, 0, 0);
        ctx.restore();
        
        // Tick marks for x-axis
        ctx.font = '12px var(--font-family-base)';
        for (let i = 0; i <= 6; i++) {
            const x = margin + (i / 6) * (width - 2 * margin);
            const value = 40 + (i / 6) * 60;
            ctx.fillText(Math.round(value), x, height - margin + 20);
        }
    }

    drawDistribution(ctx, points, width, height, margin, color, label, isDashed = false) {
        if (points.length === 0) return;
        
        const maxY = Math.max(...points.map(p => p.y));
        const xRange = Math.max(...points.map(p => p.x)) - Math.min(...points.map(p => p.x));
        const xMin = Math.min(...points.map(p => p.x));
        
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = isDashed ? 2 : 3;
        
        if (isDashed) {
            ctx.setLineDash([5, 5]);
        } else {
            ctx.setLineDash([]);
        }
        
        points.forEach((point, index) => {
            const x = margin + ((point.x - xMin) / xRange) * (width - 2 * margin);
            const y = height - margin - (point.y / maxY) * (height - 2 * margin) * 0.8;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Add label
        ctx.fillStyle = color;
        ctx.font = '14px var(--font-family-base)';
        ctx.textAlign = 'left';
        const labelY = isDashed ? margin + 40 : margin + 20;
        ctx.fillText(label, margin + 10, labelY);
        
        ctx.setLineDash([]);
    }

    updateSkewnessInterpretation(skewness, element) {
        let text = '';
        if (skewness < -0.5) {
            text = 'Negative skewness: Most students perform well, few struggle significantly';
        } else if (skewness > 0.5) {
            text = 'Positive skewness: Most students struggle, few excel dramatically';
        } else {
            text = 'Symmetric distribution: Equal spread on both sides of the mean';
        }
        element.textContent = text;
    }

    updateKurtosisInterpretation(kurtosis, element) {
        let text = '';
        if (kurtosis < -0.5) {
            text = 'Platykurtic: Thin tails, fewer outliers than normal distribution';
        } else if (kurtosis > 0.5) {
            text = 'Leptokurtic: Fat tails, more outliers and extreme values';
        } else {
            text = 'Mesokurtic: Normal distribution tail thickness';
        }
        element.textContent = text;
    }

    // Quiz functionality
    setupQuiz() {
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => this.navigateQuestion(-1));
            nextBtn.addEventListener('click', () => this.navigateQuestion(1));
        }
    }

    initPracticeQuestions() {
        // Initialize practice canvases with predetermined questions
        this.drawPracticeQuestion1();
        this.drawPracticeQuestion2();
        this.setupQuizInteractions();
    }

    drawPracticeQuestion1() {
        const canvas = document.getElementById('practice-canvas-1');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const margin = 40;
        
        ctx.clearRect(0, 0, width, height);
        this.drawAxes(ctx, width, height, margin, 'Values', 'Frequency');
        
        // Draw a right-skewed distribution
        const points = this.generateSkewedDistribution(70, 12, 1.2, 30, 110, 150);
        this.drawDistribution(ctx, points, width, height, margin, '#FFC185', 'Distribution A');
        
        // Store correct answer
        canvas.dataset.correctAnswer = 'positive';
    }

    drawPracticeQuestion2() {
        const canvas = document.getElementById('practice-canvas-2');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        const margin = 40;
        
        ctx.clearRect(0, 0, width, height);
        this.drawAxes(ctx, width, height, margin, 'Values', 'Frequency');
        
        // Draw normal distribution (lower kurtosis)
        const normalPoints = this.generateNormalDistribution(70, 10, 30, 110, 150);
        this.drawDistribution(ctx, normalPoints, width, height, margin, '#DB4545', 'Red Distribution');
        
        // Draw high kurtosis distribution
        const highKurtPoints = this.generateKurtoticDistribution(70, 10, 2, 30, 110, 150);
        this.drawDistribution(ctx, highKurtPoints, width, height, margin, '#1FB8CD', 'Blue Distribution');
        
        // Store correct answer
        canvas.dataset.correctAnswer = 'blue';
    }

    setupQuizInteractions() {
        const questions = document.querySelectorAll('.quiz-question');
        
        questions.forEach((question, index) => {
            const options = question.querySelectorAll('.quiz-option');
            const feedback = question.querySelector('.quiz-feedback');
            
            options.forEach(option => {
                option.addEventListener('click', () => {
                    this.handleQuizAnswer(option, feedback, index + 1);
                });
            });
        });
    }

    handleQuizAnswer(selectedOption, feedback, questionNum) {
        const question = selectedOption.closest('.quiz-question');
        const canvas = question.querySelector('canvas');
        const correctAnswer = canvas.dataset.correctAnswer;
        const userAnswer = selectedOption.dataset.answer;
        const allOptions = question.querySelectorAll('.quiz-option');
        
        // Disable all options
        allOptions.forEach(opt => {
            opt.style.pointerEvents = 'none';
            if (opt.dataset.answer === correctAnswer) {
                opt.classList.add('correct');
            } else if (opt === selectedOption && userAnswer !== correctAnswer) {
                opt.classList.add('incorrect');
            }
        });
        
        // Show feedback
        feedback.classList.add('show');
        if (userAnswer === correctAnswer) {
            feedback.classList.add('correct');
            feedback.textContent = this.getCorrectFeedback(questionNum);
        } else {
            feedback.classList.add('incorrect');
            feedback.textContent = this.getIncorrectFeedback(questionNum, correctAnswer);
        }
    }

    getCorrectFeedback(questionNum) {
        const feedbacks = {
            1: "Correct! This distribution shows positive skewness with a long tail to the right.",
            2: "Excellent! The blue distribution has higher kurtosis (fatter tails) than the red one."
        };
        return feedbacks[questionNum] || "Correct!";
    }

    getIncorrectFeedback(questionNum, correctAnswer) {
        const feedbacks = {
            1: {
                negative: "Not quite. Look at which side has the longer tail.",
                normal: "Close, but notice the asymmetry in the distribution.",
                positive: "Correct answer highlighted above."
            },
            2: {
                red: "The red distribution has normal tails. Look for fatter tails.",
                blue: "Correct answer highlighted above.",
                same: "Look carefully at the tail thickness - they're different!"
            }
        };
        return feedbacks[questionNum]?.[correctAnswer] || "Try again!";
    }

    navigateQuestion(direction) {
        const questions = document.querySelectorAll('.quiz-question');
        const prevBtn = document.getElementById('prev-question');
        const nextBtn = document.getElementById('next-question');
        const currentQuestionSpan = document.getElementById('current-question');
        
        // Hide current question
        questions[this.currentQuestion - 1].classList.remove('active');
        
        // Update current question
        this.currentQuestion += direction;
        
        // Show new question
        questions[this.currentQuestion - 1].classList.add('active');
        
        // Update navigation buttons
        prevBtn.disabled = this.currentQuestion === 1;
        nextBtn.disabled = this.currentQuestion === this.totalQuestions;
        
        // Update progress
        currentQuestionSpan.textContent = this.currentQuestion;
        
        if (this.currentQuestion === this.totalQuestions) {
            nextBtn.textContent = 'Finish';
        } else {
            nextBtn.textContent = 'Next';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StatisticalVisualization();
});