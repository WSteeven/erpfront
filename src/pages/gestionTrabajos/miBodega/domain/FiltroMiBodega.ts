export class FiltroMiBodega {
  tarea_id: number | null
  // etapa: number | null
  // proyecto: number | null
  tipoStock: number | null
  empleado_id: number | null
  cliente_id: number | null | undefined

  constructor() {
    this.tarea_id = null
    // this.etapa = null
    // this.proyecto = null
    this.tipoStock = null
    this.empleado_id = null
    this.cliente_id = null
  }
}
