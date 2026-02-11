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

const MOCK_SUBMISSION_RESULTS = {
    testCases: [
        {
            test: 1,
            status: "Accepted",
            executionTime: "0.123s",
        },
        {
            test: 2,
            status: "Wrong Answer",
            executionTime: "0.456s",
        },
        {
            test: 3,
            status: "Time Limit Exceeded",
            executionTime: "1.000s",
        },
        {
            test: 4,
            status: "Runtime Error",
            executionTime: "0.789s",
        },
        {
            test: 5,
            status: "Accepted",
            executionTime: "0.321s",
        },
        {
            test: 6,
            status: "Wrong Answer",
            executionTime: "0.654s",
        },
        {
            test: 7,
            status: "Accepted",
            executionTime: "0.098s",
        },
        {
            test: 8,
            status: "Memory Limit Exceeded",
            executionTime: "0.842s",
        },
        {
            test: 9,
            status: "Accepted",
            executionTime: "0.210s",
        },
        {
            test: 10,
            status: "Time Limit Exceeded",
            executionTime: "1.000s",
        },
        {
            test: 11,
            status: "Runtime Error",
            executionTime: "0.567s",
        },
        {
            test: 12,
            status: "Accepted",
            executionTime: "0.145s",
        },
        {
            test: 13,
            status: "Wrong Answer",
            executionTime: "0.433s",
        },
        {
            test: 14,
            status: "Accepted",
            executionTime: "0.187s",
        },
        {
            test: 15,
            status: "Memory Limit Exceeded",
            executionTime: "0.911s",
        },
        {
            test: 16,
            status: "Accepted",
            executionTime: "0.123s",
        },
        {
            test: 17,
            status: "Wrong Answer",
            executionTime: "0.456s",
        },
        {
            test: 18,
            status: "Time Limit Exceeded",
            executionTime: "1.000s",
        },
        {
            test: 19,
            status: "Runtime Error",
            executionTime: "0.789s",
        },
        {
            test: 20,
            status: "Accepted",
            executionTime: "0.321s",
        },
        {
            test: 21,
            status: "Wrong Answer",
            executionTime: "0.654s",
        },
        {
            test: 22,
            status: "Accepted",
            executionTime: "0.098s",
        },
        {
            test: 23,
            status: "Memory Limit Exceeded",
            executionTime: "0.842s",
        },
        {
            test: 24,
            status: "Memory Limit Exceeded",
            executionTime: "0.842s",
        },
        {
            test: 25,
            status: "Memory Limit Exceeded",
            executionTime: "0.842s",
        },
    ]
};


function SubmissionResults() {
    const totalTests = MOCK_SUBMISSION_RESULTS.testCases.length;
    const passedTests = MOCK_SUBMISSION_RESULTS.testCases.filter(tc => tc.status === "Accepted").length;
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
                {MOCK_SUBMISSION_RESULTS.testCases.map((testCase) => (
                    <Tooltip key={testCase.test} 
                            title={`Execution Time: ${testCase.executionTime}`} 
                            placement="top" 
                            slots={{ transition: Zoom }}
                            arrow>
                        <Box className="submission-result-testcase">
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '4px' }}>
                                {testCase.status === "Accepted" ? <CheckIcon fontSize={"0.5rem"} color="success" /> : <CloseIcon fontSize={"0.5rem"} color="error" />}
                                <Typography className="testcase" variant="body1">
                                    Test Case {testCase.test}
                                    <Typography className="testcase-status">{testCase.status}</Typography>
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