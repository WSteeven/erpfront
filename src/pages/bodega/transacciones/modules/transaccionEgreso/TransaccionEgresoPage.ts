//Dependencias
import { configuracionColumnasTransaccionEgreso } from '../../domain/configuracionColumnasTransaccionEgreso'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'
import { configuracionColumnasProductosSeleccionados } from '../transaccionContent/domain/configuracionColumnasProductosSeleccionados'
import { configuracionColumnasProductos } from 'pages/bodega/productos/domain/configuracionColumnasProductos'
import { useOrquestadorSelectorItemsTransaccion } from '../transaccionIngreso/application/OrquestadorSelectorDetalles'
import { configuracionColumnasDetallesProductos } from 'pages/bodega/detalles_productos/domain/configuracionColumnasDetallesProductos'
// import { useOrquestadorSelectorDetalles } from '../transaccionIngreso/application/OrquestadorSelectorDetalles'
import { acciones, logoBN, logoColor, meses, opcionesModoAsignacionTrabajo, tabOptionsTransacciones } from 'config/utils'

// Componentes
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionEgresoController } from '../../infraestructure/TransaccionEgresoController'
import { Transaccion } from '../../domain/Transaccion'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'

//Controladores
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { TipoTransaccionController } from 'pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController'
import { MotivoController } from 'pages/administracion/motivos/infraestructure/MotivoController'
import { useNotificaciones } from 'shared/notificaciones'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { EstadosTransaccionController } from 'pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController'
import { DetalleProductoController } from 'pages/bodega/detalles_productos/infraestructure/DetalleProductoController'

import { useAuthenticationStore } from 'stores/authentication'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { TareaController } from 'pages/tareas/controlTareas/infraestructure/TareaController'
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { useTransaccionStore } from 'stores/transaccion'
import { useDetalleTransaccionStore } from 'stores/detalleTransaccion'
import { useDetalleStore } from 'stores/detalle'
import { ComportamientoModalesTransaccionEgreso } from './application/ComportamientoModalesTransaccionEgreso'
import { ClienteController } from 'pages/sistema/clientes/infraestructure/ClienteController'

//pdfmake
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { buildTableBody } from "shared/utils";
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { usePedidoStore } from 'stores/pedido'

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs


export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },
    setup() {
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionEgresoController())
        const { entidad: transaccion, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onConsultado, onReestablecer } = mixin.useHooks()
        const { confirmar, prompt } = useNotificaciones()
        //stores
        useNotificacionStore().setQuasar(useQuasar())
        const store = useAuthenticationStore()
        const transaccionStore = useTransaccionStore()
        const detalleTransaccionStore = useDetalleTransaccionStore()
        const detalle = useDetalleStore()
        const pedidoStore = usePedidoStore()

        const {
            refListadoSeleccionable: refListadoSeleccionableProductos,
            criterioBusqueda: criterioBusquedaProducto,
            listado: listadoProductos,
            listar: listarProductos,
            limpiar: limpiarProducto,
            seleccionar: seleccionarProducto
        } = useOrquestadorSelectorItemsTransaccion(transaccion, 'detalles')


        const usuarioLogueado = store.user
        const esBodeguero = store.esBodeguero
        const esCoordinador = store.esCoordinador
        const rolSeleccionado = (store.user.rol.filter((v) => v.indexOf('BODEGA') > -1 || v.indexOf('COORDINADOR') > -1)).length > 0 ? true : false

        console.log('rol seleccionado: ', rolSeleccionado)

        let soloLectura = ref(false)
        let puedeEditarCantidad = ref(true)
        let puedeDespacharMaterial = ref(false)
        let esVisibleAutorizacion = ref(false)

        let tabSeleccionado = ref()
        let puedeEditar = ref(false)
        let esVisibleTarea = ref(false)
        let esVisibleSubtarea = ref(false)
        let requiereFecha = ref(false) //para mostrar u ocultar fecha limite

        const modales = new ComportamientoModalesTransaccionEgreso()
        // const modales =new ComportamientoModalesTransaccionIngreso()

        const opciones_empleados = ref([])
        const opciones_autorizaciones = ref([])
        const opciones_sucursales = ref([])
        const opciones_tipos = ref([])
        const opciones_motivos = ref([])
        const opciones_estados = ref([])
        const opciones_tareas = ref([])
        const opciones_subtareas = ref([])
        const opciones_clientes = ref([])

        /* function transformarOpcionesTipos() {
            // console.log('llamaste a la funcion')
            if (!esBodeguero) {
                opciones_tipos.value.forEach(element => {
                    if (element.nombre === 'INGRESO') {element.nombre = 'DEVOLUCION'}
                    if (element.nombre === 'EGRESO') {element.nombre = 'SOLICITUD'}
                });
            }
        } */
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
                tipos: {
                    controller: new TipoTransaccionController(),
                    params: { tipo: 'EGRESO' }
                },
                tareas: {
                    controller: new TareaController(),
                    params: { campos: 'id,codigo_tarea,detalle,cliente_id' }
                },
                /* subtareas: {
                    controller: new SubtareaController(),
                    params: {
                        campos: 'id,codigo_subtarea,detalle',
                        estados: [estadosSubtareas.ASIGNADO, estadosSubtareas.EJECUTANDO, estadosSubtareas.PAUSADO]
                    }
                }, */
                motivos: { controller: new MotivoController(), params: { tipo_transaccion_id: 2 } },
                autorizaciones: {
                    controller: new AutorizacionController(),
                    params: {
                        campos: 'id,nombre'
                    }
                },
                /* estados: {
                    controller: new EstadosTransaccionController(),
                    params: {
                        campos: 'id,nombre'
                    }
                }, */
                detalles: {
                    controller: new DetalleProductoController(),
                    params: {
                        campos: 'id,producto_id,descripcion,modelo_id,serial'
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
            // transformarOpcionesTipos()
            if(pedidoStore.pedido) {
                // console.log('pedidoStore en EGRESO:',pedidoStore.pedido)
                transaccion.tiene_pedido = true
                transaccion.tarea = pedidoStore.pedido.tarea
                cargarDatos()
                transaccion.solicitante = pedidoStore.pedido.solicitante_id
                transaccion.sucursal = pedidoStore.pedido.sucursal_id
            }
        })
        
        //hooks
        onReestablecer(() => {
            puedeEditarCantidad.value = true
            soloLectura.value = false
        })
        onConsultado(() => {
            // transaccionStore.transaccion.hydrate(transaccion)
            console.log('Transaccion', transaccion)
            if (transaccion.per_retira) {
                transaccion.retira_tercero = true
            }
            if (usuarioLogueado.id === transaccion.solicitante_id) {
                soloLectura.value = false
                esCoordinador ? puedeEditarCantidad.value = true : puedeEditarCantidad.value = false
            } else {
                soloLectura.value = true
                esBodeguero ? puedeEditarCantidad.value = false : puedeEditarCantidad.value = true
            }
            if (accion.value === acciones.editar && esBodeguero) {//cuando presiona editar
                soloLectura.value = true
                puedeDespacharMaterial.value = true
            }
            if (accion.value === acciones.consultar) {//cuando presiona consultar
                soloLectura.value = false
                puedeEditarCantidad.value = false
                puedeDespacharMaterial.value = false
            }
        })



        //Reglas de validacion
        const reglas = {
            justificacion: { required },
            sucursal: { required },
            // tipo: { required },
            cliente: { requiredIfBodeguero: requiredIf(esBodeguero) },
            motivo: { requiredIfBodeguero: requiredIf(esBodeguero) },
            tarea: { requiredIfTarea: requiredIf(transaccion.es_tarea) },
            autorizacion: {
                requiredIfCoordinador: requiredIf(esCoordinador),
                requiredIfEsVisibleAut: requiredIf(false)
            },
            //estado: { requiredIfBodega: requiredIf(esBodeguero), },
            observacion_aut: {
                requiredIfObsAutorizacion: requiredIf(false)
                // requiredIfObsAutorizacion: requiredIf(function () { return transaccion.tiene_obs_autorizacion })
            },
            observacion_est: {
                requiredIfObsEstado: requiredIf(false)
                // requiredIfObsEstado: requiredIf(function () { return transaccion.tiene_obs_estado })
            },
            listadoProductosTransaccion: { required }//validar que envien datos en el listado
        }
        const v$ = useVuelidate(reglas, transaccion)
        setValidador(v$.value)



        function eliminar({ entidad, posicion }) {
            confirmar('¿Está seguro de continuar?',
                () => transaccion.listadoProductosTransaccion.splice(posicion, 1))
        }
        const botonEliminar: CustomActionTable = {
            titulo: 'Quitar',
            color: 'negative',
            icono: 'bi-x',
            accion: ({ entidad, posicion }) => {
                eliminar({ entidad, posicion })
            },
            visible: () => puedeEditarCantidad.value
        }
        const botonEditarCantidad: CustomActionTable = {
            titulo: 'Cantidad',
            icono: 'bi-pencil',
            accion: ({ posicion }) => {
                const config: CustomActionPrompt = {
                    titulo: 'Confirmación',
                    mensaje: 'Ingresa la cantidad',
                    defecto: transaccion.listadoProductosTransaccion[posicion].cantidad,
                    tipo: 'number',
                    accion: (data) => {
                        transaccion.listadoProductosTransaccion[posicion].cantidad = data
                    },
                }

                prompt(config)
            },
            visible: () => puedeEditarCantidad.value
        }
        const botonDespachar: CustomActionTable = {
            titulo: 'Despachar',
            accion: async ({ entidad, posicion }) => {
                // console.log('La entidad es', entidad)
                // console.log('La posicion es', posicion)
                transaccionStore.idTransaccion = entidad.id
                await transaccionStore.cargarTransaccion(entidad.id)
                await detalleTransaccionStore.cargarDetalleEspecifico(transaccionStore.transaccion.id, entidad.listadoProductosTransaccion[posicion]['id'])
                // console.log('La transaccion del store', transaccionStore.transaccion)

                //aqui va toda la logica de los despachos de material
                await transaccionStore.showPreview()
                modales.abrirModalEntidad('DespacharPage')
            },
            // visible: ({ entidad, posicion }) => puedeDespacharMaterial.value
            visible: ({ entidad, posicion }) => puedeEditar.value && esBodeguero
            // }
        }

        const empleadoRetira = ref()
        const botonImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad, posicion }) => {
                transaccionStore.idTransaccion = entidad.id
                await transaccionStore.showPreview()
                transaccion.hydrate(transaccionStore.transaccion)
                const response = await new EmpleadoController().consultar(transaccion.per_retira_id)
                empleadoRetira.value = response.response.data.modelo
                console.log(transaccion)
                // console.log(empleadoRetira)
                // modales.abrirModalEntidad("TransaccionEgresoImprimirPage")
                pdfMakeImprimir()
            },
            //visible: () => accion.value === acciones.nuevo || accion.value === acciones.editar
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

            var docDefinition = {
                info: {
                    title: `Transacción N° ${transaccion.id}`,
                    author: `${store.user.nombres} ${store.user.apellidos}`,
                },
                background: {
                    image: logoBN,
                    margin: [50, 80, 50, 50],
                    opacity: 0.1
                },
                pageSize: 'A5',
                pageOrientation: 'landscape',
                header:
                {
                    columns: [
                        {
                            image: logoColor,
                            width: 70,
                            height: 40,
                            margin: [5, 2]
                        },
                        { text: 'COMPROBANTE DE EGRESO', width: 'auto', style: 'header', margin: [85, 20] },
                        { text: 'Sistema de Bodega', alignment: 'right', margin: [5, 20, 5] }
                    ],
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
                                { qr: `Transacción N° ${transaccion.id}\n Generado por ${store.user.nombres} ${store.user.apellidos}, el ${f.getDate()} de ${meses[f.getMonth()]} de ${f.getFullYear()}, ${f.getHours()}:${f.getMinutes()}:${f.getSeconds()}`, fit: '50', alignment: 'right', margin: [0, 0, 5, 0] },
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
                                    { text: `${transaccion.id}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: '*',
                                text: [
                                    { text: 'Fecha: ', style: 'defaultStyle' },
                                    { text: `${transaccion.created_at}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // fixed width
                                width: '*',
                                text: [
                                    { text: 'Solicitante: ', style: 'defaultStyle' },
                                    { text: `${transaccion.solicitante}`, style: 'resultStyle', }
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
                                    { width: 'auto', text: `${transaccion.sucursal}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: 'auto',
                                columns: [
                                    { width: 'auto', text: 'Justificación: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${transaccion.justificacion}`, style: 'resultStyle', }
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
                                    { width: 'auto', text: ` ${transaccion.tarea}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: 'auto',
                                columns: [
                                    { width: 'auto', text: 'Estado: ', style: 'defaultStyle' },
                                    { width: 'auto', text: `${transaccion.estado}`, style: 'resultStyle', }
                                ],
                            },
                        ]
                    },
                    { text: '\n' },

                    /* 
                    ['producto', 'detalle_id', 'cliente_id', 'condicion', 'cantidades', 'devuelto'],
                        ['Producto', 'Descripción', 'Propietario', 'Estado', 'Cantidad', 'Devuelto']),
                    */
                    table(transaccion.listadoProductosTransaccion,
                        ['producto', 'descripcion', 'categoria', 'cantidad'],
                        ['Producto', 'Descripción', 'Estado', 'Cantidad']),

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
                                    { text: `${transaccion.solicitante}\n`, style: 'resultStyle', alignment: 'center' },
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
                                    { text: `${transaccion.per_retira} \n`, style: 'resultStyle', alignment: 'center' },
                                    { text: `C.I: ${empleadoRetira.value.identificacion}\n`, style: 'resultStyle', margin: [60, 0, 0, 0], alignment: 'center' }
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
        async function llenarTransaccion(id: number) {
            limpiarTransaccion()
            await pedidoStore.cargarPedido(id)
            cargarDatos()
            console.log(pedidoStore.pedido)
        }
        function cargarDatos() {
            transaccion.pedido = pedidoStore.pedido.id
            transaccion.justificacion = pedidoStore.pedido.justificacion
            transaccion.solicitante = pedidoStore.pedido.solicitante
            transaccion.sucursal = pedidoStore.pedido.sucursal
            if (pedidoStore.pedido.tarea) {
                transaccion.es_tarea = true
                transaccion.tarea = pedidoStore.pedido.tarea
                filtroTareas(transaccion.tarea)
            }
            transaccion.listadoProductosTransaccion = pedidoStore.pedido.listadoProductos
        }

        function limpiarTransaccion() {
            transaccion.pedido = ''
            transaccion.justificacion = ''
            transaccion.solicitante = ''
            transaccion.sucursal = ''
            transaccion.tarea = ''
            transaccion.es_tarea = false
            transaccion.cliente = ''
            transaccion.listadoProductosTransaccion = []
        }

        // console.log('es bodeguero?', esBodeguero)
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


        //Configurar los listados
        opciones_empleados.value = listadosAuxiliares.empleados
        opciones_sucursales.value = listadosAuxiliares.sucursales
        opciones_tipos.value = listadosAuxiliares.tipos
        opciones_motivos.value = listadosAuxiliares.motivos
        opciones_autorizaciones.value = listadosAuxiliares.autorizaciones
        opciones_estados.value = listadosAuxiliares.estados
        opciones_tareas.value = listadosAuxiliares.tareas
        opciones_subtareas.value = listadosAuxiliares.subtareas
        opciones_clientes.value = listadosAuxiliares.clientes

        function filtroTareas(val) {
            console.log('val recibido', val)
            const opcion_encontrada = listadosAuxiliares.tareas.filter((v) => v.id === val||v.detalle==val)
            console.log(listadosAuxiliares.tareas)
            console.log('cliente_encontrado', opcion_encontrada[0])
            console.log('cliente_encontrado', opcion_encontrada[0]['cliente_id'])
            transaccion.cliente = opcion_encontrada[0]['cliente_id']
            transaccion.tarea = opcion_encontrada[0]['id']
        }
        /* function filtroSolicitante(val){
            const opcion_encontrada = listadosAuxiliares.empleados.filter((v)=>v.id===val)
        } */
        return {
            mixin, transaccion, disabled, accion, v$, soloLectura,
            configuracionColumnas: configuracionColumnasTransaccionEgreso,
            acciones,
            //listados
            opciones_empleados,
            opciones_sucursales,
            opciones_tipos,
            opciones_motivos,
            opciones_autorizaciones,
            opciones_estados,
            opciones_tareas,
            opciones_subtareas,
            opciones_clientes,

            //variables auxiliares
            esVisibleAutorizacion,
            esVisibleTarea,
            esVisibleSubtarea,
            requiereFecha,

            //modales
            modales,

            //filtros
            filtroTareas,
            filtroTipos(val) {
                const tipoSeleccionado = listadosAuxiliares.tipos.filter((v) => v.id === val)
                opciones_motivos.value = listadosAuxiliares.motivos.filter((v) => v.tipo_transaccion_id === val)
                transaccion.motivos = ''
                if (opciones_motivos.value.length > 1) transaccion.motivo = ''
                if (opciones_motivos.value.length === 1) transaccion.motivo = opciones_motivos.value[0]['id']
            },
            filtroMotivos(val) {
                console.log('filtro motivos', val)
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
            retiraOtro(val, evt) {
                if (!val) {
                    transaccion.per_retira = store.user.id
                }
            },

            checkPedido(val, evt) {
                console.log('Pedido', val)
                if (!val) {
                    limpiarTransaccion()
                }
            },


            //tabla
            configuracionColumnasProductosSeleccionadosAccion,
            configuracionColumnasProductosSeleccionados,
            configuracionColumnasDetallesProductos,
            botonEditarCantidad,
            botonDespachar,
            botonEliminar,
            botonImprimir,
            eliminar,

            //selector
            refListadoSeleccionableProductos,
            criterioBusquedaProducto,
            listadoProductos,
            listarProductos,

            limpiarProducto,
            seleccionarProducto,
            configuracionColumnasProductos,

            //rol
            rolSeleccionado,
            esBodeguero,
            esCoordinador,

            llenarTransaccion,
            limpiarTransaccion,

            //tabs y filtros
            tabOptionsTransacciones,
            puedeEditar,
            tabSeleccionado,

            tabEs(val) {
                tabSeleccionado.value = val
                puedeEditar.value = (esBodeguero && tabSeleccionado.value === 'PENDIENTE') || (esBodeguero && tabSeleccionado.value === 'PARCIAL')
                    ? true
                    : esCoordinador && tabSeleccionado.value === 'ESPERA'
                        ? true
                        : false

            },
            //accion que se envia
            // accionDespachar: botonDespachar,



        }
    }
})