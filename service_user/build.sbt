name := "service_user"
 
version := "1.0" 
      
lazy val `service_user` = (project in file(".")).enablePlugins(PlayScala)

resolvers += "scalaz-bintray" at "https://dl.bintray.com/scalaz/releases"
      
resolvers += "Akka Snapshot Repository" at "https://repo.akka.io/snapshots/"
      
scalaVersion := "2.12.2"

libraryDependencies ++= Seq( jdbc , ehcache , ws , specs2 % Test , guice )
libraryDependencies ++= Seq(
  "io.swagger" %% "swagger-play2" % "1.7.1",  //Swagger
  "org.webjars" % "swagger-ui" % "3.23.8"     //Swagger-ui
)


unmanagedResourceDirectories in Test <+=  baseDirectory ( _ /"target/web/public/test" )  

      