FROM anapsix/alpine-java:8_jdk


# sbt

ENV SBT_VERSION 0.13.15
ENV INSTALL_DIR /usr/local
ENV SBT_HOME /usr/local/sbt
ENV PATH ${PATH}:${SBT_HOME}/bin

# Install sbt
RUN apk add --no-cache --update bash wget && mkdir -p "$SBT_HOME" && \
    wget -qO - --no-check-certificate "https://dl.bintray.com/sbt/native-packages/sbt/$SBT_VERSION/sbt-$SBT_VERSION.tgz" |  tar xz -C $INSTALL_DIR && \
    echo -ne "- with sbt $SBT_VERSION\n" >> /root/.built

WORKDIR /app

COPY ./Semail/project project
COPY ./Semail/build.sbt build.sbt

# Download dependencies
RUN sbt compile

COPY ./Semail .

# Compile
RUN sbt stage

EXPOSE 9000

# TODO change key
CMD ["/app/target/universal/stage/bin/semail", "-Dplay.http.secret.key=jrqmPXf8cWo2kQToLGiEtfnQjXarKTUF"]
