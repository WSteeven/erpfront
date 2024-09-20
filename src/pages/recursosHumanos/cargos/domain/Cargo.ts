import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Cargo extends EntidadAuditable {
  nombre: string | null
  estado: boolean
  aprobado_rrhh: boolean

  constructor() {
    super()
    this.nombre = null
    this.estado = true
    this.aprobado_rrhh = true
  }
}
