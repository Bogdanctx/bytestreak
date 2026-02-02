import { Box, Typography, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import ByteStreakLogo from "../../ByteStreak.logo";
import { colors } from "../../colors";
import "../../fonts.css";
import './LoginPage.style.css';

type LoginFormInputs = {
    email: string;
    password: string;
};

function LoginPage() {

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormInputs>();

    const onSubmit = (data: LoginFormInputs) => {
        // Handle login logic here
    }

    return (
        <Box id="login-container">
            <Box id="login-header">
                <Typography id="login-title">
                    Please Login to Your Account
                </Typography>
            </Box>
            <Box id="login-form-container">
                <form onSubmit={handleSubmit(onSubmit)}>
                    { /* Email */ }
                    <Controller
                        control = { control }
                        name = "email"
                        render={({ field }) => (
                            <TextField {...field} 
                                className="login-textfield"
                                label = "Email"
                                variant = "outlined"
                                placeholder = "Enter your email"
                                helperText = {
                                    errors.email ? errors.email.message : ""
                                }
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
                            />
                        )}
                    />

                    
                    <Button id="login-button" variant = "contained" type = "submit" fullWidth>
                        Login
                    </Button>
                </form>
            </Box>
        </Box>
    );
}

export default LoginPage;