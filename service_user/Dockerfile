FROM hseeberger/scala-sbt:8u222_1.3.3_2.13.1

WORKDIR /server

RUN sbt compile

CMD ["sbt","run"]

# Expose code volume and play port 9000 

EXPOSE 9000
