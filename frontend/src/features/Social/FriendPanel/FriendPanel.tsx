import { useEffect, useState, useRef } from 'react';
import { Box, Typography, IconButton, TextField, Paper } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import DownloadIcon from '@mui/icons-material/Download';
import FlagIcon from '@mui/icons-material/Flag';
import { type IAccount } from '../../../types/account.types';
import { type IMessage, type IAttachment } from '../../../types/message.types';
import { api } from '../../../api';
import { getLevel, getRank, getRankColor } from '../../../utils/rankUtils';
import './FriendPanel.style.css';
import { useWebSocket } from '../../../context/WebSocketContext';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Loading from '../../../components/ui/Loading';
import notify from '../../../components/ui/ToastNotification';
import AccountAvatar from '../../../components/ui/AccountAvatar';

interface IFriendPanelProps {
    account: IAccount;
    friendId: number;
    onBack: () => void;
}

function FriendPanel({ account, friendId, onBack }: IFriendPanelProps) {
    const queryClient = useQueryClient();
    const [messageInput, setMessageInput] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<IAttachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { stompClient } = useWebSocket();
    const { data: friend, isLoading: isFriendLoading } = useQuery<IAccount>({
        queryKey: ['friend', friendId],
        queryFn: async () => {
            const response = await api.get(`/accounts/${friendId}`);
            return response.data;
        }
    });
    const { data: messagesData = [] } = useQuery<IMessage[]>({
        queryKey: ['messages', friendId],
        queryFn: async () => {
            const response = await api.get(`/social/messages/conversation?otherUserId=${friendId}`);
            return response.data;
        }
    });
    const sendMessageMutation = useMutation({
        mutationFn: async (messageDTO: { text: string; attachments: IAttachment[] }) => {
            const response = await api.post(`/social/messages/send?receiverId=${friendId}`, messageDTO);
            return response.data;
        },
        onSuccess: (savedMessage) => {
            queryClient.setQueryData(['messages', friendId], (oldData: IMessage[] | undefined) => {
                const previousMessages = oldData ?? [];
                return [...previousMessages, savedMessage];
            });
            setMessageInput("");
            setSelectedFiles([]);
        },
        onError: (error) => {
            console.error('Error sending message:', error);
        }
    });

    const reportMessageMutation = useMutation({
        mutationFn: async (messageId: number) => {
            const response = await api.post(`/reports/submit/message/${messageId}`);
            return response.data;
        },
        onSuccess: () => {
            notify('Message reported successfully', 'success');
        },
        onError: () => {
            notify('Failed to report message', 'error');
        }
    });

    useEffect(() => {
        if (stompClient && stompClient.connected) {
            const subscription = stompClient.subscribe(`/user/queue/messages`, (message) => {
                const newLiveMessage = JSON.parse(message.body);

                if (newLiveMessage.sender.id === friendId) {
                    queryClient.setQueryData(['messages', friendId], (oldData: IMessage[] | undefined) => {
                        const previousMessages = oldData ?? [];
                        return [...previousMessages, newLiveMessage];
                    });
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        }

    }, [stompClient, friendId, queryClient]);

    const handleSendMessage = async () => {
        if (messageInput.trim() === "" && selectedFiles.length === 0) {
            return;
        }

        const messageDTO = {
            text: messageInput,
            attachments: selectedFiles.map(file => ({
                id: null,
                filename: file.filename,
                filedata: file.filedata
            }))
        }

        sendMessageMutation.mutate(messageDTO);
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
                const newFile: IAttachment = {
                    id: null,
                    filename: file.name,
                    filedata: base64String
                };
                setSelectedFiles((prevFiles) => [...prevFiles, newFile]);
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

    if (!friend || isFriendLoading) {
        return (
            <Loading />
        );
    }

    const level = getLevel(friend.currentXP);
    const rank = getRank(level);
    const rankColor = getRankColor(rank);

    return (
        <Box className="friend-panel-container">
            <Box className="friend-panel-header">
                <IconButton onClick={onBack} className="friend-panel-back-btn">
                    <ArrowBackIcon /> {/* return to feed */}
                </IconButton>
                
                <Box mr={1}>
                    <AccountAvatar avatarUrl={friend.profilePictureUrl} cssEffectStyle={friend.cssEffectStyle} width={40} height={40} />
                </Box>

                <Box className="friend-panel-user-info">
                    <Typography variant="h6" className="friend-panel-username">
                        {friend.username}
                    </Typography>
                    <Typography variant="caption" className={`friend-panel-rank`} style={{ color: rankColor }}>
                        Level {level} • {rank}
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
                {messagesData.length === 0 ? (
                    <Typography className="friend-panel-empty-chat">
                        Say hi to {friend.username}!
                    </Typography>
                ) : (
                    messagesData.map((message) => (
                        <Box 
                            key={message.id} 
                            className={`chat-bubble-container ${message.sender.id === account.id ? 'chat-mine' : 'chat-theirs'}`}
                            sx={{
                                '&:hover #report-flag-container': {
                                    display: 'flex',
                                }
                            }}
                        >
                            <Paper className={`chat-bubble ${message.sender.id === account.id ? 'bubble-mine' : 'bubble-theirs'}`}>
                                {/* render each attachment */}
                                {message.attachments?.map((file, index) => {
                                    // if it's image then just render it
                                    if (file.filedata.startsWith('data:image')) {
                                        return <img key={index} src={file.filedata} alt={file.filename} className="chat-attachment" />
                                    }
                                    
                                    // if it's pdf or txt render a download button
                                    return (
                                        <Box key={index} className="chat-file-row">
                                            <AttachFileIcon className="chat-file-icon" />
                                            <Typography variant="caption" className="chat-file-name">
                                                {file.filename}
                                            </Typography>
                                            
                                            <IconButton 
                                                component="a" 
                                                href={file.filedata} 
                                                download={file.filename}
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

                            <Box id="report-flag-container" className="report-flag" 
                                sx={{ 
                                    display: 'none', 
                                    justifyContent: 'flex-end', 
                                    mb: 0.5 ,
                                }}
                                >
                                <IconButton
                                    size="small"
                                    onClick={() => {
                                        if (message.id == null) {
                                            return;
                                        }
                                        reportMessageMutation.mutate(message.id)
                                    }}
                                    disabled={reportMessageMutation.isPending}
                                    aria-label="Report message"
                                >
                                    <FlagIcon fontSize="small" sx={{color: 'var(--difficulty-hard)'}} />
                                </IconButton>
                            </Box>
                        </Box>
                    ))
                )}
            </Box>

            <Box className="friend-panel-input-container">
                {/* show file previews if any are selected */}
                {selectedFiles.length > 0 && (
                    <Box className="friend-panel-file-preview friend-panel-file-preview-wrap">
                        {selectedFiles.map((file, index) => {
                            if (file.filedata.startsWith('data:image')) {
                                return <img key={index} src={file.filedata} alt={file.filename} className="friend-panel-preview-image" />
                            }
                            return (
                                <Box key={index} className="friend-panel-preview-file-chip">
                                    <AttachFileIcon className="friend-panel-preview-file-icon" />
                                    <Typography variant="caption" className="friend-panel-preview-file-name">
                                        {file.filename}
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
                        className="friend-panel-hidden-file-input" accept="image/*,.pdf,.txt,.doc,.docx"
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