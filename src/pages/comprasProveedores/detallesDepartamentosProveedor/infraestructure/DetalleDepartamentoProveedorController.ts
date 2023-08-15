import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { DetalleDepartamentoProveedor } from "../domain/DetalleDepartamentoProveedor";
import { endpoints } from "config/api";

export class DetalleDepartamentoProveedorController extends TransaccionSimpleController<DetalleDepartamentoProveedor>{
    constructor() {
        super(endpoints.detalles_departamentos_proveedor)
    }
}