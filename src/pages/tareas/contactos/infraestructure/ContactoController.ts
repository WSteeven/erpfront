import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController"
import { Contacto } from "../domain/ClienteFinal"
import { endpoints } from "config/api"

export class ContactoController extends TransaccionSimpleController<Contacto> {
    constructor() {
        super(endpoints.clientes_finales)
    }
}