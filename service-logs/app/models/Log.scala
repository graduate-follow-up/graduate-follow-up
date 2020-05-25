package models

import java.time.Instant

import models.LogType.logTypes
import play.api.libs.functional.syntax._
import play.api.libs.json.{JsPath, Json, Reads, Writes, _}

case class Log(
  id: Option[Long],
  date: Instant,
  logType: String,
  actorRole: String,
  actorId: String,
  subjectId: Option[String],
  description: Option[String]
) {
  def info: (Instant, String, String, String, Option[String], Option[String]) = (date, logType, actorRole, actorId, subjectId, description)
}

object Formatters {
  implicit val logRead: Reads[Log] = (
    Reads.pure(None) and
    (JsPath \ "date").read[Instant] and
    (JsPath \ "logType").read[String].filter(JsonValidationError("Unsupported log type"))(logTypes.contains(_)) and
    (JsPath \ "actorRole").read[String] and
    (JsPath \ "actorId").read[String] and
    (JsPath \ "subjectId").readNullable[String] and
    (JsPath \ "description").readNullable[String]
    )(Log.apply _)

  implicit val logWrite:Writes[Log] = Json.writes[Log]
}