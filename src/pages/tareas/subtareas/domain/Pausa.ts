export class Pausa {
  id: number | null
  fecha_pausa: string | null
  hora_pausa: string | null
  fecha_retorno: string | null
  hora_retorno: string | null
  detalle: string | null

  constructor() {
    this.id = null
    this.fecha_pausa = null
    this.hora_pausa = null
    this.fecha_retorno = null
    this.hora_retorno = null
    this.detalle = null
  }
}
