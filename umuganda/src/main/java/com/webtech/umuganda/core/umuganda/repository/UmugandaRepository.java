package com.webtech.umuganda.core.umuganda.repository;

import com.webtech.umuganda.core.umuganda.model.Umuganda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UmugandaRepository extends JpaRepository<Umuganda, UUID> {
    List<Umuganda> findByLocationId(UUID locationId);
}
