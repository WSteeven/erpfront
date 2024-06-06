// Dependencias
import { configuracionColumnasCategoriaTipoTicket } from '../domain/configuracionColumnasCategoriaTipoTicket'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { isAxiosError, notificarMensajesError } from 'shared/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { useNotificacionStore } from 'stores/notificacion'
import { useNotificaciones } from 'shared/notificaciones'
import { required } from 'shared/i18n-validators'
import { computed, defineComponent } from 'vue'
import useVuelidate from '@vuelidate/core'
import { useQuasar } from 'quasar'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { DepartamentoController } from 'recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { useFiltrosListadosTickets } from 'pages/gestionTickets/tickets/application/FiltrosListadosTicket'
import { CategoriaTipoTicketController } from '../infraestructure/CategoriaTipoTicketController'
import { Departamento } from 'pages/recursosHumanos/departamentos/domain/Departamento'
import { CategoriaTipoTicket } from '../domain/CategoriaTipoTicket'

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

    const controller = new CategoriaTipoTicketController()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(
      CategoriaTipoTicket,
      controller,
    )
    const { entidad: tipoTicket, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onReestablecer } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        departamentos: new DepartamentoController(),
      })
      // departamentos.value = listadosAuxiliares.departamentos
      tipoTicket.departamento = authenticationStore.user.departamento
    })

    const departamentos = computed(() => listadosAuxiliares.departamentos.filter((departamento: Departamento) => {
      if (authenticationStore.esAdministrador) {
        return true
      } else {
        // return departamento.id === authenticationStore.user.departamento
        return departamento.responsable_id === authenticationStore.user.id
      }
    }))

    const notificaciones = useNotificaciones()
    const cargando = new StatusEssentialLoading()

    /*********
    * Filtros
    **********/
    const {
      filtrarDepartamentos,
      // departamentos,
    } = useFiltrosListadosTickets(listadosAuxiliares)

    const rules = {
      nombre: { required },
      departamento: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, tipoTicket)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    onReestablecer(() => tipoTicket.departamento = authenticationStore.user.departamento)

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

    return {
      v$,
      mixin,
      tipoTicket,
      disabled,
      accion,
      configuracionColumnasCategoriaTipoTicket,
      filtrarDepartamentos,
      departamentos,
      btnToggleActivar,
    }
  },
})
