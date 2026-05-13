import { Box, Typography, Avatar, IconButton } from "@mui/material";
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FlagIcon from '@mui/icons-material/Flag';
import { type IPost } from "../../../../types/post.types";
import './FeedPost.style.css';
import { useNavigate } from "react-router-dom";
import { api } from '../../../../api';
import { useMutation } from '@tanstack/react-query';
import notify from '../../../../components/ui/ToastNotification';

interface IFeedPostProps {
    post: IPost;
    onClick: () => void;
}

function FeedPost({ post, onClick }: IFeedPostProps) {
    const navigate = useNavigate();

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

    const isImage = (filedata: string, filename: string) => {
        return filedata?.startsWith('data:image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
    };

    return (
        <Box className={`feed-post-container`} onClick={onClick}>
            <Box className="feed-post-header">
                <Avatar 
                    src={post.author?.profilePictureUrl}
                    className="feed-post-avatar"
                />
                <Box className="feed-post-meta">
                    <Typography className="feed-post-author-name" 
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
                    <Typography className="feed-post-date">
                        {new Date(post.createdAt).toLocaleString()}
                    </Typography>
                </Box>
            </Box>

            <Box className="feed-post-body">
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

            <Box className="feed-post-footer" onClick={onClick}>
                <ChatBubbleOutlineIcon fontSize="small" className="feed-post-icon" />
                <Typography className="feed-post-comment-count">
                    {post.comments?.length || 0} Comments
                </Typography>

                <IconButton 
                    size="small" 
                    className="feed-post-report-btn"
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
        </Box>
    );
}

export default FeedPost;