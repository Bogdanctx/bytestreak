import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { type IAccount, type AccountRole } from "../../../../types/account.types";
import { useState } from "react";

import './UserCard.style.css';

interface IUserRowProps {
    user: IAccount;
    onDeleteClick: (user: IAccount) => void;
    onRoleChangeClick: (user: IAccount, newRole: AccountRole) => void;
    navigate: ReturnType<typeof useNavigate>;
}

function UserRow({ user, onDeleteClick, onRoleChangeClick, navigate }: IUserRowProps) {
    const [selectedRole, setSelectedRole] = useState(user.role);

    const handleRoleChange = (newRole: AccountRole) => {
        setSelectedRole(newRole);

        if (newRole !== user.role) {
            onRoleChangeClick(user, newRole);
        }
    };

    return (
        <Box className="user-card" onClick={() => navigate(`/accounts/profile/${user.username}`)}>
            <Box className="user-info">
                <Typography className="user-username">{user.username}</Typography>
                <Typography className="user-email">{user.email}</Typography>
            </Box>
            <Box className="user-stats">
                <Typography className="user-stat">Level: {Math.floor(user.currentXP / 1000) + 1}</Typography>
                <Typography className="user-stat">Problems Solved: {user.codingProblemsSolved}</Typography>
                <Typography className="user-stat">Quizzes Solved: {user.quizzesSolved}</Typography>
            </Box>
            <Box className="user-actions" onClick={(e) => e.stopPropagation()}>
                <Select
                    id={`user-role-select-${user.id}`}
                    size="small"
                    value={selectedRole}
                    onChange={(e) => handleRoleChange(e.target.value)}
                    className="user-role-select"
                >
                    <MenuItem value="USER">USER</MenuItem>
                    <MenuItem value="CREATOR">CREATOR</MenuItem>
                    <MenuItem value="MODERATOR">MODERATOR</MenuItem>
                </Select>
                
                <Typography className="user-role-display">{user.role}</Typography>
                
                <Button
                    size="small"
                    color="error"
                    onClick={() => onDeleteClick(user)}
                    className="user-delete-button"
                >
                    Delete account
                </Button>
            </Box>
        </Box>
    );
}

export default UserRow; 
