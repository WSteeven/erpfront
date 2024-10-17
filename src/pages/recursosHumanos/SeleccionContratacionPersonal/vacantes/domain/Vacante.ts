import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Vacante extends EntidadAuditable {
  nombre: string | null
  tipo_puesto: number | null
  publicante: number | null
  solicitud: number | null
  imagen_referencia: string | null
  imagen_publicidad: string | null
  fecha_caducidad: string | null
  modalidad: string | null
  descripcion: string
  tipo_empleo: string | null
  anios_experiencia: string | null
  formaciones_academicas: any[] | null
  numero_postulantes: number
  areas_conocimiento: any[]
  activo: boolean
  disponibilidad_viajar: boolean
  requiere_licencia: boolean
  acepta_discapacitados: boolean
  rango_edad: boolean
  edad_personalizada: []|null
  postulantes_preseleccionados: number | null
  canton: number | null
  num_plazas: number | null
  estado_mi_postulacion: string | null

  //Variables auxiliares
  requiere_formacion_academica: boolean
  requiere_experiencia: boolean
  es_favorita: boolean
  ya_postulada: boolean
  es_completada: boolean


  constructor() {
    super()
    this.nombre = null
    this.tipo_puesto = null
    this.publicante = null
    this.solicitud = null
    this.modalidad = null
    this.imagen_referencia = null
    this.imagen_publicidad = null
    this.fecha_caducidad = null
    this.descripcion = ''
    this.tipo_empleo = null
    this.anios_experiencia = null
    this.areas_conocimiento = []
    this.formaciones_academicas = []
    this.numero_postulantes = 0
    this.disponibilidad_viajar = false
    this.requiere_licencia = false
    this.acepta_discapacitados = false
    this.rango_edad = false
    this.edad_personalizada = { min:18, max:65 }
    this.requiere_formacion_academica = false
    this.requiere_experiencia = false
    this.postulantes_preseleccionados = null
    this.estado_mi_postulacion = null
    this.canton = null
    this.num_plazas = 1
    this.activo = true
    this.es_favorita = false
    this.ya_postulada = false
    this.es_completada = false
  }
}
