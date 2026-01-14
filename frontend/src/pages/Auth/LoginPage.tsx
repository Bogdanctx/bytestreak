import { Box, Typography, Button, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import ByteStreakLogo from "../../ByteStreak.logo";
import { colors } from "../../colors";
import "../../fonts.css";

type LoginFormInputs = {
    email: string;
    password: string;
};

function LoginPage() {
    const { handleSubmit, control, formState: { errors } } = useForm<LoginFormInputs>({
        defaultValues: {
            email: "",
            password: ""
        },
        mode: "onChange"
    });

    return (
        <Box 
            height = {"100vh"} 
            width = {"100vw"} 
            display = {"flex"} 
            justifyContent = {"center"} 
            alignItems = {"center"}
            sx={{
                backgroundColor: `${colors.night}`
            }}
        > {/* Fullscreen Centered Box */ }
            <Box padding={2} border={1} borderRadius={5} borderColor={colors.emerald}> {/* Container Box */ }
                <Box textAlign = {"center"}> {/* Header Section */ }
                    <ByteStreakLogo size={80} />
                    <Typography 
                        variant = "h6"
                        fontFamily = {"Momo Trust Display"}
                        sx={{
                            color: `${colors.white}`
                        }}
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
                                    fullWidth
                                    type = "password"
                                    id = "login-password"
                                    label = "Password"
                                    variant = "outlined"
                                    placeholder = "Enter your password"
                                    margin = "normal"
                                    error = { !!errors.password?.message }
                                    helperText = { errors.password?.message }
                                />
                            )}
                        />

                       
                        <Button 
                            fullWidth 
                            variant = "contained" 
                            sx={{ 
                                marginTop: 2, 
                                fontFamily: "Momo Trust Display", 
                                backgroundColor: colors.emerald,
                            }}
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