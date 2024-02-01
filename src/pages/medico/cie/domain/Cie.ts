import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Cie extends EntidadAuditable {
  codigo: string |  null
  nombre: string |  null
  documento: string |null
  tieneDocumento: boolean | null

   constructor() {
    super()
    this.codigo = null
    this.nombre = null
    this.documento = null
    this.tieneDocumento = null

  }
}
