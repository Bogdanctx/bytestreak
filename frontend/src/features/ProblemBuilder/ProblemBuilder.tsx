import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import ConstructionIcon from '@mui/icons-material/Construction';
import PublishIcon from '@mui/icons-material/Publish';
import { Box, Button, FormControl, MenuItem, Select, Tab, Tabs } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../api';
import notify from '../../components/ui/ToastNotification';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import { type IProblemCreateDTO, type ITestCase } from '../../types/problem.types';
import MetadataTab from './MetadataTab/MetadataTab';
import TestCasesTab from './TestCasesTab/TestCasesTab';
import './ProblemBuilder.style.css';
import { useMutation } from '@tanstack/react-query';
import ValidationTab from './ValidationScriptTab/ValidationScriptTab';

const DEFAULT_STARTER_CODE = {
    cpp: `// ======= STARTER CODE =======
// >> This code is the template the user will see in their editor <<
// >> Define the function signature that the user is expected to implement <<
// >> Any libraries that the user needs to import must be included in this starter code <<
// >> Make sure to match the function signature exactly, as the driver code relies on it << 
// >> The code below is just a placeholder and should be replaced with the actual function signature <<
// ===============================

int solve(vector<int>& nums) {
    int sum = 0;
    for(int i: nums) {
        sum += i;
    }
    return sum;
}`,
    python: `# ======= STARTER CODE =======
# >> This code is the template the user will see in their editor <<
# >> Define the function signature that the user is expected to implement <<
# >> Any libraries that the user needs to import must be included in this starter code <<
# >> Make sure to match the function signature exactly, as the driver code relies on it << 
# >> The code below is just a placeholder and should be replaced with the actual function signature <<
# ===============================

def solve(nums):
    sum = 0
    for i in nums:
        sum += i
    return sum`
};

const DEFAULT_DRIVER_CODE = {
    cpp: `// ======= DRIVER CODE =======
// >> This code must use the function signature defined in the starter code to call the user's solution <<
// >> The user's solution (Starter Code) will be automatically injected at this exact position <<
// >> You can write code here to read input, call the solve function, and print output for testing <<
// >> Input is read from standard input and output is printed to standard output <<
// >> The code below is just an example. You may include any necessary headers and write any logic needed to test the user's solution. <<
// ===============================

#include <iostream>
#include <vector>
using namespace std;

// << This marker is mandatory and indicates where the user's code will be injected >>
{{CODE}}

int main() {
    // Logic for reading the input and calling the solve function
    int n;
    cin >> n;
    vector<int> nums(n);
    for (int i = 0; i < n; i++) {
        cin >> nums[i];
    }
    int result = solve(nums);
    cout << result << endl;
    return 0;
}`,
    python: `# ======= DRIVER CODE =======
# >> This code must use the function signature defined in the starter code to call the user's solution <<
# >> The user's solution (Starter Code) will be automatically injected at this exact position <<
# >> You can write code here to read input, call the solve function, and print output for testing <<
# >> Input is read from standard input and output is printed to standard output <<
# >> The code below is just an example. You may write any logic needed to test the user's solution. <<
# ===============================

# << This marker is mandatory and indicates where the user's code will be injected >>
{{CODE}}

if __name__ == "__main__":
    # Logic for reading the input and calling the solve function
    n = int(input())
    nums = list(map(int, input().split()))
    result = solve(nums)
    print(result)`
};

const DEFAULT_VALIDATION_CODE = `
import sys

raw_data = sys.stdin.read().split("@@@USER_OUTPUT@@@")

original_input = raw_data[0]
user_output = raw_data[1]

def check_logic(original_input, user_output):
    # Parse original_input and user_output as needed
    # Implement the logic to check if user_output is a valid solution for the given original_input
    # Return True if valid, False otherwise
    return True  # Placeholder return value

is_valid = check_logic(original_input, user_output)

if is_valid:
    print("True")
else:
    print("False")
`

type ProgrammingLanguage = "cpp" | "python";
type CodeTemplateMap = Record<ProgrammingLanguage, string>;

function ProblemBuilder() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("markdown");

    const [programmingLanguage, setProgrammingLanguage] = useState<ProgrammingLanguage>("cpp");
    const [starterCode, setStarterCode] = useState<CodeTemplateMap>(DEFAULT_STARTER_CODE);
    const [driverCode, setDriverCode] = useState<CodeTemplateMap>(DEFAULT_DRIVER_CODE);
    const [validationCode, setValidationCode] = useState(DEFAULT_VALIDATION_CODE);
    const [validationTabActive, setValidationTabActive] = useState(validationCode !== DEFAULT_VALIDATION_CODE);
    
    const [description, setDescription] = useState("# Problem Description\n\nWrite your problem description here...");
    const [testCases, setTestCases] = useState<ITestCase[]>([]);
    const [title, setTitle] = useState("");
    const [difficulty, setDifficulty] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const isEditMode = Boolean(id);

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
            setDifficulty(data.difficulty);
            setTags(data.tags);

            const parsedTemplates = JSON.parse(data.codeTemplates);

            setStarterCode({
                cpp: parsedTemplates.cpp.starter_code,
                python: parsedTemplates.python.starter_code
            });

            setDriverCode({
                cpp: parsedTemplates.cpp.driver_code,
                python: parsedTemplates.python.driver_code
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

    const submitCodingProblemMutation = useMutation({
        mutationFn: async (problemData: IProblemCreateDTO) => {
            if (isEditMode) {
                const response = await api.put(`/creator/edit-problem/${id}`, problemData);
                return response.data;
            } 
            else {
                const response = await api.post('/creator/new-problem', problemData);
                return response.data;
            }
        },
        onSuccess: () => {
            if (isEditMode) {
                notify("Problem updated successfully!", "success");
            }
            else {
                notify("Problem created successfully!", "success");
                navigate("/creator");
            }
        },
        onError: (error) => {
            console.error('Error saving problem:', error);
            notify("Failed to save problem. Please try again.", "error");
        }
    });

    const handleSubmitProblem = async () => {
        if (!title || !difficulty || tags.length === 0 || testCases.length === 0) {
            notify("Please fill out all required fields (Title, Difficulty, Tags, Test Cases).", "error");
            return;
        }

        if (validationTabActive) {
            if (!validationCode) {
                notify("Validation script cannot be empty if the Validation Script tab is active.", "error");
                return;
            }
            if (!validationCode.includes("@@@USER_OUTPUT@@@")) {
                notify("Validation script must include the marker '@@@USER_OUTPUT@@@' to separate original input and user output.", "error");
                return;
            }
            if (!validationCode.includes("def check_logic")) {
                notify("Validation script must define a function named 'check_logic' that takes original_input and user_output as parameters.", "error");
                return;
            }
            if (!validationCode.includes("print(\"True\")") || !validationCode.includes("print(\"False\")")) {
                notify("Validation script must print 'True' if the user's solution is valid and 'False' otherwise.", "error");
                return;
            }
            if (validationCode === DEFAULT_VALIDATION_CODE) {
                notify("Please customize the validation script or disable the Validation Script tab.", "error");
                return;
            }
        }


        const codeTemplates = {
            cpp: { starter_code: starterCode.cpp, driver_code: driverCode.cpp },
            python: { starter_code: starterCode.python, driver_code: driverCode.python }
        };

        const problemData: IProblemCreateDTO = {
            title,
            description,
            difficulty: difficulty as "EASY" | "MEDIUM" | "HARD",
            codeTemplates: JSON.stringify(codeTemplates),
            testCases: testCases,
            tags: tags,
            validationScript: validationTabActive ? validationCode : undefined
        };
        
        submitCodingProblemMutation.mutate(problemData);
    }

    const handleEditorChange = (value: string | undefined) => {
        if (!value) {
            return;
        }

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

    const handleChangeActiveTab = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, newValue: string) => {
        event.stopPropagation();

        if (activeTab === "validation" && newValue !== "validation") {
            if (validationCode === DEFAULT_VALIDATION_CODE) {
                setValidationTabActive(false);
            }
        }

        setActiveTab(newValue);
    }

    return (
        <Box className="problem-builder-container">

            <Box className="problem-builder-main">
                {/* Header */}
                <Box className="problem-builder-header">
                    <Box className="problem-builder-header-left">
                        <Tabs value={activeTab} className="problem-builder-tabs">
                            <Tab className='problem-builder-tab' label="Markdown" value="markdown" onClick={(event) => handleChangeActiveTab(event, "markdown") } />
                            <Tab className='problem-builder-tab' label="Starter code" value="starter-code" onClick={(event) => handleChangeActiveTab(event, "starter-code")} />
                            <Tab className='problem-builder-tab' label="Driver code" value="driver-code" onClick={(event) => handleChangeActiveTab(event, "driver-code")} />
                            <Tab className='problem-builder-tab' label="Test Cases" value="testcases" onClick={(event) => handleChangeActiveTab(event, "testcases")} />
                            <Tab className='problem-builder-tab' label="Metadata" value="metadata" onClick={(event) => handleChangeActiveTab(event, "metadata")} />
                            {validationTabActive && 
                                <Tab className='problem-builder-tab' label="Validation script" value="validation" onClick={(event) => handleChangeActiveTab(event, "validation")} />
                            }
                        </Tabs>

                        {(activeTab === "starter-code" || activeTab === "driver-code") && (
                            <FormControl>
                                <Select
                                    className='language-select'
                                    labelId="language-select-label"
                                    onChange={(event) => { setProgrammingLanguage(event.target.value); console.log(`Selected: ${event.target.value}`) }}
                                    value={programmingLanguage}
                                    label="C++"
                                    MenuProps={{ PaperProps: { className: 'language-select-menu-paper' } }}
                                >
                                    <MenuItem className='language-select-item' value={"cpp"}>C++</MenuItem>
                                    <MenuItem className='language-select-item' value={"python"}>Python</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    </Box>

                    {isEditMode ? (
                        <Button className="problem-builder-submit-button"
                            variant='outlined'
                            onClick={() => handleSubmitProblem()}
                        >
                            <ConstructionIcon className="problem-builder-submit-icon" />
                            Update
                        </Button>
                    ) : (
                        <Button className="problem-builder-submit-button"
                            variant='outlined'
                            onClick={() => handleSubmitProblem()}
                        >
                            <PublishIcon className="problem-builder-submit-icon" />
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
                                                                setTitle={setTitle} setDifficulty={setDifficulty} setTags={setTags} 
                                                                setValidationTabActive={setValidationTabActive}
                                                                isValidationTabActive={validationTabActive}
                                                                /> )}

                    {activeTab === "validation" && (
                        <ValidationTab validationCode={validationCode} setValidationCode={setValidationCode} />
                    )}
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