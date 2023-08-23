import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { ContactoProveedor } from "../domain/ContactoProveedor";
import { endpoints } from "config/api";

export class ContactoProveedorLogController extends TransaccionSimpleController<ContactoProveedor>{
    constructor(){
        super(endpoints.log_contactos_proveedores)
    }
}