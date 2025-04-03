//Dependencias
import { configuracionColumnasTraspasos } from '../domain/configuracionColumnasTraspasos'
import { configuracionColumnasInventarios } from 'pages/bodega/inventario/domain/configuracionColumnasInventarios'
import { configuracionColumnasItemsSeleccionados } from '../domain/configuracionColumnasItemsSeleccionados'
import { configuracionColumnasItemsSeleccionadosDevolver } from '../domain/configuracionColumnasItemsSeleccionadosDevolver'
import { configuracionColumnasItemsSeleccionadosDevuelto } from '../domain/configuracionColumnasItemsSeleccionadosDevuelto'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { useOrquestadorSelectorItems } from '../application/OrquestadorSelectorInventario'

//Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TraspasoController } from '../infraestructure/TraspasoController'
import { Traspaso } from '../domain/Traspaso'
import { useNotificaciones } from 'shared/notificaciones'
import { useAuthenticationStore } from 'stores/authentication'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { acciones, tabOptionsTraspasos } from 'config/utils'


import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { ValidarListadoProductos } from '../application/validaciones/ValidarListadoProductos'
import { LocalStorage } from 'quasar'
import { useTraspasoStore } from 'stores/traspaso'
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales'
import { ordenarLista } from 'shared/utils'


export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },

    setup() {
        const mixin = new ContenedorSimpleMixin(Traspaso, new TraspasoController())
        const { entidad: traspaso, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer, onBeforeGuardar, onConsultado } = mixin.useHooks()
        const { confirmar, prompt, notificarError } = useNotificaciones()

        //stores
        const store = useAuthenticationStore()
        const traspasoStore = useTraspasoStore()

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
        let puedeEditar = ref(false)
        let entidad_aux = ref()

        onConsultado(() => {
            if (accion.value === acciones.editar) {
                soloLectura.value = true
            }
        })
        onReestablecer(() => {
            soloLectura.value = false
        })
        onBeforeGuardar(() => {
            console.log('se ejecuta el ONBEFOREGUARDAR')
            if (traspaso.desde_cliente === traspaso.hasta_cliente) {
                notificarError('¡No se puede hacer traspasos en un mismo cliente!')
            }
            /* v$.value.listadoProductos.$errors.forEach(error =>
                console.log(error.$message),
                notificarAdvertencia('Debe agregar al menos un producto al listado')
            ) */
        })

        const opciones_sucursales = ref([])
        const opciones_tareas = ref([])
        const opciones_estados = ref([])
        const { clientes, filtrarClientes } = useFiltrosListadosSelects(listadosAuxiliares)

        //Obtener los listados
        cargarVista(async () => {
            await obtenerListados({
                clientes: {
                    controller: new ClienteController(),
                    params: {
                        campos: 'id,razon_social',
                        requiere_bodega: 1,
                        estado: 1,
                    },
                },
                tareas: {
                    controller: new TareaController(),
                    params: { campos: 'id,codigo_tarea,titulo,cliente_id' }
                },
            })
        })

        /**
         * Validaciones
         */
        const reglas = {
            sucursal: { required },
            desde_cliente: { required },
            hasta_cliente: { required },
            // listadoProductos: { required },
        }
        const v$ = useVuelidate(reglas, traspaso)
        setValidador(v$.value)

        const validarListadoProductos = new ValidarListadoProductos(traspaso)
        mixin.agregarValidaciones(validarListadoProductos)

        /**
         * Funciones
         *
         */

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
                return accion.value == acciones.nuevo ? true : false
            }
        }
        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Cantidad',
            icono: 'bi-pencil',
            accion: ({ posicion }) => {
                const config: CustomActionPrompt = {
                    titulo: 'Confirmación',
                    mensaje: 'Ingresa la cantidad',
                    defecto: traspaso.listadoProductos[posicion].cantidades,
                    tipo: 'number',
                    accion: (data) => traspaso.listadoProductos[posicion].cantidades = data,
                }
                prompt(config)
            },
            visible: () => {
                return accion.value == acciones.nuevo ? true : false
            }
        }
        const botonDevolver: CustomActionTable = {
            titulo: 'Devolucion',
            icono: 'bi-pencil',
            accion: ({ posicion }) => {
                const config: CustomActionPrompt = {
                    titulo: 'Confirmación',
                    mensaje: 'Ingresa la cantidad',
                    defecto: traspaso.listadoProductos[posicion].devolucion,
                    tipo: 'number',
                    accion: (data) => traspaso.listadoProductos[posicion].devolucion = data,
                }
                prompt(config)
            },
            visible: ({ entidad, posicion }) => {
                return accion.value == acciones.editar && entidad.cantidades != entidad.devuelto ? true : false
            }
        }
        const botonImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad }) => {
              traspasoStore.idTraspaso = entidad.id
              await traspasoStore.imprmirPdf()
            },
            // visible: () => tabSeleccionado.value == '1' ? true : false
        }


        //configurar los listados
        clientes.value = listadosAuxiliares.clientes
        opciones_estados.value = JSON.parse(LocalStorage.getItem('estados_transacciones')!.toString())
        opciones_sucursales.value =  JSON.parse(LocalStorage.getItem('sucursales')!.toString())
        opciones_tareas.value = listadosAuxiliares.tareas

        return {
            mixin, traspaso, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasTraspasos,
            acciones,
            //listados
            clientes,
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
            configuracionColumnasItemsSeleccionadosDevolver,
            configuracionColumnasItemsSeleccionadosDevuelto,
            configuracionColumnasItemsSeleccionados,
            botonEditarCantidad,
            botonEliminar,
            botonImprimir,
            botonDevolver,

            //flags
            soloLectura,
            puedeEditar,
            //Tabs
            tabOptionsTraspasos,
            tabSeleccionado,

            tabEs(val) {
                console.log(val)
                tabSeleccionado.value = val
                puedeEditar.value = val == 0 ? true : false
            },

            //Filtros
            filtrarClientes,
            ordenarLista,
            tareaSeleccionada(val) {
                const opcionSeleccionada = listadosAuxiliares.tareas.filter((v) => v.id === val)
                traspaso.hasta_cliente = opcionSeleccionada[0]['cliente_id']

            }


        }

    }
})
