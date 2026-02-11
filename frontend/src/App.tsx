import LandingPage from './pages/Landing/LandingPage.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import Settings from './pages/Settings/Settings.tsx';
import Problem from './pages/Problem/Problem.tsx';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline } from '@mui/material'
import { ToastContainer } from 'react-toastify';
import Navbar from "./components/navbar/Navbar";
import { Box } from '@mui/material';
import { AccountProvider } from './context/AccountContext.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';

function App() {
    const location = window.location.pathname;
    
	return (
        <Box bgcolor={"#0C0C0C"} width={"100vw"} height={"100vh"} display={"flex"} flexDirection={"column"}>
            <CssBaseline />
            <ToastContainer />

            <BrowserRouter>

                {location !== "/" && <Navbar />}

                <Box flex={1} overflow={"hidden"}>
                    <AccountProvider>
                        <Routes>
                            {/* public routes */}
                            <Route path = "/" element = { <LandingPage /> } /> 

                            {/* protected routes */}
                            <Route element = { <ProtectedRoute /> }>
                                <Route path = "/dashboard" element = { <Dashboard /> } />
                                <Route path = "/settings" element = { <Settings /> } />
                                <Route path = "/problems/:id/description" element = { <Problem /> } />
                            </Route>

                        </Routes>
                    </AccountProvider>
                </Box>
            </BrowserRouter>
        </Box>
    )
}

export default App
