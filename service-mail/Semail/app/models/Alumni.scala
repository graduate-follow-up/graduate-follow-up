package models

import play.api.libs.json._

case class Alumni (
  id_ : String,
  first_name : String,
  last_name : String,
  email : String,
  url : String
                  )

object Alumni {
  implicit val alumniread = Json.reads[Alumni]
  implicit val alumniwrite = Json.writes[Alumni]

}

