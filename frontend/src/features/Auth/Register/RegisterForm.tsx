import { Box, Typography, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import './RegisterForm.style.css';

type registerFormInputs = {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type RegisterFormProps = {
    setShowAuthState: React.Dispatch<React.SetStateAction<'login' | 'register' | null>>;
};

function RegisterForm(props: RegisterFormProps) {

    const {
        control,
        handleSubmit,
        formState: { errors },
        getValues
    } = useForm<registerFormInputs>();

    const onSubmit = (data: registerFormInputs) => {
        // Handle register logic here
    }

    return (
        <Box id="register-container">
            <Box id="register-header">
                <Typography id="register-title">
                    Create a New Account
                </Typography>
            </Box>
            <Box id="register-form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    { /* Username */ }
                    <Controller
                        control = { control }
                        name = "username"
                        rules = {{
                            required: "Username is required",
                            maxLength: {
                                value: 20,
                                message: "Username cannot exceed 20 characters"
                            },
                            minLength: {
                                value: 6,
                                message: "Username must be at least 6 characters"
                            }
                        }}
                        render={({ field }) => (
                            <TextField 
                                {...field} 
                                className="register-textfield"
                                label = "Username"
                                variant = "outlined"
                                placeholder = "Enter your username"
                                helperText = {
                                    errors.username ? errors.username.message : ""
                                }
                                error = { !!errors.username }
                                margin="normal"
                                fullWidth
                            />
                        )}
                    />

                    { /* Email */ }
                    <Controller
                        control = { control }
                        name = "email"
                        rules = {{
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                message: "Invalid email address"
                            }
                        }}
                        render={({ field }) => (
                            <TextField 
                                {...field} 
                                className="register-textfield"
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
                        rules = {{
                            required: "Password is required"
                        }}
                        render={({ field }) => (
                            <TextField 
                                {...field}
                                fullWidth
                                className="register-textfield"
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

                    { /* Confirm password */ }
                    <Controller
                        control = { control }
                        name = "confirmPassword"
                        rules = {{
                            required: "Please confirm your password",
                            validate: (value: string) => 
                                value === getValues("password") || "Passwords do not match"
                        }}
                        render={({ field }) => (
                            <TextField 
                                {...field}
                                fullWidth
                                className="register-textfield"
                                type = "password"
                                label = "Re-enter Password"
                                variant = "outlined"
                                placeholder = "Confirm your password"
                                margin = "normal"
                                error = { !!errors.confirmPassword }
                                helperText = { errors.confirmPassword ? errors.confirmPassword.message : "" }
                            />
                        )}
                    />

                    
                    <Button id="register-button" variant = "contained" type = "submit" fullWidth>
                        register
                    </Button>
                    <Button id="register-back-button" onClick={() => props.setShowAuthState(null)} variant = "contained" fullWidth>
                        back
                    </Button>
                </form>
            </Box>
        </Box>
    );
}

export default RegisterForm;