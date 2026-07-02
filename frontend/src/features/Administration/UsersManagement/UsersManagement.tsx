import { useState, useEffect } from 'react';
import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { Box, Typography, TextField, CircularProgress, Button, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
import { api } from '../../../api';
import { type AccountRole, type IAccount } from '../../../types/account.types';
import notify from '../../../components/ui/ToastNotification';
import UserCard from './UserCard/UserCard';

import './UsersManagement.style.css';
import { useAccount } from '../../../hooks/useAccount';

export default function UsersManagement() {
    const { data: currentUser } = useAccount();
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [userToDelete, setUserToDelete] = useState<IAccount | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const [debounceSearchQuery, setDebounceSearchQuery] = useState(searchQuery);

    const { data: users, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['users', debounceSearchQuery, currentUser?.id], 
        queryFn: async ({ pageParam = "" }) => {
            const response = await api.get(`/accounts?cursor=${pageParam}&query=${debounceSearchQuery}`);
            
            return {
                ...response.data,
                accounts: response.data.accounts.filter((user: IAccount) => user.id !== currentUser?.id)
            };
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor || null,
        initialPageParam: ""
    });

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
        mutationFn: async ({ userId, role }: { userId: number; role: AccountRole }) => {
            const response = await api.put(`/accounts/${userId}/set-role`, { newRole: role });
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

    let searchableUsers = users?.pages.flatMap(page => page.accounts) || [];

    return (
        <Box id="users-management-container">
            <Box id="users-management-header">
                <Typography id="users-management-title" variant="h5">
                    Users Management
                </Typography>
                <TextField
                    className="users-search-field"
                    size="small"
                    placeholder="Search by username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            color: 'var(--text-primary)',
                            '& fieldset': { borderColor: 'var(--bg-6)' },
                            '&:hover fieldset': { borderColor: 'var(--bg-3)' },
                            '&.Mui-focused fieldset': { borderColor: 'var(--bg-3)' },
                        }
                    }}
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
                        />
                    ))}
                </Box>
            </Box>

            <Dialog open={deleteDialogOpen} 
                    onClose={() => setDeleteDialogOpen(false)}
                    sx={{
                        '& .MuiDialog-paper': {
                            backgroundColor: 'var(--bg-1)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--bg-6)'
                        }
                    }}
            >
                <DialogTitle fontFamily={"Momo Trust Display"}>DELETE ACCOUNT</DialogTitle>
                <Divider className="delete-user-header-separator" />
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete user <strong style={{ fontFamily: "Momo Trust Display" }}>{userToDelete?.username}</strong>? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}
                            sx={{
                                color: 'var(--text-primary)',
                                '&:hover': {
                                    backgroundColor: 'var(--bg-6)',
                                }
                            }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
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
