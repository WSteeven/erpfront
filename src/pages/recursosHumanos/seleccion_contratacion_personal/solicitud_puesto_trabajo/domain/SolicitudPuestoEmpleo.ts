import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class SolicitudPuestoEmpleo extends EntidadAuditable {
  nombre: string | null
  tipo_puesto: number | null
  puesto: number | null
  autorizacion: string | null
  descripcion_vacante: string | null
  anios_experiencia: number | null
  conocimientos:  any[] | null
  formaciones_academicas:  any[] | null

  constructor() {
    super()
    this.nombre = null
    this.puesto = null
    this.tipo_puesto = null
    this.autorizacion = null
    this.descripcion_vacante = null
    this.anios_experiencia = null
    this.conocimientos = []
    this.formaciones_academicas = []
  }
}
