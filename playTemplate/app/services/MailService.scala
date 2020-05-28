import net.kaliber.mailer._

case class mailservice(listeId : List) {

  val proprietemail = MailerSettings(
    protocol = Some("smtps"),
    host = "tournieral@eisti.eu",
    port = "465",

  )

  def preparemail(info : Array ): Email ={
    val mail = Email(
      subject = "Mise a jour des Informations",
      from = EmailAddress("Groupe ICC", "tournieral@eisti.eu"),
      text = "Bonjour"+info[1]+" "+info[2]", ",
      htmlText = "htmlText")
      .to("Erik Westra TO", "ewestra+to@rhinofly.nl")
    )

  }
  def envoimail(): Unit={
    new Mailer(Session.fromSetting(proprietemail).sendEmail(preparemail(info)))
  }
}
