import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable"

export class ControlProgresiva extends EntidadAuditable {
  codigo_tarea_jp: string | null
  codigo_subtarea_jp: string | null
  nombre_proyecto: string | null
  fecha: string | null
  grupo: string | null
  tecnico_responsable: string | null
  tecnico: string | null
  codigo_bobina: string | null
  marca_inicial: number | null
  marca_final: number | null

  constructor() {
    super()
    this.codigo_tarea_jp = null
    this.codigo_subtarea_jp = null
    this.nombre_proyecto = null
    this.fecha = null
    this.grupo = null
    this.tecnico_responsable = null
    this.tecnico = null
    this.codigo_bobina = null
    this.marca_inicial = null
    this.marca_final = null
  }
}
