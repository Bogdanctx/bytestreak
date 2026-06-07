package com.bytestreak.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.bytestreak.backend.entities.Post;
import com.bytestreak.backend.entities.PostComment;
import com.bytestreak.backend.exceptions.UnauthorizedActionException;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Attachment;
import com.bytestreak.backend.entities.Friendship;
import com.bytestreak.backend.repositories.FriendshipRepository;
import com.bytestreak.backend.repositories.PostRepository;
import com.bytestreak.backend.repositories.PostCommentRepository;
import com.bytestreak.backend.dto.AttachmentDTO;
import com.bytestreak.backend.dto.PostCommentDTO;
import com.bytestreak.backend.dto.PostCreateDTO;

import java.util.List;
import java.util.ArrayList;

@Service
public class FeedService {
    @Autowired
    private FriendshipRepository friendshipRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostCommentRepository postCommentRepository;

    public List<Post> getFeedPosts(Account account) {
        List<Friendship> friendships = friendshipRepository.findFriendshipsOfAccount(account);
        List<Post> feedPosts = new ArrayList<>();
        
        for (Friendship friendship : friendships) {
            Account friendAccount = friendship.getAccount1();

            // Determine the friend account (the other account in the friendship)
            if (friendAccount.getId().equals(account.getId())) {
                friendAccount = friendship.getAccount2();
            }

            // Fetch posts from the friend account and add them to the feed
            List<Post> friendPosts = postRepository.findByAuthor(friendAccount);

            feedPosts.addAll(friendPosts);
        }

        // Add the user's own posts to the feed
        List<Post> myPosts = postRepository.findByAuthor(account);
        feedPosts.addAll(myPosts);

        feedPosts.sort((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()));
        return feedPosts;
    }

    public Post createPost(Account author, PostCreateDTO postCreateDTO) {
        Post newPost = new Post();
        newPost.setAuthor(author);
        newPost.setText(postCreateDTO.getText());

        for (AttachmentDTO attachment : postCreateDTO.getAttachments()) {
            Attachment newAttachment = new Attachment();
            newAttachment.setFiledata(attachment.getFiledata());
            newAttachment.setFilename(attachment.getFilename());
            newAttachment.setPost(newPost);
            
            newPost.getAttachments().add(newAttachment);
        }

        return postRepository.save(newPost);
    }

    public PostComment createComment(Account author, Post post, PostCommentDTO postComment) {
        Account postAuthor = post.getAuthor();

        boolean isOwnPost = postAuthor.getId().equals(author.getId());
        boolean isFriendPost = friendshipRepository.findByAccount1AndAccount2(author, postAuthor) != null;

        if (!isOwnPost && !isFriendPost) {
            throw new UnauthorizedActionException("You can only comment on your own posts or posts of your friends");
        }

        PostComment newComment = new PostComment();
        newComment.setAuthor(author);
        newComment.setPost(post);
        newComment.setText(postComment.getText());

        for (AttachmentDTO attachment : postComment.getAttachments()) {
            Attachment newAttachment = new Attachment();
            newAttachment.setFiledata(attachment.getFiledata());
            newAttachment.setFilename(attachment.getFilename());
            newAttachment.setPostComment(newComment);

            newComment.getAttachments().add(newAttachment);
        }

        postCommentRepository.save(newComment);

        return newComment;
    }

    public Post updatePost(Post post, PostCreateDTO postCreateDTO) {
        post.setText(postCreateDTO.getText());
        post.getAttachments().clear();
        for (AttachmentDTO attachment : postCreateDTO.getAttachments()) {
            Attachment newAttachment = new Attachment();
            newAttachment.setFiledata(attachment.getFiledata());
            newAttachment.setFilename(attachment.getFilename());
            
            post.getAttachments().add(newAttachment);
        }

        return postRepository.save(post);
    }
}
