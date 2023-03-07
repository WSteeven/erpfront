import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { FondoRotativoContabilidad } from "../domain/FondoRotativoContabilidad";
import { endpoints } from "config/api";

export class FondoRotativoContabilidadController extends TransaccionSimpleController<FondoRotativoContabilidad>{
  constructor() {
    super(endpoints.gastocontabilidad)
  }
}
