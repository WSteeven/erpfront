import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Ref } from 'vue'

export interface Ingreso {
  id: number | null
  nombres_apellidos: string | null
  ocupacion: string | null
  ingreso_mensual: number | null
}

export class EconomiaFamiliar extends EntidadAuditable {
  ingresos: Ref<Ingreso>[]
  total_ingresos: number | null
  total_egresos: number | null
  total: number
  eg_vivienda: number
  eg_servicios_basicos: number
  eg_educacion: number
  eg_salud: number
  eg_vestimenta: number
  eg_alimentacion: number
  eg_transporte: number
  eg_prestamos: number
  eg_otros_gastos: number

  constructor() {
    super()
    this.ingresos = []
    this.total_ingresos = null
    this.total_egresos = null
    this.eg_vivienda = 0
    this.eg_servicios_basicos = 0
    this.eg_educacion = 0
    this.eg_salud = 0
    this.eg_vestimenta = 0
    this.eg_alimentacion = 0
    this.eg_transporte = 0
    this.eg_prestamos = 0
    this.eg_otros_gastos = 0
    this.total = 0
  }
}
