// Dependencias
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { isApiError, notificarMensajesError } from 'shared/utils'
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
import { LaboratorioClinicoController } from '../infraestructure/LaboratorioClinicoController'
import { useFiltrosListadosTickets } from 'pages/gestionTickets/tickets/application/FiltrosListadosTicket'
import { Departamento } from 'pages/recursosHumanos/departamentos/domain/Departamento'
import { LaboratorioClinico } from '../domain/LaboratorioClinico'
import { configuracionColumnasLaboratorioClinico } from '../domain/configuracionColumnasLaboratorioClinico'
import { CantonController } from 'sistema/ciudad/infraestructure/CantonControllerontroller'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

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

    // const infraestructure = new CategoriaTipoTicketController()

    /********
     * Mixin
     ********/
    const mixin = new ContenedorSimpleMixin(
      LaboratorioClinico,
      new LaboratorioClinicoController(),
    )
    const { entidad: laboratorioClinico, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()
    const { onReestablecer } = mixin.useHooks()

    cargarVista(async () => {
      await obtenerListados({
        departamentos: new DepartamentoController(),
        cantones: {
          controller: new CantonController(),
          params: {
            campos: 'id,canton',
          }
        }
      })
      // departamentos.value = listadosAuxiliares.departamentos
      // laboratorioClinico.departamento = authenticationStore.user.departamento
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
    const { cantones, filtrarCantones } = useFiltrosListadosSelects(listadosAuxiliares)

    const rules = {
      nombre: { required },
      canton: { required },
      direccion: { required },
      celular: { required },
      correo: { required },
    }

    useNotificacionStore().setQuasar(useQuasar())

    const v$ = useVuelidate(rules, laboratorioClinico)
    setValidador(v$.value)

    /********
     * Hooks
     ********/
    // onReestablecer(() => laboratorioClinico.departamento = authenticationStore.user.departamento)

    /****************
     * Botones tabla
     ****************/
    /* const btnToggleActivar: CustomActionTable = {
      titulo: ({ entidad }) => entidad.activo ? 'Deshabilitar' : 'Activar',
      icono: ({ entidad }) => entidad.activo ? 'bi-toggle2-off' : 'bi-toggle2-on',
      color: ({ entidad }) => entidad.activo ? 'negative' : 'secondary',
      accion: ({ entidad, posicion }) => {
        notificaciones.confirmar('¿Está seguro de continuar?', async () => {
          try {
            cargando.activar()
            const { response, result } = await infraestructure.editarParcial(entidad.id, { activo: !entidad.activo })
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
    } */

    return {
      v$,
      mixin,
      laboratorioClinico,
      disabled,
      accion,
      configuracionColumnasLaboratorioClinico,
      cantones,
      filtrarCantones,
      departamentos,
      // btnToggleActivar,
    }
  },
})
