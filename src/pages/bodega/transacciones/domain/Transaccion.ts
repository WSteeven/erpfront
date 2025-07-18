import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Transaccion extends EntidadAuditable {
  id: number | null
  autorizacion: number | null
  observacion_aut: string | null
  justificacion: string | null
  num_comprobante: string | null
  proveedor: string | null
  fecha_limite: string | null
  estado: number | null
  observacion_est: string | null
  solicitante: number | null
  devolucion: number | null
  pedido: number | null
  transferencia: number | null
  solicitante_id: number | null
  responsable: number | null
  responsable_id: number | null
  tipo: number | null
  motivo: number | null
  sucursal: number | null
  sucursal_id: number | null
  per_autoriza: number | null
  per_atiende: number | null
  per_retira: number | null
  per_retira_id: number | null
  proyecto: number | null
  etapa: number | null
  tarea: number | null
  cliente: number | null
  cliente_id: number | null
  created_at: string | null

  condicion: number | null

  //variables auxiliares
  tiene_obs_autorizacion: boolean
  tiene_obs_estado: boolean
  retira_tercero: boolean
  ingreso_masivo: boolean
  es_tarea: boolean
  tiene_devolucion: boolean
  tiene_pedido: boolean
  es_transferencia: boolean
  aviso_liquidacion_cliente: boolean

  // producto: string|null
  listadoProductosTransaccion: any[]

  firmada: boolean
  estado_comprobante: string | null

  modificar_recepcion: boolean
  es_para_stock: boolean //true si es para el stock del tecnico

  se_traslada_arma: boolean
  codigo_permiso_traslado: string | null

  modo_seleccion = true
  proveedor_id: number | null = null
  fecha_compra: string | null = null

  nombre_motivo: string | null = null

  constructor() {
    super()
    this.id = null
    this.justificacion = null
    this.num_comprobante = null
    this.proveedor = null
    this.fecha_limite = null
    this.solicitante_id = null
    this.devolucion = null
    this.pedido = null
    this.transferencia = null
    this.solicitante = null
    this.motivo = null
    this.proyecto = null
    this.etapa = null
    this.tarea = null
    this.tipo = null
    this.autorizacion = null
    this.observacion_aut = null
    this.estado = null
    this.observacion_est = null
    this.sucursal = null
    this.sucursal_id = null
    this.responsable = null
    this.responsable_id = null
    this.cliente = null
    this.cliente_id = null
    this.per_autoriza = null
    this.per_atiende = null
    this.per_retira = null
    this.per_retira_id = null
    this.created_at = null

    this.condicion = null
    this.tiene_obs_autorizacion = false
    this.tiene_obs_estado = false
    this.retira_tercero = false
    this.ingreso_masivo = false
    this.es_tarea = false
    this.tiene_devolucion = false
    this.tiene_pedido = false
    this.es_transferencia = false
    this.aviso_liquidacion_cliente = false

    // this.producto=null
    this.listadoProductosTransaccion = []

    this.firmada = false
    this.estado_comprobante = null

    this.es_para_stock = false
    this.es_para_stock = false

    this.modificar_recepcion = false

    this.se_traslada_arma = false
    this.codigo_permiso_traslado = null
  }
}
