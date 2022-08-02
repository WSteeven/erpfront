import {Pais} from "@sistema/pais/domain/pais"
import {Provincia} from "@sistema/provincia/domain/provincia"
import {Ciudad} from "@sistema/ciudad/domain/ciudad"

export interface ListadosUbicacion {
  paisesListado: Pais[]
  ciudadesListado: Ciudad[]
  provinciasListado: Provincia[]
}
