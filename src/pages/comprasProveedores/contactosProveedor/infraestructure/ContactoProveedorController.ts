import { TransaccionSimpleController } from 'shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController';
import { ContactoProveedor } from '../domain/ContactoProveedor';
import { endpoints } from 'config/api';

export class ContactoProveedorController extends TransaccionSimpleController<ContactoProveedor> {
    constructor() {
        super(endpoints.contactos_proveedores)
    }
}