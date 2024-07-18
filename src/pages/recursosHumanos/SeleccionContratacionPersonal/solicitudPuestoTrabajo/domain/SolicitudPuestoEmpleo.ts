import { EntidadAuditable } from 'src/shared/entidad/domain/entidadAuditable'

export class SolicitudPuestoEmpleo extends EntidadAuditable {
  nombre: string | null
  tipo_puesto: number | null
  cargo: number | null
  solicitante: string | null
  autorizador: string | null
  autorizacion: string | null
  descripcion: string
  formaciones_academicas: any[]
  requiere_formacion_academica: boolean
  requiere_experiencia: boolean
  anios_experiencia: number | null
  areas_conocimiento: any[]

  constructor() {
    super()
    this.nombre = null
    this.cargo = null
    this.tipo_puesto = null
    this.solicitante = null
    this.autorizador = null
    this.autorizacion = null
    this.descripcion = ''
    this.anios_experiencia = null
    this.formaciones_academicas = []
    this.requiere_formacion_academica = false
    this.requiere_experiencia = false
    this.areas_conocimiento = []
  }
}
