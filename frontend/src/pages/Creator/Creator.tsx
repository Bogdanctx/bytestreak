import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Box, Button, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

import { api } from '../../api';
import { useAccount } from '../../hooks/useAccount';
import { type IProblem } from '../../types/problem.types';
import './Creator.style.css';
import notify from '../../components/ui/ToastNotification';
import Loading from '../../components/ui/Loading';
import AccountAvatar from '../../components/ui/AccountAvatar';

function Creator() {
    const navigate = useNavigate();
    const { data: account } = useAccount();
    const queryClient = useQueryClient();
    const { data: createdProblems = [] } = useQuery<IProblem[]>({
        queryKey: ['createdProblems'],
        queryFn: async () => {
            if (!account) return [];

            const response = await api.get(`/creator/fetch-by-creator?creatorId=${account.id}`);
            return response.data;
        }
    });
    const deleteCodingProblemMutation = useMutation({
        mutationFn: async (problemId: number) => {
            return api.delete(`/creator/delete-problem?problemId=${problemId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['createdProblems'] });
            notify("Problem deleted successfully.", "success");
        },
        onError: (error) => {
            console.error("Error deleting problem:", error);
            notify("An error occurred while deleting the problem. Please try again.", "error");
        }
    });

    const handleDeleteProblem = async (problemId: number) => {
        if (window.confirm("Are you sure you want to delete this problem? This action cannot be undone.")) {
            deleteCodingProblemMutation.mutate(problemId);
        }
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'EASY': return '#23CE6B';
            case 'MEDIUM': return '#E7BB41';
            case 'HARD': return '#FF4444';
            default: return '#fff';
        }
    };

    if (!account) {
        return <Loading />;
    }

    return (
        <Box className="creator-container">
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
                            {createdProblems.map((problem) => (
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
                    <AccountAvatar avatarUrl={account.profilePictureUrl} cssEffectStyle={account.cssEffectStyle} width={42} height={42} />
                    <Box display="flex" flexDirection="column">
                        <Typography variant="subtitle1" color="white" fontWeight="600" lineHeight="1">
                            {account.username}
                        </Typography>
                        <Typography variant="caption" color="#888">
                            {createdProblems.length} {createdProblems.length === 1 ? 'problem' : 'problems'} created
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