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

// Mock data to visualize the layout
const mockFriends = [
    { id: 1, name: "Alice Smith", avatar: "" },
    { id: 2, name: "Bob Johnson", avatar: "" },
    { id: 3, name: "Charlie Davis", avatar: "" },
    { id: 4, name: "Diana Prince", avatar: "" },
    { id: 5, name: "Ethan Hunt", avatar: "" },
    { id: 6, name: "Fiona Gallagher", avatar: "" },
    { id: 7, name: "George Martin", avatar: "" },
    { id: 8, name: "Hannah Baker", avatar: "" },
];

function ActivitySection() {
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

            <Divider sx={{ backgroundColor: '#333333', my: 3 }} />

            <Box className="friends-section">
                <Typography variant="h6" className="activity-section-title" sx={{
                    position: 'sticky',
                    top: 0,
                    backgroundColor: '#1A1A1A',
                    zIndex: 1,
                }}>
                    Friends
                </Typography>
                <List className="friends-list">
                    {mockFriends.map((friend) => (
                        <ListItem key={friend.id} className="friend-list-item">
                            <ListItemAvatar>
                                <Avatar src={friend.avatar} alt={friend.name} className="friend-avatar">
                                    {friend.name.charAt(0)}
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={friend.name} 
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