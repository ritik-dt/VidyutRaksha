import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'
import { ActivityLogProvider } from '@/shared/context/ActivityLogProvider'
import { LanguageProvider } from '@/shared/context/LanguageProvider'
import { NavigationProvider } from '@/shared/context/NavigationProvider'
import { NotifPrefsProvider } from '@/shared/context/NotifPrefsProvider'
import { RoleProvider } from '@/shared/context/RoleProvider'
import { ScopeProvider } from '@/shared/context/ScopeProvider'
import { ThemeProvider } from '@/shared/context/ThemeProvider'
import { ToastProvider } from '@/shared/context/ToastProvider'
import { AppRouter } from '@/app/routes/AppRouter'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <BrowserRouter>
            <NavigationProvider>
              <RoleProvider>
                <ActivityLogProvider>
                  <NotifPrefsProvider>
                    <ScopeProvider>
                      <LanguageProvider>
                        <AppRouter />
                      </LanguageProvider>
                    </ScopeProvider>
                  </NotifPrefsProvider>
                </ActivityLogProvider>
              </RoleProvider>
            </NavigationProvider>
          </BrowserRouter>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
