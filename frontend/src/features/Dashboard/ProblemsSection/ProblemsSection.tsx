import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Box, ButtonBase, FormControlLabel, Switch, Typography, TextField } from '@mui/material';
import { api } from '../../../api';
import { type IProblem } from '../../../types/problem.types';
import ProblemCard from './ProblemCard/ProblemCard';
import './ProblemsSection.style.css';

function ProblemsSection() {
    const navigate = useNavigate();
    const [showTags, setShowTags] = useState(false);    
    const [hideSolved, setHideSolved] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("ALL");
    const [searchInput, setSearchInput] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    
    // Debounce search input
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchInput);
        }, 500);
        
        return () => clearTimeout(timer);
    }, [searchInput]);
    
    const { data: codingProblems = [], isLoading } = useQuery<IProblem[]>({
        queryKey: ['codingProblems', selectedDifficulty, debouncedQuery, hideSolved],
        queryFn: async () => {
            let url = `/problems/public`;
            const params = new URLSearchParams();
            
            if (selectedDifficulty !== "ALL") {
                params.append('difficulty', selectedDifficulty);
            }
            
            if (debouncedQuery && debouncedQuery.trim()) {
                params.append('query', debouncedQuery.trim());
            }
            
            if (hideSolved) {
                params.append('hideSolved', 'true');
            }
            
            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await api.get(url);

            // multiply the problems to create a larger dataset for testing
            const multipliedProblems = [];
            for (let i = 0; i < 50; i++) {
                multipliedProblems.push(...response.data);
            }

            return response.data;        
            // return multipliedProblems;
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
                    <TextField
                        placeholder="Search problems by title..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        variant="outlined"
                        className="problems-search-input"
                    />
                    
                    <FormControlLabel
                        className="problems-section-switch"
                        control={<Switch className="problems-section-switch-filter" checked={showTags} onChange={() => setShowTags(!showTags)} />}
                        label="Show Tags"
                    />

                    <FormControlLabel
                        className="problems-section-switch"
                        control={<Switch className="problems-section-switch-filter" checked={hideSolved} onChange={() => setHideSolved(!hideSolved)} />}
                        label="Hide Solved"
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
                        <ProblemCard key={problem.id} problem={problem} showTags={showTags}
                        />
                    </ButtonBase>
                ))}
            </Box>
        </Box>
    )
}

export default ProblemsSection;