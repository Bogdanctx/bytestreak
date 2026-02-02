import { Box, Typography, Chip, Stack } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "./CodingProblemCard.style.css"

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

type CodingProblemCardProps = {
    title: string;
    difficulty?: Difficulty;
}

const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
        case 'Easy': return '#00b8a3';
        case 'Medium': return '#ffc01e';
        case 'Hard': return '#ff375f';
        default: return 'gray';
    }
}

function CodingProblemCard({ title, difficulty = 'Medium' }: CodingProblemCardProps) {
    const difficultyColor = getDifficultyColor(difficulty);

    return (
        <Box className="coding-problem-card">
            <Box className="card-content-left">
                <Box className="difficulty-indicator" sx={{ backgroundColor: difficultyColor }} />
                <Stack spacing={0.5}>
                    <Typography className="problem-title" variant="h6">
                        {title}
                    </Typography>
                    {/* add tags here */}
                </Stack>
            </Box>

            <Box className="card-content-right">
                <Chip 
                    label={difficulty} 
                    size="small" 
                    className="difficulty-chip"
                    sx={{ 
                        color: difficultyColor, 
                        borderColor: difficultyColor,
                        backgroundColor: `${difficultyColor}15`
                    }} 
                />
                <ArrowForwardIosIcon className="action-icon" fontSize="small" />
            </Box>

        </Box>
    )
}

export default CodingProblemCard;