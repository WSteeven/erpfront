// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { required } from 'shared/i18n-validators'
import { defineComponent, reactive, ref } from 'vue'
import { useTicketStore } from 'stores/ticket'
import useVuelidate from '@vuelidate/core'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import DetalleTicket from 'ticketsAsignados/modules/detalleTicketAsignado/view/DetalleTicket.vue'

// Logica y controladores
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosTickets } from '../../application/FiltrosListadosTicket'
import { useAuthenticationStore } from 'stores/authentication'
import { estadosTickets } from 'config/tickets.utils'
import { Ticket } from '../../domain/Ticket'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'

export default defineComponent({
  components: {
    EssentialTable,
    DetalleTicket,
  },
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Ticket>,
      required: true,
    },
    accion: {
      type: Function,
      required: true,
    }
  },
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    /*********
    * Stores
    *********/
    const ticketStore = useTicketStore()
    const authenticationStore = useAuthenticationStore()

    /*******
    * Mixin
    ********/
    const { entidad: ticket, listadosAuxiliares, listado } = props.mixinModal.useReferencias()
    const { cargarVista, obtenerListados, consultar } = props.mixinModal.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        empleados: [],
        departamentos: new DepartamentoController(),
        empleadosOrigen: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', estado: 1 },
        },
      })
    })

    /************
     * Variables
    ************/
    const { confirmar, notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    // const ticket = ticketStore.filaTicket
    const reagendar = reactive({
      responsable: null,
      departamento_responsable: null,
    })

    /***************
     * Validaciones
     ***************/
    const reglas = {
      responsable: { required },
      departamento_responsable: { required },
    }
    const v$ = useVuelidate(reglas, reagendar)

    /************
    * Funciones
    ************/
    const { empleadosOrigen, filtrarEmpleadosOrigen } = useFiltrosListadosSelects(listadosAuxiliares)

    const {
      empleados,
      filtrarEmpleados,
      departamentos,
      filtrarDepartamentos,
    } = useFiltrosListadosTickets(listadosAuxiliares)

    async function obtenerResponsables(departamento: number) {
      await obtenerListados({
        empleados: {
          controller: new EmpleadoController(),
          params: { campos: 'id,nombres,apellidos', departamento_id: departamento, estado: 1 }
        },
      })
      empleados.value = listadosAuxiliares.empleados
    }

    const cargando = new StatusEssentialLoading()

    async function cambiar() {
      if (await v$.value.$validate()) {
        try {
          confirmar('¿Está seguro de continuar?', async () => {
            cargando.activar()
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.cambiar_responsable_ticket) + '/' + ticket.id
            const response: AxiosResponse = await axios.post(ruta, {
              departamento_responsable: reagendar.departamento_responsable,
              responsable: reagendar.responsable,
              cc: ticket.cc,
            })

            // Es el solicitante asigna
            if (authenticationStore.user.id === ticketStore.filaTicket.solicitante_id) {
              props.accion(estadosTickets.ASIGNADO)
            } else {
              // Es el responsable actual transfiere
              listado.value.splice(ticketStore.posicionFilaTicket, 1)
            }

            notificarCorrecto(response.data.mensaje)
            cargando.desactivar()
            emit('cerrar-modal', false)
          })
        } catch (e: any) {
          notificarAdvertencia(e)
        } finally {
          cargando.desactivar()
        }
      }
    }

    function cancelar() {
      emit('cerrar-modal', false)
    }

    /*******
     * Init
     *******/
    if (ticketStore.filaTicket.id) consultar({ id: ticketStore.filaTicket.id })

    return {
      v$,
      reagendar,
      ticket,
      cambiar,
      cancelar,
      empleados,
      filtrarEmpleados,
      departamentos,
      filtrarDepartamentos,
      obtenerResponsables,
      modificarCc: ref(false),
      empleadosOrigen,
      filtrarEmpleadosOrigen,
    }
  }
})
