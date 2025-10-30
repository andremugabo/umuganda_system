package com.webtech.umuganda.core.attendance.dto;

import com.webtech.umuganda.util.enums.attendance.EAttendance;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDto {

    private UUID id;
    private UUID userId;
    private UUID umugandaId;
    private EAttendance attendance;
}
