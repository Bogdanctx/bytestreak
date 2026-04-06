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
import { type IAccount } from '../../../entities';

function Discover({ myAccountId }: { myAccountId: number }) {
    const [accounts, setAccounts] = useState<IAccount[]>([]);
    const [fetchedAccounts, setFetchedAccounts] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');

    const fetchAllAccounts = async () => {
        try {
            const response = await api.get('/accounts/all');
            
            // remove me from the list
            const filteredAccounts = response.data.filter((account: IAccount) => account.id !== myAccountId);
            
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

            {/* Users List Section */}
            <Box className="discover-users-list">
                {accounts.map((account) => (
                    <Box 
                        key={account.id} 
                        className="discover-user-card"
                    >
                        <Box className="discover-user-info">
                            <Avatar 
                                src={account.profilePictureUrl}
                                className="discover-user-avatar"
                            >
                                {!account.profilePictureUrl && account.username.charAt(0)}
                            </Avatar>
                            
                            <Box className="discover-user-meta">
                                <Typography 
                                    variant="body2" 
                                    className="discover-user-name"
                                    noWrap
                                >
                                    {account.username}
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    className="discover-user-role"
                                    noWrap
                                >
                                    Mock role
                                </Typography>
                                <Typography 
                                    variant="caption" 
                                    className="discover-user-location"
                                    noWrap
                                >
                                    Mock location
                                </Typography>
                            </Box>
                        </Box>

                        <Button 
                            variant="outlined" 
                            size="small" 
                            className="discover-add-button"
                        >
                            <PersonAddIcon fontSize="small" />
                        </Button>
                    </Box>
                ))}

                {accounts.length === 0 && (
                    <Typography variant="body2" className="discover-empty-state">
                        No members found matching "{searchQuery}"
                    </Typography>
                )}
            </Box>
        </Box>
    );
}

export default Discover;