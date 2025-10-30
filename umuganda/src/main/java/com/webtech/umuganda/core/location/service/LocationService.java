package com.webtech.umuganda.core.location.service;

import com.webtech.umuganda.core.location.dto.LocationDto;
import com.webtech.umuganda.core.location.model.Locations;

import java.util.List;
import java.util.UUID;

public interface LocationService {

    LocationDto createLocation(LocationDto dto);

    LocationDto updateLocation(UUID id, LocationDto dto);

    void deleteLocation(UUID id);

    LocationDto getLocationById(UUID id);

    List<LocationDto> getAllLocations();

    List<LocationDto> getChildren(UUID parentId);

    List<LocationDto> getByType(String type);
}
