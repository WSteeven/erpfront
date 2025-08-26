import { defineComponent, ref, reactive } from 'vue'

// composables (tu carpeta)
import { useUiIntranet } from 'pages/intranet/intranet/composables/useUiIntranet'
import { useEventosIntranet } from 'pages/intranet/intranet/composables/useEventosIntranet'
import { useNoticiasIntranet } from 'pages/intranet/intranet/composables/useNoticiasIntranet'
import { useEmpleadosIntranet } from 'pages/intranet/intranet/composables/useEmpleadosIntranet'
import { useVacantesIntranet } from 'pages/intranet/intranet/composables/useVacantesIntranet'

// componentes que ya usabas
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SolicitarFecha from 'shared/prompts/SolicitarFecha.vue'
import { Qalendar } from 'qalendar'
import { Vue3Lottie as LottiePlayer } from 'vue3-lottie'

import { useRouter } from 'vue-router'
import { useNotificaciones } from 'shared/notificaciones'


export default defineComponent({
  name: 'intranet_page',
  components: { ModalesEntidad, SolicitarFecha, Qalendar, LottiePlayer },
  setup() {
    const ui = useUiIntranet()
    const ev = useEventosIntranet()
    const nt = useNoticiasIntranet()
    const emp = useEmpleadosIntranet()
    const vac = useVacantesIntranet()

    const solicitud = reactive({ tipo_solicitud: '', descripcion: '' })
    const tiposSolicitudes = ref([
      { label: 'Permisos', value: 'permiso' },
      { label: 'Licencias', value: 'licencias' },
      { label: 'Vacaciones', value: 'vacaciones' },
      { label: 'Prestamos', value: 'prestamos' }
    ])

    const router = useRouter()
    const { notificarError } = useNotificaciones()
    const enviarSolicitud = () => {
      switch (solicitud.tipo_solicitud) {
        case 'permiso': router.push('/permiso-nomina'); break
        case 'licencias': router.push('/licencia-empleado'); break
        case 'vacaciones': router.push('/solicitudes-vacaciones'); break
        case 'prestamos': router.push('/solicitud-prestamo-empresarial'); break
        default: notificarError('Solicitud Rechazada, contacta con el Administrador.')
      }
    }

    return {
      ...ui,     // 👈 aquí vienen `store` y `modales` ahora
      ...ev,
      ...nt,
      ...emp,
      ...vac,
      tiposSolicitudes,
      solicitud,
      enviarSolicitud
    }
  }
})

