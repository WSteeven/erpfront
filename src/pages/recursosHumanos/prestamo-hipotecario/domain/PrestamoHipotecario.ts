import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class PrestamoHipotecario extends EntidadAuditable {
  id: number | null
  empleado:number | null
  empleado_info: string |null
  mes: string | null
  nut: string | null
  valor: string | null
  tieneDocumento: boolean | null

  constructor() {
    super()
    this.id = null
    this.empleado = null
    this.empleado_info = null
    this.mes = null
    this.nut = null
    this.valor = null
    this.tieneDocumento = false
  }
}
