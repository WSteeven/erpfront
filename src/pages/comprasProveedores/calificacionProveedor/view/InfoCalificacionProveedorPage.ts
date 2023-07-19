// Dependencies
import { defineComponent, ref } from "vue"

//Components
import EssentialTable from "components/tables/view/EssentialTable.vue"
import { useProveedorStore } from "stores/comprasProveedores/proveedor"
import { useNotificaciones } from "shared/notificaciones"
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin"
import { CalificacionProveedor } from "../domain/CalificacionProveedor"
import { CalificacionProveedorController } from "../infraestructure/CalificacionProveedorController"
import { OfertaProveedorController } from "sistema/proveedores/modules/ofertas_proveedores/infraestructure/OfertaProveedorController"
import { configuracionColumnasCriteriosCalificacionesConCalificacion } from "pages/comprasProveedores/criteriosCalificaciones/domain/configuracionColumnasCriteriosCalificacionesConCalificacion"
import { useCalificacionProveedorStore } from "stores/comprasProveedores/calificacionProveedor"

//Logica y controladores


export default defineComponent({
    components: { EssentialTable, },
    setup() {
        const mixin = new ContenedorSimpleMixin(CalificacionProveedor, new CalificacionProveedorController())
        const { entidad: calificacion, listadosAuxiliares } = mixin.useReferencias()
        const { cargarVista, obtenerListados } = mixin.useComportamiento()
        /**************************************************************
         * Stores
         **************************************************************/
        const proveedorStore = useProveedorStore()
        const calificacionProveedorStore = useCalificacionProveedorStore()
        /************************************************************** 
         * Variables
         **************************************************************/
        const refArchivoProveedor = ref()
        const disabled = ref(false)
        const criteriosBienes = ref([])
        const criteriosServicios = ref([])
        const departamentosCalificadores = ref([])
        const calificacionesDepartamentos = ref([])

        cargarVista(async () => {
            obtenerListados({
                ofertas: new OfertaProveedorController(),
            })
            console.log('INFO CALIFICACION', proveedorStore.idProveedor, proveedorStore.idDepartamento)
            calificacionProveedorStore.idProveedor = proveedorStore.proveedor.id
            calificacionProveedorStore.idDepartamento = proveedorStore.idDepartamento
            if (calificacionProveedorStore.verMiCalificacion) {
                await calificacionProveedorStore.consultarCalificacionMiDepartamento()
                departamentosCalificadores.value = calificacionProveedorStore.departamentosCalificadoresProveedor
                console.log(departamentosCalificadores.value)
            } else {
                await calificacionProveedorStore.consultarDepartamentosCalificanProveedor()
                departamentosCalificadores.value = calificacionProveedorStore.departamentosCalificadoresProveedor
            }
            await calificacionProveedorStore.departamentosCalificadoresProveedor.forEach(async (v, index) => {
                console.log(v)
                calificacionesDepartamentos.value[index] = [v, await calificacionProveedorStore.consultarCalificacionesProveedorDepartamento(v.id)]
                // console.log(await calificacionProveedorStore.consultarCalificacionesProveedorDepartamento(v.id))
            })
            console.log(calificacionesDepartamentos.value)
        })

        return {
            ofertas: listadosAuxiliares.ofertas,
            proveedor: proveedorStore.proveedor,
            columnasCriteriosConCalificacion: configuracionColumnasCriteriosCalificacionesConCalificacion,

            calificacionesDepartamentos,
            criteriosServicios,
            criteriosBienes,

            listadoFiltrado(listado, tipo) {
                console.log(listado, tipo)
                const listadoFiltrado = listado.filter((v) => v.tipo.toLowerCase().indexOf(tipo.toLowerCase()) > -1)
                console.log(listadoFiltrado.length)
                return listadoFiltrado
            },

        }

    }
})