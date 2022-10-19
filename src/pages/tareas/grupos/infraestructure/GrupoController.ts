import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController"
import { Grupo } from "../domain/Grupo"
import { endpoints } from "config/api"

export class GrupoController extends TransaccionSimpleController<Grupo> {
    constructor() {
        super(endpoints.grupos)
    }
}