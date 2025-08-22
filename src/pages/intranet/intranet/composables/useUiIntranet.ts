// src/pages/intranet/composables/useUiIntranet.ts
import { ref, computed, onMounted, markRaw } from 'vue'
import { useQuasar } from 'quasar'
import { useMenuStore } from 'stores/menu'
import { useAuthenticationStore } from 'stores/authentication'
import { useMovilizacionSubtareaStore } from 'stores/movilizacionSubtarea'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { useRouter } from 'vue-router'
import { Vue3Lottie } from 'vue3-lottie'
import loginJson from 'src/assets/lottie/welcome.json'
import { MenuOption } from 'shared/menu/MenuOption'
import { Qalendar } from 'qalendar'
import confetti from 'canvas-confetti'
import { useNotificaciones } from 'shared/notificaciones'
import dayjsLib from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import es from 'dayjs/locale/es'
import { PushNotifications } from '@capacitor/push-notifications'
import { Capacitor } from '@capacitor/core'

//  importa y crea "modales" como en tu archivo original
import { ComportamientoModalesIntranet } from 'pages/intranet/intranet/application/ComportamientoModalesIntranet'

dayjsLib.extend(relativeTime)
dayjsLib.locale(es)

export function useUiIntranet() {
  const $q = useQuasar()
  const Router = useRouter()
  const menuStore = useMenuStore()
  const store = useAuthenticationStore() // 👈 lo devolvemos
  const movilizacionSubtareaStore = useMovilizacionSubtareaStore()
  const configuracionGeneralStore = useConfiguracionGeneralStore()
  const { notificarInformacion } = useNotificaciones()
    const modales = markRaw(new ComportamientoModalesIntranet())


  const tabsOptions = {
    NOTICIAS: 'Noticias',
    MIS_MODULOS: 'Mis módulos',
    DEPARTAMENTOS: 'Departamentos',
    EVENTOS: 'Eventos',
    AREA_PERSONAL: 'Área personal'
  }
  const tabs = ref(tabsOptions.NOTICIAS)
  const tabsMenu = [
    tabsOptions.NOTICIAS,
    tabsOptions.MIS_MODULOS,
    tabsOptions.DEPARTAMENTOS,
    tabsOptions.EVENTOS,
    tabsOptions.AREA_PERSONAL
  ]
  const activeTab = ref(0)
  const showBanner = ref(true)
  const showDepartamentos = ref(true)
  const filtrosTareas = ['Recientes', 'sdsd']
  const filtroTarea = ref('Recientes')
  const subtareasPorAsignar = ref<any[]>([])
  const usuarios = 20
  const carousel_extensiones = ref(0)
  const carousel_cumpleanos_mes = ref(1)
  const autoplay = ref(true)
  const token = ref('')

  const modulosPermitidos = ref<any[]>([])
  function obtenerModulosPermitidos() {
    modulosPermitidos.value = menuStore.links
      .filter((link: MenuOption) => link.can)
      .map(m => {
        if (m.children?.length) {
          const firstPermittedChild = m.children.find(c => c.can)
          if (firstPermittedChild) m.link = firstPermittedChild.link
        }
        return m
      })
  }
  obtenerModulosPermitidos()

  const selfCenterMiddle = computed(() =>
    $q.screen.xs ? 'center middle' : 'top start'
  )
  const width = computed(() => ($q.screen.xs ? '100%' : '450px'))

  // 👇 protege acceso cuando aún no existe store.user
  const imagenPerfil = computed(() => {
    const u = store.user ?? {
      nombres: 'U',
      apellidos: 'U',
      foto_url: null as any
    }
    return u.foto_url
      ? u.foto_url
      : `https://ui-avatars.com/api/?name=${(u.nombres || 'U').slice(0, 1)}+${(
          u.apellidos || 'U'
        ).slice(0, 1)}&bold=true&background=008000&color=ffff`
  })

  const correo = computed(
    () =>
      'https://' +
      (configuracionGeneralStore.configuracion?.sitio_web ?? '') +
      '/webmail'
  )

  const documentosIntranet = ref([
    {
      id: 1,
      name: 'Instructivos',
      icon: 'fa-solid fa-book-journal-whills',
      link: 'https://drive.google.com/drive/folders/1ILsatqtyrkV5tfofM2cTinLOfhIQMO-h?usp=drive_link',
      color: 'teal-8'
    },
    {
      id: 2,
      name: 'Reglamentos y Normativas',
      icon: 'fa-solid fa-book-bookmark',
      link: 'https://drive.google.com/drive/folders/1k7WjBVUbYf4FY5wX0xoUP8r5gvWNA64e?usp=sharing',
      color: 'teal-8'
    }
  ])

  const logoClaro = computed(
    () => configuracionGeneralStore.configuracion?.logo_claro
  )
  const logoOscuro = computed(
    () => configuracionGeneralStore.configuracion?.logo_oscuro
  )
  const enCamino = computed(() => movilizacionSubtareaStore.subtareaDestino)
  const motivo = computed(() => movilizacionSubtareaStore.motivo)
  const url_sistema = computed(
    () => configuracionGeneralStore.configuracion?.sitio_web_erp
  )
  const link_app_movil = computed(
    () => configuracionGeneralStore.configuracion?.link_app_movil
  )

  async function logout() {
    await store.logout()
    await Router.replace({ name: 'Login' })
  }

  function notificarProximamente() {
    notificarInformacion('Próximamente disponible para iOS')
  }

  function openConfetti() {
    confetti({
      zIndex: 9999,
      particleCount: 100,
      spread: 70,
      startVelocity: 30
    })
  }

  onMounted(async () => {
    if (Capacitor.isNativePlatform()) {
      const result = await PushNotifications.requestPermissions()
      if (result.receive === 'granted') PushNotifications.register()
      PushNotifications.addListener('registration', t => {
        token.value = t.value
      })
      PushNotifications.addListener('registrationError', err => {
        console.error('Registration error:', err)
      })
    }
  })

  return {
    store,
    modales,

    tabsOptions,
    tabs,
    tabsMenu,
    activeTab,
    filtrosTareas,
    filtroTarea,
    subtareasPorAsignar,
    usuarios,
    carousel_extensiones,
    carousel_cumpleanos_mes,
    autoplay,
    showBanner,
    showDepartamentos,
    modulosPermitidos,
    documentosIntranet,
    width,
    selfCenterMiddle,
    imagenPerfil,
    token,
    correo,
    logoClaro,
    logoOscuro,
    enCamino,
    motivo,
    url_sistema,
    link_app_movil,

    logout,
    notificarProximamente,
    openConfetti,

    // libs usadas en el template
    loginJson,
    //Qalendar,
    //Vue3Lottie,
    dayjs: dayjsLib
  }
}
