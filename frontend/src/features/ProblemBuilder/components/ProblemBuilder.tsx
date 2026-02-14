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
import { useAccountContext } from '../../../context/AccountContext';
import './ProblemBuilder.style.css';
import Editor from '@monaco-editor/react';
import PublishIcon from '@mui/icons-material/Publish';
import TestCasesTab from './TestCasesTab';
import MetadataTab from './MetadataTab';
import { type TestCase } from '../../../pages/Creator/interfaces';
import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';
import MarkdownRenderer from '../../../components/MarkdownRenderer/MarkdownRenderer';
import { type ProblemBuilderDTO } from './interfaces';

function ProblemBuilder() {
    const [activeTab, setActiveTab] = useState("markdown");
    const [description, setDescription] = useState("# Problem Description\n\nWrite your problem description here...");
    const [programmingLanguage, setProgrammingLanguage] = useState("cpp");
    const [starterCode, setStarterCode] = useState({
        "cpp": "",
        "python": ""
    });
    const [driverCode, setDriverCode] = useState({
        "cpp": "",
        "python": ""
    });
    const [testCases, setTestCases] = useState<TestCase[]>([]);

    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const { account } = useAccountContext();

    if (!account) {
        return <Box>Please log in to create a problem.</Box>;
    }

    const handleCreateNewProblem = () => {
        if(!title) {
            notify("Please provide a title for the problem.", "error");
            return;
        }
        if(!difficulty) {
            notify("Please select a difficulty level for the problem.", "error");
            return;
        }
        if(tags.length === 0) {
            notify("Please add at least one tag to the problem.", "error");
            return;
        }
        if (!description) {
            notify("Problem description cannot be empty.", "error");
            return;
        }
        if(!starterCode.cpp || !starterCode.python) {
            notify("Please provide a starting code in Starter Code tab.", "error");
            return;
        }
        if(!driverCode.cpp || !driverCode.python) {
            notify("Please provide a driver code in Driver Code tab.", "error");
            return;
        }
        if(testCases.length === 0) {
            notify("Please add at least one test case in Test Cases tab.", "error");
            return;
        }

        const codeTemplates = {
            cpp: {
                starterCode: starterCode.cpp,
                driverCode: driverCode.cpp
            },
            python: {
                starterCode: starterCode.python,
                driverCode: driverCode.python
            }
        };

        const problemData: ProblemBuilderDTO = {
            title,
            description,
            difficulty: difficulty as "EASY" | "MEDIUM" | "HARD",
            codeTemplates: JSON.stringify(codeTemplates), 
            testCases: JSON.stringify(testCases),
            tags: tags,
            creator: account
        };
        
        api.post('/problems/new', problemData)
            .then(response => {
                if(response.status === 200) {
                    notify("Problem created successfully!", "success");
                }
                else {
                    notify("Failed to create problem. Please try again.", "error");
                }
            })
            .catch(error => {
                console.error('Error creating problem:', error);
            });
    }

    const handleEditorChange = (value: string | undefined) => {
        if(activeTab === "markdown") {
            setDescription(value || "");
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
                {/* Header */}
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
                            <Tab className='problem-builder-tab' label="Metadata" value="metadata" onClick={() => setActiveTab("metadata")} />
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
                                    <MenuItem className='language-select-item' value={"python"}>Python</MenuItem>
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

                {/* Content */}
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
                            language={programmingLanguage}
                            defaultLanguage={programmingLanguage}
                            value={activeTab === "starter-code" ? starterCode[programmingLanguage] || "" : driverCode[programmingLanguage] || ""}
                            onChange={handleEditorChange}
                        />
                    )}

                    {activeTab === "testcases" && ( <TestCasesTab testCases={testCases} setTestCases={setTestCases} /> )}

                    {activeTab === "metadata" && ( <MetadataTab title={title} difficulty={difficulty} tags={tags}
                                                                setTitle={setTitle} setDifficulty={setDifficulty} setTags={setTags} /> )}
                </Box>
            </Box>

            {activeTab === "markdown" && (
                <Box className="problem-builder-markdown-preview">
                    <MarkdownRenderer content={description} />
                </Box>
            )}
        </Box>
    )
}

export default ProblemBuilder;