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
    TableBody
} from "@mui/material";
import "./Creator.style.css";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccountContext } from "../../context/AccountContext";
import { type IProblem } from "../../entities";
import { api } from "../../api";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { IconButton, Tooltip } from "@mui/material";


function Creator() {
    const navigate = useNavigate();
    const [problems, setProblems] = useState<IProblem[]>([]);
    const { account } = useAccountContext();

    if (!account) {
        return (
            <Box className="creator-page">
                <Typography variant="h6" color="error">You need to be logged in to access this page.</Typography>
            </Box>
        )
    }

    const fetchCreatedProblems = async () => {
        // Safety check
        if (!account) return; 

        console.log("Fetching problems for creator with ID:", account.id);

        // FIX 1: Use account.accountId (not account.id)
        api.get(`/creator/problems?creatorId=${account.id}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log("Problems fetched successfully:", response.data);
                    // FIX 2: Set response.data directly (it's already the list)
                    setProblems(response.data);
                } 
            })
            .catch((error) => {
                console.error("Error fetching problems:", error);
            });
    }

    useEffect(() => {
        if (account) {
            fetchCreatedProblems();
        }
        // FIX 3: Add account to dependency array so it runs when user loads
    }, [account]);

    if(problems === null) {
        return (
            <Box className="creator-page">
                <Box className="creator-page-header">
                    <Box>
                        <Typography className="creator-page-header-title" variant="h6">Overview</Typography>
                        <Typography className="creator-page-header-description" variant="body1">Manage and track the performance of your coding challanges.</Typography>
                    </Box>
                    <Button variant="outlined" 
                            color="primary"
                            startIcon={<AddIcon />}
                            className="creator-page-create-new"
                            onClick={() => navigate("/creator/new") }
                    >Create new</Button>
                </Box>

                <Divider orientation="horizontal" sx={{ borderColor: "#2d2d2d", width: "90%", margin: "auto" }} />
                
                <Box className="creator-page-content">
                    <Typography variant="body1" color="#888" textAlign="center" mt={4}>You haven't created any problems yet. Click the "Create new" button to get started!</Typography>
                </Box>
            </Box>
        )
    }

    return (
        <Box className="creator-page">
            <Box className="creator-page-header">
                <Box>
                    <Typography className="creator-page-header-title" variant="h6">Overview</Typography>
                    <Typography className="creator-page-header-description" variant="body1">Manage and track the performance of your coding challanges.</Typography>
                </Box>
                <Button className="creator-page-create-new" 
                        variant="outlined" 
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/creator/new") }
                >Create new</Button>
            </Box>

            <Divider orientation="horizontal" sx={{ borderColor: "#2d2d2d", width: "90%", margin: "auto" }} />
            
            <Box className="creator-page-content">
                
            </Box>
        </Box>
    )
}

export default Creator;