import { createContext, useContext } from 'react'

/**
 * Internal machinery for the Tabs component family (Tabs, TabsList,
 * TabsTrigger, TabsContent).
 *
 * Split out from `Tabs.tsx` so the .tsx file only exports the component.
 * Fast Refresh preserves component state across edits only when every export
 * in the module is a component — this move is a Fast Refresh compatibility
 * fix, not a runtime change.
 */

export type TabsOrientation = 'horizontal' | 'vertical'

export interface TabsContextValue {
  activeValue: string | undefined
  setActiveValue: (value: string) => void
  orientation: TabsOrientation
  idPrefix: string
}

export const TabsContext = createContext<TabsContextValue | null>(null)

export function useTabsContext(): TabsContextValue {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within <Tabs>')
  }
  return context
}

/** Normalises a tab value into a form safe to embed in DOM ids. */
export function sanitizeTabValue(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]+/g, '-')
}
