// Dependencias
import { configuracionColumnasEmpleados } from '../domain/configuracionColumnasEmpleados'
import { defineComponent, ref } from 'vue'

// Componentes
import EssentialTableTabs from 'components/tables/view/EssentialTableTabs.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import DetallePaciente from './DetallePaciente.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesGestionPaciente } from '../application/ComportamientoModalesGestionPaciente'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { configuracionColumnasExamenes } from '../domain/configuracionColumnasExamenes'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { tabOptionsEstadosExamenes } from 'config/utils/medico'
import { useExamenes } from '../application/UseExamenes'
import { accionesTabla } from 'config/utils'
import { useBotonesSolicitudExamen } from '../application/UseBotonesSolicitudExamen'

export default defineComponent({
  components: { TabLayout, SelectorImagen, ModalesEntidad, EssentialTable, DetallePaciente, EssentialTableTabs },
  setup() {
    /*********
     * Stores
     *********/
    // useNotificacionStore().setQuasar(useQuasar())
    // useCargandoStore().setQuasar(useQuasar())

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())
    const { entidad: empleado } = mixin.useReferencias()

    const listadoExamenes = ref([])

    // const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())

    const tabs = ref('1')
    const tabEstadoExamen = ref('0')

    const modales = new ComportamientoModalesGestionPaciente()

    /*************
     * Funciones
     *************/
    const { examenes, consultarExamenes, consultarExamenesSolicitados } = useExamenes()
    const { btnSolicitar, btnResultados } = useBotonesSolicitudExamen(tabEstadoExamen, modales)

    const filtrarEstadoExamen = (tab) => {
      tabEstadoExamen.value = tab
      if (tab === '0') consultarExamenes()
      else consultarExamenesSolicitados(tab)
    }



    /*******
     * Init
     *******/
    consultarExamenes()

    return {
      mixin,
      empleado,
      tabs,
      tabsRegistro: ref('1'),
      tabEstadoExamen,
      configuracionColumnas: configuracionColumnasEmpleados,
      configuracionColumnasExamenes,
      tabOptionsEstadosExamenes,
      listadoExamenes,
      filtrarEstadoExamen,
      splitterModel: ref(14),
      accionesTabla,
      modales,
      examenes,
      // botones tabla
      btnSolicitar,
      btnResultados,
    }
  },
})
