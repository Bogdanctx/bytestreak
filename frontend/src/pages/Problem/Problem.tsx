import {
    Box,
    Typography,
    Button,
    Popover
} from '@mui/material';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import './Problem.style.css';
import Editor from '@monaco-editor/react';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const MOCK_PROBLEM = {
    "title": "Advanced Palindrome Analyzer",
    "difficulty": "MEDIUM",
    "tags": [
        "Math",
        "Number Theory",
        "Two Pointers",
        "Integer Manipulation",
        "Overflow Handling",
        "Algorithm Optimization"
    ],
    "description": `
Given an integer \`x\`, determine whether it is a palindrome **without converting the integer to a string**.

Additionally, extend the functionality with the following requirements:

1. Return an object with:
   - \`isPalindrome\`: boolean indicating whether \`x\` is a palindrome.
   - \`reversed\`: the reversed integer value of \`x\` (if overflow occurs during reversal, return 0).
   - \`digitCount\`: total number of digits in \`x\`.
   - \`halfReversed\`: the reversed value of only the second half of the digits (used for optimized palindrome checking).

2. Your algorithm must:
   - Run in **O(log10(n))** time.
   - Use **O(1)** extra space.
   - Avoid using string conversion.
   - Correctly handle negative numbers.
   - Correctly handle integer overflow when reversing.

---

### Examples

**Example 1:**
- **Input:** x = 1221
- **Output:**
  {
    isPalindrome: true,
    reversed: 1221,
    digitCount: 4,
    halfReversed: 12
  }

**Example 2:**
- **Input:** x = -121
- **Output:**
  {
    isPalindrome: false,
    reversed: -121,
    digitCount: 3,
    halfReversed: 12
  }

**Example 3:**
- **Input:** x = 10
- **Output:**
  {
    isPalindrome: false,
    reversed: 1,
    digitCount: 2,
    halfReversed: 0
  }

---

### Follow-Up Questions

1. Can you optimize the solution to stop reversing once half the digits are processed?
2. How would your solution change if the integer type were 64-bit?
3. What is the mathematical reasoning behind reversing only half of the digits?

---

### Constraints:
- -2^31 <= x <= 2^31 - 1
- Do not use built-in string conversion.
- If reversing causes overflow outside signed 32-bit integer range, return 0 for the reversed value.
    `,
};



function Problem() {
    const { id } = useParams<{ id: string }>();
    const [problem, setProblem] = useState<any>(MOCK_PROBLEM);
    const [activeTab, setActiveTab] = useState("description");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        // Fetch logic here...
    }, [id]);

    const getDifficultyColorClass = (diff: string) => {
        switch(diff) {
            case "EASY": return "diff-easy";
            case "MEDIUM": return "diff-medium";
            case "HARD": return "diff-hard";
            default: return "";
        }
    };

    return (
        <Box className="problem-page-container">
            <Box className="problem-description-panel">
                <Box className="problem-header-tabs">
                    <Box 
                        className={`problem-tab ${activeTab === "description" ? "active" : ""}`}
                        onClick={() => setActiveTab("description")}
                    >
                        <DescriptionIcon fontSize="small" /> Description
                    </Box>
                    <Box 
                        className={`problem-tab ${activeTab === "submissions" ? "active" : ""}`}
                        onClick={() => setActiveTab("submissions")}
                    >
                        <AccessTimeIcon fontSize="small" /> Submissions
                    </Box>
                </Box>

                <Box className="problem-content">
                    <Box className="problem-title-header">
                        <Typography variant="h4" className="problem-title">
                            {problem.title}
                        </Typography>
                    </Box>

                    <Box className="problem-meta-bar">
                        <Box className={`difficulty-chip ${getDifficultyColorClass(problem.difficulty)}`}>
                            {problem.difficulty}
                        </Box>
                        <Button 
                            className='problem-tags-button'
                            variant="outlined"
                            onClick={(e) => setAnchorEl(e.currentTarget)}
                        >
                            TAGS
                        </Button>
                        <Popover open={Boolean(anchorEl)}
                            anchorEl={anchorEl}
                            onClose={() => setAnchorEl(null)}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left'
                            }}
                            sx={{
                                '& .MuiPaper-root': {
                                    backgroundColor: 'transparent',
                                }
                            }}
                        >
                            <Box className="tags-popover-content">
                                {problem.tags.map((tag: string, index: number) => (
                                    <Box key={index} className="tag-chip">
                                        {tag}
                                    </Box>
                                ))}
                            </Box>
                        </Popover>
                    </Box>

                    <MarkdownRenderer content={problem.description} />
                    
                    <Box height="50px" /> 
                </Box>

                <Box className="problem-footer">
                    footer
                </Box>
            </Box>

            <Box className="problem-editor-section">
                <Editor theme="vs-dark"
                        className='problem-editor'
                        options={{
                            fontSize: 14,
                            minimap: {
                                enabled: false
                            },
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                            padding: {
                                top: 16
                            }
                        }}
                />
            </Box>
            
        </Box>
    )
}

export default Problem;