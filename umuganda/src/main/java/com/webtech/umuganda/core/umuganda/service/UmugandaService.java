package com.webtech.umuganda.core.umuganda.service;

import com.webtech.umuganda.core.umuganda.dto.UmugandaDto;

import java.util.List;
import java.util.UUID;

public interface UmugandaService {

    UmugandaDto createUmuganda(UmugandaDto dto);

    UmugandaDto updateUmuganda(UUID id, UmugandaDto dto);

    UmugandaDto getUmugandaById(UUID id);

    List<UmugandaDto> getAllUmuganda();

    List<UmugandaDto> getUmugandaByLocation(UUID locationId);

    void deleteUmuganda(UUID id);
}
