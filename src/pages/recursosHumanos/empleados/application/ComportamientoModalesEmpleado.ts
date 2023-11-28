import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { EmpleadoModales } from "../domain/EmpleadoModales";

export class ComportamientoModalesEmpleado extends ComportamientoModales<EmpleadoModales>{
    constructor(){
        super(new EmpleadoModales())
    }
}