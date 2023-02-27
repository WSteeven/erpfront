import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class ControlAsistencia extends EntidadAuditable {
  tarea: string | null
  grupo: string | null
  fecha_hora: string | null
  imagen: string | null | ArrayBuffer

  constructor() {
    super()
    this.tarea = null
    this.grupo = null
    this.fecha_hora = null
    this.imagen = null
  }
}
