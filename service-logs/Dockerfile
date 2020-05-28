FROM mozilla/sbt:8u232_1.3.8

WORKDIR /server

COPY project project
COPY build.sbt build.sbt

# Download dependencies
RUN sbt compile

COPY . .

# Compile
RUN sbt stage

EXPOSE 80

CMD /server/target/universal/stage/bin/service-logs -Dplay.http.secret.key=$JWT_ACCESS_TOKEN_SECRET