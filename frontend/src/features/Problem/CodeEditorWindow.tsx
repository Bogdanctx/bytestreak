import { useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SunnyIcon from '@mui/icons-material/Sunny';
import { Box, Button, FormControl, MenuItem, Select, Switch, Typography } from '@mui/material';

import { api } from '../../api';
import { type ISolution, type ISubmissionResult } from '../../types/problem.types';
import './CodeEditor.style.css';
import { useMutation } from '@tanstack/react-query';
import notify from '../../components/ui/ToastNotification';

interface CodeEditorWindowProps {
    problemId: number;
    codeTemplates: { [key: string]: { starter_code: string } };
    setActiveTab: (tab: string) => void;
    setResults: (results: ISubmissionResult[]) => void;
}

function CodeEditorWindow({ problemId, codeTemplates, setActiveTab, setResults }: CodeEditorWindowProps) {
    const [code, setCode] = useState("");
    const [programmingLanguage, setProgrammingLanguage] = useState("cpp");
    const [lightMode, setLightMode] = useState(false);
    
    const submitSolutionMutation = useMutation({
        mutationFn: async (submissionData: ISolution) => {
            return api.post(`/problems/submit`, submissionData);
        },
        onSuccess: (response) => {
            setResults(response.data);
            notify("Submission successful!", "success");
        },
        onError: (error) => {
            console.log(error);
            notify("Submission failed. Please try again.", "error");
        }
    });

    useEffect(() => {
        setCode(codeTemplates[programmingLanguage].starter_code);
    }, [programmingLanguage]);

    const handleProgrammingLanguageChange = (event: any) => {
        const selectedLanguage = event.target.value;
        setProgrammingLanguage(selectedLanguage);
        setCode(codeTemplates[selectedLanguage].starter_code);
    };

    const handleSubmitSolution = () => {
        const submissionData: ISolution = {
            code: code,
            programmingLanguage: programmingLanguage,
            problemId: problemId,
        };
        
        setResults([]);
        setActiveTab("results");

        submitSolutionMutation.mutate(submissionData);
    }

    return (
        <Box className="problem-editor-section">
            <Box className="problem-editor-header">
                <Typography variant="h6" className="problem-editor-title">
                    <EditNoteIcon />Code Editor
                </Typography>

                <Box display="flex" alignItems="center">
                    <Switch className='problem-editor-light-switch' color="default" checked={lightMode} onChange={() => setLightMode(!lightMode)} />
                    <SunnyIcon fontSize="small" sx={{ color: lightMode ? '#f5c518' : '#cfcfcf' }} />
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

                <Button className='reset-button' variant="outlined" onClick={() => setCode(codeTemplates[programmingLanguage].starter_code)}>
                    Reset
                </Button>
            </Box>

            <Box className="problem-editor-container">
                <Editor theme={lightMode ? "light" : "vs-dark"}
                    height="100%"
                    language={programmingLanguage}
                    value={code}
                    defaultLanguage="cpp"
                    onChange={(value) => setCode(value || "")}
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