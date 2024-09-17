import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class ReferenciaPersonal extends EntidadAuditable {
  nombres_apellidos: string | null
  cargo: string | null
  telefono: string | null
  correo: string | null
  // archivo_adjunto: string | null



  constructor() {
    super()
    // this.archivo_adjunto = null
    this.nombres_apellidos = null
    this.cargo = null
    this.telefono = null
    this.correo = null
  }
}
