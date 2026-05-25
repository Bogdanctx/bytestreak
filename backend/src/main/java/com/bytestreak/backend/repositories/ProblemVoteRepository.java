package com.bytestreak.backend.repositories;

import com.bytestreak.backend.entities.Account;
import com.bytestreak.backend.entities.Problem;
import com.bytestreak.backend.entities.ProblemVote;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProblemVoteRepository extends JpaRepository<ProblemVote, Long> {
    ProblemVote findByProblemAndAccount(Problem problem, Account account);

    int countByProblemAndIsLikeTrue(Problem problem);
    int countByProblemAndIsLikeFalse(Problem problem);
}
