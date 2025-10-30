package com.webtech.umuganda.core.location.model;

import com.webtech.umuganda.core.base.AbstractBaseEntity;
import com.webtech.umuganda.core.user.model.Users;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "locations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Locations extends AbstractBaseEntity {

    @Column(nullable = false)
    private String name;

    @Column(name = "location_type", nullable = false)
    private String type; //  "PROVINCE", "DISTRICT", "SECTOR", "CELL", "VILLAGE", "ISIBO"

    @Column(name = "reference_code", unique = true, nullable = false)
    private String ref;

    /**
     * Self-referencing relationship:
     * Each location can have a parent (e.g. District → Province)
     * and can contain many child locations (e.g. Province → Districts).
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Locations parent;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    private List<Locations> children;

    /**
     * Relationship with Users (citizens)
     */
    @OneToMany(mappedBy = "location")
    private List<Users> usersList;
}
