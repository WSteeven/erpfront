import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Postulante extends EntidadAuditable {
  nombres: string | null
  apellidos: string | null
  tipo_documento_identificacion: string | null
  numero_documento_identificacion: string | null
  telefono: string | null
  constructor() {
    super()
    this.nombres = null
    this.apellidos = null
    this.tipo_documento_identificacion = null
    this.numero_documento_identificacion = null
    this.telefono = null
  }
}
