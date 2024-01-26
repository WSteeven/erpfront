// Dependencias
import { configuracionColumnasEmpleados } from '../domain/configuracionColumnasEmpleados'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'
import { defineComponent, ref } from 'vue'
//import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import DetallePaciente from './DetallePaciente.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from '../infraestructure/EmpleadoController'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import { Empleado } from 'recursosHumanos/empleados/domain/Empleado'
import { DetalleExamen } from '../domain/DetalleExamen'

export default defineComponent({
  components: { TabLayout, SelectorImagen, ModalesEntidad, EssentialTable, DetallePaciente },
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

    const tabs = ref('1')

    const registroExamenes: any[] = [
      {
        categoria: 'HEMATOLOGIA',
        examenes: [
          {
            tipo_examen: 'Examenes comunes',
            // categoria_examen: 'HEMATOLOGIA',
            examen: 'GRUPO SANGUINEO',
            estado: 1,
            seleccionado: false,
          },
          {
            tipo_examen: 'Examenes comunes',
            // categoria_examen: 'HEMATOLOGIA',
            examen: 'BIOMETRIA',
            estado: 1,
            seleccionado: false,
          },
        ],
      },
    ]

    const estadosExamenes = [
      {
        id: 1,
        nombre: 'SOLICITADO',
      },
      {
        id: 2,
        nombre: 'APROBADO POR COMPRAS',
      },
      {
        id: 3,
        nombre: 'DIAGNOSTICO REALIZADO',
      },
      {
        id: 4,
        nombre: 'APERTURA DE FICHA MEDICA',
      },
    ]

    return {
      mixin,
      empleado,
      tabs,
      tabsRegistro: ref('1'),
      configuracionColumnas: configuracionColumnasEmpleados,
      registroExamenes,
      estadosExamenes,
    }
  },
})
