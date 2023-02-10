// Dependencias
import { configuracionColumnasImagenesAdicionales } from '../domain/configuracionColumnasImagenesAdicionales'
import { configuracionColumnasCamposAdicionales } from '../domain/configuracionColumnasCamposAdicionales'
import { configuracionColumnasTiposTareas } from '../domain/configuracionColumnasTiposTareas'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import { accionesTabla } from 'config/utils'
import { defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { TipoTrabajoController } from '../infraestructure/TipoTrabajoController'
import { ImagenesAdicionales } from '../domain/ImagenesAdicionales'
import { CamposAdicionales } from '../domain/CamposAdicionales'
import { TipoTrabajo } from '../domain/TipoTrabajo'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      TipoTrabajo,
      new TipoTrabajoController()
    )
    const { entidad: tipoTarea, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
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
      descripcion: { required },
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
      configuracionColumnasImagenes: [...configuracionColumnasImagenesAdicionales, accionesTabla],
      configuracionColumnasCampos: [...configuracionColumnasCamposAdicionales, accionesTabla],
      configuracionColumnasTiposTareas,
      filtrarClientes,
      clientes,
      // Instanciables
      ImagenesAdicionales,
      CamposAdicionales,
    }
  },
})
