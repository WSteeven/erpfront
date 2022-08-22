export class MaterialesSolicitados {
  id: number | null
  codigo_producto: string | null
  nombre_producto: string | null
  cantidad_solicitada: number | null
  cantidad_despachada: number | null
  cantidad_usada: number | null

  constructor() {
    this.id = null
    this.codigo_producto = null
    this.nombre_producto = null
    this.cantidad_solicitada = null
    this.cantidad_despachada = null
    this.cantidad_usada = null
  }
}
