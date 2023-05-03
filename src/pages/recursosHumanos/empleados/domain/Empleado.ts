import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Empleado extends EntidadAuditable {
  identificacion: string | null
  nombres: string | null
  apellidos: string | null
  telefono: string | null
  fecha_nacimiento: string | null
  tipo_sangre: string | null
  dirrecion: string | null
  estado_civil: string | null
  jefe: string | null
  email: string | null
  password: string | null
  usuario: string | null
  canton: string | null
  estado: boolean | null
  cargo: number | null
  area: number | null
  num_cuenta: string | null
  banco: number | null
  salario: number | null
  roles: string[] | string // | null
  grupo: number | null
  fecha_ingreso: string | null
  fecha_salida: string | null
  tipo_contrato: number | null
  sede: number | null
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
  tiene_discapacidad: boolean
  observacion: string | null

  grupo_id: number | null

  constructor() {
    super()
    this.identificacion = null
    this.nombres = null
    this.apellidos = null
    this.telefono = null
    this.fecha_nacimiento = null
    this.tipo_sangre = null
    this.dirrecion = null
    this.estado_civil = null
    this.jefe = null
    this.email = null
    this.password = null
    this.usuario = null
    this.canton = null
    this.estado = true
    this.cargo = null
    this.area = null
    this.num_cuenta = null
    this.banco = null
    this.salario = null
    this.roles = []
    this.grupo = null
    this.fecha_ingreso = null
    this.fecha_salida = null
    this.tipo_contrato = null
    this.sede=null
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
    this.tiene_discapacidad = false
    this.observacion = null
  }
}
