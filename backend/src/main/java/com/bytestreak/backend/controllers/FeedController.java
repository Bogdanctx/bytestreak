package com.bytestreak.backend.controllers;


import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PutExchange;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import com.bytestreak.backend.entities.Post;
import com.bytestreak.backend.dto.PostCommentDTO;
import com.bytestreak.backend.dto.PostCreateDTO;
import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.repositories.AccountRepository;
import com.bytestreak.backend.entities.PostComment;
import com.bytestreak.backend.repositories.PostCommentRepository;
import com.bytestreak.backend.services.FeedService;
import com.bytestreak.backend.repositories.PostRepository;

import java.util.List;

@RestController
@RequestMapping("/social/feed")
public class FeedController {
    @Autowired
    private FeedService feedService;
    
    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private PostCommentRepository postCommentRepository;

    // GET /social/feed/posts - Get the feed posts for the authenticated user
    @GetMapping("/posts")
    public ResponseEntity<?> getFeedPosts(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account me = accountRepository.findByEmail(authentication.getName());
        if (me == null) {
            return ResponseEntity.status(404).body("Authenticated user not found");
        }

        try {
            List<Post> feedPosts = feedService.getFeedPosts(me);
            return ResponseEntity.ok(feedPosts);
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while fetching the feed posts.");
        }
    }

    // POST /social/feed/posts - Create a new post in the feed for the authenticated user
    @PostMapping("/posts")
    public ResponseEntity<?> createPost(@RequestBody PostCreateDTO postCreateDTO, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account me = accountRepository.findByEmail(authentication.getName());
        if (me == null) {
            return ResponseEntity.status(404).body("Authenticated user not found");
        }

        try {
            Post newPost = feedService.createPost(me, postCreateDTO);
            return ResponseEntity.ok(newPost);
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while creating the post.");
        }
    }


    // GET /social/feed/posts/{postId} - Get a specific post by ID (optional, for future use)
    @GetMapping("/posts/{postId}")
    public ResponseEntity<?> getPostById(@PathVariable Long postId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) {
            return ResponseEntity.status(404).body("Post not found");
        }

        return ResponseEntity.ok(post);
    }

    // DELETE /social/feed/posts/{postId} - Delete a specific post (only if the authenticated user is the author)
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<?> deletePost(@PathVariable Long postId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) {
            return ResponseEntity.status(404).body("Post not found");
        }

        Account me = accountRepository.findByEmail(authentication.getName());

        if (!post.getAuthor().getId().equals(me.getId())) {
            return ResponseEntity.status(403).body("You can only delete your own posts");
        }

        postRepository.delete(post);
        return ResponseEntity.ok("Post deleted successfully");
    }

    @PutMapping("/posts/{postId}")
    public ResponseEntity<?> updatePost(@PathVariable Long postId, @RequestBody PostCreateDTO postCreateDTO, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Post post = postRepository.findById(postId).orElse(null);
        if (post == null) {
            return ResponseEntity.status(404).body("Post not found");
        }

        Account me = accountRepository.findByEmail(authentication.getName());
        if (!post.getAuthor().getId().equals(me.getId())) {
            return ResponseEntity.status(403).body("You can only update your own posts");
        }

        Post updatedPost = feedService.updatePost(post, postCreateDTO);
        return ResponseEntity.ok(updatedPost);
    }

    // GET /social/feed/posts/{postId}/comments - Get comments for a specific post
    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<?> getCommentsForPost(@PathVariable Long postId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
    
        List<PostComment> comments = postCommentRepository.findByPostId(postId);
        return ResponseEntity.ok(comments);
    }

    // POST /social/feed/posts/{postId}/comment - Add a comment to a specific post
    @PostMapping("/posts/{postId}/comment")
    public ResponseEntity<?> addCommentToPost(@PathVariable Long postId, @RequestBody PostCommentDTO postComment, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        Account me = accountRepository.findByEmail(authentication.getName());

        try {
            PostComment newComment = feedService.createComment(me, postId, postComment);
            return ResponseEntity.ok(newComment);
        }
        catch (Exception e) {
            return ResponseEntity.status(500).body("An error occurred while adding the comment.");
        }
    }

    // DELETE /social/feed/posts/{postId}/comments/{commentId} - Delete a specific comment (only if the authenticated user is the author of the comment)
    @DeleteMapping("/posts/{postId}/comments/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable Long postId, @PathVariable Long commentId, Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        PostComment comment = postCommentRepository.findById(commentId).orElse(null);
        if (comment == null) {
            return ResponseEntity.status(404).body("Comment not found");
        }

        Account me = accountRepository.findByEmail(authentication.getName());
        if (!comment.getAuthor().getId().equals(me.getId())) {
            return ResponseEntity.status(403).body("You can only delete your own comments");
        }

        postCommentRepository.delete(comment);
        return ResponseEntity.ok("Comment deleted successfully");
    }

}
