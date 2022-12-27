// Dependencias
import { configuracionColumnasControlTendido } from '../domain/configuracionColumnasControlTendido'
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
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
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
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { BobinaController } from '../infraestructure/BobinaController'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { Tendido } from '../domain/Tendido'
import { RegistroTendido } from '../modules/registrosTendidos/domain/RegistroTendido'

export default defineComponent({
  components: {
    TabLayout,
    SelectorImagen,
    LabelAbrirModal,
    ModalesEntidad,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Tendido,
      new ControlTendidoController()
    )

    const { entidad: progresiva, listadosAuxiliares } = mixin.useReferencias()
    const { guardar, consultar, cargarVista, obtenerListados, setValidador } = mixin.useComportamiento()
    const { onBeforeGuardar, onConsultado } = mixin.useHooks()

    const tendidoStore = useTendidoStore()

    // Mixin 
    const mixinRegistroTendido = new ContenedorSimpleMixin(RegistroTendido, new RegistroTendidoController())
    const { listado: listadoRegistrosTendidos } = mixinRegistroTendido.useReferencias()
    const { listar: listarRegistrosTendidos } = mixinRegistroTendido.useComportamiento()

    listarRegistrosTendidos()

    cargarVista(async () => {
      await obtenerListados({
        bobinas: new BobinaController(),
        // elementos: new RegistroTendidoController(),
      })
    })

    const trabajoAsignadoStore = useTrabajoAsignadoStore()

    const setBase64 = (file: File) => {
      if (file !== null && file !== undefined) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => (progresiva.imagen = reader.result)
      } else {
        progresiva.imagen = file
      }
    }

    const agregarProgresiva: CustomActionTable = {
      titulo: 'Agregar nuevo elemento',
      icono: 'bi-plus',
      color: 'secondary',
      accion: () => {
        modales.abrirModalEntidad('RegistroTendidoPage')
        tendidoStore.idTendido = progresiva.id
      },
    }

    function consultarRegistro() {
      modales.abrirModalEntidad('RegistroTendidoPage')
      tendidoStore.idTendido = progresiva.id
      tendidoStore.accion = acciones.consultar
    }

    function editarRegistro() {
      modales.abrirModalEntidad('RegistroTendidoPage')
      tendidoStore.idTendido = progresiva.id
      tendidoStore.accion = acciones.editar
    }

    onBeforeGuardar(() => progresiva.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada)

    const modales = new ComportamientoModalesProgresiva()

    const router = useRouter()

    if (trabajoAsignadoStore.idSubtareaSeleccionada) {
      consultar({ id: trabajoAsignadoStore.idSubtareaSeleccionada })
    } else {
      router.replace({ name: 'trabajo_asignado' })
    }

    // Reglas de validacion
    const reglas = {
      bobina: { required },
    }

    const v$ = useVuelidate(reglas, progresiva)
    setValidador(v$.value)

    return {
      v$,
      mixin,
      mixinRegistroTendido,
      listadosAuxiliares,
      guardar,
      progresiva,
      // mixin 2
      listadoRegistrosTendidos,
      configuracionColumnasControlTendido,
      setBase64,
      modales,
      agregarProgresiva,
      consultarRegistro,
      editarRegistro,
      accionesTabla,
      // listados
      tiposElementos,
      propietariosElementos,
      estadoElementos,
      sistemasCoordenadas,
      bobinasSolicitadas,
    }
  },
})
