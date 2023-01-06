import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ControlMaterialSubtarea extends EntidadAuditable {
  descripcion: string | null
  cantidades: number | null
  cantidad_usada: number | null
  cantidad_devuelta: number | null

  constructor() {
    super()
    this.descripcion = null
    this.cantidades = null
    this.cantidad_usada = null
    this.cantidad_devuelta = null
  }
}
