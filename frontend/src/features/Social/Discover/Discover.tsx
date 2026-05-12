import { useState, useEffect } from 'react';
import { 
    Box, 
    Typography, 
    Avatar, 
    Button, 
    TextField, 
    InputAdornment 
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import './Discover.style.css';
import { api } from '../../../api';
import { type IFriendInvite } from '../../../types/invite.types';
import { type IAccount } from '../../../types/account.types';
import notify from '../../../components/ui/ToastNotification';
import { useQueryClient, useInfiniteQuery, useQuery, useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

function Discover(account: IAccount) {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [debounceSearchQuery, setDebounceSearchQuery] = useState(searchQuery);
    const navigate = useNavigate();
    const { data: discoverableAccounts, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteQuery({
        queryKey: ['discoverAccounts', debounceSearchQuery],
        queryFn: async ({ pageParam = "" }) => {
            const response = await api.get(`/accounts/fetch-accounts?cursor=${pageParam}&query=${debounceSearchQuery}`);
            return response.data;
        },
        getNextPageParam: (lastPage) => lastPage.nextCursor || null,
        initialPageParam: ""
    });

    const { data: accountFriends = [] } = useQuery<IAccount[]>({
        queryKey: ['accountFriends'],
        queryFn: async () => {
            const response = await api.get(`/friends/get-friends?accountId=${account.id}`);
            return response.data;
        }
    });

    const { data: pendingFriendRequests = [] } = useQuery<IFriendInvite[]>({
        queryKey: ['pendingFriendRequests'],
        queryFn: async () => {
            const response = await api.get('/friends/invites/pending-connections');
            return response.data;
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

    const addFriendMutation = useMutation({
        mutationFn: async (accountId: number) => {
            const response = await api.post(`/friends/send-request?friendId=${accountId}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingConnections'] });
            notify('Friend invite sent successfully!', 'success');
        },
        onError: (error) => {
            console.error('Error sending friend invite:', error);
            notify('Failed to send friend invite. Please try again.', 'error');
        }
    });

    const discoverAccounts = discoverableAccounts?.pages.flatMap(page => page.accounts) || [];

    return (
        <Box className="discover-container">
            <Box className="discover-header">
                <Typography variant="h6" className="discover-title">
                    Connect with the Community
                </Typography>

                <TextField
                    className="discover-search-field"
                    fullWidth
                    placeholder="Search by name, role..."
                    variant="outlined"
                    size="small"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    slotProps = {{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon className="discover-search-icon" />
                                </InputAdornment>
                            )     
                        }
                    }}
                />
            </Box>

            <Typography variant="subtitle2" className="discover-section-label">
                {searchQuery.trim() === "" ? "Suggested Connections" : "Search Results"}
            </Typography>

            <Box className="discover-users-list">
                {discoverAccounts.map((mappedAccount: IAccount) => {
                    // exclude the current user's account from the list
                    if (mappedAccount.id === account.id) {
                        return null;
                    }

                    // exclude accounts that are already friends
                    if (accountFriends.some(friend => friend.id === mappedAccount.id)) {
                        return null;
                    }


                    return (
                        <Box 
                            key={mappedAccount.id} 
                            className="discover-user-card"
                            onClick={() => navigate(`/accounts/profile/${mappedAccount.username}`)}
                        >
                            <Box className="discover-user-info">
                                <Avatar src={mappedAccount.profilePictureUrl} className="discover-user-avatar">
                                    {!mappedAccount.profilePictureUrl && mappedAccount.username.charAt(0)}
                                </Avatar>
                                
                                <Box className="discover-user-meta">
                                    <Typography variant="body2" className="discover-user-name" noWrap>
                                        {mappedAccount.username}
                                    </Typography>
                                    <Typography variant="caption" className="discover-user-role" noWrap>
                                        {mappedAccount.bio.length > 0 ? mappedAccount.bio.slice(0, 15) + "..." : "No bio available"}
                                    </Typography>
                                </Box>
                            </Box>

                            {/* `Pending Connection` will appear for both users if they try to add each other */}
                            {pendingFriendRequests.some((connection) => connection.receiver.id === mappedAccount.id || connection.sender.id === mappedAccount.id) ? (
                                <Typography variant="caption" className="discover-pending-connection">
                                    Pending Connection
                                </Typography>
                            ) : (
                                <Button variant="outlined" size="small" className="discover-add-button" 
                                        onClick={(event) => {
                                            event.stopPropagation(); // prevent card click
                                            addFriendMutation.mutate(mappedAccount.id)
                                        }}
                                >
                                    <PersonAddIcon fontSize="small" />
                                </Button>
                            )}
                        </Box>
                    );
                })}

                {discoverAccounts.length === 0 && searchQuery.trim() === "" && (
                    <Typography variant="body2" className="discover-empty-state">
                        <br /> No connections available. <br /> <br /> Invite your friends to join ByteStreak and connect with them here!
                    </Typography>
                )}

                {discoverAccounts.length === 0 && searchQuery.trim() !== "" && (
                    <Typography variant="body2" className="discover-empty-state">
                        No members found matching "{searchQuery}"
                    </Typography>
                )}

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
        </Box>
    );
}

export default Discover;