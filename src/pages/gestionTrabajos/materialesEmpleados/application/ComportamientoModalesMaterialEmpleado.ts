import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { MaterialEmpleadoModales } from "../domain/MaterialEmpleadoModales";

export class ComportamientoModalesMaterialEmpleado extends ComportamientoModales<MaterialEmpleadoModales> {
    constructor() {
        super(new MaterialEmpleadoModales())
    }
}