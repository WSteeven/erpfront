// Dependencias
import { configuracionColumnasControlAsistencia } from '../domain/configuracionColumnasReporte'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { tiposJornadas, logoBN, logoColor } from 'config/utils'
import { defineComponent, reactive } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
// import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController'
import { ReporteControlMaterialController } from '../infraestructure/ReporteControlMaterialController'
import { TareaController } from 'pages/tareas/controlTareas/infraestructure/TareaController'
import { GrupoController } from 'pages/tareas/grupos/infraestructure/GrupoController'
import { CustomActionPrompt } from 'components/tables/domain/CustomActionPrompt'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { FiltroReporteMaterial } from '../domain/FiltroReporteMaterial'
import { useNotificaciones } from 'shared/notificaciones'
import { ReporteControlMaterial } from '../domain/ReporteControlMaterial'

//pdfmake
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { buildTableBody } from 'shared/utils'
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs

export default defineComponent({
  components: { TabLayout, EssentialTable, SelectorImagen },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      ReporteControlMaterial,
      new ReporteControlMaterialController()
    )

    const { listadosAuxiliares, listado } = mixin.useReferencias()
    const { cargarVista, obtenerListados, listar, setValidador } = mixin.useComportamiento()

    cargarVista(async () => {
      await obtenerListados({
        tareas: {
          controller: new TareaController(),
          params: { campos: 'id,codigo_tarea,detalle,cliente_id' }
        },
        grupos: {
          controller: new GrupoController(),
          params: { campos: 'id,nombre' }
        }
      })
    })

    const filtroReporteMaterial = reactive(new FiltroReporteMaterial())

    // const { confirmar, prompt, notificarCorrecto } = useNotificaciones()

    // Reglas de validacion
    const reglas = {
      tarea: { required },
      grupo: { required },
      fecha: { required },
    }

    const v$ = useVuelidate(reglas, filtroReporteMaterial)
    // setValidador(v$)

    async function consultarReporte() {
      if (await v$.value.$validate())
        listar(filtroReporteMaterial)
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
          title: `Fecha`,
          author: `Juan Cuesta`,
        },
        background: {
          image: logoBN,
          margin: [50, 250, 50, 50],
          opacity: 0.1
        },
        pageSize: 'A4',
        pageOrientation: 'portrait',
        header:
        {
          columns: [
            {
              image: logoColor,
              width: 70,
              height: 40,
              margin: [5, 2]
            },
            { text: 'CONTROL DE MATERIAL DIARIO', width: 'auto', style: 'header', margin: [85, 20] },
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
                { qr: `Transacción N° 1\n Generado por Juan Cuesta`, fit: '50', alignment: 'right', margin: [0, 0, 5, 0] },
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
                width: '*',
                text: [
                  { text: 'Fecha: ', style: 'defaultStyle' },
                  { text: `01/12/2022`, style: 'resultStyle', }
                ]
              },
              {
                width: '*',
                text: [
                  { text: 'Técnico a cargo: ', style: 'defaultStyle' },
                  { text: `Jaime Pilay`, style: 'resultStyle', }
                ]
              },
            ],

          },
          {
            columns: [
              {
                width: '*',
                text: [
                  { width: 'auto', text: 'Proyecto: ', style: 'defaultStyle' },
                  { width: 'auto', text: `FTTH Cuenca`, style: 'resultStyle', }
                ]
              },
              {
                width: '*',
                text: [
                  { width: 'auto', text: 'Tarea: ', style: 'defaultStyle' },
                  { width: 'auto', text: `C0664`, style: 'resultStyle', }
                ]
              },
            ],
          },
          {
            columns: [
              {
                width: '*',
                text: [
                  { width: 'auto', text: 'Ciudad: ', style: 'defaultStyle' },
                  { width: 'auto', text: `Cuenca`, style: 'resultStyle', }
                ]
              },
            ],
          },
          { text: '\n' },

          table(listado.value,
            ['item', 'detalle_material', 'stock_inicial', 'utilizado', 'stock_final_dia'],
            ['ITEMS', 'DETALLE DEL MATERIAL', 'STOCK INICIAL', 'UTILIZADO', 'STOCK FINAL DIA']),

          { text: '\n\n' },

          { text: '\n\n' },
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

    return {
      v$,
      mixin,
      listar,
      listado,
      filtroReporteMaterial,
      listadosAuxiliares,
      configuracionColumnasControlAsistencia,
      tiposJornadas,
      consultarReporte,
      pdfMakeImprimir,
    }
  },
})
