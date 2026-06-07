import { Controller, useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useMutation } from '@tanstack/react-query';

import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';

interface IRecoverAccountProps {
    setShowAuthState: React.Dispatch<React.SetStateAction<'login' | 'register' | 'recover-account' | null>>;
};

interface IRecoverAccountInputs {
    email: string;
}

function RecoverAccountForm(props: IRecoverAccountProps) {
    const { control, handleSubmit, formState: { errors } } = useForm<IRecoverAccountInputs>({
        defaultValues: { email: "" }
    });

    const resetMutation = useMutation({
        mutationFn: async (data: IRecoverAccountInputs) => {
            const response = await api.post(`/auth/request-recovery-link?email=${data.email}`);
            return response;
        },
        onSuccess: () => {
            notify("If an account exists, a recovery link was sent to that email. Be sure to check your spam folder.", "success");
            props.setShowAuthState("login");
        },
        onError: (error) => {
            notify("Failed to send recovery link. Try again.", "error");
            console.error("Recovery error:", error);
        }
    });

    const onSubmit = (data: IRecoverAccountInputs) => {
        resetMutation.mutate(data);
    }

    return (
        <Box className="auth-container">
            <Box className="auth-header">
                <Typography className="auth-title">
                    Recover Your Account
                </Typography>
                <Typography className="auth-subtitle">
                    Enter your email to receive a recovery link
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
                            {resetMutation.isPending ? "Sending..." : "Send Recovery Link"}
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

export default RecoverAccountForm;