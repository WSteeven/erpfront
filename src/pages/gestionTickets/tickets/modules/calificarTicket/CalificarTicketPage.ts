// Dependencias
import { useNotificaciones } from 'shared/notificaciones'
import { required } from 'shared/i18n-validators'
import { computed, defineComponent, reactive } from 'vue'
import { useTicketStore } from 'stores/ticket'
import useVuelidate from '@vuelidate/core'

// Componentes
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import DetalleTicket from 'ticketsAsignados/modules/detalleTicketAsignado/view/DetalleTicket.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CambiarEstadoTicket } from '../../application/CambiarEstadoTicket'
import { useAuthenticationStore } from 'stores/authentication'
import { Ticket } from '../../domain/Ticket'

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

    /************
     * Variables
    ************/
    const { confirmar, notificarCorrecto, notificarAdvertencia } = useNotificaciones()
    const ticket = ticketStore.filaTicket
    const calificar = reactive({
      observacion: null,
      calificacion: 1,
      solicitante_o_responsable: '',
    })
    const labelCalificacion = computed(() => {
      switch (calificar.calificacion) {
        case 1: return '« Malo »'
        case 2: return '« Aceptable »'
        case 3: return '« Bueno »'
        case 4: return '« Excelente »'
      }
    })

    /***************
     * Validaciones
     ***************/
    const reglas = {
      observacion: { required },
    }
    const v$ = useVuelidate(reglas, calificar)

    /************
    * Funciones
    ************/


    async function enviarCalificacion() {
      if (await v$.value.$validate()) {
        try {

          confirmar('¿Está seguro de continuar?', async () => {
            const cambiarEstado = new CambiarEstadoTicket()
            if (ticket.id) {
              console.log(ticket)
              calificar.solicitante_o_responsable = authenticationStore.user.id === ticket.solicitante_id ? 'SOLICITANTE' : 'RESPONSABLE'
              const { response } = await cambiarEstado.calificar(ticket.id, calificar)
              notificarCorrecto(response.data.mensaje)
            }
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
      calificar,
      ticket,
      enviarCalificacion,
      cancelar,
      labelCalificacion,
    }
  }
})
