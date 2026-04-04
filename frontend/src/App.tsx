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
import Creator from './pages/Creator/Creator.tsx';
import ProblemBuilder from './features/ProblemBuilder/components/ProblemBuilder.tsx';

function App() {
    const location = window.location.pathname;
    
	return (
        <Box bgcolor={"var(--bg-0)"} width={"100vw"} height={"100vh"} display={"flex"} flexDirection={"column"}>
            <CssBaseline />
            <ToastContainer />

            <BrowserRouter>

                {location !== "/" && <Navbar />}

                <Box flex={1} overflow={"hidden"} padding={2}>
                    <AccountProvider>
                        <Routes>
                            {/* public routes */}
                            <Route path = "/" element = { <LandingPage /> } /> 

                            {/* protected routes */}
                            <Route element = { <ProtectedRoute /> }>
                                <Route path = "/dashboard" element = { <Dashboard /> } />
                                <Route path = "/settings" element = { <Settings /> } />
                                <Route path = "/problems/:id/description" element = { <Problem /> } />

                                <Route path = "/creator" element = { <Creator /> } />
                                <Route path = "/creator/new" element = { <ProblemBuilder /> } />
                                <Route path = "/creator/edit/:id" element = { <ProblemBuilder /> } />
                            </Route>

                        </Routes>
                    </AccountProvider>
                </Box>
                
            </BrowserRouter>
        </Box>
    )
}

export default App
