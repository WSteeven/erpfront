// Dependencias
import { configuracionColumnasEmpleados } from '../domain/configuracionColumnasEmpleados'
import { useNotificacionStore } from 'stores/notificacion'
import { useCargandoStore } from 'stores/cargando'
import { defineComponent, ref } from 'vue'
import { useQuasar } from 'quasar'

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

    return {
      mixin,
      empleado,
      tabs,
      configuracionColumnas: configuracionColumnasEmpleados,
    }
  },
})
