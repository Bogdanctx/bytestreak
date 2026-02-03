import { Box, Pagination, Stack, Typography } from '@mui/material';
import "./CodingProblems.style.css"
import { useState } from 'react';

import CodingProblemCard from './CodingProblemCard';

function CodingProblems() {
    const [page, setPage] = useState(1);
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

    const count = Math.ceil(problems.length / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const currentProblems = problems.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    return (
        <Box id="coding-problems-container">
            <Box id="coding-problems-header">
                <Typography variant="h6" sx={{ color: 'white', fontFamily: '"Momo Trust Display", sans-serif' }}>
                    Problem Set
                </Typography>
                <Typography variant="body2" sx={{ color: 'gray' }}>
                    {problems.length} problems available
                </Typography>
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