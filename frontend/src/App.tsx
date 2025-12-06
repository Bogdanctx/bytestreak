import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material'
import { colors } from './colors'

const theme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: colors.night,
            paper: colors.night
        },
    },
});

function App() {
	return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = { <LandingPage /> } />
                    <Route path = "/login" element = { <LoginPage /> } />
                    <Route path = "/signup" element = { <RegisterPage /> } /> 
                    <Route path = "/dashboard" element = { <Dashboard /> } />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
