import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Box, CssBaseline } from '@mui/material';

import { WebSocketProvider } from './context/WebSocketContext.tsx';
import Creator from './pages/Creator/Creator.tsx';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import Problem from './pages/Problem/Problem.tsx';
import Settings from './pages/Settings/Settings.tsx';
import LandingPage from './pages/Landing/LandingPage.tsx';
import Social from './pages/Social/Social.tsx';
import ProblemBuilder from './features/ProblemBuilder/ProblemBuilder.tsx';
import Administration from './pages/Administration/Administration.tsx';
import './App.css';
import Layout from './components/ui/Layout.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import RecoverAccountHandler from './features/Auth/RecoverAccountHandler.tsx';
import UserProfile from './pages/UserProfile/UserProfile.tsx';
import AdminRoute from './components/AdminRoute.tsx';
import CreatorRoute from './components/CreatorRoute.tsx';

const queryClient = new QueryClient();

function App() {
	return (
        <Box id="app-container">
            <CssBaseline />

            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <WebSocketProvider>
                        <ToastContainer />

                        <Routes>
                            <Route path="/" element={<LandingPage />} />

                            <Route path="/recover-account" element={<RecoverAccountHandler />} />

                            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                                <Route path="/admin/*" element={<AdminRoute><Administration /></AdminRoute>} />

                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/problems/:id/description" element={<Problem />} />
                                <Route path="/social" element={<Social />} />

                                <Route path="/accounts/profile/:username" element={<UserProfile />} />


                                <Route path="/creator" element={<CreatorRoute />}>
                                    <Route index element={<Creator />} />
                                    <Route path="/creator/new" element={<ProblemBuilder />} />
                                    <Route path="/creator/edit/:id" element={<ProblemBuilder />} />
                                </Route>

                            </Route>
                        </Routes>
                        
                    </WebSocketProvider>
                </BrowserRouter>
            </QueryClientProvider>
        </Box>
    )
}

export default App