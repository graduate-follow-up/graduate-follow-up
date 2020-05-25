FROM maven:3.6.3-openjdk-14 as build

WORKDIR /tmp

COPY pom.xml pom.xml

RUN mvn -B -s /usr/share/maven/ref/settings-docker.xml dependency:resolve-plugins dependency:resolve

COPY src src

RUN mvn -B -s /usr/share/maven/ref/settings-docker.xml package

# Stage 2
FROM openjdk:14-jdk-alpine

COPY --from=build /tmp/target/app-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java","-jar","app.jar"]