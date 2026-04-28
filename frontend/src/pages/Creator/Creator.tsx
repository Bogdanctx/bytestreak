import {
    Box,
    Typography,
    Button,
    Divider,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Avatar
} from "@mui/material";
import "./Creator.style.css";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProtectedAccount } from "../../context/AccountContext";
import { type IProblem } from "../../entities";
import { api } from "../../api";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';


function Creator() {
    const navigate = useNavigate();
    const [problems, setProblems] = useState<IProblem[]>([]);
    const { account } = useProtectedAccount();

    const fetchCreatedProblems = async () => {
        console.log("Fetching problems for creator with ID:", account.id);

        api.get(`/creator/problems?creatorId=${account.id}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log("Problems fetched successfully:", response.data);
                    setProblems(response.data);
                } 
            })
            .catch((error) => {
                console.error("Error fetching problems:", error);
            });
    }

    const handleDeleteProblem = (problemId: number) => {
        if (window.confirm("Are you sure you want to delete this problem? This action cannot be undone.")) {
            api.delete(`/creator/problems/${problemId}`)
                .then((response) => {
                    if (response.status === 200) {
                        alert("Problem deleted successfully.");
                        fetchCreatedProblems(); // Refresh the list after deletion
                    } else {
                        alert("Failed to delete problem. Please try again.");
                    }
                })
                .catch((error) => {
                    console.error("Error deleting problem:", error);
                    alert("An error occurred while deleting the problem. Please try again.");
                });
        }
    } 

    useEffect(() => {
        fetchCreatedProblems();
    }, []);

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'EASY': return '#23CE6B';
            case 'MEDIUM': return '#E7BB41';
            case 'HARD': return '#FF4444';
            default: return '#fff';
        }
    };

    return (
        <Box className="creator-page">
            <Box className="creator-page-header">
                <Box>
                    <Typography className="creator-page-header-title" variant="h6">Overview</Typography>
                    <Typography className="creator-page-header-description" variant="body1">Manage your coding challanges.</Typography>
                </Box>
            </Box>

            <Divider orientation="horizontal" sx={{ borderColor: "#2d2d2d", width: "90%", margin: "auto" }} />

            <Box className="creator-page-content">
                <TableContainer className="creator-table-container" component={Paper}>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell className="creator-table-header-cell">TITLE</TableCell>
                                <TableCell className="creator-table-header-cell">DIFFICULTY</TableCell>
                                <TableCell className="creator-table-header-cell" align="right">ACTIONS</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {problems.map((problem) => (
                                <TableRow key={problem.id} onClick={() => navigate(`/problems/${problem.id}/description`)} className="creator-table-row">
                                    <TableCell className="creator-table-cell">
                                        <Typography variant="body1">
                                            {problem.title}
                                        </Typography>
                                    </TableCell>
                                    
                                    <TableCell className="creator-table-cell">
                                        <Typography display={"inline-block"}
                                                    color={getDifficultyColor(problem.difficulty)} 
                                                    border={`1px solid ${getDifficultyColor(problem.difficulty)}`}
                                                    borderRadius={"4px"}
                                                    padding={"2px 4px"}
                                                    fontSize={"0.75rem"}
                                        >
                                            {problem.difficulty}
                                        </Typography>
                                    </TableCell>
                                    
                                    <TableCell className="creator-table-cell">
                                        <Box display="flex" justifyContent={"flex-end"} gap={1}>
                                            <Button variant="outlined"
                                                    startIcon={<EditIcon sx={{ color: "#E7BB41" }} />} 
                                                    className="creator-table-action-button"
                                                    onClick={(event) => { event.stopPropagation(); navigate(`/creator/edit/${problem.id}`); }}
                                                    sx={{ color: "white" }}>
                                                Edit
                                            </Button>
                                            <Button variant="outlined"
                                                    color="error"
                                                    startIcon={<DeleteIcon />}
                                                    className="creator-table-action-button creator-table-delete-button"
                                                    onClick={(event) => { event.stopPropagation(); handleDeleteProblem(problem.id); }}
                                            >
                                                Delete
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            <Box className="creator-page-footer">
                <Box display="flex" alignItems="center" gap={2}>
                    <Avatar src={account?.profilePictureUrl} sx={{ width: 48, height: 48, border: "2px solid #23CE6B" }} />
                    <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle1" color="white" fontWeight="600" lineHeight="1">
                            {account.username}
                        </Typography>
                        <Typography variant="caption" color="#888">
                            {problems.length} {problems.length === 1 ? 'problem' : 'problems'} created
                        </Typography>
                    </Box>
                </Box>

                <Button className="creator-page-create-new" variant="outlined" startIcon={<AddIcon />} onClick={() => navigate("/creator/new") }>
                    Create new
                </Button>
            </Box>
        </Box>
    )
}

export default Creator;