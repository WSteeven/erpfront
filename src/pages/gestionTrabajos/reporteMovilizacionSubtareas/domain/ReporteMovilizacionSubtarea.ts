export class ReporteMovilizacionSubtarea {
  empleado: number | null
  subtarea: number | null
  fecha_desde: string | null
  fecha_hasta: string | null

  constructor() {
    this.empleado = null
    this.subtarea = null
    this.fecha_desde = null
    this.fecha_hasta = null
  }
}
