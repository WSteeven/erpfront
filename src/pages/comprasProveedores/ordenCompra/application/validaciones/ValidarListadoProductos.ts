import { Validador } from "shared/validadores/domain/Validador";
import { OrdenCompra } from "../../domain/OrdenCompra";
import { V } from "dist/spa/assets/style.e46fcc8a";
import { ItemOrdenCompra } from "pages/comprasProveedores/itemsOrdenCompra/domain/ItemOrdenCompra";

export class ValidarListadoProductos implements Validador {
    private orden: OrdenCompra

    constructor(orden: OrdenCompra) {
        this.orden = orden;
    }

    /* Validar que el listado no esté vacio */
    async validar(): Promise<boolean> {
        if (this.orden.listadoProductos.length === 0)
            throw new Error("Debe agregar al menos un producto al listado")
        if (this.orden.listadoProductos.some((v: ItemOrdenCompra) => v.cantidad == 0 || v.cantidad == null)) throw new Error("Debe ingresar una cantidad mayor a cero en todos los elementos del listado")
        return true
    }
}