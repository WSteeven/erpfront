export class ControlDiarioMaterial {
  id: number | null
  codigo_tarea_jp: string | null
  codigo_subtarea_jp: string | null
  fecha: string | null
  grupo: string | null
  tecnico_responsable: string | null

  constructor() {
    this.id = null
    this.codigo_tarea_jp = null
    this.codigo_subtarea_jp = null
    this.fecha = null
    this.grupo = null
    this.tecnico_responsable = null
  }
}
