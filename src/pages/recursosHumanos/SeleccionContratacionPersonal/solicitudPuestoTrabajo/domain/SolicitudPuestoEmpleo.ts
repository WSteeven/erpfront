import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class SolicitudPuestoEmpleo extends EntidadAuditable {
  nombre: string | null
  tipo_puesto: number | null
  cargo: number | null
  autorizador: string | null
  autorizacion: string | null
  descripcion: string
  conocimientos: any[] | null
  formaciones_academicas: any[] | null
  requiere_experiencia: boolean
  anios_experiencia: number | null
  areas_conocimiento: any[]

  constructor() {
    super()
    this.nombre = null
    this.cargo = null
    this.tipo_puesto = null
    this.autorizador = null
    this.autorizacion = null
    this.descripcion = ''
    this.anios_experiencia = null
    this.conocimientos = []
    this.formaciones_academicas = []
    this.requiere_experiencia = false
    this.areas_conocimiento = []
  }
}
