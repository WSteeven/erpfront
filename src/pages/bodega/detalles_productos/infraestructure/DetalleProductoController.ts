import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { DetalleProducto } from "../domain/DetalleProducto";
import { endpoints } from "config/api";

export class DetalleProductoController extends TransaccionSimpleController<DetalleProducto>{
    constructor(){
        super(endpoints.detalles)
    }
}