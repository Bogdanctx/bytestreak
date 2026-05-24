import { useEffect, useMemo, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Box, Button, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { api } from '../../../api';
import { useAccount } from '../../../hooks/useAccount';
import { type ISubmission } from '../../../types/submission.types';
import './ProblemSubmissions.style.css';
import AccountAvatar from '../../../components/ui/AccountAvatar';

type SubmissionScope = 'your' | 'all';

interface ProblemSubmissionsProps {
    problemId: number;
}

function formatSubmissionDate(createdAt: string) {
    return new Date(createdAt).toLocaleString();
}

function formatSubmissionScore(score: number) {
    return `${score.toFixed(1)}%`;
}

function ProblemSubmissions({ problemId }: ProblemSubmissionsProps) {
    const navigate = useNavigate();
    const { data: account, isLoading: isAccountLoading } = useAccount();
    const [activeScope, setActiveScope] = useState<SubmissionScope>('your');
    const [selectedSubmissionId, setSelectedSubmissionId] = useState<number | null>(null);

    const { data: yourSubmissions = [], isLoading: isLoadingYourSubmissions } = useQuery<ISubmission[]>({
        queryKey: ['problem-submissions', problemId, account?.id, 'your'],
        queryFn: async () => {
            const response = await api.get(`/submissions/account/${account?.id}/problem/${problemId}`);
            return response.data;
        },
        enabled: Boolean(account?.id),
    });

    const { data: allSubmissions = [], isLoading: isLoadingAllSubmissions } = useQuery<ISubmission[]>({
        queryKey: ['problem-submissions', problemId, 'all'],
        queryFn: async () => {
            const response = await api.get(`/submissions/problem/${problemId}`);
            return response.data;
        },
    });

    const visibleSubmissions = useMemo(() => {
        const submissions = activeScope === 'your' ? yourSubmissions : allSubmissions;

        return [...submissions].sort((leftSubmission, rightSubmission) => {
            return new Date(rightSubmission.createdAt).getTime() - new Date(leftSubmission.createdAt).getTime();
        });
    }, [activeScope, allSubmissions, yourSubmissions]);

    const selectedSubmission = useMemo(() => {
        if (visibleSubmissions.length === 0) {
            return null;
        }

        return visibleSubmissions.find((submission) => submission.id === selectedSubmissionId) ?? visibleSubmissions[0];
    }, [selectedSubmissionId, visibleSubmissions]);

    useEffect(() => {
        if (visibleSubmissions.length === 0) {
            setSelectedSubmissionId(null);
            return;
        }

        setSelectedSubmissionId((currentSelectedId) => {
            if (currentSelectedId !== null && visibleSubmissions.some((submission) => submission.id === currentSelectedId)) {
                return currentSelectedId;
            }

            return visibleSubmissions[0].id;
        });
    }, [visibleSubmissions]);

    const isLoading = activeScope === 'your'
        ? (isAccountLoading || isLoadingYourSubmissions)
        : isLoadingAllSubmissions;

    return (
        <Box className="problem-submissions-container">
            <Box className="problem-submissions-toolbar">
                <Button
                    className={`submission-scope-button ${activeScope === 'your' ? 'active' : ''}`}
                    onClick={() => setActiveScope('your')}
                >
                    Your submissions
                </Button>
                <Button
                    className={`submission-scope-button ${activeScope === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveScope('all')}
                >
                    All submissions
                </Button>
            </Box>

            {isLoading && (
                <Box className="submission-empty-state">
                    <Typography variant="body1">
                        Loading submissions...
                    </Typography>
                </Box>
            )}

            {!isLoading && visibleSubmissions.length === 0 && (
                <Box className="submission-empty-state">
                    <Typography variant="body1">
                        {activeScope === 'your'
                            ? 'You have not submitted a solution for this problem yet.'
                            : 'No submissions have been made for this problem yet.'}
                    </Typography>
                </Box>
            )}

            {!isLoading && visibleSubmissions.length > 0 && selectedSubmission && (
                <Box className="problem-submissions-layout">
                    <Box className="problem-submissions-list">
                        {visibleSubmissions.map((submission) => (
                            <Button
                                key={submission.id}
                                className={`submission-card ${submission.id === selectedSubmission.id ? 'selected' : ''}`}
                                onClick={() => setSelectedSubmissionId(submission.id)}
                            >
                                <Box className="submission-card-header">
                                    <Box display={'flex'} alignItems={'center'} gap={1}>
                                        <AccountAvatar avatarUrl={submission.account.profilePictureUrl} cssEffectStyle={submission.account.cssEffectStyle} width={20} height={20} />

                                        <Typography className="submission-author" variant="body2">
                                            {submission.account.username}
                                        </Typography>
                                    </Box>
                                    <Box className="submission-score-badge"
                                    >
                                        {formatSubmissionScore(submission.percentageCorrect)}
                                    </Box>
                                </Box>

                                <Typography className="submission-card-date" variant="caption">
                                    {formatSubmissionDate(submission.createdAt)}
                                </Typography>
                            </Button>
                        ))}
                    </Box>

                    <Box className="submission-detail-panel">
                        <Box className="submission-detail-header">
                            <Box>
                                <Typography className="submission-detail-label" variant="caption">
                                    Submission score
                                </Typography>
                                <Typography className="submission-detail-score" variant="h4">
                                    {formatSubmissionScore(selectedSubmission.percentageCorrect)}
                                </Typography>
                            </Box>

                            <Box className="submission-detail-meta">
                                <Box display={'flex'} alignItems={'center'} gap={1}>
                                    <Typography className="submission-detail-meta-line" variant="body2">
                                        By <span className='submission-author-information' onClick={() => navigate(`/accounts/profile/${selectedSubmission.account.username}`)}>
                                            {selectedSubmission.account.username}
                                        </span>
                                    </Typography>
                                    <AccountAvatar avatarUrl={selectedSubmission.account.profilePictureUrl} cssEffectStyle={selectedSubmission.account.cssEffectStyle} width={20} height={20} />
                                </Box>
                                <Typography className="submission-detail-meta-line" variant="body2">
                                    {formatSubmissionDate(selectedSubmission.createdAt)}
                                </Typography>
                            </Box>
                        </Box>

                        <Box className="submission-code-section">
                            <Typography className="submission-code-label" variant="caption">
                                Source code
                            </Typography>

                            <Box className="submission-code-editor-shell">
                                <Editor
                                    theme="vs-dark"
                                    height="100%"
                                    language="plaintext"
                                    value={selectedSubmission.starterCode}
                                    options={{
                                        readOnly: true,
                                        minimap: { enabled: false },
                                        scrollBeyondLastLine: false,
                                        automaticLayout: true,
                                        fontSize: 14,
                                        padding: { top: 12 },
                                        lineNumbers: 'on',
                                    }}
                                />
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    );
}

export default ProblemSubmissions;