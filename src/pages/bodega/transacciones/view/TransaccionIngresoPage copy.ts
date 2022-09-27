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
import { TipoTransaccionController } from 'pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController'
import { SubtipoTransaccionController } from 'pages/administracion/subtipos_transacciones/infraestructure/SubtipoTransaccionController'
import { TransaccionListados } from '../domain/TransaccionListados'
import { propietariosElementos } from 'config/utils'

export default defineComponent({
    components:{TabLayout},
    /* props: {
        tipo: {type:String, required:true}
    }, */
    setup(){
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionController())
        const {entidad: transaccion, disabled, accion, listadosAuxiliares}=mixin.useReferencias()
        const {setValidador, obtenerListados, cargarVista, listar}=mixin.useComportamiento()

        cargarVista(()=>{
            obtenerListados({
                sucursales: new SucursalController(),
                tipos:  {
                    controller:new TipoTransaccionController(),
                    //params: { tipo:props.tipo}
                    params: { tipo:'INGRESO'}
                },
                subtipos: new SubtipoTransaccionController(),
            })
        })

        listar({
            tipo:'INGRESO'
        })

        //Reglas de validacion
        const reglas={
            justificacion:{required},
            sucursal:{required},
            subtipo:{required},
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, transaccion)
        setValidador(v$.value)

        //Configurar los listados
        const opciones_sucursales = listadosAuxiliares.sucursales
        opciones_sucursales.sucursales = listadosAuxiliares.sucursales
        const opciones_tipos = listadosAuxiliares.tipos
        const opciones_subtipos = listadosAuxiliares.subtipos

        const fecha =new Date()
        transaccion.created_at = new Intl.DateTimeFormat('az',{
            year:'numeric',
            month:'2-digit',
            day:'2-digit'
        }).format(fecha)

        return {
            mixin, transaccion, disabled, accion, v$,
            configuracionColumnas:configuracionColumnasTransacciones,
            opciones_sucursales,
            opciones_tipos,
            opciones_subtipos,
        }
    }
})