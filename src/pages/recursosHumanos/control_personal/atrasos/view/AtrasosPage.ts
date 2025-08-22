import { computed, defineComponent, ref } from 'vue'
import { configuracionColumnasAtrasos } from '../domain/configuracionColumnasAtrasos'
import { useVuelidate } from '@vuelidate/core'
import { apiConfig, endpoints } from 'config/api'
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { AxiosResponse } from 'axios'

import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import EssentialEditor from 'components/editores/EssentialEditor.vue'

import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AtrasosController } from '../infraestructure/AtrasosController'
import { Atrasos } from '../domain/Atrasos'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { ordenarLista } from 'shared/utils'
import { required, requiredIf } from 'shared/i18n-validators'
import ErrorComponent from 'components/ErrorComponent.vue'
import NoOptionComponent from 'components/NoOptionComponent.vue'
import { acciones, maskFecha } from 'config/utils'
import OptionGroupComponent from 'components/optionGroup/view/OptionGroupComponent.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import ModalEntidad from 'components/modales/view/ModalEntidad.vue'
import { ComportamientoModalesAtrasos } from 'controlPersonal/atrasos/application/ComportamientoModalesAtrasos'
import { useNotificaciones } from 'shared/notificaciones'
import MarcacionPage from 'controlPersonal/asistencia/view/MarcacionPage.vue'
import { useAuthenticationStore } from 'stores/authentication'

export default defineComponent({
  name: 'JustificacionPage',
  components: {
    MarcacionPage,
    ModalEntidad,
    NoOptionComponent,
    SelectorImagen,
    ErrorComponent,
    TabLayoutFilterTabs2,
    OptionGroupComponent,
    EssentialEditor
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(Atrasos, new AtrasosController())
    const {
      entidad: atraso,
      accion,
      listado,
      listadosAuxiliares,
      disabled
    } = mixin.useReferencias()
    const { setValidador, listar, cargarVista, obtenerListados } =
      mixin.useComportamiento()
    const { onBeforeConsultar, onConsultado, onModificado } = mixin.useHooks()
    const tabDefecto = ref('0') // Por defecto "Justificados"
    const { notificarCorrecto } = useNotificaciones()
    const modales = new ComportamientoModalesAtrasos()
    const store = useAuthenticationStore()

    const esRecursosHumanos = computed(() => store.esRecursosHumanos)
    const esJefeInmediato = computed(() => store.user.id == atraso.jefe)
    const puedeJustificar = computed(
      () => esRecursosHumanos.value || esJefeInmediato.value
    )
    const esEmpleadoAtrasado = computed(() => store.user.id == atraso.empleado)
    const mostrarMarcacionPage = ref(false)
    const { empleados, filtrarEmpleados } =
      useFiltrosListadosSelects(listadosAuxiliares)
    cargarVista(async () => {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { estado: 1 }
        }
      })

      empleados.value = listadosAuxiliares.empleados
    })

    const reglas = {
      empleado: { required },
      justificacion: { required: requiredIf(() => atraso.justificado) },
      justificacion_atrasado: {
        required: requiredIf(
          () => accion.value == acciones.editar && esEmpleadoAtrasado.value
        )
      }
    }

    const v$ = useVuelidate(reglas, atraso)
    setValidador(v$.value)

    /**
     * HOOKS
     */
    onBeforeConsultar(async () => {
      mostrarMarcacionPage.value = false
    })
    onConsultado(() => {
      mostrarMarcacionPage.value = true
    })
    onModificado((_, response_data) => {
      if (response_data.modelo.justificado) filtrarListadoAtrasos('1')
    })

    const tabOptions = [
      { value: '0', label: 'Injustificados' },
      { value: '1', label: 'Justificados' }
    ]

    async function filtrarListadoAtrasos(tab: string) {
      tabDefecto.value = tab
      await listar({ justificado: tab })
    }

    async function sincronizarAtrasos() {
      const axios = AxiosHttpRepository.getInstance()
      const url =
        apiConfig.URL_BASE +
        '/' +
        axios.getEndpoint(endpoints.sincronizar_atrasos)
      try {
        const response: AxiosResponse = await axios.get(url)
        // console.log(response.data.message)
        if (response.status === 200) notificarCorrecto(response.data.message)
      } catch (error) {
        console.error('Error al sincronizar atrasos:', error)
        listado.value = [] // Mantén el listado vacío si ocurre un error
      }
    }

    sincronizarAtrasos()

    /**
     * BOTONES DE TABLA
     */
    const btnVerMarcaciones: CustomActionTable<Atrasos> = {
      titulo: 'Ver asistencias',
      icono: 'bi-calendar-check',
      color: 'secondary',
      accion: ({ entidad }) => {
        // console.log('Aqui se mostraran las asistencias')
        modales.abrirModalEntidad<{ marcacion_id: number }>('MarcacionPage', {
          marcacion_id: entidad.marcacion
        })
      }
    }

    return {
      mixin,
      atraso,
      v$,
      disabled,
      accion,
      acciones,
      configuracionColumnas: configuracionColumnasAtrasos,
      tabDefecto,
      tabOptions,
      maskFecha,
      puedeJustificar,
      esRecursosHumanos,
      esJefeInmediato,
      esEmpleadoAtrasado,
      modales,
      mostrarMarcacionPage,
      // opciones
      empleados,
      filtrarEmpleados,

      //funciones
      filtrarListadoAtrasos,
      ordenarLista,

      //botones de tabla
      btnVerMarcaciones
    }
  }
})
