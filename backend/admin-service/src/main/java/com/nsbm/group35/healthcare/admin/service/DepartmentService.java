package com.nsbm.group35.healthcare.admin.service;

import com.nsbm.group35.healthcare.admin.entity.Department;
import com.nsbm.group35.healthcare.admin.model.DepartmentDTO;
import com.nsbm.group35.healthcare.admin.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    // DTO -> Entity
    private Department toEntity(DepartmentDTO dto) {
        Department department = new Department();
        department.setDepartmentId(dto.getDepartmentId());
        department.setDepartmentName(dto.getDepartmentName());
        department.setDescription(dto.getDescription());
        return department;
    }

    // Entity -> DTO
    private DepartmentDTO toDTO(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setDepartmentId(department.getDepartmentId());
        dto.setDepartmentName(department.getDepartmentName());
        dto.setDescription(department.getDescription());
        return dto;
    }

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<DepartmentDTO> getDepartmentById(String departmentId) {
        return departmentRepository.findById(departmentId).map(this::toDTO);
    }

    public DepartmentDTO createDepartment(DepartmentDTO departmentDTO) {
        Department saved = departmentRepository.save(toEntity(departmentDTO));
        return toDTO(saved);
    }

    public DepartmentDTO updateDepartment(String departmentId, DepartmentDTO departmentDTO) {
        Department department = toEntity(departmentDTO);
        department.setDepartmentId(departmentId);
        return toDTO(departmentRepository.save(department));
    }

    public void deleteDepartment(String departmentId) {
        departmentRepository.deleteById(departmentId);
    }
}
