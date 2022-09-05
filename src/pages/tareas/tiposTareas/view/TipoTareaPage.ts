// Dependencias
import { configuracionColumnasClientes } from 'pages/sistema/clientes/domain/configuracionColumnasClientes'
import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasTiposTareas'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useOrquestadorSelectorClientes } from '../application/OrquestadorSelectorClientes'
import { TipoTareaController } from '../infraestructure/TipoTareaController'
import { TipoTarea } from '../domain/TipoTarea'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

export default defineComponent({
  components: {
    TabLayout,
    EssentialSelectableTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      TipoTarea,
      new TipoTareaController()
    )
    const { entidad: tipoTarea, disabled, accion } = mixin.useReferencias()
    const { onConsultado, onReestablecer } = mixin.useHooks()
    const { cargarVista, obtenerListados, setValidador } =
      mixin.useComportamiento()

    const rules = {
      cliente: { required },
      nombre: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, tipoTarea)
    setValidador(v$.value)

    const {
      refListadoSeleccionable: refListadoSeleccionableClientes,
      criterioBusqueda: criterioBusquedaCliente,
      listado: listadoClientes,
      listar: listarClientes,
      limpiar: limpiarCliente,
      seleccionar: seleccionarCliente,
    } = useOrquestadorSelectorClientes(tipoTarea, 'clientes')

    onReestablecer(() => (criterioBusquedaCliente.value = null))
    onConsultado(() => seleccionarCliente(tipoTarea.cliente))

    return {
      // mixin
      mixin,
      tipoTarea,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasTiposTareas,
      // Selector
      refListadoSeleccionableClientes,
      criterioBusquedaCliente,
      listadoClientes,
      listarClientes,
      limpiarCliente,
      seleccionarCliente,
      configuracionColumnasClientes,
    }
  },
})
