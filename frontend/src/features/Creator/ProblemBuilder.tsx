import {
    Box,
    Typography,
    Button,
    Tabs,
    Tab,
    FormControl,
    Select,
    MenuItem,
    Divider,
    IconButton,
    TextField
} from '@mui/material';
import { useState } from 'react';
import './ProblemBuilder.style.css';
import Editor from '@monaco-editor/react';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import PublishIcon from '@mui/icons-material/Publish';

interface TestCase {
    fileName: string;
    input: string;
    output: string;
}

function ProblemBuilder() {
    const [activeTab, setActiveTab] = useState("markdown");
    const [problemDescription, setProblemDescription] = useState("# Problem Description\n\nWrite your problem description here...");
    const [programmingLanguage, setProgrammingLanguage] = useState("cpp");
    const [starterCode, setStarterCode] = useState({});
    const [driverCode, setDriverCode] = useState({});
    const [testCases, setTestCases] = useState<TestCase[]>([
        { fileName: "test1.txt", input: "121", output: "true" },
        { fileName: "test2.txt", input: "-121", output: "false" }
    ]);
    const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);


    const handleCreateNewProblem = () => {
        
    }

    const updateTestCase = (field: 'input' | 'output', value: string) => {
        setTestCases((prev) => {
            const updated = [...prev];
            const current = updated[selectedCaseIndex] || { input: '', output: '' };
            updated[selectedCaseIndex] = {
                ...current,
                [field]: value
            };
            return updated;
        });
    }

    const handleEditorChange = (value: string | undefined) => {
        if(activeTab === "markdown") {
            setProblemDescription(value || "");
        }
        else if(activeTab === "starter-code") {
            setStarterCode((prev: any) => ({
                ...prev,
                [programmingLanguage]: value || ""
            }));
        }
        else if(activeTab === "driver-code") {
            setDriverCode((prev: any) => ({
                ...prev,
                [programmingLanguage]: value || ""
            }));
        }
    }

    const handleDeleteTestCase = (index: number) => {
        setTestCases((prev) => prev.filter((_, i) => i !== index));
        if (index === selectedCaseIndex) {
            setSelectedCaseIndex(-1); // Deselect if the deleted case was selected
        } 
        else if (index < selectedCaseIndex) {
            setSelectedCaseIndex((prev) => prev - 1); // Shift selection index if a preceding case was deleted
        }
    }

    return (
        <Box className="problem-builder-container">

            <Box className="problem-builder-main">
                <Box className="problem-builder-header">
                    <Box display="flex" alignItems="center" gap={2}>
                        <Tabs value={activeTab} 
                            className="problem-builder-tabs"
                            slotProps={{
                                indicator: {
                                    style: { backgroundColor: '#23CE6B' }
                                }
                            }}
                            >
                            <Tab className='problem-builder-tab' label="Markdown" value="markdown" onClick={() => setActiveTab("markdown")} />
                            <Tab className='problem-builder-tab' label="Starter code" value="starter-code" onClick={() => setActiveTab("starter-code")} />
                            <Tab className='problem-builder-tab' label="Driver code" value="driver-code" onClick={() => setActiveTab("driver-code")} />
                            <Tab className='problem-builder-tab' label="Test Cases" value="testcases" onClick={() => setActiveTab("testcases")} />
                        </Tabs>

                        {(activeTab === "starter-code" || activeTab === "driver-code") && (
                            <FormControl>
                                <Select
                                    className='language-select'
                                    labelId="language-select-label"
                                    onChange={(event) => { setProgrammingLanguage(event.target.value); console.log(`Selected: ${event.target.value}`) }}
                                    value={programmingLanguage}
                                    label="C++"
                                    MenuProps={{
                                        PaperProps: {
                                            sx: {
                                                backgroundColor: "#1f1f1f",
                                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                            }
                                        }
                                    }}
                                >
                                    <MenuItem className='language-select-item' value={"cpp"}>C++</MenuItem>
                                    <MenuItem className='language-select-item' value={"python"}>Python3</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </Box>

                    <Button sx={{
                        backgroundColor: 'transparent',
                        color: 'white',
                        fontSize: '10px',
                        height: '25px',
                        marginRight: '16px',
                        borderColor: '#23CE6B',
                        width: '80px',
                        ':hover': {
                            borderColor: '#E7BB41'
                        }
                    }}
                        variant='outlined'
                        onClick={() => handleCreateNewProblem()}
                    >
                        <PublishIcon sx={{ fontSize: '16px' }} />
                        Submit
                    </Button>
                </Box>

                <Box className="problem-builder-content">

                    {activeTab === "markdown" && (
                        <Editor
                            height="100%"
                            theme='vs-dark'
                            defaultLanguage="markdown"
                            defaultValue="# Write your problem description here..."
                            onChange={handleEditorChange}
                        />
                    )}

                    {(activeTab === "starter-code" || activeTab === "driver-code") && (
                        <Editor
                            height="100%"
                            theme='vs-dark'
                            defaultLanguage={programmingLanguage}
                            value={activeTab === "starter-code" ? starterCode[programmingLanguage] || "" : driverCode[programmingLanguage] || ""}
                            onChange={handleEditorChange}
                        />
                    )}

                    {activeTab === "testcases" && (
                        <Box className="testcases-container">

                            <Box className="testcases-left-panel">
                                <Box className="testcases-left-panel-header">
                                    <Typography fontFamily={"Momo Trust Display"} variant="h6" color="white">
                                        Test Cases
                                    </Typography>
                                </Box>

                                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)', width: "80%", margin: "auto" }} />

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
                                                sx={{ color: '#666', '&:hover': { color: '#FF4444' } }}
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
                                        startIcon={<AddIcon />}
                                    >
                                        Add test case
                                    </Button>
                                </Box>

                            </Box>

                            <Divider orientation="vertical" flexItem sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                            <Box className="testcases-right-panel">
                                <Typography color="white" fontFamily={"Momo Trust Display"} >
                                    {selectedCaseIndex >= 0 ? testCases[selectedCaseIndex].fileName : "Test Case Details"}
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
                                    <Box display="flex" justifyContent="center" alignItems="center" height="100%" color="#666">
                                        <Typography>No test case selected</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            {activeTab === "markdown" && (
                <Box className="problem-builder-markdown-preview">
                    <MarkdownRenderer content={problemDescription} />
                </Box>
            )}
        </Box>
    )
}

export default ProblemBuilder;