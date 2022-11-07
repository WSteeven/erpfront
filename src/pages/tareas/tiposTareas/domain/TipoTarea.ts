import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class TipoTarea extends EntidadAuditable {
  cliente: number | null
  nombre: string | null
  plantilla: string | null

  constructor() {
    super()
    this.cliente = null
    this.nombre = null
    this.plantilla = null
  }
}
