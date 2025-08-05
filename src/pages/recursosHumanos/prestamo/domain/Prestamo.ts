import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { PlazoPrestamo } from 'recursosHumanos/prestamo/domain/PlazoPrestamo'

export class Prestamo extends EntidadAuditable {
  id: number | null
  solicitante: number | null
  solicitante_info: string | null
  fecha: string | null
  fecha_inicio_cobro: string | null
  motivo: string | null
  estado: string | null
  saldo_pendiente: number | null
  vencimiento: string | null
  periodo: number | null
  valor_utilidad: number | null
  monto: number | null
  plazo: number | null
  id_solicitud_prestamo_empresarial: number | null
  plazos: PlazoPrestamo[] | null

  constructor() {
    super()
    this.id = null
    this.solicitante = null
    this.solicitante_info = null
    this.fecha = null
    this.fecha_inicio_cobro = null
    this.vencimiento = null
    this.periodo = null
    this.motivo = null
    this.saldo_pendiente = 0
    this.estado = null
    this.valor_utilidad = null
    this.monto = null
    this.plazo = null
    this.plazos = null
    this.id_solicitud_prestamo_empresarial = null
  }
}
