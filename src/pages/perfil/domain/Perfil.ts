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
  created_at: string | null
  cargo: string | null
  grupo: string | null
  usuario: string | null
  roles: string[] | null
  permisos: string[] | null
  foto_url: string | null
  firma_url: string | null

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
    this.created_at = null
    this.cargo = null
    this.grupo = null
    this.usuario = null
    this.roles = null
    this.permisos = null
    this.foto_url = null
    this.firma_url = null
  }
}
