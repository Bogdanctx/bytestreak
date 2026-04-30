import { useState } from 'react';
import { Box } from '@mui/material';

import Discover from '../../features/Social/Discover/Discover';
import Feed from '../../features/Social/Feed/Feed';
import FriendPanel from '../../features/Social/FriendPanel/FriendPanel';
import Master from '../../features/Social/Master/Master';
import { type IAccount } from '../../types/account.types';
import './Social.style.css';

function Social() {
    const [selectedFriend, setSelectedFriend] = useState<IAccount | null>(null);

    return (
        <Box className='social-container'>
            <Box className='social-container-column' sx={{ width: '18%' }}>
                <Master setSelectedFriend={setSelectedFriend} />
            </Box>
            <Box className='social-container-column' sx={{ width: '60%' }}>
                {selectedFriend ? (
                    <FriendPanel 
                        friendId={selectedFriend.id}
                        onBack = {() => setSelectedFriend(null)}/>
                ) : (
                    <Feed />
                )}
            </Box>
            <Box className='social-container-column' sx={{ width: '20%', padding: 2 }}>
                <Discover />
            </Box>
        </Box>
    );
}

export default Social;