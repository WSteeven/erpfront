//Dependencias
import { configuracionColumnasTiposTransacciones } from "../domain/configuracionColumnasTiposTransacciones";
import { required } from "@vuelidate/validators";
import {useVuelidate} from '@vuelidate/core'
import { defineComponent } from "vue";

//Componentes 
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { TipoTransaccionController } from "../infraestructure/TipoTransaccionController";
import { TipoTransaccion } from "../domain/TipoTransaccion";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";

export default defineComponent({
    components: {TabLayout},
    setup(){
        const mixin = new ContenedorSimpleMixin(TipoTransaccion, new TipoTransaccionController())
        const { entidad: tipo_transaccion, disabled, accion} = mixin.useReferencias()
        const {setValidador} = mixin.useComportamiento()

        //Reglas de validacion
        const reglas = {
            nombre:{required},
            // tipo:{required},
        }

        useNotificacionStore().setQuasar(useQuasar())
        
        const v$ = useVuelidate(reglas, tipo_transaccion)
        setValidador(v$.value)

        // const tipos = ['INGRESO', 'EGRESO']

        return {
            mixin, tipo_transaccion, disabled, accion, v$, 
            configuracionColumnas: configuracionColumnasTiposTransacciones,
            // tipos,
        }
    }
})