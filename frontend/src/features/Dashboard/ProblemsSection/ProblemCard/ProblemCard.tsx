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

const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
        case 'EASY': return '#00b8a3';
        case 'MEDIUM': return '#ffc01e';
        case 'HARD': return '#ff375f';
        default: return 'GRAY';
    }
}

function ProblemCard(props: ProblemCardProps) {
    const difficultyColor = getDifficultyColor(props.difficulty);

    console.log('Rendering ProblemCard:', props.title, props.difficulty, props.tags);

    return (
        <Box className="problem-card">
            <Box className="problem-card-content-left">
                <Box className="difficulty-indicator" sx={{ backgroundColor: difficultyColor }} />
                
                <Box className="problem-card-info">
                    <Typography className="problem-card-title" variant="h6">
                        {props.title}
                    </Typography>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                        {props.showTags && <>
                            <Stack direction="row" spacing={0.5} >
                                {props.tags.map((tag, index) => (
                                    <Chip 
                                        key={`${tag}-${index}`} 
                                        label={tag}
                                        size="small"
                                        className="tag-chip"
                                        sx={{
                                            borderColor: '#555',
                                            color: '#ccc',
                                            backgroundColor: '#55555520',
                                        }}
                                    />
                                ))}
                            </Stack>
                        </>}
                    </Stack>
                </Box>
            </Box>

            <Box className="problem-card-content-right">
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

export default ProblemCard;