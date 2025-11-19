import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable';

export class PermisoEmpleado extends EntidadAuditable {
  empleado: number | null
  empleado_info: string | null
  tipo_permiso: string | null
  tipo_permiso_info: string | null
  estado: string | null
  estado_permiso_info: string | null
  fecha_hora_inicio: string | null
  fecha_hora_fin: string | null
  fecha_recuperacion: string | null
  hora_recuperacion: string | null
  dias_permiso: number | null
  justificacion: string | null
  documento: string | null
  observacion: string | null
  departamento: string | null
  fecha_hora_solicitud: string | null
  fecha_hora_reagendamiento: string | null
  id_jefe_inmediato: number | null
  jefe_inmediato: string | null
  suguiere_fecha: boolean | null
  recupero: boolean | null
  tieneDocumento: boolean | null
  cargo_vacaciones: boolean
  cargo_descuento: boolean
  descontado: boolean
  aceptar_sugerencia: boolean | null
  constructor() {
    super()
    this.empleado = null
    this.empleado_info = null
    this.tipo_permiso = null
    this.tipo_permiso_info = null
    this.estado = null
    this.estado_permiso_info = null
    this.fecha_hora_inicio = null
    this.fecha_hora_fin = null
    this.fecha_recuperacion = null
    this.hora_recuperacion = null
    this.dias_permiso = null
    this.justificacion = null
    this.documento = null
    this.observacion = null
    this.departamento = null
    this.fecha_hora_solicitud = null
    this.fecha_hora_reagendamiento = null
    this.id_jefe_inmediato = null
    this.jefe_inmediato = null
    this.recupero = false
    this.suguiere_fecha = false
    this.tieneDocumento = null
    this.cargo_vacaciones = false
    this.cargo_descuento = false
    this.descontado = false
    this.aceptar_sugerencia = false
  }
}
