//Dependencias
import { configuracionColumnasTransaccionIngreso } from "../domain/configuracionColumnasTransaccionIngreso";
import {computed, defineComponent, ref} from 'vue'

//Componentes
import TransaccionIngresoContent from "../modules/transaccionIngreso/view/TransaccionIngresoContent.vue";
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { TransaccionController } from "../infraestructure/TransaccionController";
import { Transaccion } from "../domain/Transaccion";
import { TransaccionIngresoController } from "../infraestructure/TransaccionIngresoController";
import { useTransaccionStore } from "stores/transaccion";

export default defineComponent({
    name:'TransaccionIngresoPage',
    components:{TabLayout, TransaccionIngresoContent},
    setup(){
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionIngresoController())
        const {entidad: transaccion, disabled, accion}=mixin.useReferencias()
        const {onConsultado, onGuardado}=mixin.useHooks()

        const step=ref(1)

        const transaccionStore = useTransaccionStore()
        
        return{
            mixin, disabled, accion, transaccion, configuracionColumnas: configuracionColumnasTransaccionIngreso,
            step,
            done1:ref(false),
            done2:ref(false),
            done3:ref(false),
            done4:ref(false),
            tabSeleccionado: ref('transaccion'),
            transaccionSeleccionada: computed(()=>transaccionStore.transaccion.id)
        }

    }
})