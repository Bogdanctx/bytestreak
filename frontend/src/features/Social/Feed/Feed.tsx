import { useRef, useState } from 'react';
import {
    Box,
    Typography,
    Avatar,
    IconButton,
    TextField,
    Paper,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Button,
    MenuItem,
    Collapse
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ReportIcon from '@mui/icons-material/Report';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { type IPost, type IPostComment, type IPostDTO, type IPostCommentDTO } from '../../../types/post.types';
import { type IAttachment } from '../../../types/message.types';
import { type IAccount } from '../../../types/account.types';
import { api } from '../../../api';
import { getLevel, getRank, getRankColor } from '../../../utils/rankUtils';
import { useAccount } from '../../../hooks/useAccount';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Loading from '../../../components/ui/Loading';
import notify from '../../../components/ui/ToastNotification';
import './Feed.style.css';

function Feed() {
    const queryClient = useQueryClient();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: account, isLoading: isAccountLoading } = useAccount();
    
    const [postInput, setPostInput] = useState("");
    const [selectedFiles, setSelectedFiles] = useState<IAttachment[]>([]);
    const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
    const [reportDialogOpen, setReportDialogOpen] = useState(false);
    const [reportingPost, setReportingPost] = useState<IPost | null>(null);
    const [reportReason, setReportReason] = useState("");
    const [commentInput, setCommentInput] = useState<{ [postId: number]: string }>({});

    // Fetch posts from friends
    const { data: postsData = [], isLoading: isPostsLoading } = useQuery<IPost[]>({
        queryKey: ['feedPosts'],
        queryFn: async () => {
            const response = await api.get('/social/feed/posts');
            return response.data;
        },
        refetchInterval: 5000
    });

    // Create post mutation
    const createPostMutation = useMutation({
        mutationFn: async (postDTO: IPostDTO) => {
            const response = await api.post('/social/feed/posts', postDTO);
            return response.data;
        },
        onSuccess: (newPost) => {
            queryClient.setQueryData(['feedPosts'], (oldData: IPost[] | undefined) => {
                const previousPosts = oldData ?? [];
                return [newPost, ...previousPosts];
            });
            setPostInput("");
            setSelectedFiles([]);
            notify("Post created successfully!", "success");
        },
        onError: (error) => {
            console.error('Error creating post:', error);
            notify("Failed to create post. Please try again.", "error");
        }
    });



    // Report post mutation
    const reportPostMutation = useMutation({
        mutationFn: async ({ postId, reason }: { postId: number; reason: string }) => {
            const response = await api.post(`/social/feed/posts/${postId}/report`, { reason });
            return response.data;
        },
        onSuccess: () => {
            setReportDialogOpen(false);
            setReportingPost(null);
            setReportReason("");
            notify("Post reported successfully.", "success");
        },
        onError: (error) => {
            console.error('Error reporting post:', error);
            notify("Failed to report post. Please try again.", "error");
        }
    });

    // Add comment mutation
    const addCommentMutation = useMutation({
        mutationFn: async ({ postId, commentDTO }: { postId: number; commentDTO: IPostCommentDTO }) => {
            const response = await api.post(`/social/feed/posts/${postId}/comment`, commentDTO);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['feedPosts'] });
            setCommentInput({});
            notify("Comment added successfully!", "success");
        },
        onError: (error) => {
            console.error('Error adding comment:', error);
            notify("Failed to add comment. Please try again.", "error");
        }
    });

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

    const handleSendPost = async () => {
        if (postInput.trim() === "" && selectedFiles.length === 0) {
            return;
        }

        const postDTO: IPostDTO = {
            text: postInput,
            attachments: selectedFiles.map(file => ({
                id: null,
                filename: file.filename,
                filedata: file.filedata
            }))
        };

        createPostMutation.mutate(postDTO);
    };

    const handleRemoveFile = (index: number) => {
        setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const toggleCommentsExpanded = (postId: number) => {
        const newExpanded = new Set(expandedPosts);
        if (newExpanded.has(postId)) {
            newExpanded.delete(postId);
        } else {
            newExpanded.add(postId);
        }
        setExpandedPosts(newExpanded);
    };

    const handleReportClick = (post: IPost) => {
        setReportingPost(post);
        setReportDialogOpen(true);
    };

    const handleReportSubmit = () => {
        if (reportingPost && reportReason.trim() !== "") {
            reportPostMutation.mutate({ postId: reportingPost.id!, reason: reportReason });
        }
    };

    const handleAddComment = (postId: number) => {
        const text = commentInput[postId]?.trim();
        if (text) {
            addCommentMutation.mutate({
                postId,
                commentDTO: { text }
            });
        }
    };

    const formatDate = (dateString: string): string => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString();
        } catch {
            return dateString;
        }
    };

    if (isAccountLoading) {
        return <Loading />;
    }

    if (!account) {
        return <Typography className="feed-error">Failed to load account information.</Typography>;
    }

    return (
        <Box className="feed-container">
            {/* Post Composer Header */}
            <Paper className="feed-composer">
                <Box className="feed-composer-header">
                    <Avatar
                        src={account.profilePictureUrl}
                        sx={{ width: 48, height: 48, mr: 2 }}
                    >
                        {!account.profilePictureUrl && account.username.charAt(0).toUpperCase()}
                    </Avatar>

                    <Box className="feed-composer-input-area">
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            variant="outlined"
                            size="small"
                            placeholder="What's on your mind?"
                            value={postInput}
                            onChange={(e) => setPostInput(e.target.value)}
                            className="feed-composer-textarea"
                        />
                    </Box>
                </Box>

                {/* File Preview */}
                {selectedFiles.length > 0 && (
                    <Box className="feed-composer-file-preview-wrap">
                        {selectedFiles.map((file, index) => {
                            if (file.filedata.startsWith('data:image')) {
                                return (
                                    <Box key={index} className="feed-composer-preview-item">
                                        <img src={file.filedata} alt={file.filename} className="feed-composer-preview-image" />
                                        <IconButton
                                            size="small"
                                            onClick={() => handleRemoveFile(index)}
                                            className="feed-composer-remove-file"
                                        >
                                            ×
                                        </IconButton>
                                    </Box>
                                );
                            }
                            return (
                                <Box key={index} className="feed-composer-preview-file">
                                    <AttachFileIcon className="feed-composer-preview-file-icon" />
                                    <Typography variant="caption" className="feed-composer-preview-file-name">
                                        {file.filename}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveFile(index)}
                                        className="feed-composer-remove-file"
                                    >
                                        ×
                                    </IconButton>
                                </Box>
                            );
                        })}
                    </Box>
                )}

                {/* Action Buttons */}
                <Box className="feed-composer-footer">
                    <input
                        type="file"
                        multiple
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="feed-composer-hidden-file-input"
                        accept="image/*,.pdf,.txt,.doc,.docx"
                    />
                    <IconButton
                        onClick={() => fileInputRef.current?.click()}
                        className={`feed-composer-attach-btn ${selectedFiles.length > 0 ? 'active' : ''}`}
                        size="small"
                    >
                        <AttachFileIcon />
                    </IconButton>

                    <Box className="feed-composer-spacer" />

                    <Button
                        variant="contained"
                        onClick={handleSendPost}
                        disabled={postInput.trim() === "" && selectedFiles.length === 0}
                        className="feed-composer-send-btn"
                        startIcon={<SendIcon />}
                    >
                        Send
                    </Button>
                </Box>
            </Paper>

            {/* Posts Feed */}
            <Box className="feed-posts-container">
                {isPostsLoading ? (
                    <Loading />
                ) : postsData.length === 0 ? (
                    <Typography className="feed-empty-state">
                        No posts yet. Start following some friends!
                    </Typography>
                ) : (
                    postsData.map((post) => {
                        const isExpanded = expandedPosts.has(post.id || 0);
                        const level = getLevel(post.author.currentXP);
                        const rank = getRank(level);
                        const rankColor = getRankColor(rank);

                        return (
                            <Paper key={post.id} className="feed-post">
                                {/* Post Header */}
                                <Box className="feed-post-header">
                                    <Avatar
                                        src={post.author.profilePictureUrl}
                                        sx={{ width: 40, height: 40, border: `2px solid ${rankColor}`, mr: 1.5 }}
                                    >
                                        {!post.author.profilePictureUrl && post.author.username.charAt(0).toUpperCase()}
                                    </Avatar>

                                    <Box className="feed-post-author-info">
                                        <Typography className="feed-post-username">
                                            {post.author.username}
                                        </Typography>
                                        <Typography className="feed-post-date">
                                            {formatDate(post.createdAt)}
                                        </Typography>
                                    </Box>

                                    <Box className="feed-post-spacer" />

                                    <IconButton
                                        size="small"
                                        onClick={() => handleReportClick(post)}
                                        className="feed-post-report-btn"
                                    >
                                        <ReportIcon fontSize="small" />
                                    </IconButton>
                                </Box>

                                {/* Post Content */}
                                <Box className="feed-post-content">
                                    <Typography className="feed-post-text">
                                        {post.text}
                                    </Typography>

                                    {/* Post Attachments */}
                                    {post.attachments && post.attachments.length > 0 && (
                                        <Box className="feed-post-attachments">
                                            {post.attachments.map((attachment, index) => {
                                                if (attachment.filedata.startsWith('data:image')) {
                                                    return (
                                                        <img
                                                            key={index}
                                                            src={attachment.filedata}
                                                            alt={attachment.filename}
                                                            className="feed-post-attachment-image"
                                                        />
                                                    );
                                                }

                                                return (
                                                    <Box key={index} className="feed-post-attachment-file">
                                                        <AttachFileIcon className="feed-post-attachment-icon" />
                                                        <Typography variant="caption" className="feed-post-attachment-name">
                                                            {attachment.filename}
                                                        </Typography>
                                                        <IconButton
                                                            component="a"
                                                            href={attachment.filedata}
                                                            download={attachment.filename}
                                                            size="small"
                                                            className="feed-post-attachment-download"
                                                        >
                                                            <DownloadIcon fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                );
                                            })}
                                        </Box>
                                    )}
                                </Box>

                                {/* Post Actions */}
                                <Box className="feed-post-actions">
                                    <Box className="feed-post-buttons">
                                        <IconButton
                                            onClick={() => toggleCommentsExpanded(post.id || 0)}
                                            className="feed-post-action-btn"
                                            size="small"
                                        >
                                            <ChatBubbleOutlineIcon fontSize="small" />
                                            Comment
                                            {isExpanded ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                        </IconButton>
                                    </Box>
                                </Box>

                                {/* Comments Section */}
                                <Collapse in={isExpanded} timeout="auto">
                                    <Box className="feed-post-comments">
                                        {/* Existing Comments */}
                                        {post.comments && post.comments.length > 0 && (
                                            <Box className="feed-post-comments-list">
                                                {post.comments.map((comment) => (
                                                    <Paper key={comment.id} className="feed-comment">
                                                        <Box className="feed-comment-header">
                                                            <Avatar
                                                                src={comment.author.profilePictureUrl}
                                                                sx={{ width: 32, height: 32, mr: 1 }}
                                                            >
                                                                {!comment.author.profilePictureUrl && comment.author.username.charAt(0).toUpperCase()}
                                                            </Avatar>

                                                            <Box className="feed-comment-info">
                                                                <Typography className="feed-comment-author">
                                                                    {comment.author.username}
                                                                </Typography>
                                                                <Typography className="feed-comment-date">
                                                                    {formatDate(comment.createdAt)}
                                                                </Typography>
                                                            </Box>
                                                        </Box>

                                                        <Typography className="feed-comment-text">
                                                            {comment.text}
                                                        </Typography>
                                                    </Paper>
                                                ))}
                                            </Box>
                                        )}

                                        {/* Comment Input */}
                                        <Box className="feed-comment-input-area">
                                            <Avatar
                                                src={account.profilePictureUrl}
                                                sx={{ width: 32, height: 32, mr: 1 }}
                                            >
                                                {!account.profilePictureUrl && account.username.charAt(0).toUpperCase()}
                                            </Avatar>

                                            <TextField
                                                size="small"
                                                fullWidth
                                                variant="outlined"
                                                placeholder="Write a comment..."
                                                value={commentInput[post.id || 0] || ""}
                                                onChange={(e) =>
                                                    setCommentInput({
                                                        ...commentInput,
                                                        [post.id || 0]: e.target.value
                                                    })
                                                }
                                                className="feed-comment-input"
                                            />

                                            <IconButton
                                                onClick={() => handleAddComment(post.id || 0)}
                                                disabled={(commentInput[post.id || 0] || "").trim() === ""}
                                                className="feed-comment-send-btn"
                                                size="small"
                                            >
                                                <SendIcon fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </Collapse>
                            </Paper>
                        );
                    })
                )}
            </Box>

            {/* Report Dialog */}
            <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} className="feed-report-dialog">
                <DialogTitle>Report Post</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please select a reason for reporting this post:
                    </DialogContentText>
                    <TextField
                        select
                        fullWidth
                        value={reportReason}
                        onChange={(e) => setReportReason(e.target.value)}
                        className="feed-report-reason-select"
                        margin="normal"
                    >
                        <MenuItem value="spam">Spam</MenuItem>
                        <MenuItem value="inappropriate">Inappropriate Content</MenuItem>
                        <MenuItem value="harassment">Harassment</MenuItem>
                        <MenuItem value="misinformation">Misinformation</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleReportSubmit}
                        disabled={reportReason.trim() === ""}
                        variant="contained"
                        color="error"
                    >
                        Report
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Feed;
