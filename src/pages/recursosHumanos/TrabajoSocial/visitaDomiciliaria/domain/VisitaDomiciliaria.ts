import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Salud } from 'trabajoSocial/salud/domain/Salud'
import { EconomiaFamiliar } from 'trabajoSocial/visitaDomiciliaria/domain/EconomiaFamiliar'
import { Vivienda } from 'trabajoSocial/informacion_vivienda/domain/Vivienda'
import { ServicioBasico } from 'trabajoSocial/servicios_basicos/domain/ServicioBasico'

export class VisitaDomiciliaria extends EntidadAuditable {
  empleado: string | null
  composicion_familiar: any
  imagen_genograma: string | null
  imagen_croquis: string | null
  imagen_visita_domiciliaria: string | null
  salud: Salud | null
  economia_familiar: EconomiaFamiliar | null
  vivienda: Vivienda | null
  servicios_basicos: ServicioBasico | null
  diagnostico_social: string | null
  observaciones: string | null

  constructor() {
    super()
    this.empleado = []
    this.composicion_familiar = []
    this.imagen_genograma = null
    this.imagen_croquis = null
    this.imagen_visita_domiciliaria = null
    this.salud = new Salud()
    this.economia_familiar = new EconomiaFamiliar()
    this.vivienda = new Vivienda()
    this.servicios_basicos = new ServicioBasico()
    this.diagnostico_social = null
    this.observaciones = null
  }
}
