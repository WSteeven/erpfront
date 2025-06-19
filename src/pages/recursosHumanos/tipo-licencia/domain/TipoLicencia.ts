import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class TipoLicencia extends EntidadAuditable {
  nombre: string | null
  num_dias: number | null
  estado: boolean

  constructor() {
    super()
    this.nombre = null
    this.num_dias = 0
    this.estado = true
  }
}
