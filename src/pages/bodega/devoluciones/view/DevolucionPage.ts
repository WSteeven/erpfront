//Dependencias
import { configuracionColumnasDevoluciones } from "../domain/configuracionColumnasDevoluciones";
import { required, requiredIf } from "@vuelidate/validators";
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from "vue";
import { useOrquestadorSelectorDetalles } from "../application/OrquestadorSelectorDetalles";

//Componentes
// import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
import TabLayoutFilterTabs from 'shared/contenedor/modules/simple/view/TabLayoutFilterTabs.vue'
import EssentialTable from "components/tables/view/EssentialTable.vue";
import EssentialSelectableTable from 'components/tables/view/EssentialSelectableTable.vue'
import ModalesEntidad from "components/modales/view/ModalEntidad.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { DevolucionController } from "../infraestructure/DevolucionController";
import { Devolucion } from "../domain/Devolucion";

import { EmpleadoController } from "pages/recursosHumanos/empleados/infraestructure/EmpleadoController";
import { SucursalController } from "pages/administracion/sucursales/infraestructure/SucursalController";
import { TareaController } from "pages/tareas/controlTareas/infraestructure/TareaController";
import { configuracionColumnasProductosSeleccionadosAccion } from "../domain/configuracionColumnasProductosSeleccionadosAccion";
import { configuracionColumnasProductosSeleccionados } from "../domain/configuracionColumnasProductosSeleccionados";
import { configuracionColumnasDetallesModal } from "../domain/configuracionColumnasDetallesModal";
import { useNotificaciones } from "shared/notificaciones";
import { CustomActionTable } from "components/tables/domain/CustomActionTable";
import { acciones, estadosDevoluciones, tabOptionsDevoluciones } from "config/utils";
import { AxiosHttpRepository } from "shared/http/infraestructure/AxiosHttpRepository";
import { endpoints } from "config/api";
import html2pdf from 'html2pdf.js'
import { ComportamientoModalesDevoluciones } from "../application/ComportamientoModalesDevolucion";
import { useDevolucionStore } from "stores/devolucion";

//pdfmake
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { useAuthenticationStore } from "stores/authentication";
import * as fs from 'fs'

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs


export default defineComponent({
    components: { TabLayoutFilterTabs, EssentialTable, EssentialSelectableTable, ModalesEntidad },

    setup() {
        const mixin = new ContenedorSimpleMixin(Devolucion, new DevolucionController())
        const { entidad: devolucion, disabled, accion, listadosAuxiliares, listado, currentPageListado } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()
        const { onReestablecer } = mixin.useHooks()
        const { confirmar, prompt } = useNotificaciones()

        //stores
        const devolucionStore = useDevolucionStore()
        const store = useAuthenticationStore()

        //modales
        const modales = new ComportamientoModalesDevoluciones()

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
        const opciones_sucursales = ref([])
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
                    params: { campos: 'id,codigo_tarea,detalle,cliente_id' }
                },
                sucursales: {
                    controller: new SucursalController(),
                    params: { campos: 'id,lugar' },
                },
            })
        })

        //reglas de validacion
        const reglas = {
            justificacion: { required },
            // solicitante:{required},
            sucursal: { required },
            tarea: { requiredIfTarea: requiredIf(devolucion.es_tarea) },
        }

        const v$ = useVuelidate(reglas, devolucion)
        setValidador(v$.value)

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
            accion: ({ posicion }) => {
                prompt('Ingresa la cantidad',
                    (data) => devolucion.listadoProductos[posicion].cantidad = data,
                    devolucion.listadoProductos[posicion].cantidad
                )
            },
            visible: () => {
                return accion.value == acciones.consultar ? false : true
            }
        }
        const botonAnular: CustomActionTable = {
            titulo: 'Anular',
            icono: 'bi-x',
            accion: ({ entidad, posicion }) => {
                confirmar('Está seguro de anular la devolución?', () => {
                    anularDevolucion(entidad.id)
                    entidad.estado = estadosDevoluciones.ANULADA
                    actualizarElemento(posicion, entidad)
                })
                console.log('entidad', entidad)
                console.log('posicion', posicion)
            },
            visible: () => {
                return tabSeleccionado.value == 'CREADA' ? true : false
            }
        }
        const botonImprimir: CustomActionTable = {
            titulo: 'Imprimir',
            color: 'secondary',
            icono: 'bi-printer',
            accion: async ({ entidad, posicion }) => {
                devolucionStore.idDevolucion = entidad.id
                // modales.abrirModalEntidad("ImprimirDevolucionPage")
                await devolucionStore.showPreview()
                console.log(devolucionStore.devolucion.listadoProductos)
                console.log(devolucionStore.devolucion.listadoProductos.flatMap((v) => v))
                pdfMakeImprimir()



            },
            //visible: () => accion.value === acciones.nuevo || accion.value === acciones.editar
        }
        function buildTableBody(data, columns) {
            var body = []
            const columnas = ['Id', 'Producto', 'Descripción', 'Categoría', 'Cantidad']
            body.push(columnas)

            data.forEach(function (row) {
                var dataRow = []
                console.log(row)
                columns.forEach(function (column) {
                    dataRow.push(row[column])
                });
                body.push(dataRow)
            });
            return body
        }
        function table(data, columns) {
            return {
                table: {
                    headerRows: 1,
                    body: buildTableBody(data, columns)
                }
            }
        }

        function base64Encode() {
            //read binary data
            var bitmap = fs.readFileSync('assets/logoJP.png')
            var imagen = fs.readFileSync('./logoJP.png');
            return bitmap.toString('base64')
            // return imagen
        }
        var base64String = ''
        function base64Imagen() {
            var reader = new FileReader()

        }

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
                }
            }
            var docDefinition = {
                content: [
                    // if you don't need styles, you can use a simple string to define a paragraph
                    'This is a standard paragraph, using default style',
                
                    // using a { text: '...' } object lets you set styling properties
                    { text: 'This paragraph will have a bigger font', fontSize: 15 },
                
                    // if you set the value of text to an array instead of a string, you'll be able
                    // to style any part individually
                    {
                      text: [
                        'This paragraph is defined as an array of elements to make it possible to ',
                        { text: 'restyle part of it and make it bigger ', fontSize: 15 },
                        'than the rest.'
                      ]
                    }
                  ]
            }

            var dd = {
                watermark: { text: 'BODEGA JPCONSTRUCRED', opacity: 0.1, bold: true, italics: false },
                header: {
                    columns: [
                        {
                            image: 'data:image/png;base64,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',
                            width: 70,
                            height: 40,
                            margin: [5, 2]
                        },
                        { text: 'Sistema de Bodega', alignment: 'right', margin: [5, 2] }
                    ]
                },
                pageSize: 'A5',
                pageOrientation: 'landscape',
                footer: function (currentPage, pageCount) {
                    return [
                        {
                            columns: [
                                {
                                    width: '*',
                                    text: currentPage.toString() + ' de ' + pageCount,
                                    margin: [5, 2]
                                },
                                { text: 'pie de pagina', alignment: 'right', margin: [5, 2] }
                            ]
                        }
                    ]
                },

                content: [
                    { text: 'COMPROBANTE DE DEVOLUCIÓN', style: 'header' },
                    {
                        columns: [
                            {
                                // auto-sized columns have their widths based on their content
                                width: '*',
                                text: [
                                    { text: 'Transaccion N° ', style: 'defaultStyle' },
                                    { text: `${devolucionStore.devolucion.id}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: '*',
                                text: [
                                    { text: 'Fecha: ', style: 'defaultStyle' },
                                    { text: `${devolucionStore.devolucion.created_at}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // fixed width
                                width: '*',
                                text: [
                                    { text: 'Solicitante: ', style: 'defaultStyle' },
                                    { text: `${devolucionStore.devolucion.solicitante}`, style: 'resultStyle', }
                                ]
                            },
                        ],
                        // optional space between columns
                        columnGap: 10
                    },
                    {
                        columns: [
                            {
                                // auto-sized columns have their widths based on their content
                                width: '*',
                                text: [
                                    { text: 'Sucursal: ', style: 'defaultStyle' },
                                    { text: `${devolucionStore.devolucion.sucursal}`, style: 'resultStyle', }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: 'auto',
                                text: [
                                    { text: 'Justificación: ', style: 'defaultStyle' },
                                    { text: `${devolucionStore.devolucion.justificacion}`, style: 'resultStyle', }
                                ]
                            },
                        ],
                        // optional space between columns
                        columnGap: 10
                    },

                    function () {
                        if (devolucionStore.devolucion.tarea) {
                            return [
                                { text: 'Tarea: ', style: 'defaultStyle' },
                                { text: `${devolucionStore.devolucion.tarea}`, style: 'resultStyle', }
                            ]
                        }
                    },
                    table(devolucionStore.devolucion.listadoProductos, ['id', 'producto', 'descripcion', 'categoria', 'cantidad']),

                    // 'Some long text of variable length ...',
                    // { text: '2 Headline', headlineLevel: 1 },
                    // 'Some long text of variable length ...',
                    // { text: '3 Headline', headlineLevel: 1 },
                    // 'Some long text of variable length ...',
                    '',
                    '',
                    '',
                    {
                        columns: [
                            {
                                // auto-sized columns have their widths based on their content
                                width: '*',
                                text: [
                                    { text: 'ENTREGA ', style: 'resultStyle', align: 'center' },
                                    { text: `${devolucionStore.devolucion.solicitante}`, style: 'resultStyle', },
                                    {
                                        text: [
                                            { text: 'C.I:', style: 'resultStyle' },
                                            { text: `${store.user.identificacion}`, style: 'resultStyle', }
                                        ]
                                    }
                                ]
                            },
                            {
                                // star-sized columns fill the remaining space
                                // if there's more than one star-column, available width is divided equally
                                width: '*',
                                text: [
                                    { text: 'RECIBE ', style: 'resultStyle', align: 'center' },
                                    { text: 'BODEGUERO:', style: 'resultStyle', },
                                    { text: 'C.I:', style: 'resultStyle', }
                                ]
                            },
                        ],
                        // optional space between columns
                        columnGap: 10
                    }
                ],
                styles: {
                    header: {
                        fontSize: 18,
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

        async function anularDevolucion(id: number) {
            try {
                const axios = AxiosHttpRepository.getInstance()
                const ruta = axios.getEndpoint(endpoints.devoluciones) + 'anular/' + id
                axios.post(ruta);
            } catch (e: any) {
                console.log('Entró al catch de anular devolución: ', e)
            }
            // listar()
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

        return {
            mixin, devolucion, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasDevoluciones,
            //listados
            opciones_empleados,
            opciones_tareas,
            opciones_sucursales,

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

            //modal
            modales,

            //flags
            soloLectura,
            esVisibleTarea,

            //Tabs
            tabOptionsDevoluciones,
            tabSeleccionado,

            tabEs(val) {
                console.log(tabSeleccionado.value)
                console.log(val)
                tabSeleccionado.value = val
            },

            //Filtros
            filtroTareas(val) {
                // const opcion_encontrada = listadosAuxiliares.tareas.filter((v) => v.id === val)
                // console.log('cliente_encontrado', opcion_encontrada[0]['cliente_id'])
                // devolucion.cliente = opcion_encontrada[0]['cliente_id']
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