import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class ConsolidadoFiltrado extends EntidadAuditable {
  usuario: number | null
  proyecto: number | null
  tarea: number | null
  detalle: number | null
  ruc:number|null
  subdetalle: []
  autorizador: number | null
  tipo_saldo: string | null
  tipo_filtro: string | null
  fecha_inicio: Date | null
  fecha_fin: Date | null
  ciudad:number | null
  empleado: number | null
  constructor() {
    super()
    this.usuario = null
    this.proyecto = null
    this.tarea = null
    this.detalle = null
    this.ruc=null
    this.subdetalle =[]
    this.autorizador = null
    this.tipo_saldo = null
    this.tipo_filtro = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.ciudad =null
    this.empleado = null
  }
}
