import { ComportamientoModales } from "components/modales/application/ComportamientoModales";
import { DetalleProductoModales } from "../domain/DetalleProductoModales";

export class ComportamientoModalesDetalleProducto extends ComportamientoModales<DetalleProductoModales>{
    constructor() {
        super(new DetalleProductoModales())
    }
}