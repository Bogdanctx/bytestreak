import { Box, Typography, Chip, Stack } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Optional: Adds a subtle icon
import "./CodingProblemCard.style.css"

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

type CodingProblemCardProps = {
    title: string;
    difficulty: Difficulty;
    acceptanceRate: number;
}

const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
        case 'Easy': return '#00b8a3';
        case 'Medium': return '#ffc01e';
        case 'Hard': return '#ff375f';
        default: return 'gray';
    }
}

const getAcceptanceColor = (rate: number) => {
    if (rate >= 70) return '#00b8a3'; // High acceptance (Easy)
    if (rate >= 40) return '#ffc01e'; // Medium
    return '#ff375f'; // Low (Hard)
}

function CodingProblemCard(props: CodingProblemCardProps) {
    const difficultyColor = getDifficultyColor(props.difficulty);
    const acceptanceColor = getAcceptanceColor(props.acceptanceRate);

    return (
        <Box className="coding-problem-card">
            <Box className="card-content-left">
                <Box className="difficulty-indicator" sx={{ backgroundColor: difficultyColor }} />
                
                <Stack spacing={0.5}>
                    <Typography className="problem-title" variant="h6">
                        {props.title}
                    </Typography>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Acceptance: 
                            <span style={{ color: '#ccc', fontWeight: 'bold' }}>
                                {props.acceptanceRate}%
                            </span>
                        </Typography>
                        
                        {/* Optional: Add a dot separator if you add tags later */}
                        {/* <Typography variant="caption" sx={{ color: '#444' }}>•</Typography> */}
                        {/* <Typography variant="caption" sx={{ color: '#888' }}>Arrays</Typography> */}
                    </Stack>
                </Stack>
            </Box>

            <Box className="card-content-right">
                <Chip 
                    label={props.difficulty} 
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