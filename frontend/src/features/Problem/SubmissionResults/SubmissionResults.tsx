import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Box, LinearProgress, Typography } from '@mui/material';

import { type ISubmissionResult } from '../../../types/problem.types';
import './SubmissionResults.style.css';

function SubmissionResults({ results }: { results: ISubmissionResult[] }) {
    if (results.length === 0) {
        return (
            <Box className="submission-result-container">
                <Typography variant="body1" sx={{ color: '#bdbdbd' }}>
                    Running your code against the test cases. Please wait for the results to be displayed here.
                </Typography>
            </Box>
        )
    }

    const totalTests = results.length;
    const passedTests = results.filter(tc => tc.statusId === 3).length;
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
                {results.map((testCase) => (
                    <Box key={testCase.testCaseId} className="submission-result-testcase">
                        <Box mr={1}>
                            {testCase.statusId === 3 ? 
                                <CheckIcon sx={{ fontSize: "0.6rem" }} color="success" /> 
                                : 
                                <CloseIcon sx={{ fontSize: "0.6rem" }} color="error" />
                            }
                        </Box>
                        <Box >
                            <Typography className="testcase" variant="body1" component="div">
                                Test Case {testCase.testCaseId}
                                <Typography className="testcase-status">{testCase.statusDescription}</Typography>
                            </Typography>
                        </Box>

                    </Box>
                ))}
            </Box>
        </Box>
    )
}

export default SubmissionResults;