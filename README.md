# Umuganda Management System

[![Project Logo](./Images/3c267e7f-20c8-4ff8-861f-3ebc710eedab.jpg)](./Images/3c267e7f-20c8-4ff8-861f-3ebc710eedab.jpg)

### *Twese Hamwe, Buri Kagero — Empowering Communities through Digital Coordination*

The **Umuganda Management System** is a comprehensive digital platform designed to streamline and modernize the coordination of *Umuganda*—Rwanda's traditional community work. By replacing manual processes with a robust, data-driven solution, the system ensures better event planning, automated attendance tracking, and seamless communication between local leaders and citizens.

---

## Key Features

### Modern Authentication & Security
- **Role-Based Access Control (RBAC)**: Personalized dashboards for Administrators, Local Leaders, and Villagers.
- **Secure Auth**: UUID-based session management and encrypted password storage.

### Event Lifecycle Management
- **Smart Scheduling**: Effortlessly plan and publish Umuganda activities across different locations.
- **Progress Tracking**: Monitor the status of community projects from initiation to completion.

### Intelligent Location Mapping
- **Hierarchical Organization**: Management of activities based on administrative levels (Districts, Sectors, Cells, Villages).
- **Localized Assignments**: Assigning specific tasks and leaders to respective geographical areas.

### Digital Attendance
- **Real-time Record-keeping**: Automated attendance tracking to ensure transparency and accountability.
- **Historical Data**: Easily accessible participation records for administrative reporting.

### Integrated Notification System
- **Citizen Engagement**: Automated email and internal system notifications for upcoming events and announcements.
- **Leader Alerts**: Real-time updates for administrative actions and task assignments.

---

## Technology Stack

### **Backend**
- **Framework**: Spring Boot 3.x
- **Language**: Java 17
- **Database**: PostgreSQL
- **Security**: jbcrypt & UUID Token Auth
- **Documentation**: Swagger/OpenAPI (SpringDoc)
- **Tooling**: Maven, Lombok

### **Frontend**
- **Framework**: React 19 + Vite
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS 4.x
- **Icons**: Lucide React
- **Data Visualization**: Recharts
- **Form Handling**: React Hook Form & Zod

### **Infrastructure**
- **Containerization**: Docker (Multi-stage builds)
- **Hosting**: Render (API & Database)

---

## Project Structure

```text
.
├── umuganda/               # Backend Spring Boot Project
│   ├── src/                # Soul of the API
│   ├── Dockerfile          # Container config
│   └── pom.xml             # Dependencies
├── umuganda-frontend/      # Frontend React Project
│   ├── src/                # UI Components & State
│   ├── public/             # Static Assets
│   └── package.json        # Dependencies
├── Images/                 # Project Screenshots & Branding
└── doc.md                  # API & Deployment Links
```

---

## Getting Started

### Prerequisites
- JDK 17 or higher
- Node.js 18+ & npm
- PostgreSQL (if running locally without Docker)
- Docker (optional, for containerized run)

### Running with Docker Compose

For the easiest setup, you can run the entire Umuganda System (Backend, Frontend, and Database) using Docker Compose:

```bash
docker-compose up --build
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:9090
- **Database**: Port 5433 (on host)

### Running Locally

**Backend:**
```bash
cd umuganda
./mvnw spring-boot:run
```
*API will be available at `http://localhost:9090`*

**Frontend:**
```bash
cd umuganda-frontend
npm install
npm run dev
```
*UI will be available at `http://localhost:5173`*

### API Documentation
Once the backend is running, you can explore the interactive API documentation at:
- [Swagger UI (Local)](http://localhost:9090/swagger-ui/index.html)
- [Production API Reference](https://umuganda-backend-k32m.onrender.com/swagger-ui/index.html)

---

## Contribution & Design
This project follows a **Modular Monolith** architecture with a strong emphasis on the **Controller-Service-Repository** pattern, ensuring high maintainability and scalability.

Built with passion for community progress.
