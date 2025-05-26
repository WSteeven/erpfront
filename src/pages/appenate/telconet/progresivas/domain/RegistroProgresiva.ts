import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class RegistroProgresiva extends EntidadAuditable {
  progresiva_id: string | null
  num_elemento: string | null
  propietario: string | null
  elemento: string | null
  tipo_poste: string | null
  material_poste: string | null
  ubicacion_gps: string | null
  foto: string | null
  observaciones: string | null
  tiene_control_cambio: string | null
  observacion_cambio: string | null
  foto_cambio: string | null
  hora_cambio: string | null
  materiales: []

  constructor() {
    super()
    this.progresiva_id = null
    this.num_elemento = null
    this.propietario = null
    this.elemento = null
    this.tipo_poste = null
    this.material_poste = null
    this.ubicacion_gps = null
    this.foto = null
    this.observaciones = null
    this.tiene_control_cambio = null
    this.observacion_cambio = null
    this.foto_cambio = null
    this.hora_cambio = null
    this.materiales = []
  }
}
