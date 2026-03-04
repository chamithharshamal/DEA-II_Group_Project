FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copy the packaged jar file into our docker image
COPY target/*.jar app.jar

# Set environment variables with default values inside Docker
ENV PORT=8088
ENV EUREKA_URL="http://discovery-service:8761/eureka/"

EXPOSE ${PORT}

ENTRYPOINT ["java","-jar","app.jar"]
