// Dependencias
import { AxiosHttpRepository } from 'shared/http/infraestructure/AxiosHttpRepository'
import { useNotificaciones } from 'shared/notificaciones'
import { required } from 'shared/i18n-validators'
import { defineComponent, reactive } from 'vue'
import { useTicketStore } from 'stores/ticket'
import useVuelidate from '@vuelidate/core'
import { endpoints } from 'config/api'
import { AxiosResponse } from 'axios'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { EmpleadoController } from 'recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useFiltrosListadosTickets } from '../../application/FiltrosListadosTicket'
import { Ticket } from '../../domain/Ticket'

export default defineComponent({
  components: {
    EssentialTable,
  },
  props: {
    mixinModal: {
      type: Object as () => ContenedorSimpleMixin<Ticket>,
      required: true,
    },
  },
  emits: ['cerrar-modal', 'guardado'],
  setup(props, { emit }) {
    /*********
    * Stores
    *********/
    const ticketStore = useTicketStore()

    /*******
    * Mixin
    ********/
    const { listadosAuxiliares, listado } = props.mixinModal.useReferencias()
    const { cargarVista, obtenerListados } = props.mixinModal.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        empleados: [],
      })
    })

    /************
     * Variables
    ************/
    const { confirmar, notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    const ticket = ticketStore.filaTicket
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
          params: { campos: 'id,nombres,apellidos', departamento_id: departamento }
        },
      })
      empleados.value = listadosAuxiliares.empleados
    }

    async function cambiar() {
      if (await v$.value.$validate()) {
        try {
          confirmar('¿Está seguro de continuar?', async () => {
            const axios = AxiosHttpRepository.getInstance()
            const ruta = axios.getEndpoint(endpoints.cambiar_responsable_ticket) + '/' + ticket.id
            const response: AxiosResponse = await axios.post(ruta, {
              departamento_responsable: reagendar.departamento_responsable,
              responsable: reagendar.responsable,
            })

            const anterior = listado.value[ticketStore.posicionFilaTicket]
            anterior.departamento_responsable = response.data.modelo.departamento_responsable
            anterior.responsable = response.data.modelo.responsable
            listado.value.splice(ticketStore.posicionFilaTicket, 1, anterior)
            notificarCorrecto(response.data.mensaje)
            emit('cerrar-modal', false)
          })
        } catch (e: any) {
          notificarAdvertencia(e)
        }
      }
    }

    function cancelar() {
      emit('cerrar-modal', false)
    }

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
    }
  }
})
