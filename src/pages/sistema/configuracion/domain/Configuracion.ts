import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class ConfiguracionGeneral extends EntidadAuditable {
  logo_claro: string | null
  logo_oscuro: string | null
  logo_marca_agua: string | null
  ruc: string | null
  representante: string | null
  razon_social: string | null
  nombre_comercial: string | null
  direccion_principal: string | null
  telefono: string | null
  moneda: string | null
  tipo_contribuyente: string | null
  celular1: string | null
  celular2: string | null
  correo_principal: string | null
  correo_secundario: string | null
  sitio_web: string | null
  direccion_secundaria1: string | null
  direccion_secundaria2: string | null
  favicon: string | null
  nombre_empresa: string | null
  ciiu: string | null

  constructor() {
    super()
    this.logo_claro = null
    this.logo_oscuro = null
    this.logo_marca_agua = null
    this.ruc = null
    this.representante = null
    this.razon_social = null
    this.nombre_comercial = null
    this.direccion_principal = null
    this.telefono = null
    this.moneda = null
    this.tipo_contribuyente = null
    this.celular1 = null
    this.celular2 = null
    this.correo_principal = null
    this.correo_secundario = null
    this.sitio_web = null
    this.direccion_secundaria1 = null
    this.direccion_secundaria2 = null
    this.favicon = null
    this.nombre_empresa = null
    this.ciiu = null
  }
}
