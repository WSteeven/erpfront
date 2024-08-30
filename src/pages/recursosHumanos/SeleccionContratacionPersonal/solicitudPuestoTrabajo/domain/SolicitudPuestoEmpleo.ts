import { EntidadAuditable } from 'src/shared/entidad/domain/entidadAuditable'

export class SolicitudPuestoEmpleo extends EntidadAuditable {
  nombre: string | null
  tipo_puesto: number | null
  cargo: number | null
  solicitante: string | null
  autorizador: string | null
  autorizacion: string | null
  modalidad: string | null
  descripcion: string
  formaciones_academicas: any[]
  requiere_formacion_academica: boolean
  requiere_experiencia: boolean
  disponibilidad_viajar: boolean
  requiere_licencia: boolean
  anios_experiencia: number | null
  areas_conocimiento: any[]
  canton: number | null
  num_plazas: number | null

  constructor() {
    super()
    this.nombre = null
    this.cargo = null
    this.tipo_puesto = null
    this.solicitante = null
    this.autorizador = null
    this.autorizacion = null
    this.modalidad = null
    this.descripcion = ''
    this.anios_experiencia = null
    this.formaciones_academicas = []
    this.requiere_formacion_academica = false
    this.requiere_experiencia = false
    this.disponibilidad_viajar = false
    this.requiere_licencia = false
    this.areas_conocimiento = []
    this.canton = null
    this.num_plazas = 1
  }
}
