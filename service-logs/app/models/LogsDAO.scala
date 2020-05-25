package models

import java.time.Instant

import javax.inject.Inject
import models.LogType.alumniTypes
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile

import scala.concurrent.{ExecutionContext, Future}

class LogsDAO @Inject() (protected val dbConfigProvider: DatabaseConfigProvider)(implicit executionContext: ExecutionContext) extends HasDatabaseConfigProvider[JdbcProfile] {

  import profile.api._
  import TupleMethods._

  private val Logs = TableQuery[LogsTable]
  db.run(Logs.schema.createIfNotExists)

  private val LogsQuery = (onlyAlumnis: Boolean) => Logs
    .filterIf(onlyAlumnis)(x => alumniTypes.map(x.logType === _).reduceLeft(_ || _))
    .sortBy(_.date.desc)

  def all(onlyAlumnis : Boolean = false): Future[Seq[Log]] = db.run(LogsQuery(onlyAlumnis).result)

  def some(count: Long, offset: Long, onlyAlumnis : Boolean = false): Future[Seq[Log]] = db.run(LogsQuery(onlyAlumnis)
    .drop(offset)
    .take((count))
    .result)

  def add(log: Log): Future[Int] = db.run(logsTable.map(_.forInsert) += log)

  def lastWithTypeAndId(id: String, logType: String): Future[Option[Log]] = db.run(Logs
    .sortBy(_.date.desc)
    .filter(_.logType === logType)
    .take(1)
    .result
    .headOption
  )

  private class LogsTable(tag: Tag) extends Table[Log](tag, "LOGS") {
    def id = column[Long]("LOG_ID", O.PrimaryKey, O.AutoInc)
    def date = column[Instant]("DATE", O.Default(Instant.now()))
    def logType = column[String]("LOG_TYPE")
    def actorRole = column[String]("ACTOR_ROLE")
    def actorId = column[String]("ACTOR_ID")
    def subjectId = column[Option[String]]("SUBJECT_ID")
    def description = column[Option[String]]("DESCRIPTION")
    def * = (id.?, date, logType, actorRole, actorId, subjectId, description).mapTo[Log]

    def forInsert = (date ~ logType ~ actorRole ~ actorId ~ subjectId ~ description) <> (
        { case (date, logType, actorRole, actorId, subjectId, description) =>
        Log(None, date, logType, actorRole, actorId, subjectId, description) },
        { l:Log => Some(l.info) }
      )
  }
  private object  logsTable extends TableQuery(new LogsTable(_)) {}
}