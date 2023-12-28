import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
export class EsquemaComision extends EntidadAuditable {
  mes_liquidacion: string | null
  esquema_comision: string | null
  tarifa_basica: number | null
  constructor() {
    super()
    this.mes_liquidacion = null
    this.esquema_comision = null
    this.tarifa_basica = null
  }
}
