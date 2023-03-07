import { destinosTareas, modosAsignacionTrabajo } from 'config/tareas.utils'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Tarea extends EntidadAuditable {
  codigo_tarea: string | null
  cantidad_trabajos: number | null
  medio_notificacion: string | null
  tiene_subtareas: boolean

  // Foreign keys

  // Trabajo ----
  codigo_trabajo: string | null
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
  fecha_hora_ejecucion: string | null
  fecha_hora_realizado: string | null
  fecha_hora_finalizacion: string | null
  fecha_hora_suspendido: string | null
  causa_suspencion: string | null
  fecha_hora_cancelacion: string | null
  causa_cancelacion: string | null
  dias_ocupados: number | null

  es_dependiente: boolean
  es_ventana: boolean
  fecha_agendado: string | null
  hora_inicio_agendado: string | null
  hora_fin_agendado: string | null

  // Foreign keys
  tipo_trabajo: number | null
  trabajo_padre: number | null
  cliente_final: number | null
  coordinador: number | null
  fiscalizador: number | null
  proyecto: number | null
  cliente: number | null
  cliente_id: number | null
  trabajo_dependiente: string | null
  tarea: number | null

  archivos: File[]
  trabajo_dependiente_id: number | null

  grupo: number | null
  empleado: number | null
  subtarea: Subtarea | null

  // para mostrar en tabla
  empleados: string | null
  grupos: string | null
  canton: string | null
  cantidad_subtareas: number | null

  constructor() {
    super()
    this.codigo_tarea = null
    this.codigo_tarea_cliente = null
    this.fecha_solicitud = null
    this.titulo = null
    this.para_cliente_proyecto = destinosTareas.paraProyecto
    this.cantidad_trabajos = null
    this.medio_notificacion = 'CORREO'
    this.tiene_subtareas = true

    // Foreign key
    this.cliente = null
    this.proyecto = null
    this.coordinador = null
    this.fiscalizador = null
    this.cliente_final = null
    this.cliente_id = null

    // Trabajo ----
    this.codigo_trabajo = null
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
    this.fecha_hora_ejecucion = null
    this.fecha_hora_finalizacion = null
    this.fecha_hora_realizado = null
    this.fecha_hora_suspendido = null
    this.causa_suspencion = null
    this.fecha_hora_cancelacion = null
    this.causa_cancelacion = null
    this.dias_ocupados = null

    this.es_dependiente = false
    this.es_ventana = false

    this.fecha_agendado = null
    this.hora_inicio_agendado = null
    this.hora_fin_agendado = null
    this.tarea = null

    // Foreign keys
    this.tipo_trabajo = null
    this.cliente_final = null
    this.coordinador = null
    this.fiscalizador = null
    this.proyecto = null
    this.cliente = null
    this.trabajo_padre = null
    this.trabajo_dependiente = null

    this.trabajo_dependiente_id = null

    this.archivos = []

    this.grupo = null
    this.empleado = null
    this.subtarea = null //new Subtarea()

    this.empleados = null
    this.grupos = null
    this.canton = null
    this.cantidad_subtareas = null
  }
}
