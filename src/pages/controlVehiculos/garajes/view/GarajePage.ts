//Dependencies
import { configuracionColumnasGaraje } from "../domain/configuracionColumnasGaraje";
import { required } from "shared/i18n-validators";
import { removeAccents } from 'shared/utils'
import useVuelidate from "@vuelidate/core";
import { defineComponent } from "vue";

//Components
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { GarajeController } from "../infraestructure/GarajeController";
import { Garaje } from "../domain/Garaje";

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Garaje, new GarajeController())
        const { entidad: garaje, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

        const rules = {
            nombre: { required },
        }
        const v$ = useVuelidate(rules, garaje)
        setValidador(v$.value)


        return {
            v$,
            mixin,
            garaje,
            disabled,
            accion,
            configuracionColumnas: configuracionColumnasGaraje,

            removeAccents,
        }
    }
})