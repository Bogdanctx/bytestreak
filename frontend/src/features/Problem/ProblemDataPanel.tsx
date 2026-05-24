import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Typography } from '@mui/material';

import ProblemDescription from './ProblemDescription/ProblemDescription';
import SubmissionResults from './SubmissionResults/SubmissionResults';
import { type IProblem, type ISubmissionResult } from '../../types/problem.types';
import ProblemSubmissions from './ProblemSubmissions/ProblemSubmissions';
import './ProblemDataPanel.style.css';
import AccountAvatar from '../../components/ui/AccountAvatar';

interface ProblemDataPanelProps {
    problem: IProblem;
    activeTab: string;
    setActiveTab: (tab: string) => void;
    results: ISubmissionResult[];
    panelWidth: number;
}

function ProblemDataPanel({ problem, activeTab, setActiveTab, results, panelWidth }: ProblemDataPanelProps) {
    const navigate = useNavigate();

    // To do: add like/dislike functionality, and display the number of likes/dislikes for the problem

    return (
        <Box className="problem-data-panel-container" sx={{ flexBasis: `${panelWidth}px` }}>
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
            {activeTab === "submissions" && <ProblemSubmissions problemId={problem.id} />}
            {activeTab === "results" && <SubmissionResults results={results} />}

            <Box className="problem-footer">
                <Box display={"flex"} alignItems={"center"}>
                    <Button className='problem-data-feedback-button'>
                        <ThumbUpIcon className='problem-data-feedback-icon' fontSize="small" />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {problem.likes}
                        </Typography>
                    </Button>

                    <Button className='problem-data-feedback-button'>
                        <ThumbDownIcon className='problem-data-feedback-icon' fontSize="small" />
                        <Typography variant="body2" sx={{ ml: 0.5 }}>
                            {problem.dislikes}
                        </Typography>
                    </Button>
                </Box>

                <Box display={"flex"} alignItems={"center"} marginLeft={"auto"} >
                    <Typography variant="body2" sx={{ mr: 0.5 }}>
                        Created by
                    </Typography>
                    <Typography id="problem-data-panel-problem-creator"
                                variant="body2" 
                                onClick={() => navigate(`/accounts/profile/${problem.creator.username}`)}>
                    {problem.creator.username}
                    </Typography>
                    <Box ml={1}>
                        <AccountAvatar avatarUrl={problem.creator.profilePictureUrl} cssEffectStyle={problem.creator.cssEffectStyle} width={20} height={20} />
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

export default ProblemDataPanel;