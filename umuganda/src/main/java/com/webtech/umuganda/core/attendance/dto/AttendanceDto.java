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
    private UUID locationId; // Location from the Umuganda event
    private EAttendance attendance;

    // Additional fields for frontend display
    private String userName; // Full name of the user
    private String eventDescription; // Description of the Umuganda event
}
