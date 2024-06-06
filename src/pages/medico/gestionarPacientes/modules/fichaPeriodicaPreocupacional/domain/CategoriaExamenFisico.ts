import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class CategoriaExamenFisico extends EntidadAuditable {
  nombre: string | null
  region_cuerpo: number | null

  constructor() {
    super()
    this.nombre = null
    this.region_cuerpo = null
  }
}
