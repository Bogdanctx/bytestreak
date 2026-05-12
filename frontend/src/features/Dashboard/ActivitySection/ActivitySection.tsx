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
    Tooltip,
    CircularProgress
} from "@mui/material";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ClearIcon from '@mui/icons-material/Clear';
import "./ActivitySection.style.css";
import { useAccount } from '../../../hooks/useAccount';
import { type IStreak } from '../../../types/streak.types';
import { api } from "../../../api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import notify from "../../../components/ui/ToastNotification";
import { useState } from "react";
import QuizOfTheDay from "./QuizOfTheDay/QuizOfTheDay";
import Loading from "../../../components/ui/Loading";
import { useNavigate } from "react-router-dom";

const todayUTCString = new Date().toISOString().split('T')[0];

function ActivitySection() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: account, refetch: refetchAccount } = useAccount();
    const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
    const { data: streaksData = [] } = useQuery<IStreak[]>({
        queryKey: ['activeStreaks'],
        queryFn: async () => {
            const response = await api.get('/streaks/fetch-streaks');
            return response.data;
        },
        enabled: !!account
    });
    const removeStreakMutation = useMutation({
        mutationFn: async (streakId: number) => {
            return api.delete(`/streaks/delete-streak?streakId=${streakId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['activeStreaks'] });
            notify("Streak has been removed", "success");
        },
        onError: (error) => {
            console.error('Error removing streak:', error);
            notify("Failed to remove streak", "error");
        }
    });

    if (!account) {
        return <Loading />;
    }

    const isQuizDoneToday = account.lastDailyQuizDate === todayUTCString;
    const isCodingProblemDoneToday = false;

    return (
        <Box id="activity-section-container">
            <Box className="daily-items-container">
                <Typography variant="h6" className="activity-section-title">
                    Daily Challenges
                </Typography>
                <Box display={"flex"} flexDirection={"column"} gap={"12px"}>
                    <ButtonBase className="daily-item">
                        <Box className="daily-item-content">
                            <Box>
                                <Typography className="daily-item-label">Problem of the Day</Typography>
                                <Typography className="daily-item-title">Valid Palindrome</Typography>    
                            </Box>
                            {isCodingProblemDoneToday ? (
                                <CheckCircleOutlineIcon sx={{ color: 'var(--accent-main)' }} />
                            ) : (
                                <ClearIcon sx={{ color: 'var(--difficulty-hard)' }} />
                            )}
                        </Box>
                    </ButtonBase>

                    <ButtonBase 
                        className="daily-item" 
                        onClick={() => setIsQuizModalOpen(true) }
                        disabled={isQuizDoneToday}
                        sx={{ display: 'flex', justifyContent: 'space-between' }}
                    >
                        <Box className="daily-item-content">
                            <Typography className="daily-item-title" color="#E7BB41">Quiz of the Day</Typography>
                        
                            {isQuizDoneToday ? (
                                <CheckCircleOutlineIcon sx={{ color: 'var(--accent-main)' }} />
                            ) : (
                                <ClearIcon sx={{ color: 'var(--difficulty-hard)' }} />
                            )}
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
                    {streaksData.map(streak => {
                        const streakFriend = streak.participant1.id === account.id ? streak.participant2 : streak.participant1;
                        const friendCompletedQuiz = streak.participant1.id === account.id ? streak.participant2SolvedToday : streak.participant1SolvedToday;

                        return (
                            <ListItem key={streak.id} 
                                        className="streak-list-item"
                                        onClick={() => navigate(`/accounts/profile/${streakFriend.username}`)}
                            >
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
                                        
                                        <Box className={`streak-status ${friendCompletedQuiz ? 'completed' : 'incomplete'}`}>
                                            {friendCompletedQuiz ? (
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
                                        <LocalFireDepartmentIcon />
                                    </Box>

                                    <Tooltip title="Remove Streak">
                                        <IconButton 
                                            size="small" 
                                            className="streak-delete-btn"
                                            onClick={(event) => {
                                                event.stopPropagation();
                                                removeStreakMutation.mutate(streak.id);
                                            }}
                                            disabled={removeStreakMutation.isPending}
                                        >
                                            {removeStreakMutation.isPending ? (
                                                <CircularProgress size={16} /> 
                                            ) : (
                                                <DeleteOutlineIcon fontSize="small" />
                                            )}
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

            
            {/* show quiz modal if the user pressed the quiz button */}
            {isQuizModalOpen && (
                <QuizOfTheDay 
                    open={isQuizModalOpen} 
                    onClose={() => setIsQuizModalOpen(false)} 
                    account={account}
                    streaks={streaksData}
                    onComplete={() => {
                        refetchAccount();
                        queryClient.invalidateQueries({ queryKey: ['activeStreaks'] });
                    }}
                />
            )}
        </Box>
    );
}

export default ActivitySection;