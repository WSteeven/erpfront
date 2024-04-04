import { TransaccionSimpleController } from "shared/contenedor/modules/simple/infraestructure/TransacccionSimpleController";
import { endpoints } from "config/api";
import { ReporteSaldoActual } from "../domain/ReporteSaldoActual";

export class ReporteSaldoActualController extends TransaccionSimpleController<ReporteSaldoActual>{
  constructor() {
    super(endpoints.reporte_saldo_actual_pdf)
  }
}
