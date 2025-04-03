import { defineComponent, ref } from 'vue'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { Planificador } from 'recursosHumanos/planificador/domain/Planificador'
import { PlanificadorController } from 'recursosHumanos/planificador/infraestructure/PlanificadorController'
import { useAuthenticationStore } from 'stores/authentication'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { useVuelidate } from '@vuelidate/core'
import { required } from 'shared/i18n-validators'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { tabOptionsPlanificiones } from 'config/recursosHumanos.utils'
import { configuracionColumnasPlanificaciones } from 'recursosHumanos/planificador/domain/configuracionColumnasPlanificaciones'
import { encontrarUltimoIdListado, imprimirArchivo, ordenarLista } from 'shared/utils'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import { Actividad } from 'recursosHumanos/planificador/domain/Actividad'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { useNotificaciones } from 'shared/notificaciones'
import { configuracionColumnasSubactividades } from 'recursosHumanos/planificador/domain/configuracionColumnasSubactividades'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { acciones, accionesTabla } from 'config/utils'
import { Subactividad } from 'recursosHumanos/planificador/domain/Subactividad'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useCargandoStore } from 'stores/cargando'

export default defineComponent({
  components: { TabLayoutFilterTabs2, EssentialTable },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Planificador,
      new PlanificadorController()
    )
    const {
      entidad: planificador,
      listadosAuxiliares,
      accion,
      disabled
    } = mixin.useReferencias()
    const { setValidador, listar, cargarVista, obtenerListados } =
      mixin.useComportamiento()
    const { onReestablecer } = mixin.useHooks()
    const { confirmar,notificarAdvertencia, prompt } = useNotificaciones()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())

    const cargando = new StatusEssentialLoading()
    const store = useAuthenticationStore()
    const FINALIZADO = 'Finalizado'
    const NO_INICIADO = 'No iniciado'
    const SEMANAL = 'Semanal'
    const tabDefecto = ref('0')

    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1, campos: 'id,nombres,apellidos' }
        }
      })

      empleados.value = listadosAuxiliares.empleados
      planificador.empleado = store.user.id
      configuracionColumnasSubactividades.find(
        item => item.field === 'responsable'
      )!.options = empleados.value.map((v: Empleado) => {
        return { value: v.id, label: v.nombres + ' ' + v.apellidos }
      })
      configuracionColumnasSubactividades.find(
        item => item.field === 'responsable'
      )!.filtro = filtrarListadoEmpleados
    })
    const reglas = {
      nombre: { required },
      empleado: { required }
    }
    const v$ = useVuelidate(reglas, planificador)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onReestablecer(() => (planificador.empleado = store.user.id))

    /*****************
     * Funciones
     ****************/
    async function filtrar(tab: string) {
      tabDefecto.value = tab
      switch (tab) {
        case '1':
          await listar({ completado: 100 })
          break
        default:
          await listar({
            'completado[operator]': '<',
            'completado[value]': 100
          })
      }
    }

    function filtrarListadoEmpleados(val, update) {
      filtrarEmpleados(val, update)
      configuracionColumnasSubactividades.find(
        item => item.field === 'responsable'
      )!.options = empleados.value.map((v: Empleado) => {
        return { value: v.id, label: v.nombres + ' ' + v.apellidos }
      })
    }

    const agregarActividad = () => {
      const fila: Actividad = new Actividad()
      fila.id = planificador.actividades.length
        ? encontrarUltimoIdListado(planificador.actividades) + 1
        : 1
      const config: CustomActionPrompt = {
        titulo: 'Nombre',
        mensaje: 'Ingrese el nombre de la actividad',
        accion: nombre => {
          fila.nombre = nombre
          planificador.actividades.push(fila)
        }
      }
      prompt(config)
    }

    const editarNombreActividad = (actividad: Actividad) => {
      const config: CustomActionPrompt = {
        titulo: 'Nombre',
        mensaje: 'Ingresa el nombre de la actividad',
        defecto: actividad.nombre,
        accion: nombre => {
          actividad.nombre = nombre
        }
      }
      prompt(config)
    }
    const eliminarActividad = posicion => {
      confirmar(
        '¿Está seguro de eliminar la actividad? Está acción borrará todas las subactividades',
        () => planificador.actividades.splice(posicion, 1)
      )
    }

    function eliminar({ posicion, identificador }) {
      confirmar('¿Está seguro de continuar?', () => {
        planificador.actividades[identificador].subactividades.splice(posicion, 1)
        calcularPorcentajeCompletado(planificador.actividades[identificador][0], planificador.actividades[identificador])
      })
    }

    const calcularPorcentajeCompletado = (fila, actividad) => {
      const finalizados = actividad.subactividades.filter(
        (item: Subactividad) => item.estado_avance === FINALIZADO
      )
      actividad.completado =((finalizados.length / actividad.subactividades?.length) * 100).toFixed(2)

      //aqui se calcula el porcentaje total para que se actualice inmediatamente
      let total_subactividades = 0
      let total_finalizadas = 0
      planificador.actividades.forEach((actividad: Actividad) => {
        actividad.subactividades?.forEach((subactividad: Subactividad) => {
          total_subactividades++
          if (subactividad.estado_avance === FINALIZADO) total_finalizadas++
        })
      })
      planificador.completado = ((total_finalizadas / total_subactividades) * 100).toFixed(2)
    }

    async function imprimirPdf(entidad:Planificador){
      try {
        cargando.activar()
        const axios = AxiosHttpRepository.getInstance()
        const url = apiConfig.URL_BASE+'/'+axios.getEndpoint(endpoints.planificadores)+'/imprimir/'+entidad.id
        const filename = entidad.nombre+'_'+Date.now()
        await  imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
      }catch (e){
        notificarAdvertencia('Error al imprimir el registro '+e)
      }finally {
        cargando.desactivar()
      }
    }

    /***********************
     * Botones de Tabla
     **********************/
    const btnAgregarSubactividad: CustomActionTable<Subactividad> = {
      titulo: 'Agregar Item',
      icono: 'bi-arrow-bar-down',
      color: 'positive',
      tooltip: 'Agregar referencia personal o laboral',
      accion: identificador => {
        const fila = new Subactividad()
        fila.actividad_id = planificador.actividades[identificador].id
        fila.responsable = planificador.empleado
        fila.estado_avance = NO_INICIADO
        fila.periodicidad = SEMANAL
        fila.fecha_inicio =planificador.actividades[identificador].subactividades.at(-1)?.fecha_inicio
        fila.fecha_fin =planificador.actividades[identificador].subactividades.at(-1)?.fecha_fin
        fila.id = planificador.actividades[identificador].subactividades.length ? encontrarUltimoIdListado(planificador.actividades[identificador].subactividades) + 1 : 1
        planificador.actividades[identificador].subactividades.push(fila)

        calcularPorcentajeCompletado(fila, planificador.actividades[identificador])
      },
      visible: () => [acciones.nuevo, acciones.editar].includes(accion.value)
    }

    const btnEliminar: CustomActionTable<Subactividad> = {
      titulo: '',
      icono: 'bi-trash',
      color: 'negative',
      accion: ({ posicion, identificador }) => {
        eliminar({ posicion, identificador })
      },
      visible: () => [acciones.nuevo, acciones.editar].includes(accion.value)
    }

    const btnImprimir: CustomActionTable<Planificador>={
      titulo: 'Imprimir',
      color:'secondary',
      icono: 'bi-printer',
      accion: async ({entidad})=>{
        await imprimirPdf(entidad)
      }
    }

    return {
      mixin,
      v$,
      accion,
      acciones,
      accionesTabla,
      disabled,
      planificador,
      store,
      tabDefecto,
      configuracionColumnas: configuracionColumnasPlanificaciones,
      configuracionColumnasSubactividades,
      tabOptions: tabOptionsPlanificiones,

      //listados
      empleados,
      filtrarEmpleados,

      //funciones
      filtrar,
      ordenarLista,
      agregarActividad,
      eliminarActividad,
      editarNombreActividad,
      calcularPorcentajeCompletado,

      // botones de tabla
      btnEliminar,
      btnAgregarSubactividad,
      btnImprimir,
    }
  }
})
