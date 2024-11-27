// Dependencias
import { configuracionColumnasInspecciones } from '../domain/configuracionColumnasInspecciones'
import { estadosInspecciones, tabOptionsEstadosInspecciones } from 'pages/sso/config/utils'
import { useAuthenticationStore } from 'stores/authentication'
import { required } from 'shared/i18n-validators'
import { defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'
import { acciones, maskFecha } from 'config/utils'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'
import Estado from 'components/tables/view/EstadosSubtareas.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { InspeccionController } from '../infraestructure/InspeccionController'
import { Inspeccion } from '../domain/Inspeccion'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'

export default defineComponent({
    components: { TabLayoutFilterTabs2, Estado },
    setup() {
        /*********
         * Stores
         *********/
        const authenticationStore = useAuthenticationStore()

        /********
         * Mixin
         ********/
        const mixin = new ContenedorSimpleMixin(Inspeccion, new InspeccionController())
        const { entidad: inspeccion, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, listar, cargarVista, obtenerListados } = mixin.useComportamiento()
        const { onReestablecer } = mixin.useHooks()

        /*************
         * Variables
         *************/
        const tabActual = ref()
        inspeccion.responsable = authenticationStore.user.nombres + ' ' + authenticationStore.user.apellidos

        /*************
         * Funciones
         *************/
        function filtrarInspecciones(tab: string) {
            listar({ estado: tab })
            tabActual.value = tab
        }

        /*****************
         * Botones tabla
         *****************/
        const btnEjecutar: CustomActionTable<Inspeccion> = {
            titulo: 'Ejecutar',
            icono: 'bi-play-fill',
            color: 'indigo',
            accion: async ({ entidad }) => {
                /*  confirmar('¿Está seguro de ejecutar la inspección?', async () => {
                     const { response, result } = await cambiarEstadoTicket.ejecutar(entidad.id)
                     entidad.estado = estadosTickets.EJECUTANDO
                     entidad.fecha_hora_ejecucion = result.fecha_hora_ejecucion
                     filtrarTickets(estadosTickets.EJECUTANDO)
                     notificarCorrecto(response.data.mensaje)
                   }) */
            }
        }

        /*********
         * Reglas
         *********/
        const rules = {
            titulo: { required },
            descripcion: { required },
            fecha_inicio: { required },
        }

        const v$ = useVuelidate(rules, inspeccion)
        setValidador(v$.value)

        /********
         * Hooks
         ********/
        onReestablecer(() => inspeccion.responsable = authenticationStore.user.nombres + ' ' + authenticationStore.user.apellidos)

        /********
         * Init
         ********/
        filtrarInspecciones(estadosInspecciones.CREADO)

        return {
            v$,
            mixin,
            inspeccion,
            accion,
            disabled,
            maskFecha,
            configuracionColumnasInspecciones,
            tabActual,
            filtrarInspecciones,
            tabOptionsEstadosInspecciones,
            acciones,
        }
    }
})