//Dependencias
import { configuracionColumnasSubtiposTransacciones } from "../domain/configuracionColumnasSubtiposTransacciones";
import { required } from "@vuelidate/validators";
import {useVuelidate} from '@vuelidate/core'
import { defineComponent, ref } from "vue";

//Componentes
import TabLayout from "shared/contenedor/modules/simple/view/TabLayout.vue";

//Logica y controladores
import { ContenedorSimpleMixin } from "shared/contenedor/modules/simple/application/ContenedorSimpleMixin";
import { SubtipoTransaccionController } from "../infraestructure/SubtipoTransaccionController";
import { SubtipoTransaccion } from "../domain/SubtipoTransaccion";
import { useNotificacionStore } from "stores/notificacion";
import { useQuasar } from "quasar";
import { TipoTransaccionController } from "pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController";

export default defineComponent({
    components:{TabLayout},
    setup(){
        const mixin = new ContenedorSimpleMixin(SubtipoTransaccion, new SubtipoTransaccionController())
        const {entidad: subtipo_transaccion, disabled, accion, listadosAuxiliares}=mixin.useReferencias()
        const {setValidador, obtenerListados, cargarVista} = mixin.useComportamiento()

        //obtener el listado de todos los subtipos
        cargarVista(()=>{
            obtenerListados({
                tipos: new TipoTransaccionController()
            })
        })
        //Reglas de validacion
        const reglas ={
            nombre: {required},
            tipo_transaccion: {required}
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, subtipo_transaccion)
        setValidador(v$.value)

        //configurar el listado
        const opciones = listadosAuxiliares.tipos
        const tipos_contables = ['INGRESO', 'EGRESO']

        return {
            mixin, subtipo_transaccion, disabled, accion, v$,
            configuracionColumnas:configuracionColumnasSubtiposTransacciones,
            //listado
            opciones,
            tipos_contables,

            filtro(val){
                opciones.tipos = listadosAuxiliares.tipos.filter((v)=>v.tipo.indexOf(val)>-1)    
                console.log('El val es: ', val)
            },
        }
    }
})