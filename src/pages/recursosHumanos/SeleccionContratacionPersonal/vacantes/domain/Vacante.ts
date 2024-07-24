import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Vacante extends EntidadAuditable {
  nombre: string | null
  tipo_puesto: number | null
  publicante: number | null
  solicitud: number | null
  imagen_referencia: string | null
  imagen_publicidad: string | null
  fecha_caducidad: Date | null
  descripcion: string
  tipo_empleo:string|null
  anios_experiencia: number | null
  formaciones_academicas: any[] | null
  numero_postulantes: number
  areas_conocimiento: any[]
  activo: boolean
  //Variables auxiliares
  requiere_formacion_academica: boolean
  requiere_experiencia: boolean

  constructor() {
    super()
    this.nombre = null
    this.tipo_puesto = null
    this.publicante = null
    this.solicitud = null
    this.imagen_referencia = null
    this.imagen_publicidad = null
    this.fecha_caducidad = null
    this.descripcion = ''
    this.tipo_empleo = null
    this.anios_experiencia = null
    this.areas_conocimiento = []
    this.formaciones_academicas = []
    this.numero_postulantes = 0
    this.requiere_formacion_academica = false
    this.requiere_experiencia = false
    this.activo = true
  }
}
