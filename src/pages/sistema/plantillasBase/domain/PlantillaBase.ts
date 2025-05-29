import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class PlantillaBase extends EntidadAuditable {
  nombre: string | null
  url: string | null

  constructor() {
    super()
    this.nombre = null
    this.url = null
  }
}
