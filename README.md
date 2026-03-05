# 🏥 Healthcare Management System

> **DEA-II Group Project — Group 35 | NSBM Green University**

A full-stack **Healthcare Management System** built with a **microservices architecture**. The system digitizes hospital workflows including patient registration, doctor management, appointment scheduling, billing, pharmacy, lab reports, staff management, and real-time notifications.

---

## 📑 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Microservices](#microservices)
- [Frontend](#frontend)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Start the Backend](#2-start-the-backend)
  - [3. Start the Frontend](#3-start-the-frontend)
- [Port Assignments](#port-assignments)
- [API Gateway Routes](#api-gateway-routes)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

The Healthcare Management System is designed to streamline hospital operations by providing dedicated modules for different departments. Each module runs as an independent microservice that communicates through a centralized **API Gateway** and discovers other services via **Netflix Eureka** service registry.

### Key Features

- 🔐 **JWT-based Authentication** — Secure login for admins, doctors, patients, pharmacists, and staff
- 📋 **Patient Management** — Registration, medical history, and profile management
- 👨‍⚕️ **Doctor Management** — Doctor profiles, specializations, and availability
- 📅 **Appointment Scheduling** — Book, update, and manage patient-doctor appointments
- 💳 **Billing & Invoicing** — Generate and manage patient bills and payment records
- 💊 **Pharmacy Management** — Medication inventory, prescriptions, and dispensing
- 🔬 **Lab Reports** — Submit, process, and retrieve laboratory test results
- 👥 **Staff Management** — Manage hospital staff records and roles
- 🔔 **Notifications** — Real-time notifications for appointments, reports, and alerts
- 🏢 **Admin Dashboard** — Centralized administration with department management

---

## Architecture

The system follows a **microservices architecture** pattern using Spring Cloud:

```
                          ┌──────────────────┐
                          │   React Frontend │
                          │   (Vite :5173)   │
                          └────────┬─────────┘
                                   │
                          ┌────────▼─────────┐
                          │   API Gateway    │
                          │   (Port 8080)    │
                          └────────┬─────────┘
                                   │
                    ┌──────────────▼──────────────┐
                    │     Discovery Service       │
                    │   (Eureka Server :8761)      │
                    └──────────────┬──────────────┘
                                   │
       ┌───────────┬───────────┬───┴───┬───────────┬───────────┐
       │           │           │       │           │           │
  ┌────▼───┐ ┌────▼───┐ ┌─────▼──┐ ┌──▼────┐ ┌───▼────┐ ┌───▼─────┐
  │ Admin  │ │Patient │ │ Doctor │ │Appoint│ │Billing │ │Pharmacy │
  │Service │ │Service │ │Service │ │Service│ │Service │ │ Service │
  │ :8082  │ │ :8087  │ │ :8084  │ │ :8086 │ │ :8083  │ │  :8088  │
  └────────┘ └────────┘ └────────┘ └───────┘ └────────┘ └─────────┘
       │           │           │       
  ┌────▼───┐ ┌────▼───┐ ┌─────▼──┐
  │Lab Rpt │ │ Staff  │ │Notific-│
  │Service │ │Service │ │ation   │
  │ :8085  │ │ :8089  │ │ :8090  │
  └────────┘ └────────┘ └────────┘ 
       │           │           │
       └───────────┴───────────┘
                   │
          ┌────────▼─────────┐
          │  Supabase        │
          │  PostgreSQL DBs  │
          └──────────────────┘
```

**Key Architectural Components:**

| Component             | Role                                                              |
|-----------------------|-------------------------------------------------------------------|
| **API Gateway**       | Single entry point; routes requests to downstream services via load-balanced Eureka lookup |
| **Discovery Service** | Netflix Eureka server for service registration & discovery         |
| **Common Utils**      | Shared library with common DTOs, utilities, and configurations    |
| **Business Services** | 9 domain-specific microservices (see below)                       |

---

## Technology Stack

### Backend

| Technology                 | Version     | Purpose                             |
|----------------------------|-------------|--------------------------------------|
| **Java**                   | 17          | Programming language                 |
| **Spring Boot**            | 3.4.2       | Application framework                |
| **Spring Cloud**           | 2024.0.0    | Microservices infrastructure         |
| **Spring Cloud Gateway**   | —           | API Gateway & routing                |
| **Netflix Eureka**         | —           | Service discovery & registry         |
| **Spring Data JPA**        | —           | Database ORM                         |
| **Spring Security**        | —           | Authentication & authorization       |
| **PostgreSQL** (Supabase)  | —           | Relational database (cloud-hosted)   |
| **Lombok**                 | —           | Boilerplate code reduction           |
| **Maven**                  | —           | Build & dependency management        |
| **OpenFeign**              | —           | Inter-service HTTP communication     |
| **JWT**                    | —           | Token-based authentication           |

### Frontend

| Technology          | Version   | Purpose                            |
|---------------------|-----------|------------------------------------|
| **React**           | 19.2      | UI library                         |
| **Vite**            | 7.2       | Build tool & dev server            |
| **React Router**    | 7.13      | Client-side routing                |
| **Axios**           | 1.13      | HTTP client for API calls          |
| **React Icons**     | 5.6       | Icon library                       |
| **CSS**             | —         | Custom styling                     |

---

## Microservices

### Infrastructure Services

| Service              | Port   | Description                                             |
|----------------------|--------|---------------------------------------------------------|
| **discovery-service**| `8761` | Eureka Server — service registry & health monitoring    |
| **api-gateway**      | `8080` | Spring Cloud Gateway — routing, CORS, load balancing    |
| **common-utils**     | —      | Shared library (DTOs, utilities) — not a runnable app   |

### Business Services

| Service                 | Port   | Description                                          |
|-------------------------|--------|------------------------------------------------------|
| **admin-service**       | `8082` | Admin authentication, department & product management|
| **patient-service**     | `8087` | Patient registration, profiles, medical history      |
| **doctor-service**      | `8084` | Doctor profiles, specializations, availability       |
| **appointment-service** | `8086` | Appointment booking, scheduling, status tracking     |
| **billing-service**     | `8083` | Invoice generation, payment processing, billing records |
| **pharmacy-service**    | `8088` | Medication inventory, prescriptions, dispensing      |
| **lab-report-service**  | `8085` | Lab test results submission and retrieval             |
| **notification-service**| `8090` | Notification management and alerts                   |
| **staff-service**       | `8089` | Hospital staff management, roles, records            |

---

## Frontend

The frontend is a **React Single Page Application (SPA)** with a modular page structure:

| Module          | Route Path              | Description                              |
|-----------------|-------------------------|------------------------------------------|
| **Landing**     | `/`                     | Public landing page                      |
| **Admin**       | `/app/admin/*`          | Admin dashboard, departments, products   |
| **Patients**    | `/app/patients/*`       | Patient portal and management            |
| **Doctors**     | `/app/doctors/*`        | Doctor dashboard and management          |
| **Appointments**| `/app/appointments/*`   | Appointment booking and management       |
| **Billing**     | `/app/billing/*`        | Billing and invoice management           |
| **Pharmacy**    | `/app/pharmacy/*`       | Pharmacy and prescription management     |
| **Lab Reports** | `/app/lab-reports/*`    | Lab report submission and viewing        |
| **Staff**       | `/app/staff/*`          | Staff management portal                  |
| **Notifications**| `/app/notifications/*` | Notification inbox and management        |

**Frontend Architecture:**
- `components/` — Shared components (Layout, Sidebar, Placeholder)
- `pages/` — Feature-specific page modules
- `services/` — API service layer (Axios-based HTTP clients)

---

## Prerequisites

Ensure you have the following installed:

| Software       | Version   | Download Link                                      |
|----------------|-----------|---------------------------------------------------|
| **Java JDK**   | 17+       | [Download](https://adoptium.net/)                  |
| **Maven**      | 3.8+      | [Download](https://maven.apache.org/download.cgi)  |
| **Node.js**    | 18+       | [Download](https://nodejs.org/)                    |
| **npm**        | 9+        | Bundled with Node.js                               |
| **Git**        | Latest    | [Download](https://git-scm.com/downloads)          |

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/chamithharshamal/DEA-II_Group_Project.git
cd DEA-II_Group_Project
```

### 2. Start the Backend

> ⚠️ **Important:** Start services in the following order — Discovery Service must be running before other services can register.

**Step 1: Start the Discovery Service (Eureka Server)**

```bash
cd backend/discovery-service
mvn spring-boot:run
```

Wait until the Eureka dashboard is accessible at `http://localhost:8761`.

**Step 2: Start the API Gateway**

```bash
cd backend/api-gateway
mvn spring-boot:run
```

**Step 3: Start the Business Services**

Open separate terminals for each service you want to run:

```bash
# Admin Service
cd backend/admin-service
mvn spring-boot:run

# Patient Service
cd backend/patient-service
mvn spring-boot:run

# Doctor Service
cd backend/doctor-service
mvn spring-boot:run

# Appointment Service
cd backend/appointment-service
mvn spring-boot:run

# Billing Service
cd backend/billing-service
mvn spring-boot:run

# Pharmacy Service
cd backend/pharmacy-service
mvn spring-boot:run

# Lab Report Service
cd backend/lab-report-service
mvn spring-boot:run

# Notification Service
cd backend/notification-service
mvn spring-boot:run

# Staff Service
cd backend/staff-service
mvn spring-boot:run
```

**Alternatively, build all services at once from the parent POM:**

```bash
cd backend
mvn clean install -DskipTests
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at **`http://localhost:5173`**.

---

## Port Assignments

| Service              | Port   |
|----------------------|--------|
| API Gateway          | `8080` |
| Discovery Service    | `8761` |
| Admin Service        | `8082` |
| Billing Service      | `8083` |
| Doctor Service       | `8084` |
| Lab Report Service   | `8085` |
| Appointment Service  | `8086` |
| Patient Service      | `8087` |
| Pharmacy Service     | `8088` |
| Staff Service        | `8089` |
| Notification Service | `8090` |
| Frontend (Vite)      | `5173` |

---

## API Gateway Routes

All API requests go through the gateway at `http://localhost:8080`:

| Route Pattern            | Target Service       |
|--------------------------|----------------------|
| `/api/admin/**`          | admin-service        |
| `/api/patients/**`       | patient-service      |
| `/api/doctors/**`        | doctor-service       |
| `/api/appointments/**`   | appointment-service  |
| `/api/billing/**`        | billing-service      |
| `/api/lab-reports/**`    | lab-report-service   |
| `/api/notifications/**`  | notification-service |
| `/api/pharmacy/**`       | pharmacy-service     |
| `/api/staff/**`          | staff-service        |

---

## Project Structure

```
DEA-II_Group_Project/
├── backend/
│   ├── pom.xml                      # Parent POM (multi-module Maven project)
│   ├── common-utils/                # Shared library (DTOs, utilities)
│   ├── discovery-service/           # Eureka Server
│   ├── api-gateway/                 # Spring Cloud Gateway
│   ├── admin-service/               # Admin & department management
│   ├── appointment-service/         # Appointment scheduling
│   ├── billing-service/             # Billing & invoicing
│   ├── doctor-service/              # Doctor management
│   ├── lab-report-service/          # Lab report management
│   ├── notification-service/        # Notification system
│   ├── patient-service/             # Patient management
│   ├── pharmacy-service/            # Pharmacy & prescriptions
│   └── staff-service/               # Staff management
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx                  # Root component with routing
│       ├── main.jsx                 # Application entry point
│       ├── index.css                # Global styles
│       ├── components/              # Shared UI components
│       │   ├── Layout.jsx
│       │   ├── Sidebar.jsx
│       │   └── Placeholder.jsx
│       ├── pages/                   # Feature modules
│       │   ├── landing/             # Public landing page
│       │   ├── admin/               # Admin pages
│       │   ├── patient/             # Patient pages
│       │   ├── doctor/              # Doctor pages
│       │   ├── appointment/         # Appointment pages
│       │   ├── billing/             # Billing pages
│       │   ├── pharmacy/            # Pharmacy pages
│       │   ├── lab/                 # Lab report pages
│       │   ├── staff/               # Staff pages
│       │   ├── notification/        # Notification pages
│       │   └── dashboard/           # Dashboard page
│       └── services/                # API service layer
│           ├── api.js               # Base Axios instance
│           ├── adminService.js
│           ├── doctorService.js
│           ├── billingService.js
│           ├── pharmacyService.js
│           ├── labReportService.js
│           ├── notificationService.js
│           ├── patientService.js
│           └── staffService.js
│
├── .gitignore
└── README.md
```

---

## Environment Variables

Each backend service supports the following environment variables for configuration:

| Variable         | Description                        | Default                                   |
|------------------|------------------------------------|-------------------------------------------|
| `DB_URL`         | PostgreSQL JDBC connection URL     | Supabase pooler URL (per service)         |
| `DB_USERNAME`    | Database username                  | Supabase project credentials              |
| `DB_PASSWORD`    | Database password                  | Supabase project credentials              |
| `DB_POOL_SIZE`   | HikariCP maximum pool size         | `5`                                       |
| `JWT_SECRET`     | Secret key for JWT token signing   | Service-specific default                  |
| `JWT_EXPIRATION` | JWT token expiration (ms)          | `86400000` (24 hours)                     |
| `EUREKA_URL`     | Eureka server URL                  | `http://localhost:8761/eureka/`            |

---

## Contributing

1. **Fork** the repository
2. Create a **feature branch** (`git checkout -b feature/your-feature`)
3. **Commit** your changes (`git commit -m 'Add new feature'`)
4. **Push** to the branch (`git push origin feature/your-feature`)
5. Open a **Pull Request**

### Adding a New Microservice

1. Go to [start.spring.io](https://start.spring.io)
2. **Project:** Maven | **Language:** Java 17
3. **Group ID:** `com.nsbm.group35.healthcare`
4. **Artifact:** your service name (e.g., `new-service`)
5. Download and unzip directly into `/backend`
6. Add the module to `backend/pom.xml` `<modules>` section
7. Configure your `application.properties` with an assigned port and Eureka settings

---

## License

This project is developed as part of the **DEA-II module** at **NSBM Green University** for educational purposes.

---
