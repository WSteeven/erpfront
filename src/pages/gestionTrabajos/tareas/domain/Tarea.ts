import { destinosTareas, ubicacionesTrabajo } from 'config/tareas.utils'
import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'

export class Tarea extends EntidadAuditable {
  codigo_tarea: string | null
  medio_notificacion: string | null
  tiene_subtareas: boolean

  codigo_tarea_cliente: string | null
  titulo: string | null
  descripcion_completa: string | null
  observacion: string | null
  novedad: string | null
  para_cliente_proyecto: string | null
  fecha_solicitud: string | null
  estado: string | null
  etapa: number | null

  // Foreign keys
  tipo_trabajo: number | null
  cliente_final: number | null
  coordinador: number | null
  fiscalizador: number | null
  proyecto: number | null
  proyecto_id: number | null
  cliente: number | null
  cliente_id: number | null
  trabajo_dependiente: string | null
  trabajo_padre: number | null
  centro_costo: number | null

  imagen_informe: string | null

  // Para mostrar en tabla No borrar
  empleados: string | null
  grupos: string | null
  canton: string | null
  cantidad_subtareas: number | null
  finalizado: boolean
  ubicacion_trabajo: string
  ruta_tarea: number | null
  metraje_tendido: number | null
  no_lleva_centro_costo: boolean

  fecha_hora_finalizacion: string | null

  constructor() {
    super()
    this.codigo_tarea = null
    this.codigo_tarea_cliente = null
    this.fecha_solicitud = null
    this.titulo = null
    this.para_cliente_proyecto = destinosTareas.paraProyecto
    this.ubicacion_trabajo = ubicacionesTrabajo.clienteFinal
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
    this.codigo_tarea_cliente = null
    this.titulo = null
    this.descripcion_completa = null
    this.observacion = null
    this.novedad = null
    this.para_cliente_proyecto = destinosTareas.paraProyecto
    this.fecha_solicitud = null
    this.estado = null
    this.etapa = null
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

    this.imagen_informe = null

    this.empleados = null
    this.grupos = null
    this.canton = null
    this.cantidad_subtareas = null
    this.finalizado = false
    this.ruta_tarea = null
    this.no_lleva_centro_costo = false

    this.fecha_hora_finalizacion = null
  }
}
