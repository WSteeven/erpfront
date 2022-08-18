export class TipoTarea {
  cliente: number | null
  nombre: string | null
  tiene_categoria: boolean
  categoria: string | null

  constructor() {
    this.cliente = null
    this.nombre = null
    this.tiene_categoria = false
    this.categoria = null
  }
}
