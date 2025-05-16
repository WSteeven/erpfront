//Dependencias
import { configuracionColumnasAjustesSaldos } from '../domain/configuracionColumnasAjustesSaldos';
import { required } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { defineComponent } from 'vue'


// Componentes
import TabLayout from 'shared/contenedor/modules/simple/view/TabLayout.vue'


//Logica y controladores
import { ContenedorSimpleMixin } from 'shared/contenedor/modules/simple/application/ContenedorSimpleMixin'
import { AjusteSaldo } from '../domain/AjusteSaldo';
import { AjusteSaldoController } from '../infraestructure/AjusteSaldoController';
import { EmpleadoController } from 'pages/recursosHumanos/empleados/infraestructure/EmpleadoController';
import { useFiltrosListadosSelects } from 'shared/filtrosListadosGenerales';
import { opcionesTiposMovimientos } from 'config/utils';


export default defineComponent({
    components: { TabLayout },
    setup() {
        const mixin = new ContenedorSimpleMixin(AjusteSaldo, new AjusteSaldoController())
        const { entidad: ajuste, disabled, listadosAuxiliares } = mixin.useReferencias()
        const { setValidador, cargarVista, obtenerListados } = mixin.useComportamiento()

        const { empleados, filtrarEmpleados } = useFiltrosListadosSelects(listadosAuxiliares)

        cargarVista(async () => {
            await obtenerListados({
                empleados: new EmpleadoController(),
            })
            empleados.value = listadosAuxiliares.empleados

        })

        //Reglas de validacion
        const reglas = {
            destinatario: { required },
            motivo: { required },
            descripcion: { required },
            monto: { required },
            tipo: { required },
        }
        const v$ = useVuelidate(reglas, ajuste)
        setValidador(v$.value)



        return {
            mixin, ajuste, v$, disabled,
            configuracionColumnas: configuracionColumnasAjustesSaldos,

            empleados, filtrarEmpleados,
            opcionesTiposMovimientos,



        }
    }
})
