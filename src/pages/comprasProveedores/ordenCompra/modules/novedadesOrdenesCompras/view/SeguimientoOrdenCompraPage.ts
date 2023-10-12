// Dependencias
import { computed, defineComponent, onMounted, ref } from 'vue'
import { regiones, atenciones } from 'config/utils'
import useVuelidate from '@vuelidate/core'
import { endpoints } from 'config/api'

// Componentes
import TablaFilasDinamicas from 'components/tables/view/TablaFilasDinamicas.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ButtonSubmits from 'components/buttonSubmits/buttonSubmits.vue'
import SelectorImagen from 'components/SelectorImagen.vue'
import VisorImagen from 'components/VisorImagen.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { useAuthenticationStore } from 'stores/authentication'
import { configuracionColumnasSeguimientoOrdenCompra } from '../domain/configuracionColumnasSeguimientoOrdenCompra'
import NovedadOrdenCompra from '../domain/SeguimientoOrdenCompra'
import { NovedadOrdenCompraController } from '../infraestructure/NovedadOrdenCompraControllet'
import { useOrdenCompraStore } from 'stores/comprasProveedores/ordenCompra'
import { OrdenCompra } from 'pages/comprasProveedores/ordenCompra/domain/OrdenCompra'
import { OrdenCompraController } from 'pages/comprasProveedores/ordenCompra/infraestructure/OrdenCompraController'
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'

export default defineComponent({
    components: { TablaFilasDinamicas, GestorArchivos, VisorImagen, },
    setup() {
        /*********
         * Stores
         *********/
        const ordenCompraStore = useOrdenCompraStore()

        /********
        * Mixin
        *********/
        const mixinOrdenCompra = new ContenedorSimpleMixin(OrdenCompra, new OrdenCompraController(), new ArchivoController())
        const mixin = new ContenedorSimpleMixin(NovedadOrdenCompra, new NovedadOrdenCompraController())
        const { entidad: actividad,  listado } = mixin.useReferencias()
        const { guardar: guardarNovedad, setValidador, listar: listarNovedades } = mixin.useComportamiento()

        /************
         * Variables
         ************/
        const refArchivo = ref()
        const fila = ref()
        const refVisorImagen = ref()
        const permitirSubir = true

        /************
         * Init
         ************/
        listarNovedades({ orden_compra_id: ordenCompraStore.idOrden })


        /****************
         * Botones tabla
         ****************/
        const verFotografia: CustomActionTable = {
            titulo: 'Ver fotografía',
            icono: 'bi-image-fill',
            color: 'secondary',
            visible: ({ entidad }) => entidad.fotografia,
            accion: async ({ entidad }) => {
                refVisorImagen.value.abrir(entidad.fotografia)
            }
        }

        /*************
         * Validaciones
        **************/
        const reglas = {
            // regional: { required },
        }

        const v$ = useVuelidate(reglas, actividad)
        setValidador(v$.value)

        /************
         * Funciones
        *************/
        function guardarFilaActividad(data) {
            actividad.hydrate(data)
            actividad.orden_compra = ordenCompraStore.idOrden
            guardarNovedad(actividad)
        }

        async function subirArchivos() {
            await refArchivo.value.subir()
        }

        function cargarArchivos() {
            refArchivo.value.listarArchivosAlmacenados(ordenCompraStore.idOrden)
        }


        return {
            refVisorImagen,
            mixin,
            mixinOrdenCompra,
            refArchivo,
            columnas: configuracionColumnasSeguimientoOrdenCompra,
            listado,
            NovedadOrdenCompra,
            verFotografia,
            guardarFilaActividad,
            subirArchivos,
            mostrarBotonSubir: computed(() => refArchivo.value?.quiero_subir_archivos),
            permitirSubir,
            cargarArchivos,
            idModelo: computed(() => ordenCompraStore.idOrden)
        }
    }
})
