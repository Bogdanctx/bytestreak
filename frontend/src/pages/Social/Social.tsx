import {
    Box
} from '@mui/material';
import React, { useState } from 'react';
import Discover from '../../features/Social/Discover/Discover';
import Feed from '../../features/Social/Feed/Feed';
import Master from '../../features/Social/Master/Master';

import './Social.style.css';

import { type IAccount } from '../../entities';

const mockFriendsList: IAccount[] = [
    {
        id: 101,
        username: "AliceSmith",
        email: "alice@example.com",
        level: 15,
        currentXP: 450,
        problemsSolved: 124,
        quizzesSolved: 30,
        streakLength: 12,
        friendsCount: 8,
        createdProblems: [],
        solvedProblems: [],
        profilePictureUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" 
    },
    {
        id: 102,
        username: "CharlieDev",
        email: "charlie@example.com",
        level: 9,
        currentXP: 120,
        problemsSolved: 45,
        quizzesSolved: 10,
        streakLength: 2,
        friendsCount: 15,
        createdProblems: [],
        solvedProblems: [],
        profilePictureUrl: "" 
    },
    {
        id: 103,
        username: "DianaPrince",
        email: "diana@example.com",
        level: 22,
        currentXP: 890,
        problemsSolved: 310,
        quizzesSolved: 85,
        streakLength: 45,
        friendsCount: 32,
        createdProblems: [],
        solvedProblems: [],
        profilePictureUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diana"
    },
    {
        id: 104,
        username: "EthanHunt",
        email: "ethan@example.com",
        level: 4,
        currentXP: 30,
        problemsSolved: 12,
        quizzesSolved: 2,
        streakLength: 0,
        friendsCount: 3,
        createdProblems: [],
        solvedProblems: [],
        profilePictureUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ethan"
    },
    {
        id: 105,
        username: "FullStackFiona",
        email: "fiona@example.com",
        level: 31,
        currentXP: 1200,
        problemsSolved: 540,
        quizzesSolved: 120,
        streakLength: 105,
        friendsCount: 88,
        createdProblems: [],
        solvedProblems: [],
        profilePictureUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fiona"
    },
    {
        id: 106,
        username: "GhostCoder",
        email: "ghost@example.com",
        level: 1,
        currentXP: 5,
        problemsSolved: 0,
        quizzesSolved: 0,
        streakLength: 0,
        friendsCount: 1,
        createdProblems: [],
        solvedProblems: [],
        profilePictureUrl: "" 
    },
    {
        id: 107,
        username: "JavaJoe",
        email: "joe@example.com",
        level: 18,
        currentXP: 600,
        problemsSolved: 210,
        quizzesSolved: 45,
        streakLength: 14,
        friendsCount: 12,
        createdProblems: [],
        solvedProblems: [],
        profilePictureUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Joe"
    },
    {
        id: 108,
        username: "UltimateCompetitiveCoder99", // Test long username wrapping
        email: "pro@example.com",
        level: 50,
        currentXP: 9999,
        problemsSolved: 1200,
        quizzesSolved: 500,
        streakLength: 365,
        friendsCount: 450,
        createdProblems: [],
        solvedProblems: [],
        profilePictureUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pro"
    }
];

function Social() {
    const [selectedFriend, setSelectedFriend] = useState<IAccount | null>(null);
    

    return (
        <Box className='social-container'>
            <Box 
                className='social-container-column'
                sx={{ width: '18%' }}
            >
                <Master friendsList={mockFriendsList} selectedFriend={selectedFriend} setSelectedFriend={setSelectedFriend} />
            </Box>
            <Box 
                className='social-container-column'
                sx={{ width: '60%' }}
            >
                <Feed />
            </Box>
            <Box 
                className='social-container-column' 
                sx={{ width: '20%' }}
            >
                <Discover />
            </Box>
        </Box>
    );
}

export default Social;