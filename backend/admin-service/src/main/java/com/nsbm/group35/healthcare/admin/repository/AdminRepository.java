package com.nsbm.group35.healthcare.admin.repository;

import com.nsbm.group35.healthcare.admin.model.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminRepository extends JpaRepository<Admin, String> {
}
