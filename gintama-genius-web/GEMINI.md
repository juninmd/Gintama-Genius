# GEMINI.md - Living Repository Memory

## Core Principles
- Single file limit: < 150 lines.
- Enforce DRY, KISS, and SOLID patterns.
- Package manager: `pnpm`
- Auto-deploy via `Release-Bot`.

## Current State
- The UI features standard "Simon Says" functionality using a cyberpunk theme, responsive down to 320x568 viewports.
- HUD notifications include `FeedbackOverlay`, `UrgentIndicator`, `TurnIndicator` with confetti integration.
- Removed inline styles from `FeedbackOverlay.tsx` in favor of CSS classes (`.feedback-text`, `.combo` in `hud.css`).
- Font-sizes scale gracefully to `1.5rem`/`1.8rem` for viewports under 600px width.
- `useConfettiEffect` extracted from `FeedbackOverlay.tsx` to stay within file length limits.
- Codebase has been fully modularized to ensure adherence to file length limits.

## Architecture
- React 19 + Vite 7.
- Framework: Custom hooks orchestrator pattern (`useGameLogic` acts as the root orchestrator connecting smaller pure functional hooks).
- Themed configurations are handled via `constants.ts`.