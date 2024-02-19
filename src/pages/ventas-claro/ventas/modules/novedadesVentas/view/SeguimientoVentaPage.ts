// Dependencias
import { computed, defineComponent, ref } from 'vue'
import useVuelidate from '@vuelidate/core'

// Componentes
import TablaFilasDinamicas from 'components/tables/view/TablaFilasDinamicas.vue'
import VisorImagen from 'components/VisorImagen.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue';

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { configuracionColumnasSeguimientoOrdenCompra } from 'pages/comprasProveedores/ordenCompra/modules/novedadesOrdenesCompras/domain/configuracionColumnasSeguimientoOrdenCompra'
import NovedadVenta from '../domain/NovedadVenta'
import { SeguimientoVentaController } from '../infraestructure/SeguimientoVentaController'
import { ArchivoController } from 'pages/gestionTrabajos/subtareas/modules/gestorArchivosTrabajos/infraestructure/ArchivoController'
import { useVentaStore } from 'stores/ventasClaro/venta'
import { Venta } from 'pages/ventas-claro/ventas/domain/Venta'
import { VentaController } from 'pages/ventas-claro/ventas/infrestructure/VentaController'

export default defineComponent({
    components: { TablaFilasDinamicas, GestorArchivos, VisorImagen, },
    setup() {
        /*********
         * Stores
         *********/
        const ventaStore = useVentaStore()

        /********
        * Mixin
        *********/
        const mixinVenta = new ContenedorSimpleMixin(Venta, new VentaController(), new ArchivoController())
        const mixin = new ContenedorSimpleMixin(NovedadVenta, new SeguimientoVentaController())
        const { entidad: actividad, listado } = mixin.useReferencias()
        const { guardar: guardarNovedad, setValidador, listar: listarNovedades } = mixin.useComportamiento()

        /************
         * Variables
         ************/
        const refArchivo = ref()
        const fila = ref()
        const refVisorImagen = ref()
        const permitirSubir = ventaStore.permitirSubir

        /************
         * Init
         ************/
        listarNovedades({ venta_id: ventaStore.idVenta })


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
            actividad.venta = ventaStore.idVenta
            guardarNovedad(actividad)
        }

        async function subirArchivos() {
            await refArchivo.value.subir()
        }

        function cargarArchivos() {
            refArchivo.value.listarArchivosAlmacenados(ventaStore.idVenta)
        }


        return {
            refVisorImagen,
            mixin,
            mixinVenta,
            refArchivo,
            columnas: configuracionColumnasSeguimientoOrdenCompra,
            listado,
            NovedadVenta,
            verFotografia,
            guardarFilaActividad,
            subirArchivos,
            mostrarBotonSubir: computed(() => refArchivo.value?.quiero_subir_archivos),
            permitirSubir,
            cargarArchivos,
            idModelo: computed(() => ventaStore.idVenta)
        }
    }
})
