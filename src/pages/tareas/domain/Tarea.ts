import { Hidratable } from 'pages/shared/entidad/domain/hidratable'

export class Tarea extends Hidratable {
  codigo_tarea_jp: string | null
  codigo_tarea_cliente: string | null
  detalle: string | null
  cliente: number | string | null
  solicitante: string | null
  correo_solicitante: string | null
  fecha_vencimiento: string | null
  fecha_agendado: string | null
  hora_agendado: string | null
  coordinador: string | null
  estado: string | null // pendiente
  // ubicacion de cliente
  provincia: number | null
  ciudad: number | null
  parroquia: number | null
  referencias: string | null
  direccion: string | null
  georeferencia_x: string | null
  georeferencia_y: string | null
  // contacto
  nombre_contacto: string | null
  apellidos_contacto: string | null
  telefono_contacto: string | null
  celular_contacto: string | null

  constructor() {
    super()
    this.codigo_tarea_jp = null
    this.codigo_tarea_cliente = null
    this.detalle = null
    this.cliente = null
    this.solicitante = null
    this.correo_solicitante = null
    this.fecha_vencimiento = null
    this.fecha_agendado = null
    this.hora_agendado = null
    this.coordinador = null
    this.estado = null
    // ubicacion de cliente
    this.provincia = null
    this.ciudad = null
    this.parroquia = null
    this.referencias = null
    this.direccion = 'AV. SIEMPRE VIVA'
    this.georeferencia_x = '000'
    this.georeferencia_y = '111'
    // contacto
    this.nombre_contacto = 'HOMERO'
    this.apellidos_contacto = 'SIMPSON'
    this.telefono_contacto = '123546'
    this.celular_contacto = '0897564321'
  }
}
