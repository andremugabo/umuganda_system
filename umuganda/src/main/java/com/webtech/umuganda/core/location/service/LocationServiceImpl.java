package com.webtech.umuganda.core.location.service;

import com.webtech.umuganda.core.location.dto.LocationDto;
import com.webtech.umuganda.core.location.model.Locations;
import com.webtech.umuganda.core.location.repository.LocationRepository;
import com.webtech.umuganda.core.location.service.LocationService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LocationServiceImpl implements LocationService {

    private final LocationRepository locationRepository;

    @Override
    public LocationDto createLocation(LocationDto dto) {
        Locations location = new Locations();
        location.setName(dto.getName());
        location.setType(dto.getType());
        location.setRef(dto.getRef());

        if (dto.getParentId() != null) {
            Locations parent = locationRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent location not found"));
            location.setParent(parent);
        }

        Locations saved = locationRepository.save(location);
        return toDto(saved);
    }

    @Override
    public LocationDto updateLocation(UUID id, LocationDto dto) {
        Locations location = locationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Location not found"));

        location.setName(dto.getName());
        location.setType(dto.getType());
        location.setRef(dto.getRef());

        if (dto.getParentId() != null) {
            Locations parent = locationRepository.findById(dto.getParentId())
                    .orElseThrow(() -> new EntityNotFoundException("Parent location not found"));
            location.setParent(parent);
        } else {
            location.setParent(null);
        }

        Locations updated = locationRepository.save(location);
        return toDto(updated);
    }

    @Override
    public void deleteLocation(UUID id) {
        if (!locationRepository.existsById(id)) {
            throw new EntityNotFoundException("Location not found");
        }
        locationRepository.deleteById(id);
    }

    @Override
    public LocationDto getLocationById(UUID id) {
        Locations location = locationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Location not found"));
        return toDto(location);
    }

    @Override
    public List<LocationDto> getAllLocations() {
        return locationRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<LocationDto> getChildren(UUID parentId) {
        return locationRepository.findByParentId(parentId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<LocationDto> getByType(String type) {
        return locationRepository.findByType(type)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Helper method to map Entity -> DTO
    private LocationDto toDto(Locations location) {
        UUID parentId = (location.getParent() != null) ? location.getParent().getId() : null;
        return new LocationDto(
                location.getId(),
                location.getName(),
                location.getType(),
                location.getRef(),
                parentId
        );
    }
}