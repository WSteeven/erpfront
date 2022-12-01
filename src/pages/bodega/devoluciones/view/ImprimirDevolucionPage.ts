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


        function imprimir2() {
            // var doc = new jsPDF()
            var doc = new jsPDF({
                orientation:'landscape',
                unit:'in',
                format:'a5'
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
                        scale: 3,
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

            hoy,
            meses,
        }
    }
})
