import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

const pageTitles = {
  '/': 'Dashboard',
  '/savings-calculator': 'Savings Calculator',
  '/transactions': 'Transactions',
  '/merchant-health': 'Merchant Health',
  '/reports': 'Reports',
}

const getPageTitle = (pathname) => {
  if (pageTitles[pathname]) {
    return pageTitles[pathname]
  }

  return pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => segment.replace(/-/g, ' '))
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' / ') || 'Dashboard'
}

export default function Layout() {
  const { pathname } = useLocation()
  const title = getPageTitle(pathname)

  return (
    <div className="h-screen bg-[#0A0F0D] text-white">
      <aside className="fixed left-0 top-0 h-screen w-[240px]">
        <Sidebar />
      </aside>

      <div className="ml-[240px] h-screen">
        <div className="fixed left-[240px] right-0 top-0 z-10">
          <TopBar title={title} />
        </div>

        <main className="h-screen overflow-y-auto bg-[#0A0F0D] pt-20">
          <div className="min-h-full p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
