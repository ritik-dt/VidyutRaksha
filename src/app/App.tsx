import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '@/shared/context/LanguageContext'
import { NavigationProvider } from '@/shared/context/NavigationContext'
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
              <ScopeProvider>
                <LanguageProvider>
                  <AppRouter />
                </LanguageProvider>
              </ScopeProvider>
            </RoleProvider>
          </NavigationProvider>
        </BrowserRouter>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
