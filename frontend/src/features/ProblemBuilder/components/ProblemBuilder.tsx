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
import { type ProblemBuilderDTO } from './interfaces';
import { useNavigate, useParams } from 'react-router-dom';
import ConstructionIcon from '@mui/icons-material/Construction';

function ProblemBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [activeTab, setActiveTab] = useState("markdown");

    // Problem data states
    const [description, setDescription] = useState("# Problem Description\n\nWrite your problem description here...");
    const [programmingLanguage, setProgrammingLanguage] = useState("cpp");
    const [starterCode, setStarterCode] = useState({ "cpp": "", "python": "" });
    const [driverCode, setDriverCode] = useState({ "cpp": "", "python": "" });
    const [testCases, setTestCases] = useState<ITestCase[]>([]);
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    useEffect(() => {
        setStarterCode({
            cpp: `// ======= IMPORTANT =======
// Starter Code is the code that will be visible to the user when they start solving the problem.

// The code below is just a template. You can change the function signature and the logic as per your problem requirements.
// ===========================

int solve(vector<int>& nums) {
    // Write your logic here
    return 0;
}`,
            python: `# ======= IMPORTANT =======
# Starter Code is the code that will be visible to the user when they start solving the problem.

# The code below is just a template. You can change the function signature and the logic as per your problem requirements.
# ===========================

def solve(nums):
    # Write your logic here
    return 0`
        });

        setDriverCode({
            cpp: `// ======= IMPORTANT =======
// Driver Code is the code that will be used to run the test cases. It should call the function that the user is supposed to implement in Starter Code.
// !!!! Make sure to add the marker {{CODE}} in the appropriate place in the driver code. This is where the user's code will be injected. !!!!

// The code below is just a template. You can change the function signature and the logic as per your problem requirements.
// ===========================

#include <iostream>
#include <vector>

using namespace std;

{{CODE}}

int main() {
    int n;
    cin >> n;
    vector<int> nums(n);
    for(int i = 0; i < n; i++) {
        cin >> nums[i];
    }

    cout << solve(nums) << endl;

    return 0;
}`,
            python: `# ======= IMPORTANT =======
# Driver Code is the code that will be used to run the test cases. It should call the function that the user is supposed to implement in Starter Code.
# !!!! Make sure to add the marker {{CODE}} in the appropriate place in the driver code. This is where the user's code will be injected. !!!!

# The code below is just a template. You can change the function signature and the logic as per your problem requirements.
# ===========================

{{CODE}}

if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    print(solve(nums))
`
        });
        }, []);

    useEffect(() => {
        if(isEditMode) {

            api.get(`/problems/${id}/description`)
                .then(response => {
                    const data = response.data;

                    setTitle(data.title);
                    setDescription(data.description);
                    setDifficulty(data.difficulty);
                    setTags(data.tags);

                    const codeTemplates = JSON.parse(data.codeTemplates);
                    setStarterCode({
                        cpp: codeTemplates.cpp.starterCode,
                        python: codeTemplates.python.starterCode
                    });
                    setDriverCode({
                        cpp: codeTemplates.cpp.driverCode,
                        python: codeTemplates.python.driverCode
                    });
                })
                .catch(error => {
                    console.error('Error fetching problem description:', error);
                });

            api.get(`/problems/testcases?problemId=${id}`)
                .then(response => {
                    const data = response.data;
                    for(let testCase of data) {
                        testCase.input = testCase.input.replace(/\\n/g, '\n');
                        testCase.output = testCase.output.replace(/\\n/g, '\n');
                    }
                    console.log("Fetched test cases:", data);
                    setTestCases(data);
                })
                .catch(error => {
                    console.error('Error fetching problem test cases:', error);
                });
        }
    }, [id, isEditMode]);

    const handleSubmitProblem = () => {
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
        };
        
        if(isEditMode) {
            api.put(`/problems/edit/${id}`, problemData)
                .then(response => {
                    if(response.status === 200) {
                        notify("Problem updated successfully!", "success");
                        navigate("/dashboard");
                    }
                    else {
                        notify("Failed to update problem. Please try again.", "error");
                    }
                })
                .catch(error => {
                    console.error('Error updating problem:', error);
                });
        }
        else {
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