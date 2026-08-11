import React, { useEffect, useMemo } from 'react';
import { Box, Controls, StatGrid, StatTile, TextInput, VizCard, useStepPlayer } from './vizInterviewShared';

// ── Demo 1: Valid Palindrome ────────────────────────────────────────────────

interface PalindromeStep {
  i: number;
  j: number;
  skippedI: number[];
  skippedJ: number[];
  comparing: boolean;
  matched: boolean | null; // null while just skipping, true/false once a real comparison happens
  isPalindromeSoFar: boolean;
  done: boolean;
  result: boolean | null;
}

function isAlnum(c: string) {
  return /[a-zA-Z0-9]/.test(c);
}

function simulatePalindrome(s: string): PalindromeStep[] {
  const steps: PalindromeStep[] = [];
  let i = 0;
  let j = s.length - 1;
  let broken = false;

  while (i < j) {
    const skippedI: number[] = [];
    const skippedJ: number[] = [];
    while (i < j && !isAlnum(s[i])) { skippedI.push(i); i++; }
    while (i < j && !isAlnum(s[j])) { skippedJ.push(j); j--; }

    if (skippedI.length || skippedJ.length) {
      steps.push({ i, j, skippedI, skippedJ, comparing: false, matched: null, isPalindromeSoFar: !broken, done: false, result: null });
    }

    if (i >= j) break;

    const match = s[i].toLowerCase() === s[j].toLowerCase();
    if (!match) broken = true;
    steps.push({ i, j, skippedI: [], skippedJ: [], comparing: true, matched: match, isPalindromeSoFar: !broken, done: !match, result: !match ? false : null });

    if (!match) return steps;
    i++;
    j--;
  }

  steps.push({ i, j, skippedI: [], skippedJ: [], comparing: false, matched: null, isPalindromeSoFar: !broken, done: true, result: !broken });
  return steps;
}

export const VizTwoPointersPalindrome: React.FC = () => {
  const [input, setInput] = React.useState('A man, a plan, a canal: Panama');
  const cleaned = input.length > 0 ? input : ' ';
  const steps = useMemo(() => simulatePalindrome(cleaned), [cleaned]);
  const player = useStepPlayer(steps.length);

  useEffect(() => { player.reset(); }, [cleaned]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = steps[player.stepIdx];

  return (
    <VizCard title="Two pointers converging · Valid Palindrome">
      <TextInput label="Input string" value={input} onChange={setInput} maxLength={40} width={320} />

      {step ? (
        <>
          <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', margin: 'var(--space-16) 0' }}>
            {cleaned.split('').map((c, idx) => {
              let state: 'idle' | 'pointer-a' | 'pointer-b' | 'good' | 'bad' = 'idle';
              if (idx === step.i && idx === step.j) state = step.matched === false ? 'bad' : 'good';
              else if (idx === step.i) state = step.comparing ? (step.matched ? 'good' : step.matched === false ? 'bad' : 'pointer-a') : 'pointer-a';
              else if (idx === step.j) state = step.comparing ? (step.matched ? 'good' : step.matched === false ? 'bad' : 'pointer-b') : 'pointer-b';
              else if (idx < step.i || idx > step.j) state = 'idle';
              return <Box key={idx} label={c === ' ' ? '·' : c} state={state} index={idx} size={28} />;
            })}
          </div>

          <Controls
            playing={player.playing}
            onPlayPause={player.togglePlay}
            onStepBack={player.stepBack}
            onStepForward={player.stepForward}
            onReset={player.reset}
            canStepBack={player.canStepBack}
            canStepForward={player.canStepForward}
            speed={player.speed}
            onSpeedChange={player.setSpeed}
            stepLabel={`step ${player.stepIdx + 1} / ${steps.length}`}
          />

          <StatGrid>
            <StatTile label="i, j" value={`${step.i}, ${step.j}`} />
            <StatTile
              label="This step"
              value={
                step.skippedI.length || step.skippedJ.length
                  ? 'Skipping non-alphanumeric'
                  : step.comparing
                  ? (step.matched ? 'Match ✓' : 'Mismatch ✗')
                  : 'Pointers met'
              }
              accent={step.comparing ? !!step.matched : undefined}
              warn={step.comparing ? step.matched === false : false}
            />
            <StatTile label="Palindrome so far?" value={step.isPalindromeSoFar ? 'Yes' : 'No'} accent={step.isPalindromeSoFar} warn={!step.isPalindromeSoFar} />
            <StatTile label="Final result" value={step.result === null ? '—' : step.result ? 'Palindrome ✓' : 'Not a palindrome ✗'} accent={!!step.result} warn={step.result === false} />
          </StatGrid>
        </>
      ) : (
        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Type a string above to begin.</div>
      )}
    </VizCard>
  );
};

// ── Demo 2: Container With Most Water ───────────────────────────────────────

interface ContainerStep {
  i: number;
  j: number;
  area: number;
  best: number;
  bestI: number;
  bestJ: number;
  moved: 'i' | 'j' | null;
}

function simulateContainer(heights: number[]): ContainerStep[] {
  const steps: ContainerStep[] = [];
  let i = 0;
  let j = heights.length - 1;
  let best = 0;
  let bestI = 0;
  let bestJ = heights.length - 1;

  while (i < j) {
    const width = j - i;
    const area = Math.min(heights[i], heights[j]) * width;
    let moved: 'i' | 'j' | null = null;
    if (area > best) { best = area; bestI = i; bestJ = j; }

    if (heights[i] < heights[j]) { moved = 'i'; } else { moved = 'j'; }
    steps.push({ i, j, area, best, bestI, bestJ, moved });

    if (moved === 'i') i++; else j--;
  }
  return steps;
}

const DEFAULT_HEIGHTS = [1, 8, 6, 2, 5, 4, 8, 3, 7];

export const VizTwoPointersContainer: React.FC = () => {
  const [heights] = React.useState(DEFAULT_HEIGHTS);
  const steps = useMemo(() => simulateContainer(heights), [heights]);
  const player = useStepPlayer(steps.length);
  const step = steps[player.stepIdx];
  const maxH = Math.max(...heights);
  const barWidth = 30;

  return (
    <VizCard title="Two pointers, shrink the shorter wall · Container With Most Water">
      {step ? (
        <>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '160px', margin: 'var(--space-16) 0 4px', position: 'relative' }}>
            {heights.map((h, idx) => {
              const inWater = idx >= step.i && idx <= step.j;
              const isPointer = idx === step.i || idx === step.j;
              const isBest = idx === step.bestI || idx === step.bestJ;
              return (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%', position: 'relative' }}>
                  {inWater && (
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      width: `${barWidth}px`,
                      height: `${(Math.min(heights[step.i], heights[step.j]) / maxH) * 130}px`,
                      background: 'rgba(59, 130, 246, 0.18)',
                      zIndex: 0,
                    }} />
                  )}
                  <div
                    title={`height = ${h}`}
                    style={{
                      width: `${barWidth}px`,
                      height: `${(h / maxH) * 130}px`,
                      background: isPointer ? (isBest ? '#22c55e' : 'var(--color-primary)') : 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '3px 3px 0 0',
                      zIndex: 1,
                      transition: 'background 0.15s',
                    }}
                  />
                  <div style={{ fontSize: '0.62rem', color: 'var(--color-text-secondary)', marginTop: '2px' }}>{idx}</div>
                </div>
              );
            })}
          </div>

          <Controls
            playing={player.playing}
            onPlayPause={player.togglePlay}
            onStepBack={player.stepBack}
            onStepForward={player.stepForward}
            onReset={player.reset}
            canStepBack={player.canStepBack}
            canStepForward={player.canStepForward}
            speed={player.speed}
            onSpeedChange={player.setSpeed}
            stepLabel={`step ${player.stepIdx + 1} / ${steps.length}`}
          />

          <StatGrid>
            <StatTile label="i, j" value={`${step.i}, ${step.j}`} />
            <StatTile label="Current area" value={`min(${heights[step.i]}, ${heights[step.j]}) × ${step.j - step.i} = ${step.area}`} />
            <StatTile label="Best area so far" value={String(step.best)} accent />
            <StatTile label="Next move" value={step.moved === 'i' ? `height[i]=${heights[step.i]} is shorter → i++` : `height[j]=${heights[step.j]} is shorter (or equal) → j--`} />
          </StatGrid>
        </>
      ) : null}
    </VizCard>
  );
};

export const VizTwoPointers: React.FC = () => (
  <div>
    <VizTwoPointersPalindrome />
    <VizTwoPointersContainer />
  </div>
);
