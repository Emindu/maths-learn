import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProgress } from '../contexts/ProgressContext';

// Simple Error Boundary
export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ textAlign: 'center', padding: 'var(--space-24)', color: 'var(--color-error)' }}>
          <h2>Something went wrong!</h2>
          <p>{this.state.error?.message || "Unknown error"}</p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '8px 16px',
              backgroundColor: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// Confetti Effect
const Confetti: React.FC<{ active: boolean; doorEl: HTMLDivElement | null }> = ({ active, doorEl }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    interface Particle {
      x: number;
      y: number;
      radius: number;
      color: string;
      vx: number;
      vy: number;
      alpha: number;
    }

    const particles: Particle[] = [];
    const colors = ['#f59e0b', '#dc2626', '#10b981', '#2563eb', '#8b5cf6'];

    let startX = canvas.width / 2;
    let startY = canvas.height / 2;

    if (doorEl) {
      const rect = doorEl.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + window.scrollY;
    }

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: startX,
        y: startY,
        radius: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        vx: (Math.random() - 0.5) * 14,
        vy: Math.random() * -12 - 4,
        alpha: 1,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.alpha -= 0.008;

        if (p.alpha <= 0) return;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
      });

      if (particles.some(p => p.alpha > 0)) {
        animationId = requestAnimationFrame(animate);
      }
    };

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [active, doorEl]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1000 }} />;
};

// Door Component
interface DoorProps {
  number: number;
  isSelected: boolean;
  isOpen: boolean;
  isCar: boolean;
  onClick: () => void;
  isWinner: boolean;
  isLoser: boolean;
}

const Door: React.FC<DoorProps> = ({ number, isSelected, isOpen, isCar, onClick, isWinner, isLoser }) => {
  const doorRef = useRef<HTMLDivElement | null>(null);

  // Styling based on state
  let borderStyle = '1px solid var(--color-border)';
  let bgStyle = 'var(--color-surface)';
  if (isSelected) {
    borderStyle = '3px solid var(--color-primary)';
  }

  if (isOpen) {
    bgStyle = isCar ? '#fef08a' : '#e5e7eb'; // Yellow for car, gray for goat
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {isWinner && <Confetti active={isWinner} doorEl={doorRef.current} />}
      <div
        ref={doorRef}
        onClick={onClick}
        className={`door-container ${isOpen ? 'open' : ''} ${isWinner ? 'pulse' : ''}`}
        style={{
          width: '130px',
          height: '210px',
          backgroundColor: bgStyle,
          border: borderStyle,
          borderRadius: 'var(--radius-lg, 12px)',
          cursor: isOpen ? 'default' : 'pointer',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: isWinner ? '0 0 25px rgba(234, 179, 8, 0.6)' : 'var(--shadow-sm)',
          opacity: isLoser ? 0.6 : 1,
        }}
      >
        <span style={{
          fontSize: 'var(--font-size-base)',
          fontWeight: 'var(--font-weight-bold)',
          color: isOpen ? '#1e1e24' : 'var(--color-text)',
          zIndex: 2
        }}>
          Door {number}
        </span>

        {isOpen && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70px',
            height: '70px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1
          }}>
            <img
              src={isCar ? "https://cdn-icons-png.flaticon.com/512/3202/3202003.png" : "https://cdn-icons-png.flaticon.com/512/1886/1886933.png"}
              alt={isCar ? "Car" : "Goat"}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        )}
      </div>

      <style>{`
        .door-container:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }
        .door-container.open {
          transform: none;
        }
        .pulse {
          animation: win-pulse 1.2s infinite;
        }
        @keyframes win-pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

// Host dialogue bubble
const MontyInstructor: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginTop: 'var(--space-24)',
      width: '100%',
      maxWidth: '450px',
      margin: '24px auto 0'
    }}>
      <img
        src="https://cdn-icons-png.flaticon.com/512/1998/1998671.png"
        alt="Monty Host"
        style={{ width: '70px', height: '70px', marginBottom: 'var(--space-12)' }}
      />
      <div style={{
        position: 'relative',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        padding: 'var(--space-16)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-sm)',
        textAlign: 'center',
        fontSize: 'var(--font-size-base)',
        color: 'var(--color-text)',
        width: '100%'
      }}>
        <p style={{ margin: 0, lineHeight: 1.5 }}>{message}</p>
        <div style={{
          position: 'absolute',
          top: '-8px',
          left: '50%',
          transform: 'translateX(-50%) rotate(45deg)',
          width: '16px',
          height: '16px',
          background: 'var(--color-surface)',
          borderLeft: '1px solid var(--color-border)',
          borderTop: '1px solid var(--color-border)',
        }}></div>
      </div>
    </div>
  );
};

export const MontyHallGame: React.FC = () => {
  const [gameState, setGameState] = useState<'initial' | 'firstPick' | 'finished'>('initial');
  const [carDoor, setCarDoor] = useState<number | null>(null);
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null);
  const [montyOpensDoor, setMontyOpensDoor] = useState<number | null>(null);
  const [message, setMessage] = useState('Pick a door, my friend! Let’s see if you’re driving home or herding goats!');
  const [showSimulate, setShowSimulate] = useState(false);
  const [simulationResults, setSimulationResults] = useState<{ stayWinRate: number; switchWinRate: number } | null>(null);
  const [isWinner, setIsWinner] = useState(false);
  const [isLoser, setIsLoser] = useState(false);
  
  const { markComplete, getNextTopic, isCompleted } = useProgress();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const initializeGame = () => {
    setCarDoor(Math.floor(Math.random() * 3) + 1);
    setSelectedDoor(null);
    setMontyOpensDoor(null);
    setGameState('initial');
    setMessage('Pick a door, my friend! Let’s see if you’re driving home or herding goats!');
    setShowSimulate(false);
    setSimulationResults(null);
    setIsWinner(false);
    setIsLoser(false);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const chooseDoor = (doorNumber: number) => {
    if (gameState === 'initial') {
      setSelectedDoor(doorNumber);
      // Monty opens a door that has a goat AND is not chosen
      const possibleOpens = [1, 2, 3].filter(d => d !== doorNumber && d !== carDoor);
      const montyDoor = possibleOpens[Math.floor(Math.random() * possibleOpens.length)];
      setMontyOpensDoor(montyDoor);
      setGameState('firstPick');
      setMessage(`Nice choice! I’ve opened Door ${montyDoor} to reveal a goat 🐐. Do you want to STAY with Door ${doorNumber} or SWITCH to the other unopened door?`);
    } else if (gameState === 'firstPick') {
      if (doorNumber === montyOpensDoor) return; // Cannot pick already opened door
      setSelectedDoor(doorNumber);
      setGameState('finished');
      const won = doorNumber === carDoor;
      setIsWinner(won);
      setIsLoser(!won);
      setMessage(`You chose Door ${doorNumber}! The car was behind Door ${carDoor}! ${won ? '🎉 Vroom Vroom! You win the car!' : '🐐 Baaa! You got a goat!'}`);
      setShowSimulate(true);
    }
  };

  const runSimulation = () => {
    const iterations = 10000;
    let stayWins = 0;
    let switchWins = 0;

    for (let i = 0; i < iterations; i++) {
      const car = Math.floor(Math.random() * 3) + 1;
      const pick = Math.floor(Math.random() * 3) + 1;

      // Monty opens one door containing goat
      const open = [1, 2, 3].filter(d => d !== car && d !== pick)[0];

      // Switch choice picks the remaining door
      const switchPick = [1, 2, 3].filter(d => d !== pick && d !== open)[0];

      if (pick === car) stayWins++;
      if (switchPick === car) switchWins++;
    }

    const stayWinRate = (stayWins / iterations) * 100;
    const switchWinRate = (switchWins / iterations) * 100;

    setSimulationResults({ stayWinRate, switchWinRate });
    setMessage(`Simulation of ${iterations.toLocaleString()} games complete! Switching won ${switchWinRate.toFixed(1)}% of the time, while staying only won ${stayWinRate.toFixed(1)}%!`);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: 'var(--space-32) var(--space-24)' }}>
      <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', textAlign: 'center', marginBottom: 'var(--space-24)', color: 'var(--color-primary)' }}>
        Monty Hall Game
      </h1>

      {/* Rules card */}
      <div className="info-card" style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        padding: 'var(--space-24)',
        boxShadow: 'var(--shadow-sm)',
        marginBottom: 'var(--space-32)',
        color: 'var(--color-text)'
      }}>
        <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', margin: '0 0 var(--space-10) 0' }}>
          🎉 Welcome to the Monty Hall Show!
        </h2>
        <p style={{ margin: '0 0 var(--space-12) 0', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          Step right up for a wild ride! Behind one of these three mysterious doors hides a shiny new car 🚗, while the other two conceal... well, some very charming goats 🐐. Here's the deal:
        </p>
        <ul style={{ margin: '0 0 var(--space-12) 0', paddingLeft: 'var(--space-20)', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          <li>Pick a door—any door!</li>
          <li>Your host, Monty, will open one of the other doors to reveal a goat.</li>
          <li>Now, the big moment: stick with your door or switch to the other unopened one?</li>
          <li>Reveal your choice and see if you drive away or get a new furry friend!</li>
        </ul>
        <p style={{ margin: 0, color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
          Run the 10,000-game simulator after playing to see why switching is always mathematically superior!
        </p>
      </div>

      {/* Door Grid */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 'var(--space-20)',
        marginBottom: 'var(--space-32)',
        flexWrap: 'wrap'
      }}>
        {[1, 2, 3].map(num => (
          <Door
            key={num}
            number={num}
            isSelected={selectedDoor === num}
            isOpen={montyOpensDoor === num || gameState === 'finished'}
            isCar={carDoor === num && gameState === 'finished'}
            isWinner={isWinner && carDoor === num && gameState === 'finished'}
            isLoser={isLoser && selectedDoor === num && gameState === 'finished'}
            onClick={() => chooseDoor(num)}
          />
        ))}
      </div>

      {/* Host dialogues */}
      <MontyInstructor message={message} />

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-16)', marginTop: 'var(--space-32)', marginBottom: 'var(--space-32)' }}>
        <button
          onClick={initializeGame}
          className="btn"
          style={{
            padding: '10px 24px',
            backgroundColor: 'var(--color-secondary-hover)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-base)',
            color: 'var(--color-text)',
            cursor: 'pointer',
            fontWeight: 'var(--font-weight-medium)',
            transition: 'all 0.2s ease'
          }}
        >
          Reset Game
        </button>

        {showSimulate && (
          <button
            onClick={runSimulation}
            className="btn"
            style={{
              padding: '10px 24px',
              backgroundColor: 'var(--color-primary)',
              border: 'none',
              borderRadius: 'var(--radius-base)',
              color: '#ffffff',
              cursor: 'pointer',
              fontWeight: 'var(--font-weight-medium)',
              transition: 'all 0.2s ease'
            }}
          >
            Simulate 10,000 Games
          </button>
        )}
      </div>

      {/* Simulation results visualizer */}
      {simulationResults && (
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-24)',
          boxShadow: 'var(--shadow-sm)',
          maxWidth: '500px',
          margin: '32px auto 0',
          color: 'var(--color-text)'
        }}>
          <h3 style={{ fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-bold)', textAlign: 'center', margin: '0 0 var(--space-20) 0' }}>
            Simulation Results (10,000 runs)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-16)' }}>
            {/* Stay strategy */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '4px' }}>
                <span>Staying Strategy</span>
                <span style={{ color: 'var(--color-primary)' }}>{simulationResults.stayWinRate.toFixed(1)}% Wins</span>
              </div>
              <div style={{ height: '24px', background: 'var(--color-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${simulationResults.stayWinRate}%`,
                  background: 'linear-gradient(to right, #60A5FA, var(--color-primary))',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 1s ease-out'
                }}></div>
              </div>
            </div>

            {/* Switch strategy */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', marginBottom: '4px' }}>
                <span>Switching Strategy</span>
                <span style={{ color: 'var(--color-accent)' }}>{simulationResults.switchWinRate.toFixed(1)}% Wins</span>
              </div>
              <div style={{ height: '24px', background: 'var(--color-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${simulationResults.switchWinRate}%`,
                  background: 'linear-gradient(to right, #F87171, var(--color-accent))',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 1s ease-out'
                }}></div>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: 'var(--space-20)', margin: '20px 0 0 0', lineHeight: 1.5 }}>
            *Staying wins approximately 1/3 (33.3%) of the time, because you must pick the car on your initial guess. Switching wins approximately 2/3 (66.7%) of the time, because you win if you initial-guess a goat (which happens 2/3 of the time) and Monty is forced to reveal the other goat.
          </p>
        </div>
      )}
      
      {/* Complete Button */}
      <div style={{
        marginTop: 'var(--space-48)',
        paddingTop: 'var(--space-24)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        justifyContent: 'flex-end',
      }}>
        <button
          className="btn btn-primary hover-lift"
          onClick={() => {
            markComplete(currentPath);
            const nextTopic = getNextTopic(currentPath);
            if (nextTopic) {
              navigate(nextTopic);
            } else {
              navigate('/');
            }
          }}
        >
          {isCompleted(currentPath) ? 'Continue to Next' : 'Mark as Complete & Continue'}
        </button>
      </div>
    </div>
  );
};
export default MontyHallGame;
