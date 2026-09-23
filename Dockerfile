# Etapa 1: Build da aplicação Spring Boot
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# Etapa 2: Imagem final leve para execução
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

ENV PORT=8080
EXPOSE ${PORT}

ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT} -jar app.jar"]
