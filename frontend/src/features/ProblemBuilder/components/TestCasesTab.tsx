import {
    Box,
    Typography,
    Divider,
    Button,
    TextField
} from "@mui/material"
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";
import './TestCasesTab.style.css'
import { type ITestCase } from "../../../entities.ts";

interface TestCaseProps {
    testCases: ITestCase[];
    setTestCases: (testCases: ITestCase[]) => void;
}

function TestCasesTab({ testCases, setTestCases }: TestCaseProps) {
    const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);


    const updateTestCase = (field: 'input' | 'output', value: string) => {
        const updatedCases = [...testCases];
        updatedCases[selectedCaseIndex] = {
            ...updatedCases[selectedCaseIndex],
            [field]: value
        };
        setTestCases(updatedCases);
    }

    const handleAddTestCase = () => {
        const newCase: ITestCase = {
            fileName: `test${testCases.length + 1}`,
            input: '',
            output: ''
        };
        const newTestCases = [...testCases, newCase];
        setTestCases(newTestCases);
        setSelectedCaseIndex(newTestCases.length - 1);
    }

    const handleDeleteTestCase = (index: number) => {
        const newTestCases = testCases.filter((_, i) => i !== index);
        setTestCases(newTestCases);

        if (index === selectedCaseIndex) {
            setSelectedCaseIndex(0);
        } else if (index < selectedCaseIndex) {
            setSelectedCaseIndex((prev) => prev - 1);
        }
    }

    return (
        <Box className="testcases-container">
            <Box className="testcases-left-panel">
                <Box className="testcases-left-panel-header">
                    <Typography fontFamily={"Momo Trust Display"} variant="h6" color="white">
                        Test Cases
                    </Typography>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', width: "80%", margin: "auto", marginBottom: "8px" }} />

                <Box className="testcases-list">
                    {testCases.map((testCase, index) => (
                        <Box 
                            key={index} 
                            className={`testcase-item ${index === selectedCaseIndex ? 'active' : ''}`}
                            onClick={() => setSelectedCaseIndex(index)}
                        >
                            <Typography variant="body2" fontWeight={600}>{testCase.fileName}</Typography>
                            <IconButton 
                                size="small" 
                                onClick={(e) => { e.stopPropagation(); handleDeleteTestCase(index); }}
                                sx={{ color: 'var(--text-secondary)', '&:hover': { color: '#FF4444' } }}
                            >
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    ))}
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', width: "80%", margin: "auto" }} />

                <Box className="testcases-left-panel-footer">
                    <Button
                        className="add-testcase-button"
                        variant="outlined"
                        onClick={handleAddTestCase}
                        startIcon={<AddIcon />}
                    >
                        Add test case
                    </Button>
                </Box>

            </Box>

            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

            <Box className="testcases-right-panel">
                <Typography color="white" fontFamily={"Momo Trust Display"} >
                    {testCases.length > 0 ? testCases[selectedCaseIndex].fileName : "Test Case Details"}
                </Typography>

                <Divider orientation="horizontal" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                {testCases.length > 0 && selectedCaseIndex >= 0 ? (
                    <Box className="testcases-inputs">
                        <Typography className="input-label">Input</Typography>
                        <TextField
                            multiline
                            minRows={12}
                            maxRows={12}
                            className="code-input-field"
                            value={testCases[selectedCaseIndex]?.input || ""}
                            onChange={(e) => updateTestCase('input', e.target.value)}
                            placeholder="Enter input (e.g., 121)"
                        />

                        <Typography className="input-label" sx={{ mt: 2 }}>Expected Output</Typography>
                        <TextField
                            multiline
                            minRows={12}
                            maxRows={12}
                            className="code-input-field"
                            value={testCases[selectedCaseIndex]?.output || ""}
                            onChange={(e) => updateTestCase('output', e.target.value)}
                            placeholder="Enter expected output (e.g., true)"
                        />
                    </Box>
                ) : (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%" color="var(--text-secondary)">
                        <Typography>No test case selected</Typography>
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default TestCasesTab;