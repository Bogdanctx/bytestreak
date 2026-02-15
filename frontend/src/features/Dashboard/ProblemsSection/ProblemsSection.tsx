import { 
    Box, 
    Pagination, 
    Stack, 
    Typography, 
    Select, 
    MenuItem, 
    ButtonBase, 
    type SelectChangeEvent, 
    FormControl, 
    FormHelperText, 
    Switch, 
    FormControlLabel, } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import "./ProblemsSection.style.css"
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProblemCard from './ProblemCard/ProblemCard';
import { api } from '../../../api';
import { type IProblem } from '../../../entities';

function ProblemsSection() {
    const [problems, setProblems] = useState<IProblem[]>([]);
    const navigate = useNavigate();
    const [showTags, setShowTags] = useState(false);
    const [page, setPage] = useState(1);
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('none');
    
    
    useEffect(() => {
        api.get('/problems/all')
            .then(response => {
                setProblems(response.data);
            })
            .catch(error => {
                console.error("Error fetching problems:", error);
            });
    }, []);

    
    const itemsPerPage = 12;

    const filteredProblems = problems.filter(problem => {
        if (difficultyFilter === 'All') return true;
        return problem.difficulty === difficultyFilter;
    });

    const sortedProblems = [...filteredProblems].sort((a, b) => {
        if (sortOrder === 'increasing') {
            return 0;
            //return a.acceptanceRate - b.acceptanceRate;
        } 
        else if (sortOrder === 'decreasing') {
            return 0;
            //return b.acceptanceRate - a.acceptanceRate;
        }
        return 0;
    });

    const count = Math.ceil(sortedProblems.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const currentProblems = sortedProblems.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleSortChange = (event: SelectChangeEvent) => {
        setSortOrder(event.target.value);
        setPage(1);
    };

    const handleDifficultyChange = (event: SelectChangeEvent) => {
        setDifficultyFilter(event.target.value);
        setPage(1);
    };

    return (
        <Box id="problems-section-container">
            <Box id="problems-section-header">
                <Box>
                    <Typography variant="h6" sx={{ color: 'white', fontFamily: '"Momo Trust Display", sans-serif' }}>
                        Problem Set
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl component="fieldset" variant="standard">
                        <FormControlLabel
                            control={<Switch className="show-tags-switch" checked={showTags} onChange={() => setShowTags(!showTags)}/>}
                            label="Show Tags"
                            sx={{ 
                                color: 'gray',
                                '& .MuiFormControlLabel-label': {
                                    fontSize: '0.875rem',
                                    fontFamily: '"Momo Trust Display", sans-serif',
                                }
                            }}
                        />
                    </FormControl>

                    <FormControl>
                        <FormHelperText sx={{ color: 'gray', marginLeft: '0px', marginTop: '-20px', position: 'absolute' }}>
                            Sort by Acceptance
                        </FormHelperText>
                        <Select
                            value={sortOrder}
                            onChange={handleSortChange}
                            className="problem-filter-select"

                            IconComponent={KeyboardArrowDownIcon}
                            displayEmpty
                            MenuProps={{ PaperProps: { className: 'filter-menu-paper' } }}
                        >
                            <MenuItem className="filter-menu-item" value="none">None</MenuItem>
                            <MenuItem className="filter-menu-item" value="increasing">Increasing</MenuItem>
                            <MenuItem className="filter-menu-item" value="decreasing">Decreasing</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl>
                        <FormHelperText sx={{ color: 'gray', marginLeft: '0px', marginTop: '-20px', position: 'absolute' }}>
                            Filter by Difficulty
                        </FormHelperText>
                        <Select
                            value={difficultyFilter}
                            onChange={handleDifficultyChange}
                            className="problem-filter-select"
                            IconComponent={KeyboardArrowDownIcon}
                            displayEmpty
                            MenuProps={{ PaperProps: { className: 'filter-menu-paper' } }}
                        >
                            <MenuItem className="filter-menu-item" value="All">All</MenuItem>
                            <MenuItem className="filter-menu-item" value="EASY" sx={{ color: '#00b8a3 !important' }}>Easy</MenuItem>
                            <MenuItem className="filter-menu-item" value="MEDIUM" sx={{ color: '#ffc01e !important' }}>Medium</MenuItem>
                            <MenuItem className="filter-menu-item" value="HARD" sx={{ color: '#ff375f !important' }}>Hard</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Box id="problems-section-list">
                {currentProblems.map((problem) => (
                    <ButtonBase key={problem.id} onClick={() => navigate(`/problems/${problem.id}/description`)}>
                        <ProblemCard
                            title={problem.title}
                            difficulty={problem.difficulty as 'EASY' | 'MEDIUM' | 'HARD'}
                            acceptanceRate={0}
                            showTags={showTags}
                            tags={problem.tags}
                            pid={problem.id}
                        />
                    </ButtonBase>
                ))}
            </Box>

            <Box id="problems-section-footer">
                <Stack spacing={2} alignItems="center">
                    <Pagination 
                        id="problems-section-pagination"
                        count={count} 
                        page={page} 
                        onChange={handlePageChange} 
                        shape="rounded"
                    />
                </Stack>
            </Box>
        </Box>
    )
}

export default ProblemsSection;