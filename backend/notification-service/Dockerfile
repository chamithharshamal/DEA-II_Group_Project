FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the packaged jar file into our docker image
COPY target/*.jar app.jar

# Set environment variables with default values inside Docker
# Notification service uses port 8090 as per application.properties
ENV PORT=8090
ENV EUREKA_URL="http://discovery-service:8761/eureka/"

EXPOSE ${PORT}

ENTRYPOINT ["java","-jar","app.jar"]
