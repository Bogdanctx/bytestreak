import {
    Box,
    Button,
    Tabs,
    Tab,
    FormControl,
    Select,
    MenuItem
} from '@mui/material';
import { useState } from 'react';
import './ProblemBuilder.style.css';
import Editor from '@monaco-editor/react';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import PublishIcon from '@mui/icons-material/Publish';
import TestCasesTab from './components/TestCasesTab';
import { type TestCase } from './interfaces';

function ProblemBuilder() {
    const [activeTab, setActiveTab] = useState("markdown");
    const [problemDescription, setProblemDescription] = useState("# Problem Description\n\nWrite your problem description here...");
    const [programmingLanguage, setProgrammingLanguage] = useState("cpp");
    const [starterCode, setStarterCode] = useState({});
    const [driverCode, setDriverCode] = useState({});
    const [testCases, setTestCases] = useState<TestCase[]>([]);


    const handleCreateNewProblem = () => {
        
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

    return (
        <Box className="problem-builder-container">

            <Box className="problem-builder-main">
                <Box className="problem-builder-header">
                    <Box display="flex" alignItems="center" gap={2}>
                        <Tabs value={activeTab} 
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

                    {activeTab === "testcases" && ( <TestCasesTab testCases={testCases} setTestCases={setTestCases} /> )}
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