import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ClienteClaro extends EntidadAuditable {
  id: number | null
  identificacion: string | null
  nombres: string | null
  apellidos: string | null
  constructor() {
    super()
    this.id = null
    this.identificacion = null
    this.nombres = null
    this.apellidos = null

  }
}
