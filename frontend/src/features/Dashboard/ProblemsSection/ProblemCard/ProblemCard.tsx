import { Box, Typography, Chip, Stack } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "./ProblemCard.style.css"

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

type ProblemCardProps = {
    title: string;
    difficulty: Difficulty;
    acceptanceRate: number;
    tags: string[];
    showTags: boolean;
    pid: number;
}

const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
        case 'Easy': return '#00b8a3';
        case 'Medium': return '#ffc01e';
        case 'Hard': return '#ff375f';
        default: return 'gray';
    }
}

function ProblemCard(props: ProblemCardProps) {
    const difficultyColor = getDifficultyColor(props.difficulty);

    return (
        <Box className="problem-card">
            <Box className="problem-card-content-left">
                <Box className="difficulty-indicator" sx={{ backgroundColor: difficultyColor }} />
                
                <Stack spacing={0.5}>
                    <Typography className="problem-card-title" variant="h6">
                        {props.pid}. {props.title}
                    </Typography>
                    
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="caption" sx={{ color: '#888', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            Acceptance: 
                            <span style={{ color: '#ccc', fontWeight: 'bold' }}>
                                {props.acceptanceRate}%
                            </span>
                        </Typography>
                        
                        {/* Optional: Add a dot separator if you add tags later */}
                        {props.showTags && <>
                            <Typography variant="caption" sx={{ color: '#444' }}>•</Typography>
                            {/* <Typography variant="caption" sx={{ color: '#888' }}>Arrays</Typography> */}
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
                </Stack>
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