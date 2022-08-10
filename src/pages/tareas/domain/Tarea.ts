export class Tarea {
  codigo_tarea_jp: string | null
  codigo_tarea_cliente: string | null
  detalle: string | null
  cliente: number | null
  solicitante: string | null
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
    this.codigo_tarea_jp = null
    this.codigo_tarea_cliente = null
    this.detalle = null
    this.cliente = null
    this.solicitante = null
    this.fecha_vencimiento = null
    this.fecha_agendado = '20/04/1996'
    this.hora_agendado = '08:32'
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
    // contatco
    this.nombre_contacto = 'HOMERO'
    this.apellidos_contacto = 'SIMPSON'
    this.telefono_contacto = '123546'
    this.celular_contacto = '0897564321'
  }
}
