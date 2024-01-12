import { destinosTareas, modosAsignacionTrabajo, ubicacionesTrabajo } from 'config/tareas.utils'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Tarea extends EntidadAuditable {
  codigo_tarea: string | null
  cantidad_trabajos: number | null
  medio_notificacion: string | null
  tiene_subtareas: boolean

  // Trabajo ----
  codigo_trabajo: string | null
  codigo_tarea_cliente: string | null
  titulo: string | null
  descripcion_completa: string | null
  observacion: string | null
  novedad: string | null
  para_cliente_proyecto: string | null
  fecha_solicitud: string | null
  estado: string | null
  modo_asignacion_trabajo: string

  // Tiempos
  created_at: string | null
  // fecha_hora_creacion: string | null
  fecha_hora_asignacion: string | null
  fecha_hora_agendado: string | null
  fecha_hora_ejecucion: string | null
  fecha_hora_realizado: string | null
  fecha_hora_finalizacion: string | null
  fecha_hora_pendiente: string | null
  motivo_pendiente: string | null
  fecha_hora_suspendido: string | null
  motivo_suspendido: string | null
  fecha_hora_cancelado: string | null
  motivo_cancelado: string | null
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
  proyecto_id: number | null
  cliente: number | null
  cliente_id: number | null
  trabajo_dependiente: string | null
  tarea: number | null
  centro_costo: number | null

  archivos: File[]
  imagen_informe: string | null
  trabajo_dependiente_id: number | null

  grupo: number | null
  empleado: number | null
  subtarea: Subtarea

  // para mostrar en tabla
  empleados: string | null
  grupos: string | null
  canton: string | null
  cantidad_subtareas: number | null
  finalizado: boolean
  ubicacion_trabajo: string
  ruta_tarea: number | null
  metraje_tendido: number | null
  no_lleva_centro_costo:boolean

  constructor() {
    super()
    this.codigo_tarea = null
    this.codigo_tarea_cliente = null
    this.fecha_solicitud = null
    this.titulo = null
    this.para_cliente_proyecto = destinosTareas.paraProyecto
    this.ubicacion_trabajo = ubicacionesTrabajo.clienteFinal
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
    this.novedad = null
    this.para_cliente_proyecto = destinosTareas.paraProyecto
    this.fecha_solicitud = null
    this.estado = null
    this.modo_asignacion_trabajo = modosAsignacionTrabajo.por_grupo

    // Tiempos
    this.created_at = null
    this.fecha_hora_asignacion = null
    this.fecha_hora_agendado = null
    this.fecha_hora_ejecucion = null
    this.fecha_hora_finalizacion = null
    this.fecha_hora_realizado = null
    this.fecha_hora_suspendido = null
    this.fecha_hora_pendiente = null
    this.motivo_pendiente = null
    this.motivo_suspendido = null
    this.fecha_hora_cancelado = null
    this.motivo_cancelado = null
    this.dias_ocupados = null

    this.es_dependiente = false
    this.es_ventana = false

    this.fecha_inicio_trabajo = null
    this.hora_inicio_trabajo = null
    this.hora_fin_trabajo = null
    this.tarea = null
    this.metraje_tendido = null

    // Foreign keys
    this.tipo_trabajo = null
    this.cliente_final = null
    this.coordinador = null
    this.fiscalizador = null
    this.proyecto = null
    this.proyecto_id = null
    this.cliente = null
    this.trabajo_padre = null
    this.trabajo_dependiente = null
    this.centro_costo = null

    this.trabajo_dependiente_id = null

    this.archivos = []
    this.imagen_informe = null

    this.grupo = null
    this.empleado = null
    this.subtarea = new Subtarea()

    this.empleados = null
    this.grupos = null
    this.canton = null
    this.cantidad_subtareas = null
    this.finalizado = false
    this.ruta_tarea = null
    this.no_lleva_centro_costo = false
  }
}
