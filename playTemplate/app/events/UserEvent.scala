package events

import org.joda.time.Instant

sealed trait UserEvent {
  def id : Long
  def date : Instant
}

case class UserCreated (id : Long, gender : String, name : String, email : String, login : String, date : Instant = Instant.now()) extends UserEvent
case class UserNameChanged (id : Long, newName : String, date : Instant = Instant.now()) extends UserEvent
case class UserLoginChanged (id : Long, newLogin : String, date : Instant = Instant.now()) extends UserEvent
case class UserDeleted (id : Long, date : Instant = Instant.now()) extends UserEvent
