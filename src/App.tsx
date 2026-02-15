import { useState, useCallback, useEffect } from 'react'
import { Header } from './components/layout/Header'
import { BottomNav, type Tab } from './components/layout/BottomNav'
import { HomeScreen } from './screens/HomeScreen'
import { ActiveSessionScreen } from './screens/ActiveSessionScreen'
import { HistoryScreen } from './screens/HistoryScreen'
import { SessionDetailScreen } from './screens/SessionDetailScreen'
import { useTemplates } from './hooks/useTemplates'
import { useActiveSession } from './hooks/useActiveSession'
import { usePreviousWeights } from './hooks/usePreviousWeights'
import { getGoUpSuggestions } from './hooks/useGoUpSuggestions'
import { useSessionHistory } from './hooks/useSessionHistory'

type Screen = { type: 'tabs' } | { type: 'session' } | { type: 'sessionDetail'; sessionId: string }

function App() {
  const [screen, setScreen] = useState<Screen>({ type: 'tabs' })
  const [tab, setTab] = useState<Tab>('home')

  const { templates, loading: templatesLoading, reload: reloadTemplates, rename } = useTemplates()
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

  const handleViewSession = useCallback((sessionId: string) => {
    setScreen({ type: 'sessionDetail', sessionId })
  }, [])

  const handleBackFromDetail = useCallback(() => {
    setScreen({ type: 'tabs' })
  }, [])

  // Loading state
  if (templatesLoading || activeSession.loading) {
    return (
      <div className="min-h-dvh bg-gray-950 flex items-center justify-center">
        <div className="text-accent animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  // Active session - full screen, no bottom nav
  if (screen.type === 'session' && activeSession.session) {
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
        onToggleComplete={activeSession.toggleComplete}
        onSetWeight={activeSession.setWeight}
        onToggleGoUp={activeSession.toggleGoUp}
      />
    )
  }

  // Session detail - full screen, no bottom nav
  if (screen.type === 'sessionDetail') {
    return <SessionDetailScreen sessionId={screen.sessionId} onBack={handleBackFromDetail} />
  }

  // Tab screens
  return (
    <div className="min-h-dvh bg-gray-950 pb-16">
      <Header />
      <main className="max-w-lg mx-auto">
        {tab === 'home' && (
          <HomeScreen templates={templates} onStart={handleStart} onRename={rename} />
        )}
        {tab === 'history' && (
          <HistoryScreen sessions={sessions} onViewSession={handleViewSession} />
        )}
      </main>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  )
}

export default App
