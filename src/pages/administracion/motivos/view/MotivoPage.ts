//Dependencias
import { configuracionColumnasMotivos } from '../domain/configuracionColumnasMotivos'
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent, ref } from 'vue'

//Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'

//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { MotivoController } from '../infraestructure/MotivoController'
import { Motivo } from '../domain/Motivo'
import { useNotificacionStore } from 'stores/notificacion'
import { useQuasar } from 'quasar'
import { TipoTransaccionController } from 'pages/administracion/tipos_transacciones/infraestructure/TipoTransaccionController'

export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(Motivo, new MotivoController())
        const { entidad: motivo, disabled, accion, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, obtenerListados, cargarVista } = mixin.useComportamiento()

        const tipos = ref([])
        //obtener el listado de todos los subtipos
        cargarVista(() => {
            obtenerListados({
                tipos: new TipoTransaccionController()
            })
        })
        //Reglas de validacion
        const reglas = {
            nombre: { required },
            tipo_transaccion: { required }
        }

        useNotificacionStore().setQuasar(useQuasar())

        const v$ = useVuelidate(reglas, motivo)
        setValidador(v$.value)

        //configurar el listado
        tipos.value = listadosAuxiliares.tipos

        return {
            mixin, motivo, disabled, accion, v$,
            configuracionColumnas: configuracionColumnasMotivos,
            //listado
            tipos,

            filtro(val) {
                tipos.value = listadosAuxiliares.tipos.filter((v) => v.tipo.indexOf(val) > -1)
                console.log('El val es: ', val)
            },
        }
    }
})