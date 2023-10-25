// Dependencias
import { generarColorAzulPastelClaro, obtenerFechaActual, ordernarListaString } from 'shared/utils'
import { acciones, accionesTabla, estadosTrabajos, rolesSistema } from 'config/utils'
import { Ref, computed, defineComponent, reactive, ref } from 'vue'
import { modosAsignacionTrabajo } from 'config/tareas.utils'
import { required } from 'shared/i18n-validators'
import { useVuelidate } from '@vuelidate/core'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import GraficoGenerico from 'components/chartJS/GraficoGenerico.vue'
import TableView from 'components/tables/view/TableView.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ReporteSubtareasRealizadas } from '../domain/ReporteSubtareasRealizadas'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ComportamientoModalesSubtarea } from 'pages/gestionTrabajos/subtareas/application/ComportamientoModalesSubtarea'
import { configuracionColumnasSubtarea } from 'pages/gestionTrabajos/subtareas/domain/configuracionColumnasSubtarea'
import { useBotonesTablaSubtarea } from 'pages/gestionTrabajos/subtareas/application/BotonesTablaSubtarea'
import { SubtareaController } from 'pages/gestionTrabajos/subtareas/infraestructure/SubtareaController'
import { DashboardTareaController } from '../infraestructure/DashboardTareaController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { Subtarea } from 'pages/gestionTrabajos/subtareas/domain/Subtarea'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { FiltroDashboardTicket } from '../domain/FiltroReporteMaterial'
import { estadosTickets } from 'config/tickets.utils'
import { useSubtareaStore } from 'stores/subtarea'

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen, TableView, ModalesEntidad, GraficoGenerico },
  setup() {
    /*********
     * Stores
     *********/
    const subtareaStore = useSubtareaStore()

    /********
     * Mixin
     ********/
    // mixin reporte subtareas realizadas
    const mixin = new ContenedorSimpleMixin(
      ReporteSubtareasRealizadas,
      new DashboardTareaController()
    )

    const { listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados } = mixin.useComportamiento()

    // mixin subtarea
    const mixinSubtarea = new ContenedorSimpleMixin(Subtarea, new SubtareaController())

    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: {
            campos: 'id,nombres,apellidos',
            estado: 1,
            rol: [rolesSistema.coordinador, rolesSistema.coordinadorBackup, rolesSistema.jefe_tecnico],
          }
        },
      })
    })

    const filtro = reactive(new FiltroDashboardTicket())
    const dashboardTareaController = new DashboardTareaController()
    const cargando = new StatusEssentialLoading()
    const mostrarTitulosSeccion = computed(() => filtro.fecha_inicio && filtro.fecha_fin && filtro.empleado)
    const tipoFiltroSubordinados = ref(modosAsignacionTrabajo.por_grupo)

    // Cantidades
    const subtareas: Ref<Subtarea[]> = ref([])
    const subtareasGrupo: Ref<Subtarea[]> = ref([])
    const subtareasEmpleado: Ref<Subtarea[]> = ref([])
    const subtareasSubordinados: Ref<Subtarea[]> = ref([])
    const subtareasEmpleadoSubordinado: Ref<Subtarea[]> = ref([])

    const cantidadTareasActivas = ref()
    const cantidadTareasFinalizadas = ref()
    const cantidadSubtareasAgendadas = ref()
    const cantidadSubtareasEjecutadas = ref()
    const cantidadSubtareasPausadas = ref()
    const cantidadSubtareasSuspendidas = ref()
    const cantidadSubtareasCanceladas = ref()
    const cantidadSubtareasRealizadas = ref()
    const cantidadSubtareasFinalizadas = ref()
    const totalSubtareas = computed(() => {
      return cantidadSubtareasAgendadas.value
        + cantidadSubtareasEjecutadas.value
        + cantidadSubtareasPausadas.value
        + cantidadSubtareasSuspendidas.value
        + cantidadSubtareasCanceladas.value
        + cantidadSubtareasRealizadas.value
        + cantidadSubtareasFinalizadas.value
    })

    const cantidadesPorEstadosSubtareas = ref([])
    const cantidadesPorEstadosSubtareasBar = ref()

    // Por grupo
    const agendados: Ref<any> = ref([])
    const ejecutados: Ref<any> = ref([])
    const pausados: Ref<any> = ref([])
    const suspendidos: Ref<any> = ref([])
    const cancelados: Ref<any> = ref([])
    const realizados: Ref<any> = ref([])
    const finalizados: Ref<any> = ref([])

    const agendadosBar = ref()
    const ejecutadosBar = ref()
    const pausadosBar = ref()
    const suspendidosBar = ref()
    const canceladosBar = ref()
    const realizadosBar = ref()
    const finalizadosBar = ref()

    // Por empleado
    const agendadosEmpleado: Ref<any> = ref([])
    const ejecutadosEmpleado: Ref<any> = ref([])
    const pausadosEmpleado: Ref<any> = ref([])
    const suspendidosEmpleado: Ref<any> = ref([])
    const canceladosEmpleado: Ref<any> = ref([])
    const realizadosEmpleado: Ref<any> = ref([])
    const finalizadosEmpleado: Ref<any> = ref([])

    const agendadosEmpleadoBar = ref()
    const ejecutadosEmpleadoBar = ref()
    const pausadosEmpleadoBar = ref()
    const suspendidosEmpleadoBar = ref()
    const canceladosEmpleadoBar = ref()
    const realizadosEmpleadoBar = ref()
    const finalizadosEmpleadoBar = ref()

    // Tabs
    const opcionesSubordinado = {
      subordinadosGrafico: 'subordinadosGrafico',
      subordinadosListado: 'subordinadosListado',
      subordinadosEmpleadoListado: 'subordinadosEmpleadoListado',
    }

    const opcionesCoordinadorConsultado = {
      coordinadorConsultadoGrafico: 'coordinadorConsultadoGrafico',
      coordinadorConsultadoListado: 'coordinadorConsultadoListado',
    }

    const tabsCoordinadorConsultado = ref(opcionesCoordinadorConsultado.coordinadorConsultadoGrafico)
    const tabsSubordinados = ref(opcionesSubordinado.subordinadosGrafico)

    filtro.fecha_fin = obtenerFechaActual()

    const optionsPie = {
      responsive: true,
      maintainAspectRatio: false,
      layout: {
        padding: 32,
      },
      elements: {
        arc: {
          borderWidth: 0,
        }
      },
      plugins: {
        legend: {
          position: 'right',
        },
        datalabels: {
          align: 'end',
          anchor: 'end',
          color: '#fff',
          backgroundColor: function (context) {
            return context.dataset.backgroundColor
          },
          font: function (context) {
            var w = context.chart.width
            return {
              size: w < 512 ? 10 : 12,
            }
          },
          formatter: function (value, context) {
            return value ? context.chart.data.labels[context.dataIndex] + ': (' + value + ')' : null
          }
        }
      },
    }

    // Reglas de validacion
    const reglas = {
      fecha_inicio: { required },
      fecha_fin: { required },
      empleado: { required },
    }

    const v$ = useVuelidate(reglas, filtro)

    /**********
    * Modales
    **********/
    const modalesSubtarea = new ComportamientoModalesSubtarea()
    const { btnSeguimiento } = useBotonesTablaSubtarea(subtareas, modalesSubtarea)

    const botonVer: CustomActionTable = {
      titulo: 'Más detalles',
      icono: 'bi-eye',
      accion: async ({ entidad }) => {
        subtareaStore.idSubtareaSeleccionada = entidad.id
        subtareaStore.accion = acciones.consultar
        modalesSubtarea.abrirModalEntidad('SubtareaPage')
      },
    }

    /*********
   * Filtros
   **********/
    const empleados = ref([])
    function filtrarEmpleados(val, update) {
      if (val === '') update(() => empleados.value = listadosAuxiliares.empleados.sort((a, b) => ordernarListaString(a.nombres, b.nombres)))

      update(() => {
        const needle = val.toLowerCase()
        empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
      })
    }

    async function consultar() {
      const campos = 'id,codigo_tarea,codigo_subtarea,titulo,estado,grupo,empleado_responsable,coordinador,tipo_trabajo,cantidad_adjuntos,fecha_solicitud,es_ventana,fecha_hora_creacion,fecha_inicio_trabajo,hora_inicio_trabajo,hora_fin_trabajo,fecha_hora_asignacion,fecha_hora_agendado,fecha_hora_ejecucion,fecha_hora_realizado,fecha_hora_finalizacion,dias_ocupados,fecha_hora_suspendido,motivo_suspendido,fecha_hora_cancelado,motivo_cancelado,subtarea_dependiente,canton,cliente,proyecto'

      if (await v$.value.$validate()) {
        try {

          cargando.activar()

          const { result } = await dashboardTareaController.listar({ fecha_inicio: filtro.fecha_inicio, fecha_fin: filtro.fecha_fin, empleado_id: filtro.empleado, campos })

          // Listados
          subtareas.value = result.subtareasCoordinador
          subtareasGrupo.value = result.subtareasGrupo
          subtareasEmpleado.value = result.subtareasEmpleado

          // Cantidades
          cantidadTareasActivas.value = result.cantidadTareasActivas
          cantidadTareasFinalizadas.value = result.cantidadTareasFinalizadas
          cantidadSubtareasAgendadas.value = result.cantidadSubtareasAgendadas
          cantidadSubtareasEjecutadas.value = result.cantidadSubtareasEjecutadas
          cantidadSubtareasPausadas.value = result.cantidadSubtareasPausadas
          cantidadSubtareasSuspendidas.value = result.cantidadSubtareasSuspendidas
          cantidadSubtareasCanceladas.value = result.cantidadSubtareasCanceladas
          cantidadSubtareasRealizadas.value = result.cantidadSubtareasRealizadas
          cantidadSubtareasFinalizadas.value = result.cantidadSubtareasFinalizadas

          // Graficos del coordinador consultado
          cantidadesPorEstadosSubtareas.value = result.cantidadesPorEstadosSubtareas
          const labels3 = result.cantidadesPorEstadosSubtareas.map((item) => item.estado)
          const valores3 = result.cantidadesPorEstadosSubtareas.map((item) => item.total_subtareas)
          const colores3 = result.cantidadesPorEstadosSubtareas.map((item) => mapearColor(item.estado))
          cantidadesPorEstadosSubtareasBar.value = mapearDatos(labels3, valores3, 'Cantidad de subtareas', colores3)

          // Graficos por grupo
          // const subtareasPorGrupo = result.cantidadesSubtareasPorGrupo
          const subtareasPorGrupo = contarSubtareasGrupo(result.subtareasGrupo)
          const subtareasPorEmpleado = contarSubtareasEmpleado(result.subtareasEmpleado)
          // console.log(subtareasPorGrupo)
          agendados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.AGENDADO)
          const labelsAgendado = agendados.value.map((item) => item.grupo)
          const valoresAgendado = agendados.value.map((item) => item.total_subtareas)
          const coloresAgendado = agendados.value.map(() => generarColorAzulPastelClaro())
          agendadosBar.value = mapearDatos(labelsAgendado, valoresAgendado, 'Cantidad de subtareas', coloresAgendado)

          ejecutados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.EJECUTANDO)
          const labelsEjecutando = ejecutados.value.map((item) => item.grupo)
          const valoresEjecutando = ejecutados.value.map((item) => item.total_subtareas)
          const coloresEjecutando = ejecutados.value.map(() => generarColorAzulPastelClaro())
          ejecutadosBar.value = mapearDatos(labelsEjecutando, valoresEjecutando, 'Cantidad de subtareas', coloresEjecutando)

          pausados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.PAUSADO)
          const labelsPausado = pausados.value.map((item) => item.grupo)
          const valoresPausado = pausados.value.map((item) => item.total_subtareas)
          const coloresPausado = pausados.value.map(() => generarColorAzulPastelClaro())
          pausadosBar.value = mapearDatos(labelsPausado, valoresPausado, 'Cantidad de subtareas', coloresPausado)

          suspendidos.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.SUSPENDIDO)
          const labelsSuspendido = suspendidos.value.map((item) => item.grupo)
          const valoresSuspendido = suspendidos.value.map((item) => item.total_subtareas)
          const coloresSuspendido = suspendidos.value.map(() => generarColorAzulPastelClaro())
          suspendidosBar.value = mapearDatos(labelsSuspendido, valoresSuspendido, 'Cantidad de subtareas', coloresSuspendido)

          cancelados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.CANCELADO)
          const labelsCancelado = cancelados.value.map((item) => item.grupo)
          const valoresCancelado = cancelados.value.map((item) => item.total_subtareas)
          const coloresCancelado = cancelados.value.map(() => generarColorAzulPastelClaro())
          canceladosBar.value = mapearDatos(labelsCancelado, valoresCancelado, 'Cantidad de subtareas', coloresCancelado)

          realizados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.REALIZADO)
          const labelsRealizado = realizados.value.map((item) => item.grupo)
          const valoresRealizado = realizados.value.map((item) => item.total_subtareas)
          const coloresRealizado = realizados.value.map(() => generarColorAzulPastelClaro())
          realizadosBar.value = mapearDatos(labelsRealizado, valoresRealizado, 'Cantidad de subtareas', coloresRealizado)

          finalizados.value = filtrarSubtareasGrupoPorEstado(subtareasPorGrupo, estadosTrabajos.FINALIZADO)
          const labelsFinalizado = finalizados.value.map((item) => item.grupo)
          const valoresFinalizado = finalizados.value.map((item) => item.total_subtareas)
          const coloresFinalizado = finalizados.value.map(() => generarColorAzulPastelClaro())
          finalizadosBar.value = mapearDatos(labelsFinalizado, valoresFinalizado, 'Cantidad de subtareas', coloresFinalizado)

          /***************
          * Por empleado
          ****************/
          agendadosEmpleado.value = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.AGENDADO)
          const labelsAgendadoEmpleado = agendadosEmpleado.value.map((item) => item.empleado)
          const valoresAgendadoEmpleado = agendadosEmpleado.value.map((item) => item.total_subtareas)
          const coloresAgendadoEmpleado = agendadosEmpleado.value.map(() => generarColorAzulPastelClaro())
          agendadosEmpleadoBar.value = mapearDatos(labelsAgendadoEmpleado, valoresAgendadoEmpleado, 'Cantidad de subtareas', coloresAgendadoEmpleado)

          ejecutadosEmpleado.value = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.EJECUTANDO)
          const labelsEjecutandoEmpleado = ejecutadosEmpleado.value.map((item) => item.empleado)
          const valoresEjecutandoEmpleado = ejecutadosEmpleado.value.map((item) => item.total_subtareas)
          const coloresEjecutandoEmpleado = ejecutadosEmpleado.value.map(() => generarColorAzulPastelClaro())
          ejecutadosEmpleadoBar.value = mapearDatos(labelsEjecutandoEmpleado, valoresEjecutandoEmpleado, 'Cantidad de subtareas', coloresEjecutandoEmpleado)

          pausadosEmpleado.value = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.PAUSADO)
          const labelsPausadoEmpleado = pausadosEmpleado.value.map((item) => item.empleado)
          const valoresPausadoEmpleado = pausadosEmpleado.value.map((item) => item.total_subtareas)
          const coloresPausadoEmpleado = pausadosEmpleado.value.map(() => generarColorAzulPastelClaro())
          pausadosEmpleadoBar.value = mapearDatos(labelsPausadoEmpleado, valoresPausadoEmpleado, 'Cantidad de subtareas', coloresPausadoEmpleado)

          suspendidosEmpleado.value = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.SUSPENDIDO)
          console.log(suspendidosEmpleado.value)
          const labelsSuspendidoEmpleado = suspendidosEmpleado.value.map((item) => item.empleado)
          const valoresSuspendidoEmpleado = suspendidosEmpleado.value.map((item) => item.total_subtareas)
          const coloresSuspendidoEmpleado = suspendidosEmpleado.value.map(() => generarColorAzulPastelClaro())
          suspendidosEmpleadoBar.value = mapearDatos(labelsSuspendidoEmpleado, valoresSuspendidoEmpleado, 'Cantidad de subtareas', coloresSuspendidoEmpleado)

          canceladosEmpleado.value = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.CANCELADO)
          const labelsCanceladoEmpleado = canceladosEmpleado.value.map((item) => item.empleado)
          const valoresCanceladoEmpleado = canceladosEmpleado.value.map((item) => item.total_subtareas)
          const coloresCanceladoEmpleado = canceladosEmpleado.value.map(() => generarColorAzulPastelClaro())
          canceladosEmpleadoBar.value = mapearDatos(labelsCanceladoEmpleado, valoresCanceladoEmpleado, 'Cantidad de subtareas', coloresCanceladoEmpleado)

          realizadosEmpleado.value = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.REALIZADO)
          const labelsRealizadoEmpleado = realizadosEmpleado.value.map((item) => item.empleado)
          const valoresRealizadoEmpleado = realizadosEmpleado.value.map((item) => item.total_subtareas)
          const coloresRealizadoEmpleado = realizadosEmpleado.value.map(() => generarColorAzulPastelClaro())
          realizadosEmpleadoBar.value = mapearDatos(labelsRealizadoEmpleado, valoresRealizadoEmpleado, 'Cantidad de subtareas', coloresRealizadoEmpleado)

          finalizadosEmpleado.value = filtrarSubtareasGrupoPorEstado(subtareasPorEmpleado, estadosTrabajos.FINALIZADO)
          const labelsFinalizadoEmpleado = finalizadosEmpleado.value.map((item) => item.empleado)
          const valoresFinalizadoEmpleado = finalizadosEmpleado.value.map((item) => item.total_subtareas)
          const coloresFinalizadoEmpleado = finalizadosEmpleado.value.map(() => generarColorAzulPastelClaro())
          finalizadosEmpleadoBar.value = mapearDatos(labelsFinalizadoEmpleado, valoresFinalizadoEmpleado, 'Cantidad de subtareas', coloresFinalizadoEmpleado)

        } catch (e) {
          console.log(e)
        } finally {
          cargando.desactivar()
        }
      }
    }

    function mapearDatos(labels: [], valores: [], titulo: string, colores?: []) {
      return {
        labels: labels,
        datasets: [
          {
            backgroundColor: colores ?? '#666f88',
            label: titulo,
            data: valores,
          },
        ],
      }
    }

    function mapearColor(estadoTicket: keyof typeof estadosTickets) {
      switch (estadoTicket) {
        case estadosTrabajos.AGENDADO: return '#f9de8d'
        case estadosTrabajos.EJECUTANDO: return '#ffc107'
        case estadosTrabajos.PAUSADO: return '#78909c'
        case estadosTrabajos.SUSPENDIDO: return '#ec5c64'
        case estadosTrabajos.REALIZADO: return '#9ba98c'
        case estadosTrabajos.FINALIZADO: return '#8bc34a'
        case estadosTrabajos.CANCELADO: return '#c31d25'
      }
    }

    function ordenarEmpleados() {
      empleados.value.sort((a: Empleado, b: Empleado) => ordernarListaString(a.apellidos!, b.apellidos!))
    }

    function filtrarSubtareasGrupoPorEstado(subtareasGrupo: any[], estado: string) {
      // console.log(subtareasGrupo)
      return subtareasGrupo.filter((item) =>
        item.estado === estado
      )
    }

    function contarSubtareasGrupo(subtareas: Subtarea[]): any[] {
      const conteo = subtareas.reduce((acumulador: any, subtarea) => {
        const estado = subtarea.estado
        const grupo = subtarea.grupo

        // Verificar si la clave ya existe en el acumulador
        const elementoExistente: any = acumulador.find((item: any) => item.estado === estado && item.grupo === grupo)

        if (!elementoExistente) {
          acumulador.push({ estado, grupo, total_subtareas: 1 })
        } else {
          elementoExistente.total_subtareas++
        }

        return acumulador
      }, [])

      return conteo
    }

    function contarSubtareasEmpleado(subtareas: Subtarea[]): any[] {
      const conteo = subtareas.reduce((acumulador: any, subtarea) => {
        const estado = subtarea.estado
        const empleado = subtarea.empleado_responsable

        // Verificar si la clave ya existe en el acumulador
        const elementoExistente: any = acumulador.find((item: any) => item.estado === estado && item.empleado === empleado)

        if (!elementoExistente) {
          //console.log(estado)
          acumulador.push({ estado, empleado, total_subtareas: 1 })
        } else {
          elementoExistente.total_subtareas++
        }

        return acumulador
      }, [])

      return conteo
    }

    const subtareasFiltradas: Ref<Subtarea[]> = ref([])
    function clickCantidadesPorEstadoSubtareas(data) {
      const { label } = data
      if (label) {
        subtareasFiltradas.value = subtareas.value.filter((subtarea: Subtarea) => subtarea.estado === label)
        tabsCoordinadorConsultado.value = opcionesCoordinadorConsultado.coordinadorConsultadoListado
      }
    }

    function clickCantidadesSubtareasSubordinados(data, estado) {
      const { label } = data
      if (label) {
        subtareasSubordinados.value = subtareasGrupo.value.filter((subtarea: Subtarea) => subtarea.grupo === label && subtarea.estado === estado)
        tabsSubordinados.value = opcionesSubordinado.subordinadosListado
      }
    }

    function clickGraficoEmpleadoSubordinado(data, estado) {
      const { label } = data
      if (label) {
        subtareasEmpleadoSubordinado.value = subtareasEmpleado.value.filter((subtarea: Subtarea) => subtarea.empleado_responsable === label && subtarea.estado === estado)
        tabsSubordinados.value = opcionesSubordinado.subordinadosEmpleadoListado
      }
    }

    return {
      modoUnaColumna: ref(false),
      // Por empleado
      agendadosEmpleado,
      ejecutadosEmpleado,
      pausadosEmpleado,
      suspendidosEmpleado,
      canceladosEmpleado,
      realizadosEmpleado,
      finalizadosEmpleado,
      agendadosEmpleadoBar,
      ejecutadosEmpleadoBar,
      pausadosEmpleadoBar,
      suspendidosEmpleadoBar,
      canceladosEmpleadoBar,
      realizadosEmpleadoBar,
      finalizadosEmpleadoBar,
      // Por grupo
      agendados,
      ejecutados,
      pausados,
      suspendidos,
      cancelados,
      realizados,
      finalizados,
      agendadosBar,
      ejecutadosBar,
      pausadosBar,
      suspendidosBar,
      canceladosBar,
      realizadosBar,
      finalizadosBar,
      // Graficos
      estadosTrabajos,
      opcionesSubordinado,
      opcionesCoordinadorConsultado,
      tabsCoordinadorConsultado,
      tabsSubordinados,
      subtareasFiltradas,
      subtareasSubordinados,
      subtareasEmpleadoSubordinado,
      clickCantidadesPorEstadoSubtareas,
      clickCantidadesSubtareasSubordinados,
      clickGraficoEmpleadoSubordinado,
      // otro
      modosAsignacionTrabajo,
      tipoFiltroSubordinados,
      ordenarEmpleados,
      filtrarEmpleados,
      empleados,
      subtareas,
      cantidadTareasActivas,
      cantidadTareasFinalizadas,
      cantidadSubtareasAgendadas,
      cantidadSubtareasPausadas,
      cantidadSubtareasSuspendidas,
      cantidadSubtareasCanceladas,
      cantidadSubtareasRealizadas,
      cantidadSubtareasFinalizadas,
      totalSubtareas,
      columnasSubtareas: [...configuracionColumnasSubtarea, accionesTabla],
      modalesSubtarea,
      mixinSubtarea,
      //--
      v$,
      filtro,
      optionsPie,
      mostrarTitulosSeccion,
      // Configuracion columnas
      consultar,
      // Listados
      cantidadSubtareasEjecutadas,
      cantidadesPorEstadosSubtareas,
      // Bar
      cantidadesPorEstadosSubtareasBar,
      // botones
      botonVer,
      btnSeguimiento,
    }
  },
})
