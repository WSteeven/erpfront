import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class
  BancoPostulante extends EntidadAuditable {
  cargo: string | null
  puntuacion: string | null
  nombres_apellidos: string | null
  observacion: string | null
  postulacion: number | null
  descartado: boolean
  fue_contactado: number | null

  constructor() {
    super();
    this.cargo = null
    this.puntuacion = null
    this.observacion = null
    this.nombres_apellidos = null
    this.postulacion = null
    this.descartado = false
    this.fue_contactado = 0
  }
}
