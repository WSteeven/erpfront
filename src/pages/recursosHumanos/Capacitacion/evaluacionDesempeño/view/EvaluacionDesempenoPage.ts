import { computed, defineComponent, ref } from 'vue'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EvaluacionDesempeno } from 'capacitacion/evaluacionDesempeño/domain/EvaluacionDesempeno'
import { EvaluacionDesempenoController } from 'capacitacion/evaluacionDesempeño/infraestructure/EvaluacionDesempenoController'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import useVuelidate from '@vuelidate/core'
import { filtrarLista, imprimirArchivo, ordenarLista } from 'shared/utils'
import { required } from 'shared/i18n-validators'
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import { configuracionColumnasEvaluacionDesempeno } from 'capacitacion/evaluacionDesempeño/domain/configuracionColumnasEvaluacionDesempeno'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import FormPage from 'capacitacion/forms/view/FormPage.vue'
import ErrorComponent from 'components/ErrorComponent.vue'
import { FormularioController } from 'capacitacion/forms/infraestructure/FormularioController'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { useAuthenticationStore } from 'stores/authentication'
import DynamicFields from 'capacitacion/forms/components/DynamicFields.vue'
import CalloutComponent from 'components/CalloutComponent.vue'
import { EmptyField } from 'capacitacion/forms/domain/EmptyField'
import { ValidarRespuestasEvaluacionDesempeno } from 'capacitacion/evaluacionDesempeño/application/validation/ValidarRespuestasEvaluacionDesempeno'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { useCargandoStore } from 'stores/cargando'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { apiConfig, endpoints } from 'config/api'

export default defineComponent({
  components: {
    CalloutComponent,
    DynamicFields,
    NoOptionComponent,
    ErrorComponent,
    FormPage,
    EssentialTable,
    TabLayout,
    TabLayoutFilterTabs2
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      EvaluacionDesempeno,
      new EvaluacionDesempenoController()
    )
    const {
      entidad: evaluacion,
      disabled,
      listadosAuxiliares,
      listado: respuestas
    } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador } =
      mixin.useComportamiento()
    const { onReestablecer } = mixin.useHooks()

    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    // const cargando = new StatusEssentialLoading()
    // const mixinRespuestas = new ContenedorSimpleMixin(Respuesta, new RespuestaEvaluacionDesempenoController())
    const tab = ref('configuracion') //'respuestas'

    const store = useAuthenticationStore()
    const formulario = ref()
    evaluacion.calificacion = computed({
      get: () =>
        evaluacion.respuestas.length > 0
          ? evaluacion.respuestas.reduce((sum: number, item: EmptyField) => {
              const valorNumerico = parseInt(item.valor, 10)
              return (
                sum +
                (item.valor !== null && !isNaN(valorNumerico)
                  ? valorNumerico
                  : 0)
              )
            }, 0)
          : 0,
      set: val => (Array.isArray(val) ? val : [])
    })
    const formularios = ref([])
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1 }
        },
        formularios: {
          controller: new FormularioController(),
          params: { activo: 1, 'nombre[like]':'%evaluación de desem%' }
          // params: { activo: 1, 'nombre[like]':'%evaluaci%' }
        }
      })

      empleados.value = listadosAuxiliares.empleados
      formularios.value = listadosAuxiliares.formularios
      evaluacion.evaluador = store.user.id
      evaluacion.formulario = formularios.value[0].id
      formularioSeleccionado()
    })

    /***************************
     * HOOKS
     ***************************/
    onReestablecer(() => {
      evaluacion.evaluador = store.user.id
      evaluacion.formulario = formularios.value[0].id
      formularioSeleccionado()
    })

    /***************************
     * REGLAS DE VALIDACION
     ***************************/
    const reglas = {
      formulario: { required },
      evaluado: { required },
      evaluador: { required }
    }
    const v$ = useVuelidate(reglas, evaluacion)
    setValidador(v$.value)
    const validarRespuestasEvaluacionDesempeno =
      new ValidarRespuestasEvaluacionDesempeno(evaluacion)
    mixin.agregarValidaciones(validarRespuestasEvaluacionDesempeno)

    function formularioSeleccionado() {
      cargarVista(async () => {
        const response = await new FormularioController().consultar(
          evaluacion.formulario
        )
        // console.log(response)
        formulario.value = response.result
        evaluacion.respuestas = response.result.formulario
      })
    }

    async function imprimir(id: number, nombre_empleado: string) {
      const axios = AxiosHttpRepository.getInstance()
      const url =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.imprimir_evaluacion_desempeno) +
        id
      const filename = 'Evaluación desempeño período prueba ' + nombre_empleado
      await imprimirArchivo(url, 'GET', 'blob', 'pdf', filename)
    }

    const btnImprimir: CustomActionTable<EvaluacionDesempeno> = {
      titulo: 'Imprimir',
      color: 'secondary',
      icono: 'bi-printer',
      accion: async ({ entidad }) => {
        await imprimir(entidad.id, entidad.evaluado)
      }
    }

    return {
      mixin,
      v$,
      disabled,
      evaluacion,
      configuracionColumnas: configuracionColumnasEvaluacionDesempeno,
      tabOptions: [{ label: 'Evaluación', value: '1' }],
      // { label: 'Inactivos', value: '0' }],
      tab,
      respuestas,
      formulario,
      indicatorColor: computed(() =>
        evaluacion.tiene_respuestas ? 'primary' : 'white'
      ),
      // listados
      empleados,
      filtrarEmpleados,
      formularios,

      //funciones
      filtrarFormularios: (val, update) =>
        filtrarLista(
          val,
          update,
          formularios,
          'nombre',
          listadosAuxiliares.formularios
        ),
      ordenarLista,
      formularioSeleccionado,

      //botones
      btnImprimir
    }
  }
})
