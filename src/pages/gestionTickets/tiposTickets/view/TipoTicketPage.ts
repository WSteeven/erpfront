// Dependencias
import { configuracionColumnasTipoTicket } from '../domain/configuracionColumnasTipoTicket'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useNotificacionStore } from 'stores/notificacion'
import { required } from 'shared/i18n-validators'
import { computed, defineComponent } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { CategoriaTipoTicketController } from 'pages/gestionTickets/categoriasTiposTickets/infraestructure/CategoriaTipoTicketController'
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { CategoriaTipoTicket } from 'pages/gestionTickets/categoriasTiposTickets/domain/CategoriaTipoTicket'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { useFiltrosListadosTickets } from 'pages/gestionTickets/tickets/application/FiltrosListadosTicket'
import { TipoTicketController } from '../infraestructure/TipoTicketController'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificaciones } from 'shared/notificaciones'
import { TipoTicket } from '../domain/TipoTicket'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

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
    const controller = new TipoTicketController()

    const mixin = new ContenedorSimpleMixin(
      TipoTicket,
      controller,
    )
    const { entidad: tipoTicket, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onReestablecer } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        departamentos: new DepartamentoController(),
        categoriasTiposTickets: new CategoriaTipoTicketController(),
      })
      departamentos.value = listadosAuxiliares.departamentos
      tipoTicket.departamento = authenticationStore.user.departamento
    })

    /************
     * Variables
     ************/
    const notificaciones = useNotificaciones()
    const categoriasTiposTickets = computed(() => listadosAuxiliares.categoriasTiposTickets.filter((tipo: CategoriaTipoTicket) => tipo.departamento_id === tipoTicket.departamento))
    const cargando = new StatusEssentialLoading()

    /****************
     * Botones tabla
     ****************/
    const btnToggleActivar: CustomActionTable = {
      titulo: ({ entidad }) => entidad.activo ? 'Deshabilitar' : 'Activar',
      icono: ({ entidad }) => entidad.activo ? 'bi-toggle2-off' : 'bi-toggle2-on',
      color: ({ entidad }) => entidad.activo ? 'negative' : 'secondary',
      accion: ({ entidad, posicion }) => {
        notificaciones.confirmar('¿Está seguro de continuar?', async () => {
          try {
            cargando.activar()
            const { response, result } = await controller.editarParcial(entidad.id, { activo: !entidad.activo })
            listado.value.splice(posicion, 1, result)
            notificaciones.notificarCorrecto(response.data.mensaje)
          } catch (e: any) {
            if (isAxiosError(e)) {
              const mensajes: string[] = e.erroresValidacion
              notificarMensajesError(mensajes, notificaciones)
            } else {
              notificaciones.notificarError(e.message)
            }
          } finally {
            cargando.desactivar()
          }
        })
      }
    }

    /*********
    * Filtros
    **********/
    const {
      filtrarDepartamentos,
      departamentos,
    } = useFiltrosListadosTickets(listadosAuxiliares)

    const rules = {
      nombre: { required },
      departamento: { required },
      categoria_tipo_ticket: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, tipoTicket)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onReestablecer(() => tipoTicket.departamento = authenticationStore.user.departamento)

    return {
      // mixin
      v$,
      mixin,
      tipoTicket,
      disabled,
      accion,
      configuracionColumnasTipoTicket,
      filtrarDepartamentos,
      // filtrarCategoriasTiposTickets,
      departamentos,
      categoriasTiposTickets,
      btnToggleActivar,
    }
  },
})
