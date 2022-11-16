//Dependencias
import { configuracionColumnasTransaccionIngreso } from "../domain/configuracionColumnasTransaccionIngreso";
import {defineComponent, ref} from 'vue'

//Componentes
import TransaccionIngresoContent from "../modules/transaccionIngreso/view/TransaccionIngresoContent.vue";
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";
import TransaccionIngresoInventarioContent from "../modules/transaccionIngresoInventario/view/TransaccionIngresoInventarioContent.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { Transaccion } from "../domain/Transaccion";
import { TransaccionIngresoController } from "../infraestructure/TransaccionIngresoController";


export default defineComponent({
    name:'TransaccionIngresoPage',
    components:{TabLayout, TransaccionIngresoContent, TransaccionIngresoInventarioContent},
    setup(){
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionIngresoController())
        const {entidad: transaccion, disabled, accion}=mixin.useReferencias()

        const step=ref(1)

        
        
        return{
            mixin,
            transaccion,
            configuracionColumnas:configuracionColumnasTransaccionIngreso,
            step,
            
            tabSeleccionado: ref('transaccion'),
        }

    }
})