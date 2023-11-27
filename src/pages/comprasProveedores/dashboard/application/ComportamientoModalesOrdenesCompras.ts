import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { OrdenesComprasModales } from "../domain/OrdenesComprasModales";

export class ComportamientoModalesOrdenesCompras extends ComportamientoModales<OrdenesComprasModales>{
  constructor() {
    super(new OrdenesComprasModales())
  }
}
