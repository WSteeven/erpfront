//Dependencias
import { configuracionColumnasTraspasos } from "../domain/configuracionColumnasTraspasos";
import { required} from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";
import { useOrquestadorSelectorItems } from "../application/OrquestadorSelectorInventario";

//Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from "components/tables/view/EssentialTable.vue";
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { TraspasoController } from "../infraestructure/TraspasoController";
import { Traspaso } from "../domain/Traspaso";
import { useNotificaciones } from "shared/notificaciones";
import { useAuthenticationStore } from "stores/authentication";
import { TareaController } from "pages/tareas/controlTareas/infraestructure/TareaController";
import { SucursalController } from "pages/administracion/sucursales/infraestructure/SucursalController";
import { ClienteController } from "pages/sistema/clientes/infraestructure/ClienteController";
import { EstadosTransaccionController } from "pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { acciones, tabOptionsTraspasos } from "config/utils";
import { configuracionColumnasInventarios } from "pages/bodega/inventario/domain/configuracionColumnasInventarios";
import { configuracionColumnasItemsSeleccionados } from "../domain/configuracionColumnasItemsSeleccionados";

export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },

    setup() {
        const mixin = new ContenedorSimpleMixin(Traspaso, new TraspasoController())
        const { entidad: traspaso, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer,onBeforeGuardar } = mixin.useHooks()
        const { confirmar, prompt } = useNotificaciones()

        //stores
        const store = useAuthenticationStore()
        const {notificarError, notificarAdvertencia} = useNotificaciones()

        //orquestador
        const {
            refListadoSeleccionable: refListado,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorItems(traspaso, 'inventarios')

        //flags 
        let tabSeleccionado = ref()
        let soloLectura = ref(false)
        let esVisibleTarea = ref(false)

        onReestablecer(() => {
            soloLectura.value = false
        })
        onBeforeGuardar(()=>{
            if(traspaso.desde_cliente===traspaso.hasta_cliente){
                notificarError('¡No se puede hacer traspasos en un mismo cliente!')
            }
            v$.value.listadoProductos.$errors.forEach(error => 
                // console.log(error.$message)
                notificarAdvertencia('Debe agregar al menos un producto al listado')
                );
        })

        const opciones_clientes = ref([])
        const opciones_sucursales = ref([])
        const opciones_tareas = ref([])
        const opciones_estados = ref([])

        //Obtener los listados
        cargarVista(async () => {
            await obtenerListados({
                estados: { controller: new EstadosTransaccionController(), params: { campos: 'id,nombre' } },
                clientes: {
                    controller: new ClienteController(),
                    params: {
                        campos: 'id,empresa_id',
                        requiere_bodega: 1,
                        estado: 1,
                    },
                },
                tareas: {
                    controller: new TareaController(),
                    params: { campos: 'id,codigo_tarea,detalle,cliente_id' }
                },
                sucursales: {
                    controller: new SucursalController(),
                    params: { campos: 'id,lugar' },
                },
            })

            traspaso.desde_cliente = listadosAuxiliares.clientes[0]['id']
        })

        const reglas = {
            sucursal: { required },
            desde_cliente: { required },
            hasta_cliente: { required },
            listadoProductos: { required },
        }
        const v$ = useVuelidate(reglas, traspaso)
        setValidador(v$.value)

        function eliminar({ entidad, posicion }) {
            confirmar('¿Está seguro de continuar?',
                () => traspaso.listadoProductos.splice(posicion, 1))
        }
        const botonEliminar: CustomActionTable = {
            titulo: 'Quitar',
            color: 'negative',
            icono: 'bi-x',
            accion: ({ entidad, posicion }) => {
                eliminar({ entidad, posicion })
            },
            visible: () => {
                return accion.value == acciones.consultar ? false : true
            }
        }
        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Cantidad',
            icono: 'bi-pencil',
            accion: ({ posicion }) => {
                prompt('Ingresa la cantidad',
                    (data) => traspaso.listadoProductos[posicion].cantidades = data,
                    traspaso.listadoProductos[posicion].cantidades
                )
            },
            visible: () => {
                return accion.value == acciones.consultar ? false : true
            }
        }
        const botonImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad, posicion }) => {
                // devolucionStore.idDevolucion = entidad.id
                // modales.abrirModalEntidad("ImprimirDevolucionPage")
                // await devolucionStore.showPreview()
                // pdfMakeImprimir()
            },
            visible: () => tabSeleccionado.value == 'CREADA' ? true : false
        }

        //configurar los listados
        opciones_clientes.value = listadosAuxiliares.clientes
        opciones_estados.value = listadosAuxiliares.estados
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_tareas.value = listadosAuxiliares.tareas

        return {
            mixin, traspaso, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasTraspasos,
            //listados
            opciones_clientes,
            opciones_estados,
            opciones_sucursales,
            opciones_tareas,

            //selector
            refListado,
            criterioBusquedaProducto,
            listadoProductos,
            listarProductos,
            limpiarProducto,
            seleccionarProducto,
            configuracionColumnasItems: configuracionColumnasInventarios,

            //tabla
            configuracionColumnasItemsSeleccionados,
            botonEditarCantidad,
            botonEliminar,
            botonImprimir,

            //flags
            soloLectura,
            //Tabs 
            tabOptionsTraspasos,
            tabSeleccionado,

            tabEs(val){
                tabSeleccionado.value = val
            },

            //Filtros
            filtroTareas(val){
                const opcionSeleccionada = listadosAuxiliares.tareas.filter((v)=>v.id===val)
                console.log(opcionSeleccionada)
                traspaso.hasta_cliente = opcionSeleccionada[0]['cliente_id']

            }


        }

    }
})
