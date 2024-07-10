import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class SolicitudPuestoEmpleo extends EntidadAuditable {
  nombre: string | null
  tipo_puesto: number | null
  puesto: number | null
  autorizacion: string | null
  descripcion: string
  conocimientos: any[] | null
  formaciones_academicas: any[] | null
  descripcion_vacante: string | null
  requiere_experiencia: boolean
  anios_experiencia: number | null

  constructor() {
    super()
    this.nombre = null
    this.puesto = null
    this.tipo_puesto = null
    this.autorizacion = null
    this.descripcion = ''
    this.descripcion_vacante = null
    this.anios_experiencia = null
    this.conocimientos = []
    this.formaciones_academicas = []
    this.requiere_experiencia = false
  }
}
