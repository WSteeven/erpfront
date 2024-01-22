import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ClienteClaro extends EntidadAuditable {
  id: number | null
  supervisor: number | null
  identificacion: string | null
  nombres: string | null
  apellidos: string | null
  telefono1: string | null
  telefono2: string | null
  direccion: string | null
  activo: boolean

  constructor() {
    super()
    this.id = null
    this.supervisor = null
    this.identificacion = null
    this.nombres = null
    this.apellidos = null
    this.telefono1 = null
    this.telefono2 = null
    this.direccion = null
    this.activo = true

  }
}
