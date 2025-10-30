package com.webtech.umuganda.core.umuganda.model;

import com.webtech.umuganda.core.attendance.model.Attendance;
import com.webtech.umuganda.core.base.AbstractBaseEntity;
import com.webtech.umuganda.core.location.model.Locations;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "umuganda")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Umuganda extends AbstractBaseEntity {

    @Column(nullable = false, length = 255)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "location_id", nullable = false)
    private Locations location;

    @Column(nullable = false)
    private LocalDateTime date;

    @OneToMany(mappedBy = "umuganda", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Attendance> attendances;
}
