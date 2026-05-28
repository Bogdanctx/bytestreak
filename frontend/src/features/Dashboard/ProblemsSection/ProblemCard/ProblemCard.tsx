import { Box, Typography, Chip, Stack } from '@mui/material';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import "./ProblemCard.style.css"
import { useAccount } from '../../../../hooks/useAccount';
import type { IProblem } from '../../../../types/problem.types';

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

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

function ProblemCard({ problem, showTags }: { problem: IProblem, showTags: boolean }) {
    const { data: account } = useAccount();

    const hasSolved = account?.solvedProblems.some((solvedProblem) => problem.id === solvedProblem.id);
    const difficultyColor = getDifficultyColor(problem.difficulty);

    return (
        <Box className="problem-card">
            <Box className="problem-card-content-left">
                <Box
                    className="difficulty-indicator"
                    sx={{ backgroundColor: difficultyColor }}
                />

                <Box className="problem-card-info">
                    <Typography className="problem-card-title" component="span">
                        {problem.title}
                    </Typography>

                    {showTags && problem.tags.length > 0 && (
                        <Stack direction="row" spacing={0.5} alignItems="center">
                            {problem.tags.map((tag, index) => (
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
                {hasSolved && (
                    <CheckBoxIcon className="solved-icon" fontSize="small" />
                )}
                
                <Chip
                    label={problem.difficulty}
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