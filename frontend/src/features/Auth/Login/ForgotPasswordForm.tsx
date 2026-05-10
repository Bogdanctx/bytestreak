import { Controller, useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';

interface ForgotPasswordProps {
    setShowAuthState: React.Dispatch<React.SetStateAction<'login' | 'register' | 'forgot-password' | null>>;
};

interface ForgotPasswordInputs {
    email: string;
}

function ForgotPasswordForm(props: ForgotPasswordProps) {
    const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordInputs>({
        defaultValues: { email: "" }
    });

    const resetMutation = useMutation({
        mutationFn: async (data: ForgotPasswordInputs) => {
            const response = await api.post(`/auth/request-magic-link?email=${data.email}`);
            return response;
        },
        onSuccess: () => {
            notify("If an account exists, a magic link was sent to your email.", "success");
            props.setShowAuthState("login");
        },
        onError: (error) => {
            notify("Failed to send reset link. Try again.", "error");
            console.error("Reset error:", error);
        }
    });

    const onSubmit = (data: ForgotPasswordInputs) => {
        resetMutation.mutate(data);
    }

    return (
        <Box className="auth-container">
            <Box className="auth-header">
                <Typography className="auth-title">
                    Reset Password
                </Typography>
                <Typography className="auth-subtitle">
                    Enter your email to receive a magic login link
                </Typography>
            </Box>
            
            <Box className="auth-form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name="email"
                        rules={{
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email address"
                            }
                        }}
                        render={({ field }) => (
                            <TextField 
                                {...field} 
                                className="auth-textfield"
                                label="Email"
                                variant="outlined"
                                placeholder="Enter your email"
                                helperText={errors.email ? errors.email.message : ""}
                                error={!!errors.email}
                                margin="normal"
                                fullWidth
                            />
                        )}
                    />

                    <Box className="auth-actions" mt={2}>
                        <Button 
                            className="auth-primary-btn" 
                            variant="contained" 
                            type="submit" 
                            fullWidth
                            disabled={resetMutation.isPending}
                        >
                            {resetMutation.isPending ? "Sending..." : "Send Magic Link"}
                        </Button>
                        <Button 
                            className="auth-secondary-btn" 
                            onClick={() => props.setShowAuthState('login')} 
                            variant="outlined" 
                            fullWidth
                        >
                            Back to Login
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}

export default ForgotPasswordForm;