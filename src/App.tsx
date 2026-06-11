import { BrowserRouter } from 'react-router-dom'
import { LanguageProvider } from '@/context/LanguageContext'
import { NavigationProvider } from '@/context/NavigationContext'
import { RoleProvider } from '@/context/RoleContext'
import { ScopeProvider } from '@/context/ScopeContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/context/ToastContext'
import { AppRouter } from '@/routes/AppRouter'

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
