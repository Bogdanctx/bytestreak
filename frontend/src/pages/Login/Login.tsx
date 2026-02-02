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

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm<LoginFormInputs>();

    const onSubmit = (data: LoginFormInputs) => {
        console.log("Login Data:", data);
        // Handle login logic here
    }

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
                    <form onSubmit={handleSubmit(onSubmit)}>
                        { /* Email */ }
                        <Controller
                            control = { control }
                            name = "email"
                            render={({ field }) => (
                                <TextField 
                                    {...field}
                                    id = "login-email"
                                    label = "Email"
                                    variant = "outlined"
                                    placeholder = "Enter your email"
                                    margin = "normal"
                                    fullWidth
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            color: colors.white
                                        },
                                        '& .MuiFormLabel-root .MuiInputLabel-root.Mui-focused': {
                                            color: colors.white
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.emerald,
                                            borderRadius: 0,
                                            transition: 'border-radius 0.3s ease, border-color 0.3s ease'
                                        },
                                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.yellow,
                                            borderRadius: 4,
                                            transition: 'border-radius 0.3s ease, border-color 0.3s ease'
                                        },
                                        '& .MuiInputLabel-root .Mui-focused': {
                                            color: colors.white
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.yellow,
                                            borderRadius: 4,
                                            transition: 'border-radius 0.3s ease, border-color 0.3s ease'
                                        },
                                        input: {
                                            color: colors.white
                                        }
                                    }}
                                    helperText = {
                                        errors.email ? errors.email.message : ""
                                    }
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
                                    sx={{
                                        '& .MuiFormLabel-root': {
                                            color: colors.white
                                        },
                                        '& .MuiFormLabel-root .MuiInputLabel-root.Mui-focused': {
                                            color: colors.white
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.emerald,
                                            borderRadius: 0,
                                            transition: 'border-radius 0.3s ease, border-color 0.3s ease'
                                        },
                                        '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.yellow,
                                            borderRadius: 4,
                                            transition: 'border-radius 0.3s ease, border-color 0.3s ease'
                                        },
                                        '& .MuiInputLabel-root .Mui-focused': {
                                            color: colors.white
                                        },
                                        '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                            borderColor: colors.yellow,
                                            borderRadius: 4,
                                            transition: 'border-radius 0.3s ease, border-color 0.3s ease'
                                        },
                                        input: {
                                            color: colors.white
                                        }
                                    }}
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