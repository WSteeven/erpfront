export class Tarea {
  numero_jp: string | null
  numero_cliente: string | null
  cliente: number | null
  solicitante: string | null
  fecha_vencimiento: string | null
  fecha_agendado: string | null
  hora_agendado: string | null
  coordinador: string | null

  constructor() {
    this.numero_jp = null
    this.numero_cliente = null
    this.cliente = null
    this.solicitante = null
    this.fecha_vencimiento = null
    this.fecha_agendado = '20/04/1996'
    this.hora_agendado = '08:32'
    this.coordinador = 'MARILÚ JARAMILLO'
  }
}
