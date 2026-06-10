1. **Acknowledge Protocol**: State that I am Jules-DevOps Prime and initiating Phase 1.
2. **Refactor Oversized Files (< 150 lines)**:
   - Extract `GameOverWithHistory` to `src/components/GameOverWithHistory.tsx` to reduce `src/App.tsx`.
   - Extract the entire `useEffect` handling confetti to a new utility hook `useConfettiEffect` in `src/components/hud/useConfettiEffect.ts` to reduce `src/components/hud/FeedbackOverlay.tsx`.
   - Extract `triggerKaguraBonus` logic to a new hook `src/hooks/game/useKaguraBonus.ts` to reduce `src/hooks/game/useGameEngine.ts`.
   - Extract the `getIcon` function and `triggerConfetti` implementation from `src/components/GameButton.tsx` to a new helper file `src/components/GameButtonHelpers.tsx`.
3. **Verify File Refactoring**:
   - Run `wc -l` via bash to confirm the lengths of `src/App.tsx`, `src/components/hud/FeedbackOverlay.tsx`, `src/hooks/game/useGameEngine.ts`, and `src/components/GameButton.tsx` are < 150 lines.
4. **Improve UI/UX & Layout (Responsive & Fun)**:
   - Make the HUD overlay look better on smaller devices by ensuring elements don't overlap. Since the provided HUDs already exist (NOVA RODADA, VOCE ACERTOU, etc) and are translated correctly, the primary task here is layout validation and file limit refactoring.
5. **DevOps / Memory Files**:
   - Generate `GEMINI.md`, `ROADMAP.md`, and `.github/workflows/main.yml`.
6. **Verify DevOps Files**: Use `cat` to verify files.
7. **Code Quality**: Run tests (`npm run test`) and linter (`npm run lint -- --fix`).
8. **Pre-commit Steps**:
   - Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
9. **Submit**: Submit the changes.
