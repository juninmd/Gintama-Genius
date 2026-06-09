
## Responsive HUD & Feedback UI Update (Current Session)
- **Goal**: Improved HUD feedback text sizes and overlapping bug for smaller screens.
- **Actions**:
  - Removed inline `style={{}}` from `FeedbackOverlay.tsx` to utilize CSS classes.
  - Added `.feedback-text` and `.combo` specific logic in `hud.css`.
  - Scaled down font-sizes gracefully to `1.5rem`/`1.8rem` for viewports under 600px width.
  - Adhered strictly to the `<150 lines` limits by extracting `useConfettiEffect` from `FeedbackOverlay.tsx`.
- **Status**: Visual overlay overlap confirmed resolved on viewports as small as 320x568. Passed linting and testing successfully.
