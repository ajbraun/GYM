# Compound — Dev State

## Stack
- React 19 + TypeScript + Tailwind v4 + Vite 7
- PWA via `vite-plugin-pwa` (autoUpdate service worker)
- IndexedDB via `idb` — database name: `workout-tracker-v2`
- No router library — state-based navigation in App.tsx
- Deployed to Vercel via GitHub push to `main`

## Data Model (IndexedDB stores)
- **templates** — workout types (Leg Day, Upper Body, etc). User can add/delete/rename.
- **exercises** — belong to a template via `templateId`. Have `active` boolean for soft-delete. `setsReps` string like `"3 × 8-10"` is parsed at runtime.
- **sessions** — a single workout instance. `completedAt: null` means active. Only one active session at a time, tracked via `meta.activeSessionId`.
- **exerciseLogs** — keyed `sessionId-exerciseId`. Contains `sets: SetLog[]` array for per-set tracking (weight, actualReps, completed). `weightUsed` kept as summary field for backwards compat.
- **meta** — key/value store. Currently only `activeSessionId`.

## Screen Flow
```
Home (tab) ──→ Start Workout ──→ Session Dashboard ──→ Exercise Detail (set-by-set)
                                       │                      │
                                       │                      └── Back to Dashboard
                                       └── Finish ──→ Home
Home ──→ Edit exercises ──→ Exercise Manager
History (tab) ──→ Session Detail (read-only)
```

## Key Architecture Decisions
- **No router** — `Screen` union type in App.tsx drives all navigation
- **Staleness sorting** — home screen sorts templates by "longest since last done" first, never-done at top
- **Set-by-set tracking** — `setsReps` string parsed via regex in `exerciseLogService.ts:parseSetsReps()`. Sets pre-filled with previous session's weight.
- **Session resume** — on app launch, checks `meta.activeSessionId` and resumes if found
- **Debounce removed** — set completion writes immediately (was 300ms debounce for old weight-only input)
- **Safe area** — plain CSS classes `.safe-top` / `.safe-bottom` in index.css (Tailwind v4 `@utility` didn't work with `env()` on iOS)
- **Backwards compat** — old ExerciseLogs without `sets` array handled gracefully (default to empty array)
- **Exercise soft-delete** — `active: boolean` field, old records without it treated as active via `isActive()` helper

## File Structure
```
src/
  App.tsx                    — navigation shell, screen routing
  types/                     — WorkoutTemplate, Exercise, WorkoutSession, ExerciseLog, SetLog
  services/
    db.ts                    — IndexedDB schema, getDB(), clearAllData()
    seed.ts                  — default templates + exercises (no Full Body)
    templateService.ts       — CRUD + add/delete templates
    exerciseService.ts       — CRUD, active filtering, getAllExercisesForTemplate (includes inactive)
    exerciseLogService.ts    — set creation, parseSetsReps(), getOrCreateLog()
    sessionService.ts        — create/complete sessions, active session tracking
    exportCsv.ts             — CSV export of all history
  hooks/
    useTemplates.ts          — templates + staleness + add/rename/delete
    useActiveSession.ts      — session lifecycle, completeSet(), timer
    usePreviousWeights.ts    — last session's logs for a template
    useGoUpSuggestions.ts    — +5 lbs suggestions from previous goUp flags
    useSessionHistory.ts     — completed sessions list + getSessionDetail()
    useExercises.ts          — exercises for a template (used by exercise manager)
  screens/
    HomeScreen.tsx           — template cards + add workout
    ActiveSessionScreen.tsx  — exercise dashboard during workout
    ExerciseDetailScreen.tsx — set-by-set tracker (weight, reps, complete)
    HistoryScreen.tsx        — past sessions + CSV export + clear data
    SessionDetailScreen.tsx  — read-only session review with per-set data
    ExerciseManagerScreen.tsx — add/edit/reorder/deactivate exercises
  components/
    layout/Header.tsx, BottomNav.tsx
    templates/TemplateCard.tsx
    session/SessionHeader.tsx, WeightInput.tsx, GoUpButton.tsx, etc.
    history/SessionCard.tsx
```

## Known Issues / TODO
- Safe area top padding: switched from `@utility` to plain CSS `.safe-top` class — works but not Tailwind-idiomatic
- PWA icons exist at `public/icons/` (192, 512, 512-maskable) — generated from user-provided designs
- `ExerciseLog.weightUsed` is redundant with per-set weights but kept for summary/backwards compat
- No undo on template or exercise delete
- Session timer resets display on resume (elapsed recalculates from `startedAt`)
