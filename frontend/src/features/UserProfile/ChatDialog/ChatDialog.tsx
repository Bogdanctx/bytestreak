import { useState, useEffect, useRef } from 'react';
import { Box, Typography, Dialog, TextField, CircularProgress, IconButton, Paper } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';

import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';
import { useWebSocket } from '../../../context/WebSocketContext';
import { getLevel } from '../../../utils/rankUtils';
import './ChatDialog.style.css';
import type { IAccount } from '../../../types/account.types';
import type { IMessage, IAttachment } from '../../../types/message.types';
import AccountAvatar from '../../../components/ui/AccountAvatar';

interface IChatDialogProps {
    open: boolean;
    onClose: () => void;
    targetAccount: IAccount;
    currentAccount?: IAccount;
}

function ChatDialog({ open, onClose, targetAccount, currentAccount }: IChatDialogProps) {
    const queryClient = useQueryClient();
    const { stompClient } = useWebSocket();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [messageInput, setMessageInput] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<IAttachment[]>([]);

    const { data: messagesData = [] } = useQuery<IMessage[]>({
        queryKey: ['messages', targetAccount.id],
        queryFn: async () => {
            const response = await api.get(`/social/messages/conversation?otherUserId=${targetAccount.id}`);
            return response.data;
        },
        enabled: open
    });

    // WebSockets Subscription
    useEffect(() => {
        if (stompClient && stompClient.connected && open) {
            const subscription = stompClient.subscribe(`/user/queue/messages`, (message) => {
                const newLiveMessage = JSON.parse(message.body);
                if (newLiveMessage.sender.id === targetAccount.id) {
                    queryClient.setQueryData(['messages', targetAccount.id], (oldData: IMessage[] | undefined) => {
                        return [...(oldData ?? []), newLiveMessage];
                    });
                }
            });
            return () => subscription.unsubscribe();
        }
    }, [stompClient, open, targetAccount.id, queryClient]);

    // Auto-scroll
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messagesData, selectedFiles]);

    // Send Message Mutation
    const sendMessageMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post(`/social/messages/send?receiverId=${targetAccount.id}`, {
                text: messageInput,
                attachments: selectedFiles.map(file => ({
                    id: null,
                    filename: file.filename,
                    filedata: file.filedata
                }))
            });
            return response.data;
        },
        onSuccess: (savedMessage) => {
            queryClient.setQueryData(['messages', targetAccount.id], (oldData: IMessage[] | undefined) => {
                return [...(oldData ?? []), savedMessage];
            });
            setMessageInput('');
            setSelectedFiles([]);
        },
        onError: () => notify("Failed to send message.", "error")
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFiles(prev => [...prev, { id: null, filename: file.name, filedata: reader.result as string }]);
            };
            reader.readAsDataURL(file);
        });
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const renderFormattedText = (text: string) => {
        const parts = text.split(/(`[^`]+`)/g);
        return parts.map((part, index) => {
            if (part.startsWith('`') && part.endsWith('`')) {
                return <Box component="span" key={index} className="chat-dialog-code-snippet">{part.slice(1, -1)}</Box>;
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ className: 'chat-dialog-container' }}>
            <Box className="chat-dialog-header">
                <Box className="chat-dialog-header-user">
                    <AccountAvatar avatarUrl={targetAccount.profilePictureUrl} cssEffectStyle={targetAccount.cssEffectStyle} width={36} height={36} />
                                                
                    <Box className="chat-dialog-user-info">
                        <Typography variant="body2" className="chat-dialog-user-name">{targetAccount.username}</Typography>
                        <Typography variant="caption" className="chat-dialog-user-level">Level {getLevel(targetAccount.currentXP)}</Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} size="small" className="chat-dialog-header-close">
                    <ClearIcon />
                </IconButton>
            </Box>

            <Box className="chat-dialog-messages">
                {messagesData.length === 0 ? (
                    <Box className="chat-dialog-empty-state">
                        <Typography variant="body2" className="chat-dialog-empty-state-text">Say hi to {targetAccount.username}!</Typography>
                    </Box>
                ) : (
                    messagesData.map((message) => (
                        <Box key={message.id} className={`chat-dialog-message-container ${message.sender.id === currentAccount?.id ? 'chat-dialog-message-container-mine' : 'chat-dialog-message-container-theirs'}`}>
                            <Paper className={`chat-dialog-message-bubble ${message.sender.id === currentAccount?.id ? 'chat-dialog-message-bubble-mine' : 'chat-dialog-message-bubble-theirs'}`}>
                                {message.attachments?.map((file, index) => (
                                    file.filedata.startsWith('data:image') 
                                        ? <img key={index} src={file.filedata} alt={file.filename} className="chat-dialog-image-attachment" />
                                        : <Box key={index} className="chat-dialog-file-item">
                                            <AttachFileIcon fontSize="small" />
                                            <Typography variant="caption" noWrap className="chat-dialog-file-name">{file.filename}</Typography>
                                            <IconButton component="a" href={file.filedata} download={file.filename} size="small" className="chat-dialog-file-download-btn"><DownloadIcon fontSize="small" /></IconButton>
                                          </Box>
                                ))}
                                {message.text && <Typography variant="body2">{renderFormattedText(message.text)}</Typography>}
                            </Paper>
                        </Box>
                    ))
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* Input */}
            <Box className="chat-dialog-input-container">
                {selectedFiles.length > 0 && (
                    <Box className="chat-dialog-file-preview-list">
                        {selectedFiles.map((file, index) => (
                            <Box key={index} className="chat-dialog-file-preview-item">
                                {file.filedata.startsWith('data:image') ? (
                                    <img src={file.filedata} alt={file.filename} className="chat-dialog-file-preview-image" />
                                ) : (
                                    <Box className="chat-dialog-file-preview-file">
                                        <AttachFileIcon fontSize="small" />
                                        <Typography variant="caption" className="chat-dialog-file-preview-name">{file.filename}</Typography>
                                    </Box>
                                )}
                                <IconButton size="small" onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== index))} className="chat-dialog-file-remove-btn">
                                    <ClearIcon className="chat-dialog-file-remove-icon" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}
                <Box className="chat-dialog-input-row">
                    <input type="file" multiple ref={fileInputRef} onChange={handleFileSelect} accept="image/*,.pdf,.txt" className="chat-dialog-hidden-file-input" />
                    <IconButton onClick={() => fileInputRef.current?.click()} className={`chat-dialog-attach-btn ${selectedFiles.length > 0 ? 'chat-dialog-attach-btn-active' : ''}`}><AttachFileIcon /></IconButton>
                    <TextField fullWidth variant="outlined" size="small" placeholder="Type a message... (use `code`)" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (messageInput.trim() || selectedFiles.length > 0) sendMessageMutation.mutate(); } }} disabled={sendMessageMutation.isPending} multiline maxRows={3} className="chat-dialog-text-input" />
                    <IconButton onClick={() => sendMessageMutation.mutate()} disabled={(!messageInput.trim() && selectedFiles.length === 0) || sendMessageMutation.isPending} className={`chat-dialog-send-btn ${(!messageInput.trim() && selectedFiles.length === 0) ? '' : 'chat-dialog-send-btn-enabled'}`}>
                        {sendMessageMutation.isPending ? <CircularProgress size={20} /> : <SendIcon />}
                    </IconButton>
                </Box>
            </Box>
        </Dialog>
    );
}

export default ChatDialog;