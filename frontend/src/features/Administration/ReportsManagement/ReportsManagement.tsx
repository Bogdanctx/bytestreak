import { Box, Typography, Avatar, Button, CircularProgress, Divider } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api"; 
import { type IReport } from "../../../types/report.types";
import notify from "../../../components/ui/ToastNotification";
import './ReportsManagement.style.css';

export default function ReportsManagement() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data: reports = [], isLoading } = useQuery<IReport[]>({
        queryKey: ['reports'],
        queryFn: async () => {
            const response = await api.get('/reports/all');
            return response.data;
        }
    });

    const dismissMutation = useMutation({
        mutationFn: async (reportId: number) => {
            await api.delete(`/reports/delete/${reportId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            notify('Report dismissed successfully', 'success');
        }
    });

    const deleteEntityMutation = useMutation({
        mutationFn: async ({ endpoint, reportId }: { endpoint: string, reportId: number }) => {
            await api.delete(endpoint); 
            await api.delete(`/reports/delete/${reportId}`); 
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            notify('Content deleted and report resolved', 'success');
        },
        onError: () => {
            notify('Failed to delete content. Check backend endpoints.', 'error');
        }
    });

    const handleDismiss = (reportId: number) => {
        dismissMutation.mutate(reportId);
    };

    const handleDelete = (reportId: number, type: string, targetId: number) => {
        let endpoint = '';
        if (type === 'ACCOUNT') endpoint = `/accounts/${targetId}`;
        else if (type === 'POST') endpoint = `/social/feed/posts/${targetId}`;
        else if (type === 'COMMENT') endpoint = `/social/feed/comments/${targetId}`; 
        else if (type === 'MESSAGE') endpoint = `/messages/${targetId}`;
        
        if (endpoint) {
            deleteEntityMutation.mutate({ endpoint, reportId });
        }
    };

    if (isLoading) {
        return (
            <Box className="reports-loading">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box id="reports-management-container" className="reports-container">
            <Box className="reports-header">
                <Typography variant="h5" className="reports-title">
                    Reports Management ({reports.length})
                </Typography>
            </Box>

            <Box className="reports-content">
                {reports.length === 0 && (
                    <Typography className="reports-empty">No pending reports.</Typography>
                )}

                {reports.map(report => {
                    let type = '';
                    let content: string | null = null;
                    let author: any = null;
                    let attachments: any[] = [];
                    let targetId = 0;
                    
                    if (report.reportedAccount) {
                        type = 'ACCOUNT';
                        author = report.reportedAccount;
                        content = author.bio || 'No bio available.';
                        targetId = author.id;
                    } 
                    else if (report.reportedPost) {
                        type = 'POST';
                        author = report.reportedPost.author;
                        content = report.reportedPost.text;
                        attachments = report.reportedPost.attachments || [];
                        targetId = report.reportedPost.id!;
                    } 
                    else if (report.reportedComment) {
                        type = 'COMMENT';
                        author = report.reportedComment.author;
                        content = report.reportedComment.text;
                        attachments = report.reportedComment.attachments || [];
                        targetId = report.reportedComment.id!;
                    } 
                    else if (report.reportedMessage) {
                        type = 'MESSAGE';
                        author = report.reportedMessage.sender;
                        content = report.reportedMessage.text;
                        attachments = report.reportedMessage.attachments || [];
                        targetId = report.reportedMessage.id!;
                    } 
                    else if (report.reportedCodingProblem) {
                        type = 'PROBLEM';
                        author = report.reportedCodingProblem.creator;
                        content = report.reportedCodingProblem.title;
                        targetId = report.reportedCodingProblem.id;
                    }

                    if (!type) {
                        return null;
                    }

                    return (
                        <Box key={report.id} className="report-card">
                            <Box className="report-header">
                                <Typography variant="caption" className="report-reporter-text">
                                    REPORTED BY: 
                                    <span className="report-account-underline" 
                                        onClick={() => navigate(`/accounts/profile/${report.reporter.username}`)}
                                    >
                                        {report.reporter.username}
                                    </span>
                                </Typography>
                                <Typography variant="caption" className="report-type-text">
                                    TYPE: {type}
                                </Typography>
                            </Box>

                            {/* Rendering Account */}
                            {type === 'ACCOUNT' && author && (
                                <Box className="report-account-box">
                                    <Avatar src={author.profilePictureUrl} className="report-account-avatar">
                                        {!author.profilePictureUrl && author.username.charAt(0)}
                                    </Avatar>
                                    <Box>
                                        <Typography className="report-account-underline report-account-username"
                                                onClick={() => navigate(`/accounts/profile/${author.username}`)}
                                        >
                                            {author.username}
                                        </Typography>
                                        <Typography variant="body2" className="report-account-bio">{content}</Typography>
                                    </Box>
                                </Box>
                            )}

                            {/* Rendering Post, Comment, Message */}
                            {(type === 'POST' || type === 'COMMENT' || type === 'MESSAGE') && author && (
                                <Box>
                                    <Box className="report-content-header">
                                        <Avatar className="report-content-avatar" src={author.profilePictureUrl}>
                                            {!author.profilePictureUrl && author.username.charAt(0)}
                                        </Avatar>
                                        <Typography className="report-account-underline report-content-username" 
                                                onClick={() => navigate(`/accounts/profile/${author.username}`)}
                                        >
                                            {author.username}
                                        </Typography>
                                    </Box>
                                    
                                    <Typography className="report-content-text">
                                        {content}
                                    </Typography>

                                    {attachments.length > 0 && (
                                        <Box className="report-content-attachments">
                                            {attachments.map((att: any, idx: number) => (
                                                <img key={idx} src={att.filedata} alt="attachment" className="report-attachment-image" />
                                            ))}
                                        </Box>
                                    )}
                                </Box>
                            )}

                            {/* Rendering Problem */}
                            {type === 'PROBLEM' && (
                                <Box>
                                    <Typography variant="h6" className="report-problem-title">{content}</Typography>
                                    <Typography variant="caption" className="report-problem-author">
                                        Created by: 
                                        <span className="report-account-underline"  
                                            onClick={() => navigate(`/accounts/profile/${author?.username}`)}
                                        >
                                            {author?.username}
                                        </span>
                                    </Typography>
                                </Box>
                            )}

                            <Divider className="report-divider" />
                            
                            {/* Actions */}
                            <Box className="report-actions">
                                {type === 'PROBLEM' ? (
                                    <>
                                        <Button className="reports-inspect-button" onClick={() => navigate(`/creator/edit/${targetId}`)}>
                                            Inspect
                                        </Button>
                                        <Button className="reports-solved-button" onClick={() => handleDismiss(report.id)}>
                                            Solved
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Button size="small" variant="contained" color="error" onClick={() => handleDelete(report.id, type, targetId)} disabled={deleteEntityMutation.isPending}>
                                            Delete {type.toLowerCase()}
                                        </Button>
                                        <Button size="small" variant="outlined" className="report-action-dismiss" onClick={() => handleDismiss(report.id)} disabled={dismissMutation.isPending}>
                                            Dismiss
                                        </Button>
                                    </>
                                )}
                            </Box>
                        </Box>
                    );
                })}
            </Box>
        </Box>
    );
}