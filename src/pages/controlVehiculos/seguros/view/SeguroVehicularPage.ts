//Dependencias
import { configuracionColumnasSegurosVehiculares } from "../domain/configuracionColumnasSegurosVehiculares";
import { defineComponent, reactive, ref } from "vue";
import { required, minValue, maxValue } from "shared/i18n-validators";

//Componentes
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { SeguroVehicular } from "../domain/SeguroVehicular";
import { SeguroVehicularController } from "../infraestructure/SeguroVehicularController";
import useVuelidate from "@vuelidate/core";
import { tabOptionsSeguros } from "config/utils_vehiculos";
import { date } from "quasar";
import { obtenerFechaActual, sumarFechas } from "shared/utils";
import { maskFecha } from "config/utils";

//Logica y controladores

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
                case '1':
                    listar({
                        // estado: 1,
                        'fecha_caducidad[operator]': '>',
                        'fecha_caducidad[value]': sumarFechas(obtenerFechaActual(), 0, 0, 0, 'YYYY-MM-DD'),
                    })
                    break
                case '2':
                    listar({
                        // estado: 0,
                        'fecha_caducidad[operator]': '<',
                        'fecha_caducidad[value]': sumarFechas(obtenerFechaActual(), 0, 0, 0, 'YYYY-MM-DD'),
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