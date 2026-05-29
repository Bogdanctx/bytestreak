import { useState, useRef } from "react";
import { api } from "../../../../api";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, Button, Typography, Avatar, InputBase, IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import FlagIcon from '@mui/icons-material/Flag';
import { type IPostComment, type IPost } from "../../../../types/post.types";
import { type IAttachment } from "../../../../types/message.types";
import Loading from "../../../../components/ui/Loading";
import notify from "../../../../components/ui/ToastNotification";
import { useNavigate } from "react-router-dom";
import './ViewPost.style.css';

interface IViewPostProps {
    post: IPost;
    goBack: () => void;
}

function ViewPost({ post, goBack } : IViewPostProps) {
    const queryClient = useQueryClient();
    const [commentText, setCommentText] = useState("");
    const [commentAttachments, setCommentAttachments] = useState<IAttachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const { data: postComments, isLoading } = useQuery<IPostComment[]>({
        queryKey: ['postComments', post.id],
        queryFn: async () => {
            const response = await api.get(`/social/feed/posts/${post.id}/comments`);
            return response.data;
        }
    });

    const addCommentMutation = useMutation({
        mutationFn: async (payload: { text: string; attachments: IAttachment[] }) => {
            const response = await api.post(`/social/feed/posts/${post.id}/comment`, payload);
            return response.data;
        },
        onSuccess: () => {
            setCommentText("");
            setCommentAttachments([]);
            queryClient.invalidateQueries({ queryKey: ['postComments', post.id] });
            queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
        },
        onError: () => {
            notify('Failed to post comment', 'error');
        }
    });

    const reportPostMutation = useMutation({
        mutationFn: async () => {
            const response = await api.post(`/reports/submit/post/${post.id}`);
            return response.data;
        },
        onSuccess: () => {
            notify('Post reported successfully', 'success');
        },
        onError: () => {
            notify('Failed to report post', 'error');
        }
    });

    const reportCommentMutation = useMutation({
        mutationFn: async (commentId: number) => {
            const response = await api.post(`/reports/submit/comment/${commentId}`);
            return response.data;
        },
        onSuccess: () => {
            notify('Comment reported successfully', 'success');
        },
        onError: () => {
            notify('Failed to report comment', 'error');
        }
    });

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            return;
        }
        
        Array.from(event.target.files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCommentAttachments(prev => [...prev, {
                    id: null,
                    filename: file.name,
                    filedata: reader.result as string
                }]);
            };
            reader.readAsDataURL(file);
        });
        
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSend = () => {
        if (commentText.trim() === '' && commentAttachments.length === 0) {
            return;
        }
        addCommentMutation.mutate({ 
            text: commentText, 
            attachments: commentAttachments 
        });
    };

    const isImage = (filedata: string, filename: string) => {
        return filedata?.startsWith('data:image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <Box className="view-post-container">
            <Button onClick={goBack} className="view-post-back-btn" disableRipple>
                <ArrowBackIcon fontSize="small" sx={{ mr: 1 }} /> Back to Feed
            </Button>

            <Box className="view-post-main">
                <Box className="view-post-header">
                    <Avatar src={post.author.profilePictureUrl} className="view-post-avatar" />
                    <Box>
                        <Typography className="view-post-author-name"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/accounts/profile/${post.author.username}`);
                                }}
                                sx={{
                                    "&:hover": {
                                        textDecoration: "underline",
                                        cursor: "pointer"
                                    }
                                }}
                        >
                            {post.author.username}
                        </Typography>
                        <Typography className="view-post-date">{new Date(post.createdAt).toLocaleString()}</Typography>
                    </Box>
                    <IconButton
                        className="report-flag"
                        size="small"
                        onClick={(e) => {
                            e.stopPropagation();
                            reportPostMutation.mutate();
                        }}
                        disabled={reportPostMutation.isPending}
                        aria-label="Report post"
                    >
                        <FlagIcon fontSize="small" />
                    </IconButton>
                </Box>
                
                <Typography className="view-post-text">{post.text}</Typography>
                
                {post.attachments && post.attachments.length > 0 && (
                    <Box className="view-post-attachments">
                        {post.attachments.map((att, idx) => (
                            isImage(att.filedata, att.filename) ? (
                                <img key={idx} src={att.filedata} alt="attachment" className="view-post-image" />
                            ) : (
                                <a key={idx} href={att.filedata} download={att.filename} className="view-post-file-link">
                                    {att.filename}
                                </a>
                            )
                        ))}
                    </Box>
                )}
            </Box>

            <Box className="view-post-comments-section">
                <Typography className="comments-header">Comments ({postComments?.length || 0})</Typography>
                
                <Box className="comments-list">
                    {postComments?.map(comment => (
                        <Box key={comment.id} className="comment-item">
                            <Avatar src={comment.author?.profilePictureUrl} className="comment-avatar" />
                            <Box className="comment-content">
                                <Box className="comment-meta">
                                    <Typography className="comment-author"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/accounts/profile/${post.author.username}`);
                                                }}
                                                sx={{
                                                    "&:hover": {
                                                        textDecoration: "underline",
                                                        cursor: "pointer"
                                                    }
                                                }}
                                    >
                                        {comment.author.username}
                                    </Typography>
                                    <Typography className="comment-date">{new Date(comment.createdAt).toLocaleString()}</Typography>
                                    <IconButton
                                        size="small"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (comment.id == null) {
                                                return;
                                            }
                                            reportCommentMutation.mutate(comment.id);
                                        }}
                                        disabled={reportCommentMutation.isPending}
                                        aria-label="Report comment"
                                    >
                                        <FlagIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Typography className="comment-text">{comment.text}</Typography>
                                
                                {comment.attachments && comment.attachments.length > 0 && (
                                    <Box className="view-post-attachments" sx={{ mt: 1 }}>
                                        {comment.attachments.map((att, idx) => (
                                            isImage(att.filedata, att.filename) ? (
                                                <img key={idx} src={att.filedata} alt="attachment" className="view-post-image" style={{ maxHeight: '200px' }}/>
                                            ) : (
                                                <a key={idx} href={att.filedata} download={att.filename} className="view-post-file-link">
                                                    {att.filename}
                                                </a>
                                            )
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>

            <Box className="view-post-compose-box">
                {commentAttachments.length > 0 && (
                    <Box className="compose-attachments-list">
                        {commentAttachments.map((file, index) => (
                            <Box key={index} className="compose-attachment-item">
                                <Typography className="compose-attachment-name" title={file.filename}>
                                    {file.filename}
                                </Typography>
                                <IconButton size="small" onClick={() => setCommentAttachments(prev => prev.filter((_, i) => i !== index))}>
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                )}

                <Box className="compose-input-row">
                    <InputBase
                        fullWidth
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                            }
                        }}
                        multiline
                        maxRows={4}
                        className="compose-text-input"
                        disabled={addCommentMutation.isPending}
                    />
                    
                    <Box className="compose-actions">
                        <input
                            type="file"
                            multiple
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            style={{ display: 'none' }}
                            accept="image/*,.pdf,.txt,.doc,.docx"
                        />
                        <IconButton onClick={() => fileInputRef.current?.click()} className="compose-action-btn" disabled={addCommentMutation.isPending}>
                            <AttachFileIcon fontSize="small" />
                        </IconButton>
                        
                        <IconButton 
                            onClick={handleSend} 
                            disabled={(commentText.trim() === "" && commentAttachments.length === 0) || addCommentMutation.isPending}
                            className={`compose-send-btn ${(commentText.trim() !== "" || commentAttachments.length > 0) ? 'enabled' : ''}`}
                        >
                            <SendIcon fontSize="small" />
                        </IconButton>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default ViewPost;