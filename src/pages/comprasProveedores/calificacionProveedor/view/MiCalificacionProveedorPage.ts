// Dependencies
import { computed, defineComponent, onMounted, ref } from 'vue'

//Components
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import GestorArchivos from 'components/gestorArchivos/GestorArchivos.vue'

//Logica y controladores
import { useProveedorStore } from 'stores/comprasProveedores/proveedor'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { CalificacionProveedor } from '../domain/CalificacionProveedor'
import { CalificacionProveedorController } from '../infraestructure/CalificacionProveedorController'
import { configuracionColumnasCriteriosCalificacionesConCalificacion } from 'pages/comprasProveedores/criteriosCalificaciones/domain/configuracionColumnasCriteriosCalificacionesConCalificacion'
import { useCalificacionProveedorStore } from 'stores/comprasProveedores/calificacionProveedor'
import { DetalleDepartamentoProveedorController } from 'pages/comprasProveedores/detallesDepartamentosProveedor/infraestructure/DetalleDepartamentoProveedorController'
import { DetalleDepartamentoProveedor } from 'pages/comprasProveedores/detallesDepartamentosProveedor/domain/DetalleDepartamentoProveedor'

export default defineComponent({
    components: { EssentialTable, GestorArchivos },
    props: {datos:{type: Object, required:true }},
    setup(props) {
        const mixin = new ContenedorSimpleMixin(CalificacionProveedor, new CalificacionProveedorController())
        // const { listadosAuxiliares } = mixin.useReferencias()
        const { listadosAuxiliares: listadosAuxiliaresProveedor } = props.datos.mixin.useReferencias()
        const { cargarVista } = mixin.useComportamiento()
        const mixinArchivos = new ContenedorSimpleMixin(DetalleDepartamentoProveedor, new DetalleDepartamentoProveedorController())
        /**************************************************************
         * Stores
         **************************************************************/
        const proveedorStore = useProveedorStore()
        const calificacionProveedorStore = useCalificacionProveedorStore()


        /**************************************************************
         * Variables
         **************************************************************/
        const mi_calificacion = ref()
        const refArchivo = ref()
        const idDetalleDepartamentoProveedor = computed(() => proveedorStore.idDetalleDepartamento)


        cargarVista(async () => {
            calificacionProveedorStore.idProveedor = proveedorStore.proveedor.id
            calificacionProveedorStore.idDepartamento = proveedorStore.idDepartamento
             mi_calificacion.value = await calificacionProveedorStore.obtenerCalificacionIndividual()
        })


        /**************************************************************
         * Init
         **************************************************************/
        function cargarArchivos() {
            refArchivo.value.listarArchivosAlmacenados(idDetalleDepartamentoProveedor.value)
        }

        onMounted(() =>
            cargarArchivos()
        )
        return {
            ofertas: listadosAuxiliaresProveedor.ofertas,
            proveedor: proveedorStore.proveedor,
            columnasCriteriosConCalificacion: configuracionColumnasCriteriosCalificacionesConCalificacion,


            listadoFiltrado(listado, tipo) {
              return listado.filter(
                v => v.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1
              )
            },
            mi_calificacion,
            refArchivo,
            mixinArchivos,

            idDetalleDepartamentoProveedor,
        }

    }
})
