import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class Etiqueta extends EntidadAuditable {
  nombre: string | null
  activo: boolean
  categoria: number | null
  categoria_id: number | null

  constructor() {
    super()
    this.nombre = null
    this.activo = true
    this.categoria = null
    this.categoria_id = null
  }
}
