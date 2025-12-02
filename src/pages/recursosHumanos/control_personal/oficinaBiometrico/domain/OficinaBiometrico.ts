import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class OficinaBiometrico extends EntidadAuditable {
  nombre: string | null
  descripcion: string | null
  direccion: string | null
  latitud: string | null
  longitud: string | null
  direccion_ip: string | null
  puerto: string | null
  clave_acceso: string | null
  canton: string | null
  activo: true

  constructor() {
    super()
    this.nombre = null
    this.descripcion = null
    this.direccion = null
    this.latitud = null
    this.longitud = null
    this.direccion_ip = null
    this.puerto = null
    this.clave_acceso = null
    this.canton = null
    this.activo = true
  }
}
