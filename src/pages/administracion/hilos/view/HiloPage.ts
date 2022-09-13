//Dependencias
import { configuracionColumnasHilos } from "../domain/configuracionColumnasHilos";
import { required } from "@vuelidate/validators";
import {useVuelidate} from "@vuelidate/core";
import { defineComponent } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { HiloController } from "../infraestructure/HiloController";
import { Hilo } from "../domain/Hilo";

export default defineComponent({
    components: {TabLayout},
    setup(){
        const mixin = new ContenedorSimpleMixin(Hilo, new HiloController())
        const {entidad: hilo, disabled} = mixin.useReferencias()
        const {setValidador, listar} = mixin.useComportamiento()

        listar();
        //Reglas de validacion
        const reglas = {
            nombre: {required}
        }

        const v$ = useVuelidate(reglas, hilo)
        setValidador(v$.value)

        return {
            mixin, hilo, v$, disabled,
            configuracionColumnas: configuracionColumnasHilos,
        }
    }
})