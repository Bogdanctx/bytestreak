import { Box, Pagination, Stack, Typography, Select, MenuItem, type SelectChangeEvent, FormControl, FormHelperText, Switch, FormLabel, FormControlLabel } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import "./ProblemsSection.style.css"
import { useState } from 'react';
import ProblemCard from './ProblemCard/ProblemCard';

function ProblemsSection() {
    const [problems] = useState([
        { title: "Two Sum", difficulty: "Easy", acceptanceRate: 45.3, tags: ["Array", "Hash Table"] },
        { title: "Shortest Path in Binary Matrix", difficulty: "Medium", acceptanceRate: 38.7, tags: ["BFS", "Matrix"] },
        { title: "Median of Two Sorted Arrays", difficulty: "Hard", acceptanceRate: 29.1, tags: ["Array", "Binary Search", "Divide & Conquer"] },
        { title: "Valid Parentheses", difficulty: "Easy", acceptanceRate: 42.5, tags: ["String", "Stack"] },
        { title: "Merge Two Sorted Lists", difficulty: "Easy", acceptanceRate: 40.2, tags: ["Linked List", "Recursion"] },
        { title: "Best Time to Buy and Sell Stock", difficulty: "Easy", acceptanceRate: 37.8, tags: ["Array", "Dynamic Programming"] },
        { title: "Binary Search", difficulty: "Easy", acceptanceRate: 44.1, tags: ["Array", "Binary Search"] },
        { title: "3Sum", difficulty: "Medium", acceptanceRate: 30.4, tags: ["Array", "Two Pointers", "Sorting"] },
        { title: "Longest Substring Without Repeating Characters", difficulty: "Medium", acceptanceRate: 32.6, tags: ["Hash Table", "String", "Sliding Window"] },
        { title: "Group Anagrams", difficulty: "Medium", acceptanceRate: 35.9, tags: ["Array", "Hash Table", "String"] },
        { title: "Top K Frequent Elements", difficulty: "Medium", acceptanceRate: 33.2, tags: ["Hash Table", "Heap", "Sorting"] },
        { title: "Number of Islands", difficulty: "Medium", acceptanceRate: 31.7, tags: ["Array", "DFS", "BFS", "Matrix"] },
        { title: "Coin Change", difficulty: "Medium", acceptanceRate: 28.5, tags: ["Array", "Dynamic Programming", "BFS"] },
        { title: "Search in Rotated Sorted Array", difficulty: "Medium", acceptanceRate: 29.8, tags: ["Array", "Binary Search"] },
        { title: "Trapping Rain Water", difficulty: "Hard", acceptanceRate: 27.3, tags: ["Array", "Two Pointers", "DP", "Stack"] },
        { title: "Merge k Sorted Lists", difficulty: "Hard", acceptanceRate: 25.6, tags: ["Linked List", "Divide & Conquer", "Heap"] },
        { title: "Word Ladder", difficulty: "Hard", acceptanceRate: 26.4, tags: ["Hash Table", "String", "BFS"] },
        { title: "LRU Cache", difficulty: "Hard", acceptanceRate: 24.9, tags: ["Hash Table", "Linked List", "Design"] },
        { title: "Regular Expression Matching", difficulty: "Hard", acceptanceRate: 22.1, tags: ["String", "Dynamic Programming", "Recursion"] },
        { title: "Serialize and Deserialize Binary Tree", difficulty: "Hard", acceptanceRate: 23.5, tags: ["String", "Tree", "DFS", "BFS"] },
    ]);

    const [showTags, setShowTags] = useState(false);
    const [page, setPage] = useState(1);
    const [difficultyFilter, setDifficultyFilter] = useState('All');
    const [sortOrder, setSortOrder] = useState('none');
    const itemsPerPage = 12;

    const filteredProblems = problems.filter(problem => {
        if (difficultyFilter === 'All') return true;
        return problem.difficulty === difficultyFilter;
    });

    const sortedProblems = [...filteredProblems].sort((a, b) => {
        if (sortOrder === 'increasing') {
            return a.acceptanceRate - b.acceptanceRate;
        } 
        else if (sortOrder === 'decreasing') {
            return b.acceptanceRate - a.acceptanceRate;
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
                            <MenuItem className="filter-menu-item" value="Easy" sx={{ color: '#00b8a3 !important' }}>Easy</MenuItem>
                            <MenuItem className="filter-menu-item" value="Medium" sx={{ color: '#ffc01e !important' }}>Medium</MenuItem>
                            <MenuItem className="filter-menu-item" value="Hard" sx={{ color: '#ff375f !important' }}>Hard</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
            </Box>

            <Box id="problems-section-list">
                {currentProblems.map((problem, index) => (
                    <ProblemCard
                        key={`${problem.title}-${index}`}
                        title={problem.title}
                        difficulty={problem.difficulty as 'Easy' | 'Medium' | 'Hard'}
                        acceptanceRate={problem.acceptanceRate}
                        showTags={showTags}
                        tags={problem.tags}
                    />
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