package com.webtech.umuganda.core.umuganda.service;

import com.webtech.umuganda.core.location.repository.LocationRepository;
import com.webtech.umuganda.core.umuganda.dto.UmugandaDto;
import com.webtech.umuganda.core.umuganda.model.Umuganda;
import com.webtech.umuganda.core.umuganda.repository.UmugandaRepository;
import com.webtech.umuganda.core.umuganda.service.UmugandaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UmugandaServiceImpl implements UmugandaService {

    private final UmugandaRepository repository;
    private final LocationRepository locationsRepository;

    private UmugandaDto mapToDto(Umuganda entity) {
        UmugandaDto dto = new UmugandaDto();
        dto.setId(entity.getId());
        dto.setDescription(entity.getDescription());
        dto.setDate(entity.getDate());
        if (entity.getLocation() != null) {
            dto.setLocationId(entity.getLocation().getId());
        }
        return dto;
    }

    private Umuganda mapToEntity(UmugandaDto dto) {
        Umuganda entity = new Umuganda();
        entity.setDescription(dto.getDescription());
        entity.setDate(dto.getDate());
        if (dto.getLocationId() != null) {
            locationsRepository.findById(dto.getLocationId())
                    .ifPresent(entity::setLocation);
        }
        return entity;
    }

    @Override
    public UmugandaDto createUmuganda(UmugandaDto dto) {
        Umuganda saved = repository.save(mapToEntity(dto));
        return mapToDto(saved);
    }

    @Override
    public UmugandaDto updateUmuganda(UUID id, UmugandaDto dto) {
        Umuganda entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Umuganda not found"));
        entity.setDescription(dto.getDescription());
        entity.setDate(dto.getDate());
        if (dto.getLocationId() != null) {
            locationsRepository.findById(dto.getLocationId())
                    .ifPresent(entity::setLocation);
        }
        return mapToDto(repository.save(entity));
    }

    @Override
    public UmugandaDto getUmugandaById(UUID id) {
        return repository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Umuganda not found"));
    }

    @Override
    public List<UmugandaDto> getAllUmuganda() {
        return repository.findAll()
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<UmugandaDto> getUmugandaByLocation(UUID locationId) {
        return repository.findByLocationId(locationId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteUmuganda(UUID id) {
        Umuganda entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Umuganda not found"));
        repository.delete(entity);
    }
}
