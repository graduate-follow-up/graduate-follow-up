package services

import events._
import javax.inject.{Inject, Singleton}
import models.User

@Singleton
case class UserService@Inject() () {

  var eventLog: Seq[UserEvent] = Seq.empty[UserEvent]
  var id: Long = 0

  def addNewUser(gender: String, name: String, email: String, login: String): Long = {
    id = id + 1
    eventLog = eventLog :+ UserCreated(id, gender, name, email, login)
    id
  }


  def delete(id: Long): Boolean = {

    users.find(_.id == id).fold(false)(_ => {
      eventLog = eventLog :+ UserDeleted(id)
      true
    })

  }

  def changeName(id: Long, newName: String): Option[User] = {

    users.find(_.id == id).fold(Option.empty[User])(u => {
      eventLog = eventLog :+ UserNameChanged(id, newName)
      Some(u.copy(name = newName))
    })
  }


  def changeLogin(id: Long, newLogin: String): Option[User] = {

    users.find(_.id == id).fold(Option.empty[User])(u => {
      eventLog = eventLog :+ UserLoginChanged(id, newLogin)
      Some(u.copy(login = newLogin))
    })
  }


  def users: List[User] = {
    def remove (l: List[User], id: Long): List[User] = {
      l.filterNot(_.id == id)
    }

    def changeName (l: List[User], id: Long, newName: String): List[User] = {
      val pos = l.indexWhere(_.id == id)
      l.updated(pos, l(pos).copy(name = newName))
    }

    def changeLogin (l: List[User], id: Long, newLogin: String): List[User] = {
      val pos = l.indexWhere(_.id == id)
      l.updated(pos, l(pos).copy(login = newLogin))
    }

    def currentState (acc: List[User], usersLog: Seq[UserEvent]): List[User] = {
      usersLog match {
        case Nil => acc
        case UserCreated(id, gender, name, email, login, _) :: l =>
          currentState(acc :+ User(id, gender, name, email, login), l)
        case UserDeleted(id, _) :: l =>
          currentState(remove(acc, id), l)
        case UserNameChanged(id, newName, _) :: l =>
          currentState(changeName(acc, id, newName), l)
        case UserLoginChanged(id, newLogin, _) :: l =>
          currentState(changeLogin(acc, id, newLogin), l)
      }
    }
    currentState(Nil, eventLog)
  }


}