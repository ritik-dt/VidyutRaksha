import { useEffect, useRef, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AiCopilotPanel } from '@/shared/components/layout/AiCopilotPanel'
import { ProvenanceBar } from '@/shared/components/layout/ProvenanceBar'
import { Sidebar } from '@/shared/components/layout/Sidebar'
import { ToastContainer } from '@/shared/components/layout/ToastContainer'
import { Topbar } from '@/shared/components/layout/Topbar'
import { useScope } from '@/shared/context/ScopeContext'
import { useToast } from '@/shared/context/ToastContext'
import { useScrollToTop } from '@/shared/hooks/useScrollToTop'

export function AppShell() {
  const { showToast } = useToast()
  const { scopeVersion } = useScope()
  const welcomeShown = useRef(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  // Reset the #content scroll container to the top on every forward navigation
  // (Back/Forward preserves position, matching native browser behaviour).
  useScrollToTop()

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
      <Sidebar
        mobileOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />
        <ProvenanceBar />
        <div className="flex flex-1 overflow-hidden">
          <div
            className="content-scroll flex-1 overflow-auto p-3 px-4 md:px-6"
            id="content"
          >
            <Outlet key={scopeVersion} />
          </div>
          <ToastContainer />
          <AiCopilotPanel />
        </div>
      </div>
    </div>
  )
}
