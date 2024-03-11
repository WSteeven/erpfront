//Dependencias
import { configuracionColumnasSegurosVehiculares } from "../domain/configuracionColumnasSegurosVehiculares";
import { required } from "shared/i18n-validators";
import { defineComponent } from "vue";
import useVuelidate from "@vuelidate/core";

//Componentes
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { SeguroVehicular } from "../domain/SeguroVehicular";
import { SeguroVehicularController } from "../infraestructure/SeguroVehicularController";
import { tabOptionsSeguros } from "config/vehiculos.utils";
import { obtenerFechaActual, sumarFechas } from "shared/utils";
import { maskFecha } from "config/utils";

export default defineComponent({
    components: { TabLayoutFilterTabs2 },
    setup() {
        const mixin = new ContenedorSimpleMixin(SeguroVehicular, new SeguroVehicularController())
        const { entidad: seguro, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
        const { onReestablecer, onGuardado, onConsultado, onModificado } = mixin.useHooks()

        /*****************************
         * VALIDACIONES
         ****************************/
        const reglas = {
            nombre: { required },
            num_poliza: { required },
            fecha_caducidad: { required },
        }
        const v$ = useVuelidate(reglas, seguro)
        setValidador(v$.value)

        /*********************************
         * Funciones
        *********************************/
        async function filtrarSeguros(tab: string) {
            switch (tab) {
                case '1': //vigentes
                    listar({
                        // estado: 1,
                        'fecha_caducidad[operator]': '>=',
                        'fecha_caducidad[value]': sumarFechas(obtenerFechaActual(), 0, 0, 15, maskFecha),
                    })
                    break
                case '2': //15 días antes de caducar
                    listar({
                        // estado: 0,
                        'fecha_caducidad[start]': obtenerFechaActual(maskFecha),
                        'fecha_caducidad[end]': sumarFechas(obtenerFechaActual(), 0, 0, 15,maskFecha),
                    })
                    break
                case '3': //caducados
                    listar({
                        // estado: 0,
                        'fecha_caducidad[operator]': '<',
                        'fecha_caducidad[value]': obtenerFechaActual(maskFecha),
                    })
                    break
                default:
                    listar()
            }
        }

        return {
            mixin, seguro, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasSegurosVehiculares,
            maskFecha,

            //tabs
            tabOptionsSeguros,


            //functiones
            filtrarSeguros,

        }
    }
})