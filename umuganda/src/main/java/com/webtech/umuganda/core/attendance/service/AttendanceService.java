package com.webtech.umuganda.core.attendance.service;

import com.webtech.umuganda.core.attendance.dto.AttendanceDto;

import java.util.List;
import java.util.UUID;

public interface AttendanceService {

    AttendanceDto createAttendance(AttendanceDto dto);

    AttendanceDto updateAttendance(UUID id, AttendanceDto dto);

    AttendanceDto getAttendanceById(UUID id);

    List<AttendanceDto> getAllAttendance();

    List<AttendanceDto> getByUserId(UUID userId);

    List<AttendanceDto> getByUmugandaId(UUID umugandaId);

    void deleteAttendance(UUID id);
}
