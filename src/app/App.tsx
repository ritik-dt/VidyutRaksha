import { BrowserRouter } from 'react-router-dom'
import { ActivityLogProvider } from '@/shared/context/ActivityLogContext'
import { LanguageProvider } from '@/shared/context/LanguageContext'
import { NavigationProvider } from '@/shared/context/NavigationContext'
import { NotifPrefsProvider } from '@/shared/context/NotifPrefsContext'
import { RoleProvider } from '@/shared/context/RoleContext'
import { ScopeProvider } from '@/shared/context/ScopeContext'
import { ThemeProvider } from '@/shared/context/ThemeContext'
import { ToastProvider } from '@/shared/context/ToastContext'
import { AppRouter } from '@/app/routes/AppRouter'

function App() {
  return (
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
  )
}

export default App
