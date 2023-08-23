import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { OfertaProveedor } from "../domain/OfertaProveedor";
import { endpoints } from "config/api";

export class OfertaProveedorController extends TransaccionSimpleController<OfertaProveedor>{
    constructor(){
        super(endpoints.ofertas_proveedores)
    }
}