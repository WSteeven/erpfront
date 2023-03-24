// Dependencias
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
import { MovilizacionSubtareaController } from '../infraestructure/MovilizacionSubtareaController'
import { MovilizacionSubtarea } from '../domain/MovilizacionSubtarea'
import { TrabajoAsignadoController } from 'pages/gestionTrabajos/trabajoAsignado/infraestructure/TrabajoAsignadoController'
import { useMovilizacionSubtareaStore } from 'stores/movilizacionSubtarea'
import { useAuthenticationStore } from 'stores/authentication'

export default defineComponent({
  components: {
    TabLayout,
    EssentialTable,
  },
  setup() {
    /*********
     * Stores
     *********/
    const movilizacionSubtareaStore = useMovilizacionSubtareaStore()
    const authenticationStore = useAuthenticationStore()
    useNotificacionStore().setQuasar(useQuasar())

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(
      MovilizacionSubtarea,
      new MovilizacionSubtareaController()
    )
    const { entidad: movilizacion, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { cargarVista, obtenerListados, setValidador, guardar } =
      mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        subtareas: new TrabajoAsignadoController(),
      })
      subtareas.value = listadosAuxiliares.subtareas
    })

    /***************
     * Validaciones
     ***************/
    const rules = {
      subtarea: { required },
    }


    const v$ = useVuelidate(rules, movilizacion)
    setValidador(v$.value)

    // Filtro clientes principales
    const subtareas = ref()
    function filtrarSubtareas(val, update) {
      if (val === '') {
        update(() => {
          subtareas.value = listadosAuxiliares.clientes
        })
        return
      }
      update(() => {
        const needle = val.toLowerCase()
        subtareas.value = listadosAuxiliares.subtareas.filter(
          (v) => v.codigo_subtarea.toLowerCase().indexOf(needle) > -1
        )
      })
    }

    async function comenzar() {
      const entidad = await guardar(movilizacion)
      if (entidad) movilizacionSubtareaStore.getSubtareaDestino(authenticationStore.user.id)
    }

    return {
      // mixin
      mixin,
      movilizacion,
      disabled,
      accion,
      v$,
      filtrarSubtareas,
      subtareas,
      comenzar,
    }
  },
})
