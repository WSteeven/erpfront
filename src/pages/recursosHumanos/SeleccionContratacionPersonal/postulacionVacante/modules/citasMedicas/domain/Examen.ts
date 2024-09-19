import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class Examen extends EntidadAuditable {
  postulacion_id: number | null
  fecha_hora: string | null
  canton: number | null
  direccion: string | null
  laboratorio: string | null
  indicaciones: string | null
  se_realizo_examen: boolean
  es_apto: boolean
  observacion: string | null


  constructor() {
    super()
    this.postulacion_id = null
    this.fecha_hora = null
    this.canton = null
    this.direccion = null
    this.laboratorio = null
    this.indicaciones = null
    this.se_realizo_examen = false
    this.es_apto = false
    this.observacion = null
  }
}
