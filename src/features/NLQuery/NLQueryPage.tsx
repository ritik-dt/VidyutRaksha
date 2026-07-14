import { useToast } from '@/shared/context/ToastContext'
import { useNLQuery } from './hooks/useNLQuery'
import { NlHero } from './components/NlHero'
import { NlQueryInput } from './components/NlQueryInput'
import { NlSuggestionChips } from './components/NlSuggestionChips'
import { NlResultCard } from './components/NlResultCard'

/**
 * NLQuery / Ask AI page. Faithful port of the prototype's renderNLQuery() —
 * a single-screen, centered, 640px-max column: hero → input → suggestion
 * chips → static result card. No scope, no state-driven result flow.
 */
export default function NLQueryPage() {
  const { showToast } = useToast()
  const {
    input,
    setInput,
    applySuggestion,
    suggestions,
    sqlText,
    resultMeta,
    resultRows,
  } = useNLQuery()

  const handleSubmit = () => {
    if (!input.trim()) return
    showToast({
      type: 'ai',
      title: 'Running query',
      message: 'AI is translating your question to SQL and querying the data pool…',
      duration: 3000,
    })
  }

  const handleExport = () => {
    showToast({
      type: 'info',
      title: 'Exporting results',
      message: `Preparing CSV of ${resultMeta.headerTitle.replace('AI found ', '')} for download.`,
      duration: 3000,
    })
  }

  const handleViewAll = () => {
    showToast({
      type: 'info',
      title: 'View all results',
      message: 'Would open the full 23-meter result list.',
      duration: 3000,
    })
  }

  return (
    <div className="pb-2">
      <div className="mx-auto" style={{ maxWidth: 640 }}>
        <NlHero />
        <NlQueryInput value={input} onChange={setInput} onSubmit={handleSubmit} />
        <NlSuggestionChips suggestions={suggestions} onPick={applySuggestion} />
        <NlResultCard
          meta={resultMeta}
          sqlText={sqlText}
          rows={resultRows}
          onExport={handleExport}
          onViewAll={handleViewAll}
        />
      </div>
    </div>
  )
}
