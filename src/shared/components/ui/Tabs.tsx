import {
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  TabsContext,
  type TabsContextValue,
  type TabsOrientation,
} from './tabsContext'

export type { TabsOrientation } from './tabsContext'

export interface TabsProps {
  children: ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: TabsOrientation
}

/**
 * Root of the Tabs component family. Provides the shared context used by
 * TabsList, TabsTrigger, and TabsContent. The context object, hook
 * (`useTabsContext`), and the `sanitizeTabValue` helper live in
 * `./tabsContext.ts` so this file only exports components (required for
 * React Fast Refresh to preserve state).
 */
export function Tabs({
  children,
  value,
  defaultValue,
  onValueChange,
  orientation = 'horizontal',
}: TabsProps) {
  const idPrefix = useId()
  const [internalValue, setInternalValue] = useState(defaultValue)
  const isControlled = value !== undefined
  const activeValue = isControlled ? value : internalValue

  const contextValue = useMemo<TabsContextValue>(
    () => ({
      activeValue,
      setActiveValue: (nextValue: string) => {
        if (!isControlled) {
          setInternalValue(nextValue)
        }
        onValueChange?.(nextValue)
      },
      orientation,
      idPrefix,
    }),
    [activeValue, isControlled, onValueChange, orientation, idPrefix],
  )

  return (
    <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>
  )
}
