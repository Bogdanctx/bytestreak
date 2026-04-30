import {
    Box,
    Button,
    Tabs,
    Tab,
    FormControl,
    Select,
    MenuItem
} from '@mui/material';
import { useState, useEffect } from 'react';
import './ProblemBuilder.style.css';
import Editor from '@monaco-editor/react';
import PublishIcon from '@mui/icons-material/Publish';
import TestCasesTab from './TestCasesTab';
import MetadataTab from './MetadataTab';
import { type ITestCase } from '../../../entities';
import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';
import MarkdownRenderer from '../../../components/MarkdownRenderer/MarkdownRenderer';
import { type IProblemCreateDTO } from '../../../types/problem.types';
import { useNavigate, useParams } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';

const DEFAULT_STARTER_CODE = {
    cpp: `// ======= IMPORTANT =======\n// Starter Code template...\n\nint solve(vector<int>& nums) {\n    return 0;\n}`,
    python: `# ======= IMPORTANT =======\n# Starter Code template...\n\ndef solve(nums):\n    return 0`
};

const DEFAULT_DRIVER_CODE = {
    cpp: `// ======= IMPORTANT =======\n// Driver Code template...\n\n#include <iostream>\n#include <vector>\nusing namespace std;\n\n{{CODE}}\n\nint main() {\n    return 0;\n}`,
    python: `# ======= IMPORTANT =======\n# Driver Code template...\n\n{{CODE}}\n\nif __name__ == "__main__":\n    pass`
};

type ProgrammingLanguage = "cpp" | "python";
type CodeTemplateMap = Record<ProgrammingLanguage, string>;

function ProblemBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [activeTab, setActiveTab] = useState("markdown");

    const [programmingLanguage, setProgrammingLanguage] = useState<ProgrammingLanguage>("cpp");
    const [starterCode, setStarterCode] = useState<CodeTemplateMap>(DEFAULT_STARTER_CODE);
    const [driverCode, setDriverCode] = useState<CodeTemplateMap>(DEFAULT_DRIVER_CODE);
    
    const [description, setDescription] = useState("# Problem Description\n\nWrite your problem description here...");
    const [testCases, setTestCases] = useState<ITestCase[]>([]);
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        if (!isEditMode) {
            return;
        }

        fetchProblemData();
    }, [id, isEditMode]);

    const fetchProblemData = async () => {
        try {
            const [codingProblemDescriptionResponse, testCasesResponse] = await Promise.all([
                api.get(`/problems/${id}/description`),
                api.get(`/problems/testcases?problemId=${id}`)
            ]);

            const data = codingProblemDescriptionResponse.data;
            setTitle(data.title);
            setDescription(data.description);
            setDifficulty(data.problemDifficulty);
            setTags(data.tags);

            const parsedTemplates = JSON.parse(data.codeTemplates);

            setStarterCode({
                cpp: parsedTemplates.cpp.starterCode,
                python: parsedTemplates.python.starterCode
            });

            setDriverCode({
                cpp: parsedTemplates.cpp.driverCode,
                python: parsedTemplates.python.driverCode
            });

            const formattedTestCases = testCasesResponse.data.map((testCase: any) => ({
                ...testCase,
                input: testCase.input.replace(/\\n/g, '\n'),
                output: testCase.output.replace(/\\n/g, '\n')
            }));
            setTestCases(formattedTestCases);

        } 
        catch (error) {
            console.error('Error fetching problem data:', error);
            notify("Failed to load problem data.", "error");
        }
    };

    const handleSubmitProblem = async () => {
        if (!title || !difficulty || tags.length === 0 || testCases.length === 0) {
            notify("Please fill out all required fields (Title, Difficulty, Tags, Test Cases).", "error");
            return;
        }

        const codeTemplates = {
            cpp: { starterCode: starterCode.cpp, driverCode: driverCode.cpp },
            python: { starterCode: starterCode.python, driverCode: driverCode.python }
        };

        const problemData: IProblemCreateDTO = {
            title,
            description,
            problemDifficulty: difficulty as "EASY" | "MEDIUM" | "HARD",
            codeTemplates: JSON.stringify(codeTemplates),
            testCases: JSON.stringify(testCases),
            tags: tags,
        };
        
        try {
            if (isEditMode) {
                const response = await api.put(`/creator/edit-problem/${id}`, problemData);

                if (response.status === 200) {
                    notify("Problem updated successfully!", "success");
                    navigate("/dashboard");
                }
            } 
            else {
                const response = await api.post('/creator/new-problem', problemData);

                if (response.status === 200) {
                    notify("Problem created successfully!", "success");
                    navigate("/dashboard");
                }
            }
        } 
        catch (error) {
            console.error('Error saving problem:', error);
            notify("Failed to save problem. Please try again.", "error");
        }
    }

    const handleEditorChange = (value: string | undefined) => {
        if (!value) return;

        if (activeTab === "markdown") {
            setDescription(value);
        } 
        else if (activeTab === "starter-code") {
            setStarterCode((prev) => ({ ...prev, [programmingLanguage]: value }));
        } 
        else if (activeTab === "driver-code") {
            setDriverCode((prev) => ({ ...prev, [programmingLanguage]: value }));
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
                                    style: { backgroundColor: 'var(--accent-main)' }
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
                                                backgroundColor: "var(--bg-4)",
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

                    {isEditMode ? (
                        <Button sx={{
                            backgroundColor: 'transparent',
                            color: 'white',
                            fontSize: '10px',
                            height: '25px',
                            marginRight: '16px',
                            borderColor: 'var(--accent-main)',
                            width: '80px',
                            ':hover': {
                                borderColor: 'var(--accent-hover)'
                            }
                        }}
                            variant='outlined'
                            onClick={() => handleSubmitProblem()}
                        >
                            <ConstructionIcon sx={{ fontSize: '16px' }} />
                            Update
                        </Button>
                    ) : (
                        <Button sx={{
                            backgroundColor: 'transparent',
                            color: 'white',
                            fontSize: '10px',
                            height: '25px',
                            marginRight: '16px',
                            borderColor: 'var(--accent-main)',
                            width: '80px',
                            ':hover': {
                                borderColor: 'var(--accent-hover)'
                            }
                        }}
                            variant='outlined'
                            onClick={() => handleSubmitProblem()}
                        >
                            <PublishIcon sx={{ fontSize: '16px' }} />
                            Submit
                        </Button>
                    )}
                </Box>

                {/* Content */}
                <Box className="problem-builder-content">
                    {activeTab === "markdown" && (
                        <Editor
                            height="100%"
                            theme='vs-dark'
                            defaultLanguage="markdown"
                            value={description}
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