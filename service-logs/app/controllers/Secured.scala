package controllers

import javax.inject.Inject
import java.time.Clock

import pdi.jwt.JwtSession._
import play.api.Configuration
import play.api.http.FileMimeTypes
import play.api.i18n.{Langs, MessagesApi}
import play.api.mvc.Results._
import play.api.mvc._

import scala.concurrent.{ExecutionContext, Future}

class ElevatedActionBuilder @Inject()(parser: BodyParsers.Default)(implicit ec: ExecutionContext, conf:Configuration)
  extends ActionBuilderImpl(parser) {
  implicit val clock: Clock = Clock.systemUTC

  override def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]): Future[Result] = {
    request.jwtSession.getAs[String]("role") match {
      case Some("respo-option") | Some("administrateur") =>
        block(request)
      case _ =>
        Future(Unauthorized)
    }
  }
}

class ServiceActionBuilder @Inject()(parser: BodyParsers.Default)(implicit ec: ExecutionContext, conf:Configuration)
  extends ActionBuilderImpl(parser) {
  implicit val clock: Clock = Clock.systemUTC

  override def invokeBlock[A](request: Request[A], block: (Request[A]) => Future[Result]): Future[Result] = {
    request.jwtSession.getAs[String]("role") match {
      case Some("service") =>
        block(request)
      case _ =>
        Future(Unauthorized)
    }
  }
}

case class SecuredControllerComponents @Inject()(
                                                  serviceActionBuilder: ServiceActionBuilder,
                                                  elevatedActionBuilder: ElevatedActionBuilder,
                                                  actionBuilder: DefaultActionBuilder,
                                                  parsers: PlayBodyParsers,
                                                  messagesApi: MessagesApi,
                                                  langs: Langs,
                                                  fileMimeTypes: FileMimeTypes,
                                                  executionContext: scala.concurrent.ExecutionContext
                                                ) extends ControllerComponents

class SecuredController @Inject()(scc: SecuredControllerComponents) extends AbstractController(scc) {
  def ServiceAction: ServiceActionBuilder = scc.serviceActionBuilder
  def ElevatedAction: ElevatedActionBuilder = scc.elevatedActionBuilder
}