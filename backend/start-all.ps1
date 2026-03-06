# start-all.ps1
# Script to build and run all backend microservices for the Healthcare System

Write-Host "Building the entire backend project..." -ForegroundColor Cyan
mvn clean install -DskipTests

if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Please check the errors above." -ForegroundColor Red
    exit 1
}

$services = @(
    "discovery-service",
    "api-gateway",
    "admin-service",
    "patient-service",
    "doctor-service",
    "appointment-service",
    "billing-service",
    "lab-report-service",
    "notification-service",
    "pharmacy-service",
    "staff-service"
)

Write-Host "Successfully built. Starting services..." -ForegroundColor Cyan

foreach ($service in $services) {
    Write-Host "Starting $service in a new window..." -ForegroundColor Yellow
    # Start each service in a separate PowerShell window
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd $service ; Write-Host 'Running $service...' -ForegroundColor Green ; title $service ; mvn spring-boot:run"
    
    # Give discovery-service a little extra time to start before others
    if ($service -eq "discovery-service") {
        Write-Host "Waiting 15 seconds for Discovery Server to initialize..."
        Start-Sleep -Seconds 15
    } elseif ($service -eq "api-gateway") {
        Write-Host "Waiting 10 seconds for API Gateway to initialize..."
        Start-Sleep -Seconds 10
    } else {
        Start-Sleep -Seconds 5
    }
}

Write-Host "All services have been launched! Please check the opened windows for logs." -ForegroundColor Green
