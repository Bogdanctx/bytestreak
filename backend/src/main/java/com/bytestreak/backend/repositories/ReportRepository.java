package com.bytestreak.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import com.bytestreak.backend.entities.Report;

public interface ReportRepository extends JpaRepository<Report, Long> {

}