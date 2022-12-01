import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { DevolucionModales } from "../domain/DevolucionModales";

export class ComportamientoModalesDevoluciones extends ComportamientoModales<DevolucionModales>{
    constructor(){
        super(new DevolucionModales)
    }
}