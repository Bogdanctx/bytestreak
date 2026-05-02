import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import { Box } from '@mui/material';

import ProblemDescription from './ProblemDescription';
import SubmissionResults from './SubmissionResults';
import { type IProblem, type ISubmissionResult } from '../../../types/problem.types';
import './ProblemDataPanel.style.css';

interface ProblemDataPanelProps {
    problem: IProblem;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    results: ISubmissionResult[];
}

function ProblemDataPanel({ problem, activeTab, setActiveTab, results }: ProblemDataPanelProps) {
    return (
        <Box className="problem-data-panel-container">
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
                <Box 
                    className={`problem-tab ${activeTab === "results" ? "active" : ""}`}
                    sx={{
                        ':hover': {
                            cursor: 'not-allowed',
                        }
                    }}
                >
                    <AccessTimeIcon fontSize="small" /> Results
                </Box>
            </Box>

            {activeTab === "description" && <ProblemDescription problem={problem} />}
            {activeTab === "results" && <SubmissionResults results={results} />}

            <Box className="problem-footer">
                footer
            </Box>
        </Box>
    )
}

export default ProblemDataPanel;