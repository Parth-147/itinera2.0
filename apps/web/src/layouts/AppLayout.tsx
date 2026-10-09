import { Outlet } from 'react-router-dom'
import ITINERANav from '../components/navigation/ITINERANav'
import ITINERAFooter from '../components/navigation/ITINERAFooter'

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <ITINERANav />

      {/* pt-20 / pt-24 compensates for the fixed floating nav */}
      <div className="flex-1 pt-20 sm:pt-24">
        <Outlet />
      </div>

      <ITINERAFooter />
    </div>
  )
}

