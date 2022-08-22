export class ControlAsistencia {
  id: number | null
  codigo_tarea_jp: string | null
  codigo_subtarea: string | null
  detalle_tarea: string | null
  detalle_subtarea: string | null
  grupo: string | null
  fecha: string | null
  hora: string | null
  imagen: string | null | ArrayBuffer

  constructor() {
    this.id = null
    this.codigo_tarea_jp = null
    this.codigo_subtarea = null
    this.detalle_tarea = null
    this.detalle_subtarea = null
    this.grupo = null
    this.fecha = null
    this.hora = null
    this.imagen = null
  }
}
