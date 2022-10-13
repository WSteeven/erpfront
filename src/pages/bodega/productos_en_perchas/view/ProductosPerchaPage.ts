//Dependencias
import { configuracionColumnasProductosEnPerchas } from "../domain/configuracionColumnasProductosEnPerchas";
import { required } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";
import { configuracionColumnasInventarios } from "pages/bodega/inventario/domain/configuracionColumnasInventarios";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { ProductoEnPercha } from "../domain/ProductoEnPercha";
import { ProductosEnPerchaController } from "../infraestructure/ProductosEnPerchaController";
import { InventarioController } from "pages/bodega/inventario/infraestructure/InventarioController";
import { UbicacionController } from "pages/administracion/ubicaciones/infraestructure/UbicacionController";
import { useOrquestadorSelectorInventario } from "../application/OrquestadorSelectorInventario";


export default defineComponent({
    components: { TabLayout, EssentialSelectableTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(ProductoEnPercha, new ProductosEnPerchaController())
        const { entidad: producto_percha, disabled, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento();

        //configuracion del orquestador
        const {
            refListadoSeleccionable: refListadoSeleccionableInventarios,
            criterioBusqueda: criterioBusquedaInventario,
            listado: listadoInventarios,
            listar: listarInventarios,
            limpiar: limpiarInventario,
            seleccionar: seleccionarInventario
        } = useOrquestadorSelectorInventario(producto_percha, 'inventarios')

        const reglas = {
            inventario: { required },
            ubicacion: { required },
            stock: { required },
        }
        const v$ = useVuelidate(reglas, producto_percha)
        setValidador(v$.value)

        const opciones_ubicaciones = ref([])
        //Obtener los listados
        cargarVista(async () => {
            await obtenerListados({
                ubicaciones: new UbicacionController(),
            })
        })
        opciones_ubicaciones.value = listadosAuxiliares.ubicaciones

        return {
            mixin, producto_percha, v$, disabled,
            configuracionColumnas: configuracionColumnasProductosEnPerchas,
            //listados
            opciones_ubicaciones,

            //selector
            refListadoSeleccionableInventarios,
            criterioBusquedaInventario,
            listadoInventarios,
            listarInventarios,
            limpiarInventario,
            seleccionarInventario,
            configuracionColumnasInventarios,
        }
    }
})