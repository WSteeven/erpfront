//Dependencias
import { configuracionColumnasDevoluciones } from '../domain/configuracionColumnasDevoluciones'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { useOrquestadorSelectorDetalles } from '../application/OrquestadorSelectorDetalles'

//Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { DevolucionController } from '../infraestructure/DevolucionController'
import { Devolucion } from '../domain/Devolucion'

import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { TareaController } from 'pages/gestionTrabajos/tareas/infraestructure/TareaController'
import { configuracionColumnasProductosSeleccionadosAccion } from '../domain/configuracionColumnasProductosSeleccionadosAccion'
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasDetallesModal } from '../domain/configuracionColumnasDetallesModal'
import { useNotificaciones } from 'shared/notificaciones'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { acciones, estadosTransacciones, tabOptionsDevoluciones } from 'config/utils'
import { useDevolucionStore } from 'stores/devolucion'

import { useAuthenticationStore } from 'stores/authentication'
import { CambiarEstadoDevolucion } from '../application/CambiarEstadoDevolucion'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { LocalStorage } from 'quasar'
import { useListadoMaterialesDevolucionStore } from 'stores/listadoMaterialesDevolucion'
import { MaterialEmpleadoTarea } from 'pages/gestionTrabajos/miBodega/domain/MaterialEmpleadoTarea'
import { ValidarListadoProductos } from '../application/ValidarListadoProductos'


export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable },

    setup() {
        const mixin = new ContenedorSimpleMixin(Devolucion, new DevolucionController())
        const { entidad: devolucion, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

        //stores
        const devolucionStore = useDevolucionStore()
        const store = useAuthenticationStore()
        const listadoMaterialesDevolucion = useListadoMaterialesDevolucionStore()

        //orquestador
        const {
            refListadoSeleccionable: refListado,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorDetalles(devolucion, 'detalles')

        //flags
        let tabSeleccionado = ref()
        let soloLectura = ref(false)
        let esVisibleTarea = ref(false)



        onReestablecer(() => {
            soloLectura.value = false
        })

        const opciones_empleados = ref([])
        const opciones_cantones = ref([])
        const opciones_tareas = ref([])
        //Obtener los listados
        cargarVista(async () => {
            await obtenerListados({
                empleados: {
                    controller: new EmpleadoController(),
                    params: {
                        campos: 'id,nombres,apellidos',
                        estado: 1
                    }
                },
                tareas: {
                    controller: new TareaController(),
                    params: { campos: 'id,codigo_tarea,titulo,cliente_id' }
                },
            })

            //logica para autocompletar el formulario de devolucion
            if (listadoMaterialesDevolucion.listadoMateriales.length) {
                devolucion.tarea = listadoMaterialesDevolucion.tareaId ? listadoMaterialesDevolucion.tareaId : null
                devolucion.es_tarea = !!devolucion.tarea
                devolucion.es_para_stock = listadoMaterialesDevolucion.devolverAlStock
                devolucion.listadoProductos = listadoMaterialesDevolucion.listadoMateriales.map((material: MaterialEmpleadoTarea) => {
                    return {
                        producto: material.producto,
                        categoria: material.categoria,
                        descripcion: material.detalle_producto,
                        cantidad: material.stock_actual,
                        medida: material.medida,
                        id: material.detalle_producto_id
                    }
                })

            }
        })

        //reglas de validacion
        const reglas = {
            justificacion: { required },
            canton: { required },
            tarea: { requiredIfTarea: requiredIf(devolucion.es_tarea!) },
        }

        const v$ = useVuelidate(reglas, devolucion)
        setValidador(v$.value)

        const validarListadoProductos = new ValidarListadoProductos(devolucion)
        mixin.agregarValidaciones(validarListadoProductos)

        function eliminar({ entidad, posicion }) {
            confirmar('¿Está seguro de continuar?',
                () => devolucion.listadoProductos.splice(posicion, 1))
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
            accion: ({ entidad, posicion }) => {
                const data: CustomActionPrompt = {
                    titulo: 'Modifica',
                    mensaje: 'Ingresa la cantidad',
                    tipo:'number',
                    defecto: devolucion.listadoProductos[posicion].cantidad,
                    accion: (data) => devolucion.listadoProductos[posicion].cantidad = data,
                }
                prompt(data)
            },
            visible: () => {
                return accion.value == acciones.consultar ? false : true
            }
        }
        const botonAnular: CustomActionTable = {
            titulo: 'Anular',
            color: 'negative',
            icono: 'bi-x',
            accion: ({ entidad, posicion }) => {
                confirmar('¿Está seguro de anular la devolución?', () => {
                    const data: CustomActionPrompt = {
                        titulo: 'Motivo',
                        mensaje: 'Ingresa el motivo de la anulación',
                        accion: async (data) => {
                            try {
                                const { result } = await new CambiarEstadoDevolucion().anular(entidad.id, data)
                                notificarCorrecto('Devolución anulada exitosamente!')
                                actualizarElemento(posicion, result)
                            } catch (e: any) {
                                notificarError('No se pudo anular, debes ingresar un motivo para la anulación')
                            }
                        }
                    }

                    prompt(data)
                })
            },
            visible: ({ entidad, posicion }) => {
                return tabSeleccionado.value == 'CREADA' && store.nombreUsuario == entidad.solicitante &&(entidad.estado_bodega===estadosTransacciones.pendiente||entidad.estado_bodega===estadosTransacciones.parcial) ? true : false
            }
        }
        const botonImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad, posicion }) => {
                devolucionStore.idDevolucion = entidad.id
                await devolucionStore.imprimirPdf()
            },
            visible: () => tabSeleccionado.value == 'CREADA' ? true : false
        }


        function actualizarElemento(posicion: number, entidad: any): void {
            if (posicion >= 0) {
                listado.value.splice(posicion, 1, entidad)
                listado.value = [...listado.value]
            }
        }


        //Configurar los listados
        opciones_empleados.value = listadosAuxiliares.empleados
        opciones_cantones.value = JSON.parse(LocalStorage.getItem('cantones')!.toString())
        opciones_tareas.value = listadosAuxiliares.tareas

        return {
            mixin, devolucion, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasDevoluciones,
            //listados
            opciones_empleados,
            opciones_tareas,
            opciones_cantones,

            //selector
            refListado,
            criterioBusquedaProducto,
            listadoProductos,
            listarProductos,
            limpiarProducto,
            seleccionarProducto,
            configuracionColumnasDetallesModal,


            //tabla
            configuracionColumnasProductosSeleccionadosAccion,
            configuracionColumnasProductosSeleccionados,
            botonEditarCantidad,
            botonEliminar,
            botonAnular,
            botonImprimir,

            //flags
            soloLectura,
            esVisibleTarea,

            //Tabs
            tabOptionsDevoluciones,
            tabSeleccionado,

            tabEs(val) {
                tabSeleccionado.value = val
            },

            //Filtros
            filtroTareas(val) {
                // const opcion_encontrada = listadosAuxiliares.tareas.filter((v) => v.id === val)
                // devolucion.cliente = opcion_encontrada[0]['cliente_id']
            },
            //filtro de cantones
            filtroCantones(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_cantones.value = JSON.parse(LocalStorage.getItem('cantones')!.toString())
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_cantones.value = JSON.parse(LocalStorage.getItem('cantones')!.toString()).filter((v) => v.canton.toLowerCase().indexOf(needle) > -1)
                })
            },
            filtroEmpleados(val, update) {
                if (val === '') {
                    update(() => {
                        opciones_empleados.value = listadosAuxiliares.empleados
                    })
                    return
                }
                update(() => {
                    const needle = val.toLowerCase()
                    opciones_empleados.value = listadosAuxiliares.empleados.filter((v) => v.nombres.toLowerCase().indexOf(needle) > -1 || v.apellidos.toLowerCase().indexOf(needle) > -1)
                })
            },
        }
    }
})