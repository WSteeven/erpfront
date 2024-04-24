import { endpoints } from "config/api";
import { Sucursal } from "pages/administracion/sucursales/domain/Sucursal";
import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";

export class SucursalesDetalleController extends TransaccionSimpleController<Sucursal>{
    constructor(){
        super(endpoints.sucursales_detalle)
    }
}