import { Validador } from "shared/validadores/domain/Validador";
import { Pedido } from "../../domain/Pedido";

export class ValidarListadoProductos implements Validador {
  private pedido: Pedido

  constructor(pedido: Pedido) {
    this.pedido = pedido
  }

  /**
   * Validar que el listado no esté vacío
   */
  async validar(): Promise<boolean> {
    if (this.pedido.listadoProductos.length === 0) {
      throw new Error('Debe agregar al menos un producto al listado')
    }
    if (this.pedido.listadoProductos.includes((v) => v.cantidad == 0 || v.cantidad == null)) throw new Error('Debe ingresar una cantidad')
    return true
  }
}
