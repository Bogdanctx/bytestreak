import LandingPage from './pages/LandingPage'
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
			main: COLOR_NIGHT
		},
		secondary: {
			main: COLOR_EMERALD
		},
		background: {
			default: COLOR_NIGHT
		},
		divider: COLOR_PURPUREUS
	},

});

function App() {
	return (
		<ThemeProvider theme = {theme}>
			<CssBaseline />
			<BrowserRouter>
				<Routes>
					<Route path = "/" element = { <LandingPage /> } />
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	)
}

export default App
