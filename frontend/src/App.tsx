import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Box, CssBaseline } from '@mui/material';

import ProtectedLayout from './components/ProtectedLayout.tsx';
import { WebSocketProvider } from './context/WebSocketContext.tsx';
import Creator from './pages/Creator/Creator.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import Problem from './pages/Problem/Problem.tsx';
import Settings from './pages/Settings/Settings.tsx';
import LandingPage from './pages/Landing/LandingPage.tsx';
import Social from './pages/Social/Social.tsx';
import ProblemBuilder from './features/ProblemBuilder/components/ProblemBuilder.tsx';
import './App.css';

const queryClient = new QueryClient();

function App() {
	return (
        <Box bgcolor={"var(--bg-0)"} width={"100vw"} height={"100vh"} display={"flex"} flexDirection={"column"}>
            <CssBaseline />
            <ToastContainer />

            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
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
                </BrowserRouter>
            </QueryClientProvider>
        </Box>
    )
}

export default App