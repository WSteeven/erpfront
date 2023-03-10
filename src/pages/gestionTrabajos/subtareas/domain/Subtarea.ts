import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { destinosTareas, modosAsignacionTrabajo } from 'config/tareas.utils'

export class Subtarea extends EntidadAuditable {
  codigo_tarea: string | null
  codigo_subtarea: string | null
  codigo_tarea_cliente: string | null
  titulo: string | null
  descripcion_completa: string | null
  observacion: string | null
  para_cliente_proyecto: string | null
  fecha_solicitud: string | null
  estado: string | null
  modo_asignacion_trabajo: string

  // Tiempos
  fecha_hora_creacion: string | null
  fecha_hora_asignacion: string | null
  fecha_hora_agendado: string | null
  fecha_hora_ejecucion: string | null
  fecha_hora_realizado: string | null
  fecha_hora_finalizacion: string | null
  fecha_hora_pendiente: string | null
  causa_pendiente: string | null
  fecha_hora_suspendido: string | null
  causa_suspencion: string | null
  fecha_hora_cancelacion: string | null
  causa_cancelacion: string | null
  dias_ocupados: number | null

  es_dependiente: boolean
  es_ventana: boolean
  fecha_inicio_trabajo: string | null
  hora_inicio_trabajo: string | null
  hora_fin_trabajo: string | null

  // Foreign keys
  tipo_trabajo: number | null
  trabajo_padre: number | null
  cliente_final: number | null
  coordinador: number | null
  fiscalizador: number | null
  proyecto: number | null
  cliente: number | null
  subtarea_dependiente: string | null
  tarea: number | null

  // archivos: File[]
  subtarea_dependiente_id: number | null

  empleado: number | string | null
  grupo: number | null

  canton: string | null
  cantidad_subtareas: number | null
  mas_empleados: boolean

  constructor() {
    super()

    this.codigo_tarea = null
    this.codigo_subtarea = null
    this.codigo_tarea_cliente = null
    this.titulo = null
    this.descripcion_completa = null
    this.observacion = null
    this.para_cliente_proyecto = destinosTareas.paraProyecto
    this.fecha_solicitud = null
    this.estado = null
    this.modo_asignacion_trabajo = modosAsignacionTrabajo.por_grupo

    // Tiempos
    this.fecha_hora_creacion = null
    this.fecha_hora_asignacion = null
    this.fecha_hora_agendado = null
    this.fecha_hora_ejecucion = null
    this.fecha_hora_finalizacion = null
    this.fecha_hora_realizado = null
    this.fecha_hora_suspendido = null
    this.fecha_hora_pendiente = null
    this.causa_pendiente = null
    this.causa_suspencion = null
    this.fecha_hora_cancelacion = null
    this.causa_cancelacion = null
    this.dias_ocupados = null

    this.es_dependiente = false
    this.es_ventana = false

    this.fecha_inicio_trabajo = null
    this.hora_inicio_trabajo = null
    this.hora_fin_trabajo = null
    this.tarea = null

    // Foreign keys
    this.tipo_trabajo = null
    this.cliente_final = null
    this.coordinador = null
    this.fiscalizador = null
    this.proyecto = null
    this.cliente = null
    this.trabajo_padre = null
    this.subtarea_dependiente = null

    this.subtarea_dependiente_id = null

    // this.archivos = []

    // Listados
    this.empleado = null
    this.grupo = null


    this.canton = null
    this.cantidad_subtareas = null
    this.mas_empleados = false
  }
}
