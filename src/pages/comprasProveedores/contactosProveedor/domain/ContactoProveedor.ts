import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class ContactoProveedor extends EntidadAuditable {
  nombres: string | null
  apellidos: string | null
  nombres_completos: string | null
  celular: string | null
  ext: string | null
  correo: string | null
  tipo_contacto: string | null
  empresa: number | null
  proveedor: number | null
  razon_social: number | null

  constructor() {
    super()
    this.nombres = null
    this.apellidos = null
    this.nombres_completos = null
    this.celular = null
    this.ext = null
    this.correo = null
    this.tipo_contacto = null
    this.empresa = null
    this.proveedor = null
    this.razon_social = null
  }
}
