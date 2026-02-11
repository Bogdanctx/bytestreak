import { 
    Box, 
    Button, 
    Popover, 
    Typography 
} from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { useState } from "react";
import MarkdownRenderer from "../../../components/MarkdownRenderer/MarkdownRenderer";
import './ProblemDescription.style.css';

interface ProblemDescriptionProps {
    problem: any;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

function ProblemDescription({ problem, activeTab, setActiveTab }: ProblemDescriptionProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const getDifficultyColorClass = (diff: string) => {
        switch(diff) {
            case "EASY": return "diff-easy";
            case "MEDIUM": return "diff-medium";
            case "HARD": return "diff-hard";
            default: return "";
        }
    };

    return (
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
                                <Box key={index}>
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
    )
}

export default ProblemDescription;