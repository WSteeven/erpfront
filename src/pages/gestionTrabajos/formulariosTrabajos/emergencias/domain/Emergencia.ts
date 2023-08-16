import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import TrabajoRealizado from './TrabajoRealizado'
import Observacion from './Observacion'
import { MaterialOcupadoFormulario } from './MaterialOcupadoFormulario'

export class Emergencia extends EntidadAuditable {
  trabajo_realizado: TrabajoRealizado[] | string
  observaciones: Observacion[] | string
  materiales_tarea_ocupados: MaterialOcupadoFormulario[]
  historial_material_tarea_usado: MaterialOcupadoFormulario[]
  materiales_stock_ocupados: MaterialOcupadoFormulario[]
  materiales_devolucion: []
  subtarea: number | null
  fechas_historial_materiales_usados: string[]

  constructor() {
    super()
    this.trabajo_realizado = []
    this.observaciones = []
    this.materiales_tarea_ocupados = []
    this.historial_material_tarea_usado = []
    this.materiales_stock_ocupados = []
    this.materiales_devolucion = []
    this.subtarea = null
    this.fechas_historial_materiales_usados = []
  }
}
