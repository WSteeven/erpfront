import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Departamento } from "../domain/Departamento";
import { endpoints } from "config/api";

export class DepartamentoController extends TransaccionSimpleController<Departamento>{
    constructor() {
        super(endpoints.departamentos)
    }
}