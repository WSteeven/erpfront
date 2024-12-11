import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Salud extends EntidadAuditable {
  tiene_discapacidad: boolean
  discapacidades: any
  discapacidades_familiar_dependiente: any
  tiene_enfermedad_cronica: boolean
  enfermedad_cronica: string | null
  alergias: string | null
  lugar_atencion: string | null
  tiene_familiar_dependiente_discapacitado: boolean
  nombre_familiar_dependiente_discapacitado: string | null
  parentesco_familiar_discapacitado: string | null

  constructor() {
    super()
    this.tiene_discapacidad = false
    this.discapacidades = []
    this.discapacidades_familiar_dependiente = []
    this.tiene_enfermedad_cronica = false
    this.enfermedad_cronica = null
    this.alergias = null
    this.lugar_atencion = null
    this.tiene_familiar_dependiente_discapacitado = null
    this.nombre_familiar_dependiente_discapacitado = null
    this.parentesco_familiar_discapacitado = null
  }
}
