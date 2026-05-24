import { Box, Divider, Typography } from '@mui/material';
import Editor from '@monaco-editor/react';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import './ValidationScriptTab.style.css';

interface ValidationTabProps {
    validationCode: string;
    setValidationCode: (code: string) => void;
}

function ValidationTab({ validationCode, setValidationCode }: ValidationTabProps) {
    return (
        <Box className="validation-container">
            <Box className="validation-left-panel">
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <InfoOutlinedIcon sx={{ color: 'var(--accent-main)' }} />
                    <Typography fontFamily={"Momo Trust Display"} variant="h6" color="white">
                        Validation Script
                    </Typography>
                </Box>
                
                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', mb: 2 }} />
                
                <Typography variant="body2" color="var(--text-secondary)" lineHeight={1.6}>
                    Write a custom script to check if a user's solution is valid. 
                    <br /><br />
                    This applies <strong>only</strong> for problems where multiple valid answers exist (e.g., returning any valid path in a graph, or any array permutation that matches a condition).
                    <br /><br />
                    Your script should take the user's output and evaluate it against the expected logic, returning a boolean pass/fail.
                    <br /><br />
                    The validation script must be written in <strong>Python</strong>!
                </Typography>
            </Box>

            {/* Editor */}
            <Box className="validation-right-panel">
                <Editor
                    height="100%"
                    theme='vs-dark'
                    language={"python"}
                    defaultLanguage={"python"}
                    value={validationCode}
                    onChange={(value) => setValidationCode(value || "")}
                    options={{
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                    }}
                />
            </Box>
        </Box>
    );
}

export default ValidationTab;