import { endpoints } from "config/api";
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado";
import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Proveedor } from "sistema/proveedores/domain/Proveedor";

export class ProveedoresOrdenesController extends TransaccionSimpleController<Proveedor>{
    constructor(){
        super(endpoints.proveedores_ordenes)
    }
}