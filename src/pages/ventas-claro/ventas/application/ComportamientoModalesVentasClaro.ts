import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { VentaModales } from "../domain/VentaModales";

export class ComportamientoModalesVentasClaro extends ComportamientoModales<VentaModales>{
    constructor(){
        super(new VentaModales())
    }
}