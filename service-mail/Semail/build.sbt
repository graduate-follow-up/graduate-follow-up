name := "Semail"
 
version := "1.0" 

      
lazy val `Semail` = (project in file(".")).enablePlugins(PlayScala)

resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases"
      
scalaVersion := "2.11.11"

libraryDependencies ++= Seq( jdbc , ws , specs2 % Test,
  "javax.inject" % "javax.inject" % "1",
  "com.typesafe" % "config" % "1.4.0",
  "org.slf4j" % "slf4j-api" % "1.7.30",
  "org.apache.commons" % "commons-email" % "1.5")

libraryDependencies += "com.typesafe.play" %% "play-mailer" % "6.0.1"
libraryDependencies += "com.typesafe.play" %% "play-mailer-guice" % "6.0.1"

PlayKeys.devSettings := Seq("play.server.http.port" -> "80")



