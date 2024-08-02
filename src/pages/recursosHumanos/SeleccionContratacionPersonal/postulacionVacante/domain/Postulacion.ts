import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class Postulacion extends EntidadAuditable {
  vacante: number | null
  postulante: number | null
  nombres: string | null
  apellidos: string | null
  identificacion: string | null
  identidad_genero: string | null
  tipo_identificacion: string | null
  telefono: string | null
  correo_personal: string | null
  genero: string | null
  pais: string | null
  pais_residencia: string | null
  fecha_nacimiento: string | null

  tengo_documentos_regla:boolean


  constructor() {
    super()
    this.vacante = null
    this.postulante = null
    this.nombres = null
    this.apellidos = null
    this.identificacion = null
    this.tipo_identificacion = null
    this.identidad_genero = null
    this.telefono = null
    this.correo_personal = null
    this.genero = null
    this.pais = null
    this.pais_residencia = null
    this.fecha_nacimiento = null
    this.tengo_documentos_regla = false
  }
}
