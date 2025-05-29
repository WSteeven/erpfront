import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class PlantillaBase extends EntidadAuditable {
  nombre: string | null
  url: string | null
  _method:string

  constructor() {
    super()
    this.nombre = null
    this.url = null
    this._method = 'GET'
  }
}
