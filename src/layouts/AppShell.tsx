import { useEffect, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import { AiCopilotPanel } from '@/components/layout/AiCopilotPanel'
import { ProvenanceBar } from '@/components/layout/ProvenanceBar'
import { Sidebar } from '@/components/layout/Sidebar'
import { ToastContainer } from '@/components/layout/ToastContainer'
import { Topbar } from '@/components/layout/Topbar'
import { useScope } from '@/context/ScopeContext'
import { useToast } from '@/context/ToastContext'

export function AppShell() {
  const { showToast } = useToast()
  const { scopeVersion } = useScope()
  const welcomeShown = useRef(false)

  useEffect(() => {
    if (welcomeShown.current) {
      return
    }
    welcomeShown.current = true

    const timeoutId = window.setTimeout(() => {
      showToast({
        type: 'ai',
        title: '✦ Welcome to VidyutRaksha',
        message:
          'New here? Click the "✦ Tour" button in the top bar for a 5-minute guided walkthrough.',
        duration: 7000,
      })
    }, 1500)

    return () => window.clearTimeout(timeoutId)
  }, [showToast])

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar />
        <ProvenanceBar />
        <div className="flex flex-1 overflow-hidden">
          <div className="content-scroll flex-1 overflow-auto p-2 px-6" id="content">
            <Outlet key={scopeVersion} />
          </div>
          <ToastContainer />
          <AiCopilotPanel />
        </div>
      </div>
    </div>
  )
}
