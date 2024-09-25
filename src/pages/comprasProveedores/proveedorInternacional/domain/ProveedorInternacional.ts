import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class ProveedorInternacional extends EntidadAuditable {
  nombre: string | null
  tipo: number | null
  ruc: string | null
  pais: number | null
  direccion: string | null
  telefono: string | null
  correo: string | null
  sitio_web: string | null
  banco1: string | null
  numero_cuenta1: string | null
  codigo_swift1: string | null
  moneda1: string | null
  banco2: string | null
  numero_cuenta2: string | null
  codigo_swift2: string | null
  moneda2: string | null
  activo: boolean

  constructor() {
    super()
    this.nombre = null
    this.tipo = null
    this.ruc = null
    this.pais = null
    this.direccion = null
    this.telefono = null
    this.correo = null
    this.sitio_web = null
    this.banco1 = null
    this.numero_cuenta1 = null
    this.codigo_swift1 = null
    this.moneda1 = null
    this.banco2 = null
    this.numero_cuenta2 = null
    this.codigo_swift2 = null
    this.moneda2 = null
    this.activo = true
  }
}
