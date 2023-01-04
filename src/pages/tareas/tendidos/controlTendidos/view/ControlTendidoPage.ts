// Dependencias
import { configuracionColumnasControlTendido } from '../domain/configuracionColumnasControlTendido'
import {
  tiposElementos,
  propietariosElementos,
  estadoElementos,
  accionesTabla,
  sistemasCoordenadas,
  bobinasSolicitadas,
  acciones,
} from 'config/utils'
import { useTendidoStore } from 'stores/tendido'
import { computed, defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { logoBN, logoColor } from 'config/utils'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'
import LabelAbrirModal from 'components/modales/modules/LabelAbrirModal.vue'
import EssentialTable from 'components/tables/view/EssentialTable.vue'
import ModalesEntidad from 'components/modales/view/ModalEntidad.vue'
import SelectorImagen from 'components/SelectorImagen.vue'

// Logica y controladores
import { RegistroTendidoController } from '../modules/registrosTendidos/infraestructure/RegistroTendidoController'
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { ComportamientoModalesProgresiva } from '../application/ComportamientoModalesProgresiva'
import { ControlTendidoController } from '../infraestructure/ControlTendidoController'
import { CustomActionTable } from 'components/tables/domain/CustomActionTable'
import { BobinaController } from '../infraestructure/BobinaController'
import { useTrabajoAsignadoStore } from 'stores/trabajoAsignado'
import { Tendido } from '../domain/Tendido'
import { RegistroTendido } from '../modules/registrosTendidos/domain/RegistroTendido'

// PDFmake
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import { buildTableBody } from "shared/utils";
(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs

export default defineComponent({
  components: {
    TabLayout,
    SelectorImagen,
    LabelAbrirModal,
    ModalesEntidad,
    EssentialTable,
  },
  setup() {
    const mixin = new ContenedorSimpleMixin(
      Tendido,
      new ControlTendidoController()
    )

    const { entidad: progresiva, listadosAuxiliares } = mixin.useReferencias()
    const { guardar, consultar, cargarVista, obtenerListados, setValidador } = mixin.useComportamiento()
    const { onBeforeGuardar } = mixin.useHooks()

    const tendidoStore = useTendidoStore()

    // Mixin 
    const mixinRegistroTendido = new ContenedorSimpleMixin(RegistroTendido, new RegistroTendidoController())
    const { entidad: registroTendido, listado: listadoRegistrosTendidos } = mixinRegistroTendido.useReferencias()
    const { listar: listarRegistrosTendidos } = mixinRegistroTendido.useComportamiento()
    const entidadReset = new RegistroTendido()

    listarRegistrosTendidos()

    cargarVista(async () => {
      await obtenerListados({
        bobinas: {
          controller: new BobinaController(),
          params: {
            tarea: 2,
            grupo: 1,
          }
        },
      })
    })

    const trabajoAsignadoStore = useTrabajoAsignadoStore()

    const setBase64 = (file: File) => {
      if (file !== null && file !== undefined) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => (progresiva.imagen = reader.result)
      } else {
        progresiva.imagen = file
      }
    }

    const agregarProgresiva: CustomActionTable = {
      titulo: 'Agregar nuevo elemento',
      icono: 'bi-plus',
      color: 'secondary',
      accion: () => {
        modales.abrirModalEntidad('RegistroTendidoPage')
        tendidoStore.idTendido = progresiva.id
        registroTendido.hydrate(entidadReset)
        tendidoStore.idRegistroTendido = null
      },
    }

    function consultarRegistro({ entidad }) {
      modales.abrirModalEntidad('RegistroTendidoPage')
      tendidoStore.idTendido = progresiva.id
      tendidoStore.accion = acciones.consultar
      tendidoStore.idRegistroTendido = entidad.id
    }

    function editarRegistro({ entidad }) {
      modales.abrirModalEntidad('RegistroTendidoPage')
      tendidoStore.idTendido = progresiva.id
      tendidoStore.accion = acciones.editar
      tendidoStore.idRegistroTendido = entidad.id
    }

    onBeforeGuardar(() => progresiva.subtarea = trabajoAsignadoStore.idSubtareaSeleccionada)

    const modales = new ComportamientoModalesProgresiva()

    const router = useRouter()

    if (trabajoAsignadoStore.idSubtareaSeleccionada) {
      consultar({ id: trabajoAsignadoStore.idSubtareaSeleccionada })
    } else {
      router.replace({ name: 'trabajo_asignado' })
    }

    // Reglas de validacion
    const reglas = {
      bobina: { required },
    }

    const v$ = useVuelidate(reglas, progresiva)
    setValidador(v$.value)

    // Impresion de PDF
    function table(data, columns, encabezados) {
      return {
        layout: 'listadoLayout',
        table: {
          headerRows: 1,
          body: buildTableBody(data, columns, encabezados),
        },
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
          title: `Control de tendidos`,
          author: `Juan Cuesta`,
        },
        background: {
          image: logoBN,
          margin: [50, 250, 50, 50],
          opacity: 0.1
        },
        pageSize: 'A4',
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
            { text: 'CONTROL DE TENDIDOS', width: 'auto', style: 'header', margin: [250, 20] },
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
                x2: 680, y2: 5,
                lineWidth: .5,
              },
            ], margin: [40, 0, 0, 40]
          },
          {
            columns: [
              {
                width: '*',
                text: [
                  { text: 'Nombre del proyecto: ', style: 'defaultStyle' },
                  { text: `Circular Palmales`, style: 'resultStyle', }
                ]
              },
              {
                width: '*',
                text: [
                  { text: 'Código de bobina: ', style: 'defaultStyle' },
                  { text: `B45455`, style: 'resultStyle', }
                ]
              },
              {
                width: '*',
                text: [
                  { text: 'Cantidad de hilos: ', style: 'defaultStyle' },
                  { text: `48`, style: 'resultStyle', }
                ]
              },
            ],

          },
          {
            columns: [
              {
                width: '*',
                text: [
                  { text: 'Enlace: ', style: 'defaultStyle' },
                  { text: `FTTH Cuenca`, style: 'resultStyle', }
                ]
              },
              {
                width: '*',
                text: [
                  { text: 'Número de MT inicial: ', style: 'defaultStyle' },
                  { text: `5441`, style: 'resultStyle', }
                ]
              },
              {
                width: '*',
                text: [
                  { text: 'Responsable: ', style: 'defaultStyle' },
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
                  { text: 'Fecha de instalación: ', style: 'defaultStyle' },
                  { text: `27/05/2022`, style: 'resultStyle', }
                ]
              },
              {
                width: '*',
                text: [
                  { text: 'Número de MT final: ', style: 'defaultStyle' },
                  { text: `1400`, style: 'resultStyle', }
                ]
              },
              {
                width: '*',
                text: [
                  { text: '', style: 'defaultStyle' },
                  { text: ``, style: 'resultStyle', }
                ]
              },
            ],
          },
          {
            columns: [
              {
                width: '*',
                text: [
                  { text: 'Cantidad de FO instalada: ', style: 'defaultStyle' },
                  { text: `2403`, style: 'resultStyle', }
                ]
              },
              {
                width: '*',
                text: [
                  { text: 'Tarea N°: ', style: 'defaultStyle' },
                  { text: `565545`, style: 'resultStyle', }
                ]
              },
              {
                width: '*',
                text: [
                  { text: '', style: 'defaultStyle' },
                  { text: ``, style: 'resultStyle', }
                ]
              },
            ],
          },
          { text: '\n' },

          table(listadoRegistrosTendidos.value,
            ['numero_elemento', 'tipo_elemento', 'propietario_elemento', 'progresiva_entrada', 'progresiva_salida', 'cantidad_reserva'],
            ['Número', 'Tipo de elemento', 'Propietario', 'Progresiva entrada', 'Progresiva salida', 'Reserva']
          ),

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

    function obtenerElemento(id: number) {
      return listadosAuxiliares.bobinas.find((item: any) => item.id === id)
    }

    watch(computed(() => progresiva.bobina), () => {
      progresiva.cantidad_hilos = obtenerElemento(progresiva.bobina).cantidad_hilos
    })

    return {
      v$,
      mixin,
      mixinRegistroTendido,
      listadosAuxiliares,
      guardar,
      progresiva,
      // mixin 2
      listadoRegistrosTendidos,
      configuracionColumnasControlTendido,
      setBase64,
      modales,
      agregarProgresiva,
      consultarRegistro,
      editarRegistro,
      accionesTabla,
      pdfMakeImprimir,
      obtenerElemento,
      // listados
      tiposElementos,
      propietariosElementos,
      estadoElementos,
      sistemasCoordenadas,
      bobinasSolicitadas,
    }
  },
})
