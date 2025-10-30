package com.webtech.umuganda.core.attendance.model;

import com.webtech.umuganda.core.base.AbstractBaseEntity;
import com.webtech.umuganda.core.umuganda.model.Umuganda;
import com.webtech.umuganda.core.user.model.Users;
import com.webtech.umuganda.util.enums.attendance.EAttendance;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "attendance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Attendance extends AbstractBaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private Users user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "umuganda_id", nullable = false)
    private Umuganda umuganda;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EAttendance attendance;
}
