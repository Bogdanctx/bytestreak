import { useState, useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, TextField, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api';
import { type IAccount } from '../../../types/account.types';
import { useAccount } from '../../../hooks/useAccount';
import notify from '../../../components/ui/ToastNotification';
import UserCard from './UserCard/UserCard';

import './UsersManagement.style.css';



export default function UsersManagement() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [userToDelete, setUserToDelete] = useState<IAccount | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: account } = useAccount();

    const canDeleteUsers = account?.role === 'MODERATOR' || account?.role === 'ADMIN';
    const canSetRole = account?.role === 'ADMIN';

    const { data: users = [], isLoading } = useQuery<IAccount[]>({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await api.get('/accounts/fetch-accounts');
            return response.data.accounts;
        }
    });

    const filteredUsers = useMemo(() => {
        return users.filter(user =>
            user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [users, searchQuery]);

    const deleteUserMutation = useMutation({
        mutationFn: async (userId: number) => {
            const response = await api.delete(`/accounts/${userId}`);
            return response.data;
        },
        onSuccess: () => {
            notify('User deleted successfully!', 'success');
            setDeleteDialogOpen(false);
            setUserToDelete(null);
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: () => {
            notify('Failed to delete user', 'error');
        }
    });

    const setRoleMutation = useMutation({
        mutationFn: async ({ userId, role }: { userId: number; role: string }) => {
            const response = await api.put(`/accounts/${userId}/role`, { role });
            return response.data;
        },
        onSuccess: () => {
            notify('User role updated successfully!', 'success');
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
        onError: () => {
            notify('Failed to update user role', 'error');
        }
    });

    const handleDeleteClick = (user: IAccount) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            deleteUserMutation.mutate(userToDelete.id);
        }
    };

    const handleRoleChange = (user: IAccount, newRole: string) => {
        setRoleMutation.mutate({ userId: user.id, role: newRole });
    };

    return (
        <Box id="users-management-container">
            <Box id="users-management-header">
                <Typography id="users-management-title" variant="h5">
                    Users Management ({filteredUsers.length})
                </Typography>
                <TextField
                    id="users-search-input"
                    size="small"
                    placeholder="Search by username or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="users-search-field"
                />
            </Box>

            <Box id="users-management-content">
                {isLoading ? (
                    <Box className="users-loading-state">
                        <CircularProgress />
                        <Typography>Loading users...</Typography>
                    </Box>
                ) : filteredUsers.length === 0 ? (
                    <Box className="users-empty-state">
                        <Typography>No users found.</Typography>
                    </Box>
                ) : (
                    <Box id="users-list">
                        {filteredUsers.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onDeleteClick={handleDeleteClick}
                                onRoleChangeClick={handleRoleChange}
                                canDelete={canDeleteUsers}
                                canSetRole={canSetRole}
                                navigate={navigate}
                            />
                        ))}
                    </Box>
                )}
            </Box>

            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete User</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete user <strong>{userToDelete?.username}</strong>? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        disabled={deleteUserMutation.isPending}
                    >
                        {deleteUserMutation.isPending ? <CircularProgress size={20} /> : 'Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
