import { Outlet } from 'react-router'
import { Sidebar } from './sidebar'
import { BottomBar } from './bottom-bar'

/** Shell for the home, list and profile pages: side navigation on desktop, bottom bar on mobile. */
export function DashboardLayout() {
  return (
    <>
      <Sidebar />
      <div className="flex min-h-screen justify-center md:pl-14">
        <Outlet />
      </div>
      <BottomBar />
    </>
  )
}
