//Dependencias
import { configuracionColumnasTransferencias } from "../domain/configuracionColumnasTransferencias";
import { configuracionColumnasProductosSeleccionados } from "pages/bodega/devoluciones/domain/configuracionColumnasProductosSeleccionados";
import { configuracionColumnasItemsSeleccionados } from "../domain/configuracionColumnasItemsSeleccionados";
import { required, requiredIf } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";
import { acciones, logoBN, logoColor, meses, tabOptionsTransacciones, tabOptionsTransferencias, } from "config/utils";


//Componentes
import TabLayoutFilterTabs from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue";
import EssentialTable from "components/tables/view/EssentialTable.vue";
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { TransferenciaController } from "../infraestructure/TransferenciaController";
import { Transferencia } from "../domain/Transferencia";
import { useNotificaciones } from "shared/notificaciones";
import { useOrquestadorSelectorItemsTransaccion } from "pages/bodega/transacciones/modules/transaccionIngreso/application/OrquestadorSelectorDetalles";
import { ComportamientoModalesTransferencia } from "../application/ComportamientoModalesTransferencia";
import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { SucursalController } from "pages/administracion/sucursales/infraestructure/SucursalController";
import { TipoTransaccionController } from "pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController";
import { TareaController } from "pages/tareas/controlTareas/infraestructure/TareaController";
import { SubtareaController } from "pages/tareas/controlTareas/modules/subtareas/infraestructure/SubtareaController";
import { MotivoController } from "pages/administracion/motivos/infraestructure/MotivoController";
import { AutorizacionController } from "pages/administracion/autorizaciones/infraestructure/AutorizacionController";
import { EstadosTransaccionController } from "pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController";
import { DetalleProductoController } from "pages/bodega/detalles_productos/infraestructure/DetalleProductoController";
import { ClienteController } from "pages/sistema/clientes/infraestructure/ClienteController";
import { useAuthenticationStore } from "stores/authentication";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { CustomActionPrompt } from "components/tables/domain/CustomActionPrompt";

//pdfmake
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs
import { buildTableBody } from "shared/utils";
import { useOrquestadorSelectorItems } from "pages/bodega/traspasos/application/OrquestadorSelectorInventario";
import { configuracionColumnasInventarios } from "pages/bodega/inventario/domain/configuracionColumnasInventarios";


export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },
    setup() {
        const mixin = new ContenedorSimpleMixin(Transferencia, new TransferenciaController())
        const { entidad: transferencia, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer, onConsultado } = mixin.useHooks()
        const { confirmar, prompt } = useNotificaciones()
        //stores
        const store = useAuthenticationStore()

        //orquestador
        const {
            refListadoSeleccionable: refListado,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorItems(transferencia, 'inventarios')

        const modales = new ComportamientoModalesTransferencia()

        const usuarioLogueado = store.user
        const esBodeguero = store.esBodeguero
        const esCoordinador = store.esCoordinador
        const esActivos = store.esActivosFijos

        //FLAGS
        let tabSeleccionado = ref()
        let puedeEditar = ref(false)
        let soloLectura = ref(false)
        let esVisibleAutorizacion = ref(false)

        const opciones_autorizaciones = ref([])
        const opciones_sucursales = ref([])
        const opciones_estados = ref([])
        const opciones_empleados = ref([])
        const opciones_clientes = ref([])

        cargarVista(async () => {
            await obtenerListados({
                empleados: {
                    controller: new EmpleadoController(),
                    params: {
                        campos: 'id,nombres,apellidos',
                        estado: 1
                    }
                },
                sucursales: {
                    controller: new SucursalController(),
                    params: { campos: 'id,lugar' },
                },
                autorizaciones: {
                    controller: new AutorizacionController(),
                    params: {
                        campos: 'id,nombre'
                    }
                },
                estados: {
                    controller: new EstadosTransaccionController(),
                    params: {
                        campos: 'id,nombre'
                    }
                },
                clientes: {
                    controller: new ClienteController(),
                    params: {
                        campos: 'id,empresa_id',
                        requiere_bodega: 1,
                        estado: 1,
                    },
                },
            })
        })


        //HOOKS
        onReestablecer(() => {
            soloLectura.value = false
        })
        onConsultado(() => {
            if (usuarioLogueado.id === transferencia.per_autoriza) {
                soloLectura.value = true
            }

            if (transferencia.solicitante) {
                const opcion_encontrada = listadosAuxiliares.empleados.filter((v) => v.id === transferencia.solicitante)
                if (opcion_encontrada[0]['id']) transferencia.solicitante = opcion_encontrada[0]['id']
            }
        })

        //Reglas de validacion
        const reglas = {
            justificacion: { required },
            sucursal_salida: { required },
            sucursal_destino: { required },
            cliente: { requiredIfBodeguero: requiredIf(esBodeguero) },
            autorizacion: {
                requiredIfCoordinador: requiredIf(esCoordinador),
            },
            // estado: { requiredIfBodega: requiredIf(esBodeguero), },
            observacion_aut: {
                requiredIfObsAutorizacion: requiredIf(false)
                // requiredIfObsAutorizacion: requiredIf(function () { return transaccion.tiene_obs_autorizacion })
            },
            observacion_est: {
                requiredIfObsEstado: requiredIf(false)
                // requiredIfObsEstado: requiredIf(function () { return transaccion.tiene_obs_estado })
            },
            listadoProductos: { required }//validar que envien datos en el listado
        }
        const v$ = useVuelidate(reglas, transferencia)
        setValidador(v$.value)

        function eliminar({ entidad, posicion }) {
            confirmar('¿Está seguro de continuar?', () => transferencia.listadoProductos.splice(posicion, 1))
        }
        const botonEliminar: CustomActionTable = {
            titulo: 'Quitar',
            color: 'negative',
            icono: 'bi-x',
            accion: ({ entidad, posicion }) => {
                eliminar({ entidad, posicion })
            },
            visible: () => {
                return accion.value == acciones.nuevo || (esActivos && accion.value == acciones.editar) ? true : false
            }
        }
        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Cantidad',
            icono: 'bi-pencil',
            accion: ({ posicion }) => {
                const config: CustomActionPrompt = {
                    titulo: 'Confirmación',
                    mensaje: 'Ingresa la cantidad',
                    defecto: transferencia.listadoProductos[posicion].cantidades,
                    tipo: 'number',
                    accion: (data) => transferencia.listadoProductos[posicion].cantidades = data,
                }
                prompt(config)
            },
            visible: () => {
                return accion.value == acciones.nuevo || (esActivos&&accion.value==acciones.editar) ? true : false
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
                console.log('entidad en el boton imprimir', entidad)
                pdfMakeImprimir(entidad)
            },
            // visible: () => tabSeleccionado.value == '1' ? true : false
        }


        function table(data, columns, encabezados) {
            return {
                layout: 'listadoLayout',
                table: {
                    headerRows: 1,
                    body: buildTableBody(data, columns, encabezados)
                }
            }
        }

        const f = new Date()
        function pdfMakeImprimir(transferencia) {
            pdfMake.tableLayouts = {
                listadoLayout: {
                    hLineWidth: function (i, node) {
                        if (i === 0 || i === node.table.body.length) {
                            return 0;
                        }
                        return (i === node.table.headerRows) ? 2 : 1;
                    },
                    vLineWidth: function (i) {
                        return 0;
                    },
                    hLineColor: function (i) {
                        return i === 1 ? 'black' : '#aaa';
                    },
                    paddingLeft: function (i) {
                        return i === 0 ? 0 : 8;
                    },
                    paddingRight: function (i, node) {
                        return (i === node.table.widths.length - 1) ? 0 : 8;
                    }
                },
                lineaLayout: {
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 0 : 2;
                    },
                    vLineWidth: function (i, node) {
                        return 0;
                    },
                },
            }

            var docDefinition = {
                info: {
                    title: `Transferencia ${transferencia.id}`,
                    author: `${store.user.nombres} ${store.user.apellidos}`,
                },
                background: {
                    image: logoBN,
                    margin: [50, 80, 50, 50],
                    opacity: 0.1
                },
                pageSize: 'A5',
                pageOrientation: 'landscape',
                header: {
                    columns: [
                        {
                            image: logoColor,
                            width: 70,
                            height: 40,
                            margin: [5, 2]
                        },
                        { text: 'COMPROBANTE DE TRANSFERENCIA ENTRE BODEGAS', width: 'auto', style: 'header', margin: [85, 20] },
                        { text: 'Sistema de Bodega', alignment: 'right', margin: [5, 2, 5] }
                    ]
                },
                footer: function (currentPage, pageCount) {
                    return [
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: currentPage.toString() + ' de ' + pageCount,
                                    margin: [10, 10]
                                },
                                { qr: `Transferencia N° ${transferencia.id}\n Generado por ${store.user.nombres} ${store.user.apellidos}, el ${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}, ${f.getHours()}:${f.getMinutes()}:${f.getSeconds()}`, fit: '50', alignment: 'right', margin: [0, 0, 5, 0] },
                                // { text: 'pie de pagina', alignment: 'right', margin: [5, 2] }
                            ]
                        }
                    ]
                },
                content: [
                    {
                        canvas: [
                            {
                                type: 'line',
                                x1: 0, y1: 5,
                                x2: 510, y2: 5,
                                lineWidth: 1,
                            },
                        ], margin: [0, 0, 0, 20]
                    },
                    {
                        columns: [
                            {
                                // auto-sized columns have their widths based on their content
                                width: '*',
                                text: [
                                    { text: 'Transferencia N° ', style: 'defaultStyle' },
                                    { text: `${transferencia.id}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: '*',
                                text: [
                                    { text: 'Fecha: ', style: 'defaultStyle' },
                                    { text: `${transferencia.created_at}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // fixed width
                                width: '*',
                                text: [
                                    { text: 'Solicitante: ', style: 'defaultStyle' },
                                    { text: `${transferencia.solicitante}`, style: 'resultStyle', }
                                ]
                            },
                        ],

                    },
                    {
                        columns: [
                            /* {
                                // auto-sized columns have their widths based on their content
                                width: '*',
                                columns: [
                                    { width: 'auto', text: 'Sucursal: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${transferencia.sucursal}`, style: 'resultStyle', }
                                ]
                            }, */
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: 'auto',
                                columns: [
                                    { width: 'auto', text: 'Justificación: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${transferencia.justificacion}`, style: 'resultStyle', }
                                ],
                            },
                        ],
                    },

                    {
                        columns: [
                            {
                                // auto-sized columns have their widths based on their content
                                width: '*',
                                columns: [
                                    { width: 'auto', text: 'Desde: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${transferencia.sucursal_salida}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: 'auto',
                                columns: [
                                    { width: 'auto', text: 'Hasta: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${transferencia.sucursal_destino}`, style: 'resultStyle', }
                                ],
                            },
                        ],
                    },
                    {
                        columns: [
                            /* {
                                width: '*',
                                columns: [
                                    { width: 'auto', text: 'Tarea: ', style: 'defaultStyle', alignment: 'right' },
                                    { width: 'auto', text: ` ${transferencia.tarea}`, style: 'resultStyle', }
                                ]
                            }, */
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: 'auto',
                                columns: [
                                    { width: 'auto', text: 'Estado: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${transferencia.estado}`, style: 'resultStyle', }
                                ],
                            },
                        ]
                    },

                    /* 
                    ['producto', 'detalle_id', 'cliente_id', 'condicion', 'cantidades', 'devuelto'],
                        ['Producto', 'Descripción', 'Propietario', 'Estado', 'Cantidad', 'Devuelto']),
                    */
                    table(transferencia.listadoProductos,
                        ['producto', 'detalle_id', 'condicion', 'cantidades'],
                        ['Producto', 'Descripción', 'Estado', 'Cantidad']),

                    { text: '\n\n' },

                    // aqui debe ir el listado de devoluciones realizadas

                    /* { text: 'Listado de devoluciones' },
                    function () {
                        {
                            text: transferencia.listadoDevoluciones.forEach((element) => {
                                `${element.id}`
                            })
                        }
                    }, */

                    { text: '\n\n' },
                    {
                        columns: [
                            {
                                layout: 'lineaLayout',
                                width: '*',
                                table: {
                                    widths: ['*'],
                                    body: [[" "], [" "]]
                                },
                                margin: [0, 0, 60, 0]
                            },
                            {
                                layout: 'lineaLayout',
                                width: '*',
                                table: {
                                    widths: ['*'],
                                    body: [[" "], [" "]]
                                },
                                margin: [60, 0, 0, 0]
                            }

                        ],
                        columnGap: 10
                    },
                    {
                        columns: [
                            {
                                // auto-sized columns have their widths based on their content
                                // width: '*',
                                text: [
                                    { text: 'ENTREGA \n', style: 'resultStyle', alignment: 'center' },
                                    { text: `${transferencia.solicitante}\n`, style: 'resultStyle', alignment: 'center' },
                                    {
                                        text: [
                                            { text: 'C.I: ', style: 'resultStyle', alignment: 'center' },
                                            { text: `${store.user.identificacion}`, style: 'resultStyle' }
                                        ],
                                        alignment: 'center',
                                    }
                                ]
                            },
                            {
                                // width: '*',
                                text: [
                                    { text: 'RECIBE \n', style: 'resultStyle', alignment: 'center' },
                                    { text: 'BODEGUERO: \n', style: 'resultStyle', },
                                    { text: 'C.I: \n', style: 'resultStyle', margin: [60, 0, 0, 0], }
                                ]
                            },
                        ],
                        // optional space between columns
                        columnGap: 140
                    },
                ],
                styles: {
                    header: {
                        fontSize: 16,
                        bold: true,
                        alignment: 'center'
                    },
                    defaultStyle: {
                        fontSize: 10,
                        bold: false
                    },
                    resultStyle: {
                        fontSize: 10,
                        bold: true
                    },
                },
            }
            pdfMake.createPdf(docDefinition).open()
        }

        const configuracionColumnasProductosSeleccionadosAccion = [...configuracionColumnasProductosSeleccionados, {
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
        }
        ]

        //configurar los listados
        opciones_empleados.value = listadosAuxiliares.empleados
        opciones_clientes.value = listadosAuxiliares.clientes
        opciones_estados.value = listadosAuxiliares.estados
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_autorizaciones.value = listadosAuxiliares.autorizaciones
        opciones_estados.value = listadosAuxiliares.estados
        opciones_sucursales.value = listadosAuxiliares.sucursales


        return {
            mixin, transferencia, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasTransferencias,
            acciones,

            //listados
            opciones_clientes,
            opciones_estados,
            opciones_sucursales,
            opciones_empleados,
            opciones_autorizaciones,

            //variables auxiliares
            esVisibleAutorizacion,
            soloLectura,
            esBodeguero,
            esActivos,

            //modales
            modales,

            //tabla
            configuracionColumnasProductosSeleccionadosAccion,
            configuracionColumnasProductosSeleccionados,
            configuracionColumnasItemsSeleccionados,

            //botones
            botonEliminar, botonEditarCantidad, botonImprimir,

            //selector
            refListado,
            criterioBusquedaProducto,
            listadoProductos,
            listarProductos,
            limpiarProducto,
            seleccionarProducto,
            configuracionColumnasItems: configuracionColumnasInventarios,

            //tabs y filtros
            tabOptionsTransferencias,
            puedeEditar,
            tab: tabSeleccionado,
            
            tabEs(val) {
                tabSeleccionado.value = val
                puedeEditar.value = (esActivos && tabSeleccionado.value === 'PENDIENTE')
                    ? true
                    : false

            },





        }

    }

})