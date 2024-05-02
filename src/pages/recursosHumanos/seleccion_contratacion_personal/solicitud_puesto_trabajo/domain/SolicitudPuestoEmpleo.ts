import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class SolicitudPuestoEmpleo extends EntidadAuditable {
  nombre: string | null
  tipo_puesto: number | null
  autorizacion: string | null
  descripcion_vacante: string | null
  anios_experiencia: number | null
  conocimientos: any
  formaciones_academicas: any

  constructor() {
    super()
    this.nombre = null
    this.tipo_puesto = null
    this.autorizacion = null
    this.descripcion_vacante = null
    this.anios_experiencia = null
    this.conocimientos = null
    this.formaciones_academicas = null
  }
}
