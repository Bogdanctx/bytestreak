import LandingPage from './pages/Landing/LandingPage.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { ToastContainer } from 'react-toastify';

function App() {
	return (
        <>
            <CssBaseline />
            <ToastContainer />
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
