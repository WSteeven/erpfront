import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Cliente } from "../domain/Cliente";
import { endpoints } from "config/api";

export class ClienteController extends TransaccionSimpleController<Cliente>{
    constructor(){
        super(endpoints.clientes)
    }
}