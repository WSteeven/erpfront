import { opcionesModoAsignacionTrabajo } from 'config/utils'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { GrupoSeleccionado } from './GrupoSeleccionado'

export class Subtarea extends EntidadAuditable {
  codigo_subtarea: string | null
  detalle: string | null
  /*   grupo: number | null
    empleado: number | null */
  tecnico_responsable: string | null
  tipo_trabajo: number | null

  // Tiempos
  fecha_hora_creacion: string | null
  fecha_hora_asignacion: string | null
  fecha_hora_ejecucion: string | null
  fecha_hora_finalizacion: string | null
  cantidad_dias: string | null
  fecha_hora_realizado: string | null
  fecha_hora_suspendido: string | null
  causa_suspencion: string | null
  fecha_hora_cancelacion: string | null
  causa_cancelacion: string | null

  es_dependiente: boolean
  subtarea_dependiente: string | null
  subtarea_dependiente_id: number | null

  es_ventana: boolean
  hora_inicio_ventana: string | null
  hora_fin_ventana: string | null

  descripcion_completa: string | null

  /* tecnicos_grupo_principal: any[] //Ref<Tecnico[]>
  tecnicos_otros_grupos: any[] */

  estado: string | null

  tarea_id: number | null

  // ubicacion_tarea: UbicacionTarea
  cliente_final: number | null
  fecha_ventana: string | null
  es_primera_asignacion: boolean

  archivos: any

  // Mostrar / ocultar
  modo_asignacion_trabajo: string
  asignar_mas_empleados: boolean

  grupos_seleccionados: GrupoSeleccionado[]
  empleados_seleccionados: Empleado[]

  empleados: string | null
  grupos: string | null

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
    this.hora_inicio_ventana = null
    this.hora_fin_ventana = null

    this.descripcion_completa = null

    /* this.tecnicos_grupo_principal = []
    this.tecnicos_otros_grupos = [] */

    this.tarea_id = null

    // this.ubicacion_tarea = new UbicacionTarea()
    this.cliente_final = null
    this.fecha_ventana = null
    this.es_primera_asignacion = false

    this.archivos = null

    // Mostrar / ocultar
    this.modo_asignacion_trabajo = opcionesModoAsignacionTrabajo.por_grupo

    this.asignar_mas_empleados = false

    this.grupos_seleccionados = []
    this.empleados_seleccionados = []

    this.empleados = null
    this.grupos = null
  }
}
