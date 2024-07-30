import { configEssentialCalendar } from "config/essentialCalendar";
import { Evento } from "pages/intranet/eventos/domain/Evento";
import { Qalendar } from "qalendar";
import { defineComponent } from "vue";
import { CustomEvent } from "./domain/Event";

export default defineComponent({
  components: { Qalendar },
  props: {
    config: {
      type: Object,
      default: configEssentialCalendar
    },
    eventos: {
      type: Array,
      required: true
    },
  },
  emits: ['close', 'clicked-event', 'dragged-event', 'resized-event', 'edit-event', 'delete-event'],
  setup(props, { emit }) {

    function cerrar() {
      emit('close')
    }

    const events = props.eventos.map((evento: Evento) => {
      const event: CustomEvent = {
        id: evento.id,
        title: evento.titulo,
        with: evento.anfitrion,
        time: {
          start: evento.fecha_hora_inicio,
          end: evento.fecha_hora_fin,
        },
        colorScheme: evento.colorScheme,
        isEditable: evento.es_editable,
        isCustom: evento.es_personalizado,
        description: evento.descripcion,
      }
      return event
    })

    const config = {
      locale: 'es-ES',
      defaultMode: 'month',
      dayIntervals: {
        length: 60,
        height: 50,
        displayClickableInterval: true
      },
      style: {
        colorSchemes: {
          capacitaciones: {
            color: 'white',
            backgroundColor: 'green'
          },
          reuniones: {
            color: 'white',
            backgroundColor: 'blue'
          },
          general: {
            color: 'white',
            backgroundColor: 'orange'
          }
        }
      }
    }

    return {
      events, config,
      cerrar,
    }
  }

})
