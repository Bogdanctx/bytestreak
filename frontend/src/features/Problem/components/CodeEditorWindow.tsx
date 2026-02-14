import { 
    Box, 
    Button, 
    FormControl, 
    MenuItem, 
    Select, 
    Switch, 
    Typography 
} from '@mui/material';
import Editor from '@monaco-editor/react';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SunnyIcon from '@mui/icons-material/Sunny';
import { useState, useEffect } from 'react';
import { api } from '../../../api';
import './CodeEditor.style.css';

interface CodeEditorWindowProps {
    problemId: number;
    codeTemplates: any;
    setActiveTab: (tab: string) => void;
    setTestCases: (testCases: any) => void;
}

function CodeEditorWindow({ problemId, codeTemplates, setActiveTab, setTestCases }: CodeEditorWindowProps) {
    const [code, setCode] = useState("");
    const [programmingLanguage, setProgrammingLanguage] = useState("cpp");
    const [lightMode, setLightMode] = useState(false);

    useEffect(() => {
        setCode(codeTemplates[programmingLanguage].starterCode);
    }, [programmingLanguage, codeTemplates]);

    const handleProgrammingLanguageChange = (event: any) => {
        const selectedLanguage = event.target.value;
        setProgrammingLanguage(selectedLanguage);
        setCode(codeTemplates[selectedLanguage].starterCode);
    };

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || "");
    }

    const handleResetCode = () => {
        setCode(codeTemplates[programmingLanguage].starterCode);
    }

    const handleSubmitSolution = () => {
        const submissionData = {
            code: code,
            programmingLanguage: programmingLanguage,
            problemId: problemId
        };
        
        setTestCases([]);
        setActiveTab("results");

        api.post(`/problems/submit`, submissionData)
            .then(response => {
                if(response.status === 200) {
                    setTestCases(response.data);
                } 
                else {
                    console.error("Submission failed with status:", response.status);
                }
            })
            .catch(error => {
                console.error("Submission failed:", error);
            });
    }

    return (
        <Box className="problem-editor-section">
            <Box className="problem-editor-header">
                <Typography variant="h6" className="problem-editor-title">
                    <EditNoteIcon />Code Editor
                </Typography>

                <Box display="flex" alignItems="center">
                    <Switch className='problem-editor-light-switch' color="default" checked={lightMode} onChange={() => setLightMode(!lightMode)} />
                    <SunnyIcon fontSize="small"
                                sx={{
                                    color: lightMode ? '#f5c518' : '#cfcfcf',
                                }} />
                </Box>
                
                <FormControl>
                    <Select
                        className='language-select'
                        labelId="language-select-label"
                        onChange={handleProgrammingLanguageChange}
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

                <Button className='reset-button' 
                        variant="outlined"
                        onClick={() => handleResetCode()}
                        >
                    Reset
                </Button>
            </Box>

            <Box className="problem-editor-container">
                <Editor theme={lightMode ? "light" : "vs-dark"}
                    height="100%"
                    language={programmingLanguage}
                    value={code}
                    defaultLanguage="cpp"
                    onChange={handleEditorChange}
                    options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        padding: { top: 8 },
                        automaticLayout: true
                    }}/>
            </Box>

            <Box className="problem-editor-footer">
                <Button variant="outlined" 
                        className='problem-submit-button'
                        onClick={() => handleSubmitSolution()}>
                    Submit
                </Button>
            </Box>
        </Box>
    );
}

export default CodeEditorWindow;