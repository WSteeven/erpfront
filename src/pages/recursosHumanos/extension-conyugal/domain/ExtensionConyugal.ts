import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class ExtensionConyugal extends EntidadAuditable {
  id: number | null
  empleado: number | null
  empleado_info: string | null
  dependiente: number | null
  dependiente_info: string | null
  mes: string | null
  origen: string | null
  materia_grabada: string | null
  aporte: string | null
  aporte_porcentaje: string | null
  aprobado: boolean | null
  tieneDocumento: boolean | null

  constructor() {
    super()
    this.id = null
    this.empleado = null
    this.empleado_info = null
    this.dependiente = null
    this.dependiente_info = null
    this.mes = null
    this.origen = null
    this.materia_grabada = null
    this.aporte = null
    this.aporte_porcentaje = null
    this.aprobado = false
    this.tieneDocumento = false
  }
}
