import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { PreordenModales } from "../domain/PreordenModales";

export class ComportamientoModalesPreordenes extends ComportamientoModales<PreordenModales>{
    constructor() {
        super(new PreordenModales())
    }
}