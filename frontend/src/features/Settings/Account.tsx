import { 
    Box, 
    Typography,
    Divider,
    TextField,
    InputAdornment,
    Button,
    Avatar
} from "@mui/material";
import './Account.style.css'
import { useEffect, useState } from "react";
import PersonIcon from '@mui/icons-material/Person';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import LockIcon from '@mui/icons-material/Lock';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { api } from "../../api";
import notify from "../../components/ui/ToastNotification";
import { useAccountContext } from "../../context/AccountContext";


function Account() {
    const { account, setAccount } = useAccountContext();

    const [formData, setFormData] = useState({
        username: account.username,
        email: account.email,
        avatar: account.profilePictureUrl || "",
        password: "" 
    });

    useEffect(() => {
        if (account) {
            setFormData({
                username: account.username,
                email: account.email,
                avatar: account.profilePictureUrl || "",
                password: "" // Password is not fetched for security reasons
            })
        }
    }, [account]);

    const handleSaveChanges = () => {
        api.patch('/accounts/update', formData)
            .then(response => {
                if (response.status === 200) {
                    setAccount(response.data);
                    notify("Your account has been updated successfully.", "success");
                }
            })
            .catch(error => {
                notify("Failed to update your account.", "error");
                console.error("Update account error:", error);
            });
    }

    const handleDeleteAccount = () => {
        api.delete('/accounts/delete')
            .then(response => {
                if (response.status === 200) {
                    notify("Your account has been deleted.", "success");

                    setTimeout(() => {
                        window.location.href = "/"; // Redirect to homepage after deletion
                    }, 2000);
                }
            })
            .catch(error => {
                notify("Failed to delete your account.", "error");
                console.error("Delete account error:", error);
            });
    }

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setFormData(prev => ({ ...prev, avatar: base64String }));
            };
            reader.readAsDataURL(file);
        }
    }

    return (
        <Box id="account-container">
            <Box id="account-header">
                <Typography className="account-header-title">
                    Account
                </Typography>
            </Box>

            <Divider className="account-header-separator" />

            <Box className="account-section">
                <Typography className="account-section-title">
                    <SettingsIcon sx={{ color: '#23CE6B' }} /> General
                </Typography>

                <Box className="account-avatar-wrapper">
                    <Avatar className="account-avatar" />
                    <Box>
                        <Button
                            className="account-change-avatar-button"
                            startIcon={<EditIcon />} 
                            sx={{ color: '#23CE6B', borderColor: '#23CE6B' }}
                            variant="outlined"
                            size="small"
                            onClick={() => { document.getElementById('avatar-upload')?.click() }}
                        >
                            Change Avatar
                        </Button>
                        <input id="avatar-upload" 
                                type="file" 
                                accept="image/*" 
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                                />
                    </Box>
                </Box>

                <Box className="account-input-group">
                    <TextField 
                        className="account-input-field"
                        label="Username" 
                        variant="outlined"
                        value={formData.username}
                        onChange={(e) => setFormData({...formData, username: e.target.value})}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <PersonIcon className="account-input-icon" />
                                    </InputAdornment>
                                ),
                            }
                        }}
                    />

                    <TextField 
                        className="account-input-field"
                        label="Email Address" 
                        variant="outlined"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AlternateEmailIcon className="account-input-icon" />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    <TextField 
                        className="account-input-field"
                        label="Password" 
                        type="password"
                        variant="outlined"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <LockIcon className="account-input-icon" />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />
                </Box>

                <Button className="account-save-btn" variant="outlined" onClick={handleSaveChanges}>
                    Save Changes
                </Button>
            </Box>

            {/* 2. Danger Zone */}
            <Box className="account-section danger-zone">
                <Typography className="account-section-title danger">
                    <WarningAmberIcon /> Danger Zone
                </Typography>
                
                <Box className="danger-content">
                    <Box className="danger-text">
                        <Typography variant="subtitle1" sx={{ color: '#F7F7F9', fontWeight: 'bold' }}>
                            Delete Account
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#aaa' }}>
                            Once you delete your account, there is no going back.
                        </Typography>
                    </Box>
                    
                    <Button 
                        variant="outlined" 
                        color="error"
                        className="delete-account-btn"
                        onClick={() => {
                            if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                                handleDeleteAccount();
                            }
                        }}
                    >
                        Delete Account
                    </Button>
                </Box>
            </Box>

        </Box>        
    );
}

export default Account;