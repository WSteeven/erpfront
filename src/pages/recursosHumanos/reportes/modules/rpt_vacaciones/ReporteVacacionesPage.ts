import { StatusEssentialLoading } from "components/loading/application/StatusEssentialLoading";
import ModalEntidad from "components/modales/view/ModalEntidad.vue";
import EssentialTable from "components/tables/view/EssentialTable.vue";
import { Empleado } from "pages/recursosHumanos/empleados/domain/Empleado";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { useQuasar } from "quasar";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { useCargandoStore } from "stores/cargando";
import { useNotificacionStore } from "stores/notificacion";
import { defineComponent } from "vue";

export default defineComponent({
  components: {EssentialTable, ModalEntidad},
  setup(props, ctx) {
    const mixin = new ContenedorSimpleMixin(Empleado, new EmpleadoController())
    const { listadosAuxiliares } = mixin.useReferencias()
    const { obtenerListados, cargarVista } = mixin.useComportamiento()
    useNotificacionStore().setQuasar(useQuasar())
    useCargandoStore().setQuasar(useQuasar())
    const cargando = new StatusEssentialLoading()

    const {empleados, filtrarEmpleados} = useFiltrosListadosSelects(listadosAuxiliares)

    return {
      mixin,
      
      // listados
      empleados, filtrarEmpleados,

    }
  },
})
