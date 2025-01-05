import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ServicioBasico extends EntidadAuditable{
  luz: string | null
  agua: string | null
  telefono: string | null
  internet: string | null
  cable: string | null
  servicios_sanitarios: string | null

  constructor() {
    super()
    this.luz = null
    this.agua = null
    this.telefono = null
    this.internet = null
    this.cable = null
    this.servicios_sanitarios = null
  }
}
