import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { PlanMantenimientoModales } from "../domain/PlanMantenimientoModales";

export class ComportamientoModalesPlanMantenimiento extends ComportamientoModales<PlanMantenimientoModales>{
    constructor() {
        super(new PlanMantenimientoModales())
    }
}