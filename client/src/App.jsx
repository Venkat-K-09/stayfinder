import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import { LoginPage, RegisterPage } from './pages/AuthPages'
import PlacePage from './pages/PlacePage'
import HostPage from './pages/HostPage'
import DashboardPage from './pages/DashboardPage'
import MyListingsPage from './pages/MyListingsPage'
import './index.css'

export default function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/place/:id" element={<PlacePage />} />
            <Route path="/host" element={<HostPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/my-listings" element={<MyListingsPage />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  )
}
