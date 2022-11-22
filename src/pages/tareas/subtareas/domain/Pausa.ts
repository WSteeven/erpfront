export class Pausa {
  id: number | null
  fecha_hora_pausa: string | null
  fecha_hora_retorno: string | null
  motivo: string | null

  constructor() {
    this.id = null
    this.fecha_hora_pausa = null
    this.fecha_hora_retorno = null
    this.motivo = null
  }
}
