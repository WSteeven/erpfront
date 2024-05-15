// Dependencias
import { useAuthenticationStore } from 'stores/authentication'
import loginJson from 'src/assets/lottie/welcome.json'
import { Ref, computed, defineComponent, onMounted, reactive, ref } from 'vue'

// Componentes
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SolicitarFecha from 'shared/prompts/SolicitarFecha.vue'
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'

// Logica y controladores
import { ComportamientoModalesIntranet } from '../application/ComportamientoModalesIntranet'
import { useNotificaciones } from 'shared/notificaciones'
import { Departamento } from 'pages/recursosHumanos/departamentos/domain/Departamento'
import { DepartamentoController } from 'pages/recursosHumanos/departamentos/infraestructure/DepartamentoController'
import { Empleado } from 'pages/recursosHumanos/empleados/domain/Empleado'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useConfiguracionGeneralStore } from 'stores/configuracion_general'
import { useMovilizacionSubtareaStore } from 'stores/movilizacionSubtarea'
import { ComputedRef } from 'vue'
import { useQuasar } from 'quasar'
import { StatusEssentialLoading } from 'components/loading/application/StatusEssentialLoading'
import { useRouter } from 'vue-router'



export default defineComponent({
    components: {
        ModalesEntidad,
        LottiePlayer: Vue3Lottie,
        SolicitarFecha,

    },
    setup() {
        const timeStamp = Date.now()

        const departamentoSeleccionado = ref('')
        const empleados: Ref<Empleado[]> = ref([])
        const departamentos: Ref<Departamento[]> = ref([])
        const usuarios = 20
        const slide = ref(1)
        const search = ref()
        const autoplay = ref(true)
        const date = ref(timeStamp)
        const $q = useQuasar()
        const modulosPermitidos = ref([])

        const showBanner = ref(false)
        const showDepartamentos = ref(false)
        /*********
         * Stores
        *********/
        const cargando = new StatusEssentialLoading()
        const store = useAuthenticationStore()
        const movilizacionSubtareaStore = useMovilizacionSubtareaStore()
        const configuracionGeneralStore = useConfiguracionGeneralStore()

        const Router = useRouter()
        const filtrosTareas = ['Recientes', 'sdsd']
        const filtroTarea = ref('Recientes')

        const subtareasPorAsignar = ref([])

        const imagenPerfil = `https://ui-avatars.com/api/?name=${store.user.nombres.substr(0, 1)}+${store.user.apellidos.substr(0, 1)}&bold=true&background=0879dc28&color=0879dc`

        const lorem =
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
        const tipoSolicitud = ref('')
        const descripcion = ref('')
        const tiposSolicitudes = ref([
            { label: 'Vacaciones', value: 'vacaciones' },
            { label: 'Enfermedad', value: 'enfermedad' },
            { label: 'Licencia de trabajo', value: 'licencia' },
        ])
        const solicitud = reactive({
            tipo_solicitud: '',
            descripcion: ''
        })

        type tipo = 'center middle' | 'top start'
        const selfCenterMiddle: ComputedRef<tipo> = computed(() =>
            $q.screen.xs ? 'center middle' : 'top start'
        )

        const modales = new ComportamientoModalesIntranet()

        const eventos = [
            '2024/05/01',
            '2024/05/05',
            '2024/05/06',
            '2024/05/09',
            '2024/05/23',
        ]
        const data = ref([
            {
                imagen: 'https://cdn.quasar.dev/img/mountains.jpg',
                titulo: 'noticia 1',
                autor: 'autor',
                descripcion: lorem,
            },
            {
                imagen: 'https://cdn.quasar.dev/img/mountains.jpg',
                titulo: 'noticia 2',
                autor: 'autor',
                descripcion: lorem,
            },
            {
                imagen: 'https://cdn.quasar.dev/img/mountains.jpg',
                titulo: 'noticia 3',
                autor: 'autor',
                descripcion: lorem,
            },
            {
                imagen: 'https://cdn.quasar.dev/img/mountains.jpg',
                titulo: 'noticia 4',
                autor: 'autor',
                descripcion: lorem,
            },
            {
                imagen: 'https://cdn.quasar.dev/img/mountains.jpg',
                titulo: 'noticia 5',
                autor: 'autor',
                descripcion: lorem,
            },
        ])
        const currentPage = ref(1) // Current page number (starts at 1)
        const perPage = ref(2) // Number of cards per page
        const displayedCards = computed(() => {
            const start = (currentPage.value - 1) * perPage.value
            const end = start + perPage.value
            return data.value.slice(start, end)
        })
        function obtenerModulosPermitidos() {
            const regex = /\bmodulo_\w+\b/g
            const modulos = store.user.permisos.filter((permiso) => regex.test(permiso))
            modulosPermitidos.value = modulos.map(permiso => permiso.replace('puede.ver.modulo_', '').split('_').join(' '));
        }

        obtenerModulosPermitidos()

        function goToModule(modulo) {
            console.log('Diste click en ', modulo);
        }
        async function logout() {
            cargando.activar()
            await store.logout()
            Router.replace({ name: 'Login' })
            cargando.desactivar()
        }
        async function consultarEmpleadosDepartamento(departamento_id: number) {
            console.log(store)
            try {
                cargando.activar()
                const empleadoController = new EmpleadoController()
                empleados.value = (await empleadoController.listar({ departamento_id: departamento_id, estado: 1 })).result
                console.log(empleados.value)
            } catch (err) {
                console.log(err)
            } finally {
                cargando.desactivar()
            }
        }

        onMounted(async () => {
            const departamentoController = new DepartamentoController()
            departamentos.value = (await departamentoController.listar({ activo: 1 })).result
            showDepartamentos.value = true
            setTimeout(() => {
                showBanner.value = true;
            }, 10000);
        }),


        function openWhatsApp(numero) {
            window.location.href = `https://wa.me/${numero}`;
        }

        /**
         * Funcion para probar componente de fecha enviando al backend
         */
        const { confirmar } = useNotificaciones()

        function verEvento(date) {
            const result = eventos.filter((evento) => evento === date)
            if (result.length > 0) {
                modales.abrirModalEntidad('VisualizarEventoPage')
            }
        }

        function enviarSolicitud() {
            // Aquí puedes implementar la lógica para enviar la solicitud
            console.log('Solicitud enviada:', {
                tipo: tipoSolicitud,
                descripcion: descripcion,
            })
        }
        function limpiarFormulario() {
            solicitud.tipo_solicitud = ''
            solicitud.descripcion = ''
        }

        // Establecer favicon
        configuracionGeneralStore.consultarConfiguracion().then(() =>
            configuracionGeneralStore.cambiarFavicon())

        return {
            logoClaro: computed(() => configuracionGeneralStore.configuracion?.logo_claro),
            logoOscuro: computed(() => configuracionGeneralStore.configuracion?.logo_oscuro),
            enCamino: computed(() => movilizacionSubtareaStore.subtareaDestino),
            motivo: computed(() => movilizacionSubtareaStore.motivo),
            mostrarMenu: ref(false),
            store,
            usuarios,
            loginJson,
            filtrosTareas,
            filtroTarea,
            modales,
            timeStamp,
            subtareasPorAsignar,
            slide,
            autoplay,
            imagenPerfil,
            date,
            eventos,
            tiposSolicitudes,
            solicitud,
            lorem,
            data,
            currentPage,
            perPage,
            displayedCards,
            departamentoSeleccionado,
            departamentos,
            empleados,
            showDepartamentos,
            modulosPermitidos,
            logout,
            verEvento,
            consultarEmpleadosDepartamento,
            enviarSolicitud,
            limpiarFormulario,
            goToModule,
            width: computed(() => ($q.screen.xs ? '100%' : '450px')),
            selfCenterMiddle,
            showBanner,
            search,
        }
    },
})
