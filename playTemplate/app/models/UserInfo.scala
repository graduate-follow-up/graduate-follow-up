package models

import play.api.libs.json.{Json, Writes}

case class UserInfo (gender : String, name : String, email : String, login : String)


case object UserInfo {

  implicit val read:Writes[User] = Json.writes[User]
  implicit val write:Writes[User] = Json.writes[User]

}

