import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export default class TrabajoRealizado extends EntidadAuditable {
  id: number | null
  fecha_hora: string | null
  trabajo_realizado: string | null
  // observacion: string | null
  fotografia: string | null

  constructor() {
    super()
    this.id = null
    this.fecha_hora = null
    this.trabajo_realizado = null
    // this.observacion = null
    this.fotografia = null
  }
}
