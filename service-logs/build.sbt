lazy val root = (project in file("."))
  .enablePlugins(PlayScala)
  .settings(
    name := """service-logs""",
    organization := "com.example",
    version := "1.0-SNAPSHOT",
    scalaVersion := "2.13.1",
    libraryDependencies ++= Seq(
      guice,
      "com.typesafe.play" %% "play-slick" % "5.0.0",
      "mysql" % "mysql-connector-java" % "5.1.34",
      "com.pauldijou"     %% "jwt-play" % "4.3.0"
    ),
    scalacOptions ++= Seq(
      "-feature",
      "-deprecation",
      "-Xfatal-warnings"
    )
  )