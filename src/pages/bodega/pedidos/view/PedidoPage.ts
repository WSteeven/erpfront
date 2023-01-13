//Dependencias
import { configuracionColumnasPedidos } from '../domain/configuracionColumnasPedidos';
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";
import { useOrquestadorSelectorDetalles } from 'pages/bodega/pedidos/application/OrquestadorSelectorDetalles';

//Componentes
// import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from "components/tables/view/EssentialTable.vue";
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { PedidoController } from '../infraestructura/PedidoController';
import { Pedido } from '../domain/Pedido';

import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { SucursalController } from "pages/administracion/sucursales/infraestructure/SucursalController";
import { TareaController } from "pages/tareas/controlTareas/infraestructure/TareaController";
import { configuracionColumnasProductosSeleccionadosAccion } from "../domain/configuracionColumnasProductosSeleccionadosAccion";
import { configuracionColumnasProductosSeleccionados } from "../domain/configuracionColumnasProductosSeleccionados";
import { configuracionColumnasDetallesModal } from "../domain/configuracionColumnasDetallesModal";
import { useNotificaciones } from "shared/notificaciones";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { acciones, estadosDevoluciones, estadosTransacciones, logoBN, logoColor, meses, tabOptionsPedidos } from "config/utils";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { endpoints } from "config/api";
import html2pdf from 'html2pdf.js'
// import { ComportamientoModalesDevoluciones } from "../application/ComportamientoModalesDevolucion";

//pdfmake
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { useAuthenticationStore } from "stores/authentication";
import * as fs from 'fs'
import { buildTableBody, notificarMensajesError } from "shared/utils";
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt';
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController';
import { EstadosTransaccionController } from 'pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController';
import { usePedidoStore } from 'stores/pedido';
import { getPackedSettings } from 'http2';
import { useRouter } from 'vue-router';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs


export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },

    setup() {
        const mixin = new ContenedorSimpleMixin(Pedido, new PedidoController())
        const { entidad: pedido, disabled, accion, listadosAuxiliares, listado } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer, onConsultado } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()

        //stores
        const pedidoStore = usePedidoStore()
        const store = useAuthenticationStore()
        const router = useRouter()

        //modales
        // const modales = new ComportamientoModalesDevoluciones()

        //orquestador
        const {
            refListadoSeleccionable: refListado,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorDetalles(pedido, 'detalles')

        //flags
        let tabSeleccionado = ref()
        let soloLectura = ref(false)
        let esVisibleTarea = ref(false)
        let requiereFecha = ref(false)
        let puedeEditar = ref(false)

        const esCoordinador = store.esCoordinador
        const esBodeguero = store.esBodeguero



        onReestablecer(() => {
            soloLectura.value = false
        })
        onConsultado(() => {
            console.log(accion.value)
            if (accion.value === acciones.editar && esCoordinador) {
                soloLectura.value = true
            }
        })

        const opciones_empleados = ref([])
        const opciones_sucursales = ref([])
        const opciones_tareas = ref([])
        const opciones_autorizaciones = ref([])
        const opciones_estados = ref([])
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
                    params: { campos: 'id,codigo_tarea,detalle,cliente_id' }
                },
                sucursales: {
                    controller: new SucursalController(),
                    params: { campos: 'id,lugar' },
                },
                autorizaciones: {
                    controller: new AutorizacionController(),
                    params: { campos: 'id,nombre' },
                },
                estados: {
                    controller: new EstadosTransaccionController(),
                    params: { campos: 'id,nombre' },
                },
            })
        })

        //reglas de validacion
        const reglas = {
            justificacion: { required },
            autorizacion: { requiredIfCoordinador: requiredIf(esCoordinador) },
            observacion_aut: { requiredIfCoordinador: requiredIf(pedido.tiene_obs_autorizacion) },
            sucursal: { required },
            tarea: { requiredIfTarea: requiredIf(pedido.es_tarea) },
        }

        const v$ = useVuelidate(reglas, pedido)
        setValidador(v$.value)

        function eliminar({ entidad, posicion }) {
            confirmar('¿Está seguro de continuar?',
                () => pedido.listadoProductos.splice(posicion, 1))
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
                const data: CustomActionPrompt = {
                    titulo: 'Modifica',
                    mensaje: 'Ingresa la cantidad',
                    defecto: pedido.listadoProductos[posicion].cantidad,
                    accion: (data) => pedido.listadoProductos[posicion].cantidad = data,
                }
                prompt(data)
            },
            visible: () => {
                return accion.value == acciones.consultar ? false : true
            }
        }

        const botonDespachar: CustomActionTable = {
            titulo: 'Despachar',
            color: 'primary',
            icono: 'bi-pencil-square',
            accion: ({ entidad, posicion }) => {
                // router.replace({'transacciones_egresos'})
                pedidoStore.pedido = entidad
                router.push('transacciones-egresos')
                console.log(posicion)
                console.log(pedidoStore.pedido)
                console.log(entidad)
            },
            visible: ({ entidad, posicion }) => { 
                return tabSeleccionado.value == 'APROBADO' && esBodeguero && entidad.estado!=estadosTransacciones.completa ? true : false }
        }

        const botonImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad, posicion }) => {
                pedidoStore.idPedido = entidad.id
                // modales.abrirModalEntidad("ImprimirDevolucionPage")
                await pedidoStore.showPreview()
                console.log(pedidoStore.pedido)
                console.log(pedidoStore.pedido.listadoProductos)
                console.log(pedidoStore.pedido.listadoProductos.flatMap((v) => v))
                pdfMakeImprimir()
            },
            visible: () => tabSeleccionado.value == 'APROBADO' ? true : false
        }
        //construccion de la tabla para imprimir
        function table(data, columns, encabezados) {
            // const columnas =['Producto', 'Descripción', 'Categoría', 'Cantidad']
            return {
                // style:'tableExample',
                layout: 'lightHorizontalLines',
                table: {
                    headerRows: 1,
                    body: buildTableBody(data, columns, encabezados),

                }
            }
        }

        const f = new Date();

        function pdfMakeImprimir() {
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
            var dd = {
                // watermark: { text: 'BODEGA JPCONSTRUCRED', opacity: 0.1, bold: true, italics: false },
                info: {
                    title: `Pedido ${pedidoStore.pedido.id}`,
                    author: `${store.user.nombres} ${store.user.apellidos}`,
                },
                background: {
                    image: logoBN,
                    margin: [50, 50, 50, 50],
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
                        { text: 'COMPROBANTE DE PEDIDO', width: 'auto', style: 'header', margin: [85, 20] },
                        { text: 'Sistema de Bodega', alignment: 'right', margin: [5, 20, 5] }
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
                                { qr: `Pedido N° ${pedidoStore.pedido.id}\n Generado por ${store.user.nombres} ${store.user.apellidos}, el ${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}, ${f.getHours()}:${f.getMinutes()}:${f.getSeconds()}`, fit: '50', alignment: 'right', margin: [0, 0, 5, 0] },
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
                                    { text: `${pedidoStore.pedido.id}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: '*',
                                text: [
                                    { text: 'Fecha: ', style: 'defaultStyle' },
                                    { text: `${pedidoStore.pedido.created_at}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // fixed width
                                width: '*',
                                text: [
                                    { text: 'Solicitante: ', style: 'defaultStyle' },
                                    { text: `${pedidoStore.pedido.solicitante}`, style: 'resultStyle', }
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
                                    { width: 'auto', text: `${pedidoStore.pedido.sucursal}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: 'auto',
                                columns: [
                                    { width: 'auto', text: 'Justificación: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${pedidoStore.pedido.justificacion}`, style: 'resultStyle', }
                                ],
                            },
                        ],
                    },
                    {
                        columns: [
                            {
                                width: '*',
                                columns: [
                                    { width: 'auto', text: 'Autorizado por: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${pedidoStore.pedido.per_autoriza}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                width: 'auto',
                                columns: [
                                    { width: 'auto', text: 'Estado: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${pedidoStore.pedido.estado}`, style: 'resultStyle', }
                                ]
                            }
                        ]
                    },
                    comprobarTarea(),
                    { text: '\n' },
                    /* {
                        columns: [
                            {
                                width: '*',
                                columns: [
                                    { width: 'auto', text: 'Tarea: ', style: 'defaultStyle', alignment: 'right' },
                                    {
                                        width: 'auto', text: function () {
                                            if (devolucionStore.devolucion.tarea) {
                                                return [` ${devolucionStore.devolucion.tarea}`]
                                            } else
                                                return ['no hay tarea']
                                        }, style: 'resultStyle',
                                    }
                                ]
                            }
                        ]
                    }, */

                    table(pedidoStore.pedido.listadoProductos, ['producto', 'descripcion', 'categoria', 'cantidad'], ['Producto', 'Descripción', 'Categoría', 'Cantidad']),

                    // 'Some long text of variable length ...',
                    // { text: '2 Headline', headlineLevel: 1 },
                    // 'Some long text of variable length ...',
                    // { text: '3 Headline', headlineLevel: 1 },
                    // 'Some long text of variable length ...',
                    { text: '\n\n\n\n' },
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
                                    { text: `${pedidoStore.pedido.solicitante}\n`, style: 'resultStyle', alignment: 'center', },
                                    {
                                        text: [
                                            { text: 'C.I: ', style: 'resultStyle', alignment: 'center', },
                                            { text: `${store.user.identificacion}`, style: 'resultStyle', }
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
            };
            pdfMake.createPdf(dd).open()
        }

        function comprobarTarea() {
            if (pedidoStore.pedido.tarea !== null) {
                return {
                    columns: [
                        {
                            width: '*',
                            columns: [
                                { width: 'auto', text: 'Tarea: ', style: 'defaultStyle', alignment: 'right' },
                                { width: 'auto', text: ` ${pedidoStore.pedido.tarea}`, style: 'resultStyle' }
                            ]
                        }
                    ],
                }
            }
        }

        function actualizarElemento(posicion: number, entidad: any): void {
            if (posicion >= 0) {
                listado.value.splice(posicion, 1, entidad);
                listado.value = [...listado.value];
            }
        }


        //Configurar los listados
        opciones_empleados.value = listadosAuxiliares.empleados
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_tareas.value = listadosAuxiliares.tareas
        opciones_autorizaciones.value = listadosAuxiliares.autorizaciones
        opciones_estados.value = listadosAuxiliares.estados

        return {
            mixin, pedido, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasPedidos,
            //listados
            opciones_empleados,
            opciones_tareas,
            opciones_sucursales,
            opciones_estados,
            opciones_autorizaciones,

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
            botonImprimir,
            botonDespachar,

            //modal
            // modales,

            //flags
            soloLectura,
            esVisibleTarea,
            requiereFecha,

            //Tabs
            tabOptionsPedidos,
            tabSeleccionado,
            puedeEditar,
            esCoordinador, esBodeguero,

            tabEs(val) {
                // console.log(tabSeleccionado.value)
                // console.log(val)
                tabSeleccionado.value = val
                puedeEditar.value = (esBodeguero && tabSeleccionado.value === 'PENDIENTE') || (esBodeguero && tabSeleccionado.value === 'PARCIAL')
                    ? true
                    : esCoordinador && tabSeleccionado.value === 'PENDIENTE'
                        ? true
                        : false
            },

            //Filtros
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