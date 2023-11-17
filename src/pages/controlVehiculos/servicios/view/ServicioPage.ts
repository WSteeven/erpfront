//Dependencias
import { configuracionColumnasServicios } from "../domain/configuracionColumnasServicios";
import { defineComponent, reactive, ref } from "vue";
import { required, minValue, maxValue } from "shared/i18n-validators";

//Componentes
import TabLayoutFilterTabs2 from "shared/contenedor/modules/simple/view/TabLayoutFilterTabs2.vue"

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Servicio } from "../domain/Servicio";
import { ServicioController } from "../infraestructure/ServicioController";
import useVuelidate from "@vuelidate/core";
import { tabOptionsSeguros, tabOptionsServicios, tiposServicios } from "config/vehiculos.utils";

export default defineComponent({
    components: { TabLayoutFilterTabs2 },
    setup() {
        const mixin = new ContenedorSimpleMixin(Servicio, new ServicioController())
        const { entidad: servicio, disabled, listadosAuxiliares, accion } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista, listar } = mixin.useComportamiento()
        const { onReestablecer, onGuardado, onConsultado, onModificado } = mixin.useHooks()

        /*****************************
         * VALIDACIONES
         ****************************/
        const reglas = {
            nombre: { required },
            tipo: { required },
        }
        const v$ = useVuelidate(reglas, servicio)
        setValidador(v$.value)

        /*********************************
         * Funciones
        *********************************/
        async function filtrarServicios(tab: string) {
            switch (tab) {
                case 'PREVENTIVO':
                    listar({
                        'tipo': tab,
                    })
                    break
                case 'CORRECTIVO':
                    listar({
                        'tipo': tab,
                    })
                    break
                default:
                    listar()
            }
        }

        return {
            mixin, servicio, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasServicios,
            //listados
            tiposServicios,

            //tabs
            tabOptionsServicios,


            //functiones
            filtrarServicios,
        }
    }
})