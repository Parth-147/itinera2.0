import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import Home from './pages/Home'
import Search from './pages/Search'
import Create from './pages/Create'
import Inbox from './pages/Inbox'
import Saved from './pages/Saved'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth pages — no nav / footer */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* App pages — wrapped in AppLayout (nav + footer) */}
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/create" element={<Create />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/saved" element={<Saved />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App