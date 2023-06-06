import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Proveedor extends EntidadAuditable {
  empresa: number | null
  estado: boolean | null
  razon_social: string | null
  sucursal: string | null
  ubicacion: string | null
  parroquia: string | null
  direccion: string | null
  celular: string | null
  telefono: string | null

  constructor() {
    super()
    this.empresa = null
    this.estado = true
    this.razon_social = null
    this.sucursal = null
    this.ubicacion = null
    this.parroquia = null
    this.direccion = null
    this.celular = null
    this.telefono = null
  }
}
