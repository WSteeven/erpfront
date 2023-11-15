import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { ConductorModales } from "../domain/ConductorModales";

export class ComportamientoModalesConductores extends ComportamientoModales<ConductorModales>{
    constructor() {
        super(new ConductorModales())
    }
}