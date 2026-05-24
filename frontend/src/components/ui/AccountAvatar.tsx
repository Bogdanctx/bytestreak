import { Avatar, Box } from "@mui/material";

interface IAccountAvatarProps {
    avatarUrl?: string;
    cssEffectStyle?: string;
    width?: number;
    height?: number;
}

function AccountAvatar({ avatarUrl, cssEffectStyle, width = 40, height = 40 }: IAccountAvatarProps) {
    const layoutBuffer = cssEffectStyle ? '8px' : '0px';

    return (
        <Box 
            className={`avatar-wrapper ${cssEffectStyle || ''}`} 
            sx={{ width, height, margin: layoutBuffer, flexShrink: 0 }} 
        >
            <Avatar 
                src={avatarUrl} 
                alt="User Avatar" 
                sx={{ width: '100%', height: '100%' }} 
            />
        </Box>
    );
}

export default AccountAvatar;