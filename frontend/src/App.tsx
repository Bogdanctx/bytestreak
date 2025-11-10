import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'

const COLOR_NIGHT = "#0C0C0C";
const COLOR_EMERALD = "#23CE6B";
const COLOR_GHOST_WHITE = "#F6F8FF";
const COLOR_PURPUREUS = "#A845A0"
const COLOR_ROSE_TAUPE = "#785964";

const theme = createTheme({
	palette: {
        mode: "dark",
        
        primary: {
            main: COLOR_PURPUREUS, // Mov
        },
        
        secondary: {
            main: COLOR_EMERALD,
        },

        background: {
            default: COLOR_NIGHT,
            paper: COLOR_ROSE_TAUPE,
        },

        text: {
            primary: COLOR_GHOST_WHITE,
        },
        
        success: {
            main: COLOR_EMERALD,
        },

		divider: COLOR_GHOST_WHITE,
    }
});

function App() {
	return (
		<ThemeProvider theme = {theme}>
			<CssBaseline />
			<BrowserRouter>
				<Routes>
					<Route path = "/" element = { <LandingPage /> } />
					<Route path = "/login" element = { <LoginPage /> } />
                    <Route path = "/signup" element = { <RegisterPage /> } />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	)
}

export default App
