import { 
    Box, 
    Typography, 
    Avatar, 
    List, 
    ListItem, 
    ListItemAvatar, 
    ListItemText, 
    Divider, 
    ButtonBase 
} from "@mui/material";
import "./ActivitySection.style.css";
import { useAccountContext } from "../../../context/AccountContext";

function ActivitySection() {
    const { account } = useAccountContext();

    if (!account) {
        return null;
    }

    return (
        <Box id="activity-section-container">
            <Box className="daily-items-container">
                <Typography variant="h6" className="activity-section-title">
                    Daily Challanges
                </Typography>
                <Box display={"flex"} flexDirection={"column"} gap={"12px"}>
                    <ButtonBase className="daily-item">
                        <Box className="daily-item-content">
                            <Typography className="daily-item-label">Problem of the Day</Typography>
                            <Typography className="daily-item-title">Valid Palindrome</Typography>
                        </Box>
                    </ButtonBase>

                    <ButtonBase className="daily-item">
                        <Box className="daily-item-content">
                            <Typography className="daily-item-title" color="#E7BB41">Quiz of the Day</Typography>
                        </Box>
                    </ButtonBase>
                </Box>
            </Box>

            <Divider sx={{ backgroundColor: 'var(--bg-8)', my: 3 }} />

            <Box className="friends-section">
                <Typography variant="h6" className="activity-section-title" sx={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: 'var(--bg-2)',
                    zIndex: 1,
                }}>
                    Friends
                </Typography>
                <List className="friends-list">
                    {account.friends.map((friend) => (
                        <ListItem key={friend.id} className="friend-list-item">
                            <ListItemAvatar>
                                <Avatar src={friend.profilePictureUrl} alt={friend.username} className="friend-avatar">
                                    {friend.username.charAt(0)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={friend.username} 
                                classes={{ primary: 'friend-name' }}
                            />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
}

export default ActivitySection;