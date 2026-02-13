import { 
    Box, 
    Typography,
    Tooltip,
    Zoom,
    LinearProgress
} from "@mui/material";
import './SubmissionResults.style.css';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';


interface SubmissionResultsProps {
    testCases: {
        testCaseId: number;
        statusId: number;
        statusDescription: string;
    }[];
}

function SubmissionResults({ testCases }: SubmissionResultsProps) {
    if (testCases.length === 0) {
        return (
            <Box className="submission-result-container">
                <Typography variant="body1" sx={{ color: '#bdbdbd' }}>
                    Running your code against the test cases. Please wait for the results to be displayed here.
                </Typography>
            </Box>
        )
    }

    const totalTests = testCases.length;
    const passedTests = testCases.filter(tc => tc.statusId === 3).length;
    const passPercentage = (passedTests / totalTests) * 100;


    return (
        <Box className="submission-result-container">
           
            <Box className="submission-result-overview">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="body2" sx={{ color: '#bdbdbd' }}>
                        Test Cases Passed
                    </Typography>
                    <Typography variant="h6" sx={{ color: passPercentage === 100 ? '#66bb6a' : 'white' }}>
                        {passedTests}/{totalTests}
                    </Typography>
                </Box>
                <LinearProgress 
                    variant="determinate" 
                    value={passPercentage} 
                    sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#424242',
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: passPercentage === 100 ? '#66bb6a' : '#2196f3'
                        }
                    }}
                />
            </Box>

            <Box className="submission-testcases-results">
                {testCases.map((testCase) => (
                    <Tooltip key={testCase.testCaseId} 
                            title={`Execution Time: 0`} 
                            placement="top" 
                            slots={{ transition: Zoom }}
                            arrow>
                        <Box className="submission-result-testcase">
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                                {testCase.statusId === 3 ? <CheckIcon fontSize={"0.5rem"} color="success" /> : <CloseIcon fontSize={"0.5rem"} color="error" />}
                                <Typography className="testcase" variant="body1">
                                    Test Case {testCase.testCaseId}
                                    <Typography className="testcase-status">{testCase.statusDescription}</Typography>
                                </Typography>
                            </Box>

                        </Box>
                    </Tooltip>
                ))}
            </Box>
        </Box>
    )
}

export default SubmissionResults;