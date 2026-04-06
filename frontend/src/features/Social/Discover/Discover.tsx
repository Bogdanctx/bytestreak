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
import { type IAccount } from '../../../entities';
import notify from '../../../components/ui/ToastNotification';

function Discover({ myAccount }: { myAccount: IAccount }) {
    // state to hold all accounts fetched from the backend (excluding me and my friends)
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    
    const [fetchedAccounts, setFetchedAccounts] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    const fetchAllAccounts = async () => {
        try {
            const response = await api.get('/accounts/all');
            
            // remove me from the list
            let filteredAccounts = response.data.filter((account: IAccount) => account.id !== myAccount.id);
            
            // remove my friends from the list
            filteredAccounts = filteredAccounts.filter((account: IAccount) => {
                return !myAccount.friends.some((friend) => friend.id === account.id);
            });

            // set all the accounts
            setAccounts(filteredAccounts);
        } 
        catch (error) {
            console.error('Error fetching accounts:', error);
        }
    };

    useEffect(() => {
        if (!fetchedAccounts) {
            fetchAllAccounts();
            setFetchedAccounts(true);
        }
    }, [fetchedAccounts]);

    useEffect(() => {
        // debounce the seach input by 300ms to avoid filtering on every keystroke
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 300);

        return () => clearTimeout(handler);
    }, [searchQuery]);

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
        await api.post('social/friends/add', { friendId: accountId })
            .then(response => {
                if (response.status === 200) {
                    // if the friend request was successful, remove the account from the list
                    let updatedAccounts = accounts.filter(account => account.id !== accountId);
                    setAccounts(updatedAccounts);

                    console.log(`Friend request sent to account ID: ${accountId}`);
                    notify("Friend request sent!", "success");
                } else {
                    console.error('Failed to send friend request.');
                }
            })
            .catch(error => {
                console.error('Error sending friend request:', error);
            });
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

                        <Button variant="outlined" size="small" className="discover-add-button" 
                                onClick={() => handleAddFriend(account.id)}
                        >
                            <PersonAddIcon fontSize="small" />
                        </Button>
                    </Box>
                ))}

                {accounts.length === 0 && searchQuery.trim() !== "" && (
                    <Typography variant="body2" className="discover-empty-state">
                        No members found matching "{searchQuery}"
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default Discover;