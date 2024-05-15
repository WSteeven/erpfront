import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { IntranetModales } from "../domain/IntranetModales";

export class ComportamientoModalesIntranet extends ComportamientoModales<IntranetModales>{
    constructor(){
        super(new IntranetModales())
    }
}