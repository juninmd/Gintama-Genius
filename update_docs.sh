echo "Updating AGENTS.md, ROADMAP.md, and GEMINI.md..."

cat << 'INNER_EOF' > gintama-genius-web/ROADMAP.md
# Roadmap

## ToDo
- Improve audio asset loading and error boundaries for `AudioController.ts`.
- Expand testing coverage if new components are added.
- Add PWA support.

## In Progress
- [None]

## Done
- HUD Mobile Layout Fixes (FeedbackOverlay and GameOver modals).
- Integration of Portuguese slang into HUD feedback messages.
- Centralize textual constants into `src/constants.ts`.
- Modularize HUD components.
- Separate game engine logic from UI hooks.
INNER_EOF

cat << 'INNER_EOF' > gintama-genius-web/GEMINI.md
# Gemini State Memory

## Architecture
- React 19 + TypeScript + Vite.
- Test stack: vitest + jsdom + testing-library.
- Strict limit: Max 150 lines of code per file.
- Single Responsibility Principle adhered to by modularizing components and hooks.

## Current State
- The game implements a "Simon Says" style memory game with a Cyberpunk/Gintama theme.
- Responsive mobile layout ensures buttons (`.game-board`), headers, and footers scale properly using `clamp` and `dvh`.
- HUD informative overlays (e.g., FeedbackOverlay, GameOver) are configured as `position: fixed` to act as modals and prevent vertical DOM displacement on mobile browsers.
- "Fever Mode" and "Combo" streaks change visual state (framer-motion, canvas-confetti, css variables).
- Text feedback is heavily localized to pt-BR featuring internet and Gintama slang (e.g., "RECEBA!", "VASCO!").
- CI runs linting, vitest, and semantic releases on the `main` branch.
INNER_EOF
