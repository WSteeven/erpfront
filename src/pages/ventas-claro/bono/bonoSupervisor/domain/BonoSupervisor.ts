import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class BonoSupervisor extends EntidadAuditable {
  id: number | null
  porcentaje: number | null
  comision: number | null
  tipo_vendedor: string | null
  constructor() {
    super()
    this.id = null
    this.porcentaje = null
    this.comision = null
    this.tipo_vendedor = null

  }
}
