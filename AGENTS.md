# AGENTS.md

Gintama Genius: a memory and reflex game (color-sequence board, combo, Fever mode) based on Gintama. The web app in `gintama-genius-web/` is the active product. The original VB.NET WinForms desktop app lives in `Gintama Genius/`.

## Stack

- Web: React 19, Vite, TypeScript, Phaser 4 (board scene), Vitest + Testing Library
- Desktop (legacy): VB.NET WinForms, `Gintama Genius.sln`. Not built in CI
- Node 22 (CI), pnpm (`gintama-genius-web/pnpm-lock.yaml`)

## Commands

All web commands run in `gintama-genius-web/`:

- Install: `pnpm install`
- Dev: `pnpm run dev`
- Build: `pnpm run build` (`tsc -b && vite build`)
- Lint: `pnpm run lint` (`eslint .`)
- Test: `pnpm run test` (Vitest). Coverage: `pnpm exec vitest run --coverage`
- Preview: `pnpm run preview`

CI (`.github/workflows/main.yml`) runs lint, test and build in `gintama-genius-web/`, then `npx semantic-release` on `master`.

## Structure

- `gintama-genius-web/src/App.tsx`, `main.tsx`: app shell
- `src/components/`: menus, modals, board (`GameBoard.tsx`), HUD under `components/hud/`
- `src/game/`: `BoardScene.ts` (Phaser scene), `boardGeometry.ts` (hit-test geometry)
- `src/hooks/`: game logic (`useGameLogic.ts`), `game/` engine hooks (sequence, timer, score, audio), history and achievements
- `src/utils/`, `src/constants.ts`, `src/styles/`: helpers and CSS
- `Gintama Genius/`: VB.NET desktop app (legacy)
- `.github/workflows/`: root CI (`main.yml`), `validate.yml` (reusable from `juninmd/base-actions`), `deploy.yml`, `pages.yml`, `sast.yml`, `security.yml`

## Conventions

- Keep modules small: a file over 150 lines is split by responsibility. Current exception: `src/hooks/game/useGameEngine.ts` (156 lines).
- Style: 2-space indent, max 120 characters per line. Follow the TypeScript style already in `src/` (camelCase).
- DRY and SOLID: extract logic that repeats in a second place. Keep one clear responsibility per module.
- Tests are written before the implementation (TDD). Coverage thresholds (`vite.config.ts`): statements 80, branches 75, functions 80, lines 80. Keep them.

## Gotchas

- Root `GEMINI.md` and `gintama-genius-web/GEMINI.md` are agent instruction files.
- Do not commit `.env` or secrets. `.gitleaks.toml` is the scanner config.

<!-- base-actions-main-policy -->
## GitHub Actions — padrão obrigatório (@main)

- Referencie as actions internas sempre pelo branch, nunca por SHA:
  - `uses: juninmd/base-actions/<action>@main`
  - `uses: juninmd/base-actions/.github/workflows/<arquivo>.yml@main`
- Não fixe `@<sha>` em `juninmd/base-actions`: a atualização é centralizada no
  `main` e passa a valer no próximo run.
- PRs cujos checks não iniciam por billing/spending limit são mesclados pelo bot central
  `juninmd/base-actions/.github/workflows/auto-merge-billing-blocked.yml`.
  Para impedir o merge automático de um PR, aplique a label `do-not-merge`.
