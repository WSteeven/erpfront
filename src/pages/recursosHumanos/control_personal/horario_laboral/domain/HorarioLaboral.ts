import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class HorarioLaboral extends EntidadAuditable {
  tipo: string | null
  nombre: string | null
  dia: string | null
  hora_entrada: string | null
  hora_salida: string | null
  inicio_pausa: string | null
  fin_pausa: string | null
  activo: boolean
  tiene_pausa: boolean

  constructor() {
    super()
    this.tipo = null
    this.nombre = null
    this.dia = null
    this.hora_entrada = null
    this.hora_salida = null
    this.inicio_pausa = null
    this.fin_pausa = null
    this.activo = true
    this.tiene_pausa = false
  }
}
