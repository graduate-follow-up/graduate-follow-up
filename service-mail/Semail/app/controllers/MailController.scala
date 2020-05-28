package controllers

import play.api.libs.mailer._
import models.Alumni
import javax.inject.Inject
import play.api.libs.json._
import play.api.mvc._
import scala.util._



class MailController @Inject() (mailerClient: MailerClient) extends Controller  {


  def home() = Action{
    Ok(s"Welcome Home")
  }


  def sendEmailMaj() =Action(parse.json){
    implicit request: Request[JsValue] => {
      val data = Try[List[Alumni]]{
      Json.parse(request.body.toString).as[List[Alumni]]
      }
      data match {
        case  Success(l) =>
          l.map(x => Emailmaj(x.email.toString,x.last_name.toString,x.first_name.toString,x.url.toString))
          Ok(s"Mail envoyé")
        case Failure(f) =>
          BadRequest(s"Erreur de syntaxe la requete")
      }
    }
  }



  def Emailmaj (to : String , last_name : String, first_name :String, link : String) :String =  {
    val email = Email(
      subject = "Mise a jour des données sur Graduate Follow Up",
      from = s"Groupe ICC <projet.entreprise.icc@gmail.com>",
      to = Seq(to),
      bodyHtml = Some(
        s"""<html>
           |<body>
           |<p>Bonjour <b>$last_name $first_name</b>,
           |<br>
           | Cela fait un moment que vous n'avez pas mit a jour vos données sur <b>Graduate Follow Up </b>
           | <br>
           | Merci de cliquer sur le lien ci dessous pour mettre a jour vos données.</p>
           | <p>$link</p>
           | <br>
           | <p> Cordialement Service Mail </p>
           | </body></html>""".stripMargin)
    )
    mailerClient.send(email)
     s"Mail envoyé a "+last_name+" "+first_name

  }


  def sendEmailMdp() =Action(parse.json){
    implicit request: Request[JsValue] => {
      val data = Try[List[Alumni]]{
        Json.parse(request.body.toString).as[List[Alumni]]
      }
      data match {
        case  Success(l) =>
          l.map(x => Emailmdp(x.email.toString,x.last_name.toString,x.first_name.toString,x.url.toString))
          Ok(s"Mail envoyé")
        case Failure(f) =>
          BadRequest(s"Erreur dans la requete")
      }
    }
  }



  def Emailmdp (to : String , last_name : String, first_name :String, link : String) :String =  {
    val email = Email(
      subject = "Mot de passe oublié sur Graduate Follow Up",
      from = s"Groupe ICC <projet.entreprise.icc@gmail.com>",
      to = Seq(to),
      bodyHtml = Some(
        s"""<html>
           |<body>
           |<p>Bonjour <b>$last_name $first_name</b>,
           |<br>
           | Merci de cliquer sur le lien ci dessous pour mettre a jour votre mot de passe.</p>
           | <p>$link</p>
           | <br>
           | <p> Cordialement Service Mail </p>
           | </body></html>""".stripMargin)
    )
    mailerClient.send(email)
    s"Mail envoyé a "+last_name+" "+first_name

  }

}
