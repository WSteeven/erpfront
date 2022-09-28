//Dependencias
import { configuracionColumnasTransacciones } from '../../../domain/configuracionColumnasTransaccion'
import { required, requiredIf } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'

// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { TransaccionController } from '../../../infraestructure/TransaccionController'
import { Transaccion } from '../../../domain/Transaccion'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
//Controladores para los listados
import { SucursalController } from 'pages/administracion/sucursales/infraestructure/SucursalController'
import { TipoTransaccionController } from 'pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController'
import { SubtipoTransaccionController } from 'pages/administracion/subtipos_transacciones/infraestructure/SubtipoTransaccionController'
import { AutorizacionController } from 'pages/administracion/autorizaciones/infraestructure/AutorizacionController'
import { EstadosTransaccionController } from 'pages/administracion/estados_transacciones/infraestructure/EstadosTransaccionController'

export default defineComponent({
    components:{TabLayout},
    props: {
        tipo: {type:String, required:true}
    },
    setup(props){
        const mixin = new ContenedorSimpleMixin(Transaccion, new TransaccionController())
        const {entidad: transaccion, disabled, accion, listadosAuxiliares}=mixin.useReferencias()
        const {setValidador, obtenerListados, cargarVista}=mixin.useComportamiento()

        // const store = useAuthenticationStore()

        cargarVista(async()=>{
            await obtenerListados({
                sucursales: new SucursalController(),
                tipos:  {
                    controller:new TipoTransaccionController(),
                    params: { tipo:props.tipo}
                    // params: { tipo:'INGRESO'}
                },
                subtipos: new SubtipoTransaccionController(),
                autorizaciones: new AutorizacionController(),
                estados: new EstadosTransaccionController(),
            })
            //carga de valores iniciales
            transaccion.autorizacion = listadosAuxiliares.autorizaciones[0]['id']
            transaccion.estado = listadosAuxiliares.estados[0]['id']

            
        })

        //Reglas de validacion
        const reglas={
            justificacion:{required},
            sucursal:{required},
            subtipo:{required},
            lugar_destino:{required},
            autorizacion:{required},
            estado:{required},
            observacion_aut:{
                requiredIfObsAutorizacion: requiredIf(function(){
                    return transaccion.tiene_obs_autorizacion?true:false
                })
            },
            observacion_est:{
                requiredIfObsEstado: requiredIf(function(){
                    return transaccion.tiene_obs_estado?true:false
                })
            },
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, transaccion)
        setValidador(v$.value)

        //Configurar los listados
        const opciones_sucursales = listadosAuxiliares.sucursales
        opciones_sucursales.sucursales = listadosAuxiliares.sucursales
        const opciones_tipos = listadosAuxiliares.tipos
        const opciones_subtipos = listadosAuxiliares.subtipos
        opciones_subtipos.subtipos = listadosAuxiliares.subtipos
        const opciones_autorizaciones = listadosAuxiliares.autorizaciones
        const opciones_estados = listadosAuxiliares.estados

        

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
            opciones_autorizaciones,
            opciones_estados,

            //filtros
            filtroTipos(val){
                opciones_subtipos.subtipos = listadosAuxiliares.subtipos.filter((v)=>v.tipo_transaccion.indexOf(val)>-1)
                transaccion.subtipo=''
                console.log('listado filtrado', opciones_subtipos.subtipos)
                if(opciones_subtipos.subtipos.length<1){
                    transaccion.subtipo=''
                }
                if(opciones_subtipos.subtipos.length==1){
                    transaccion.subtipo=opciones_subtipos.subtipos[0]['id']
                }
            },
            //usuario autenticado
            // store,

        }
    }
})