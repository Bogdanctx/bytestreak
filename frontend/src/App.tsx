import LandingPage from './pages/landing-page/LandingPage.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import NotificationQueue from './components/Notifications/NotificationQueue'

function App() {
	return (
        <>
            <CssBaseline />
            <NotificationQueue />
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = { <LandingPage /> } /> 
                    <Route path = "/dashboard" element = { <Dashboard /> } />
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
