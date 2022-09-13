// Dependencias
import { configuracionColumnasAutorizaciones } from "../domain/configuracionColumnasAutorizaciones";
import { required } from "@vuelidate/validators";
import {useVuelidate} from '@vuelidate/core';
import { defineComponent } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { AutorizacionController } from "../infraestructure/AutorizacionController";
import { Autorizacion } from "../domain/Autorizacion";

export default defineComponent({
    components: {TabLayout},
    setup(){
        const mixin = new ContenedorSimpleMixin(Autorizacion, new AutorizacionController())
        const {entidad: autorizacion, disabled} = mixin.useReferencias()
        const {setValidador, listar}=mixin.useComportamiento()

        listar();
        //Reglas de validacion
        const reglas = {
            nombre: {required}
        }

        const v$ = useVuelidate(reglas, autorizacion)
        setValidador(v$.value)

        return{
            mixin, autorizacion, v$, disabled,
            configuracionColumnas: configuracionColumnasAutorizaciones,
        }
    }
})