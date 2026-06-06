import { Box, Typography, Button } from "@mui/material";
import './TimedFeaturesManagement.style.css';
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../api";
import notify from "../../../components/ui/ToastNotification";

export default function TimedFeaturesManagement() {
    const resetDailyQuizMutation = useMutation({
        mutationFn: async () => {
            await api.post("/admin/reset-daily-quiz");
            notify("Resetting daily quiz...", "info");
        },
        onSuccess: () => {            
            notify("Daily quiz reset successfully!", "success");
        },
        onError: () => {
            notify("Failed to reset daily quiz.", "error");
        }
    });

    const resetDailyCodingProblemMutation = useMutation({
        mutationFn: async () => {
            await api.post("/admin/reset-daily-coding-problem");
            notify("Resetting daily coding problem...", "info");
        },
        onSuccess: () => {            
            notify("Daily coding problem reset successfully!", "success");
        },
        onError: () => {
            notify("Failed to reset daily coding problem.", "error");
        }
    });

    const resetSeasonalLeaderboardMutation = useMutation({
        mutationFn: async () => {
            await api.post("/admin/reset-season");
            notify("Resetting seasonal leaderboard and awarding season rewards...", "info");
        },
        onSuccess: () => {            
            notify("Seasonal leaderboard reset successfully!", "success");
        },
        onError: () => {
            notify("Failed to reset seasonal leaderboard.", "error");
        }
    });

    const resetDailyChallenges = () => {
        resetDailyQuizMutation.mutate();
        resetDailyCodingProblemMutation.mutate();
    }

    return (
        <Box id="timed-features-management" className="timed-features-management-container">
            <Box className="timed-features-management-header">
                <Typography variant="h4" className="timed-features-management-title" gutterBottom>
                    Timed Features Management
                </Typography>
            </Box>
            <Box className="timed-features-management-content">
                <Button className="timed-feature-button" onClick={() => resetDailyChallenges()}>
                    Reset daily challenges (quiz + coding problem)
                </Button>
                <Button className="timed-feature-button" onClick={() => resetDailyQuizMutation.mutate()}>
                    Reset daily quiz
                </Button>
                <Button className="timed-feature-button" onClick={() => resetDailyCodingProblemMutation.mutate()}>
                    Reset daily coding problem
                </Button>
                <Button className="timed-feature-button" onClick={() => resetSeasonalLeaderboardMutation.mutate()}>
                    Reset seasonal leaderboard
                </Button>
            </Box>
        </Box>
    );
}