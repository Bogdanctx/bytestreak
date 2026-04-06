import {
    Box
} from '@mui/material';
import { useState } from 'react';
import Discover from '../../features/Social/Discover/Discover';
import Feed from '../../features/Social/Feed/Feed';
import Master from '../../features/Social/Master/Master';
import { useAccountContext } from '../../context/AccountContext';

import './Social.style.css';

import { type IAccount } from '../../entities';

function Social() {
    const [selectedFriend, setSelectedFriend] = useState<IAccount | null>(null);
    const { account } = useAccountContext();

    if (!account) {
        return null;
    }

    return (
        <Box className='social-container'>
            <Box 
                className='social-container-column'
                sx={{ width: '18%' }}
            >
                <Master friendsList={account.friends} selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} />
            </Box>
            <Box 
                className='social-container-column'
                sx={{ width: '60%' }}
            >
                <Feed />
            </Box>
            <Box 
                className='social-container-column' 
                sx={{ width: '20%', padding: 2 }}
            >
                <Discover myAccount={account} />
            </Box>
        </Box>
    );
}

export default Social;