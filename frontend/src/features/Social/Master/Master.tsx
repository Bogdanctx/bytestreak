import {
    Box,
    Avatar,
    Typography,
    List,
    ListItem,
    ListItemButton,
    ListItemAvatar,
    ListItemText
} from '@mui/material';
import { useAccountContext } from '../../../context/AccountContext';
import { type IAccount } from '../../../entities';
import './Master.style.css';
import { getRankByLevel, getRankColor } from '../../../utils/rankUtils';

interface MasterProps {
    friendsList: IAccount[];
    selectedFriend: IAccount | null;
    setSelectedFriend: (friend: IAccount) => void;
}

function Master({ friendsList = [], selectedFriend, setSelectedFriend }: MasterProps) {
    const { account } = useAccountContext();

    if (!account) {
        return null;
    }

    const rankName = getRankByLevel(account.level);
    const rankColor = getRankColor(rankName);

    return (
        <Box className='master-container'>
            <Box className='master-header'>
                <Avatar src={account.profilePictureUrl} className='master-header-profile-picture' sx={{ borderColor: `${rankColor} !important` }}>
                    {!account.profilePictureUrl && account.username?.charAt(0).toUpperCase()}
                </Avatar>
                <Typography variant="h6" fontWeight="600" color="var(--text-primary)" lineHeight={1}>
                    {account.username}
                </Typography>
                <Typography variant="body2" color={rankColor} mt={0.5}>
                    Level {account.level} • {rankName}
                </Typography>
            </Box>

            <Box className='master-content'>
                <Box p={2} borderBottom="1px solid var(--bg-4)">
                    <Typography variant="subtitle2" fontWeight="600" color="var(--text-secondary)">
                        MY FRIENDS ({friendsList.length})
                    </Typography>
                </Box>
                
                <List disablePadding sx={{ overflowY: 'auto', flexGrow: 1 }}>
                    {friendsList.map((friend) => (
                        <ListItem disablePadding key={friend.id}>
                            <ListItemButton 
                                onClick={() => setSelectedFriend(friend)}
                                sx={{ 
                                    py: 1.5, 
                                    bgcolor: selectedFriend?.id === friend.id ? "var(--bg-3)" : "transparent",
                                    "&:hover": { bgcolor: "var(--bg-3)" },
                                    borderLeft: selectedFriend?.id === friend.id ? "3px solid var(--accent-main)" : "3px solid transparent"
                                }}
                            >
                                <ListItemAvatar sx={{ minWidth: 50 }}>
                                    <Avatar 
                                        src={friend.profilePictureUrl}
                                        sx={{ width: 36, height: 36, bgcolor: "var(--bg-4)" }}
                                    >
                                        {!friend.profilePictureUrl && friend.username.charAt(0).toUpperCase()}
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText 
                                    primary={friend.username} 
                                    secondary={`Level ${friend.level} • ${getRankByLevel(friend.level)}`}
                                    slotProps={{
                                        primary: {
                                            fontSize: "1rem", fontWeight: "500", color: "var(--text-primary)"
                                        },
                                        secondary: {
                                            fontSize: "0.8rem", color: "var(--text-secondary)"
                                        }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}

                    {friendsList.length === 0 && (
                        <Typography variant="body2" color="var(--text-secondary)" textAlign="center" mt={4}>
                            No friends yet. Start connecting!
                        </Typography>
                    )}
                </List>
            </Box>
        </Box>
    );
}

export default Master;