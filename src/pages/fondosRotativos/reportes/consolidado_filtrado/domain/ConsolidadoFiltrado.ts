import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class ConsolidadoFiltrado extends EntidadAuditable {
  id_proyecto: number | null
  id_tarea: number | null
  detalle: number | null
  ruc:number|null
  subdetalle: []
  nodos: []
  aut_especial: number | null
  tipo_saldo: string | null
  tipo_filtro: string | null
  fecha_inicio: string | null
  fecha_fin: string| null
  id_lugar:number | null
  empleado: number | null
  grupo: number|null

  constructor() {
    super()
    this.id_proyecto = null
    this.id_tarea = null
    this.detalle = null
    this.ruc=null
    this.subdetalle =[]
    this.nodos =[]
    this.aut_especial = null
    this.tipo_saldo = null
    this.tipo_filtro = null
    this.fecha_inicio = null
    this.fecha_fin = null
    this.id_lugar =null
    this.empleado = null
    this.grupo = null
  }
}
