import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export  class FichaSocioeconomica extends EntidadAuditable {
  empleado: string |null

  constructor() {
    super()
    this.empleado = null

  }
}
