import {
    Box
} from '@mui/material';
import './Creator.style.css';
import ProblemBuilder from '../../features/Creator/ProblemBuilder';

function Creator() {

    return (
        <Box className="creator-container">
            <ProblemBuilder />
        </Box>
    )
}

export default Creator;