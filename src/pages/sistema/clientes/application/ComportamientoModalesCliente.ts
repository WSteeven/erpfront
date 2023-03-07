import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { ClienteModales } from "../domain/ClienteModales";

export class ComportamientoModalesCliente extends ComportamientoModales<ClienteModales>{
    constructor() {
        super( new ClienteModales());
    }
}
