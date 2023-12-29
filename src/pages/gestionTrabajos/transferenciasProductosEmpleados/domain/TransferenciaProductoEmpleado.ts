import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { useAuthenticationStore } from 'stores/authentication'


export class TransferenciaProductoEmpleado extends EntidadAuditable {
  justificacion: string | null
  solicitante: number | null
  solicitante_id: number | null
  tarea_id: number | null
  canton: number | null
  estado: string | null
  estado_bodega: string | null
  created_at: string | null
  es_para_stock: boolean
  observacion_aut: string | null
  autorizacion: number | null
  autorizador: number | null
  autorizador_id: number | null
  sucursal: number | null
  sucursal_id: number | null
  cliente: number | null
  cliente_id: number | null
  pedido_automatico: boolean
  empleado_origen: number | null
  empleado_destino: number | null
  tarea_origen: number | null
  tarea_destino: number | null
  etapa_origen: number | null
  etapa_destino: number | null
  proyecto_origen: number | null
  proyecto_destino: number | null

  listado_productos: any[]

  //variables auxiliares
  es_tarea: boolean | null
  tiene_observacion_aut: boolean | null

  constructor() {
    super()
    this.justificacion = null
    this.solicitante = useAuthenticationStore().user.id
    this.solicitante_id = null
    this.observacion_aut = null
    this.autorizacion = null
    this.autorizador = null
    this.autorizador_id = null
    this.tarea_id = null
    this.canton = null
    this.estado = null
    this.estado_bodega = null
    this.created_at = null
    this.es_para_stock = false
    this.listado_productos = []
    this.sucursal = null
    this.sucursal_id = null
    this.cliente = null
    this.cliente_id = null
    this.pedido_automatico = false
    this.empleado_origen = null //useAuthenticationStore().user.id
    this.empleado_destino = null
    this.tarea_origen = null
    this.tarea_destino = null
    this.etapa_origen = null
    this.etapa_destino = null
    this.proyecto_origen = null
    this.proyecto_destino = null

    // variables auxiliares
    this.es_tarea = false
    this.tiene_observacion_aut = false
  }
}
