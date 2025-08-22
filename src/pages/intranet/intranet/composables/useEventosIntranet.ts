import { ref, computed, onMounted } from 'vue'
import { EventoController } from 'pages/intranet/eventos/infraestructure/EventoController'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'

export function useEventosIntranet() {
  const eventos = ref<any[]>([])
  const eventoSeleccionado = ref<any | null>(null)
  const dialogoVisible = ref(false)
  const cargando = new StatusEssentialLoading()

  const esquemasColores: Record<number, 'capacitaciones'|'reunion'|'general'> = {
    1: 'capacitaciones',
    2: 'reunion',
    3: 'general'
  }

  const eventosFormateados = computed(() =>
    eventos.value
      .map(e => (!e.fecha_hora_inicio || !e.fecha_hora_fin) ? null : ({
        id: e.id,
        title: e.titulo,
        autor: e.anfitrion_id,
        description: e.descripcion,
        colorScheme: (esquemasColores as any)[e.tipo_evento_id] || 'general',
        time: { start: e.fecha_hora_inicio, end: e.fecha_hora_fin },
        data: e
      }))
      .filter(Boolean) as any[]
  )

  const configuracion = ref({
    week: { startsOn: 'monday', nDays: 7, scrollToHour: 24 },
    month: { showTrailingAndLeadingDates: false },
    locale: 'es-ES',
    style: {
      fontFamily: 'Nunito, sans-serif',
      color: 'blue',
      colorSchemes: {
        capacitaciones: { color: 'white', backgroundColor: 'orange' },
        reunion: { color: 'white', backgroundColor: 'yellow' },
        general: { color: 'white', backgroundColor: 'orange' }
      }
    },
    defaultMode: 'month',
    isSilent: true,
    showCurrentTime: true
  })

  function verEvento(evt: any) {
    eventoSeleccionado.value = evt.data
    dialogoVisible.value = true
  }

  async function obtenerEventos() {
    cargando.activar()
    try {
      const response = await new EventoController().listar()
      eventos.value = response.result
    } catch (e) {
      console.error('Error al obtener eventos:', e)
    } finally {
      cargando.desactivar()
    }
  }

  onMounted(obtenerEventos)

  return {
    eventos,
    eventoSeleccionado,
    dialogoVisible,
    eventosFormateados,
    configuracion,
    verEvento,
    obtenerEventos
  }
}
