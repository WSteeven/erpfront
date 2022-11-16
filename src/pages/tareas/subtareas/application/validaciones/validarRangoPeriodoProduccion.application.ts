import {Validador} from "@shared/validadores/domain/validador.domain"
import {PeriodoProduccion} from "@contabilidad/periodoProduccion/domain/periodoProduccion.domain"
import {PeriodoProduccionController} from "../../infraestructure/periodoProduccion.controller"

export class ValidarRangoPeriodoProduccion implements Validador {
  private periodoProduccion: PeriodoProduccion
  private empresaID: number

  constructor(periodoProduccion: PeriodoProduccion, empresaID: number) {
    this.periodoProduccion = periodoProduccion
    this.empresaID = empresaID
  }

  /**
   * valida que no existan periodos repetidos.
   * Validacion considerando empresa, periodo_produccion y centro_produccion
   * @returns
   */
  async validar() {
    // Pendiente de agregar filtros en servidor
    // https://contanexus.com:8000/nexus/periodoproduccion/?empresa=1&centro_costo=2&centro_produccion=7&desde__range=2021-10-01,2021-10-15
    const controller = new PeriodoProduccionController()
    const filtro = {
      empresa: this.empresaID,
      centro_costo: this.periodoProduccion.centro_costo,
      centro_produccion: this.periodoProduccion.centro_produccion,
      desde: '',
      desde__lte: '25/12/2022',
      desde__gt: '14/12/2022',
      desde__range: `${this.periodoProduccion.fecha_inicio},${this.periodoProduccion.fecha_fin}`
    }
    const result = (await controller.listar(filtro)).result

    if (result.length > 0)
      throw new Error("Ya existe un período con ese rango de fechas.")
    return true
  }
}
