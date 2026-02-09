import LandingPage from './pages/Landing/LandingPage.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import Settings from './pages/Settings/Settings.tsx';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { ToastContainer } from 'react-toastify';
import Navbar from "./components/navbar/Navbar";
import { Box } from '@mui/material';
import { AccountProvider } from './context/AccountContext.tsx';

function App() {

	return (
        <Box bgcolor={"#0C0C0C"} width={"100vw"} height={"100vh"} display={"flex"} flexDirection={"column"}>
            <CssBaseline />
            <ToastContainer />

            <BrowserRouter>
                {window.location.pathname !== "/" && <Navbar />}
                <Box flex={1} overflow={"hidden"}>
                    <AccountProvider>
                        <Routes>
                            <Route path = "/" element = { <LandingPage /> } /> 
                            <Route path = "/dashboard" element = { <Dashboard /> } />
                            <Route path = "/settings" element = { <Settings /> } />
                        </Routes>
                    </AccountProvider>
                </Box>
            </BrowserRouter>
        </Box>
    )
}

export default App
