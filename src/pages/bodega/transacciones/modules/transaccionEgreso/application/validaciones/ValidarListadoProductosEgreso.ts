import { Validador } from "shared/validadores/domain/Validador";
import { Transaccion } from "pages/bodega/transacciones/domain/Transaccion";

export class ValidarListadoProductosEgreso implements Validador {
  private transaccion: Transaccion

  constructor(transaccion: Transaccion) {
    this.transaccion = transaccion
  }

  /**
   * Validar que el listado no esté vacío
   */
  async validar(): Promise<boolean> {
    if (this.transaccion.listadoProductosTransaccion.length === 0) {
      throw new Error('Debe agregar al menos un producto al listado')
    }
    return true
  }
}
