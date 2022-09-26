//Dependencias
import { configuracionColumnasEstadosTransaccion } from "../domain/configuracionColumnasEstadosTransaccion";
import { required } from "@vuelidate/validators";
import {useVuelidate} from '@vuelidate/core';
import { defineComponent } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { EstadosTransaccionController } from "../infraestructure/EstadosTransaccionController";
import { EstadosTransaccion } from "../domain/EstadosTransaccion";

export default defineComponent({
    components: {TabLayout},
    setup(){
        const mixin = new ContenedorSimpleMixin(EstadosTransaccion, new EstadosTransaccionController())
        const {entidad: estados, disabled}=mixin.useReferencias()
        const {setValidador}=mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre: {required}
        }

        const v$ = useVuelidate(reglas, estados)
        setValidador(v$.value)

        return{
            mixin, estados, v$, disabled,
            configuracionColumnas: configuracionColumnasEstadosTransaccion
        }
    }
})
