import { EntidadAuditable } from 'shared/entidad/domain/entidadAuditable'
import { Tecnico } from './Tecnico'
import { Ref } from 'vue'

export class Subtarea extends EntidadAuditable {
  codigo_subtarea: string | null
  detalle: string | null
  grupo: string | null
  tecnico_responsable: string | null
  tipo_trabajo: number | null

  // Tiempos
  fecha_hora_creacion: string | null
  fecha_hora_asignacion: string | null
  fecha_hora_inicio: string | null
  fecha_hora_finalizacion: string | null
  cantidad_dias: string | null
  fecha_hora_realizado: string | null
  fecha_hora_suspendido: string | null
  causa_suspencion: string | null
  fecha_hora_cancelacion: string | null
  causa_cancelacion: string | null

  es_dependiente: boolean
  subtarea_dependiente: string | null

  es_ventana: boolean
  hora_inicio_ventana: string | null
  hora_fin_ventana: string | null

  descripcion_completa: string | null

  tecnicos_grupo_principal: Ref<Tecnico> | null
  tecnicos_otros_grupos: Ref<Tecnico> | null

  estado: string | null

  tecnicos_temporales: any[]

  constructor() {
    super()

    this.codigo_subtarea = null
    this.detalle = null
    this.grupo = null
    this.tecnico_responsable = null
    this.tipo_trabajo = null
    this.estado = null

    // Tiempos
    this.fecha_hora_creacion = null
    this.fecha_hora_asignacion = null
    this.fecha_hora_inicio = null
    this.fecha_hora_finalizacion = null
    this.cantidad_dias = null
    this.fecha_hora_realizado = null
    this.fecha_hora_suspendido = null
    this.causa_suspencion = null
    this.fecha_hora_cancelacion = null
    this.causa_cancelacion = null

    this.es_dependiente = false
    this.subtarea_dependiente = null

    this.es_ventana = false
    this.hora_inicio_ventana = null
    this.hora_fin_ventana = null

    this.descripcion_completa = null

    this.tecnicos_grupo_principal = null
    this.tecnicos_otros_grupos = null

    this.tecnicos_temporales = []
  }
}
