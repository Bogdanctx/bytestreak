import { 
    Box, 
    Typography, 
    Avatar, 
    List, 
    ListItem, 
    ListItemAvatar, 
    Divider, 
    ButtonBase,
    IconButton,
    Tooltip
} from "@mui/material";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import "./ActivitySection.style.css";
import { useAccount } from '../../../hooks/useAccount';
import { type IStreak } from "../../../entities";
import { api } from "../../../api";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import notify from "../../../components/ui/ToastNotification";

function ActivitySection() {
    const queryClient = useQueryClient();
    const { data: account } = useAccount();
    
    const { data: streaksData = [] } = useQuery({
        queryKey: ['streaks'],
        queryFn: async () => {
            const response = await api.get('/streaks/fetch-streaks');
            return response.data;
        },
        enabled: !!account
    });

    const handleRemoveStreak = async (streakId: number) => {
        try {
            const response = await api.post(`/streaks/remove?streakId=${streakId}`);
            if (response.status === 200) {
                // Optimistic UI update: Instantly remove the streak from the list
                queryClient.setQueryData(['streaks'], (old: IStreak[] = []) => 
                    old.filter(streak => streak.id !== streakId)
                );
                notify("Streak removed", "success");
            }
        } catch (error) {
            console.error('Error removing streak:', error);
            notify("Failed to remove streak", "error");
        }
    };

    // Type guard for account
    if (!account) return null;

    return (
        <Box id="activity-section-container">
            <Box className="daily-items-container">
                <Typography variant="h6" className="activity-section-title">
                    Daily Challenges
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
                    In a streak with
                </Typography>
                <List className="friends-list">
                    {streaksData.map((streak: IStreak) => {
                        const streakFriend = streak.participant1.id === account.id ? streak.participant2 : streak.participant1;
                        const isCompleted = streak.participant1SolvedToday && streak.participant2SolvedToday;

                        return (
                            <ListItem key={streak.id} className="streak-list-item">
                                <Box className="streak-user-info">
                                    <ListItemAvatar sx={{ minWidth: '48px' }}>
                                        <Avatar src={streakFriend.profilePictureUrl} alt={streakFriend.username} className="friend-avatar">
                                            {!streakFriend.profilePictureUrl && streakFriend.username.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    
                                    <Box className="streak-details">
                                        <Typography className="friend-name">
                                            {streakFriend.username}
                                        </Typography>
                                        
                                        <Box className={`streak-status ${isCompleted ? 'completed' : 'incomplete'}`}>
                                            {isCompleted ? (
                                                <><CheckCircleOutlineIcon sx={{ fontSize: 14 }} /> Completed today</>
                                            ) : (
                                                <><RadioButtonUncheckedIcon sx={{ fontSize: 14 }} /> Incomplete</>
                                            )}
                                        </Box>
                                    </Box>
                                </Box>

                                <Box className="streak-actions">
                                    <Box className="streak-flame-container">
                                        <Typography variant="body1" fontWeight="bold">
                                            {streak.length}
                                        </Typography>
                                        <LocalFireDepartmentIcon className="streak-flame-icon" />
                                    </Box>

                                    <Tooltip title="Remove Streak">
                                        <IconButton 
                                            size="small" 
                                            className="streak-delete-btn"
                                            onClick={() => handleRemoveStreak(streak.id)}
                                        >
                                            <DeleteOutlineIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            </ListItem>
                        );
                    })}

                    {streaksData.length === 0 && (
                        <Typography className='no-streaks-message'>
                            No active streaks with friends. Start a new streak to see it here!
                        </Typography>
                    )}
                </List>
            </Box>
        </Box>
    );
}

export default ActivitySection;