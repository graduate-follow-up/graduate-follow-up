FROM openjdk:14-jdk-alpine

VOLUME /tmp

COPY /target/app-0.0.1-SNAPSHOT.jar app.jar

ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]

# Pour mettre à jour le build 
# ./mvnw package && java -jar target/app-0.0.1-SNAPSHOT.jar 
# sudo docker build -t springapp .
# sudo docker run -p 8080:8080 -t springapp