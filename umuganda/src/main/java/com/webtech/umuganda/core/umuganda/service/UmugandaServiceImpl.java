package com.webtech.umuganda.core.umuganda.service;

import com.webtech.umuganda.core.attendance.model.Attendance;
import com.webtech.umuganda.core.attendance.repository.AttendanceRepository;
import com.webtech.umuganda.core.location.repository.LocationRepository;
import com.webtech.umuganda.core.notification.model.Notification;
import com.webtech.umuganda.core.notification.repository.NotificationRepository;
import com.webtech.umuganda.core.umuganda.dto.UmugandaDto;
import com.webtech.umuganda.core.umuganda.model.Umuganda;
import com.webtech.umuganda.core.umuganda.repository.UmugandaRepository;
import com.webtech.umuganda.core.user.model.Users;
import com.webtech.umuganda.core.user.repository.UsersRepository;
import com.webtech.umuganda.util.enums.attendance.EAttendance;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UmugandaServiceImpl implements UmugandaService {

    private final UmugandaRepository repository;
    private final LocationRepository locationsRepository;
    private final UsersRepository usersRepository;
    private final AttendanceRepository attendanceRepository;
    private final NotificationRepository notificationRepository;

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
    @Transactional
    public UmugandaDto createUmuganda(UmugandaDto dto) {
        Umuganda saved = repository.save(mapToEntity(dto));

        // Create attendance records and notifications for all users in the same
        // location
        if (saved.getLocation() != null) {
            List<Users> usersInLocation = usersRepository.findByLocationId(saved.getLocation().getId());

            // Format the date for notification message
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMMM d, yyyy 'at' HH:mm", Locale.ENGLISH);
            String formattedDate = saved.getDate().format(formatter);
            String locationName = saved.getLocation().getName();

            // Create notification message
            String notificationMessage = String.format(
                    "New Umuganda event scheduled for %s: %s. Location: %s",
                    formattedDate,
                    saved.getDescription(),
                    locationName);

            for (Users user : usersInLocation) {
                // Create attendance record
                Attendance attendance = new Attendance();
                attendance.setUser(user);
                attendance.setUmuganda(saved);
                attendance.setAttendance(EAttendance.ABSENT);
                attendanceRepository.save(attendance);

                // Create notification
                Notification notification = new Notification();
                notification.setUser(user);
                notification.setMessage(notificationMessage);
                notification.setRead(false);
                notificationRepository.save(notification);
            }
        }

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
