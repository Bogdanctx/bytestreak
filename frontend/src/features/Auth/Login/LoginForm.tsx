import { Controller, useForm } from 'react-hook-form';
import { Box, Button, TextField, Typography } from '@mui/material';

import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';
import { type LoginFormInputs } from '../../../types/auth.types';
import './LoginForm.style.css';


interface LoginFormProps {
    setShowAuthState: React.Dispatch<React.SetStateAction<'login' | 'register' | null>>;
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

function LoginForm(props: LoginFormProps) {
    const { control, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (data: LoginFormInputs) => {
        try {
            const response = await api.post("auth/login", data);

            if(response.status === 200) {
                notify("Login successful!", "success");
                setTimeout(() => {
                    window.location.href = "/dashboard";
                }, 1500);
            }
            else {
                notify(`${response.data.message}`, "error");
            }
        }
        catch (error) {
            notify("An error occurred during login.", "error");
            console.error("Login error:", error);
        }
    }

    return (
        <Box id="login-container">
            <Box id="login-header">
                <Typography id="login-title">
                    Login to Your Account
                </Typography>
            </Box>
            <Box id="login-form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    { /* Email */ }
                    <Controller
                        control = { control }
                        name = "email"
                        rules = { LOGIN_FORM_VALIDATION_RULES.email }
                        render={({ field }) => (
                            <TextField 
                                {...field} 
                                className="login-textfield"
                                label = "Email"
                                variant = "outlined"
                                placeholder = "Enter your email"
                                helperText = {
                                    errors.email ? errors.email.message : ""
                                }
                                error = { !!errors.email }
                                margin="normal"
                                fullWidth
                            />
                        )}
                    />

                    { /* Password */ }
                    <Controller
                        control = { control }
                        name = "password"
                        rules = { LOGIN_FORM_VALIDATION_RULES.password }
                        render={({ field }) => (
                            <TextField 
                                {...field}
                                fullWidth
                                className="login-textfield"
                                type = "password"
                                label = "Password"
                                variant = "outlined"
                                placeholder = "Enter your password"
                                margin = "normal"
                                error = { !!errors.password }
                                helperText = { errors.password ? errors.password.message : "" }
                            />
                        )}
                    />

                    
                    <Button id="login-button" variant = "contained" type = "submit" fullWidth>
                        login
                    </Button>
                    <Button id="login-back-button" onClick={() => props.setShowAuthState(null)} variant = "contained" fullWidth>
                        back
                    </Button>
                </form>
            </Box>
        </Box>
    );
}

export default LoginForm;