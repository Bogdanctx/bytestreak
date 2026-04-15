import { useEffect, useState, useRef } from 'react';
import { Box, Typography, Avatar, IconButton, TextField, CircularProgress, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DownloadIcon from '@mui/icons-material/Download';
import { type IAccount } from '../../../entities';
import { api } from '../../../api';
import { getRankByLevel, getRankColor } from '../../../utils/rankUtils';
import './FriendPanel.style.css';

// Mock interface for messages until you build the backend entity
interface IMessage {
    id: number;
    senderId: number;
    text: string;
    attachments?: ISelectedFile[];
    timestamp: Date;
}

interface ISelectedFile {
    name: string;
    base64: string;
}

function FriendPanel({ friendId, onBack }: { friendId: number; onBack: () => void }) {
    const [friend, setFriend] = useState<IAccount | null>(null);
    const [messageInput, setMessageInput] = useState("");
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [selectedFiles, setSelectedFiles] = useState<ISelectedFile[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchFriend = async () => {
        try {
            const response = await api.get(`/accounts/get?accountId=${friendId}`);
            if (response.status === 200) {
                setFriend(response.data);
            }
        } catch (error) {
            console.error('Error fetching friend details:', error);
        }
    };

    useEffect(() => {
        fetchFriend();
        // Here you would also fetch the chat history for this friend:
        // fetchMessages();
    }, [friendId]);

    const handleSendMessage = () => {
        if (messageInput.trim() === "" && selectedFiles.length === 0) {
            return;
        }

        const newMessage: IMessage = {
            id: Date.now(),
            senderId: 0, // 0 implies "me" for this frontend mock
            text: messageInput,
            attachments: selectedFiles,
            timestamp: new Date()
        };

        setMessages((prev) => [...prev, newMessage]);
        setMessageInput("");
        setSelectedFiles([]);

        // TODO: Send to backend
        // const formData = new FormData();
        // formData.append("text", messageInput);
        // if (selectedFile) formData.append("file", selectedFile);
        // api.post(`/messages/send?receiverId=${friendId}`, formData);
    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }
        
        const files = Array.from(event.target.files);
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setSelectedFiles((prevFiles) => [...prevFiles, { name: file.name, base64: base64String }]);
            };
            reader.readAsDataURL(file);
        });

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const renderFormattedText = (text: string) => {
        const parts = text.split(/(`[^`]+`)/g);
        return parts.map((part, index) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                return (
                    <Box component="span" key={index} className="message-code-snippet">
                        {part.slice(1, -1)} {/* remove the backticks */}
                    </Box>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    if (!friend) {
        return (
            <Box className="friend-panel-loading">
                <CircularProgress className="friend-panel-progress" />
            </Box>
        );
    }

    const rankName = getRankByLevel(friend.level);
    const rankColor = getRankColor(rankName);

    return (
        <Box className="friend-panel-container">
            <Box className="friend-panel-header">
                <IconButton onClick={onBack} className="friend-panel-back-btn">
                    <ArrowBackIcon /> {/* return to feed */}
                </IconButton>
                
                <Avatar 
                    src={friend.profilePictureUrl} 
                    sx={{ width: 48, height: 48, border: `2px solid ${rankColor}`, ml: 1, mr: 2 }}
                >
                    {/* display the profile picture if available, otherwise show the first letter of the username */}
                    {!friend.profilePictureUrl && friend.username.charAt(0).toUpperCase()}
                </Avatar>

                <Box className="friend-panel-user-info">
                    <Typography variant="h6" className="friend-panel-username">
                        {friend.username}
                    </Typography>
                    <Typography variant="caption" className={`friend-panel-rank`} style={{ color: rankColor }}>
                        Level {friend.level} • {rankName}
                    </Typography>
                </Box>

                <Box className="friend-panel-streak">
                    <LocalFireDepartmentIcon className="friend-panel-streak-icon" />
                    <Typography className="friend-panel-streak-text">
                        {friend.streakLength}
                    </Typography>
                </Box>
            </Box>

            <Box className="friend-panel-chat">
                {messages.length === 0 ? (
                    <Typography className="friend-panel-empty-chat">
                        Say hi to {friend.username}!
                    </Typography>
                ) : (
                    messages.map((message) => (
                        <Box 
                            key={message.id} 
                            className={`chat-bubble-container ${message.senderId === 0 ? 'chat-mine' : 'chat-theirs'}`}
                        >
                            <Paper className={`chat-bubble ${message.senderId === 0 ? 'bubble-mine' : 'bubble-theirs'}`}>
                                {/* render each attachment */}
                                {message.attachments?.map((file, index) => {
                                    // if it's image then just render it
                                    if (file.base64.startsWith('data:image')) {
                                        return <img key={index} src={file.base64} alt={file.name} className="chat-attachment" />
                                    }
                                    
                                    // if it's pdf or txt render a download button
                                    return (
                                        <Box key={index} className="chat-file-row">
                                            <AttachFileIcon className="chat-file-icon" />
                                            <Typography variant="caption" className="chat-file-name">
                                                {file.name}
                                            </Typography>
                                            
                                            <IconButton 
                                                component="a" 
                                                href={file.base64} 
                                                download={file.name}
                                                size="small" 
                                                className="chat-file-download-btn"
                                            >
                                                <DownloadIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    );
                                })}

                                {/* render the message text */}
                                {message.text && (
                                    <Typography variant="body2">
                                        {renderFormattedText(message.text)}
                                    </Typography>
                                )}
                            </Paper>
                        </Box>
                    ))
                )}
            </Box>

            <Box className="friend-panel-input-container">
                {/* show file previews if any are selected */}
                {selectedFiles.length > 0 && (
                    <Box className="friend-panel-file-preview friend-panel-file-preview-wrap">
                        {selectedFiles.map((file, index) => {
                            if (file.base64.startsWith('data:image')) {
                                return <img key={index} src={file.base64} alt={file.name} className="friend-panel-preview-image" />
                            }
                            return (
                                <Box key={index} className="friend-panel-preview-file-chip">
                                    <AttachFileIcon className="friend-panel-preview-file-icon" />
                                    <Typography variant="caption" className="friend-panel-preview-file-name">
                                        {file.name}
                                    </Typography>
                                </Box>
                            )
                        })}
                        <IconButton size="small" onClick={() => setSelectedFiles([])} className="friend-panel-clear-files-btn">
                            &times;
                        </IconButton>
                    </Box>
                )}
                
                <Box className="friend-panel-input-row">
                    <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} 
                        className="friend-panel-hidden-file-input" accept="image/*,.pdf,.txt"
                    />
                    <IconButton 
                        onClick={() => fileInputRef.current?.click()} 
                        className={`friend-panel-attach-btn ${selectedFiles.length > 0 ? 'friend-panel-attach-btn-active' : ''}`}
                    >
                        <AttachFileIcon />
                    </IconButton>
                    
                    <TextField fullWidth variant="outlined" size="small" value={messageInput}
                        placeholder="Type a message... (use `code` for snippets)"
                        onChange={(event) => setMessageInput(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                        className="friend-panel-message-input"
                    />
                    
                    <IconButton onClick={handleSendMessage} 
                        disabled={messageInput.trim() === "" && selectedFiles.length === 0}
                        className={`friend-panel-send-btn ${(messageInput.trim() !== "" || selectedFiles.length > 0) ? 'friend-panel-send-btn-enabled' : 'friend-panel-send-btn-disabled'}`}
                    >
                        <SendIcon fontSize="small" className="friend-panel-send-icon" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}

export default FriendPanel;