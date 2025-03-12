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
import { Proveedor } from 'sistema/proveedores/domain/Proveedor'
import { ProveedorController } from 'sistema/proveedores/infraestructure/ProveedorController'
import {
    DetalleDepartamentoProveedor
} from 'comprasProveedores/detallesDepartamentosProveedor/domain/DetalleDepartamentoProveedor'
import {
    DetalleDepartamentoProveedorController
} from 'comprasProveedores/detallesDepartamentosProveedor/infraestructure/DetalleDepartamentoProveedorController'

//Logica y controladores


export default defineComponent({
    components: { EssentialTable, GestorArchivos },
    props: {datos:{type: Object, required:true }},
    setup(props) {
        const mixin = new ContenedorSimpleMixin(CalificacionProveedor, new CalificacionProveedorController())
        const { listadosAuxiliares: listadosAuxiliaresProveedor } = props.datos.mixin.useReferencias()
        const { cargarVista } = mixin.useComportamiento()
        // const mixinArchivos = new ContenedorSimpleMixin(Proveedor, new ProveedorController())
        const mixinArchivos = new ContenedorSimpleMixin(DetalleDepartamentoProveedor, new DetalleDepartamentoProveedorController())

        /**************************************************************
         * Stores
         **************************************************************/
        const proveedorStore = useProveedorStore()
        const calificacionProveedorStore = useCalificacionProveedorStore()
        const mostrarCalificacionPersonal = calificacionProveedorStore.verMiCalificacion


        /**************************************************************
         * Variables
         **************************************************************/
        const calificacion_dada = ref()
        const refArchivo = ref()
        const criteriosBienes = ref([])
        const criteriosServicios = ref([])
        const departamentosCalificadores = ref([])
        const calificacionesDepartamentos = ref<any>([])
        const idDetalleDepartamentoProveedor = computed(() => proveedorStore.idDetalleDepartamento)

        console.log(idDetalleDepartamentoProveedor.value)
        calificacion_dada.value = { calificacion: 0, fecha_calificacion: Date.now() }


        cargarVista(async () => {
            // console.log('INFO CALIFICACION', proveedorStore.idProveedor, proveedorStore.idDepartamento)
            calificacionProveedorStore.idProveedor = proveedorStore.proveedor.id
            calificacionProveedorStore.idDepartamento = proveedorStore.idDepartamento
            await calificacionProveedorStore.consultarDepartamentosCalificanProveedor()
            departamentosCalificadores.value = calificacionProveedorStore.departamentosCalificadoresProveedor
            await calificacionProveedorStore.departamentosCalificadoresProveedor.forEach(async (v: any, index) => {
                calificacionesDepartamentos.value[index] = [v, await calificacionProveedorStore.consultarCalificacionesProveedorDepartamento(v.id)]
                await  cargarArchivos(v.id)
            })
            console.log(calificacionesDepartamentos.value)
            calificacionesDepartamentos.value.forEach((v)=>{
                console.log('v es: ',v)
                cargarArchivos(1)
            })
            console.log(calificacionProveedorStore.detalleDepartamentoProveedor)
            calificacion_dada.value = calificacionProveedorStore.detalleDepartamentoProveedor

        })


        /**************************************************************
         * Init
         **************************************************************/
        function cargarArchivos(id: number) {
            refArchivo.value.listarArchivosAlmacenados(id)
        }

        // onMounted(() => {
        //     cargarArchivos(proveedorStore.idProveedor)
        //     console.log(refArchivo.value)
        // }
        // )
        return {
            ofertas: listadosAuxiliaresProveedor.ofertas,
            proveedor: proveedorStore.proveedor,
            columnasCriteriosConCalificacion: configuracionColumnasCriteriosCalificacionesConCalificacion,

            //listados
            calificacionesDepartamentos,
            criteriosServicios,
            criteriosBienes,

            listadoFiltrado(listado, tipo) {
              return listado.filter(
                v => v.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1
              )
            },

            mostrarCalificacionPersonal,
            calificacion_dada,
            refArchivo,
            mixinArchivos,
            cargarArchivos,

            idDetalleDepartamentoProveedor,
        }

    }
})
