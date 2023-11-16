// Dependencies
import { defineComponent, reactive, ref } from "vue";
import { required, requiredIf } from "shared/i18n-validators";

//Components
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue";


// Logica y Controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Matricula } from "../domain/Matricula";
import { MatricularController } from "../infraestructure/MatriculaController";
import { useNotificaciones } from "shared/notificaciones";
import { VehiculoController } from "pages/controlVehiculos/vehiculos/infraestructure/VehiculoController";
import { useFiltrosListadosSelects } from "shared/filtrosListadosGenerales";
import { configuracionColumnasMatriculas } from "../domain/configuracionColumnasMatriculas";
import useVuelidate from "@vuelidate/core";
import { tabOptionsMatriculas } from "config/utils_vehiculos";

export default defineComponent({
    components: { TabLayoutFilterTabs2 },
    setup() {
        const mixin = new ContenedorSimpleMixin(Matricula, new MatricularController())
        const { entidad: matricula, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
        const { onReestablecer, onGuardado, onConsultado, onModificado } = mixin.useHooks()
        const { confirmar, prompt, notificarCorrecto, notificarError } = useNotificaciones()
        
        const is_month = ref(false)

        cargarVista(async () => {
            await obtenerListados({
                vehiculos: {
                    controller: new VehiculoController(),
                    params: { campos: 'id,placa,marca,modelo' }
                }
            })
        })

        /**************************************************************
         * Validaciones
         **************************************************************/
        const reglas = {
            vehiculo: { required },
            fecha_matricula: { required },
            proxima_matricula: { requiredIf: requiredIf(matricula.fecha_matricula!) },
            matriculador: { requiredIf: requiredIf(matricula.fecha_matricula!) },
        }
        const v$ = useVuelidate(reglas, matricula)
        setValidador(v$.value)

        /*********************************
         * Funciones
        *********************************/
        async function filtrarMatriculas(tab: string) {
            switch (tab) {
                case '1':
                    listar()
                    // listar({
                    //     'fin_vigencia[operator]': '>',
                    //     'fin_vigencia[value]': sumarFechas(obtenerFechaActual(), 0, 3, 0, 'YYYY-MM-DD'),
                    // })
                    break
                case '2':
                    listar()
                    // listar({
                    //     'fin_vigencia[operator]': '<=',
                    //     'fin_vigencia[value]': sumarFechas(obtenerFechaActual(), 0, 3, 0, 'YYYY-MM-DD'),
                    // })
                    break
                default:
                    listar()
            }
        }
        /**Verifica si es un mes */
        function checkValue(val, reason, details) {
            is_month.value = reason === 'month' ? false : true
        }


        /********************************
         * LISTADOS Y FILTROS
         ********************************/
        const {
            vehiculos, filtrarVehiculos,
        } = useFiltrosListadosSelects(listadosAuxiliares)
        vehiculos.value = listadosAuxiliares.vehiculos

        return {
            mixin, v$, matricula, disabled, accion,
            configuracionColumnas: configuracionColumnasMatriculas,
            maskFecha: 'MM-YYYY',
            
            //tab
            tabOptionsMatriculas,
            
            //listados
            vehiculos, filtrarVehiculos,
            
            //funciones
            filtrarMatriculas,
            checkValue,
            
        }



    }
})