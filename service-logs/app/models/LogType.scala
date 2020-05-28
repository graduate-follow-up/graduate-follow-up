package models

case object LogType {
  val mailTypes : List[String] = List(
    "UpdateMailSent",
  )

  val alumniTypes : List[String] = List(
    "AlumniCreated",
    "AlumniModified",
    "AlumniDeleted",
  )

  val userTypes : List[String] = List(
    "UserCreated",
    "UserModified",
    "UserDeleted",
  )

  val connexionTypes : List[String] = List(
    "LoggedIn",
    "TokenRefreshed",
    "LoggedOut"
  )

  val logTypes: List[String] = mailTypes ++ alumniTypes ++ userTypes ++ connexionTypes;
}