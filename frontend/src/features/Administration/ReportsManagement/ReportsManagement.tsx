import { Box, Typography, Avatar, Button, CircularProgress, Divider } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api"; // Ajustează calea dacă este necesar
import { type IReport } from "../../../types/report.types";
import notify from "../../../components/ui/ToastNotification";

export default function ReportsManagement() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Fetch reports
    const { data: reports = [], isLoading } = useQuery<IReport[]>({
        queryKey: ['reports'],
        queryFn: async () => {
            const response = await api.get('/reports/all');
            return response.data;
        }
    });

    // Dismiss report mutation
    const dismissMutation = useMutation({
        mutationFn: async (reportId: number) => {
            await api.delete(`/reports/delete/${reportId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['reports'] });
            notify('Report dismissed successfully', 'success');
        }
    });

    // Delete entity & dismiss report mutation
    const deleteEntityMutation = useMutation({
        mutationFn: async ({ endpoint, reportId }: { endpoint: string, reportId: number }) => {
            await api.delete(endpoint); // Șterge entitatea (post, cont, etc)
            await api.delete(`/reports/delete/${reportId}`); // Șterge și report-ul
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
        // Asigură-te că aceste rute există în controllerele tale de pe backend!
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
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box id="reports-management-container" sx={{ p: 3, maxWidth: 800, margin: '0 auto' }}>
            <Typography variant="h5" sx={{ mb: 3, color: 'var(--text-primary)', fontWeight: 'bold' }}>
                Reports Management ({reports.length})
            </Typography>

            {reports.length === 0 && (
                <Typography sx={{ color: 'var(--text-secondary)' }}>No pending reports.</Typography>
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
                } else if (report.reportedPost) {
                    type = 'POST';
                    author = report.reportedPost.author;
                    content = report.reportedPost.text;
                    attachments = report.reportedPost.attachments || [];
                    targetId = report.reportedPost.id!;
                } else if (report.reportedComment) {
                    type = 'COMMENT';
                    author = report.reportedComment.author;
                    content = report.reportedComment.text;
                    attachments = report.reportedComment.attachments || [];
                    targetId = report.reportedComment.id!;
                } else if (report.reportedMessage) {
                    type = 'MESSAGE';
                    author = report.reportedMessage.sender;
                    content = report.reportedMessage.text;
                    attachments = report.reportedMessage.attachments || [];
                    targetId = report.reportedMessage.id!;
                } else if (report.reportedCodingProblem) {
                    type = 'PROBLEM';
                    author = report.reportedCodingProblem.creator;
                    content = report.reportedCodingProblem.title;
                    targetId = report.reportedCodingProblem.id;
                }

                if (!type) return null;

                return (
                    <Box key={report.id} sx={{ mb: 3, p: 2.5, border: '1px solid var(--bg-3)', borderRadius: 2, bgcolor: 'var(--bg-2)' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="caption" sx={{ color: '#ef5350', fontWeight: 'bold' }}>
                                REPORTED BY: {report.reporter.username}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'var(--text-secondary)', fontWeight: 'bold' }}>
                                TYPE: {type}
                            </Typography>
                        </Box>

                        {/* Rendering Account */}
                        {type === 'ACCOUNT' && author && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar src={author.profilePictureUrl} sx={{ width: 56, height: 56 }}>
                                    {!author.profilePictureUrl && author.username.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography sx={{ color: 'var(--text-primary)', fontWeight: 'bold' }}>{author.username}</Typography>
                                    <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>{content}</Typography>
                                </Box>
                            </Box>
                        )}

                        {/* Rendering Post, Comment, Message */}
                        {(type === 'POST' || type === 'COMMENT' || type === 'MESSAGE') && author && (
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                                    <Avatar sx={{ width: 32, height: 32 }} src={author.profilePictureUrl}>
                                        {!author.profilePictureUrl && author.username.charAt(0)}
                                    </Avatar>
                                    <Typography sx={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '14px' }}>
                                        {author.username}
                                    </Typography>
                                </Box>
                                <Typography sx={{ color: 'var(--text-primary)', mb: attachments.length > 0 ? 2 : 0 }}>
                                    {content}
                                </Typography>
                                {attachments.length > 0 && (
                                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                                        {attachments.map((att: any, idx: number) => (
                                            <img key={idx} src={att.filedata} alt="attachment" style={{ maxHeight: 120, borderRadius: 6, objectFit: 'cover' }} />
                                        ))}
                                    </Box>
                                )}
                            </Box>
                        )}

                        {/* Rendering Problem */}
                        {type === 'PROBLEM' && (
                            <Box>
                                <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>{content}</Typography>
                                <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                                    Created by: {author?.username}
                                </Typography>
                            </Box>
                        )}

                        <Divider sx={{ my: 2, borderColor: 'var(--bg-3)' }} />
                        
                        {/* Actions */}
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            {type === 'PROBLEM' ? (
                                <>
                                    <Button size="small" variant="contained" color="primary" onClick={() => navigate(`/creator/edit/${targetId}`)}>
                                        Inspect
                                    </Button>
                                    <Button size="small" variant="outlined" color="success" onClick={() => handleDismiss(report.id)}>
                                        Solved
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button size="small" variant="contained" color="error" onClick={() => handleDelete(report.id, type, targetId)} disabled={deleteEntityMutation.isPending}>
                                        Delete {type.toLowerCase()}
                                    </Button>
                                    <Button size="small" variant="outlined" sx={{ color: 'var(--text-secondary)', borderColor: 'var(--bg-4)' }} onClick={() => handleDismiss(report.id)} disabled={dismissMutation.isPending}>
                                        Dismiss
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}