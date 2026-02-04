import { Box, Typography, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import './LoginForm.style.css';

type loginFormInputs = {
    email: string;
    password: string;
};

type LoginFormProps = {
    setShowAuthState: React.Dispatch<React.SetStateAction<'login' | 'register' | null>>;
};

function LoginForm(props: LoginFormProps) {

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<loginFormInputs>();

    const onSubmit = (data: loginFormInputs) => {
        // Handle login logic here
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
                        rules = {{
                            required: "Password is required"
                        }}
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