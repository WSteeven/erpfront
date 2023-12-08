import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Familiares extends EntidadAuditable {
  id: number | null
  empleado:number | null
  empleado_info: string |null
  identificacion: string | null
  parentezco: string | null
  nombres: string | null
  apellidos: string | null

  constructor() {
    super()
    this.id = null
    this.empleado = null
    this.empleado_info = null
    this.identificacion = null
    this.parentezco = null
    this.nombres = null
    this.apellidos = null
  }
}
