import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Empleado extends EntidadAuditable {
  identificacion: string | null
  nombres: string | null
  apellidos: string | null
  telefono: string | null
  fecha_nacimiento: string | null
  jefe: string | null
  email: string | null
  password: string | null
  usuario: string | null
  canton: string | null
  estado: boolean | null
  cargo: number | null
  roles: string[] | string // | null
  permisos: string[] | string // | null
  grupo: number | null
  disponible: boolean
  es_lider: boolean
  tiene_grupo: boolean
  firma_url: string | null
  foto_url: string | null
  // es_responsable_grupo: boolean
  convencional: number | null
  telefono_empresa: number | null
  extension: number | null
  coordenadas: number | null
  casa_propia: boolean
  vive_con_discapacitados: boolean
  responsable_discapacitados: boolean

  grupo_id: number | null

  constructor() {
    super()
    this.identificacion = null
    this.nombres = null
    this.apellidos = null
    this.telefono = null
    this.fecha_nacimiento = null
    this.jefe = null
    this.email = null
    this.password = null
    this.usuario = null
    this.canton = null
    this.estado = true
    this.cargo = null
    this.roles = []
    this.permisos = []
    this.grupo = null
    this.disponible = true
    this.es_lider = false
    this.grupo_id = null
    this.tiene_grupo = false
    this.firma_url = null
    this.foto_url = null
    // this.es_responsable_grupo = false
    this.convencional = null
    this.telefono_empresa = null
    this.extension = null
    this.coordenadas = null
    this.casa_propia = true
    this.vive_con_discapacitados = false
    this.responsable_discapacitados = false
  }
}
