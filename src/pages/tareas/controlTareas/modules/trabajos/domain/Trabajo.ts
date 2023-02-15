import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { EmpleadoSeleccionado } from './EmpleadoSeleccionado'
import { opcionesModoAsignacionTrabajo } from 'config/utils'
import { GrupoSeleccionado } from './GrupoSeleccionado'
import { Archivo } from '../../subtareasListadoContent/modules/gestorArchivosSubtareas/domain/Archivo'

export class Trabajo extends EntidadAuditable {
  codigo_trabajo: string | null
  codigo_trabajo_cliente: string | null
  titulo: string | null
  descripcion_completa: string | null
  observacion: string | null
  para_cliente_proyecto: string | null
  fecha_solicitud: string | null

  // Tiempos
  fecha_hora_creacion: string | null
  fecha_hora_asignacion: string | null
  fecha_hora_ejecucion: string | null
  fecha_hora_realizado: string | null
  fecha_hora_finalizacion: string | null
  fecha_hora_suspendido: string | null
  causa_suspencion: string | null
  cantidad_dias: string | null
  fecha_hora_cancelacion: string | null
  causa_cancelacion: string | null

  es_dependiente: boolean

  es_ventana: boolean
  fecha_agendado: string | null
  hora_inicio_agendado: string | null
  hora_fin_agendado: string | null

  estado: string | null
  modo_asignacion_trabajo: string

  // ubicacion_tarea: UbicacionTarea
  tarea_id: number | null
  cliente_final: number | null
  es_primera_asignacion: boolean

  archivos: File[]
  tipo_trabajo: number | null
  subtarea_dependiente: string | null
  subtarea_dependiente_id: number | null

  // Mostrar / ocultar
  asignar_mas_empleados: boolean

  grupos_seleccionados: GrupoSeleccionado[]
  empleados_seleccionados: EmpleadoSeleccionado[]

  empleados: string | null
  grupos: string | null
  dias_ocupados: number | null

  constructor() {
    super()

    this.codigo_subtarea = null
    this.detalle = null
    /* this.grupo = null
    this.empleado = null */
    this.tecnico_responsable = null
    this.tipo_trabajo = null
    this.estado = null

    // Tiempos
    this.fecha_hora_creacion = null
    this.fecha_hora_asignacion = null
    this.fecha_hora_ejecucion = null
    this.fecha_hora_finalizacion = null
    this.cantidad_dias = null
    this.fecha_hora_realizado = null
    this.fecha_hora_suspendido = null
    this.causa_suspencion = null
    this.fecha_hora_cancelacion = null
    this.causa_cancelacion = null

    this.es_dependiente = false
    this.subtarea_dependiente = null
    this.subtarea_dependiente_id = null

    this.es_ventana = false
    this.hora_inicio_agendado = null
    this.hora_fin_agendado = null

    this.descripcion_completa = null

    /* this.tecnicos_grupo_principal = []
    this.tecnicos_otros_grupos = [] */

    this.tarea_id = null

    // this.ubicacion_tarea = new UbicacionTarea()
    this.cliente_final = null
    this.fecha_agendado = null
    this.es_primera_asignacion = false

    this.archivos = []

    // Mostrar / ocultar
    this.modo_asignacion_trabajo = opcionesModoAsignacionTrabajo.por_grupo

    this.asignar_mas_empleados = false

    this.grupos_seleccionados = []
    this.empleados_seleccionados = []

    this.empleados = null
    this.grupos = null

    this.dias_ocupados = null
  }
}
