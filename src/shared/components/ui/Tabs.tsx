import {
  createContext,
  useContext,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type TabsOrientation = 'horizontal' | 'vertical'

interface TabsContextValue {
  activeValue: string | undefined
  setActiveValue: (value: string) => void
  orientation: TabsOrientation
  idPrefix: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

export interface TabsProps {
  children: ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  orientation?: TabsOrientation
}

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

export function useTabsContext() {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within <Tabs>')
  }
  return context
}

export function sanitizeTabValue(value: string): string {
  return value.replace(/[^a-zA-Z0-9_-]+/g, '-')
}

