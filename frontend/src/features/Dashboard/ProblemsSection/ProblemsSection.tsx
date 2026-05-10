import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonBase, FormControlLabel, Switch, Typography } from '@mui/material';
import { api } from '../../../api';
import { type IProblem } from '../../../types/problem.types';
import ProblemCard from './ProblemCard/ProblemCard';
import './ProblemsSection.style.css';

function ProblemsSection() {
    const navigate = useNavigate();
    const [showTags, setShowTags] = useState(false);    
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
    const { data: codingProblems = [], isLoading } = useQuery<IProblem[]>({
        queryKey: ['codingProblems', selectedDifficulty],
        queryFn: async () => {
            let url = `/problems/fetch-all`;
            
            if (selectedDifficulty !== "ALL") {
                url += `?difficulty=${selectedDifficulty}`;
            }

            const response = await api.get(url);
            return response.data;        
        }
    });

    return (
        <Box id="problems-section-container">
            <Box id="problems-section-header">
                <Box className="problems-section-header-copy">
                    <Typography variant="h5" className="problems-section-title">
                        Problem Set
                    </Typography>
                    <Typography variant="body2" className="problems-section-subtitle">
                        Practice and improve your coding skills
                    </Typography>
                </Box>

                <Box className="problems-section-controls">
                    <FormControlLabel
                        className="problems-section-switch"
                        control={<Switch className="show-tags-switch" checked={showTags} onChange={() => setShowTags(!showTags)} />}
                        label="Show Tags"
                    />

                    <Box className="problems-section-filter-block">
                        <Typography variant="caption" className="problems-section-filter-label">
                            Filter
                        </Typography>
                        <Box className="difficulty-filter-group">
                            {['ALL', 'EASY', 'MEDIUM', 'HARD'].map((diff) => (
                                <button
                                    key={diff}
                                    className={`difficulty-btn ${selectedDifficulty === diff ? `active-${diff}` : ''}`}
                                    onClick={() => setSelectedDifficulty(diff)}
                                >
                                    {diff}
                                </button>
                            ))}
                        </Box>
                    </Box>
                </Box>
            </Box>

            <Box id="problems-section-list">
                {isLoading && <Typography className="problems-section-status">Loading problems...</Typography>}
                
                {!isLoading && codingProblems.length === 0 && (
                    <Typography className="problems-section-status">No coding problems available.</Typography>
                )}

                {codingProblems.map((problem) => (
                    <ButtonBase key={problem.id} onClick={() => navigate(`/problems/${problem.id}/description`)}>
                        <ProblemCard
                            key={problem.id}
                            title={problem.title}
                            difficulty={problem.difficulty}
                            showTags={showTags}
                            tags={problem.tags}
                        />
                    </ButtonBase>
                ))}
            </Box>
        </Box>
    )
}

export default ProblemsSection;