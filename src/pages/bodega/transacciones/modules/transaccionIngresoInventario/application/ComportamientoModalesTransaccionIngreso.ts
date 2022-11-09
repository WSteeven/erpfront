import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import {TransaccionIngresoContentModales} from '../domain/TransaccionIngresoContentModales'

export class ComportamientoModalesTransaccionIngreso extends ComportamientoModales<TransaccionIngresoContentModales>{
    constructor(){
        super(new TransaccionIngresoContentModales)
    }
}
