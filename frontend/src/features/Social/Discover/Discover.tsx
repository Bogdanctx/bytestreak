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
import { type IAccount, type IFriendInvite } from '../../../entities';
import notify from '../../../components/ui/ToastNotification';
import { useProtectedAccount } from '../../../context/AccountContext';

function Discover() {
    const { account } = useProtectedAccount();
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const [accountsNextCursor, setAccountsNextCursor] = useState<number | null>(0);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [debounceSearchQuery, setDebounceSearchQuery] = useState(searchQuery);
    
    const [sentConnections, setSentConnections] = useState<IFriendInvite[]>([]);
    const [pendingConnections, setPendingConnections] = useState<IFriendInvite[]>([]);
    
    useEffect(() => {
        fetchSentConnections();
        fetchPendingConnections();
    }, [account]);


    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceSearchQuery(searchQuery);
        }, 200);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery]);

    useEffect(() => {
        fetchAccounts(0, debounceSearchQuery, false);
    }, [debounceSearchQuery]);

    const fetchAccounts = async (nextCursor: number | null, query: string, isAppend: boolean) => {
        try {
            const response = await api.get(`/accounts/fetch-accounts?cursor=${nextCursor || ""}&query=${query}`);
            setAccountsNextCursor(response.data.nextCursor);

            if (isAppend) {
                setAccounts((prevAccounts) => [...prevAccounts, ...response.data.accounts]);
            } 
            else {
                setAccounts(response.data.accounts);
            }
        } 
        catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const handleAddFriend = async (accountId: number) => {
        try {
            const response = await api.post(`/friends/send-request?friendId=${accountId}`);

            if (response.status === 200) {
                notify('Friend invite sent!', 'success');
                // add the new sent connection to the state to update the UI
                setSentConnections((prev) => [...prev, response.data]);
            }
        }
        catch (error) {
            console.error('Error sending friend invite:', error);
            notify('Failed to send friend invite. Please try again.', 'error');
        }
    }

    const fetchSentConnections = async () => {
        try {
            const response = await api.get('/friends/sent-connections');

            if (response.status === 200) {
                setSentConnections(response.data);
                console.log('Fetched sent connections:', response.data);
            }
        } 
        catch (error) {
            console.error('Error fetching sent connections:', error);
        }
    }

    const fetchPendingConnections = async () => {
        try {
            const response = await api.get('/friends/pending-connections');

            if (response.status === 200) {
                setPendingConnections(response.data);
                console.log('Fetched pending connections:', response.data);
            }
        } 
        catch (error) {
            console.error('Error fetching pending connections:', error);
        }
    }

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
                {accounts.map((mappedAccount) => {
                    if (mappedAccount.id === account.id) {
                        return null;
                    }

                    return (
                        <Box 
                            key={mappedAccount.id} 
                            className="discover-user-card"
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
                                        Mock role
                                    </Typography>
                                    <Typography variant="caption" className="discover-user-location" noWrap>
                                        Mock location
                                    </Typography>
                                </Box>
                            </Box>

                            {/* `Pending Connection` will appear for both users if they try to add each other */}
                            {sentConnections.some((connection) => connection.receiver.id === mappedAccount.id) || pendingConnections.some((connection) => connection.sender.id === mappedAccount.id) ? (
                                <Typography variant="caption" className="discover-pending-connection">
                                    Pending Connection
                                </Typography>
                            ) : (
                                <Button variant="outlined" size="small" className="discover-add-button" 
                                        onClick={() => handleAddFriend(mappedAccount.id)}
                                >
                                    <PersonAddIcon fontSize="small" />
                                </Button>
                            )}
                        </Box>
                    );
                })}

                {accounts.length === 0 && searchQuery.trim() === "" && (
                    <Typography variant="body2" className="discover-empty-state">
                        <br /> No connections available. <br /> <br /> Invite your friends to join ByteStreak and connect with them here!
                    </Typography>
                )}

                {accounts.length === 0 && searchQuery.trim() !== "" && (
                    <Typography variant="body2" className="discover-empty-state">
                        No members found matching "{searchQuery}"
                    </Typography>
                )}

                {accounts.length !== 0 && accountsNextCursor !== null && (
                    <Button variant="text" size="small" className="discover-load-more-button"
                            onClick={() => fetchAccounts(accountsNextCursor, searchQuery, true)}
                    >
                        Load More
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default Discover;