import { Validador } from "shared/validadores/domain/Validador";
import { Proveedor } from "sistema/proveedores/domain/Proveedor";

export class
  ValidarPropiedadesProveedor implements Validador {
  private proveedor: Proveedor

  constructor(proveedor: Proveedor) {
    this.proveedor = proveedor
  }

  async validar(): Promise<boolean> {
    if (this.proveedor.departamentos.length > 3) throw new Error('Solo puede guardar máx. 3 departamentos calificadores')
    return true
  }
}
