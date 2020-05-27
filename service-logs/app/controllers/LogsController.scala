package controllers

import java.time.Clock

import javax.inject.{Inject, Singleton}
import models.Formatters._
import models.{Log, LogsDAO}
import pdi.jwt.JwtSession._
import play.api.Configuration
import play.api.libs.json.{JsError, JsPath, JsValue, Json}
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class LogsController @Inject()(logsDAO: LogsDAO, scc: SecuredControllerComponents)(implicit ec: ExecutionContext, conf:Configuration) extends SecuredController(scc) {

  implicit val clock: Clock = Clock.systemUTC
  val PAGE_SIZE = 30;
  /**
   * Create an Action to render an HTML page.
   *
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def listAll(): Action[AnyContent] = ElevatedAction.async {  implicit request: Request[AnyContent] =>
    // If this query is with a respo token, only returns alumnis logs
    val onlyAlumnis = request.jwtSession.getAs[String]("role").get == "respo-option"
    logsDAO.all(onlyAlumnis).map {
      logs => Ok(Json.toJson(logs))
    } recover {
      exception => InternalServerError(exception.getMessage)
    }
  }

  def list(page : Long): Action[AnyContent] = ElevatedAction.async { implicit request: Request[AnyContent] =>
    // If this query is with a respo token, only returns alumnis logs
    val onlyAlumnis = request.jwtSession.getAs[String]("role").get == "respo-option"
    if(page < 1) 
      Future { BadRequest("The page number needs to be positive") }
    else
      logsDAO.some(PAGE_SIZE, PAGE_SIZE*(page-1), onlyAlumnis).map {
        logs => Ok(Json.toJson(logs))
      } recover {
        exception => InternalServerError(exception.getMessage)
      }
  }
  
  def add(): Action[JsValue] =  ServiceAction.async(parse.json) {  implicit request =>
      JsPath.read[Log].reads(request.body) match {
        case error : JsError => Future { BadRequest(JsError.toJson(error)) }
        case value =>  logsDAO.add(value.get).map {
          count => if(count == 1) NoContent else InternalServerError("Not inserted")
        } recover {
          exception => InternalServerError(exception.getMessage)
        }
      }
  }

  private def lastWithIdAndType(id: String, logType: String): Action[AnyContent] = ElevatedAction.async {
    logsDAO.lastWithTypeAndId(id, logType).map {
      case Some(log) => Ok(Json.toJson(log))
      case None => NotFound
    } recover {
      exception => InternalServerError(exception.getMessage)
    }
  }

  def lastAlumniModification(id: String): Action[AnyContent] = lastWithIdAndType(id, "AlumniModified")

  def lastUserModification(id: String): Action[AnyContent] = ElevatedAction.async {  implicit request =>
    request.jwtSession.getAs[String]("role").get match {
      case "administrateur" => lastWithIdAndType(id, "UserModified").apply(request)
      case _ => Future { Unauthorized }
    }
  }
}