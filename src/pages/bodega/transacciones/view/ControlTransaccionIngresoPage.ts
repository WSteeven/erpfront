//Dependencias
import { configuracionColumnasTransaccionIngreso } from "../domain/configuracionColumnasTransaccionIngreso";
import {computed, defineComponent, ref} from 'vue'

//Componentes
import TransaccionIngresoContent from "../modules/transaccionIngreso/view/TransaccionIngresoContent.vue";
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
import TransaccionIngresoInventarioContent from "../modules/transaccionIngresoInventario/view/TransaccionIngresoInventarioContent.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
// import { TransaccionController } from "../infraestructure/TransaccionController";
import { Transaccion } from "../domain/Transaccion";
import { TransaccionIngresoController } from "../infraestructure/TransaccionIngresoController";
// import { useTransaccionStore } from "stores/transaccion";
// import { useTransaccionIngresoStore } from "stores/transaccionIngreso";

export default defineComponent({
    name:'TransaccionIngresoPage',
    components:{TabLayout, TransaccionIngresoContent, TransaccionIngresoInventarioContent},
    setup(){
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionIngresoController())
        const {entidad: transaccion, disabled, accion}=mixin.useReferencias()
        // const {onConsultado, onGuardado}=mixin.useHooks()

        const step=ref(1)

        // const transaccionStore = useTransaccionStore()
        // const transacionIngresoStore = useTransaccionIngresoStore()

        /* onGuardado(()=>{
            console.log('Entró en el hook de controlTransaccionIngreso')
            transacionIngresoStore.transaccion = transaccion
            transacionIngresoStore.accionTransaccion=accion
        }) */
        
        return{
            mixin, //disabled, accion, transaccion, configuracionColumnas: configuracionColumnasTransaccionIngreso,
            transaccion,
            configuracionColumnas:configuracionColumnasTransaccionIngreso,
            step,
            
            tabSeleccionado: ref('transaccion'),
            // transaccionSeleccionada: computed(()=>transaccion.id)
        }

    }
})