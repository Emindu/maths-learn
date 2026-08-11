import React, { useEffect, useMemo } from 'react';
import { Box, Controls, StatGrid, StatTile, TextInput, VizCard, useStepPlayer } from './vizInterviewShared';

// ── Dynamic window demo: Longest Substring Without Repeating Characters ────

interface DynamicStep {
  j: number;
  i: number;
  prevI: number;
  windowChars: string;
  windowLength: number;
  isNewMax: boolean;
  maxLength: number;
  bestStart: number;
  bestEnd: number;
}

function simulateLongestUniqueSubstring(s: string): DynamicStep[] {
  const steps: DynamicStep[] = [];
  let i = 0;
  const seen = new Set<string>();
  let maxLength = 0;
  let bestStart = 0;
  let bestEnd = -1;

  for (let j = 0; j < s.length; j++) {
    const prevI = i;
    while (seen.has(s[j])) {
      seen.delete(s[i]);
      i++;
    }
    seen.add(s[j]);
    const windowLength = j - i + 1;
    let isNewMax = false;
    if (windowLength > maxLength) {
      maxLength = windowLength;
      bestStart = i;
      bestEnd = j;
      isNewMax = true;
    }
    steps.push({ j, i, prevI, windowChars: s.slice(i, j + 1), windowLength, isNewMax, maxLength, bestStart, bestEnd });
  }
  return steps;
}

export const VizSlidingWindowDynamic: React.FC = () => {
  const [input, setInput] = React.useState('abcabcbb');
  const cleaned = input.length > 0 ? input : ' ';
  const steps = useMemo(() => simulateLongestUniqueSubstring(cleaned), [cleaned]);
  const player = useStepPlayer(steps.length);

  useEffect(() => { player.reset(); }, [cleaned]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = steps[player.stepIdx];

  return (
    <VizCard title="Dynamic window · Longest Substring Without Repeating Characters">
      <TextInput label="Input string" value={input} onChange={(v) => setInput(v.replace(/\s/g, ''))} />

      {step ? (
        <>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: 'var(--space-16) 0' }}>
            {cleaned.split('').map((c, idx) => {
              let state: 'idle' | 'window' | 'best' = 'idle';
              if (idx >= step.i && idx <= step.j) state = 'window';
              else if (idx >= step.bestStart && idx <= step.bestEnd) state = 'best';
              return <Box key={idx} label={c} state={state} index={idx} />;
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
            stepLabel={`j = ${player.stepIdx} / ${steps.length - 1}`}
          />

          <StatGrid>
            <StatTile label="Window [i, j]" value={`[${step.i}, ${step.j}]`} />
            <StatTile label="Window contents" value={`"${step.windowChars}"`} />
            <StatTile label="Window length" value={String(step.windowLength)} />
            <StatTile label="Longest so far" value={`${step.maxLength} ("${cleaned.slice(step.bestStart, step.bestEnd + 1)}")`} accent={step.isNewMax} />
          </StatGrid>

          <div style={{ marginTop: 'var(--space-10)', fontSize: '0.82rem', color: 'var(--color-text-secondary)' }}>
            {step.i > step.prevI
              ? `s[${step.j}] = '${cleaned[step.j]}' was already in the window, so i shrank from ${step.prevI} to ${step.i}.`
              : `s[${step.j}] = '${cleaned[step.j]}' is new to the window, so j expanded to ${step.j}.`}
          </div>
        </>
      ) : (
        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Type a string above to begin.</div>
      )}
    </VizCard>
  );
};

// ── Fixed window demo: Substrings of Size Three with Distinct Characters ───

interface FixedStep {
  start: number;
  end: number;
  windowChars: string;
  isValid: boolean;
  countSoFar: number;
}

function simulateFixedWindow(s: string, k: number): FixedStep[] {
  const steps: FixedStep[] = [];
  let count = 0;
  for (let i = 0; i + k <= s.length; i++) {
    const windowChars = s.slice(i, i + k);
    const isValid = new Set(windowChars.split('')).size === k;
    if (isValid) count++;
    steps.push({ start: i, end: i + k - 1, windowChars, isValid, countSoFar: count });
  }
  return steps;
}

export const VizSlidingWindowFixed: React.FC = () => {
  const [input, setInput] = React.useState('xyzzaz');
  const k = 3;
  const cleaned = input.length >= k ? input : input.padEnd(k, ' ');
  const steps = useMemo(() => simulateFixedWindow(cleaned, k), [cleaned]);
  const player = useStepPlayer(steps.length);

  useEffect(() => { player.reset(); }, [cleaned]); // eslint-disable-line react-hooks/exhaustive-deps

  const step = steps[player.stepIdx];

  return (
    <VizCard title="Fixed window (k = 3) · Substrings of Size Three with Distinct Characters">
      <TextInput label="Input string" value={input} onChange={(v) => setInput(v.replace(/\s/g, ''))} />

      {step ? (
        <>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', margin: 'var(--space-16) 0' }}>
            {cleaned.split('').map((c, idx) => (
              <Box key={idx} label={c === ' ' ? '·' : c} state={idx >= step.start && idx <= step.end ? 'window' : 'idle'} index={idx} />
            ))}
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
            stepLabel={`window ${player.stepIdx + 1} / ${steps.length}`}
          />

          <StatGrid>
            <StatTile label="Window [i, j]" value={`[${step.start}, ${step.end}]`} />
            <StatTile label="Window contents" value={`"${step.windowChars}"`} />
            <StatTile label="All distinct?" value={step.isValid ? 'Yes ✓' : 'No ✗'} accent={step.isValid} />
            <StatTile label="Valid windows so far" value={String(step.countSoFar)} />
          </StatGrid>
        </>
      ) : (
        <div style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>Type at least {k} characters above to begin.</div>
      )}
    </VizCard>
  );
};

export const VizSlidingWindow: React.FC = () => (
  <div>
    <VizSlidingWindowDynamic />
    <VizSlidingWindowFixed />
  </div>
);
