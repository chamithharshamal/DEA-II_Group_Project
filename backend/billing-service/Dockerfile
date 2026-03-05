FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the generated JAR file into the container
COPY target/billing-service-1.0.0-SNAPSHOT.jar app.jar

# Expose the application port
EXPOSE 8083

# Run the jar file
ENTRYPOINT ["java","-jar","app.jar"]
