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

export default defineComponent({
    components: {
        EssentialTable,
        SelectorImagen,
        ButtonSubmits,
        TablaFilasDinamicas,
        GestorArchivos,
        VisorImagen,
    },
    emits: ['cerrar-modal'],
    setup(props, { emit }) {
        /*********
         * Stores
         *********/
        const ordenCompraStore = useOrdenCompraStore()

        /********
        * Mixin
        *********/
        const mixinOrdenCompra = new ContenedorSimpleMixin(OrdenCompra, new OrdenCompraController())
        const mixin = new ContenedorSimpleMixin(NovedadOrdenCompra, new NovedadOrdenCompraController())
        const { entidad: actividad, accion, listado } = mixin.useReferencias()
        const { guardar: guardarNovedad, editar, reestablecer, setValidador, listar: listarNovedades } = mixin.useComportamiento()

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
        function cargarArchivos() {
            console.log('Se ha inicializado el componente de  GestorArchivo: ' + ordenCompraStore.idOrden)
            refArchivo.value.listarArchivosAlmacenados(ordenCompraStore.idOrden)
        }


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

        function limpiarFila() {
            fila.value = null
        }

        function guardarFila(data) {
            limpiarFila()
        }



        onMounted(() => {
            console.log(listado.value)

            setTimeout(() => {
                console.log(listado.value)
            }, 3000);
        })

        return {
            v$,
            refVisorImagen,
            mixin,
            mixinOrdenCompra,
            refArchivo,
            accion,
            editar,
            reestablecer,
            emit,
            columnas: configuracionColumnasSeguimientoOrdenCompra,
            guardarFila,
            listado,
            NovedadOrdenCompra,
            verFotografia,
            guardarFilaActividad,
            subirArchivos,
            mostrarBotonSubir: computed(() => refArchivo.value?.quiero_subir_archivos),
            permitirSubir,
            cargarArchivos,
            idModelo: computed(() => {
                console.log(ordenCompraStore.idOrden)
                return ordenCompraStore.idOrden
            })
        }
    }
})
