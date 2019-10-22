package models

import play.api.libs.json.{Json, Writes}

case class User (id : Long, gender : String, name : String, email : String, login : String)

case object User {

  implicit val exampleAuto:Writes[User] = Json.writes[User]

}