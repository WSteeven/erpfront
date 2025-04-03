import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class RegistroIncidente extends EntidadAuditable {
  vehiculo: string | null
  fecha: string | null
  descripcion: string | null
  tipo: string | null
  gravedad: string | null
  persona_reporta: string | null
  persona_registra: string | null
  aplica_seguro: boolean

  constructor() {
    super()
    this.vehiculo = null
    this.fecha = null
    this.descripcion = null
    this.tipo = null
    this.gravedad = null
    this.persona_reporta = null
    this.persona_registra = null
    this.aplica_seguro = false
  }
}

