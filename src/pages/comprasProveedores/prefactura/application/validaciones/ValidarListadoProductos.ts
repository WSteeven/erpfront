import { Validador } from "shared/validadores/domain/Validador";
import { Prefactura } from "../../domain/Prefactura";

export class ValidarListadoProductos implements Validador {
  private prefactura: Prefactura

  constructor(prefactura: Prefactura) {
    this.prefactura = prefactura;
  }

  /* Validar que el listado no esté vacio */
  async validar(): Promise<boolean> {
    if (this.prefactura.listadoProductos.length == 0) throw new Error('Debe agregar al menos un item al listado');
    return true;
  }

}

