// Dependencias
import { configuracionColumnasClientes } from 'pages/sistema/clientes/domain/configuracionColumnasClientes'
import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasTiposTareas'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

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
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'

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
    const { entidad: tipoTarea, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { onConsultado, onReestablecer } = mixin.useHooks()
    const { cargarVista, obtenerListados, setValidador } =
      mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
      })
      clientes.value = listadosAuxiliares.clientes
    })

    const rules = {
      cliente: { required },
      nombre: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, tipoTarea)
    setValidador(v$.value)

    // Filtro clientes principales
    const clientes = ref()
    function filtrarClientes(val, update) {
      if (val === '') {
        update(() => {
          clientes.value = listadosAuxiliares.clientes
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        clientes.value = listadosAuxiliares.clientes.filter(
          (v) => v.razon_social.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    return {
      // mixin
      mixin,
      tipoTarea,
      disabled,
      accion,
      v$,
      configuracionColumnas: configuracionColumnasTiposTareas,
      configuracionColumnasClientes,
      filtrarClientes,
      clientes,
    }
  },
})
