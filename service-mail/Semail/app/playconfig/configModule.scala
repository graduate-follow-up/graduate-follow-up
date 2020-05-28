package playconfig

import com.typesafe.config.Config
import play.api.inject.{ Binding, Module }
import play.api.{ Configuration, Environment }

/**
  * Config Module to provide a shim for Play 2.5.x
  */
class configModule extends Module {

  override def bindings(environment: Environment, configuration: Configuration): Seq[Binding[_]] = Seq(
    bind[Config].toInstance(configuration.underlying)
  )

}
