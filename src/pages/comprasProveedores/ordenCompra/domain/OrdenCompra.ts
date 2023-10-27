import { EntidadAuditable } from "shared/entidad/domain/entidadAuditable";

export class OrdenCompra extends EntidadAuditable {
  codigo: number | null
  solicitante: number | null
  proveedor: number | null
  autorizador: number | null
  autorizacion: number | null
  descripcion: string | null
  preorden: number | null
  pedido: number | null
  tarea: number | null
  forma: string | null
  tiempo: string | null
  estado: number | null
  causa_anulacion: string | null
  fecha: string | null
  created_at: string | null
  iva: number
  categorias: [] //| null
  listadoProductos: any[]

  //variables auxiliares
  copia_orden: boolean
  tiene_preorden: boolean
  tiene_pedido: boolean
  modificar_iva: boolean
  id_aux: number | null

  constructor() {
    super()
    this.codigo = null
    this.solicitante = null
    this.proveedor = null
    this.autorizador = null
    this.autorizacion = null
    this.copia_orden = false
    this.descripcion = null
    this.preorden = null
    this.pedido = null
    this.tarea = null
    this.forma = null
    this.created_at = null
    this.tiempo = null
    this.estado = null
    this.causa_anulacion = null
    this.fecha = null
    this.id_aux = null
    this.iva = 12
    this.categorias = []
    this.listadoProductos = []
    this.tiene_preorden = false
    this.tiene_pedido = false
    this.modificar_iva = false
  }
}
