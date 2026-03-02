package com.nsbm.group35.healthcare.staff.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

// "name" must match the spring.application.name of the service you are calling
@FeignClient(name = "notification-service")
public interface NotificationClient {

    // This must match the endpoint inside NotificationController
    @PostMapping("/api/notifications")
    void sendNotification(@RequestBody Object notificationRequest);
}