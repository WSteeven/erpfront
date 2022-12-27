// Dependencias
import { configuracionColumnasControlProgresivas } from '../domain/configuracionColumnasControlProgresivas'
import {
  tiposElementos,
  propietariosElementos,
  estadoElementos,
  accionesTabla,
  sistemasCoordenadas,
  bobinasSolicitadas,
} from 'config/utils'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { Tendido } from '../domain/Tendido'
import { ComportamientoModalesProgresiva } from '../application/ComportamientoModalesProgresiva'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ControlProgresivaController } from '../infraestructure/ControlProgresivaController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { useRouter } from 'vue-router'
import { BobinaController } from '../infraestructure/BobinaController'

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
      new ControlProgresivaController()
    )

    const { entidad: progresiva, listadosAuxiliares } = mixin.useReferencias()
    const { guardar, consultar, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onBeforeGuardar, onConsultado } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        bobinas: new BobinaController(),
      })
    })

    const trabajoAsignadoStore = useTrabajoAsignadoStore()

    const elementos = ref([])

    /* const progresivas: any[] = [
      {
        id: 1,
        numero_poste: '0001',
        tipo_elemento: 'POSTE',
        tecnico: 'JUAN PINCAY',
        codigo_tarea_jp: '4',
        codigo_subtarea_jp: 'QUEVEDO-SANTO DOMINGO',
        propietario_elemento: 'TELCONET',
        fecha: '27/05/2019',
      },
      {
        id: 2,
        numero_poste: '0001',
        tipo_elemento: 'POSTE',
        tecnico: 'DANIEL G',
        codigo_tarea_jp: '5',
        codigo_subtarea_jp: 'SARACAY-LA AVANZADA',
        propietario_elemento: 'CNEL',
        fecha: '23/08/2019',
      },
      {
        id: 3,
        numero_poste: '0001',
        tipo_elemento: 'POSTE',
        tecnico: 'FRANCISCO FERNÁNDEZ',
        codigo_tarea_jp: '6',
        codigo_subtarea_jp: 'BALSAS-PIÑAS',
        propietario_elemento: 'CNEL',
        fecha: '04/09/2019',
      },
      {
        id: 4,
        numero_poste: '0001',
        tipo_elemento: 'POSTE',
        tecnico: 'DANIEL G',
        codigo_tarea_jp: '7',
        codigo_subtarea_jp: 'SARACAY-BALSAS',
        propietario_elemento: 'CNEL',
        fecha: '25/08/2019',
      },
    ] */

    function enviar() {
      console.log(progresiva)
    }

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
      },
    }

    function eliminar() {
      //
    }

    function editar() {
      //
    }

    onBeforeGuardar(() => {
      progresiva.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada
    })

    const modales = new ComportamientoModalesProgresiva()

    const router = useRouter()

    if (trabajoAsignadoStore.idSubtareaSeleccionada) {
      consultar({ id: trabajoAsignadoStore.idSubtareaSeleccionada })
    } else {
      router.replace({ name: 'trabajo_asignado' })
    }

    onConsultado(() => {
      // console.log('CONSULTADO!!')
      if (!progresiva.id) {
        console.log('Sigues con valor nulo')
      } else {
        console.log('ya tienes valor en el ID')
      }
    })

    return {
      mixin,
      listadosAuxiliares,
      guardar,
      progresiva,
      elementos,
      enviar,
      configuracionColumnasControlProgresivas,
      setBase64,
      modales,
      agregarProgresiva,
      eliminar,
      editar,
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
