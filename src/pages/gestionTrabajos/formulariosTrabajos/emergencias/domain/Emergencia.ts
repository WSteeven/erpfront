import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import TrabajoRealizado from './TrabajoRealizado'
import Observacion from './Observacion'
import { MaterialOcupadoFormulario } from './MaterialOcupadoFormulario'

export class Emergencia extends EntidadAuditable {
  // regional: string | null
  // atencion: string | null
  // tipo_intervencion: string | null
  // causa_intervencion: string | null
  // distancia_afectacion: string | null
  // fecha_reporte_problema: string | null
  // hora_reporte_problema: string | null
  // fecha_arribo: string | null
  // hora_arribo: string | null
  // fecha_fin_reparacion: string | null
  // hora_fin_reparacion: string | null
  // fecha_retiro_personal: string | null
  // hora_retiro_personal: string | null
  // imagen_lectura_antes: string | null
  trabajo_realizado: TrabajoRealizado[] | string
  observaciones: Observacion[] | string
  materiales_ocupados: MaterialOcupadoFormulario[]
  materiales_stock_ocupados: MaterialOcupadoFormulario[]
  materiales_devolucion: []
  subtarea: number | null

  constructor() {
    super()
    // this.regional = null
    // this.atencion = null
    // this.tipo_intervencion = null
    // this.causa_intervencion = null
    // this.distancia_afectacion = null
    // this.fecha_reporte_problema = null
    // this.hora_reporte_problema = null
    // this.fecha_arribo = null
    // this.hora_arribo = null
    // this.fecha_fin_reparacion = null
    // this.hora_fin_reparacion = null
    // this.fecha_retiro_personal = null
    // this.hora_retiro_personal = null
    // this.imagen_lectura_antes = null
    this.trabajo_realizado = []
    this.observaciones = []
    this.materiales_ocupados = []
    this.materiales_stock_ocupados = []
    this.materiales_devolucion = []
    this.subtarea = null
  }
}
