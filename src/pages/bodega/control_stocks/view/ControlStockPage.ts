//Dependencias
import { configuracionColumnasControlStock } from "../domain/configuracionColumnasControlStock";
import { required } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { SucursalController } from "pages/administracion/sucursales/infraestructure/SucursalController";
import { DetalleProductoController } from "pages/bodega/detalles_productos/infraestructure/DetalleProductoController";
import { ControlStockController } from "../infraestructure/ControlStockController";
import { ControlStock } from "../domain/ControlStock";
import { ClienteController } from "pages/sistema/clientes/infraestructure/ClienteController";
import { ProductoController } from "pages/bodega/productos/infraestructure/ProductoController";

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(ControlStock, new ControlStockController())
        const { entidad: stock, disabled, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento();

        const reglas = {
            sucursal_id: { required },
            detalle_id: { required },
            cliente_id: { required },
        }

        const v$ = useVuelidate(reglas, stock)
        setValidador(v$.value)

        const opciones_sucursales = ref([])
        const opciones_productos = ref([])
        const opciones_detalles = ref([])
        const opciones_clientes = ref([])
        //Obtener listados 
        cargarVista(async () => {
            await obtenerListados({
                sucursales: new SucursalController(),
                productos: new ProductoController(),
                detalles: new DetalleProductoController(),
                clientes: new ClienteController(),
            })
        })

        const opciones_estados = [{
            'nombre': 'SUFICIENTE', 'valor': 'STOCK SUFICIENTE',
        }, {
            'nombre': 'REORDEN', 'valor': 'PROXIMO A AGOTARSE',
        }, {
            'nombre': 'MINIMO', 'valor': 'DEBAJO DEL MINIMO'
        }
        ]
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_productos.value = listadosAuxiliares.productos
        opciones_detalles.value = listadosAuxiliares.detalles
        opciones_clientes.value = listadosAuxiliares.clientes
        return {
            mixin, stock, v$, disabled,
            configuracionColumnas: configuracionColumnasControlStock,
            //listados
            opciones_estados,
            opciones_sucursales,
            opciones_productos,
            opciones_detalles,
            opciones_clientes,
            filtroProductos(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_productos.value = listadosAuxiliares.productos
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_productos.value = listadosAuxiliares.productos.filter((v) => v.nombre.toLowerCase().indexOf(needle) > -1)
                })
            },
            seleccionarDetalle(val) {
                opciones_detalles.value = listadosAuxiliares.detalles.filter((v) => v.producto.indexOf(val) > -1)
                stock.detalle_id = ''
                if (opciones_detalles.value.length < 1) {
                    stock.detalle_id = ''
                }
                if (opciones_detalles.value.length == 1) {
                    stock.detalle_id = opciones_detalles.value[0]['id']
                }
            },
        }
    }
})