import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Ref } from 'vue'
import { Ingreso } from 'trabajoSocial/economia_familiar/domain/Ingreso'


export class EconomiaFamiliar extends EntidadAuditable {
  ingresos: Ref<Ingreso>[]
  // total_ingresos: number | null
  // total_egresos: number | null
  // total: number
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
    const  ingreso = new Ingreso()
    ingreso.id=1
    this.ingresos = [ingreso]
    // this.total_ingresos = null
    // this.total_egresos = null
    this.eg_vivienda = null
    this.eg_servicios_basicos = null
    this.eg_educacion = null
    this.eg_salud = null
    this.eg_vestimenta = null
    this.eg_alimentacion = null
    this.eg_transporte = null
    this.eg_prestamos = 0
    this.eg_otros_gastos = 0
    // this.total = 0
  }
}
