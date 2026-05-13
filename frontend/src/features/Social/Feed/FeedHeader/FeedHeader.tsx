import { useState, useRef } from 'react';
import { Box, InputBase, IconButton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import './FeedHeader.style.css';
import type { IAttachment } from '../../../../types/message.types';

interface IFeedHeaderProps {
    onPost: (text: string, attachments: IAttachment[]) => void;
    isLoading?: boolean;
}

function FeedHeader({ onPost, isLoading = false }: IFeedHeaderProps) {
    const [text, setText] = useState('');
    const [selectedFiles, setSelectedFiles] = useState<IAttachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            return;
        }
        
        const files = Array.from(event.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedFiles(prev => [...prev, {
                    id: null,
                    filename: file.name,
                    filedata: reader.result as string
                }]);
            };
            reader.readAsDataURL(file);
        });
        
        // Reset input so the same file can be selected again if removed
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSend = () => {
        if ((text.trim() === '' && selectedFiles.length === 0) || isLoading) return;
        onPost(text, selectedFiles);
        setText('');
        setSelectedFiles([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const isFormEmpty = text.trim() === '' && selectedFiles.length === 0;

    return (
        <Box className="feed-header-container">
            <Box className="feed-header-compose-box">
                <InputBase
                    fullWidth
                    placeholder="What's on your mind?"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    multiline
                    maxRows={6}
                    disabled={isLoading}
                    className="feed-header-text-input"
                />

                {selectedFiles.length > 0 && (
                    <Box className="feed-header-files-list">
                        {selectedFiles.map((file, index) => (
                            <Box key={index} className="feed-header-file-item">
                                <Typography className="feed-header-file-name" title={file.filename}>
                                    {file.filename}
                                </Typography>
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveFile(index)}
                                    className="feed-header-remove-file-btn"
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}

                <Box className="feed-header-actions-row">
                    <Box className="feed-header-actions-left">
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            className="feed-header-hidden-file-input"
                            accept="image/*,.pdf,.txt,.doc,.docx"
                        />
                        <IconButton
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                            className={`feed-header-action-btn ${selectedFiles.length > 0 ? 'active' : ''}`}
                        >
                            <AttachFileIcon fontSize="small" />
                        </IconButton>
                        {selectedFiles.length > 0 && (
                            <Typography className="feed-header-file-count">
                                {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''}
                            </Typography>
                        )}
                    </Box>

                    <IconButton
                        onClick={handleSend}
                        disabled={isFormEmpty || isLoading}
                        className={`feed-header-send-btn ${!isFormEmpty ? 'enabled' : ''}`}
                    >
                        <SendIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Box>
        </Box>
    );
}

export default FeedHeader;