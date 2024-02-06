import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class PagoComision extends EntidadAuditable {
  id: number | null
  nombre: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  estado: null
  causa_anulacion: string | null
  listadoEmpleados: any

  constructor() {
    super()
    this.id = null
    this.nombre = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.estado = null
    this.causa_anulacion = null
    this.listadoEmpleados = []
  }
}
