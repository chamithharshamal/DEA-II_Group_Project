package com.nsbm.group35.healthcare.admin.repository;

import com.nsbm.group35.healthcare.admin.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, String> {
}
