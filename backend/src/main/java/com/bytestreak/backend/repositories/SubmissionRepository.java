package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bytestreak.backend.entities.Submission;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByAccountIdAndProblemId(Long accountId, Long problemId);
    List<Submission> findByProblemId(Long problemId);
    List<Submission> findByAccountId(Long accountId);
}
