import {
    Box,
    Typography,
    Button,
    Popover,
    Switch,
    Select,
    MenuItem,
    FormControl
} from '@mui/material';
import MarkdownRenderer from '../../components/MarkdownRenderer/MarkdownRenderer';
import './Problem.style.css';
import Editor from '@monaco-editor/react';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SunnyIcon from '@mui/icons-material/Sunny';
import { api } from '../../api';

function Problem() {
    const { id } = useParams<{ id: string }>();
    const [problem, setProblem] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("description");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [lightMode, setLightMode] = useState(false);
    const [programmingLanguage, setProgrammingLanguage] = useState("cpp");
    const [code, setCode] = useState("");

    useEffect(() => {
        api.get(`/problems/${id}/description`)
            .then(response => {
                response.data.tags = response.data.tags.split(',');
                response.data.starterCode = response.data.starterCode.replace(/\\n/g, '\n');

                setProblem(response.data);
                setCode(response.data.starterCode); 
            })
            .catch(error => {
                console.error("Error fetching problem data:", error);
            });
    }, [id]);

    if (!problem) {
        return <Typography>Loading...</Typography>;
    }

    const handleProgrammingLanguageChange = (event: any) => {
        const selectedLanguage = event.target.value;
        setProgrammingLanguage(selectedLanguage);
    };

    const handleSubmitSolution = () => {
        const submissionData = {
            code: code,
            programmingLanguage: programmingLanguage,
            problemId: id
        };

        api.post(`/problems/submit`, submissionData)
            .then(response => {
                // Handle successful submission (e.g., show results, update UI)
                console.log("Submission successful:", response.data);
            })
            .catch(error => {
                // Handle submission error (e.g., show error message)
                console.error("Submission failed:", error);
            });
    }

    const handleEditorChange = (value: string | undefined) => {
        setCode(value || "");
    }

    const handleResetCode = () => {
        // Reset code logic here...
    }

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
                            <MenuItem className='language-select-item' value={"python"}>Python</MenuItem>
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
                            onClick={() => handleSubmitSolution() }>
                        Submit
                    </Button>
                </Box>
            </Box>
            
        </Box>
    )
}

export default Problem;