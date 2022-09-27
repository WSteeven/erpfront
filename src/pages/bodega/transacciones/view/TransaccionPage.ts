//Dependencias

import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionController } from '../infraestructure/TransaccionController'
import { Transaccion } from '../domain/Transaccion'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { configuracionColumnasTransacciones } from '../domain/configuracionColumnasTransaccion'
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'

export default defineComponent({
    components:{TabLayout},
    setup(){
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionController())
        const {entidad: transaccion, disabled, accion, listadosAuxiliares}=mixin.useReferencias()
        const {setValidador, obtenerListados, cargarVista}=mixin.useComportamiento()

        cargarVista(()=>{
            obtenerListados({
                sucursales: new SucursalController(),
            })
        })

        //Reglas de validacion
        const reglas={
            justificacion:{required},
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, transaccion)
        setValidador(v$.value)

        return {
            mixin, transaccion, disabled, accion, v$,
            configuracionColumnas:configuracionColumnasTransacciones
        }
    }
})