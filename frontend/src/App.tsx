import LandingPage from './pages/Landing/LandingPage.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import Settings from './pages/Settings/Settings.tsx';
import Problem from './pages/Problem/Problem.tsx';
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CssBaseline, Box } from '@mui/material'
import { ToastContainer } from 'react-toastify';
import { AccountProvider } from './context/AccountContext.tsx';
import { WebSocketProvider } from './context/WebSocketContext.tsx';
import ProtectedLayout from './components/ProtectedLayout.tsx'; // IMPORT THE NEW LAYOUT
import Creator from './pages/Creator/Creator.tsx';
import ProblemBuilder from './features/ProblemBuilder/components/ProblemBuilder.tsx';
import Social from './pages/Social/Social.tsx';

function App() {
	return (
        <Box bgcolor={"var(--bg-0)"} width={"100vw"} height={"100vh"} display={"flex"} flexDirection={"column"}>
            <CssBaseline />
            <ToastContainer />

            <BrowserRouter>
                <AccountProvider>
                    <WebSocketProvider>
                        <Routes>
                            <Route path="/" element={<LandingPage />} /> 

                            <Route element={<ProtectedLayout />}>
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/problems/:id/description" element={<Problem />} />
                                <Route path="/social" element={<Social />} />

                                <Route path="/creator" element={<Creator />} />
                                <Route path="/creator/new" element={<ProblemBuilder />} />
                                <Route path="/creator/edit/:id" element={<ProblemBuilder />} />
                            </Route>
                        </Routes>
                    </WebSocketProvider>
                </AccountProvider>
            </BrowserRouter>
        </Box>
    )
}

export default App