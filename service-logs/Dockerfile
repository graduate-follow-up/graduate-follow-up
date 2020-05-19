FROM mozilla/sbt:8u232_1.3.8

WORKDIR /server

COPY project project

# Download dependencies
RUN sbt compile

COPY . .

# Compile
RUN sbt stage

EXPOSE 9000

# TODO change key
CMD ["/server/target/universal/stage/bin/service-logs", "-Dplay.http.secret.key=jrqmPXf8cWo2kQToLGiEtfnQjXarKTUF"]