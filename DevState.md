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
Home (tab) ──→ Template Detail (start/edit) ──→ Start Workout ──→ Session Dashboard ──→ Exercise Detail (set-by-set)
                     │                                │                      │
                     │                                │                      └── Back to Dashboard
                     │                                └── Back (keeps session alive) ──→ Home
                     │                                └── Finish ──→ Home
                     └── Edit Workout ──→ Exercise Manager ──→ Back to Template Detail
Home (tab) ──→ Active template card ("In Progress") ──→ Resume Session Dashboard
History (tab) ──→ Session Detail (read-only)
```

## Key Architecture Decisions
- **No router** — `Screen` union type in App.tsx drives all navigation
- **Staleness sorting** — home screen sorts templates by "longest since last done" first, never-done at top
- **Template detail screen** — landing page when tapping a template card. Shows exercise list (read-only), "Start Workout" button, and "Edit Workout" link to exercise manager
- **Session navigation** — back button returns to home without finishing; active session persists. Template card shows "In Progress" with accent border. Tapping resumes session.
- **Set-by-set tracking** — `setsReps` string parsed via regex in `exerciseLogService.ts:parseSetsReps()`. Sets pre-filled with previous session's weight.
- **Session resume** — on app launch, checks `meta.activeSessionId` and resumes if found
- **Active session grid** — 2-column grid of exercise cards, green when completed, orange dots for in-progress sets
- **Debounce removed** — set completion writes immediately
- **Safe area** — plain CSS classes `.safe-top` / `.safe-bottom` in index.css (Tailwind v4 `@utility` didn't work with `env()` on iOS)
- **Backwards compat** — old ExerciseLogs without `sets` array handled gracefully (default to empty array)
- **Exercise soft-delete** — `active: boolean` field, old records without it treated as active via `isActive()` helper

## Design System (v0.2)
- **Theme colors**: accent (#f97316 orange), success (#34d399 green), surface-card (#1e2433), surface-hover (#2a3040)
- **Card radius**: all `rounded-2xl` (16px)
- **Horizontal padding**: all screens use `px-5`
- **Borders**: `border-white/5` for headers/dividers
- **Touch targets**: minimum 44px (back buttons w-6 h-6 with p-1, nav buttons py-3, Finish button py-2.5)
- **Completed state**: green (`text-success`, `bg-success/10`) — orange reserved for accent/active
- **Inputs**: borderless `bg-white/5` with `focus:ring-2 focus:ring-accent/50`
- **Font**: SF Pro via `-apple-system` stack
- **iOS PWA**: `user-scalable=no`, `viewport-fit=cover`, `overscroll-behavior: none`, tap highlight disabled

## File Structure
```
src/
  App.tsx                    — navigation shell, screen routing, 6 screen types
  types/                     — WorkoutTemplate, Exercise, WorkoutSession, ExerciseLog, SetLog
  services/
    db.ts                    — IndexedDB schema, getDB(), clearAllData()
    seed.ts                  — default templates + exercises (Leg Day, Upper Body, Active Recovery)
    templateService.ts       — CRUD + add/delete/rename templates
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
    HomeScreen.tsx           — template cards + add workout + active session indicator
    TemplateDetailScreen.tsx — start workout / edit workout landing page
    ActiveSessionScreen.tsx  — 2-col exercise grid during workout, back without finishing
    ExerciseDetailScreen.tsx — set-by-set tracker (weight, reps, complete)
    HistoryScreen.tsx        — past sessions + CSV export + clear data
    SessionDetailScreen.tsx  — read-only session review with per-set data
    ExerciseManagerScreen.tsx — add/edit/reorder/deactivate exercises
  components/
    layout/Header.tsx, BottomNav.tsx
    templates/TemplateCard.tsx  — shows "In Progress" for active session
    session/SessionHeader.tsx   — back button + timer + finish button
    history/SessionCard.tsx
```

## Releases
- **v0.1** — functional baseline (all features working, developer styling)
- **v0.2** (current) — visual polish pass + UX improvements (template detail screen, session back nav, design system)

## Known Issues / TODO
- Safe area top padding: switched from `@utility` to plain CSS `.safe-top` class — works but not Tailwind-idiomatic
- PWA icons exist at `public/icons/` (192, 512, 512-maskable) — generated from user-provided designs
- `ExerciseLog.weightUsed` is redundant with per-set weights but kept for summary/backwards compat
- No undo on template or exercise delete
- Session timer resets display on resume (elapsed recalculates from `startedAt`)
- Only one active session at a time (enforced by meta store)
