import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class OrdenReparacion extends EntidadAuditable {
  solicitante: string | null
  solicitante_id: number | null
  autorizador: number | null
  vehiculo: string | null
  fecha: string | null
  autorizacion: number | null
  servicios: string | null
  observacion: string | null
  valor_reparacion: string | null
  motivo: string | null
  num_factura: string | null

  constructor() {
    super()
    this.solicitante = null
    this.solicitante_id = null
    this.autorizador = null
    this.vehiculo = null
    this.fecha = null
    this.autorizacion = null
    this.servicios = null
    this.observacion = null
    this.valor_reparacion = null
    this.motivo = null
    this.num_factura = null
  }
}
