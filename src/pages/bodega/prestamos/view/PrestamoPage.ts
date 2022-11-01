//Dependencias
import { configuracionColumnasPrestamos } from "../domain/configuracionColumnasPrestamos";
import { required } from "@vuelidate/validators";
import {useVuelidate} from '@vuelidate/core';
import { defineComponent, ref } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'


//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { PrestamoController } from "../infraestructure/PrestamoController";
import { Prestamo } from "../domain/Prestamo";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { InventarioController } from "pages/bodega/inventario/infraestructure/InventarioController";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";
import { useNotificaciones } from "shared/notificaciones";
import { useAuthenticationStore } from "stores/authentication";
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { useOrquestadorSelectorItemsInventario } from "../application/OrquestadorSelectorItemsInventario";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { configuracionColumnasInventarios } from "pages/bodega/inventario/domain/configuracionColumnasInventarios";

export default defineComponent({
    components: {TabLayout, EssentialTable, EssentialSelectableTable},
    setup(){
        const mixin = new ContenedorSimpleMixin(Prestamo, new PrestamoController())
        const {entidad:prestamo, disabled, listadosAuxiliares}= mixin.useReferencias()
        const {setValidador, cargarVista, obtenerListados}=mixin.useComportamiento()
        const {confirmar, prompt} = useNotificaciones()

        const {
            refListadoSeleccionable: refListadoSeleccionableProductos,
            criterioBusqueda:criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        }=useOrquestadorSelectorItemsInventario(prestamo, 'inventarios')



        const opciones_empleados = ref([])
        //Obtener los listados
        cargarVista(async()=>{
            await obtenerListados({
                empleados: new EmpleadoController(),
                inventarios: new InventarioController(),

            })
        })

        const reglas = {
            fecha_salida:{required},
            solicitante:{required},
            estado:{required},
        }

        useNotificacionStore().setQuasar(useQuasar())
        const v$ = useVuelidate(reglas, prestamo)
        setValidador(v$.value)


        function eliminarItem({ posicion }) {
            confirmar('¿Está seguro de continuar?',
                () => prestamo.listadoProductos.splice(posicion, 1))
        }
        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Editar cantidad',
            accion: ({ posicion }) => {
                prompt('Ingresa la cantidad',
                    (data) => prestamo.listadoProductos[posicion].cantidad = data,
                    prestamo.listadoProductos[posicion].cantidad
                )
            }
        }

        const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasInventarios, {
            name: 'cantidad',
            field: 'cantidad',
            label: 'Cantidad',
            align: 'left',
            sortable: false,
        },
        {
            name: 'acciones',
            field: 'acciones',
            label: 'Acciones',
            align: 'right',
            sortable: false,
        }]

        //Configurar los listados
        opciones_empleados.value = listadosAuxiliares.empleados
        const estados = ['PENDIENTE','DEVUELTO']


        return {
            mixin, prestamo, v$, disabled, 
            configuracionColumnas: configuracionColumnasPrestamos,

            //listados
            opciones_empleados,
            estados,

            //filtros
            filtroEmpleados(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_empleados.value = listadosAuxiliares.empleados
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle)>-1)
                })
            },

            //tabla
            configuracionColumnasInventarios,
            configuracionColumnasProductosSeleccionadosAccion,
            botonEditarCantidad,
            eliminarItem,

            //selector
            refListadoSeleccionableProductos,
            criterioBusquedaProducto,
            listadoProductos,
            listarProductos,
            limpiarProducto,
            seleccionarProducto,
            configuracionColumnasProductos,


        }
    }
})