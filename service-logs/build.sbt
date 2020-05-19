lazy val root = (project in file("."))
  .enablePlugins(PlayScala)
  .settings(
    name := """service-logs""",
    organization := "com.example",
    version := "1.0-SNAPSHOT",
    scalaVersion := "2.13.1",
    libraryDependencies ++= Seq(
      guice
    ),
    scalacOptions ++= Seq(
      "-feature",
      "-deprecation",
      "-Xfatal-warnings"
    )
  )