import { Validador } from "shared/validadores/domain/Validador";
import { Devolucion } from "../domain/Devolucion";

export class ValidarListadoProductos implements Validador {
    private devolucion: Devolucion

    constructor(devolucion: Devolucion) {
        this.devolucion = devolucion
    }
    async validar(): Promise<boolean> {
        if (this.devolucion.listadoProductos.length === 0) { throw new Error('Debe agregar al menos un producto al listado zzz') }
        if (this.devolucion.listadoProductos.some((v) => v.cantidad <= 0 || v.cantidad == null || v.cantidad == '')) { throw new Error('Todos los elementos del listado deben tener una cantidad mayor a cero') }
        return true
    }
}