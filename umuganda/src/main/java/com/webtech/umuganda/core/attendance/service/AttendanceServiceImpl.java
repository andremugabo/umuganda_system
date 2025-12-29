package com.webtech.umuganda.core.attendance.service;

import com.webtech.umuganda.core.attendance.dto.AttendanceDto;
import com.webtech.umuganda.core.attendance.model.Attendance;
import com.webtech.umuganda.core.attendance.repository.AttendanceRepository;
import com.webtech.umuganda.core.attendance.service.AttendanceService;
import com.webtech.umuganda.core.umuganda.repository.UmugandaRepository;
import com.webtech.umuganda.core.user.repository.UsersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceRepository repository;
    private final UsersRepository usersRepository;
    private final UmugandaRepository umugandaRepository;

    private AttendanceDto mapToDto(Attendance entity) {
        AttendanceDto dto = new AttendanceDto();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser().getId());
        dto.setUmugandaId(entity.getUmuganda().getId());
        dto.setAttendance(entity.getAttendance());

        // Add location from Umuganda event
        if (entity.getUmuganda() != null && entity.getUmuganda().getLocation() != null) {
            dto.setLocationId(entity.getUmuganda().getLocation().getId());
        }

        // Add user full name
        if (entity.getUser() != null) {
            dto.setUserName(entity.getUser().getFirstName() + " " + entity.getUser().getLastName());
        }

        // Add event description
        if (entity.getUmuganda() != null) {
            dto.setEventDescription(entity.getUmuganda().getDescription());
        }

        return dto;
    }

    private Attendance mapToEntity(AttendanceDto dto) {
        Attendance entity = new Attendance();
        usersRepository.findById(dto.getUserId()).ifPresent(entity::setUser);
        umugandaRepository.findById(dto.getUmugandaId()).ifPresent(entity::setUmuganda);
        entity.setAttendance(dto.getAttendance());
        return entity;
    }

    @Override
    public AttendanceDto createAttendance(AttendanceDto dto) {
        Attendance saved = repository.save(mapToEntity(dto));
        return mapToDto(saved);
    }

    @Override
    public AttendanceDto updateAttendance(UUID id, AttendanceDto dto) {
        Attendance entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));
        usersRepository.findById(dto.getUserId()).ifPresent(entity::setUser);
        umugandaRepository.findById(dto.getUmugandaId()).ifPresent(entity::setUmuganda);
        entity.setAttendance(dto.getAttendance());
        return mapToDto(repository.save(entity));
    }

    @Override
    public AttendanceDto getAttendanceById(UUID id) {
        return repository.findById(id)
                .map(this::mapToDto)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));
    }

    @Override
    public List<AttendanceDto> getAllAttendance() {
        return repository.findAll().stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDto> getByUserId(UUID userId) {
        return repository.findByUserId(userId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<AttendanceDto> getByUmugandaId(UUID umugandaId) {
        return repository.findByUmugandaId(umugandaId).stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public void deleteAttendance(UUID id) {
        Attendance entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));
        repository.delete(entity);
    }
}
