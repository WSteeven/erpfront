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
import { TareaController } from 'pages/tareas/controlTareas/infraestructure/TareaController'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'
import { EstadosTransaccionController } from 'pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { acciones, logoBN, logoColor, meses, tabOptionsTraspasos } from 'config/utils'


//pdfmake
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { buildTableBody } from 'shared/utils'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs


export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },

    setup() {
        const mixin = new ContenedorSimpleMixin(Traspaso, new TraspasoController())
        const { entidad: traspaso, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer, onBeforeGuardar, onConsultado } = mixin.useHooks()
        const { confirmar, prompt } = useNotificaciones()

        //stores
        const store = useAuthenticationStore()
        const { notificarError, notificarAdvertencia } = useNotificaciones()

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
            if (traspaso.desde_cliente === traspaso.hasta_cliente) {
                notificarError('¡No se puede hacer traspasos en un mismo cliente!')
            }
            v$.value.listadoProductos.$errors.forEach(error =>
                // console.log(error.$message)
                notificarAdvertencia('Debe agregar al menos un producto al listado')
            )
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
                // console.log('entidad....', entidad)
                // console.log(entidad.cantidades, entidad.devuelto)
                // console.log(entidad.cantidades != entidad.devuelto)

                return accion.value == acciones.editar && entidad.cantidades != entidad.devuelto ? true : false
            }
        }
        const botonImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad, posicion }) => {
                // devolucionStore.idDevolucion = entidad.id
                // modales.abrirModalEntidad('ImprimirDevolucionPage')
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
        function pdfMakeImprimir(traspaso) {
            pdfMake.tableLayouts = {
                listadoLayout: {
                    hLineWidth: function (i, node) {
                        if (i === 0 || i === node.table.body.length) {
                            return 0
                        }
                        return (i === node.table.headerRows) ? 2 : 1
                    },
                    vLineWidth: function (i) {
                        return 0
                    },
                    hLineColor: function (i) {
                        return i === 1 ? 'black' : '#aaa'
                    },
                    paddingLeft: function (i) {
                        return i === 0 ? 0 : 8
                    },
                    paddingRight: function (i, node) {
                        return (i === node.table.widths.length - 1) ? 0 : 8
                    }
                },
                lineaLayout: {
                    hLineWidth: function (i, node) {
                        return (i === 0 || i === node.table.body.length) ? 0 : 2
                    },
                    vLineWidth: function (i, node) {
                        return 0
                    },
                },
            }

            var docDefinition = {
                info: {
                    title: `Traspaso ${traspaso.id}`,
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
                        { text: 'COMPROBANTE DE TRASPASO ENTRE CLIENTES', width: 'auto', style: 'header', margin: [85, 20] },
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
                                { qr: `Traspaso N° ${traspaso.id}\n Generado por ${store.user.nombres} ${store.user.apellidos}, el ${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}, ${f.getHours()}:${f.getMinutes()}:${f.getSeconds()}`, fit: '50', alignment: 'right', margin: [0, 0, 5, 0] },
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
                                    { text: 'Transaccion N° ', style: 'defaultStyle' },
                                    { text: `${traspaso.id}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: '*',
                                text: [
                                    { text: 'Fecha: ', style: 'defaultStyle' },
                                    { text: `${traspaso.created_at}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // fixed width
                                width: '*',
                                text: [
                                    { text: 'Solicitante: ', style: 'defaultStyle' },
                                    { text: `${traspaso.solicitante}`, style: 'resultStyle', }
                                ]
                            },
                        ],

                    },
                    {
                        columns: [
                            {
                                // auto-sized columns have their widths based on their content
                                width: '*',
                                columns: [
                                    { width: 'auto', text: 'Sucursal: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${traspaso.sucursal}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: 'auto',
                                columns: [
                                    { width: 'auto', text: 'Justificación: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${traspaso.justificacion}`, style: 'resultStyle', }
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
                                    { width: 'auto', text: `${traspaso.desde_cliente}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: 'auto',
                                columns: [
                                    { width: 'auto', text: 'Hasta: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${traspaso.hasta_cliente}`, style: 'resultStyle', }
                                ],
                            },
                        ],
                    },
                    {
                        columns: [
                            {
                                width: '*',
                                columns: [
                                    { width: 'auto', text: 'Tarea: ', style: 'defaultStyle', alignment: 'right' },
                                    { width: 'auto', text: ` ${traspaso.tarea}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: 'auto',
                                columns: [
                                    { width: 'auto', text: 'Estado: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${traspaso.estado}`, style: 'resultStyle', }
                                ],
                            },
                        ]
                    },

                    /*
                    ['producto', 'detalle_id', 'cliente_id', 'condicion', 'cantidades', 'devuelto'],
                        ['Producto', 'Descripción', 'Propietario', 'Estado', 'Cantidad', 'Devuelto']),
                    */
                    table(traspaso.listadoProductos,
                        ['producto', 'detalle_id', 'condicion', 'cantidades', 'devuelto'],
                        ['Producto', 'Descripción', 'Estado', 'Cantidad', 'Devuelto']),

                    { text: '\n\n' },

                    // aqui debe ir el listado de devoluciones realizadas

                    /* { text: 'Listado de devoluciones' },
                    function () {
                        {
                            text: traspaso.listadoDevoluciones.forEach((element) => {
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
                                    body: [[' '], [' ']]
                                },
                                margin: [0, 0, 60, 0]
                            },
                            {
                                layout: 'lineaLayout',
                                width: '*',
                                table: {
                                    widths: ['*'],
                                    body: [[' '], [' ']]
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
                                    { text: `${traspaso.solicitante}\n`, style: 'resultStyle', alignment: 'center' },
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



        //configurar los listados
        opciones_clientes.value = listadosAuxiliares.clientes
        opciones_estados.value = listadosAuxiliares.estados
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_tareas.value = listadosAuxiliares.tareas

        return {
            mixin, traspaso, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasTraspasos,
            acciones,
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
            filtroTareas(val) {
                const opcionSeleccionada = listadosAuxiliares.tareas.filter((v) => v.id === val)
                traspaso.hasta_cliente = opcionSeleccionada[0]['cliente_id']

            }


        }

    }
})
