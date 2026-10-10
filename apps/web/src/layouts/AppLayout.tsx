import { Outlet } from 'react-router-dom'
import ITINERANav from '../components/navigation/ITINERANav'
import ITINERAFooter from '../components/navigation/ITINERAFooter'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ITINERANav />

      {/* Compensates for the fixed navbar height */}
      <div className="flex-1 pt-16 sm:pt-[70px]">
        <Outlet />
      </div>

      <ITINERAFooter />
    </div>
  )
}

