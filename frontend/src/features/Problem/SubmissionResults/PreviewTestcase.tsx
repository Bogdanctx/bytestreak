import { Box, Card, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { type ISubmissionResult } from '../../../types/problem.types';
import './PreviewTestcase.style.css';

interface PreviewTestcaseProps {
    testcase: ISubmissionResult;
    onClose: () => void;
}

function PreviewTestcase({ testcase, onClose }: PreviewTestcaseProps) {
    return (
        <Card className="preview-testcase-container">
            <Box className="preview-testcase-header">
                <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>
                    Test Case {testcase.testCaseId}
                </Typography>
                <IconButton
                    size="small"
                    onClick={onClose}
                    sx={{ color: 'var(--text-secondary)' }}
                >
                    <CloseIcon />
                </IconButton>
            </Box>

            <Box className="preview-testcase-content">
                <Box className="preview-section">
                    <Typography variant="subtitle2" className="preview-label">
                        Test Input
                    </Typography>
                    <Box className="preview-value">
                        <Typography variant="body2" component="pre">
                            {testcase.testCaseInput || 'No input'}
                        </Typography>
                    </Box>
                </Box>

                <Box className="preview-section">
                    <Typography variant="subtitle2" className="preview-label">
                        Expected Output
                    </Typography>
                    <Box className="preview-value">
                        <Typography variant="body2" component="pre">
                            {testcase.testCaseExpectedOutput || 'No expected output'}
                        </Typography>
                    </Box>
                </Box>

                <Box className="preview-section">
                    <Typography variant="subtitle2" className="preview-label">
                        Your Output
                    </Typography>
                    <Box className={`preview-value ${testcase.statusId === 3 ? 'success' : 'failed'}`}>
                        <Typography variant="body2" component="pre">
                            {testcase.testCaseOutput || 'No output'}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
}

export default PreviewTestcase;
