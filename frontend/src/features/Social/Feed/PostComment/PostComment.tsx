import { Avatar, Box, IconButton, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FlagIcon from '@mui/icons-material/Flag';
import "./PostComment.style.css";
import type { IPost, IPostComment } from "../../../../types/post.types";
import { useMutation, type UseMutationResult } from "@tanstack/react-query";
import { useAccount } from "../../../../hooks/useAccount";
import { api } from "../../../../api";
import notify from "../../../../components/ui/ToastNotification";
import DeleteIcon from '@mui/icons-material/Delete';

const isImage = (filedata: string, filename: string) => {
    return filedata?.startsWith('data:image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(filename);
};

interface IPostCommentProps {
    comment: IPostComment;
    post: IPost;
    deleteCommentMutation: UseMutationResult<any, Error, number, unknown>
}

function PostComment({ comment, post, deleteCommentMutation }: IPostCommentProps) {
    const navigate = useNavigate();
    const { data: account } = useAccount();

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

    return (
        <Box className="comment-item">
            <Avatar src={comment.author?.profilePictureUrl} className="comment-avatar" />
            <Box flex={1}>
                <Box display={"flex"} alignItems="center" gap={1}>
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
                    

                    {comment.author.id === account?.id && (
                        <IconButton
                            size="small"
                            sx={{ color: "var(--difficulty-hard)" }}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (comment.id == null) {
                                    return;
                                }
                                deleteCommentMutation.mutate(comment.id);
                            }}
                            disabled={reportCommentMutation.isPending}
                            aria-label="Report comment"
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    )}

                    <IconButton
                        size="small"
                        className="report-flag"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (comment.id == null) {
                                return;
                            }
                            reportCommentMutation.mutate(comment.id);
                        }}
                        disabled={reportCommentMutation.isPending}
                        aria-label="Report comment"
                        sx={{ marginLeft: "auto", opacity: 0 }}
                    >
                        <FlagIcon fontSize="small" />
                    </IconButton>
                </Box>
                <Box className="comment-content">
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
        </Box>
    )
}

export default PostComment;