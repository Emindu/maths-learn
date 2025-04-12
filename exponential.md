
## Exponential Distribution: Key Concepts and Applications

[This comprehensive note summarizes the key points from Justin Zeltzer's video on the Exponential Distribution.](https://www.youtube.com/watch?v=2kg1O0j1J9c)

### Definition and Relationship to Poisson Distribution

- The Exponential Distribution models the time between events in a Poisson process[^1].
- It can be thought of as the inverse of the Poisson Distribution[^1].
- Examples:
    - Poisson: Number of cars passing a toll gate in one hour
    - Exponential: Number of hours between car arrivals
    - Poisson: Number of hipsters arriving at Apple Genius Bar in one minute
    - Exponential: Number of minutes between new arrivals at Genius Bar[^1]


### Key Properties

1. **Constant Rate**: Events must occur at a constant average rate[^1].
2. **Independence**: Events must be independent of each other[^1].
3. **Memorylessness**: The probability of an event occurring in the next time interval is independent of how much time has already passed[^1].

### Probability Density Function (PDF) and Cumulative Distribution Function (CDF)

- PDF: Starts at the highest point and decreases exponentially[^1].
- CDF: Increases from 0 to 1, representing the probability of an event occurring within a given time[^1].


### Calculations and Formulas

- Mean of Exponential Distribution (μ) = 1 / λ, where λ is the rate parameter of the Poisson Distribution[^1].
- Cumulative Distribution Function: P(X ≤ x) = 1 - e^(-x/μ)[^1].
- Excel function: EXPON.DIST(x, λ, cumulative)[^1].


### Example Problem

Given: Unique visitors arrive at a website at an average rate of 3 per hour.

1. Probability of next visitor arriving within 10 minutes:
    - P(X ≤ 10) = 1 - e^(-10/20) ≈ 0.3935[^1]
2. Probability of next visitor arriving after 30 minutes:
    - $P(X > 30) = e^{(-30/20)} ≈ 0.2231[^1]$
3. Probability of next visitor arriving in exactly 15 minutes:
    - P(X = 15) = 0 (for continuous distributions, the probability of an exact value is always 0)[^1]

### Why It's Called "Exponential"

- The probability decreases exponentially for each successive time interval[^1].
- For each additional time unit, the probability is multiplied by a constant factor (e.g., 0.95 in the example)[^1].


### Applications

- Modeling time between events in various fields:
    - Customer arrivals
    - Equipment failures
    - Radioactive decay
    - Time between phone calls[^1]

Understanding the Exponential Distribution is crucial for analyzing time-based events and processes in various scientific and practical applications.
