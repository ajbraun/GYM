import { useState, useCallback, useEffect } from 'react'
import { Header } from './components/layout/Header'
import { BottomNav, type Tab } from './components/layout/BottomNav'
import { HomeScreen } from './screens/HomeScreen'
import { ActiveSessionScreen } from './screens/ActiveSessionScreen'
import { ExerciseDetailScreen } from './screens/ExerciseDetailScreen'
import { HistoryScreen } from './screens/HistoryScreen'
import { SessionDetailScreen } from './screens/SessionDetailScreen'
import { ExerciseManagerScreen } from './screens/ExerciseManagerScreen'
import { useTemplates } from './hooks/useTemplates'
import { useActiveSession } from './hooks/useActiveSession'
import { usePreviousWeights } from './hooks/usePreviousWeights'
import { getGoUpSuggestions } from './hooks/useGoUpSuggestions'
import { useSessionHistory } from './hooks/useSessionHistory'
import { clearAllData } from './services/db'
import { exportToCsv } from './services/exportCsv'

type Screen =
  | { type: 'tabs' }
  | { type: 'session' }
  | { type: 'exerciseDetail'; exerciseId: string }
  | { type: 'sessionDetail'; sessionId: string }
  | { type: 'exerciseManager'; templateId: string }

function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'tabs' })
  const [tab, setTab] = useState<Tab>('home')

  const { templates, loading: templatesLoading, reload: reloadTemplates, rename, add: addTemplate, remove: removeTemplate } = useTemplates()
  const activeSession = useActiveSession()
  const previousWeights = usePreviousWeights(activeSession.session?.templateId ?? null)
  const goUpSuggestions = getGoUpSuggestions(previousWeights)
  const { sessions, reload: reloadHistory } = useSessionHistory()

  // Resume active session on load
  useEffect(() => {
    if (!activeSession.loading && activeSession.isActive && screen.type === 'tabs') {
      setScreen({ type: 'session' })
    }
  }, [activeSession.loading, activeSession.isActive, screen.type])

  const handleStart = useCallback(async (templateId: string) => {
    await activeSession.start(templateId)
    setScreen({ type: 'session' })
  }, [activeSession.start])

  const handleFinish = useCallback(async () => {
    await activeSession.finish()
    setScreen({ type: 'tabs' })
    reloadTemplates()
    reloadHistory()
  }, [activeSession.finish, reloadTemplates, reloadHistory])

  const handleSelectExercise = useCallback((exerciseId: string) => {
    setScreen({ type: 'exerciseDetail', exerciseId })
  }, [])

  const handleBackFromExercise = useCallback(() => {
    setScreen({ type: 'session' })
  }, [])

  const handleViewSession = useCallback((sessionId: string) => {
    setScreen({ type: 'sessionDetail', sessionId })
  }, [])

  const handleBackFromDetail = useCallback(() => {
    setScreen({ type: 'tabs' })
  }, [])

  const handleEditExercises = useCallback((templateId: string) => {
    setScreen({ type: 'exerciseManager', templateId })
  }, [])

  const handleBackFromExerciseManager = useCallback(() => {
    setScreen({ type: 'tabs' })
    reloadTemplates()
  }, [reloadTemplates])

  const handleClearAll = useCallback(async () => {
    await clearAllData()
    reloadTemplates()
    reloadHistory()
  }, [reloadTemplates, reloadHistory])

  // Loading state
  if (templatesLoading || activeSession.loading) {
    return (
      <div className="min-h-dvh bg-gray-950 flex items-center justify-center">
        <div className="text-accent animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  // Exercise detail within active session
  if (screen.type === 'exerciseDetail' && activeSession.session) {
    const exercise = activeSession.exercises.find((e) => e.id === screen.exerciseId)
    const log = activeSession.logs.get(screen.exerciseId)
    if (exercise && log) {
      const prevLog = previousWeights.get(exercise.id)
      return (
        <ExerciseDetailScreen
          exercise={exercise}
          log={log}
          previousWeight={prevLog?.weightUsed ?? null}
          goUpSuggestion={goUpSuggestions.get(exercise.id) ?? null}
          onBack={handleBackFromExercise}
          onCompleteSet={activeSession.completeSet}
          onToggleGoUp={activeSession.toggleGoUp}
        />
      )
    }
  }

  // Active session dashboard
  if ((screen.type === 'session' || screen.type === 'exerciseDetail') && activeSession.session) {
    const template = templates.find((t) => t.id === activeSession.session!.templateId)
    return (
      <ActiveSessionScreen
        emoji={template?.emoji ?? '?'}
        name={template?.name ?? 'Workout'}
        elapsed={activeSession.elapsed}
        exercises={activeSession.exercises}
        logs={activeSession.logs}
        previousWeights={previousWeights}
        goUpSuggestions={goUpSuggestions}
        onFinish={handleFinish}
        onSelectExercise={handleSelectExercise}
      />
    )
  }

  // Session detail - full screen, no bottom nav
  if (screen.type === 'sessionDetail') {
    return <SessionDetailScreen sessionId={screen.sessionId} onBack={handleBackFromDetail} />
  }

  // Exercise manager - full screen, no bottom nav
  if (screen.type === 'exerciseManager') {
    return <ExerciseManagerScreen templateId={screen.templateId} onBack={handleBackFromExerciseManager} />
  }

  // Tab screens
  return (
    <div className="min-h-dvh bg-gray-950 pb-16">
      <Header />
      <main className="max-w-lg mx-auto">
        {tab === 'home' && (
          <HomeScreen templates={templates} onStart={handleStart} onEdit={handleEditExercises} onRename={rename} onAdd={addTemplate} onDelete={removeTemplate} />
        )}
        {tab === 'history' && (
          <HistoryScreen sessions={sessions} onViewSession={handleViewSession} onClearAll={handleClearAll} onExportCsv={exportToCsv} />
        )}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
