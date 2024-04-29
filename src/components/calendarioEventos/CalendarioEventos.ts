import { ref, defineComponent, onMounted } from 'vue'
import {
  QCalendarMonth,
  daysBetween,
  isOverlappingDates,
  parsed,
  today,
  indexOf,
} from '@quasar/quasar-ui-qcalendar/src/index.js'
import '@quasar/quasar-ui-qcalendar/src/QCalendarVariables.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarTransitions.sass'
import '@quasar/quasar-ui-qcalendar/src/QCalendarMonth.sass'
import { EventWeek } from './domain/EventWeek'
import { EventCalendar } from './domain/EventCalendar'
import NavigationBar from './navigatorBar/NavigationBar.vue'

export default defineComponent({
  name: 'CalendarioEventos',
  components: {
    QCalendarMonth,
    NavigationBar
  },
  props: {
    eventos: {
      type: Array,
      default: Array.from([])
    },
    lenguaje: {
      type: String,
      default: 'es-ES'
    }
  },
  setup(props) {
    const refCalendar = ref()
    const selectedDate = ref(today())
    const events = ref(props.eventos)
    const lang = ref(props.lenguaje)
    const viewEvent = ref(false)
    const evento = ref({ title: '', autor: '', description: '', start: '', end: '', time: '' })
    const calendar_cargado = ref(false)


    onMounted(() => {
      calendar_cargado.value = true
    })

    const getEvent = (data) => {
      viewEvent.value = true
      evento.value.title = data.event.title
      evento.value.description = data.event.details
      evento.value.start = data.event.start
      evento.value.end = data.event.end
      evento.value.time = data.event.time
    }

    const getWeekEvents = (week) => {
      const firstDay = parsed(week[0].date + ' 00:00')
      const lastDay = parsed(week[week.length - 1].date + ' 23:59')
      const eventsWeek: EventWeek[] = []

      events.value.forEach((event: EventCalendar, id) => {
        const startDate = parsed(event.start + ' 00:00')
        const endDate = parsed(event.end + ' 23:59')

        if (isOverlappingDates(startDate, endDate, firstDay, lastDay)) {
          const left = daysBetween(firstDay, startDate, true)
          const right = daysBetween(endDate, lastDay, true)

          eventsWeek.push({
            id,
            left,
            right,
            size: week.length - (left + right),
            event
          })
        }
      })

      const eventsList = []
      if (eventsWeek.length > 0) {
        const infoWeek = eventsWeek.sort((a, b) => a.left - b.left)
        infoWeek.forEach((_, i) => {
          insertEvent(eventsList, week.length, infoWeek, i, 0, 0)
        })
      }

      return eventsList
    }

    const insertEvent = (events, weekLength, infoWeek, index, availableDays, level) => {
      const iEvent = infoWeek[index]
      if (iEvent !== undefined && iEvent.left >= availableDays) {
        if (iEvent.left - availableDays) {
          events.push({ size: iEvent.left - availableDays })
        }
        events.push({ size: iEvent.size, event: iEvent.event })

        if (level !== 0) {
          infoWeek.splice(index, 1)
        }

        const currentAvailableDays = iEvent.left + iEvent.size

        if (currentAvailableDays < weekLength) {
          const indexNextEvent = indexOf(infoWeek, e => e.id !== iEvent.id && e.left >= currentAvailableDays)

          insertEvent(
            events,
            weekLength,
            infoWeek,
            indexNextEvent !== -1 ? indexNextEvent : index,
            currentAvailableDays,
            level + 1
          )
        }
      } else {
        events.push({ size: weekLength - availableDays })
      }
    }

    const badgeClasses = (computedEvent) => {
      if (computedEvent.event !== undefined) {
        return {
          'my-event': true,
          'text-white': true,
          [`bg-${computedEvent.event.bgcolor}`]: true,
          'rounded-border': true,
          'q-calendar__ellipsis': true
        }
      }
      return {
        'my-void-event': true
      }
    }

    const badgeStyles = (computedEvent, weekLength) => {
      const s = { width: '' }
      if (computedEvent.size !== undefined) {
        s.width = `${(100 / weekLength) * computedEvent.size}%`
      }
      return s
    }

    const isBetweenDatesWeek = (dateStart, dateEnd, weekStart, weekEnd) => {
      return (
        (dateEnd < weekEnd && dateEnd >= weekStart) ||
        dateEnd === weekEnd ||
        (dateEnd > weekEnd && dateStart <= weekEnd)
      )
    }

    const onToday = () => {
      refCalendar.value.moveToToday()
    }

    const onPrev = () => {
      refCalendar.value.prev()
    }

    const onNext = () => {
      refCalendar.value.next(1)
    }

    const onMoved = (data) => {
      console.log('onMoved', data)
    }

    const onChange = (data) => {
      console.log('onChange', data)
    }

    const onClickDate = (data) => {
      console.log('onClickDate', data)
    }

    const onClickDay = (data) => {
      console.log('onClickDay', data)
    }

    const onClickWorkweek = (data) => {
      console.log('onClickWorkweek', data)
    }

    const onClickHeadDay = (data) => {
      console.log('onClickHeadDay', data)
    }

    const onClickHeadWorkweek = (data) => {
      console.log('onClickHeadWorkweek', data)
    }

    return {
      refCalendar,
      selectedDate,
      events,
      lang,
      viewEvent,
      evento,
      calendar_cargado,
      getEvent,
      getWeekEvents,
      badgeClasses,
      badgeStyles,
      isBetweenDatesWeek,
      onToday,
      onPrev,
      onNext,
      onMoved,
      onChange,
      onClickDate,
      onClickDay,
      onClickWorkweek,
      onClickHeadDay,
      onClickHeadWorkweek
    }
  }
})
