import { Box, Typography, Button } from "@mui/material";
import './TimedFeaturesManagement.style.css';
import { useMutation } from "@tanstack/react-query";
import { api } from "../../../api";

export default function TimedFeaturesManagement() {
    const resetDailyQuizMutation = useMutation({
        mutationFn: async () => {
            await api.post("/admin/reset-daily-quiz");
        },
        onSuccess: () => {            
            alert("Daily quiz reset successfully!");
        },
        onError: () => {
            alert("Failed to reset daily quiz.");
        }
    });

    const resetDailyCodingProblemMutation = useMutation({
        mutationFn: async () => {
            await api.post("/admin/reset-daily-coding-problem");
        },
        onSuccess: () => {            
            alert("Daily coding problem reset successfully!");
        },
        onError: () => {
            alert("Failed to reset daily coding problem.");
        }
    });

    const resetSeasonalLeaderboardMutation = useMutation({
        mutationFn: async () => {
            await api.post("/admin/reset-season");
        },
        onSuccess: () => {            
            alert("Seasonal leaderboard reset successfully!");
        },
        onError: () => {
            alert("Failed to reset seasonal leaderboard.");
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