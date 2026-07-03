# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # tsc + vite build
npm run preview    # Preview production build locally
```

There are no test commands — the project has no test suite.

## Architecture

This is a React 18 + TypeScript SPA (Vite) for interactive statistics and mathematics education. It is structured as a hybrid: modern React components for the main UI, and legacy standalone HTML modules served as static files under `public/legacy/`.

### Routing (App.tsx)

| Route | Component | Purpose |
|---|---|---|
| `/` | `Hub.tsx` | Dashboard with 30+ topic cards in 6 categories |
| `/distribution/:id` | `DistributionVisualizer.tsx` | Interactive distribution explorer |
| `/game/monty-hall` | `MontyHallGame.tsx` | Monty Hall simulation |
| `/legacy/*` | `LegacyModuleLoader.tsx` | Iframe wrapper for unported HTML modules |
| `*` | redirect → `/` | 404 catch-all |

### Key src/ structure

- `src/data/distributionsData.ts` — Config objects for 14+ probability distributions. Each config includes parameter sliders, PDF/PMF/CDF functions, LaTeX formula strings, `getStats()`, and optional Python templates.
- `src/data/mathHelpers.ts` — Pure math utilities (erf, gamma, linspace, etc.) used by distribution configs.
- `src/components/Layout.tsx` — Shell with header, theme toggle, and `ThemeProvider` context that persists light/dark mode to localStorage via `data-color-scheme` on `<html>`.
- `src/hooks/usePyodide.ts` — Singleton Pyodide instance manager; loads packages from imports, renders matplotlib output as base64 images.
- `public/legacy/` — Static legacy HTML modules served as-is. `LegacyModuleLoader.tsx` embeds them in iframes.

### Adding a new distribution

Add an entry to `src/data/distributionsData.ts` implementing the `DistributionConfig` interface. The `DistributionVisualizer` component picks it up automatically via the `id` route param.

### Adding a new native page

1. Create a component under `src/pages/` or `src/components/`.
2. Add a route in `src/App.tsx`.
3. Add a card in `src/components/Hub.tsx` pointing to the new route.

### Theme system

CSS custom properties are defined in `src/theme.css` (shared) and `src/hub.css` (hub-specific). Components use inline styles referencing these variables (e.g. `var(--bg-primary)`). The `data-color-scheme` attribute on `<html>` switches the active variable set.

### External dependencies loaded from CDN (index.html)

Plotly, Pyodide, KaTeX, and web fonts are loaded via CDN tags in `index.html` — they are not bundled by Vite.
