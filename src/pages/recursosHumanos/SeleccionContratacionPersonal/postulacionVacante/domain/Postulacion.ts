import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Postulacion extends EntidadAuditable {
  vacante: number | null
  postulante: number | null
  tipo_postulante: string | null
  nombre: string | null //
  nombres: string | null //
  nombres_apellidos: string | null //
  apellidos: string | null //
  identificacion: string | null //
  genero: string | null //
  identidad_genero: string | null //
  tipo_identificacion: string | null //
  telefono: string | null //
  correo_personal: string | null //
  pais: string | null //
  pais_residencia: string | null //
  fecha_nacimiento: string | null //
  direccion: string | null //
  mi_experiencia: string | null //

  tengo_documentos_regla: boolean //

  tengo_formacion_academica_requerida: boolean //
  tengo_conocimientos_requeridos: boolean //
  tengo_experiencia_requerida: boolean //
  tengo_disponibilidad_viajar:boolean //
  tengo_licencia_conducir: boolean //
  tipo_licencia: string | null //


  constructor() {
    super()
    this.vacante = null
    this.postulante = null
    this.tipo_postulante = null
    this.nombre = null
    this.nombres = null
    this.nombres_apellidos = null
    this.apellidos = null
    this.identificacion = null
    this.tipo_identificacion = null
    this.telefono = null
    this.correo_personal = null
    this.genero = 'M'
    this.identidad_genero = null
    this.pais = null
    this.direccion= null
    this.mi_experiencia= null
    this.pais_residencia = null
    this.fecha_nacimiento = null
    this.tengo_documentos_regla = false

    this.tengo_formacion_academica_requerida = false
    this.tengo_conocimientos_requeridos = false
    this.tengo_experiencia_requerida = false
    this.tengo_disponibilidad_viajar = false
    this.tengo_licencia_conducir = false
    this.tipo_licencia = null

  }
}
