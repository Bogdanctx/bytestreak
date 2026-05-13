import { Box, Typography } from '@mui/material';
import FeedHeader from './FeedHeader/FeedHeader';
import FeedPost from './FeedPost/FeedPost';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import { type IPost } from '../../../types/post.types';
import { api } from '../../../api';
import notify from '../../../components/ui/ToastNotification';
import './Feed.style.css';
import type { IAttachment } from '../../../types/message.types';
import { useState } from 'react';
import ViewPost from './ViewPost/ViewPost';

function Feed() {
    const queryClient = useQueryClient();
    const { data: feedPosts } = useQuery<IPost[]>({
        queryKey: ['feedPosts'],
        queryFn: async () => {
            const response = await api.get('/social/feed/posts');
            return response.data;
        }
    });
    const [viewingPost, setViewingPost] = useState<IPost | null>(null);

    const newPostMutation = useMutation({
        mutationFn: async ({ text, attachments }: { text: string; attachments: IAttachment[] }) => {
            const response = await api.post('/social/feed/posts', { text, attachments });
            return response.data;
        },
        onSuccess: (newPost: IPost) => {
            // On success, append the post to the feed without refetching
            queryClient.setQueryData<IPost[]>(['feedPosts'], (oldPosts) => {
                return [newPost, ...(oldPosts || [])];
            });
        },
        onError: (error) => {
            notify('Failed to create post. Please try again.', 'error');
        }
    });

    const handleCreateNewPost = (text: string, attachments: IAttachment[]) => {
        newPostMutation.mutate({ text, attachments });
    }

    return (
        <Box id="feed-container">
            {viewingPost === null ? (
                <>
                    <FeedHeader onPost={handleCreateNewPost} />

                    <Box id="feed-posts-container">
                        {feedPosts && feedPosts.length > 0 ? (
                            feedPosts.map(post => (
                                <FeedPost key={post.id} 
                                            post={post}
                                            onClick={() => setViewingPost(post)}                               
                                />
                            ))
                        ) : (
                            <Typography variant="body1" sx={{ color: "var(--text-primary)" }}>
                                No posts to display. Start by creating a new post!
                            </Typography>
                        )}
                    </Box>
                </>
            ) : (
                <ViewPost post={viewingPost} goBack={() => setViewingPost(null)}/>
            )}
        </Box>
    );
}

export default Feed;