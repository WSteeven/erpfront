import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class FondoRotativoAutorizacionesFecha extends EntidadAuditable {
  usuario: number | null
  estado: number | null
  fecha_inicio: Date | null
  fecha_fin: Date | null
  constructor() {
    super()
    this.usuario = null
    this.estado = null
    this.fecha_inicio = null
    this.fecha_fin = null
  }
}
