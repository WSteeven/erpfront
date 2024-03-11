import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { ProductoVentas } from "../domain/ProductoVentas";
import { endpoints } from "config/api";

export class ProductoVentasController extends TransaccionSimpleController<ProductoVentas>{
  constructor() {
    super(endpoints.productos_ventas)
  }
}
