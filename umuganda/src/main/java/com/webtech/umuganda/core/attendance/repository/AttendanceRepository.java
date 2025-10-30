package com.webtech.umuganda.core.attendance.repository;

import com.webtech.umuganda.core.attendance.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, UUID> {
    List<Attendance> findByUserId(UUID userId);
    List<Attendance> findByUmugandaId(UUID umugandaId);
}
