package com.webtech.umuganda.core.user.model;

import com.webtech.umuganda.core.attendance.model.Attendance;
import com.webtech.umuganda.core.base.AbstractBaseEntity;
import com.webtech.umuganda.core.location.model.Locations;
import com.webtech.umuganda.core.notification.model.Notification;
import com.webtech.umuganda.util.enums.user.ERole;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Users extends AbstractBaseEntity {

    @Column(name = "first_name", nullable = false)
    private String firstName;

    @Column(name = "last_name", nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false, length = 15)
    private String phone;

    @Enumerated(EnumType.STRING)
    @Column(name = "user_role", nullable = false)
    private ERole role;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Locations location;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] picture;

    @Column(name = "otp_code")
    private String otpCode;

    @Column(name = "otp_purpose")
    private String otpPurpose;

    @Column(name = "otp_expires_at")
    private LocalDateTime otpExpiresAt = LocalDateTime.now().plusMinutes(10);

    @Column(name = "is_verified", nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private boolean verified = false;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Attendance> attendances;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Notification> notifications;
}
