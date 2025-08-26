import { ref } from 'vue'
import { VacanteController } from 'pages/recursosHumanos/SeleccionContratacionPersonal/vacantes/infraestructure/VacanteController'
import { obtenerFechaActual } from 'shared/utils'
import { maskFecha } from 'src/config/utils'
import { useRouter } from 'vue-router'
import { useNotificaciones } from 'shared/notificaciones'

export function useVacantesIntranet() {
  const vacantesDisponibles = ref<any[]>([])
  const router = useRouter()
  const { notificarError } = useNotificaciones()

  async function obtenerVacantes() {
    try {
      vacantesDisponibles.value = (await new VacanteController().listar({
        activo: 1,
        'fecha_caducidad[operator]': '>=',
        'fecha_caducidad[value]': obtenerFechaActual(maskFecha)
      })).result
    } catch {
      notificarError('Error al obtener las vacantes disponibles')
    }
  }

  async function visualizarVacante() {
    await router.push('puestos-disponibles')
  }

  obtenerVacantes()

  return { vacantesDisponibles, obtenerVacantes, visualizarVacante }
}
