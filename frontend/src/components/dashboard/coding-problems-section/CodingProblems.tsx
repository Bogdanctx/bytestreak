import { Box, Pagination, Stack, Typography, Select, MenuItem, type SelectChangeEvent, FormControl, InputLabel, FormHelperText } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import "./CodingProblems.style.css"
import { useState } from 'react';

import CodingProblemCard from './CodingProblemCard';

function CodingProblems() {
    const [page, setPage] = useState(1);
    const [filter, setFilter] = useState('All');
    const itemsPerPage = 15;

    const [problems] = useState([
        { title: "Two Sum", difficulty: "Easy" },
        { title: "Shortest Path in Binary Matrix", difficulty: "Medium" },
        { title: "Median of Two Sorted Arrays", difficulty: "Hard" },
        { title: "Valid Parentheses", difficulty: "Easy" },
        { title: "Merge Two Sorted Lists", difficulty: "Easy" },
        { title: "Best Time to Buy and Sell Stock", difficulty: "Easy" },
        { title: "Binary Search", difficulty: "Easy" },
        { title: "3Sum", difficulty: "Medium" },
        { title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
        { title: "Group Anagrams", difficulty: "Medium" },
        { title: "Top K Frequent Elements", difficulty: "Medium" },
        { title: "Number of Islands", difficulty: "Medium" },
        { title: "Coin Change", difficulty: "Medium" },
        { title: "Search in Rotated Sorted Array", difficulty: "Medium" },
        { title: "Trapping Rain Water", difficulty: "Hard" },
        { title: "Merge k Sorted Lists", difficulty: "Hard" },
        { title: "Word Ladder", difficulty: "Hard" },
        { title: "LRU Cache", difficulty: "Hard" },
        { title: "Regular Expression Matching", difficulty: "Hard" },
        { title: "Serialize and Deserialize Binary Tree", difficulty: "Hard" },
    ]);

    const filteredProblems = problems.filter(problem => {
        if (filter === 'All') return true;
        return problem.difficulty === filter;
    });

    const count = Math.ceil(filteredProblems.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const currentProblems = filteredProblems.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleFilterChange = (event: SelectChangeEvent) => {
        setFilter(event.target.value);
        setPage(1);
    };

    return (
        <Box id="coding-problems-container">
            <Box id="coding-problems-header">
                <Box>
                    <Typography variant="h6" sx={{ color: 'white', fontFamily: '"Momo Trust Display", sans-serif' }}>
                        Problem Set
                    </Typography>
                </Box>

                <FormControl>
                    <FormHelperText sx={{ color: 'gray', marginLeft: '0px' }}>Filter by Difficulty</FormHelperText>
                    <Select
                        value={filter}
                        onChange={handleFilterChange}
                        className="problem-filter-select"
                        IconComponent={KeyboardArrowDownIcon}
                        displayEmpty
                        labelId="problem-filter-label"
                        label="Difficulty"
                        MenuProps={{
                            PaperProps: {
                                className: 'filter-menu-paper'
                            }
                        }}
                    >
                        <MenuItem className="filter-menu-item" value="All">All</MenuItem>
                        <MenuItem value="Easy" className="filter-menu-item" sx={{ color: '#00b8a3 !important' }}>Easy</MenuItem>
                        <MenuItem value="Medium" className="filter-menu-item" sx={{ color: '#ffc01e !important' }}>Medium</MenuItem>
                        <MenuItem value="Hard" className="filter-menu-item" sx={{ color: '#ff375f !important' }}>Hard</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <Box id="coding-problems-list">
                {currentProblems.map((problem, index) => (
                    <CodingProblemCard
                        key={`${problem.title}-${index}`}
                        title={problem.title}
                        difficulty={problem.difficulty as 'Easy' | 'Medium' | 'Hard'}
                    />
                ))}
            </Box>

            <Box id="coding-problems-footer">
                <Stack spacing={2} alignItems="center">
                    <Pagination 
                        id="coding-problems-pagination"
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

export default CodingProblems;