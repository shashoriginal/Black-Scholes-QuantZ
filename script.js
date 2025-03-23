// Black-Scholes Option Pricing Model - Core Functions
document.addEventListener('DOMContentLoaded', function() {
    // Render mathematical formulas using KaTeX
    renderFormulas();
    
    // Set up event listeners for the various interactive elements
    setupEventListeners();
    
    // Initialize the Black-Scholes calculator
    initializeCalculator();
    
    // Initialize all simulations
    initializeSimulations();
    
    // Initialize practice problems
    initializePracticeProblems();
    
    // Render formula descriptions
    renderFormulaDescriptions();
});

// --------------------------------------------------
// Mathematical Functions for Black-Scholes
// --------------------------------------------------

// Standard normal cumulative distribution function
function normCDF(x) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;
    
    const sign = (x < 0) ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2.0);
    
    const t = 1.0 / (1.0 + p * x);
    const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return 0.5 * (1.0 + sign * erf);
}

// Standard normal probability density function
function normPDF(x) {
    return (1.0 / Math.sqrt(2.0 * Math.PI)) * Math.exp(-0.5 * x * x);
}

// Black-Scholes d1 and d2 calculations
function calculateD1(S, K, r, sigma, t) {
    return (Math.log(S / K) + (r + 0.5 * sigma * sigma) * t) / (sigma * Math.sqrt(t));
}

function calculateD2(d1, sigma, t) {
    return d1 - sigma * Math.sqrt(t);
}

// Black-Scholes option pricing formulas
function calculateCallPrice(S, K, r, sigma, t) {
    const d1 = calculateD1(S, K, r, sigma, t);
    const d2 = calculateD2(d1, sigma, t);
    
    return S * normCDF(d1) - K * Math.exp(-r * t) * normCDF(d2);
}

function calculatePutPrice(S, K, r, sigma, t) {
    const d1 = calculateD1(S, K, r, sigma, t);
    const d2 = calculateD2(d1, sigma, t);
    
    return K * Math.exp(-r * t) * normCDF(-d2) - S * normCDF(-d1);
}

// Calculating option Greeks
function calculateDelta(S, K, r, sigma, t, optionType) {
    const d1 = calculateD1(S, K, r, sigma, t);
    
    if (optionType === 'call') {
        return normCDF(d1);
    } else {
        return normCDF(d1) - 1;
    }
}

function calculateGamma(S, K, r, sigma, t) {
    const d1 = calculateD1(S, K, r, sigma, t);
    
    return normPDF(d1) / (S * sigma * Math.sqrt(t));
}

function calculateTheta(S, K, r, sigma, t, optionType) {
    const d1 = calculateD1(S, K, r, sigma, t);
    const d2 = calculateD2(d1, sigma, t);
    
    const firstTerm = -(S * sigma * normPDF(d1)) / (2 * Math.sqrt(t));
    
    if (optionType === 'call') {
        const secondTerm = -r * K * Math.exp(-r * t) * normCDF(d2);
        return (firstTerm + secondTerm) / 365; // Convert to daily theta
    } else {
        const secondTerm = r * K * Math.exp(-r * t) * normCDF(-d2);
        return (firstTerm + secondTerm) / 365; // Convert to daily theta
    }
}

function calculateVega(S, K, r, sigma, t) {
    const d1 = calculateD1(S, K, r, sigma, t);
    
    return S * Math.sqrt(t) * normPDF(d1) / 100; // Convert to 1% change in volatility
}

function calculateRho(S, K, r, sigma, t, optionType) {
    const d1 = calculateD1(S, K, r, sigma, t);
    const d2 = calculateD2(d1, sigma, t);
    
    if (optionType === 'call') {
        return K * t * Math.exp(-r * t) * normCDF(d2) / 100; // Convert to 1% change in interest rate
    } else {
        return -K * t * Math.exp(-r * t) * normCDF(-d2) / 100;
    }
}

// --------------------------------------------------
// Rendering Mathematical Formulas
// --------------------------------------------------

function renderFormulas() {
    // Render Black-Scholes formulas
    if (document.getElementById('call-formula')) {
        katex.render('C = S \\cdot N(d_1) - K \\cdot e^{-rt} \\cdot N(d_2)', document.getElementById('call-formula'));
    }
    
    if (document.getElementById('put-formula')) {
        katex.render('P = K \\cdot e^{-rt} \\cdot N(-d_2) - S \\cdot N(-d_1)', document.getElementById('put-formula'));
    }
    
    if (document.getElementById('d1-formula')) {
        katex.render('d_1 = \\frac{\\ln(\\frac{S}{K}) + (r + \\frac{\\sigma^2}{2})t}{\\sigma\\sqrt{t}}', document.getElementById('d1-formula'));
    }
    
    if (document.getElementById('d2-formula')) {
        katex.render('d_2 = d_1 - \\sigma\\sqrt{t}', document.getElementById('d2-formula'));
    }
    
    // Render Greek formulas
    if (document.getElementById('delta-formula')) {
        katex.render('\\Delta_{call} = N(d_1) \\quad \\Delta_{put} = N(d_1) - 1', document.getElementById('delta-formula'));
    }
    
    if (document.getElementById('gamma-formula')) {
        katex.render('\\Gamma = \\frac{N\'(d_1)}{S\\sigma\\sqrt{t}}', document.getElementById('gamma-formula'));
    }
    
    if (document.getElementById('theta-formula')) {
        katex.render('\\Theta_{call} = -\\frac{S\\sigma N\'(d_1)}{2\\sqrt{t}} - rKe^{-rt}N(d_2)', document.getElementById('theta-formula'));
    }
    
    if (document.getElementById('vega-formula')) {
        katex.render('\\nu = S\\sqrt{t}N\'(d_1)', document.getElementById('vega-formula'));
    }
    
    if (document.getElementById('rho-formula')) {
        katex.render('\\rho_{call} = Kte^{-rt}N(d_2) \\quad \\rho_{put} = -Kte^{-rt}N(-d_2)', document.getElementById('rho-formula'));
    }
}

// New function to render formula descriptions
function renderFormulaDescriptions() {
    const formulaItems = document.querySelectorAll('.formula-explanation li');
    
    formulaItems.forEach(item => {
        // Get the text content and clean it for LaTeX rendering
        let text = item.textContent.trim();
        
        // Process text to properly format for LaTeX
        // Replace escaped parentheses with normal ones
        text = text.replace(/\\\(/g, '(').replace(/\\\)/g, ')');
        
        // Extract variable parts for LaTeX rendering
        const parts = text.split('=');
        if (parts.length === 2) {
            const variable = parts[0].trim();
            const description = parts[1].trim();
            
            // Create properly formatted LaTeX expressions with specific styling
            let latexExpression;
            
            // Handle specific cases
            if (variable.includes('C')) {
                latexExpression = "C = \\text{ Call option price}";
            } else if (variable.includes('P')) {
                latexExpression = "P = \\text{ Put option price}";
            } else if (variable.includes('S')) {
                latexExpression = "S = \\text{ Current stock price}";
            } else if (variable.includes('K')) {
                latexExpression = "K = \\text{ Strike price}";
            } else if (variable.includes('r')) {
                latexExpression = "r = \\text{ Risk-free interest rate}";
            } else if (variable.includes('t')) {
                latexExpression = "t = \\text{ Time to expiration (in years)}";
            } else if (variable.includes('sigma')) {
                latexExpression = "\\sigma = \\text{ Volatility of the stock}";
            } else if (variable.includes('N')) {
                latexExpression = "N(\\cdot) = \\text{ Cumulative normal distribution function}";
            } else {
                // For other cases, just wrap the description in \text
                latexExpression = `${variable} = \\text{ ${description}}`;
            }
            
            // Create a new span to hold the rendered formula
            const span = document.createElement('span');
            
            // Try to render with KaTeX
            try {
                katex.render(latexExpression, span, {
                    throwOnError: false,
                    displayMode: true,
                    trust: true,
                    strict: false
                });
                
                // Replace the content of the li with the rendered formula
                item.innerHTML = '';
                item.appendChild(span);
            } catch (e) {
                console.error('Error rendering formula:', e);
                console.error('Failed formula:', latexExpression);
            }
        }
    });
}

// --------------------------------------------------
// Interactive Simulations
// --------------------------------------------------

function initializeSimulations() {
    initializeGBMSimulation();
    initializeSensitivityAnalysis();
    initializeGreeksVisualization();
}

// Geometric Brownian Motion Simulation
function initializeGBMSimulation() {
    const runButton = document.getElementById('run-gbm');
    if (!runButton) return;
    
    runButton.addEventListener('click', function() {
        const s0 = parseFloat(document.getElementById('gbm-s0').value);
        const mu = parseFloat(document.getElementById('gbm-mu').value) / 100; // Convert from % to decimal
        const sigma = parseFloat(document.getElementById('gbm-sigma').value) / 100;
        const T = parseFloat(document.getElementById('gbm-t').value);
        const paths = parseInt(document.getElementById('gbm-paths').value);
        
        simulateGBM(s0, mu, sigma, T, paths);
    });
    
    // Run a default simulation on page load
    setTimeout(() => {
        simulateGBM(100, 0.05, 0.2, 1, 10);
    }, 1000);
}

function simulateGBM(s0, mu, sigma, T, paths) {
    const plotDiv = document.getElementById('gbm-plot');
    
    // Number of time steps
    const steps = 252; // Trading days in a year
    const dt = T / steps;
    
    // Generate time points
    const timePoints = Array.from({ length: steps + 1 }, (_, i) => i * dt);
    
    // Generate path data
    const data = [];
    
    // Add reference line for initial price
    data.push({
        x: [0, T],
        y: [s0, s0],
        mode: 'lines',
        line: {
            dash: 'dash',
            width: 1,
            color: 'rgba(0, 0, 0, 0.5)'
        },
        name: 'Initial Price'
    });
    
    // Generate random paths
    for (let path = 0; path < paths; path++) {
        const prices = [s0];
        let currentPrice = s0;
        
        for (let i = 1; i <= steps; i++) {
            // Generate random normal increment using Box-Muller transform
            const u1 = Math.random();
            const u2 = Math.random();
            const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            
            // Update price using GBM equation
            currentPrice = currentPrice * Math.exp((mu - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * z);
            prices.push(currentPrice);
        }
        
        // Add this path to the data
        data.push({
            x: timePoints,
            y: prices,
            mode: 'lines',
            name: `Path ${path + 1}`
        });
    }
    
    // Set plot layout
    const layout = {
        title: 'Stock Price Simulation with Geometric Brownian Motion',
        xaxis: {
            title: 'Time (years)'
        },
        yaxis: {
            title: 'Stock Price ($)'
        },
        showlegend: true,
        legend: {
            x: 1,
            xanchor: 'right',
            y: 1
        }
    };
    
    // Create the plot
    Plotly.newPlot(plotDiv, data, layout);
}

// Option Price Sensitivity Analysis
function initializeSensitivityAnalysis() {
    // Stock Price Sensitivity
    const runSensitivityS = document.getElementById('run-sensitivity-s');
    if (runSensitivityS) {
        runSensitivityS.addEventListener('click', function() {
            runStockPriceSensitivity();
        });
        
        // Run default analysis on page load
        setTimeout(() => {
            runStockPriceSensitivity();
        }, 1500);
    }
    
    // Volatility Sensitivity
    const runSensitivityVol = document.getElementById('run-sensitivity-vol');
    if (runSensitivityVol) {
        runSensitivityVol.addEventListener('click', function() {
            runVolatilitySensitivity();
        });
    }
    
    // Time Sensitivity
    const runSensitivityTime = document.getElementById('run-sensitivity-time');
    if (runSensitivityTime) {
        runSensitivityTime.addEventListener('click', function() {
            runTimeSensitivity();
        });
    }
    
    // Interest Rate Sensitivity
    const runSensitivityInterest = document.getElementById('run-sensitivity-interest');
    if (runSensitivityInterest) {
        runSensitivityInterest.addEventListener('click', function() {
            runInterestRateSensitivity();
        });
    }
    
    // Set up tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab pane
            const tabPanes = document.querySelectorAll('.tab-pane');
            tabPanes.forEach(pane => pane.classList.remove('active'));
            document.getElementById(tabName).classList.add('active');
            
            // Run the appropriate sensitivity analysis
            if (tabName === 'stock-price') {
                runStockPriceSensitivity();
            } else if (tabName === 'volatility') {
                runVolatilitySensitivity();
            } else if (tabName === 'time') {
                runTimeSensitivity();
            } else if (tabName === 'interest') {
                runInterestRateSensitivity();
            }
        });
    });
}

function runStockPriceSensitivity() {
    const K = parseFloat(document.getElementById('sensitivity-k').value);
    const t = parseFloat(document.getElementById('sensitivity-t').value);
    const r = parseFloat(document.getElementById('sensitivity-r').value) / 100;
    const sigma = parseFloat(document.getElementById('sensitivity-sigma').value) / 100;
    
    const plotDiv = document.getElementById('sensitivity-s-plot');
    
    // Generate stock prices
    const sValues = Array.from({ length: 100 }, (_, i) => K * 0.5 + i * K * 0.02);
    
    // Calculate option prices for these stock prices
    const callPrices = sValues.map(s => calculateCallPrice(s, K, r, sigma, t));
    const putPrices = sValues.map(s => calculatePutPrice(s, K, r, sigma, t));
    
    const data = [
        {
            x: sValues,
            y: callPrices,
            mode: 'lines',
            name: 'Call Option Price',
            line: {
                color: 'blue'
            }
        },
        {
            x: sValues,
            y: putPrices,
            mode: 'lines',
            name: 'Put Option Price',
            line: {
                color: 'red'
            }
        },
        {
            x: [K, K],
            y: [0, Math.max(...callPrices, ...putPrices)],
            mode: 'lines',
            name: 'Strike Price',
            line: {
                dash: 'dash',
                color: 'green'
            }
        }
    ];
    
    const layout = {
        title: 'Option Price vs. Stock Price',
        xaxis: {
            title: 'Stock Price ($)'
        },
        yaxis: {
            title: 'Option Price ($)'
        }
    };
    
    Plotly.newPlot(plotDiv, data, layout);
}

function runVolatilitySensitivity() {
    const K = parseFloat(document.getElementById('sensitivity-k-vol').value);
    const t = parseFloat(document.getElementById('sensitivity-t-vol').value);
    const r = parseFloat(document.getElementById('sensitivity-r-vol').value) / 100;
    const S = K; // At-the-money for simplicity
    
    const plotDiv = document.getElementById('sensitivity-vol-plot');
    
    // Generate volatility values (1% to 100%)
    const sigmaValues = Array.from({ length: 100 }, (_, i) => (i + 1) / 100);
    
    // Calculate option prices for these volatilities
    const callPrices = sigmaValues.map(sigma => calculateCallPrice(S, K, r, sigma, t));
    const putPrices = sigmaValues.map(sigma => calculatePutPrice(S, K, r, sigma, t));
    
    const data = [
        {
            x: sigmaValues.map(sigma => sigma * 100), // Convert to percentage for display
            y: callPrices,
            mode: 'lines',
            name: 'Call Option Price',
            line: {
                color: 'blue'
            }
        },
        {
            x: sigmaValues.map(sigma => sigma * 100),
            y: putPrices,
            mode: 'lines',
            name: 'Put Option Price',
            line: {
                color: 'red'
            }
        }
    ];
    
    const layout = {
        title: 'Option Price vs. Volatility',
        xaxis: {
            title: 'Volatility (%)'
        },
        yaxis: {
            title: 'Option Price ($)'
        }
    };
    
    Plotly.newPlot(plotDiv, data, layout);
}

function runTimeSensitivity() {
    const K = parseFloat(document.getElementById('sensitivity-k-time').value);
    const S = K; // At-the-money for simplicity
    const r = parseFloat(document.getElementById('sensitivity-r-time').value) / 100;
    const sigma = parseFloat(document.getElementById('sensitivity-sigma-time').value) / 100;
    
    const plotDiv = document.getElementById('sensitivity-time-plot');
    
    // Generate time values (0.01 to 3 years)
    const tValues = Array.from({ length: 100 }, (_, i) => (i + 1) / 33);
    
    // Calculate option prices for these times to expiry
    const callPrices = tValues.map(t => calculateCallPrice(S, K, r, sigma, t));
    const putPrices = tValues.map(t => calculatePutPrice(S, K, r, sigma, t));
    
    const data = [
        {
            x: tValues,
            y: callPrices,
            mode: 'lines',
            name: 'Call Option Price',
            line: {
                color: 'blue'
            }
        },
        {
            x: tValues,
            y: putPrices,
            mode: 'lines',
            name: 'Put Option Price',
            line: {
                color: 'red'
            }
        }
    ];
    
    const layout = {
        title: 'Option Price vs. Time to Expiry',
        xaxis: {
            title: 'Time to Expiry (years)'
        },
        yaxis: {
            title: 'Option Price ($)'
        }
    };
    
    Plotly.newPlot(plotDiv, data, layout);
}

function runInterestRateSensitivity() {
    const K = parseFloat(document.getElementById('sensitivity-k-interest').value);
    const S = K; // At-the-money for simplicity
    const t = parseFloat(document.getElementById('sensitivity-t-interest').value);
    const sigma = parseFloat(document.getElementById('sensitivity-sigma-interest').value) / 100;
    
    const plotDiv = document.getElementById('sensitivity-interest-plot');
    
    // Generate interest rate values (0% to 20%)
    const rValues = Array.from({ length: 100 }, (_, i) => i / 500);
    
    // Calculate option prices for these interest rates
    const callPrices = rValues.map(r => calculateCallPrice(S, K, r, sigma, t));
    const putPrices = rValues.map(r => calculatePutPrice(S, K, r, sigma, t));
    
    const data = [
        {
            x: rValues.map(r => r * 100), // Convert to percentage for display
            y: callPrices,
            mode: 'lines',
            name: 'Call Option Price',
            line: {
                color: 'blue'
            }
        },
        {
            x: rValues.map(r => r * 100),
            y: putPrices,
            mode: 'lines',
            name: 'Put Option Price',
            line: {
                color: 'red'
            }
        }
    ];
    
    const layout = {
        title: 'Option Price vs. Risk-free Interest Rate',
        xaxis: {
            title: 'Risk-free Interest Rate (%)'
        },
        yaxis: {
            title: 'Option Price ($)'
        }
    };
    
    Plotly.newPlot(plotDiv, data, layout);
}

// Greeks Visualization
function initializeGreeksVisualization() {
    const runGreeksButton = document.getElementById('run-greeks');
    if (!runGreeksButton) return;
    
    runGreeksButton.addEventListener('click', function() {
        visualizeGreeks();
    });
    
    // Run default visualization on page load
    setTimeout(() => {
        visualizeGreeks();
    }, 2000);
}

function visualizeGreeks() {
    const K = parseFloat(document.getElementById('greeks-k').value);
    const t = parseFloat(document.getElementById('greeks-t').value);
    const r = parseFloat(document.getElementById('greeks-r').value) / 100;
    const sigma = parseFloat(document.getElementById('greeks-sigma').value) / 100;
    const optionType = document.getElementById('greeks-type').value;
    const greekType = document.getElementById('greek-select').value;
    
    const plotDiv = document.getElementById('greeks-plot');
    
    // Generate stock prices
    const sValues = Array.from({ length: 100 }, (_, i) => K * 0.5 + i * K * 0.02);
    
    // Calculate the selected Greek for these stock prices
    let greekValues, title;
    
    switch (greekType) {
        case 'delta':
            greekValues = sValues.map(s => calculateDelta(s, K, r, sigma, t, optionType));
            title = 'Delta vs. Stock Price';
            break;
        case 'gamma':
            greekValues = sValues.map(s => calculateGamma(s, K, r, sigma, t));
            title = 'Gamma vs. Stock Price';
            break;
        case 'theta':
            greekValues = sValues.map(s => calculateTheta(s, K, r, sigma, t, optionType));
            title = 'Theta vs. Stock Price';
            break;
        case 'vega':
            greekValues = sValues.map(s => calculateVega(s, K, r, sigma, t));
            title = 'Vega vs. Stock Price';
            break;
        case 'rho':
            greekValues = sValues.map(s => calculateRho(s, K, r, sigma, t, optionType));
            title = 'Rho vs. Stock Price';
            break;
    }
    
    const data = [
        {
            x: sValues,
            y: greekValues,
            mode: 'lines',
            name: `${greekType.charAt(0).toUpperCase() + greekType.slice(1)} (${optionType})`,
            line: {
                color: optionType === 'call' ? 'blue' : 'red'
            }
        },
        {
            x: [K, K],
            y: [Math.min(...greekValues), Math.max(...greekValues)],
            mode: 'lines',
            name: 'Strike Price',
            line: {
                dash: 'dash',
                color: 'green'
            }
        }
    ];
    
    const layout = {
        title: title,
        xaxis: {
            title: 'Stock Price ($)'
        },
        yaxis: {
            title: greekType.charAt(0).toUpperCase() + greekType.slice(1)
        }
    };
    
    Plotly.newPlot(plotDiv, data, layout);
}

// --------------------------------------------------
// Black-Scholes Calculator
// --------------------------------------------------

function initializeCalculator() {
    const calculateButton = document.getElementById('calculate');
    if (!calculateButton) return;
    
    calculateButton.addEventListener('click', function() {
        // Get input values
        const S = parseFloat(document.getElementById('calc-s').value);
        const K = parseFloat(document.getElementById('calc-k').value);
        const t = parseFloat(document.getElementById('calc-t').value);
        const r = parseFloat(document.getElementById('calc-r').value) / 100; // Convert from percentage
        const sigma = parseFloat(document.getElementById('calc-sigma').value) / 100;
        const optionType = document.querySelector('input[name="option-type"]:checked').value;
        
        // Calculate option price
        let optionPrice;
        if (optionType === 'call') {
            optionPrice = calculateCallPrice(S, K, r, sigma, t);
        } else {
            optionPrice = calculatePutPrice(S, K, r, sigma, t);
        }
        
        // Calculate Greeks
        const delta = calculateDelta(S, K, r, sigma, t, optionType);
        const gamma = calculateGamma(S, K, r, sigma, t);
        const theta = calculateTheta(S, K, r, sigma, t, optionType);
        const vega = calculateVega(S, K, r, sigma, t);
        const rho = calculateRho(S, K, r, sigma, t, optionType);
        
        // Display results
        document.getElementById('option-price').textContent = '$' + optionPrice.toFixed(4);
        document.getElementById('result-delta').textContent = delta.toFixed(4);
        document.getElementById('result-gamma').textContent = gamma.toFixed(4);
        document.getElementById('result-theta').textContent = theta.toFixed(4);
        document.getElementById('result-vega').textContent = vega.toFixed(4);
        document.getElementById('result-rho').textContent = rho.toFixed(4);
    });
    
    // Calculate on page load with default values
    calculateButton.click();
}

// --------------------------------------------------
// Practice Problems
// --------------------------------------------------

let currentProblem = null;
let problemHistory = [];

function initializePracticeProblems() {
    const generateButton = document.getElementById('generate-problem');
    const checkButton = document.getElementById('check-answer');
    
    if (!generateButton || !checkButton) return;
    
    generateButton.addEventListener('click', function() {
        generateProblem();
    });
    
    checkButton.addEventListener('click', function() {
        checkAnswer();
    });
    
    // Allow pressing Enter to check answer
    document.getElementById('user-answer').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            checkAnswer();
        }
    });
}

function generateProblem() {
    const difficulty = document.getElementById('problem-difficulty').value;
    const problemText = document.getElementById('problem-text');
    const userAnswer = document.getElementById('user-answer');
    const feedback = document.getElementById('feedback');
    
    // Reset UI
    userAnswer.value = '';
    feedback.classList.add('hidden');
    feedback.classList.remove('correct', 'incorrect');
    
    // Generate random parameters based on difficulty
    let S, K, r, sigma, t;
    
    switch (difficulty) {
        case 'easy':
            // Round numbers, at-the-money options, shorter expiries
            S = Math.round(Math.random() * 50 + 50); // $50-100
            K = S; // At-the-money
            r = Math.round(Math.random() * 5 + 1) / 100; // 1-6%
            sigma = Math.round(Math.random() * 10 + 15) / 100; // 15-25%
            t = Math.round(Math.random() * 6 + 1) / 12; // 1-7 months
            break;
            
        case 'medium':
            // Slightly more complex numbers, near-the-money options
            S = Math.round(Math.random() * 100 + 50); // $50-150
            K = Math.round(S * (0.9 + Math.random() * 0.2)); // 90-110% of S
            r = Math.round(Math.random() * 10) / 100; // 0-10%
            sigma = Math.round(Math.random() * 20 + 15) / 100; // 15-35%
            t = Math.round(Math.random() * 12 + 1) / 12; // 1-13 months
            break;
            
        case 'hard':
            // More complex numbers, potentially deep ITM/OTM options
            S = Math.round(Math.random() * 200 + 50); // $50-250
            K = Math.round(S * (0.7 + Math.random() * 0.6)); // 70-130% of S
            r = Math.round(Math.random() * 15) / 100; // 0-15%
            sigma = Math.round(Math.random() * 40 + 10) / 100; // 10-50%
            t = (Math.random() * 3).toFixed(2); // 0-3 years with decimal
            break;
    }
    
    // Choose a problem type
    const problemTypes = [
        'call_price',
        'put_price',
        'delta_call',
        'delta_put',
        'gamma',
        'theta_call',
        'theta_put',
        'vega',
        'rho_call',
        'rho_put'
    ];
    
    const problemType = problemTypes[Math.floor(Math.random() * problemTypes.length)];
    
    // Generate problem text and answer
    let problemDescription, answer;
    
    switch (problemType) {
        case 'call_price':
            problemDescription = `Calculate the price of a European call option with the following parameters:<br><br>
                Stock Price (S): $${S}<br>
                Strike Price (K): $${K}<br>
                Risk-free Rate (r): ${(r * 100).toFixed(1)}%<br>
                Volatility (σ): ${(sigma * 100).toFixed(1)}%<br>
                Time to Expiry (t): ${t} years`;
            answer = calculateCallPrice(S, K, r, sigma, t);
            break;
            
        case 'put_price':
            problemDescription = `Calculate the price of a European put option with the following parameters:<br><br>
                Stock Price (S): $${S}<br>
                Strike Price (K): $${K}<br>
                Risk-free Rate (r): ${(r * 100).toFixed(1)}%<br>
                Volatility (σ): ${(sigma * 100).toFixed(1)}%<br>
                Time to Expiry (t): ${t} years`;
            answer = calculatePutPrice(S, K, r, sigma, t);
            break;
            
        case 'delta_call':
            problemDescription = `Calculate the Delta (Δ) of a European call option with the following parameters:<br><br>
                Stock Price (S): $${S}<br>
                Strike Price (K): $${K}<br>
                Risk-free Rate (r): ${(r * 100).toFixed(1)}%<br>
                Volatility (σ): ${(sigma * 100).toFixed(1)}%<br>
                Time to Expiry (t): ${t} years`;
            answer = calculateDelta(S, K, r, sigma, t, 'call');
            break;
            
        case 'delta_put':
            problemDescription = `Calculate the Delta (Δ) of a European put option with the following parameters:<br><br>
                Stock Price (S): $${S}<br>
                Strike Price (K): $${K}<br>
                Risk-free Rate (r): ${(r * 100).toFixed(1)}%<br>
                Volatility (σ): ${(sigma * 100).toFixed(1)}%<br>
                Time to Expiry (t): ${t} years`;
            answer = calculateDelta(S, K, r, sigma, t, 'put');
            break;
            
        case 'gamma':
            problemDescription = `Calculate the Gamma (Γ) of a European option with the following parameters:<br><br>
                Stock Price (S): $${S}<br>
                Strike Price (K): $${K}<br>
                Risk-free Rate (r): ${(r * 100).toFixed(1)}%<br>
                Volatility (σ): ${(sigma * 100).toFixed(1)}%<br>
                Time to Expiry (t): ${t} years<br><br>
                Note: Gamma is the same for both call and put options.`;
            answer = calculateGamma(S, K, r, sigma, t);
            break;
            
        case 'theta_call':
            problemDescription = `Calculate the daily Theta (Θ) of a European call option with the following parameters:<br><br>
                Stock Price (S): $${S}<br>
                Strike Price (K): $${K}<br>
                Risk-free Rate (r): ${(r * 100).toFixed(1)}%<br>
                Volatility (σ): ${(sigma * 100).toFixed(1)}%<br>
                Time to Expiry (t): ${t} years`;
            answer = calculateTheta(S, K, r, sigma, t, 'call');
            break;
            
        case 'theta_put':
            problemDescription = `Calculate the daily Theta (Θ) of a European put option with the following parameters:<br><br>
                Stock Price (S): $${S}<br>
                Strike Price (K): $${K}<br>
                Risk-free Rate (r): ${(r * 100).toFixed(1)}%<br>
                Volatility (σ): ${(sigma * 100).toFixed(1)}%<br>
                Time to Expiry (t): ${t} years`;
            answer = calculateTheta(S, K, r, sigma, t, 'put');
            break;
            
        case 'vega':
            problemDescription = `Calculate the Vega (ν) for a 1% change in volatility of a European option with the following parameters:<br><br>
                Stock Price (S): $${S}<br>
                Strike Price (K): $${K}<br>
                Risk-free Rate (r): ${(r * 100).toFixed(1)}%<br>
                Volatility (σ): ${(sigma * 100).toFixed(1)}%<br>
                Time to Expiry (t): ${t} years<br><br>
                Note: Vega is the same for both call and put options.`;
            answer = calculateVega(S, K, r, sigma, t);
            break;
            
        case 'rho_call':
            problemDescription = `Calculate the Rho (ρ) for a 1% change in interest rates of a European call option with the following parameters:<br><br>
                Stock Price (S): $${S}<br>
                Strike Price (K): $${K}<br>
                Risk-free Rate (r): ${(r * 100).toFixed(1)}%<br>
                Volatility (σ): ${(sigma * 100).toFixed(1)}%<br>
                Time to Expiry (t): ${t} years`;
            answer = calculateRho(S, K, r, sigma, t, 'call');
            break;
            
        case 'rho_put':
            problemDescription = `Calculate the Rho (ρ) for a 1% change in interest rates of a European put option with the following parameters:<br><br>
                Stock Price (S): $${S}<br>
                Strike Price (K): $${K}<br>
                Risk-free Rate (r): ${(r * 100).toFixed(1)}%<br>
                Volatility (σ): ${(sigma * 100).toFixed(1)}%<br>
                Time to Expiry (t): ${t} years`;
            answer = calculateRho(S, K, r, sigma, t, 'put');
            break;
    }
    
    // Update the problem text
    problemText.innerHTML = problemDescription;
    
    // Store the current problem
    currentProblem = {
        type: problemType,
        parameters: { S, K, r, sigma, t },
        description: problemDescription,
        answer: answer,
        difficulty: difficulty
    };
}

function checkAnswer() {
    if (!currentProblem) {
        alert('Please generate a problem first!');
        return;
    }
    
    const userAnswer = parseFloat(document.getElementById('user-answer').value);
    const feedback = document.getElementById('feedback');
    const feedbackMessage = document.getElementById('feedback-message');
    const explanation = document.getElementById('explanation');
    
    // Check if the answer is close enough (to handle floating point imprecision)
    const tolerance = currentProblem.difficulty === 'easy' ? 0.01 : 
                     (currentProblem.difficulty === 'medium' ? 0.0025 : 0.001);
                     
    const isCorrect = Math.abs(userAnswer - currentProblem.answer) < tolerance;
    
    // Show feedback
    feedback.classList.remove('hidden');
    
    if (isCorrect) {
        feedback.classList.add('correct');
        feedback.classList.remove('incorrect');
        feedbackMessage.innerHTML = `<strong>Correct!</strong> Your answer ${userAnswer.toFixed(4)} matches the expected value ${currentProblem.answer.toFixed(4)}.`;
        
        // Add to history
        addToHistory(true);
    } else {
        feedback.classList.add('incorrect');
        feedback.classList.remove('correct');
        feedbackMessage.innerHTML = `<strong>Incorrect.</strong> Your answer ${userAnswer.toFixed(4)} is different from the expected value ${currentProblem.answer.toFixed(4)}.`;
        
        // Generate explanation
        explanation.innerHTML = generateExplanation();
        
        // Add to history
        addToHistory(false);
    }
}

function generateExplanation() {
    const { type, parameters } = currentProblem;
    const { S, K, r, sigma, t } = parameters;
    
    let explanation = '<h4>Solution:</h4>';
    
    // Different explanation based on problem type
    switch (type) {
        case 'call_price':
        case 'put_price':
            const d1 = calculateD1(S, K, r, sigma, t);
            const d2 = calculateD2(d1, sigma, t);
            
            explanation += `
                <p>First, calculate the parameters d<sub>1</sub> and d<sub>2</sub>:</p>
                <p>d<sub>1</sub> = [ln(S/K) + (r + σ²/2)t] / (σ√t)</p>
                <p>d<sub>1</sub> = [ln(${S}/${K}) + (${r.toFixed(4)} + ${sigma.toFixed(4)}²/2)${t}] / (${sigma.toFixed(4)}√${t})</p>
                <p>d<sub>1</sub> = ${d1.toFixed(4)}</p>
                <p>d<sub>2</sub> = d<sub>1</sub> - σ√t</p>
                <p>d<sub>2</sub> = ${d1.toFixed(4)} - ${sigma.toFixed(4)}√${t}</p>
                <p>d<sub>2</sub> = ${d2.toFixed(4)}</p>
            `;
            
            if (type === 'call_price') {
                explanation += `
                    <p>For a call option, the price is:</p>
                    <p>C = S·N(d<sub>1</sub>) - K·e<sup>-rt</sup>·N(d<sub>2</sub>)</p>
                    <p>C = ${S}·N(${d1.toFixed(4)}) - ${K}·e<sup>-${r.toFixed(4)}·${t}</sup>·N(${d2.toFixed(4)})</p>
                    <p>C = ${S}·${normCDF(d1).toFixed(4)} - ${K}·${Math.exp(-r * t).toFixed(4)}·${normCDF(d2).toFixed(4)}</p>
                    <p>C = ${currentProblem.answer.toFixed(4)}</p>
                `;
            } else {
                explanation += `
                    <p>For a put option, the price is:</p>
                    <p>P = K·e<sup>-rt</sup>·N(-d<sub>2</sub>) - S·N(-d<sub>1</sub>)</p>
                    <p>P = ${K}·e<sup>-${r.toFixed(4)}·${t}</sup>·N(-${d2.toFixed(4)}) - ${S}·N(-${d1.toFixed(4)})</p>
                    <p>P = ${K}·${Math.exp(-r * t).toFixed(4)}·${normCDF(-d2).toFixed(4)} - ${S}·${normCDF(-d1).toFixed(4)}</p>
                    <p>P = ${currentProblem.answer.toFixed(4)}</p>
                `;
            }
            break;
            
        case 'delta_call':
            explanation += `
                <p>For a call option, the Delta (Δ) is:</p>
                <p>Δ<sub>call</sub> = N(d<sub>1</sub>)</p>
                <p>First, calculate d<sub>1</sub>:</p>
                <p>d<sub>1</sub> = [ln(S/K) + (r + σ²/2)t] / (σ√t)</p>
                <p>d<sub>1</sub> = [ln(${S}/${K}) + (${r.toFixed(4)} + ${sigma.toFixed(4)}²/2)${t}] / (${sigma.toFixed(4)}√${t})</p>
                <p>d<sub>1</sub> = ${calculateD1(S, K, r, sigma, t).toFixed(4)}</p>
                <p>Δ<sub>call</sub> = N(${calculateD1(S, K, r, sigma, t).toFixed(4)}) = ${currentProblem.answer.toFixed(4)}</p>
            `;
            break;
            
        case 'delta_put':
            explanation += `
                <p>For a put option, the Delta (Δ) is:</p>
                <p>Δ<sub>put</sub> = N(d<sub>1</sub>) - 1</p>
                <p>First, calculate d<sub>1</sub>:</p>
                <p>d<sub>1</sub> = [ln(S/K) + (r + σ²/2)t] / (σ√t)</p>
                <p>d<sub>1</sub> = [ln(${S}/${K}) + (${r.toFixed(4)} + ${sigma.toFixed(4)}²/2)${t}] / (${sigma.toFixed(4)}√${t})</p>
                <p>d<sub>1</sub> = ${calculateD1(S, K, r, sigma, t).toFixed(4)}</p>
                <p>Δ<sub>put</sub> = N(${calculateD1(S, K, r, sigma, t).toFixed(4)}) - 1 = ${normCDF(calculateD1(S, K, r, sigma, t)).toFixed(4)} - 1 = ${currentProblem.answer.toFixed(4)}</p>
            `;
            break;
            
        default:
            explanation += `<p>See the Black-Scholes formula section for the specific formulas to solve this problem.</p>`;
    }
    
    return explanation;
}

function addToHistory(isCorrect) {
    // Add problem to history
    const historyItem = {
        ...currentProblem,
        userAnswer: parseFloat(document.getElementById('user-answer').value),
        isCorrect: isCorrect,
        timestamp: new Date()
    };
    
    problemHistory.unshift(historyItem);
    
    // Cap history at 10 items
    if (problemHistory.length > 10) {
        problemHistory.pop();
    }
    
    // Update history display
    updateHistoryDisplay();
}

function updateHistoryDisplay() {
    const historyList = document.getElementById('history-list');
    
    if (problemHistory.length === 0) {
        historyList.innerHTML = '<p>Your solved problems will appear here.</p>';
        return;
    }
    
    let historyHTML = '';
    
    problemHistory.forEach((item, index) => {
        const problemTypeLabel = getProblemTypeLabel(item.type);
        
        historyHTML += `
            <div class="history-item ${item.isCorrect ? 'correct' : 'incorrect'}">
                <div class="history-header">
                    <span class="history-number">#${index + 1}</span>
                    <span class="history-type">${problemTypeLabel}</span>
                    <span class="history-difficulty">${item.difficulty.charAt(0).toUpperCase() + item.difficulty.slice(1)}</span>
                </div>
                <div class="history-result">
                    <span>Your answer: ${item.userAnswer.toFixed(4)}</span>
                    <span>Correct answer: ${item.answer.toFixed(4)}</span>
                </div>
            </div>
        `;
    });
    
    historyList.innerHTML = historyHTML;
}

function getProblemTypeLabel(type) {
    const labels = {
        'call_price': 'Call Option Price',
        'put_price': 'Put Option Price',
        'delta_call': 'Call Delta',
        'delta_put': 'Put Delta',
        'gamma': 'Gamma',
        'theta_call': 'Call Theta',
        'theta_put': 'Put Theta',
        'vega': 'Vega',
        'rho_call': 'Call Rho',
        'rho_put': 'Put Rho'
    };
    
    return labels[type] || type;
}

// --------------------------------------------------
// Set up event listeners
// --------------------------------------------------

function setupEventListeners() {
    // Event listeners for tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and tabs
            tabButtons.forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Add active class to current button and tab
            this.classList.add('active');
            document.getElementById(tabId)?.classList.add('active');
        });
    });
} 