//Dependencias
import { configuracionColumnasProductosEnPerchas } from '../domain/configuracionColumnasProductosEnPerchas'
import { minValue, required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { configuracionColumnasInventarios } from 'pages/bodega/inventario/domain/configuracionColumnasInventarios'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ProductoEnPercha } from '../domain/ProductoEnPercha'
import { ProductosEnPerchaController } from '../infraestructure/ProductosEnPerchaController'
import { InventarioController } from 'pages/bodega/inventario/infraestructure/InventarioController'
import { UbicacionController } from 'pages/administracion/ubicaciones/infraestructure/UbicacionController'
import { useOrquestadorSelectorInventario } from '../application/OrquestadorSelectorInventario'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'


export default defineComponent({
    components: { TabLayout, EssentialSelectableTable },
    setup() {
        const mixin = new ContenedorSimpleMixin(ProductoEnPercha, new ProductosEnPerchaController())
        const { entidad: producto_percha, disabled, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onGuardado, onReestablecer } = mixin.useHooks()

        let sucursal = ref()

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
            stock: {
                required,
                minimo: minValue(1),
            },
        }
        const v$ = useVuelidate(reglas, producto_percha)
        setValidador(v$.value)

        const opciones_ubicaciones = ref([])
        const opciones_sucursales = ref([])
        //Obtener los listados
        cargarVista(async () => {
            await obtenerListados({
                // ubicaciones: new UbicacionController(),
                sucursales: {
                    controller: new SucursalController(),
                    params: { campos: 'id,lugar' },
                },
            })
        })
        opciones_ubicaciones.value = listadosAuxiliares.ubicaciones
        opciones_sucursales.value = listadosAuxiliares.sucursales

        onGuardado(() => {
            sucursal.value = ''
        })
        onReestablecer(() => {
            sucursal.value = ''
        })
        function updateSucursal(val: number) {
            cargarVista(async () => {
                await obtenerListados({
                    ubicaciones: {
                        controller: new UbicacionController(),
                        params: {
                            sucursal: sucursal.value
                        },
                    },
                })
                opciones_ubicaciones.value = listadosAuxiliares.ubicaciones
            })

            // opciones_ubicaciones.value = listadosAuxiliares.ubicaciones.filter((v)=>v.sucursal===val)
            // console.log('valor a emitir', sucursal.value)
            // console.log('valor dentro del metodo', val)
        }
        // listarInventarios({sucursal: sucursal.value})

        return {
            mixin, producto_percha, v$, disabled,
            configuracionColumnas: configuracionColumnasProductosEnPerchas,
            //listados
            opciones_ubicaciones,
            opciones_sucursales,

            //variable para el filtrado
            sucursal,

            //selector
            refListadoSeleccionableInventarios,
            criterioBusquedaInventario,
            listadoInventarios,
            listarInventarios,
            limpiarInventario,
            seleccionarInventario,
            configuracionColumnasInventarios,

            //filtro de SucursalSeleccionada
            SucursalSeleccionada(val) {
                updateSucursal(val)
            },
        }
    }
})