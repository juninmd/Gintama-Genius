# GEMINI.md - Living Repository Memory

## Core Principles
- Single file limit: < 150 lines.
- Enforce DRY, KISS, and SOLID patterns.
- Package manager: `pnpm`
- Auto-deploy via `Release-Bot`.

## Current State
- The UI features standard "Simon Says" functionality using a cyberpunk theme, responsive up to tiny mobile resolutions (`< 400px`).
- HUD notifications include `FeedbackOverlay`, `UrgentIndicator`, `TurnIndicator` with confetti integration.
- Codebase has been fully modularized to ensure adherence to file length limits.

## Architecture
- React 19 + Vite 7.
- Framework: Custom hooks orchestrator pattern (`useGameLogic` acts as the root orchestrator connecting smaller pure functional hooks).
- Themed configurations are handled via `constants.ts`.
