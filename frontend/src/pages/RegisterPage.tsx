import { Box, Typography, Button, TextField } from "@mui/material";
import { useTheme } from "@mui/material";
import "../fonts.css";
import { useForm, Controller } from "react-hook-form";

type RegisterFormInputs = {
    username: string,
    email: string;
    password: string;
    confirmPassword: string;
};

function RegisterPage() {
    const theme = useTheme();

    const { handleSubmit, control, formState: { errors }, getValues } = useForm<RegisterFormInputs>({
        defaultValues: {
            username: "",
            email: "",
            password: ""
        },
        mode: "onChange"
    });

    const onSubmit = (data: RegisterFormInputs) => {
        console.log(data);
    }

    return (
        <Box height = {"100vh"} width = {"100vw"} display = {"flex"} justifyContent = {"center"} alignItems = {"center"}> {/* Fullscreen Centered Box */ }
            <Box padding={2} border={1} borderRadius={5} borderColor={theme.palette.secondary.main}> {/* Container Box */ }
                <Box textAlign = {"center"}> {/* Header Section */ }
                    <Typography 
                        variant = "h1" 
                        fontFamily = "VT323"
                        color = {theme.palette.text.primary} 
                        sx = {{
                            letterSpacing: "5px",
                            fontSize: 80,
                        }}
                    >
                        ByteStreak
                    </Typography>
                    <Typography 
                        variant = "h6"
                        color = {theme.palette.text.primary}
                        fontFamily = {"Momo Trust Display"}
                        gutterBottom
                    >
                        - Register -
                    </Typography>
                </Box>
                <Box marginTop={5}> {/* Form Section */ }
                    <form onSubmit={handleSubmit(onSubmit)}>
                        { /* Username */ }
                        <Controller
                            control = { control }
                            name = "username"
                            rules = {{
                                required: "Username is required",
                                maxLength: {
                                    value: 15,
                                    message: "Username cannot exceed 15 characters"
                                },
                                minLength: {
                                    value: 5,
                                    message: "Username must be at least 5 characters"
                                }
                            }}
                            render={({ field }) => (
                                <TextField 
                                    {...field}
                                    id = "register-username"
                                    label = "Username"
                                    variant = "outlined"
                                    placeholder = "Enter a username"
                                    margin = "normal"
                                    fullWidth
                                    error = { !!errors.username?.message }
                                    helperText = { errors.username?.message }
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
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Invalid email address'
                                }
                            }}
                            render={({ field }) => (
                                <TextField 
                                    {...field}
                                    id = "register-email"
                                    label = "Email"
                                    variant = "outlined"
                                    placeholder = "Enter your email"
                                    margin = "normal"
                                    fullWidth
                                    error = { !!errors.email?.message }
                                    helperText = { errors.email?.message }
                                />
                            )}
                        />

                        { /* Password */ }
                        <Controller
                            control = { control }
                            name = "password"
                            rules = {{
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            }}
                            render={({ field }) => (
                                <TextField 
                                    {...field}
                                    id = "register-password"
                                    label = "Password"
                                    variant = "outlined"
                                    placeholder = "Enter your password"
                                    margin = "normal"
                                    type = "password"
                                    fullWidth
                                    error = { !!errors.password?.message }
                                    helperText = { errors.password?.message }
                                />
                            )}
                        />

                        { /* Confirm password */ }
                        <Controller
                            control = { control }
                            name = "confirmPassword"
                            defaultValue = ""
                            rules = {{
                                required: "Password is required",
                                validate: (value) => value == getValues("password") || "Passwords do not match"
                            }}
                            render={({ field }) => (
                                <TextField 
                                    {...field}
                                    id = "register-confirm-password"
                                    label = "Confirm password"
                                    variant = "outlined"
                                    placeholder = "Confirm your password"
                                    margin = "normal"
                                    type = "password"
                                    fullWidth
                                    error = { !!errors.confirmPassword?.message }
                                    helperText = { errors.confirmPassword?.message }
                                    
                                />
                            )}
                        />

                       
                        <Button 
                            fullWidth 
                            variant = "contained" 
                            color = "secondary" 
                            sx={{ marginTop: 2, fontFamily: "Momo Trust Display" }}
                            type = "submit">
                            Register
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box>
    );
}

export default RegisterPage;