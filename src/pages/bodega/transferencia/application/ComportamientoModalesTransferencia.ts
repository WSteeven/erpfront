import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { TransferenciaModales } from "../domain/TransferenciaModales";

export class ComportamientoModalesTransferencia extends ComportamientoModales<TransferenciaModales>{
    constructor(){
        super(new TransferenciaModales)
    }
}