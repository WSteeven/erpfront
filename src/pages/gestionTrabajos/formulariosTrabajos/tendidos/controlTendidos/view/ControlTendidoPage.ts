// Dependencias
import { configuracionColumnasControlTendido } from '../domain/configuracionColumnasControlTendido'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import {
  tiposElementos,
  propietariosElementos,
  estadoElementos,
  accionesTabla,
  sistemasCoordenadas,
  bobinasSolicitadas,
  acciones,
} from 'config/utils'
import { useTendidoStore } from 'stores/tendido'
import { computed, defineComponent, watchEffect } from 'vue'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { RegistroTendidoController } from '../modules/registrosTendidos/infraestructure/RegistroTendidoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesProgresiva } from '../application/ComportamientoModalesProgresiva'
import { ControlTendidoController } from '../infraestructure/ControlTendidoController'
import { RegistroTendido } from '../modules/registrosTendidos/domain/RegistroTendido'
import { BobinaController } from '../infraestructure/BobinaController'
import { Tendido } from '../domain/Tendido'

export default defineComponent({
  components: {
    TabLayout,
    SelectorImagen,
    LabelAbrirModal,
    ModalesEntidad,
    EssentialTable,
  },
  setup() {
    /*********
    * Stores
    *********/
    const trabajoAsignadoStore = useTrabajoAsignadoStore()
    const tendidoStore = useTendidoStore()

    /********
    * Mixin
    *********/
    const mixin = new ContenedorSimpleMixin(Tendido, new ControlTendidoController())

    const { entidad: tendido, listadosAuxiliares } = mixin.useReferencias()
    const { guardar, consultar, cargarVista, obtenerListados, setValidador } = mixin.useComportamiento()
    const { onBeforeGuardar, onConsultado, onGuardado } = mixin.useHooks()

    /*************
    * Mixin modal
    **************/
    const mixinRegistroTendido = new ContenedorSimpleMixin(RegistroTendido, new RegistroTendidoController())
    const { entidad: registroTendido, listado: listadoRegistrosTendidos } = mixinRegistroTendido.useReferencias()
    const { listar: listarRegistrosTendidos } = mixinRegistroTendido.useComportamiento()

    /************
    * Variables
    ************/
    const modales = new ComportamientoModalesProgresiva()
    const entidadReset = new RegistroTendido()

    consultar({ id: trabajoAsignadoStore.idSubtareaSeleccionada })

    /*onMounted(() => {
      // Consultar control tendido
      if (trabajoAsignadoStore.idSubtareaSeleccionada) {
        consultar({ id: trabajoAsignadoStore.idSubtareaSeleccionada })
      } else {
        router.replace({ name: 'trabajo_asignado' })
      }
    })*/

    cargarVista(async () => {
      await obtenerListados({
        bobinas: {
          controller: new BobinaController(),
          params: { trabajo_id: trabajoAsignadoStore.idSubtareaSeleccionada }
        },
      })
    })

    const agregarProgresiva: CustomActionTable = {
      titulo: 'Agregar nuevo elemento',
      icono: 'bi-plus',
      color: 'positive',
      accion: () => {
        modales.abrirModalEntidad('RegistroTendidoPage')
        // tendidoStore.idTendido = progresiva.id
        registroTendido.hydrate(entidadReset)
        tendidoStore.idRegistroTendido = null
        tendidoStore.accion = acciones.nuevo
        tendidoStore.numeroElemento = listadoRegistrosTendidos.value.length + 1
      },
    }

    function consultarRegistro({ entidad }) {
      modales.abrirModalEntidad('RegistroTendidoPage')
      // tendidoStore.idTendido = progresiva.id
      tendidoStore.accion = acciones.consultar
      tendidoStore.idRegistroTendido = entidad.id
    }

    function editarRegistro({ entidad }) {
      modales.abrirModalEntidad('RegistroTendidoPage')
      // tendidoStore.idTendido = progresiva.id
      tendidoStore.accion = acciones.editar
      tendidoStore.idRegistroTendido = entidad.id
    }

    function verResumen() {
      modales.abrirModalEntidad('ResumenTendidoPage')
    }

    /********
     * Hooks
     *********/
    onConsultado(() => {
      listarRegistrosTendidos({
        tendido: tendido.id
      })

      tendidoStore.idTendido = tendido.id
      tendidoStore.idTarea = tendido.tarea
    })

    onBeforeGuardar(() => tendido.trabajo = trabajoAsignadoStore.idSubtareaSeleccionada)

    onGuardado(() => tendidoStore.idTendido = tendido.id)


    /*************
    * Validaciones
    **************/
    const reglas = {
      bobina: { required },
    }

    const v$ = useVuelidate(reglas, tendido)
    setValidador(v$.value)

    /************
    * Funciones
    *************/
    function obtenerElemento(id: number) {
      return listadosAuxiliares.bobinas.find((item: any) => item.id === id)
    }

    watchEffect(() => {
      if (tendido.bobina) {
        const bobina = obtenerElemento(tendido.bobina)
        if (bobina) {
          tendido.cantidad_hilos = bobina.cantidad_hilos
        }
      }
    })

    const marcaInicial = computed(() => listadoRegistrosTendidos.value.length ? listadoRegistrosTendidos.value[0].progresiva_entrada : 0)
    const marcaFinal = computed(() => listadoRegistrosTendidos.value.length ? listadoRegistrosTendidos.value[listadoRegistrosTendidos.value.length - 1].progresiva_salida : 0)
    const metrajeTendido = computed(() => marcaInicial.value - marcaFinal.value)

    return {
      v$,
      mixin,
      mixinRegistroTendido,
      listadosAuxiliares,
      guardar,
      tendido,
      verResumen,
      // mixin 2
      listadoRegistrosTendidos,
      configuracionColumnasControlTendido,
      modales,
      agregarProgresiva,
      consultarRegistro,
      editarRegistro,
      accionesTabla,
      obtenerElemento,
      marcaInicial,
      marcaFinal,
      metrajeTendido,
      // listados
      tiposElementos,
      propietariosElementos,
      estadoElementos,
      sistemasCoordenadas,
      bobinasSolicitadas,
    }
  },
})
