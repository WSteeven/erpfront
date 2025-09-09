import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class PlantillaCapacitacion extends EntidadAuditable {
  declare id: number | null   // 👈 Solo declaras tipo, no redefinición
  tema: string | null
  fecha: string | null
  hora_inicio: string | null
  hora_fin: string | null
  capacitador_id: number | null
  modalidad: string | null
  asistentes: number[]

  constructor() {
    super()
    this.id = null            
    this.tema = null
    this.fecha = null
    this.hora_inicio = null
    this.hora_fin = null
    this.capacitador_id = null
    this.modalidad = 'Interno'
    this.asistentes = []
  }
}
