import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Sucursal } from "../domain/Sucursal";
import { endpoints } from "config/api";

export class SucursalController extends TransaccionSimpleController<Sucursal>{
    constructor(){
        super(endpoints.sucursales)
    }
}