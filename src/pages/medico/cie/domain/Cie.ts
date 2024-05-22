import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Cie extends EntidadAuditable {
  codigo: string |  null
  nombre_enfermedad: string |  null
  documento: string |null
  tieneDocumento: boolean | null

   constructor() {
    super()
    this.codigo = null
    this.nombre_enfermedad = null
    this.documento = null
    this.tieneDocumento = null

  }
}
