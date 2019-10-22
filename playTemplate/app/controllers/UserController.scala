package controllers

import io.swagger.annotations._
import javax.inject.{Inject, Singleton}
import models.User
import play.api.libs.json.{Json, Writes}
import play.api.mvc.{AbstractController, ControllerComponents}
import services.UserService

import scala.util.{Failure, Success, Try}

@Api(value="/user")
@Singleton
case class UserController@Inject() (cc : ControllerComponents, userService : UserService) extends AbstractController(cc){

  def list = Action {

    userService.users.isEmpty match {
      case false => NoContent
      case true => Ok(userService.users.toString())
    }
  }


  @ApiOperation(value="Get a specific user")
  @ApiResponses( Array (
    new ApiResponse (code=200, message="The asked user"),
    new ApiResponse (code=404, message="The user does not exist")
  ))
  def lookup (@ApiParam(value = "The user id") id : Long) = Action {

    val user = userService.users.find(_.id == id)

     user match {
      case None => NotFound
      case Some(u) => Ok(Json.prettyPrint(Json.toJson(u)))
    }
  }


  def create () = Action(parse.json) {
    request => {
      Try {
        val gender = (request.body \ "gender").as[String]
        val name = (request.body \ "name").as[String]
        val email = (request.body \ "email").as[String]
        val login = (request.body \ "login").as[String]
        userService.addNewUser(gender, name, email, login)
      } match {
        case Success(id) => Ok(id.toString())
        case Failure(exception) => InternalServerError(exception.getMessage())
      }
    }
  }


  def changeName (id : Long, newName : String) = Action {
    userService.changeName(id, newName) match {
      case None => NotFound
      case Some(u) => Ok(u.toString)
    }
  }

  def changeLogin (id : Long, newLogin : String) = Action {
    userService.changeLogin(id, newLogin) match {
      case None => NotFound
      case Some(u) => Ok(u.toString)
    }
  }

  def delete (id: Long) = Action {

    userService.delete(id) match {
      case true => Ok(userService.delete(id).toString)
      case false => NotFound
    }

  }

  def todo (id : Long) = TODO

}
