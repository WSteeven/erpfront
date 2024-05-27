import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class MedicacionHabitual extends EntidadAuditable {
  nombre: string | null
  cantidad: number | null

  constructor() {
    super()
    this.nombre = null
    this.cantidad = null
  }
}
