import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { Box, Typography, TextField, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../../api';
import { type AccountRole, type IAccount } from '../../../types/account.types';
import notify from '../../../components/ui/ToastNotification';
import UserCard from './UserCard/UserCard';

import './UsersManagement.style.css';

export default function UsersManagement() {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [userToDelete, setUserToDelete] = useState<IAccount | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [debounceSearchQuery, setDebounceSearchQuery] = useState(searchQuery);

    const { data: users, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['users', debounceSearchQuery],
        queryFn: async ({ pageParam = "" }) => {
            const response = await api.get(`/accounts/fetch-accounts?cursor=${pageParam}&query=${debounceSearchQuery}`);
            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor || null,
        initialPageParam: ""
    });

    const deleteUserMutation = useMutation({
        mutationFn: async (userId: number) => {
            const response = await api.delete(`/accounts/delete?accountId=${userId}`);
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
        mutationFn: async ({ userId, role }: { userId: number; role: AccountRole }) => {
            const response = await api.put(`/accounts/set-role`, { accountId: userId, newRole: role });
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

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceSearchQuery(searchQuery);
        }, 200);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);


    const handleDeleteClick = (user: IAccount) => {
        setUserToDelete(user);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = () => {
        if (userToDelete) {
            deleteUserMutation.mutate(userToDelete.id);
        }
    };

    const handleRoleChange = (user: IAccount, newRole: AccountRole) => {
        setRoleMutation.mutate({ userId: user.id, role: newRole });
    };

    const searchableUsers = users?.pages.flatMap(page => page.accounts) || [];

    return (
        <Box id="users-management-container">
            <Box id="users-management-header">
                <Typography id="users-management-title" variant="h5">
                    Users Management
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
                <Box id="users-list">
                    {searchableUsers.map((user: IAccount) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onDeleteClick={handleDeleteClick}
                            onRoleChangeClick={handleRoleChange}
                            navigate={navigate}
                        />
                    ))}
                </Box>
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

            {hasNextPage && (
                <Button 
                    variant="text" 
                    size="small" 
                    className="discover-load-more-button"
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                >
                    {isFetchingNextPage ? 'Loading...' : 'Load More'}
                </Button>
            )}
        </Box>
    );
}
