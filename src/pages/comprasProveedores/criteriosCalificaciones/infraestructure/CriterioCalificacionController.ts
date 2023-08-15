import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { CriterioCalificacion } from "../domain/CriterioCalificacion";
import { endpoints } from "config/api";

export class CriterioCalificacionController extends TransaccionSimpleController<CriterioCalificacion>{
    constructor(){
        super(endpoints.criterios_calificaciones)
    }
}