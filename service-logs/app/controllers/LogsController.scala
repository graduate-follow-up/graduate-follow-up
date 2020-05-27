package controllers

import javax.inject._
import models.Formatters._
import models.{Log, LogsDAO}
import play.api.libs.json.{JsError, JsPath, JsValue, Json}
import play.api.mvc._

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

/**
 * This controller creates an `Action` to handle HTTP requests to the
 * application's home page.
 */
@Singleton
class LogsController @Inject()(logsDAO: LogsDAO, cc: ControllerComponents) extends AbstractController(cc) {

  val PAGE_SIZE = 30;
  /**
   * Create an Action to render an HTML page.
   *
   * The configuration in the `routes` file means that this method
   * will be called when the application receives a `GET` request with
   * a path of `/`.
   */
  def listAll(): Action[AnyContent] = Action.async {
    logsDAO.all().map {
      logs => Ok(Json.toJson(logs))
    } recover {
      exception => InternalServerError(exception.getMessage)
    }
  }

  def list(page : Long): Action[AnyContent] = Action.async { implicit request: Request[AnyContent] =>
    if(page < 1) 
      Future { BadRequest("The page number needs to be positive") }
    else
      logsDAO.some(PAGE_SIZE, PAGE_SIZE*(page-1)).map {
        logs => Ok(Json.toJson(logs))
      } recover {
        exception => InternalServerError(exception.getMessage)
      }
  }
  
  def add(): Action[JsValue] =  Action.async(parse.json) {
    request => {
      JsPath.read[Log].reads(request.body) match {
        case error : JsError => Future { BadRequest(JsError.toJson(error)) }
        case value =>  logsDAO.add(value.get).map {
          count => if(count == 1) Ok else InternalServerError("Not inserted")
        } recover {
          exception => InternalServerError(exception.getMessage)
        }
      }
    }
  }

  private def lastWithIdAndType(id: String, logType: String): Action[AnyContent] = Action.async {
    logsDAO.lastWithTypeAndId(id, logType).map {
      case Some(log) => Ok(Json.toJson(log))
      case None => NotFound
    } recover {
      exception => InternalServerError(exception.getMessage)
    }
  }

  def lastAlumniModification(id: String): Action[AnyContent] = lastWithIdAndType(id, "AlumniModified")

  def lastUserModification(id: String): Action[AnyContent] = lastWithIdAndType(id, "UserModified")
}