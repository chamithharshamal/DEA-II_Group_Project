package com.nsbm.group35.healthcare.staff.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Feign Client for communicating with the Admin Service.
 * The "name" matches the spring.application.name defined in admin-service.
 */
@FeignClient(name = "admin-service")
public interface AdminClient {

    @GetMapping("/api/admins")
    List<Object> getAllAdmins();

    @GetMapping("/api/admins/{id}")
    Object getAdminById(@PathVariable("id") String id);

    @PostMapping("/api/admins")
    Object createAdmin(@RequestBody Object admin);

    @PutMapping("/api/admins/{id}")
    Object updateAdmin(@PathVariable("id") String id, @RequestBody Object admin);

    @DeleteMapping("/api/admins/{id}")
    void deleteAdmin(@PathVariable("id") String id);
    }

