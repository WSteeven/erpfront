import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { ReporteVentas } from "../domain/ReporteVentas";
import { endpoints } from "config/api";

export class ReporteVentasController extends TransaccionSimpleController<ReporteVentas>{
  constructor() {
    super(endpoints.reporte_ventas)
  }
}
