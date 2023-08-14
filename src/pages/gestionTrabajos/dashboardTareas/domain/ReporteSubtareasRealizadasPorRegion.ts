import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ReporteSubtareasRealizadasPorRegion extends EntidadAuditable {
  region: string | null
  suma_trabajo: number | null

  constructor() {
    super()
    this.region = null
    this.suma_trabajo = null
  }
}
