// Dependencies
import { defineComponent, ref, onMounted, computed } from "vue"

//Components
import EssentialTable from "components/tables/view/EssentialTable.vue"
import GestorArchivos from "components/gestorArchivos/GestorArchivos.vue"

//Logica y controladores
import { useProveedorStore } from "stores/comprasProveedores/proveedor"
import { useNotificaciones } from "shared/notificaciones"
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin"
import { CalificacionProveedor } from "../domain/CalificacionProveedor"
import { CalificacionProveedorController } from "../infraestructure/CalificacionProveedorController"
import { OfertaProveedorController } from "sistema/proveedores/modules/ofertas_proveedores/infraestructure/OfertaProveedorController"
import { configuracionColumnasCriteriosCalificacionesConCalificacion } from "pages/comprasProveedores/criteriosCalificaciones/domain/configuracionColumnasCriteriosCalificacionesConCalificacion"
import { useCalificacionProveedorStore } from "stores/comprasProveedores/calificacionProveedor"
import { DetalleDepartamentoProveedorController } from "pages/comprasProveedores/detallesDepartamentosProveedor/infraestructure/DetalleDepartamentoProveedorController"
import { date } from "quasar"
import { DetalleDepartamentoProveedor } from "pages/comprasProveedores/detallesDepartamentosProveedor/domain/DetalleDepartamentoProveedor"
import { endpoints } from "config/api";

//Logica y controladores


export default defineComponent({
    components: { EssentialTable, GestorArchivos },
    setup() {
        const mixin = new ContenedorSimpleMixin(CalificacionProveedor, new CalificacionProveedorController())
        const { entidad: calificacion, listadosAuxiliares } = mixin.useReferencias()
        const { cargarVista, obtenerListados } = mixin.useComportamiento()
        const mixinArchivos = new ContenedorSimpleMixin(DetalleDepartamentoProveedor, new DetalleDepartamentoProveedorController())
        const { listadoArchivos } = mixinArchivos.useReferencias()
        const { listarArchivos } = mixinArchivos.useComportamiento()
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
        const idDetalleDepartamentoProveedor = computed(()=>proveedorStore.idDetalleDepartamento)

        calificacion_dada.value = { calificacion: 0, fecha_calificacion: Date.now() }


        cargarVista(async () => {
            obtenerListados({
                ofertas: new OfertaProveedorController(),
            })
            // console.log('INFO CALIFICACION', proveedorStore.idProveedor, proveedorStore.idDepartamento)
            calificacionProveedorStore.idProveedor = proveedorStore.proveedor.id
            calificacionProveedorStore.idDepartamento = proveedorStore.idDepartamento
            if (calificacionProveedorStore.verMiCalificacion) {
                await calificacionProveedorStore.consultarCalificacionMiDepartamento()
                departamentosCalificadores.value = calificacionProveedorStore.departamentosCalificadoresProveedor
                // console.log(departamentosCalificadores.value)
            } else {
                await calificacionProveedorStore.consultarDepartamentosCalificanProveedor()
                departamentosCalificadores.value = calificacionProveedorStore.departamentosCalificadoresProveedor
            }
            await calificacionProveedorStore.departamentosCalificadoresProveedor.forEach(async (v: any, index) => {
                // console.log(v)
                calificacionesDepartamentos.value[index] = [v, await calificacionProveedorStore.consultarCalificacionesProveedorDepartamento(v.id)]
                // console.log(await calificacionProveedorStore.consultarCalificacionesProveedorDepartamento(v.id))
            })
            console.log(calificacionesDepartamentos.value)

            //aqui consulta el departamento y la calificación
            if (mostrarCalificacionPersonal) {
                const { result } = await new DetalleDepartamentoProveedorController().listar({ proveedor_id: proveedorStore.idProveedor, departamento_id: proveedorStore.idDepartamento })
                // console.log(result[0])
                calificacion_dada.value = result[0]
            }

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
            ofertas: listadosAuxiliares.ofertas,
            proveedor: proveedorStore.proveedor,
            columnasCriteriosConCalificacion: configuracionColumnasCriteriosCalificacionesConCalificacion,

            //listados
            calificacionesDepartamentos,
            criteriosServicios,
            criteriosBienes,

            listadoFiltrado(listado, tipo) {
                // console.log(listado, tipo)
                const listadoFiltrado = listado.filter((v) => v.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1)
                // console.log(listadoFiltrado.length)
                return listadoFiltrado
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
