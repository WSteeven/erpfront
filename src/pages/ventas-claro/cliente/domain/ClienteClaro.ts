import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ClienteClaro extends EntidadAuditable {
  id: number | null
  supervisor: number | null
  canton: number | null
  parroquia: number | null
  identificacion: string | null
  nombres: string | null
  apellidos: string | null
  telefono1: string | null
  telefono2: string | null
  direccion: string | null
  tipo_cliente: 'cliente' | 'prospecto' | null
  correo_electronico: string | null
  foto_cedula_frontal: string | null
  foto_cedula_posterior: string | null
  fecha_expedicion_cedula: string | null
  activo: boolean

  constructor() {
    super()
    this.id = null
    this.supervisor = null
    this.canton = null
    this.parroquia = null
    this.identificacion = null
    this.nombres = null
    this.apellidos = null
    this.telefono1 = null
    this.telefono2 = null
    this.direccion = null
    this.tipo_cliente = null
    this.correo_electronico = null
    this.foto_cedula_frontal = null
    this.foto_cedula_posterior = null
    this.fecha_expedicion_cedula = null
    this.activo = true
  }
}
