import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { Box, CircularProgress, Typography } from '@mui/material';
import { api } from '../../api';
import notify from '../../components/ui/ToastNotification';

function MagicLoginHandler() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();

    const loginMutation = useMutation({
        mutationFn: async () => {
            return api.post(`/auth/magic-login?token=${token}`);
        },
        onSuccess: () => {
            notify("Successfully logged in!", "success");
            navigate('/dashboard'); 
        },
        onError: () => {
            notify("Link is invalid or expired.", "error");
            navigate('/');
        }
    });

    useEffect(() => {
        if (token && !loginMutation.isPending) {
            loginMutation.mutate();
        } 
        else if (!token) {
            navigate('/');
        }
    }, [token]);

    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh">
            <CircularProgress sx={{ color: 'var(--accent-main)', mb: 2 }} />
            <Typography>Authenticating securely...</Typography>
        </Box>
    );
}

export default MagicLoginHandler;