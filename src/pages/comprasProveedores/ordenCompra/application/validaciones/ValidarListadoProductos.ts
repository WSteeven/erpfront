import { Validador } from "shared/validadores/domain/Validador";
import { OrdenCompra } from "../../domain/OrdenCompra";
import { ItemOrdenCompra } from "pages/comprasProveedores/itemsOrdenCompra/domain/ItemOrdenCompra";
import { useAuthenticationStore } from "stores/authentication";

export class ValidarListadoProductos implements Validador {
  private orden: OrdenCompra
  private store = useAuthenticationStore()

  constructor(orden: OrdenCompra) {
    this.orden = orden;
  }


  /* Validar que el listado no esté vacio */
  async validar(): Promise<boolean> {
    if (this.orden.listadoProductos.length === 0)
      throw new Error("Debe agregar al menos un producto al listado")
    if (this.orden.listadoProductos.some((v: ItemOrdenCompra) => v.cantidad == 0 || v.cantidad == null)) throw new Error("Debe ingresar una cantidad mayor a cero en todos los elementos del listado")
    if ((this.store.esCompras && this.orden.autorizador == this.store.user.id && this.orden.completada) || (this.store.esCompras && this.orden.autorizacion == 2 && this.orden.completada)) {
      if (this.orden.listadoProductos.some((v: ItemOrdenCompra) => v.precio_unitario == 0 || v.precio_unitario == 0)) throw new Error("Debes poner precio a todos los elementos del listado")
    }
    if(!this.orden.listadoProductos.every((v)=>v.hasOwnProperty("descripcion"))) throw new Error("El campo descripción es requerido en todos los elementos del listado")
    return true
  }
}
