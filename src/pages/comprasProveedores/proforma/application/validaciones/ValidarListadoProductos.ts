import { Validador } from "shared/validadores/domain/Validador";
import { Proforma } from "../../domain/Proforma";

export class ValidarListadoProductos implements Validador {
  private proforma: Proforma

  constructor(proforma: Proforma) {
    this.proforma = proforma;
  }

  /* Validar que el listado no esté vacio */
  async validar(): Promise<boolean> {
    if (this.proforma.listadoProductos.length == 0) throw new Error('Debe agregar al menos un item al listado');
    return true;
  }

}

