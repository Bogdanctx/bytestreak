import { useState } from 'react';
import { Box } from '@mui/material';

import Discover from '../../features/Social/Discover/Discover';
import Feed from '../../features/Social/Feed/Feed';
import FriendPanel from '../../features/Social/FriendPanel/FriendPanel';
import Master from '../../features/Social/Master/Master';
import { type IAccount } from '../../types/account.types';
import './Social.style.css';
import { useAccount } from '../../hooks/useAccount';
import Loading from '../../components/ui/Loading';

function Social() {
    const { data: account } = useAccount();
    const [selectedFriend, setSelectedFriend] = useState<IAccount | null>(null);

    if (!account) {
        return <Loading />;
    }

    return (
        <Box className='social-container'>
            
            <Box className='social-box'>
                <Master account={account} setSelectedFriend={setSelectedFriend} />
            </Box>
            
            <Box className='social-box' sx={{ minWidth: "60%" }} >
                {selectedFriend ? (
                    <FriendPanel account={account} friendId={selectedFriend.id} onBack = {() => setSelectedFriend(null)}/>
                ) : (
                    <Feed />
                )}
            </Box>
            
            <Box className='social-box'>
                <Discover account={account} />
            </Box>
        
        </Box>
    );
}

export default Social;