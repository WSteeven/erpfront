import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin"
import { defineComponent, ref } from "vue"
import { EventoController } from "../infraestructure/EventoController"
import { Evento } from "../domain/Evento"
import CalendarioEventos from 'components/calendarioEventos/CalendarioEventos.vue'
import {
  parseDate,
} from '@quasar/quasar-ui-qcalendar/src/index.js'


export default defineComponent({
  components: {
    CalendarioEventos
  },
  setup(){

    /***********
     * Mixin
     ************/
    const mixin = new ContenedorSimpleMixin(
      Evento,new EventoController(),
    )

    const {
      entidad: evento,
      disabled,
      accion,
      listadosAuxiliares,
    } = mixin.useReferencias()
    const { setValidador, obtenerListados, cargarVista } =
      mixin.useComportamiento()

      const splitterModel= ref(50)
      const date= ref('2019/02/01')
      const events= ref([ '2019/02/01', '2019/02/05', '2019/02/06' ])
      const tiposEvento=ref( ['Cumpleaños', 'Capacitaciones'])

      function agregarEvento() {
        // Validación de datos del evento

        };

        const CURRENT_DAY = new Date()
    function getCurrentDay(day) {
      const newDay = new Date(CURRENT_DAY)
      newDay.setDate(day)
      const tm = parseDate(newDay)
      return tm.date
    }
    const eventos = ref([
      {
        id: 1,
        title: '1st of the Month',
        details: 'Everything is funny as long as it is happening to someone else',
        start: getCurrentDay(1),
        end: getCurrentDay(1),
        bgcolor: 'orange'
      },
      {
        id: 2,
        title: 'Sisters Birthday',
        details: 'Buy a nice present',
        start: getCurrentDay(4),
        end: getCurrentDay(4),
        bgcolor: 'green',
        icon: 'fas fa-birthday-cake'
      },
      {
        id: 3,
        title: 'Meeting',
        details: 'Time to pitch my idea to the company',
        start: getCurrentDay(10),
        end: getCurrentDay(10),
        time: '10:00',
        duration: 120,
        bgcolor: 'red',
        icon: 'fas fa-handshake'
      },
      {
        id: 4,
        title: 'Lunch',
        details: 'Company is paying!',
        start: getCurrentDay(10),
        end: getCurrentDay(10),
        time: '11:30',
        duration: 90,
        bgcolor: 'teal',
        icon: 'fas fa-hamburger'
      },
      {
        id: 5,
        title: 'Visit mom',
        details: 'Always a nice chat with mom',
        start: getCurrentDay(20),
        end: getCurrentDay(20),
        time: '17:00',
        duration: 90,
        bgcolor: 'grey',
        icon: 'fas fa-car'
      },
      {
        id: 6,
        title: 'Conference',
        details: 'Teaching Javascript 101',
        start: getCurrentDay(22),
        end: getCurrentDay(22),
        time: '08:00',
        duration: 540,
        bgcolor: 'blue',
        icon: 'fas fa-chalkboard-teacher'
      },
      {
        id: 7,
        title: 'Girlfriend',
        details: 'Meet GF for dinner at Swanky Restaurant',
        start: getCurrentDay(22),
        end: getCurrentDay(22),
        time: '19:00',
        duration: 180,
        bgcolor: 'teal',
        icon: 'fas fa-utensils'
      },
      {
        id: 8,
        title: 'Rowing',
        details: 'Stay in shape!',
        start: getCurrentDay(27),
        end: getCurrentDay(28),
        bgcolor: 'purple',
        icon: 'rowing'
      },
      {
        id: 9,
        title: 'Fishing',
        details: 'Time for some weekend R&R',
        start: getCurrentDay(22),
        end: getCurrentDay(29),
        bgcolor: 'purple',
        icon: 'fas fa-fish'
      },
      {
        id: 10,
        title: 'Vacation',
        details: 'Trails and hikes, going camping! Don\'t forget to bring bear spray!',
        start: getCurrentDay(22),
        end: getCurrentDay(29),
        bgcolor: 'purple',
        icon: 'fas fa-plane'
      }
    ])


      return{
        eventos,
        mixin,
        evento,
        splitterModel,
        date,
        events,
        tiposEvento,
        agregarEvento,
      }
  },

})
