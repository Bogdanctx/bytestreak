import LandingPage from './pages/LandingPage.tsx';
import LoginPage from './pages/Login/Login.tsx';
import RegisterPage from './pages/Auth/RegisterPage.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { colors } from './colors'
import NotificationQueue from './components/Notifications/NotificationQueue'

function App() {
	return (
        <>
            <CssBaseline />
            <NotificationQueue />
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = { <LandingPage /> } />
                    <Route path = "/login" element = { <LoginPage /> } />
                    <Route path = "/signup" element = { <RegisterPage /> } /> 
                    <Route path = "/dashboard" element = { <Dashboard /> } />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
