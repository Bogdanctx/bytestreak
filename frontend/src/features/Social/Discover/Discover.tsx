import { useState, useEffect, useMemo } from 'react';
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
    // state to hold all accounts fetched from the backend (excluding me and my friends)
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const [accountsNextCursor, setAccountsNextCursor] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [sentConnections, setSentConnections] = useState<IFriendInvite[]>([]);
    const [pendingConnections, setPendingConnections] = useState<IFriendInvite[]>([]);

    useEffect(() => {
        // debounce the seach input by 300ms to avoid filtering on every keystroke
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery]);

    useEffect(() => {
        const controller = new AbortController();

        fetchAccounts(accountsNextCursor, controller.signal);
        fetchSentConnections();
        fetchPendingConnections();

        return () => controller.abort();
    }, []);

    const fetchAccounts = async (nextCursor: number | null, signal?: AbortSignal) => {
        try {
            const response = await api.get(`/accounts/all?cursor=${nextCursor || ""}`, { signal });     
            
            console.log('Fetched accounts:', response.data.accounts);

            setAccountsNextCursor(response.data.nextCursor);

            // remove me from the list
            let filteredAccounts = response.data.accounts.filter((fetchedAccount: IAccount) => fetchedAccount.id !== account.id);
            
            // remove my friends from the list
            if (account.friends.length > 0) {
                filteredAccounts = filteredAccounts.filter((fetchedAccount: IAccount) => {
                    return !account.friends.some((friend) => friend.id === fetchedAccount.id);
                });
            }

            // set all the accounts
            setAccounts((prevAccounts) => [...prevAccounts, ...filteredAccounts]);
        } 
        catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    const displayedAccounts = useMemo(() => {
        if (debouncedSearchQuery.trim() === "") {
            return accounts;
        } 
        else {
            return accounts.filter(account => 
                account.username.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
            );
        }
    }, [accounts, debouncedSearchQuery]);

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
                {displayedAccounts.map((account) => (
                    <Box 
                        key={account.id} 
                        className="discover-user-card"
                    >
                        <Box className="discover-user-info">
                            <Avatar src={account.profilePictureUrl} className="discover-user-avatar">
                                {!account.profilePictureUrl && account.username.charAt(0)}
                            </Avatar>
                            
                            <Box className="discover-user-meta">
                                <Typography variant="body2" className="discover-user-name" noWrap>
                                    {account.username}
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
                        {sentConnections.some((connection) => connection.receiver.id === account.id) || pendingConnections.some((connection) => connection.sender.id === account.id) ? (
                            <Typography variant="caption" className="discover-pending-connection">
                                Pending Connection
                            </Typography>
                        ) : (
                            <Button variant="outlined" size="small" className="discover-add-button" 
                                    onClick={() => handleAddFriend(account.id)}
                            >
                                <PersonAddIcon fontSize="small" />
                            </Button>
                        )}
                    </Box>
                ))}

                {displayedAccounts.length === 0 && searchQuery.trim() === "" && (
                    <Typography variant="body2" className="discover-empty-state">
                        <br /> No connections available. <br /> <br /> Invite your friends to join ByteStreak and connect with them here!
                    </Typography>
                )}

                {displayedAccounts.length === 0 && searchQuery.trim() !== "" && (
                    <Typography variant="body2" className="discover-empty-state">
                        No members found matching "{searchQuery}"
                    </Typography>
                )}

                {displayedAccounts.length !== 0 && accountsNextCursor !== null && (
                    <Button variant="text" size="small" className="discover-load-more-button"
                            onClick={() => fetchAccounts(accountsNextCursor)}
                    >
                        Load More
                    </Button>
                )}
            </Box>
        </Box>
    );
}

export default Discover;