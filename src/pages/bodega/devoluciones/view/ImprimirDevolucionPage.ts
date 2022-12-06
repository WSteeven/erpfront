//dependencias
import { configuracionColumnasProductosSeleccionados } from '../domain/configuracionColumnasProductosSeleccionados'

import { defineComponent, ref } from 'vue';
import html2pdf from 'html2pdf.js'

//componentes
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin';
import { Devolucion } from '../domain/Devolucion';
import { DevolucionController } from '../infraestructure/DevolucionController';
import { useDevolucionStore } from 'stores/devolucion';
import { useAuthenticationStore } from 'stores/authentication';

//pdf
import { jsPDFAPI } from 'jspdf';
import { jsPDF } from 'jspdf';
//pdfmake
import * as pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'


(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs


export default defineComponent({
    components: {},
    setup() {
        const mixin = new ContenedorSimpleMixin(Devolucion, new DevolucionController())
        const { cargarVista } = mixin.useComportamiento()
        // const {entidad: devolucion}=mixin.useReferencias()

        const refPDF = ref()

        //Stores
        const devolucionStore = useDevolucionStore()
        const store = useAuthenticationStore()

        cargarVista(async () => {
            await devolucionStore.showPreview()
            console.log(devolucionStore.devolucion)
        })

        function pdfMakeImprimir() {
            var docDefinition = {
                watermark: { text: 'BODEGA JPCONSTRUCRED', opacity: 0.1, bold: true, italics: false },
                pageSize: 'A5',
                pageOrientation: 'landscape',
                pageMargins: [10, 10, 10, 10],
                header: 'Sistema de bodega',
                footer: {
                    columns: [
                        'Left part',
                        { text: 'Right part', alignment: 'right' }
                    ]
                },

                content: [
                    { text: 'COMPROBANTE DE DEVOLUCIÓN', style: 'header' },
                    { text: '', style: 'hr' },
                    { text: `Transaccion N° ${devolucionStore.devolucion.id}`, style: 'resultStyle', }, { text: 'otro texto' },
                    'Some long text of variable length ...',
                    { text: '2 Headline', headlineLevel: 1 },
                    'Some long text of variable length ...',
                    { text: '3 Headline', headlineLevel: 1 },
                    'Some long text of variable length ...',
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

            var dd = {
                header: 'simple text',
              
                footer: {
                  columns: [
                    'Left part',
                    { text: 'Right part', alignment: 'right' }
                  ]
                },
              
                content: [
                    { text: 'COMPROBANTE DE DEVOLUCIÓN', style: 'header' },
                    { text: '', style: 'hr' },
                    { text: `Transaccion N° ${devolucionStore.devolucion.id}`, style: 'resultStyle', }, { text: 'otro texto' },
                    'Some long text of variable length ...',
                    { text: '2 Headline', headlineLevel: 1 },
                    'Some long text of variable length ...',
                    { text: '3 Headline', headlineLevel: 1 },
                    'Some long text of variable length ...',
                ]
              };

            pdfMake.createPdf(dd).open()
        }

        function imprimir2() {
            // var doc = new jsPDF()
            var doc = new jsPDF({
                orientation: 'landscape',
                unit: 'in',
                format: 'a5'
            });
            // const contenido = refPDF.value
            const contenido = document.getElementById('imprimase')
            console.log(contenido)

            doc.html(contenido!, {
                callback: function (doc) {

                    doc.save();
                },
                margin: 0.3,
                image: {
                    type: 'jpeg',
                    quality: 0.98,
                },
                html2canvas: {
                    scale: 3,
                    letterRendering: true,
                },
                /* fontFaces:[
                    family:'arial',
                ], */
                x: 10,
                y: 10
            });
            // doc.save('ejemplo.pdf')
        }

        function imprimir() {
            const contenido = refPDF.value
            html2pdf()
                .set({
                    margin: 0.3,
                    filename: 'devolucion.pdf',
                    image: {
                        type: 'jpeg',
                        quality: 0.98,
                    },
                    html2canvas: {
                        scale: 4,
                        letterRendering: true,
                    },
                    jsPDF: {
                        unit: 'in',
                        format: 'a5',
                        orientation: 'landscape',
                    },

                })
                .from(contenido)
                .save()
                .catch((err) => console.log(err))
        }

        const hoy = new Date()
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
        return {
            devolucion: devolucionStore.devolucion,
            configuracionColumnasProductosSeleccionados,
            // devolucionStore,
            store,
            imprimir,
            imprimir2,
            refPDF,
            pdfMakeImprimir,

            hoy,
            meses,
        }
    }
})
