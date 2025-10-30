package com.webtech.umuganda.core.location.repository;

import com.webtech.umuganda.core.location.model.Locations;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface LocationRepository extends JpaRepository<Locations, UUID> {

    Optional<Locations> findByRef(String ref);

    List<Locations> findByType(String type);

    List<Locations> findByParentId(UUID parentId);
}
