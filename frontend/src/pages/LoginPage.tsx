import { Box, Typography, Button, TextField } from "@mui/material";
import { useTheme } from "@mui/material";
import "../fonts.css";
import { useForm, Controller } from "react-hook-form";

type LoginFormInputs = {
    email: string;
    password: string;
};

function LoginPage() {
    const theme = useTheme();

    const { handleSubmit, control, formState: { errors } } = useForm<LoginFormInputs>({
        defaultValues: {
            email: "",
            password: ""
        },
        mode: "onChange"
    });

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
                        - Login -
                    </Typography>
                </Box>
                <Box marginTop={5}> {/* Form Section */ }
                    <form onSubmit={handleSubmit((data) => console.log(data))}>
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
                                    id = "login-email"
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
                                required: "Password is required"
                            }}
                            render={({ field }) => (
                                <TextField 
                                    {...field}
                                    id = "login-password"
                                    label = "Password"
                                    variant = "outlined"
                                    placeholder = "Enter your password"
                                    margin = "normal"
                                    fullWidth
                                    error = { !!errors.password?.message }
                                    helperText = { errors.password?.message }
                                />
                            )}
                        />

                       
                        <Button 
                            fullWidth 
                            variant = "contained" 
                            color = "secondary" 
                            sx={{ marginTop: 2, fontFamily: "Momo Trust Display" }}
                            type = "submit">
                            Login
                        </Button>
                    </form>
                </Box>
            </Box>
        </Box>
    );
}

export default LoginPage;