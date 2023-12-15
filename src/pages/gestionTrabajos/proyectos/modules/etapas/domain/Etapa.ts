import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Etapa extends EntidadAuditable {
  nombre: string | null
  activo: boolean
  responsable: number | string | null
  responsable_id: number | null
  proyecto: number | null
  codigo_proyecto: string | number | null
  // nombre_responsable:string | null
  // nombre_proyecto: string | null

  constructor() {
    super()
    this.nombre = null
    this.activo = true
    this.responsable = null
    this.responsable_id = null
    this.proyecto = null
    this.codigo_proyecto = null
    // this.nombre_responsable = null
    // this.nombre_proyecto = null
  }
}
