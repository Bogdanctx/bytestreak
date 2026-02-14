import {
    Box,
    Typography,
    Button,
    Divider
} from "@mui/material";
import "./Creator.style.css";
import AddIcon from '@mui/icons-material/Add';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAccountContext } from "../../context/AccountContext";
import { type Problem } from "../../entities";
import { api } from "../../api";

function Creator() {
    const navigate = useNavigate();
    const [fetching, setFetching] = useState(false);
    const [problems, setProblems] = useState<Problem[]>([]);
    const { account } = useAccountContext();

    if (!account) {
        return (
            <Box className="creator-page">
                <Typography variant="h6" color="error">You need to be logged in to access this page.</Typography>
            </Box>
        )
    }

    const fetchCreatedProblems = async () => {
        if (fetching) {
            return;
        }

        setFetching(true);
    
        api.get(`/creator/problems?creator_id=${account.accountId}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log("Problems fetched successfully:", response.data.problems);
                    setProblems(response.data.problems);
                } 
                else {
                    console.error("Failed to fetch problems. Status code:", response.status);
                }
            })
            .catch((error) => {
                console.error("Error fetching problems:", error);
            })
            .finally(() => {
                setFetching(false);
            })
        
        setFetching(false);
    }

    useEffect(() => {
        fetchCreatedProblems();

    }, []);

    if (!account) {
        return (
            <Box className="creator-page">
                <Typography variant="h6" color="error">You need to be logged in to access this page.</Typography>
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
                <Button variant="outlined" 
                        color="primary"
                        startIcon={<AddIcon />}
                        className="creator-page-create-new"
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