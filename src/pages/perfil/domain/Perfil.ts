import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Perfil extends EntidadAuditable {
  nombres: string | null
  apellidos: string | null
  telefono: string | null
  email: string | null
  identificacion: string | null
  fecha_nacimiento: string | null
  jefe_id: string | null
  localidad_id: number | null

  constructor() {
    super()
    this.nombres = null
    this.apellidos = null
    this.telefono = null
    this.email = null
    this.identificacion = null
    this.fecha_nacimiento = null
    this.jefe_id = null
    this.localidad_id = 1
  }
}
