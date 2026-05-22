import { Avatar, Box } from "@mui/material";
import { getEffectClass } from "../../utils/effectUtils"; 

function AccountAvatar({ avatarUrl, effectId, width, height }: { avatarUrl: string; effectId: number, width?: number; height?: number }) {
    const effectClass = getEffectClass(effectId);

    return (
        <Box className={`avatar-wrapper ${effectClass}`} sx={{ width, height }}>
            <Avatar src={avatarUrl} alt="User Avatar" sx={{ width: '100%', height: '100%' }} />
        </Box>
    );
}

export default AccountAvatar;