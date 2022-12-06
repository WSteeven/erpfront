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
                watermark: { text: 'BODEGA JPCONSTRUCRED', opacity: 0.1, bold: true, italics: false },
                pageSize: 'A5',
                pageOrientation: 'landscape',
                pageMargins: [10, 10, 10, 10],

                content: [
                    { text: 'COMPROBANTE DE DEVOLUCIÓN', style: 'header' },
                    { text: '', style: 'hr' },
                    {
                        text: [
                            { text: 'Transaccion N° ', style: 'defaultStyle' },
                            { text: `${devolucionStore.devolucion.id}`, style: 'resultStyle', }
                        ],
                    },
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
                                width: '*',
                                text: [
                                    { text: 'Justificación: ', style: 'defaultStyle' },
                                    { text: `${devolucionStore.devolucion.justificacion}`, style: 'resultStyle', }
                                ]
                            },
                        ],
                        // optional space between columns
                        columnGap: 10
                    },
                    {
                        text: [
                            { text: 'Tarea: ', style: 'defaultStyle' },
                            { text: `${devolucionStore.devolucion.tarea}`, style: 'resultStyle', }
                        ]
                    },
                    {
                        text: [
                            { text: 'Listado: ', style: 'defaultStyle' },
                            { text: `${devolucionStore.devolucion.listadoProductos[0]['descripcion']}`, style: 'resultStyle', }
                        ]
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
                pageBreakBefore: function (currentNode, followingNodesOnPage, nodesOnNextPage, previousNodesOnPage) {
                    return currentNode.headlineLevel === 1 && followingNodesOnPage.length === 0;
                }
            }

            pdfMake.createPdf(docDefinition).open()
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