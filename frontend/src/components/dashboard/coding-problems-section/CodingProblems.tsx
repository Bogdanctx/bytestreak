import { Box } from '@mui/material';
import "./CodingProblems.style.css"

import CodingProblemCard from './CodingProblemCard';

function CodingProblems() {
    return (
        <Box id="coding-problems-container" sx={{ p: 2, overflowY: 'auto' }}>
            <CodingProblemCard title="Two Sum" difficulty="Easy" />
            <CodingProblemCard title="Shortest Path in Binary Matrix" difficulty="Medium" />
            <CodingProblemCard title="Median of Two Sorted Arrays" difficulty="Hard" />        
        </Box>
    )
}

export default CodingProblems;