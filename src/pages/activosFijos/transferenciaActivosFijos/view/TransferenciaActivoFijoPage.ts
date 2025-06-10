// Dependencias
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { estadosTransacciones } from 'config/utils'
import { defineComponent, ref } from 'vue'

// Componentes
import TabLayoutFilterTabs2 from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue'

// Logica y controladores
import { TransferenciaActivoFijo } from '../domain/TransferenciaActivoFijo'
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { TransferenciaActivoFijoController } from '../infraestructure/TransferenciaActivoFijoController'
import { configuracionColumnasTransferenciasActivosFijos } from '../domain/configuracionColumnasTransferenciasActivosFijos'
import { useAuthenticationStore } from 'stores/authentication'
import { tabOptionsTransferenciaProductoEmpleado } from 'config/tareas.utils'

export default defineComponent({
    components: {
        TabLayoutFilterTabs2,
    },
    setup() {
        const authenticationStore = useAuthenticationStore()

        /********
         * Mixin
         ********/
        const mixin = new ContenedorSimpleMixin(TransferenciaActivoFijo, new TransferenciaActivoFijoController(), new ArchivoController())
        const { entidad: transferencia, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()

        /*************
         * Variables
         *************/
        const puedeEditar = ref()
        const tabSeleccionado = ref()

        /*************
         * Funciones
         *************/
        function filtrarTransferenciasActivosFijos(tab: string) {
            tabSeleccionado.value = tab
            puedeEditar.value = authenticationStore.can('puede.autorizar.devoluciones') && tabSeleccionado.value === estadosTransacciones.pendiente ? true : false
            puedeEditar.value = tab == 'PENDIENTE'
            // listar({ estado: tab })
        }

        return {
            mixin,
            transferencia,
            filtrarTransferenciasActivosFijos,
            tabOptionsTransferenciaActivosFijos: tabOptionsTransferenciaProductoEmpleado,
            configuracionColumnasTransferenciasActivosFijos,
            tabSeleccionado,
            puedeEditar,
        }
    }
})