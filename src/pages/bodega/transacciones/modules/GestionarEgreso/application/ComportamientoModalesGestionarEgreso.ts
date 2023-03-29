import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { GestionarEgresoModales } from "../domain/GestionarEgresoModales";

export class ComportamientoModalesGestionarEgreso extends ComportamientoModales<GestionarEgresoModales>{
    constructor(){
        super(new GestionarEgresoModales())
    }
}