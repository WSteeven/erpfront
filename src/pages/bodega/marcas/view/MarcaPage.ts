// Dependencias
import { configuracionColumnasMarcas } from "../domain/configuracionColumnasMarcas";
import { required } from "@vuelidate/validators";
import {useVuelidate} from '@vuelidate/core';
import { defineComponent } from "vue";

// Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { MarcaController } from "../infraestructure/MarcaController";
import { Marca } from "../domain/Marca";

export default defineComponent({
    components: {TabLayout},
    setup(){
        const mixin = new ContenedorSimpleMixin(Marca, new MarcaController())
        const {entidad: marca, disabled} = mixin.useReferencias()
        const {setValidador} = mixin.useComportamiento()
        
        //Reglas de validacion
        const reglas = {
            nombre: {required}
        }

        const v$ = useVuelidate(reglas, marca)
        setValidador(v$.value)

        return {
            mixin, 
            marca, 
            v$, 
            disabled, 
            configuracionColumnas: configuracionColumnasMarcas,
        }
    }
})