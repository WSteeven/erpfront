import { DashboardTareaController } from '../infraestructure/DashboardTareaController'
import { FiltroDashboardTicket } from '../domain/FiltroReporteMaterial'
import { UnwrapRef, ref } from 'vue'
import { estadosTrabajos } from 'config/utils'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'


export function graficarPorGrupoUseCase(dashboardTareaController: DashboardTareaController, filtro: UnwrapRef<FiltroDashboardTicket>) {
  const graficos = ref()
  const listados = ref()
  const listadoFiltrado = ref()

  async function execute() {
    const campos = 'id,codigo_tarea,tarea_id,codigo_subtarea,titulo,estado,grupo,empleado_responsable,empleado_responsable_id,coordinador,tipo_trabajo,cantidad_adjuntos,fecha_solicitud,es_ventana,fecha_hora_creacion,fecha_inicio_trabajo,hora_inicio_trabajo,hora_fin_trabajo,fecha_hora_asignacion,fecha_hora_agendado,fecha_hora_ejecucion,fecha_hora_realizado,fecha_hora_finalizacion,dias_ocupados,fecha_hora_suspendido,motivo_suspendido,fecha_hora_cancelado,motivo_cancelado,subtarea_dependiente,canton,cliente,proyecto'
    const { result } = await dashboardTareaController.listar({ fecha_inicio: filtro.fecha_inicio, fecha_fin: filtro.fecha_fin, grupo_id: filtro.grupo, campos })
    graficos.value = [result.graficoEstadosGrupo]
    listados.value = result.subtareas
  }

  function resetearDatos() {
    graficos.value = null
    listadoFiltrado.value = null
    listados.value = null
  }

  function seleccionarEstado(estado: keyof typeof estadosTrabajos) {
    listadoFiltrado.value = listados.value.filter((subtarea: Subtarea) => subtarea.estado === estado)
  }

  return {
    graficos,
    listadoFiltrado,
    execute,
    seleccionarEstado,
    resetearDatos,
  }
}
