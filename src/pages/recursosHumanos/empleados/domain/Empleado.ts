import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Empleado extends EntidadAuditable {
  identificacion: string | null
  nombres: string | null
  apellidos: string | null
  telefono: string | null
  fecha_nacimiento: string | null
  tipo_sangre: string | null
  direccion: string | null
  estado_civil: string | null
  jefe: string | null
  email: string | null
  correo_personal: string | null
  password: string | null
  usuario: string | null
  canton: string | null
  nombre_canton: string | null
  estado: boolean | null
  cargo: number | null
  nombre_cargo: string | null
  area: number | null
  area_info: string | null
  num_cuenta: string | null
  banco: number | null
  salario: number | null
  departamento: number | null
  departamento_id: number | null
  roles: string[] | string // | null
  permisos: string[] | string // | null
  grupo: number | null
  fecha_ingreso: string | null
  antiguedad: string | null
  fecha_vinculacion: string | null
  modificar_fecha_vinculacion: boolean | null
  fecha_salida: string | null
  tipo_contrato: number | null
  tipo_contrato_info: string | null
  disponible: boolean
  es_lider: boolean
  tiene_grupo: boolean
  firma_url: string | null
  foto_url: string | null
  es_responsable_departamento: boolean
  convencional: number | null
  telefono_empresa: number | null
  extension: number | null
  coordenadas: number | null
  casa_propia: boolean
  vive_con_discapacitados: boolean
  responsable_discapacitados: boolean
  tiene_discapacidad: boolean
  observacion: string | null
  nivel_academico: string | null
  grupo_id: number | null
  responsable_departamento: boolean
  supa: number | null
  talla_zapato: string | null
  talla_camisa: string | null
  talla_guantes: string | null
  talla_pantalon: string | null
  genero: string | null
  esta_en_rol_pago: boolean | null
  realiza_factura: boolean | null
  banco_info: string | null
  acumula_fondos_reserva: boolean | null
  familiares: [] | null

  constructor() {
    super()
    this.identificacion = null
    this.nombres = null
    this.apellidos = null
    this.telefono = null
    this.fecha_nacimiento = null
    this.tipo_sangre = null
    this.direccion = null
    this.estado_civil = null
    this.jefe = null
    this.email = null
    this.correo_personal = null
    this.password = null
    this.usuario = null
    this.canton = null
    this.nombre_canton = null
    this.estado = true
    this.cargo = null
    this.nombre_cargo = null
    this.area = null
    this.area_info = null
    this.num_cuenta = null
    this.banco = null
    this.salario = null
    this.departamento = null
    this.departamento_id = null
    this.roles = []
    this.permisos = []
    this.grupo = null
    this.fecha_ingreso = null
    this.antiguedad = null
    this.modificar_fecha_vinculacion = false
    this.fecha_vinculacion = null
    this.fecha_salida = null
    this.tipo_contrato = null
    this.tipo_contrato_info = null
    this.disponible = true
    this.es_lider = false
    this.grupo_id = null
    this.tiene_grupo = false
    this.firma_url = null
    this.foto_url = null
    this.es_responsable_departamento = false
    this.convencional = null
    this.telefono_empresa = null
    this.extension = null
    this.coordenadas = null
    this.casa_propia = true
    this.vive_con_discapacitados = false
    this.responsable_discapacitados = false
    this.tiene_discapacidad = false
    this.nivel_academico = null
    this.observacion = null
    this.responsable_departamento = false
    this.supa = null
    this.talla_zapato = null
    this.talla_camisa = null
    this.talla_guantes = null
    this.talla_pantalon = null
    this.genero = 'M'
    this.banco_info = null
    this.esta_en_rol_pago = true
    this.acumula_fondos_reserva = false
    this.realiza_factura = false
    this.familiares = []
  }
}
