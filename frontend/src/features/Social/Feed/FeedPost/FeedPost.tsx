import { useState } from "react";
import { Box, Typography, Avatar, IconButton, InputBase } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SendIcon from '@mui/icons-material/Send';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../../../api";
import { type IPost } from "../../../../types/post.types";
import notify from "../../../../components/ui/ToastNotification";
import './FeedPost.style.css';

interface IFeedPostProps {
    post: IPost;
    isDetailed?: boolean;
    onClick?: () => void;
    onBack?: () => void;
}

function FeedPost({ post, isDetailed = false, onClick, onBack }: IFeedPostProps) {
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState("");

    const addCommentMutation = useMutation({
        mutationFn: async (text: string) => {
            const response = await api.post(`/social/feed/posts/${post.id}/comment`, { text });
            return response.data;
        },
        onSuccess: () => {
            setCommentText("");
            queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
        },
        onError: () => {
            notify('Failed to post comment', 'error');
        }
    });

    const handleSendComment = () => {
        if (commentText.trim() === "") return;
        addCommentMutation.mutate(commentText);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendComment();
        }
    };

    const isImage = (filedata: string, filename: string) => {
        return filedata?.startsWith('data:image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
    };

    return (
        <Box className={`feed-post-container ${!isDetailed ? 'clickable' : ''}`}>
            <Box className="feed-post-header">
                {isDetailed && onBack && (
                    <IconButton onClick={onBack} className="feed-post-back-btn" size="small">
                        <ArrowBackIcon />
                    </IconButton>
                )}
                <Avatar 
                    src={post.author?.profilePictureUrl}
                    className="feed-post-avatar"
                />
                <Box className="feed-post-meta">
                    <Typography className="feed-post-author-name">
                        {post.author.username}
                    </Typography>
                    <Typography className="feed-post-date">
                        {new Date(post.createdAt).toLocaleString()}
                    </Typography>
                </Box>
            </Box>

            <Box className="feed-post-body" onClick={!isDetailed ? onClick : undefined}>
                <Typography className="feed-post-text">{post.text}</Typography>
                
                {post.attachments && post.attachments.length > 0 && (
                    <Box className="feed-post-attachments">
                        {post.attachments.map((att, idx) => (
                            isImage(att.filedata, att.filename) ? (
                                <img key={idx} src={att.filedata} alt="attachment" className="feed-post-image" />
                            ) : (
                                <a key={idx} href={att.filedata} download={att.filename} className="feed-post-file-link">
                                    {att.filename}
                                </a>
                            )
                        ))}
                    </Box>
                )}
            </Box>

            {!isDetailed && (
                <Box className="feed-post-footer" onClick={onClick}>
                    <ChatBubbleOutlineIcon fontSize="small" className="feed-post-icon" />
                    <Typography className="feed-post-comment-count">
                        {post.comments?.length || 0} Comments
                    </Typography>
                </Box>
            )}

            {isDetailed && (
                <Box className="feed-post-comments-section">
                    <Typography className="comments-header">Comments ({post.comments?.length || 0})</Typography>
                    
                    <Box className="comments-list">
                        {post.comments?.map(comment => (
                            <Box key={comment.id} className="comment-item">
                                <Avatar src={comment.author?.profilePictureUrl} className="comment-avatar" />
                                <Box className="comment-content">
                                    <Typography className="comment-author">
                                        {comment.author.username}
                                    </Typography>
                                    <Typography className="comment-text">{comment.text}</Typography>
                                </Box>
                            </Box>
                        ))}
                    </Box>

                    <Box className="comment-input-box">
                        <InputBase
                            fullWidth
                            placeholder="Write a comment..."
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="comment-text-input"
                            multiline
                            maxRows={3}
                        />
                        <IconButton 
                            onClick={handleSendComment} 
                            disabled={commentText.trim() === "" || addCommentMutation.isPending}
                            className={`comment-send-btn ${commentText.trim() !== "" ? 'enabled' : ''}`}
                        >
                            <SendIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default FeedPost;