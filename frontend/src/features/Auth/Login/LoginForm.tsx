import { Controller, useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';

import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';
import { type LoginFormInputs } from '../../../types/auth.types';
import './LoginForm.style.css';
import { useMutation } from '@tanstack/react-query';

interface ILoginFormProps {
    setShowAuthState: React.Dispatch<React.SetStateAction<'login' | 'register' | 'recover-account' | null>>;
};

const LOGIN_FORM_VALIDATION_RULES = {
    email: {
        required: "Email is required",
        pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Invalid email address"
        }
    },
    password: {
        required: "Password is required"
    }
};

function LoginForm(props: ILoginFormProps) {
    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const loginMutation = useMutation({
        mutationFn: async (data: LoginFormInputs) => {
            const response = await api.post("auth/login", data);
            return response;
        },
        onSuccess: () => {
            notify("Login successful!", "success");
            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 1500);
        },
        onError: (error) => {
            notify("An error occurred during login.", "error");
            console.error("Login error:", error);
        }
    });

    const onSubmit = (data: LoginFormInputs) => {
        loginMutation.mutate(data);
    }

    return (
        <Box className="auth-container">
            <Box className="auth-header">
                <Typography className="auth-title">
                    Welcome Back
                </Typography>
                <Typography className="auth-subtitle">
                    Log in to continue your streak
                </Typography>
            </Box>
            
            <Box className="auth-form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name="email"
                        rules={LOGIN_FORM_VALIDATION_RULES.email}
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

                    <Controller
                        control={control}
                        name="password"
                        rules={LOGIN_FORM_VALIDATION_RULES.password}
                        render={({ field }) => (
                            <TextField 
                                {...field}
                                fullWidth
                                className="auth-textfield"
                                type="password"
                                label="Password"
                                variant="outlined"
                                placeholder="Enter your password"
                                margin="normal"
                                error={!!errors.password}
                                helperText={errors.password ? errors.password.message : ""}
                            />
                        )}
                    />

                    <Box display="flex" justifyContent="flex-end" mt={0.5} mb={2}>
                        <Typography 
                            variant="body2" 
                            className="forgot-password-link"
                            onClick={() => props.setShowAuthState('recover-account')}
                        >
                            Lost account?
                        </Typography>
                    </Box>

                    <Box className="auth-actions">
                        <Button 
                            className="auth-primary-btn" 
                            variant="contained" 
                            type="submit" 
                            fullWidth
                            disabled={loginMutation.isPending}
                        >
                            {loginMutation.isPending ? "Logging in..." : "Login"}
                        </Button>
                        <Button 
                            className="auth-secondary-btn" 
                            onClick={() => props.setShowAuthState(null)} 
                            variant="outlined" 
                            fullWidth
                        >
                            Back
                        </Button>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}

export default LoginForm;