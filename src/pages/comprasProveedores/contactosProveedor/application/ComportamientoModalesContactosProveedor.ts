import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { ContactosProveedorModales } from "../domain/ContactosProveedorModales";


export class ComportamientoModalesContactosProveedor extends ComportamientoModales<ContactosProveedorModales>{
    constructor(){
        super(new ContactosProveedorModales())
    }
}