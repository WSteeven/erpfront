import { Qalendar } from 'qalendar';
import { defineComponent, reactive, ref, onMounted, watch } from 'vue';
import axios from 'axios';
import Modal from '../components/calendarioEventos/Modal.vue';
import { Evento } from '../domain/Evento';
import { EventoController } from '../infraestructure/EventoController';
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { useAuthenticationStore } from 'stores/authentication';
import EssentialCalendar from 'components/qalendar/EssentialCalendar.vue';
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue';
import { acciones } from '../../../../config/utils';
import { useCargandoStore } from 'stores/cargando';
import { TipoEventoController } from 'pages/intranet/tiposEventos/infraestructure/TipoEventoController';

interface Event {
  title: string;
  with: string;
  time: {
    start: string;
    end: string;
  };
  colorScheme: string;
  isEditable: boolean;
  isCustom: boolean;
  id: string;
  description: string;
}

export default defineComponent({
  components: { EssentialCalendar, ButtonSubmits },
  setup() {
    const mixin = new ContenedorSimpleMixin(Evento, new EventoController())
    const { entidad: evento, disabled, accion, listado, listadosAuxiliares } = mixin.useReferencias()
    const { setValidador, cargarVista, obtenerListados, listar, editar, guardar, eliminar, reestablecer } = mixin.useComportamiento()
    const { onReestablecer, onConsultado } = mixin.useHooks()
    const store = useAuthenticationStore()

    const eventos = ref([])
    const events = reactive<Event[]>([]);

    const newEvent = reactive<Event>({
      title: '',
      with: store.nombreUsuario,
      time: { start: '', end: '' },
      colorScheme: '',
      isEditable: true,
      isCustom: true,
      id: '',
      description: '',
    });

    cargarVista(async ()=>{
      await obtenerListados({
        tipos: new TipoEventoController()
      })

      
    })

    const showStartDatePicker = ref(false);
    const showEndDatePicker = ref(false);

    const startDate = ref('');
    const startTime = ref('');
    const endDate = ref('');
    const endTime = ref('');

    watch([startDate, startTime], () => {
      newEvent.time.start = `${startDate.value}T${startTime.value}`;
    });

    watch([endDate, endTime], () => {
      newEvent.time.end = `${endDate.value}T${endTime.value}`;
    });

    function formatDateString(dateString: string): string {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    // Ejemplo de cómo usar la función
    const formattedStartDate = formatDateString(newEvent.time.start);
    const formattedEndDate = formatDateString(newEvent.time.end);


    const updateStartDate = (val: string) => {
      startDate.value = val;
    };

    const updateStartTime = (val: string) => {
      startTime.value = val;
    };

    const updateEndDate = (val: string) => {
      endDate.value = val;
    };

    const updateEndTime = (val: string) => {
      endTime.value = val;
    };

    const config = {
      locale: 'es-ES',
      defaultMode: 'month',
      dayIntervals: {
        length: 60,
        height: 50,
        displayClickableInterval: true,
      },
      style: {
        colorSchemes: {
          capacitaciones: {
            color: 'white',
            backgroundColor: 'green',
          },
          reuniones: {
            color: 'white',
            backgroundColor: 'blue',
          },
          general: {
            color: 'white',
            backgroundColor: 'orange',
          },
        },
      },
    };

    function resetNewEvent() {
      newEvent.title = '';
      newEvent.with = store.nombreUsuario;
      newEvent.time.start = '';
      newEvent.time.end = '';
      newEvent.colorScheme = '';
      newEvent.isEditable = true;
      newEvent.isCustom = false;
      newEvent.id = '';
      newEvent.description = '';
    }

    const updateStartDateTime = (payload: any) => {
      const { year, month, date, hours, minutes } = payload;
      startDate.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      startTime.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const confirmStartDateTime = () => {
      showStartDatePicker.value = false;
    };

    const updateEndDateTime = (payload: any) => {
      const { year, month, date, hours, minutes } = payload;
      endDate.value = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
      endTime.value = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    };

    const confirmEndDateTime = () => {
      showEndDatePicker.value = false;
    };

    function validateEvent(event: Event) {
      if (!event.title) {
        alert('El título es obligatorio.');
        return false;
      }
      if (!event.time.start || !event.time.end) {
        alert('Las horas de inicio y fin son obligatorias.');
        return false;
      }
      if (new Date(event.time.start) >= new Date(event.time.end)) {
        alert('La hora de inicio debe ser anterior a la hora de fin.');
        return false;
      }
      return true;
    }

    async function loadEvents() {
      try {
        const response = await axios.get('/events.json');
        events.push(...response.data);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    }

    async function saveEvents() {
      try {
        await axios.post('/events.json', events);
      } catch (error) {
        console.error('Error saving events:', error);
      }
    }

    function addEvent(event: SubmitEvent) {
      event.preventDefault();
      if (!validateEvent(newEvent)) {
        return;
      }
      // Generar un ID único para el nuevo evento
      newEvent.id = new Date().getTime().toString();

      // Convertir las fechas al formato deseado
      const formattedStartTime = formatDateString(newEvent.time.start);
      const formattedEndTime = formatDateString(newEvent.time.end);

      // Crear un nuevo evento con las fechas formateadas
      const eventToAdd = {
        ...newEvent,
        time: {
          start: formattedStartTime,
          end: formattedEndTime,
        },
      };
      console.log('Añadiendo evento:', JSON.parse(JSON.stringify(eventToAdd))); // Depuración
      events.push(eventToAdd);
      saveEvents();
      resetNewEvent();
    }

    function editEvent(eventToEdit: Event) {
      const index = events.findIndex((e) => e.id === eventToEdit.id);
      if (index !== -1) {
        events[index] = { ...eventToEdit };
        saveEvents();
      }
    }

    function deleteEvent(event: Event) {
      const index = events.findIndex((e) => e.id === event.id);
      if (index !== -1) {
        events.splice(index, 1);
        saveEvents();
      }
    }

    onMounted(loadEvents);

    return {
      evento, accion, listado,
      config,
      events,
      newEvent,
      showStartDatePicker,
      showEndDatePicker,
      startDate,
      startTime,
      endDate,
      endTime,
      editar, guardar, eliminar, reestablecer,
      updateStartDate,
      updateStartTime,
      updateEndDate,
      updateEndTime,
      confirmStartDateTime,
      confirmEndDateTime,
      addEvent,
      editEvent,
      deleteEvent,
      updateStartDateTime,
      updateEndDateTime,
      acciones,
      storeCargando: useCargandoStore(),
      formattedStartDate,
      formattedEndDate,


    };
  },
})
