import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { Matricula } from "../domain/Matricula";
import { endpoints } from "config/api";

export class MatricularController extends TransaccionSimpleController<Matricula>{
    constructor(){
        super(endpoints.matriculas)
    }
}