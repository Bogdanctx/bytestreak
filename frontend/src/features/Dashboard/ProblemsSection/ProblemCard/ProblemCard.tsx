import { Box, Typography, Chip, Stack } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "./ProblemCard.style.css"

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface ProblemCardProps {
    title: string;
    difficulty: Difficulty;
    tags: string[];
    showTags: boolean;
}

const getDifficultyColor = (difficulty: Difficulty): string => {
    switch (difficulty) {
        case 'EASY':
            return '#00b8a3';
        case 'MEDIUM': 
            return '#ffc01e';
        case 'HARD':   
            return '#ff375f';
        default:       
            return '#888888';
    }
}

function ProblemCard(props: ProblemCardProps) {
    const difficultyColor = getDifficultyColor(props.difficulty);

    return (
        <Box
            className="problem-card"
            style={{ '--card-color': `${difficultyColor}22` } as React.CSSProperties}
        >
            <Box className="problem-card-content-left">
                <Box
                    className="difficulty-indicator"
                    sx={{ backgroundColor: difficultyColor }}
                />

                <Box className="problem-card-info">
                    <Typography className="problem-card-title" component="span">
                        {props.title}
                    </Typography>

                    {props.showTags && props.tags.length > 0 && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            {props.tags.map((tag, index) => (
                                <Chip
                                    key={`${tag}-${index}`}
                                    label={tag}
                                    size="small"
                                    variant="outlined"
                                    className="tag-chip"
                                    sx={{
                                        borderColor: '#333',
                                        color: '#666',
                                        backgroundColor: 'transparent',
                                    }}
                                />
                            ))}
                        </Stack>
                    )}
                </Box>
            </Box>

            <Box className="problem-card-content-right">
                <Chip
                    label={props.difficulty}
                    size="small"
                    variant="outlined"
                    className="difficulty-chip"
                    sx={{
                        color: difficultyColor,
                        borderColor: `${difficultyColor}55`,
                        backgroundColor: `${difficultyColor}10`,
                    }}
                />
                <ArrowForwardIosIcon className="action-icon" fontSize="small" />
            </Box>
        </Box>
    );
}

export default ProblemCard;