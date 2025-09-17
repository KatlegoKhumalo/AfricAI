# Use a slim, secure base image with Java 24
FROM eclipse-temurin:21-jdk-jammy as builder

# Set the working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml to leverage Docker layer caching
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies
RUN ./mvnw dependency:go-offline

# Copy the rest of the application source code
COPY src src

# Build the application, skipping tests
RUN ./mvnw package -DskipTests

# --- Final Stage ---
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Copy the built JAR from the builder stage
COPY --from=builder /app/target/*.jar app.jar

# Expose the port the application runs on
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
