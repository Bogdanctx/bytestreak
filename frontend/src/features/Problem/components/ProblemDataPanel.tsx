import { 
    Box
} from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ProblemDescription from "./ProblemDescription";
import './ProblemDataPanel.style.css';

interface ProblemDataPanelProps {
    problem: any;
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

function ProblemDataPanel({ problem, activeTab, setActiveTab }: ProblemDataPanelProps) {
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
            </Box>

            {activeTab === "description" && <ProblemDescription problem={problem} />}

            <Box className="problem-footer">
                footer
            </Box>
        </Box>
    )
}

export default ProblemDataPanel;