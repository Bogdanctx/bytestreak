import { Controller, useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';

import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';
import { type AccountCredentials, type RegisterFormInputs } from '../../../types/auth.types';
import './RegisterForm.style.css'; 
import { useMutation } from '@tanstack/react-query';

interface IRegisterFormProps {
    setShowAuthState: React.Dispatch<React.SetStateAction<'login' | 'register' | 'recover-account' | null>>;
};

const REGISTER_VALIDATION_RULES = {
    username: {
        required: "Username is required",
        maxLength: { value: 20, message: "Username cannot exceed 20 characters" },
        minLength: { value: 5, message: "Username must be at least 5 characters" }
    },
    email: {
        required: "Email is required",
        pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: "Invalid email address"
        }
    },
    password: {
        required: "Password is required",
        minLength: { value: 6, message: "Password must be at least 6 characters" },
        maxLength: { value: 100, message: "Password cannot exceed 100 characters" }
    },
    confirmPassword: {
        required: "Please confirm your password",
        validate: (value: string, formValues: RegisterFormInputs) => value === formValues.password || "Passwords do not match"
    }
};

function RegisterForm(props: IRegisterFormProps) {
    const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const registerMutation = useMutation({
        mutationFn: async (data: RegisterFormInputs) => {
            var account: AccountCredentials = {
                username: data.username,
                email: data.email,
                password: data.password
            };
            const response = await api.post('auth/register', account);
            return response;
        },
        onSuccess: () => {
            notify("Your account has been registered. Please log in.", "success");
            props.setShowAuthState("login");
        },
        onError: (error) => {
            notify("Registration failed. Please try again.", "error");
            console.error("Registration error:", error);
        }
    })

    const onSubmit = (data: RegisterFormInputs) => {
        registerMutation.mutate(data);
    }

    return (
        <Box className="auth-container">
            <Box className="auth-header">
                <Typography className="auth-title">
                    Create an Account
                </Typography>
                <Typography className="auth-subtitle">
                    Join the ByteStreak community
                </Typography>
            </Box>
            <Box className="auth-form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        control={control}
                        name="username"
                        rules={REGISTER_VALIDATION_RULES.username}
                        render={({ field }) => (
                            <TextField 
                                {...field}
                                className="auth-textfield"
                                label="Username"
                                variant="outlined"
                                placeholder="Enter your username"
                                helperText={errors.username ? errors.username.message : ""}
                                error={!!errors.username}
                                margin="normal"
                                fullWidth
                            />
                        )}
                    />

                    <Controller
                        control={control}
                        name="email"
                        rules={REGISTER_VALIDATION_RULES.email}
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
                        rules={REGISTER_VALIDATION_RULES.password}
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

                    <Controller
                        control={control}
                        name="confirmPassword"
                        rules={REGISTER_VALIDATION_RULES.confirmPassword}
                        render={({ field }) => (
                            <TextField 
                                {...field}
                                fullWidth
                                className="auth-textfield"
                                type="password"
                                label="Re-enter Password"
                                variant="outlined"
                                placeholder="Confirm your password"
                                margin="normal"
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword ? errors.confirmPassword.message : ""}
                            />
                        )}
                    />

                    <Box className="auth-actions" mt={2}>
                        <Button 
                            className="auth-primary-btn" 
                            variant="contained" 
                            type="submit" 
                            fullWidth
                            disabled={registerMutation.isPending}
                        >
                            {registerMutation.isPending ? "Registering..." : "Register"}
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

export default RegisterForm;