// Dependencias
import { configuracionColumnasCausaIntervencion } from '../domain/configuracionColumnasCausaIntervencion'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import useVuelidate from '@vuelidate/core'
import { defineComponent } from 'vue'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { TipoTrabajoController } from 'pages/gestionTrabajos/tiposTareas/infraestructure/TipoTrabajoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useFiltrosListadosTarea } from 'pages/gestionTrabajos/tareas/application/FiltrosListadosTarea'
import { CausaIntervencionController } from '../infraestructure/CausaIntervencionController'
import { ClienteController } from 'sistema/clientes/infraestructure/ClienteController'
import { CausaIntervencion } from '../domain/CausaIntervencion'
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
    const authenticationStore = useAuthenticationStore()

    /********
     * Mixin
     ********/
    const controller = new CausaIntervencionController()

    const mixin = new ContenedorSimpleMixin(
      CausaIntervencion,
      controller,
    )
    const { entidad: causaIntervencion, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    // const { onReestablecer } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        clientes: new ClienteController(),
        tiposTrabajos: new TipoTrabajoController(),
      })

      tiposTrabajos.value = listadosAuxiliares.tiposTrabajos
      clientes.value = listadosAuxiliares.clientes
    })

    /************
     * Variables
     ************/
    const esAdministrador = authenticationStore.esAdministrador

    /*********
    * Filtros
    **********/
    const {
      clientes,
      filtrarClientes,
      tiposTrabajos,
      filtrarTiposTrabajos,
    } = useFiltrosListadosTarea(listadosAuxiliares, causaIntervencion)

    const rules = {
      nombre: { required },
      cliente: { required },
      tipo_trabajo: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, causaIntervencion)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    // onReestablecer(() => tipoTicket.departamento = authenticationStore.user.departamento)

    return {
      v$,
      mixin,
      causaIntervencion,
      disabled,
      accion,
      configuracionColumnasCausaIntervencion,
      // filtrarDepartamentos,
      // departamentos,
      clientes,
      filtrarClientes,
      tiposTrabajos,
      filtrarTiposTrabajos,
      // categoriasTiposTickets,
      // btnToggleActivar,
      esAdministrador,
    }
  },
})
