import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class
  BancoPostulante extends EntidadAuditable {
  cargo: string | null
  puntuacion: string | null
  nombres_apellidos: string | null
  observacion: string | null
  postulacion: number | null
  postulacion_id: number | null
  descartado: boolean
  fue_contactado: number | null

  // Datos del usuario
  nombres: string | null
  apellidos: string | null
  identificacion: string | null
  tipo_identificacion: string | null
  telefono: string | null
  correo_personal: string | null
  genero: string | null
  identidad_genero: string | null
  pais: string | null
  pais_residencia: string | null
  fecha_nacimiento: string | null
  direccion: string | null

  constructor() {
    super();
    this.cargo = null
    this.puntuacion = null
    this.observacion = null
    this.nombres_apellidos = null
    this.postulacion = null
    this.postulacion_id = null
    this.descartado = false
    this.fue_contactado = 0

    // Datos del usuario
    this.nombres = null
    this.apellidos = null
    this.fecha_nacimiento = null
    this.identificacion = null
    this.tipo_identificacion = null
    this.telefono = null
    this.correo_personal = null
    this.genero = 'M'
    this.identidad_genero = null
    this.pais = null
    this.pais_residencia = null
    this.direccion = null
  }
}
