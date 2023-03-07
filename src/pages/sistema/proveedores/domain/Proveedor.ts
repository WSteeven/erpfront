import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Proveedor extends EntidadAuditable {
  empresa: number | null
  estado: boolean | null
  razon_social: string | null

  constructor() {
    super()
    this.empresa = null
    this.estado = true
    this.razon_social = null
  }
}
